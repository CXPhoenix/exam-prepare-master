import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../types';
import { normalizeString } from '../utils/quizUtils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentAnswer?: UserAnswer;
  onAnswer?: (option: string, reasoning: string) => void;
  showFeedback: boolean;
  isReviewMode?: boolean; // For results page
  showReasoning?: boolean; // Control visibility of reasoning input
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentAnswer,
  onAnswer,
  showFeedback,
  isReviewMode = false,
  showReasoning = true,
}) => {
  const [reasoning, setReasoning] = useState(currentAnswer?.reasoning || '');

  useEffect(() => {
    setReasoning(currentAnswer?.reasoning || '');
  }, [currentAnswer]);

  const handleReasoningChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReasoning(e.target.value);
    // If the user has already selected an option, update the answer object in parent state
    if (currentAnswer && onAnswer) {
      onAnswer(currentAnswer.selectedOption, e.target.value);
    }
  };

  const handleOptionClick = (option: string) => {
    if (showFeedback && !isReviewMode) return; // Prevent changing answer in practice mode after selection
    if (isReviewMode) return; // Read-only in review mode
    if (onAnswer) {
      onAnswer(option, reasoning);
    }
  };

  const getOptionClass = (option: string) => {
    const baseClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-lg relative ";
    const isSelected = currentAnswer?.selectedOption === option;
    const isCorrectOption = normalizeString(option) === normalizeString(question.correct_ans);

    if (showFeedback || isReviewMode) {
      if (isCorrectOption) {
        return baseClass + "border-green-500 bg-green-50 text-green-900 font-medium";
      }
      if (isSelected && !isCorrectOption) {
        return baseClass + "border-red-500 bg-red-50 text-red-900";
      }
      return baseClass + "border-slate-200 text-slate-500 opacity-60";
    }

    if (isSelected) {
      return baseClass + "border-blue-600 bg-blue-50 text-blue-900 shadow-md";
    }

    return baseClass + "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700";
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${isReviewMode ? 'mb-6' : 'h-full flex flex-col'}`}>
      <div className="p-6 md:p-8 flex-grow">
        {/* Question Text */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.desc}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={(showFeedback && !isReviewMode) || isReviewMode}
              className={getOptionClass(option)}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {(showFeedback || isReviewMode) && normalizeString(option) === normalizeString(question.correct_ans) && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {(showFeedback || isReviewMode) && currentAnswer?.selectedOption === option && normalizeString(option) !== normalizeString(question.correct_ans) && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Reasoning / Notes Section */}
        {showReasoning && (
          <div className="mt-4">
            <label className="block text-slate-500 text-sm font-semibold mb-2">
              My Reasoning / Notes:
            </label>
            <textarea
              value={reasoning}
              onChange={handleReasoningChange}
              readOnly={isReviewMode}
              placeholder="Type your logic here to reinforce learning..."
              className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-24 text-slate-700 bg-slate-50"
            />
          </div>
        )}

        {/* Feedback Display (Practice Mode) */}
        {(showFeedback || isReviewMode) && (
          <div className={`mt-6 p-4 rounded-lg border ${
            currentAnswer && normalizeString(currentAnswer.selectedOption) === normalizeString(question.correct_ans)
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className="font-bold mb-1">Correct Answer:</p>
            <p className="text-lg">{question.correct_ans}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
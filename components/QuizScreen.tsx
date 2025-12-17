import React, { useState, useEffect, useRef } from 'react';
import { Question, QuizConfig, UserAnswer } from '../types';
import QuestionCard from './QuestionCard';
import { normalizeString } from '../utils/quizUtils';
import { ArrowLeft, ArrowRight, Flag, AlertTriangle } from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  config: QuizConfig;
  onFinish: (answers: Record<string, UserAnswer>) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, config, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);
  
  // Used to prevent auto-scrolling issues or focus loss
  const topRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];
  
  // Guard against empty questions to prevent crashes
  if (!currentQuestion) {
      return <div className="p-8 text-center text-red-500">Error: No questions loaded.</div>;
  }

  const activeAnswer = answers[currentQuestion.id];

  // In practice mode, we show feedback immediately if they have answered
  const showFeedback = config.mode === 'practice' && !!activeAnswer?.selectedOption;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Reset confirm state when changing questions
    setIsConfirmingSubmit(false);
  }, [currentIndex]);

  const handleAnswer = (option: string, reasoning: string) => {
    const isCorrect = normalizeString(option) === normalizeString(currentQuestion.correct_ans);
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOption: option,
        reasoning: reasoning,
        isCorrect: isCorrect,
        timestamp: Date.now(),
      }
    }));
  };

  const navigate = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Last question: toggle confirm state
        if (!isConfirmingSubmit) {
            setIsConfirmingSubmit(true);
        } else {
            onFinish(answers);
        }
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-20" ref={topRef}>
      {/* Header / Progress */}
      <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 pt-4 pb-4 border-b border-slate-200 mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-slate-500 font-medium">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">{config.mode} mode</span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Main Card */}
      <QuestionCard 
        question={currentQuestion}
        currentAnswer={activeAnswer}
        onAnswer={handleAnswer}
        showFeedback={showFeedback}
        showReasoning={config.mode === 'practice'}
      />

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg-up">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('prev')}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
              currentIndex === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>

          <button
            onClick={() => navigate('next')}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold shadow-md transition-all active:scale-95 ${
                isConfirmingSubmit
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {currentIndex === questions.length - 1 ? (
              isConfirmingSubmit ? (
                  <>Confirm Submit <AlertTriangle className="w-5 h-5" /></>
              ) : (
                  <>Finish Exam <Flag className="w-5 h-5" /></>
              )
            ) : (
              <>Next <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
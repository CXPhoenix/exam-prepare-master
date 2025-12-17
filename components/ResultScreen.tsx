import React from 'react';
import { Question, UserAnswer, ExportData } from '../types';
import { calculateScore } from '../utils/quizUtils';
import QuestionCard from './QuestionCard';
import { Download, AlertCircle, RotateCcw } from 'lucide-react';

interface ResultScreenProps {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ questions, answers, onRestart }) => {
  const stats = calculateScore(questions, answers);
  
  // Categorize questions
  const incorrectQuestions = questions.filter(q => {
    const ans = answers[q.id];
    return !ans || !ans.isCorrect;
  });

  const correctQuestions = questions.filter(q => {
    const ans = answers[q.id];
    return ans && ans.isCorrect;
  });

  const handleExport = () => {
    const incorrectData = incorrectQuestions.map(q => {
      const ans = answers[q.id];
      return {
        question: q.desc,
        user_choice: ans?.selectedOption || "(No Answer)",
        correct_answer: q.correct_ans,
        user_reasoning: ans?.reasoning || ""
      };
    });

    const exportData: ExportData = {
      summary: {
        score: stats.score,
        total: stats.total,
        timestamp: new Date().toISOString()
      },
      weakness_analysis_request: "Please analyze my mistakes and reasoning below to identify my knowledge gaps.",
      incorrect_questions: incorrectData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-analysis-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Score Header */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Results</h2>
        <div className="flex justify-center items-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-blue-600 mb-1">{stats.percentage}%</div>
            <div className="text-slate-500 font-medium">Accuracy</div>
          </div>
          <div className="h-16 w-px bg-slate-200"></div>
          <div className="text-center">
            <div className="text-5xl font-extrabold text-slate-700 mb-1">{stats.score}<span className="text-2xl text-slate-400">/{stats.total}</span></div>
            <div className="text-slate-500 font-medium">Score</div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold transition-colors shadow-md"
          >
            <Download className="w-5 h-5" /> Download for AI Analysis
          </button>
          <button 
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-bold transition-colors"
          >
            <RotateCcw className="w-5 h-5" /> New Exam
          </button>
        </div>
      </div>

      {/* Mistake Review Section */}
      {incorrectQuestions.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <h3 className="text-2xl font-bold">Review Mistakes ({incorrectQuestions.length})</h3>
          </div>
          <div className="space-y-6">
            {incorrectQuestions.map(q => (
              <QuestionCard 
                key={q.id}
                question={q}
                currentAnswer={answers[q.id]}
                showFeedback={true}
                isReviewMode={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Correct Answers Review (Collapsible or just listed below) */}
      {correctQuestions.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-slate-700 mb-6 px-2">Correct Answers ({correctQuestions.length})</h3>
          <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity">
            {correctQuestions.map(q => (
              <QuestionCard 
                key={q.id}
                question={q}
                currentAnswer={answers[q.id]}
                showFeedback={true}
                isReviewMode={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
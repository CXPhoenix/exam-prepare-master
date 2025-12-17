import React, { useState, useEffect } from 'react';
import { RawQuestion, Question, QuizConfig, UserAnswer } from './types';
import { loadQuestions, shuffleArray } from './utils/quizUtils';
import { fetchQuestions } from './questionsDb';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [view, setView] = useState<'start' | 'quiz' | 'result'>('start');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<QuizConfig>({
    questionCount: 10,
    mode: 'practice',
    shuffle: true,
  });

  // Load and Parse Data on Mount
  useEffect(() => {
    const initQuestions = async () => {
      setIsLoading(true);
      const rawData = await fetchQuestions();
      const loaded = loadQuestions(rawData);
      setAllQuestions(loaded);
      setIsLoading(false);
    };

    initQuestions();
  }, []);

  const handleStartQuiz = (newConfig: QuizConfig) => {
    setConfig(newConfig);
    
    let selectedQuestions = [...allQuestions];
    
    if (newConfig.shuffle) {
      for (let i = 0; i < 10; i++) {
        selectedQuestions = shuffleArray(selectedQuestions);
      } 
    }
    
    // Slice based on count (if count is -1, take all)
    if (newConfig.questionCount !== -1) {
      selectedQuestions = selectedQuestions.slice(0, newConfig.questionCount);
    }

    // Process options shuffling if needed
    if (newConfig.shuffle) {
      selectedQuestions = selectedQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    }

    setActiveQuestions(selectedQuestions);
    setUserAnswers({});
    setView('quiz');
  };

  const handleFinishQuiz = (finalAnswers: Record<string, UserAnswer>) => {
    setUserAnswers(finalAnswers);
    setView('result');
  };

  const handleRestart = () => {
    setView('start');
    setUserAnswers({});
    setActiveQuestions([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-600 animate-pulse">Loading Question Database...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      {view === 'start' && (
        <StartScreen 
          onStart={handleStartQuiz} 
          totalQuestionsAvailable={allQuestions.length} 
        />
      )}
      
      {view === 'quiz' && (
        <QuizScreen 
          questions={activeQuestions}
          config={config}
          onFinish={handleFinishQuiz}
        />
      )}

      {view === 'result' && (
        <ResultScreen 
          questions={activeQuestions}
          answers={userAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;
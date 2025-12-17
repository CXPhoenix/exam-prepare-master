import React, { useState } from 'react';
import { QuizConfig, QuizMode } from '../types';
import { Settings, Play, Shuffle } from 'lucide-react';

interface StartScreenProps {
  onStart: (config: QuizConfig) => void;
  totalQuestionsAvailable: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, totalQuestionsAvailable }) => {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [customCount, setCustomCount] = useState<string>('');
  const [mode, setMode] = useState<QuizMode>('practice');
  const [shuffle, setShuffle] = useState<boolean>(true);

  const handlePresetClick = (count: number) => {
    setQuestionCount(count);
    setCustomCount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomCount(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      setQuestionCount(num);
    }
  };

  const handleStart = () => {
    // Calculate final count
    let finalCount = questionCount;
    
    // If user typed a custom number, use it
    if (customCount !== '') {
        const num = parseInt(customCount);
        if (!isNaN(num) && num > 0) {
            finalCount = num;
        }
    }

    // Resolve 'All' (-1) and clamp to available max
    const count = finalCount === -1 
        ? totalQuestionsAvailable 
        : Math.min(finalCount, totalQuestionsAvailable);

    onStart({
      questionCount: count,
      mode,
      shuffle,
    });
  };

  const isPresetSelected = (count: number) => customCount === '' && questionCount === count;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 flex justify-center items-center gap-3">
          <Settings className="w-10 h-10 text-blue-600" />
          Exam Prep Master
        </h1>
        <p className="text-slate-500 text-lg">Configure your practice session to get started.</p>
      </div>

      <div className="space-y-8">
        {/* Question Count Selection */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <label className="block text-slate-700 font-semibold text-lg mb-4">Number of Questions</label>
          <div className="flex flex-wrap gap-3">
            {[10, 20, 50, -1].map((count) => (
              <button
                key={count}
                onClick={() => handlePresetClick(count)}
                className={`flex-1 min-w-[80px] py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isPresetSelected(count)
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-blue-300'
                }`}
              >
                {count === -1 ? 'All' : count}
              </button>
            ))}
             <div className={`flex-[1.5] min-w-[120px] relative rounded-lg transition-all duration-200 ${
                customCount !== '' 
                ? 'ring-2 ring-blue-600 ring-offset-1 bg-white' 
                : 'bg-white border border-slate-200 hover:border-blue-300'
            }`}>
              <input 
                type="number"
                min="1"
                placeholder="Custom #"
                value={customCount}
                onChange={handleCustomChange}
                className="w-full h-full p-3 bg-transparent rounded-lg outline-none text-center text-slate-700 font-medium"
              />
            </div>
          </div>
           {customCount !== '' && parseInt(customCount) > totalQuestionsAvailable && (
             <p className="text-amber-600 text-sm mt-3 flex items-center gap-1">
               <span className="font-bold">Note:</span> We only have {totalQuestionsAvailable} questions available.
             </p>
           )}
        </div>

        {/* Mode Selection */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
          <label className="block text-slate-700 font-semibold text-lg mb-4">Mode</label>
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => setMode('practice')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                mode === 'practice'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-slate-800 text-lg mb-1">Practice Mode</div>
              <div className="text-slate-500 text-sm">Immediate feedback. Ideal for learning.</div>
            </button>
            <button
              onClick={() => setMode('exam')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                mode === 'exam'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="font-bold text-slate-800 text-lg mb-1">Exam Mode</div>
              <div className="text-slate-500 text-sm">Simulate real testing conditions.</div>
            </button>
          </div>
        </div>

        {/* Shuffle Option */}
        <div className="flex items-center justify-between bg-slate-50 p-6 rounded-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <Shuffle className="text-blue-600" />
            <span className="text-slate-700 font-semibold text-lg">Shuffle Questions & Options</span>
          </div>
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
              shuffle ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ${
                shuffle ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleStart}
          disabled={customCount !== '' && (isNaN(parseInt(customCount)) || parseInt(customCount) <= 0)}
          className={`w-full text-white text-xl font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2 ${
            customCount !== '' && (isNaN(parseInt(customCount)) || parseInt(customCount) <= 0)
             ? 'bg-slate-400 cursor-not-allowed'
             : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Play className="w-6 h-6 fill-current" />
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
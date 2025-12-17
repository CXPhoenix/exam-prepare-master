import { Question, RawQuestion, UserAnswer } from '../types';

export const loadQuestions = (rawData: RawQuestion[]): Question[] => {
  return rawData.map((q, index) => ({
    ...q,
    id: `q-${index}`,
  }));
};

// Fisher-Yates Shuffle
export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const normalizeString = (str: string): string => {
  return str.trim();
};

export const calculateScore = (questions: Question[], answers: Record<string, UserAnswer>): {
  score: number;
  total: number;
  correctCount: number;
  percentage: number;
} => {
  const total = questions.length;
  let correctCount = 0;

  questions.forEach(q => {
    const answer = answers[q.id];
    if (answer && answer.isCorrect) {
      correctCount++;
    }
  });

  return {
    score: correctCount,
    total,
    correctCount,
    percentage: total > 0 ? Math.round((correctCount / total) * 100) : 0,
  };
};
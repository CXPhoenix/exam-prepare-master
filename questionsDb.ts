import { RawQuestion } from './types';

export const fetchQuestions = async (): Promise<RawQuestion[]> => {
  try {
    const response = await fetch('/questions-db.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as RawQuestion[];
  } catch (error) {
    console.error("Failed to load questions database:", error);
    return [];
  }
};
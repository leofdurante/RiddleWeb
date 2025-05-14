import axios from 'axios';

const RIDDLE_API_URL = 'https://riddles-api.vercel.app/random';

export interface Riddle {
  id: string;
  riddle: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const puzzleService = {
  async getRandomRiddle(): Promise<Riddle> {
    try {
      const response = await axios.get(RIDDLE_API_URL);
      return {
        id: Math.random().toString(36).substr(2, 9),
        riddle: response.data.riddle,
        answer: response.data.answer,
        difficulty: 'medium', // Default difficulty
        category: 'general'
      };
    } catch (error) {
      console.error('Error fetching riddle:', error);
      throw error;
    }
  },

  // Mock riddles for development/testing
  getMockRiddles(): Riddle[] {
    return [
      {
        id: '1',
        riddle: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?',
        answer: 'A keyboard',
        difficulty: 'easy',
        category: 'wordplay'
      },
      {
        id: '2',
        riddle: 'I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by everyone. What am I?',
        answer: 'Pencil lead',
        difficulty: 'medium',
        category: 'objects'
      }
    ];
  }
}; 
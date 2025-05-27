import axios from 'axios';

export interface Riddle {
  id: string;
  title: string;
  riddle: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const puzzleService = {
  async getRandomRiddle(): Promise<Riddle> {
    // Return a random riddle from our mock collection
    const riddles = this.getMockRiddles();
    return riddles[Math.floor(Math.random() * riddles.length)];
  },

  // Mock riddles for development/testing
  getMockRiddles(): Riddle[] {
    return [
      {
        id: '1',
        title: 'The Silent Typewriter',
        riddle: 'What has keys, but no locks; space, but no room; and you can enter, but not go in?',
        answer: 'A keyboard',
        difficulty: 'easy',
        category: 'wordplay'
      },
      {
        id: '2',
        title: 'The Eternal Prisoner',
        riddle: 'I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by everyone. What am I?',
        answer: 'Pencil lead',
        difficulty: 'medium',
        category: 'objects'
      },
      {
        id: '3',
        title: 'The Paradoxical Drying',
        riddle: 'What gets wetter and wetter the more it dries?',
        answer: 'A towel',
        difficulty: 'easy',
        category: 'wordplay'
      },
      {
        id: '4',
        title: 'The Never-Meeting Ends',
        riddle: 'What has a head and a tail that will never meet?',
        answer: 'A coin',
        difficulty: 'medium',
        category: 'objects'
      },
      {
        id: '5',
        title: 'The Empty World',
        riddle: 'What has cities, but no houses; forests, but no trees; and rivers, but no water?',
        answer: 'A map',
        difficulty: 'hard',
        category: 'wordplay'
      },
      {
        id: '6',
        title: 'The Silent Speaker',
        riddle: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
        answer: 'An echo',
        difficulty: 'medium',
        category: 'nature'
      },
      {
        id: '7',
        title: 'The Endless Path',
        riddle: 'What has a beginning, has no end, but is the beginning of the end?',
        answer: 'The letter "E"',
        difficulty: 'hard',
        category: 'wordplay'
      },
      {
        id: '8',
        title: 'The Invisible Weight',
        riddle: 'The more you take, the more you leave behind. What am I?',
        answer: 'Footsteps',
        difficulty: 'medium',
        category: 'wordplay'
      },
      {
        id: '9',
        title: 'The Colorful Mystery',
        riddle: 'What is black when you buy it, red when you use it, and gray when you throw it away?',
        answer: 'Charcoal',
        difficulty: 'medium',
        category: 'objects'
      },
      {
        id: '10',
        title: 'The Time Traveler',
        riddle: 'What breaks yet never falls, and what falls yet never breaks?',
        answer: 'Day breaks and night falls',
        difficulty: 'hard',
        category: 'wordplay'
      },
      {
        id: '11',
        title: 'The Silent Guardian',
        riddle: 'What has keys that open no locks, space but no room, and you can enter but not go in?',
        answer: 'A keyboard',
        difficulty: 'easy',
        category: 'objects'
      },
      {
        id: '12',
        title: 'The Eternal Light',
        riddle: 'I am not alive, but I grow; I don\'t have lungs, but I need air; I don\'t have a mouth, but I can be killed. What am I?',
        answer: 'Fire',
        difficulty: 'medium',
        category: 'nature'
      }
    ];
  }
}; 
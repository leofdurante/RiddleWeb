// src/services/puzzleService.ts

// Import the database service
import { databaseService } from './databaseService';

// Define the interface for a Riddle object
export interface Riddle {
  id: string;
  title: string;
  riddle: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hints: string[];
  points: number;
  alternativeAnswers?: string[];
  explanation?: string;
}

// Array containing mock riddle data
export const mockRiddles: Riddle[] = [
  {
    id: '1',
    title: 'The Missing Letter',
    riddle: 'An ancient cipher sequence is missing one crucial character. Can you identify which letter is needed to complete the standard English alphabet sequence?',
    answer: 'L',
    difficulty: 'easy',
    category: 'logic',
    hints: [
      'Look at the sequence carefully',
      'Count the letters',
      'The answer is a single letter'
    ],
    points: 10,
    explanation: 'The letter "L" is missing from the sequence. The sequence should be A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z.'
  },
  {
    id: '2',
    title: 'The Silent Word',
    riddle: 'I am a word. Add two letters to me, and I become shorter. What word am I?',
    answer: 'short',
    difficulty: 'medium',
    category: 'wordplay',
    hints: [
      'Think about the word itself',
      'The answer is a word that describes its own property',
      'The word becomes shorter when you add "er" to it'
    ],
    points: 15,
    explanation: 'The word "short" becomes "shorter" when you add "er" to it, making it longer in terms of letters but shorter in terms of meaning.'
  },
  {
    id: '3',
    title: 'Interstellar Pursuit',
    riddle: 'You are commanding a patrol ship in a distant star system with seven interconnected planets. A rogue vessel is hiding on one of them. Your ship can jump to any planet in an hour, but their ship can only move to an adjacent planet in the same time. They will always move if possible. You have 10 hours before the rogue fleet arrives. Find a sequence of planet checks to guarantee you intercept the rogue vessel in 10 jumps or less, regardless of their starting planet.',
    answer: '2, 3, 4, 3, 6, 2, 3, 4, 3, 6',
    difficulty: 'hard',
    category: 'logic',
    hints: [
      'Try simplifying the problem to a smaller number of planets.',
      'Consider the planet that is adjacent to all others.',
      'Think about how the rebels\' location alternates between odd and even numbered planets each hour.',
    ],
    points: 25,
    explanation: 'The rebels alternate between odd and even numbered planets each hour. By searching the sequence 2, 3, 4, 3, 6 for the first five hours, you can guarantee they are on an even planet if they weren\'t caught. Repeating the same sequence for the next five hours will then guarantee capture within 10 warps.',
  },
  {
    id: '4',
    title: 'The Pirate\'s Booty',
    riddle: 'Captain Redbeard and his four most trusted crew members have just unearthed a treasure chest containing 100 gold coins. According to the Pirate Code, the captain proposes a way to share the gold. All five pirates vote. If the proposal passes (or is a tie), the gold is divided. If the majority votes against it, the captain is thrown overboard, and the next in rank becomes captain. Pirates value their lives and gold, but will vote against the captain if their gold amount is the same either way, just for sport. They are all exceptionally logical. As Captain Redbeard, what distribution should you propose to ensure your survival?',
    answer: '98:0:1:0:1', // Amaro:Bart:Charlotte:Daniel:Eliza
    difficulty: 'hard',
    category: 'logic',
    hints: [
      'Start by analyzing the last possible scenario (with only two pirates left).',
      'Work backward from the simplest scenarios to the initial one.',
      'Remember that a pirate will vote Nay if their outcome is the same whether the current proposal passes or fails.',
    ],
    points: 25,
    explanation: 'By working backward from the last pirates, each pirate can deduce the outcome of any future scenario. Knowing this, the captain only needs to bribe the minimum number of pirates necessary to get at least 50% of the votes (including their own), leveraging the fact that the other pirates will vote Yarr if the alternative is worse for them (even if they get only one coin). Amaro needs his vote + two others, so he bribes Charlotte and Eliza with one coin each, as they would get nothing if Bart becomes captain.',
  },
  {
    id: '5',
    title: 'Escape the Gorge',
    riddle: 'You and three companions, each with a different speed (taking 1, 2, 5, and 10 minutes to cross), are trapped on one side of a deep gorge with a single, unstable rope bridge. A swarm of creatures is approaching and will reach the bridge in 17 minutes. The bridge can only support two people at a time, and you only have one lamp to light the way, which must be carried during every crossing. How can all four of you cross the gorge safely to cut the bridge before the creatures arrive?',
    answer: '1&2 across (2 min), 1 returns (1 min), 5&10 across (10 min), 2 returns (2 min), 1&2 across (2 min). Total = 17 minutes.',
    difficulty: 'hard',
    category: 'logic',
    hints: [
      'The bridge can only hold two people at a time.',
      'The lantern must cross with people.',
      'Think about minimizing the time the slowest people spend waiting or returning.',
      'Consider who should carry the lantern on return trips.',
    ],
    points: 30,
    explanation: 'The key is to have the two slowest people (5 and 10 minutes) cross together to minimize the total time. The fastest people (1 and 2 minutes) are used for the return trips with the lantern. The sequence 1&2 across, 1 back, 5&10 across, 2 back, 1&2 across takes exactly 17 minutes.',
  },
  {
    id: '6',
    title: 'The Inheritance Lockers',
    riddle: 'In a bizarre inheritance challenge, you and 99 other beneficiaries must interact with 100 numbered lockers containing clues. Beneficiary #1 opens all lockers. #2 flips the state of every 2nd locker. #3 flips every 3rd locker, and so on, up to #100. Lockers remaining open at the end contain the clues. Which lockers will remain open?',
    answer: 'The lockers that are perfect squares (1, 4, 9, 16, 25, 36, 49, 64, 81, 100).',
    difficulty: 'medium',
    category: 'logic',
    hints: [
      'Think about how many times each locker is touched.',
      'Relate the number of touches to the factors of the locker number.',
      'Which numbers have an odd number of factors?',
    ],
    points: 20,
    explanation: 'A locker\'s final state (open or closed) depends on whether it\'s touched an odd or even number of times. A locker is touched by every relative whose number is a factor of the locker number. Numbers with an odd number of factors are perfect squares.',
  },
  {
    id: '7',
    title: 'The Precise Escape',
    riddle: 'You have escaped confinement and need to time precisely 45 seconds to slip past a security measure. Your watch is broken, but you have two fuses and a lighter. Each fuse burns for exactly one minute from end to end, but they burn unevenly. How can you use the fuses and lighter to time exactly 45 seconds?',
    answer: 'Light three ends of the two fuses simultaneously. When the first fuse finishes burning (which takes 30 seconds, as it was lit from both ends), immediately light the remaining unlit end of the second fuse. When the second fuse finishes burning, exactly 45 seconds will have passed.',
    difficulty: 'hard',
    category: 'logic',
    hints: [
      'Consider what happens if you light a fuse from both ends at once.',
      'Think about how you can use the first fuse to measure a specific amount of time on the second fuse.',
      'You need to use the lighter multiple times.',
    ],
    points: 30,
    explanation: 'Lighting a fuse from both ends simultaneously causes it to burn out in exactly half its total burn time (30 seconds for a 1-minute fuse), regardless of uneven burning. By lighting three ends initially, one fuse burns from both ends (taking 30 seconds). At that exact moment, the second fuse has been burning from one end for 30 seconds, leaving 30 seconds of burn time remaining. By then lighting the other end of the second fuse, it will burn out in 15 more seconds (half of the remaining 30 seconds), totaling 30 + 15 = 45 seconds.',
  }
];

// Initialize the database connection (no need to reinitialize since riddles already exist)
export const initializeDatabase = async () => {
  try {
    console.log('Connecting to existing Firestore database...');
    
    // Test Firestore connection
    const { testFirestoreConnection } = await import('./databaseService');
    const isConnected = await testFirestoreConnection();
    if (!isConnected) {
      console.error('Firestore connection failed');
      return;
    }
    
    console.log('Successfully connected to existing Firestore database');
  } catch (error) {
    // Log any errors during database connection
    console.error('Failed to connect to database:', error);
  }
};

// Puzzle service object with methods for interacting with riddles
export const puzzleService = {
  // Get a single riddle by ID
  async getRiddle(id: string): Promise<Riddle | null> {
    return databaseService.getRiddle(id);
  },

  // Get all riddles
  async getAllRiddles(): Promise<Riddle[]> {
    return databaseService.getAllRiddles();
  },

  // Get a random riddle (currently fetches all and picks one)
  async getRandomRiddle(): Promise<Riddle | null> {
    return databaseService.getRandomRiddle();
  },

  // Add a new riddle (Firestore generates ID, so input doesn't need 'id')
  async addRiddle(riddle: Omit<Riddle, 'id'>): Promise<string> {
    return databaseService.addRiddle(riddle);
  },

  // Update an existing riddle by ID
  async updateRiddle(id: string, updates: Partial<Riddle>): Promise<void> {
    await databaseService.updateRiddle(id, updates);
  },

  // Delete a riddle by ID
  async deleteRiddle(id: string): Promise<void> {
    await databaseService.deleteRiddle(id);
  }
};
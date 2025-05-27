import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface HintLevel {
  level: 1 | 2 | 3;
  hint: string;
}

export const aiService = {
  // Test function to verify API connection
  async testConnection(): Promise<boolean> {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not set in environment variables');
      }

      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: 'Say "Connection successful!" if you can read this message.'
        }
      ];
      
      const response = await this.chatWithAI(messages);
      console.log('AI Service Test Response:', response);
      return true;
    } catch (error) {
      console.error('AI Service Test Failed:', error);
      if (error instanceof Error) {
        throw new Error(`AI Service Test Failed: ${error.message}`);
      }
      throw error;
    }
  },

  async chatWithAI(messages: ChatMessage[]): Promise<string> {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not set in environment variables');
      }

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI API');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`AI Service Error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw new Error('Failed to communicate with AI service. Please try again later.');
    }
  },

  async getRiddleHint(riddle: string, hintLevel: 1 | 2 | 3 = 1): Promise<string> {
    const hintPrompts = {
      1: "Give a very subtle hint that guides the user's thinking without revealing too much.",
      2: "Provide a more specific hint that points towards the solution but still requires some thinking.",
      3: "Give a stronger hint that makes the answer more obvious but still requires the user to make the final connection."
    };

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful riddle-solving assistant. Your goal is to help users solve riddles by providing hints at different levels of difficulty. Be encouraging and creative in your approach.'
      },
      {
        role: 'user',
        content: `I'm trying to solve this riddle: "${riddle}". ${hintPrompts[hintLevel]}`
      }
    ];
    return this.chatWithAI(messages);
  },

  async getRiddleExplanation(riddle: string, answer: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful riddle-solving assistant. Your goal is to explain riddles in an engaging and educational way.'
      },
      {
        role: 'user',
        content: `Can you explain this riddle and its answer in detail?\nRiddle: "${riddle}"\nAnswer: "${answer}"`
      }
    ];
    return this.chatWithAI(messages);
  },

  async generateCustomRiddle(category?: string, difficulty?: 'easy' | 'medium' | 'hard'): Promise<{ riddle: string; answer: string }> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a creative riddle generator. Create engaging and solvable riddles.'
      },
      {
        role: 'user',
        content: `Generate a ${difficulty || 'medium'} difficulty riddle${category ? ` about ${category}` : ''}. Format the response as JSON with "riddle" and "answer" fields.`
      }
    ];
    
    const response = await this.chatWithAI(messages);
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error('Failed to generate a valid riddle. Please try again.');
    }
  },

  async evaluateUserAnswer(riddle: string, userAnswer: string, correctAnswer: string): Promise<{
    isCorrect: boolean;
    feedback: string;
  }> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a riddle-solving assistant. Evaluate user answers and provide constructive feedback.'
      },
      {
        role: 'user',
        content: `Riddle: "${riddle}"\nCorrect Answer: "${correctAnswer}"\nUser's Answer: "${userAnswer}"\nEvaluate if the user's answer is correct and provide feedback. Format the response as JSON with "isCorrect" (boolean) and "feedback" (string) fields.`
      }
    ];
    
    const response = await this.chatWithAI(messages);
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new Error('Failed to evaluate the answer. Please try again.');
    }
  }
}; 
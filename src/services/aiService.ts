import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const aiService = {
  async chatWithAI(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  },

  // Helper function to get hints for riddles
  async getRiddleHint(riddle: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful riddle-solving assistant. Your goal is to help users solve riddles by providing subtle hints, explaining concepts, and guiding their thinking without giving away the answer. Be encouraging and creative in your approach.'
      },
      {
        role: 'user',
        content: `I'm trying to solve this riddle: "${riddle}". Can you give me a subtle hint without revealing the answer?`
      }
    ];
    return this.chatWithAI(messages);
  }
}; 
import OpenAI from 'openai';
import { Riddle } from './puzzleService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    console.log('AIService constructor called');
    console.log('All env vars:', import.meta.env);
    
    // Try multiple ways to get the API key
    let apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('API Key from import.meta.env:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
    
    // If still not working, try a fallback
    if (!apiKey) {
      console.log('Trying fallback method...');
      // You can temporarily hardcode the key here for testing
      // apiKey = 'gsk_PkJXnjNTSoSIp9MnKM1OWGdyb0MtiR0PkSlgA01cY8CUuy';
    }
    
    console.log('Final API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');
    console.log('API Key value (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'None');
    
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
        dangerouslyAllowBrowser: true
      });
      console.log('OpenAI client initialized successfully');
    } else {
      console.log('No API key found. Check your .env file.');
    }
  }

  private async getCompletion(messages: ChatMessage[]): Promise<string> {
    console.log('Attempting to get AI completion...');
    if (!this.openai) {
      console.error('OpenAI client not initialized');
      throw new Error("OpenAI not initialized. Make sure VITE_OPENAI_API_KEY is set in your .env file.");
    }

    try {
      console.log('Making API call to Groq...');
      const chatCompletion = await this.openai.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
      });

      console.log('API call successful, response received');
      return chatCompletion.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      if (error instanceof Error) {
        console.error('OpenAI API error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error('Failed to get response from AI. See console for details.');
    }
  }

  async getRiddleHint(riddle: Riddle, usedHints: number): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'assistant',
        content: `I am a riddle assistant. I will provide hints for the following riddle without revealing the answer. The riddle is: "${riddle.riddle}"`
      },
      {
        role: 'user',
        content: `The user has already used ${usedHints} hints. Please provide a new hint that helps them solve the riddle without giving away the answer.`
      }
    ];

    return this.getCompletion(messages);
  }

  async getRiddleDiscussion(riddle: Riddle, userMessage: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'assistant',
        content: `I am a riddle assistant. I will help discuss the following riddle without revealing the answer. The riddle is: "${riddle.riddle}"`
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    return this.getCompletion(messages);
  }
}

export const aiService = new AIService(); 
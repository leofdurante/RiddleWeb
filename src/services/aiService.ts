import OpenAI from 'openai';
import { Riddle } from './puzzleService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
        dangerouslyAllowBrowser: true
      });
    }
  }

  private async getCompletion(messages: ChatMessage[]): Promise<string> {
    if (!this.openai) {
      throw new Error("OpenAI not initialized. Make sure VITE_OPENAI_API_KEY is set in your .env file.");
    }

    try {
      const chatCompletion = await this.openai.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
      });

      return chatCompletion.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      if (error instanceof Error) {
        console.error('OpenAI API error message:', error.message);
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
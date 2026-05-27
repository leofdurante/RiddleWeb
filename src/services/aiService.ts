import OpenAI from 'openai';
import { Riddle } from './puzzleService';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private openai: OpenAI | null = null;
  private readonly hasApiKey: boolean;

  constructor() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
    this.hasApiKey = Boolean(apiKey);

    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
        dangerouslyAllowBrowser: true
      });
    }
  }

  isConfigured(): boolean {
    return this.hasApiKey;
  }

  private async getCompletion(messages: ChatMessage[]): Promise<string> {
    if (!this.openai) {
      throw new Error(
        'AI chat is not configured. Set VITE_GROQ_API_KEY (or VITE_OPENAI_API_KEY) and redeploy.'
      );
    }

    try {
      const chatCompletion = await this.openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
      });

      return chatCompletion.choices[0].message.content?.trim() || '';
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to get response from AI.');
    }
  }

  async getRiddleHint(riddle: Riddle, usedHints: number): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
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
        role: 'system',
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
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

  private buildSystemPrompt(riddle: Riddle, mode: 'hint' | 'discussion'): string {
    const canonicalAnswer = riddle.answer;
    const alternatives = riddle.alternativeAnswers?.length
      ? `\nAlso accept these equivalent answers: ${riddle.alternativeAnswers.join('; ')}`
      : '';
    const explanation = riddle.explanation
      ? `\nReference explanation (for verification only): ${riddle.explanation}`
      : '';

    const baseRules = `You are a riddle assistant.
Rules:
1) Keep responses short: max 2 sentences.
2) Friendly tone, no bullet lists or long step-by-step dumps.
3) Never reveal the final answer unless the user explicitly asks for it or clearly states a correct final guess.

Canonical answer (for verification only — do not reveal unless the user has solved it or explicitly asks):
"${canonicalAnswer}"${alternatives}${explanation}

Current riddle: "${riddle.riddle}"`;

    if (mode === 'hint') {
      return `${baseRules}
4) Give one hint at a time without revealing the answer.
5) Do not confirm incorrect guesses as correct.`;
    }

    return `${baseRules}
4) When the user proposes an answer, strategy, or step-by-step solution, you MUST verify it before responding:
   - Re-read each step and recalculate totals, constraints, and timing internally.
   - Compare against the canonical answer above.
   - Accept solutions that match the canonical answer or are equally valid.
   - Never mark a correct solution as wrong; double-check your arithmetic.
5) If correct, reply with "Correct! ✅" and one short sentence of praise or confirmation.
6) If incorrect, say it is not correct in one sentence and give one small hint — do not reveal the full answer.
7) If the guess is close but not complete, say it is close and give one directional hint.`;
  }

  private async getCompletion(messages: ChatMessage[], temperature = 0.7): Promise<string> {
    if (!this.openai) {
      throw new Error(
        'AI chat is not configured. Set VITE_GROQ_API_KEY (or VITE_OPENAI_API_KEY) and redeploy.'
      );
    }

    try {
      const chatCompletion = await this.openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature,
        max_tokens: 200,
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
        content: this.buildSystemPrompt(riddle, 'hint'),
      },
      {
        role: 'user',
        content: `The user has already used ${usedHints} hints. Give one new short hint without revealing the answer.`
      }
    ];

    return this.getCompletion(messages, 0.7);
  }

  async getRiddleDiscussion(riddle: Riddle, userMessage: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: this.buildSystemPrompt(riddle, 'discussion'),
      },
      {
        role: 'user',
        content: `User message: "${userMessage}". If they proposed a solution or strategy, verify it step-by-step against the canonical answer before you respond.`
      }
    ];

    return this.getCompletion(messages, 0.3);
  }
}

export const aiService = new AIService(); 
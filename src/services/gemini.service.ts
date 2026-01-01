import { Injectable } from '@angular/core';
import { GoogleGenAI, Chat } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async initChat(systemContext: string) {
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `你是 Gemini 3.0 助手，一个嵌入在 Gemini 3.0 中文文档维基中的乐于助人的专家。
        
        以下是你服务的维基知识库内容：
        ${systemContext}
        
        规则：
        1. 尽可能严格根据提供的维基内容回答问题。
        2. 如果用户询问维基中没有的一般编码或 Gemini 功能，请使用你的通用知识回答，但要提到这可能不在当前文档中。
        3. 保持简洁、技术性强且友好。
        4. 代码片段请使用 Markdown 格式。
        5. 请始终使用中文回答。
        `,
        temperature: 0.7,
      }
    });
  }

  async sendMessage(message: string): Promise<AsyncIterable<any>> {
    if (!this.chatSession) {
      throw new Error('Chat session not initialized');
    }

    try {
      const result = await this.chatSession.sendMessageStream({ message });
      return result;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}
import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { WikiService } from '../services/wiki.service';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Button -->
    <button 
      (click)="toggleChat()"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 group hover:scale-110"
      [class.scale-0]="isOpen()"
    >
      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-slate-900"></div>
    </button>

    <!-- Chat Window -->
    <div 
      class="fixed bottom-6 right-6 w-[400px] h-[600px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden transition-all duration-300 z-50 transform origin-bottom-right"
      [class.scale-0]="!isOpen()"
      [class.opacity-0]="!isOpen()"
      [class.scale-100]="isOpen()"
      [class.opacity-100]="isOpen()"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 p-4 flex items-center justify-between border-b border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
            <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-slate-100 text-sm">Gemini 助手</h3>
            <p class="text-xs text-sky-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 在线
            </p>
          </div>
        </div>
        <button (click)="toggleChat()" class="text-slate-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50" #scrollContainer>
        @for (msg of messages(); track $index) {
          <div [class.justify-end]="msg.role === 'user'" class="flex gap-3">
             @if (msg.role === 'model') {
                <div class="w-6 h-6 rounded-full bg-sky-500/20 flex-shrink-0 flex items-center justify-center border border-sky-500/30 mt-1">
                   <span class="text-[10px] text-sky-400 font-bold">AI</span>
                </div>
             }
             
             <div 
               class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm"
               [class.bg-sky-600]="msg.role === 'user'"
               [class.text-white]="msg.role === 'user'"
               [class.rounded-tr-none]="msg.role === 'user'"
               [class.bg-slate-800]="msg.role === 'model'"
               [class.text-slate-300]="msg.role === 'model'"
               [class.rounded-tl-none]="msg.role === 'model'"
               [class.border]="msg.role === 'model'"
               [class.border-slate-700]="msg.role === 'model'"
             >
                <div [innerHTML]="formatMessage(msg.text)"></div>
             </div>
          </div>
        }
        
        @if (isLoading()) {
           <div class="flex gap-3">
              <div class="w-6 h-6 rounded-full bg-sky-500/20 flex-shrink-0 flex items-center justify-center border border-sky-500/30 mt-1">
                 <span class="text-[10px] text-sky-400 font-bold">AI</span>
              </div>
              <div class="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                 <div class="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></div>
                 <div class="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-100"></div>
                 <div class="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-200"></div>
              </div>
           </div>
        }
      </div>

      <!-- Input -->
      <div class="p-3 bg-slate-800 border-t border-slate-700">
        <form (submit)="sendMessage(); $event.preventDefault()" class="relative">
          <input 
            type="text" 
            [(ngModel)]="currentInput" 
            name="chatInput"
            placeholder="询问关于 Gemini 3.0 的任何问题..." 
            class="w-full bg-slate-900 text-slate-200 text-sm rounded-xl py-3 pl-4 pr-12 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none placeholder:text-slate-500"
            [disabled]="isLoading()"
          >
          <button 
            type="submit"
            [disabled]="!currentInput || isLoading()"
            class="absolute right-2 top-2 p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>
      </div>
    </div>
  `
})
export class AssistantComponent implements AfterViewChecked {
  private geminiService = inject(GeminiService);
  private wikiService = inject(WikiService);
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  isLoading = signal(false);
  messages = signal<ChatMessage[]>([
    { role: 'model', text: '你好！我是你的 Gemini 3.0 向导。请随意向我询问关于文档的任何问题。' }
  ]);
  currentInput = '';

  private hasInitialized = false;

  constructor() {}

  toggleChat() {
    this.isOpen.update(v => !v);
    if (this.isOpen() && !this.hasInitialized) {
      this.initAI();
    }
  }

  async initAI() {
    this.hasInitialized = true;
    try {
      const context = this.wikiService.getAllContentForAI();
      await this.geminiService.initChat(context);
    } catch (e) {
      console.error('Failed to init AI', e);
      this.messages.update(m => [...m, { role: 'model', text: '连接错误。请检查您的 API 密钥。' }]);
    }
  }

  async sendMessage() {
    if (!this.currentInput.trim() || this.isLoading()) return;

    const userText = this.currentInput;
    this.currentInput = '';
    this.messages.update(m => [...m, { role: 'user', text: userText }]);
    this.isLoading.set(true);

    try {
      if (!this.hasInitialized) await this.initAI();

      const stream = await this.geminiService.sendMessage(userText);
      
      let fullResponse = '';
      this.messages.update(m => [...m, { role: 'model', text: '' }]); // Placeholder

      for await (const chunk of stream) {
        const text = chunk.text();
        fullResponse += text;
        
        // Update last message with new chunk
        this.messages.update(msgs => {
          const newMsgs = [...msgs];
          newMsgs[newMsgs.length - 1] = { role: 'model', text: fullResponse };
          return newMsgs;
        });
      }
    } catch (e) {
      this.messages.update(m => [...m, { role: 'model', text: '抱歉，我在处理您的请求时遇到了错误。' }]);
    } finally {
      this.isLoading.set(false);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  // Simple formatter to handle basic markdown in chat bubble
  formatMessage(text: string): string {
    // Very basic bold and code formatting
    let formatted = text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-black/30 px-1 rounded font-mono text-xs">$1</code>');
    return formatted;
  }
}
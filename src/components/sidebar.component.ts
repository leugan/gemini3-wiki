import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiService } from '../services/wiki.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col bg-slate-900 border-r border-slate-800 w-72">
      <!-- Header -->
      <div class="p-6 border-b border-slate-800 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-900/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white">
            <path d="M11.25 4.533A9.707 9.707 0 006 3.75a9.753 9.753 0 00-3.255 4.878 2.502 2.502 0 011.149.951c.541.869.437 1.842-.257 2.446a2.502 2.502 0 01-2.903.376C.667 12.872 0 13.924 0 15.006c0 1.077.659 2.126 1.72 2.946a2.5 2.5 0 011.96 4.148 9.754 9.754 0 003.882 1.346 9.71 9.71 0 002.438.154 2.502 2.502 0 011.62-1.123 2.502 2.502 0 012.396 1.135 9.75 9.75 0 004.878-3.255 2.5 2.5 0 01.951-1.149c.869-.541 1.842-.437 2.446.257a2.5 2.5 0 01.376 2.903c.468-.068 1.52-.735 2.602-1.817 1.077-1.082 1.734-2.135 1.801-2.602a2.5 2.5 0 012.903-.376c.604.694.572 1.667.257 2.446a2.502 2.502 0 01-1.149.951 9.753 9.753 0 003.255 4.878 2.502 2.502 0 01-1.135-2.396 2.502 2.502 0 011.123-1.62 9.709 9.709 0 00-.154-2.438 9.754 9.754 0 00-1.346-3.882 2.5 2.5 0 01-4.148-1.96C18.125 15.665 19.173 15 20.25 15c1.082 0 2.134.667 2.606 1.265.069-.468-.735-1.52-1.817-2.602-1.082-1.077-2.135-1.734-2.602-1.801a2.5 2.5 0 01-.376-2.903c.694-.604 1.667-.572 2.446-.257a2.502 2.502 0 01.951 1.149 9.753 9.753 0 004.878-3.255 2.502 2.502 0 01-2.396 1.135 2.502 2.502 0 01-1.62-1.123 9.71 9.71 0 00-2.438.154 9.754 9.754 0 00-3.882 1.346 2.5 2.5 0 01-1.96 4.148c-1.06 0-1.72-.667-2.946-1.72a9.753 9.753 0 00-1.346-3.882 2.502 2.502 0 011.123-1.62 2.502 2.502 0 012.396 1.135 9.75 9.75 0 003.255 4.878z" />
          </svg>
        </div>
        <span class="font-bold text-lg tracking-tight text-slate-100">Gemini<span class="text-sky-400">3.0</span></span>
      </div>

      <!-- Search -->
      <div class="p-4">
        <div class="relative group">
          <input 
            type="text" 
            placeholder="搜索文档..." 
            class="w-full bg-slate-800 text-sm text-slate-300 rounded-md py-2 pl-9 pr-4 border border-slate-700 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-500"
            (input)="onSearch($event)"
          >
          <svg class="w-4 h-4 absolute left-3 top-2.5 text-slate-500 group-focus-within:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        @for (category of wikiService.categories(); track category.name) {
          <div>
            <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
              {{ category.name }}
            </h3>
            <ul class="space-y-1">
              @for (article of category.articles; track article.id) {
                <li>
                  <button 
                    (click)="wikiService.selectArticle(article.id)"
                    [class.bg-sky-500_10]="wikiService.currentArticleId() === article.id"
                    [class.text-sky-400]="wikiService.currentArticleId() === article.id"
                    [class.border-l-2]="true"
                    [class.border-sky-400]="wikiService.currentArticleId() === article.id"
                    [class.border-transparent]="wikiService.currentArticleId() !== article.id"
                    class="w-full text-left px-3 py-1.5 text-sm rounded-r-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center"
                  >
                    {{ article.title }}
                  </button>
                </li>
              }
            </ul>
          </div>
        }
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-800 text-xs text-slate-600 text-center">
        v3.0.0-rc.1 • Gemini 生态系统
      </div>
    </div>
  `
})
export class SidebarComponent {
  wikiService = inject(WikiService);

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.wikiService.setSearchQuery(input.value);
  }
}
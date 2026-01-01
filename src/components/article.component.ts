import { Component, inject, computed, ElementRef, ViewChild, effect, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikiService } from '../services/wiki.service';

declare const marked: any;

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None, // Enable styling of injected innerHTML
  template: `
    <div class="h-full overflow-y-auto px-12 py-10 relative scroll-smooth" #scrollContainer>
      <div class="max-w-4xl mx-auto pb-24">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <span class="hover:text-slate-300 cursor-pointer transition-colors">文档</span>
          <svg class="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          <span class="text-sky-400">{{ wikiService.currentArticle()?.category }}</span>
        </div>

        <!-- Content -->
        @if (wikiService.currentArticle(); as article) {
          <article class="prose prose-invert prose-slate max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800" [innerHTML]="renderedContent()">
          </article>
        }

        <!-- Footer Navigation (Visual) -->
        <div class="mt-24 pt-8 border-t border-slate-800/60 flex justify-between items-center text-sm">
           <div class="text-slate-500">
             最后更新: <span class="text-slate-400">2024-05-20</span>
           </div>
           <div class="flex gap-4">
             <button class="text-slate-400 hover:text-sky-400 transition-colors">编辑此页</button>
             <button class="text-slate-400 hover:text-sky-400 transition-colors">反馈问题</button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class ArticleComponent {
  wikiService = inject(WikiService);

  constructor() {
    // Reactively add copy buttons whenever the article changes
    effect(() => {
      const article = this.wikiService.currentArticle();
      if (article) {
        // Wait for DOM render
        setTimeout(() => this.injectCopyButtons(), 50);
      }
    });
  }

  renderedContent = computed(() => {
    const article = this.wikiService.currentArticle();
    if (!article) return '';
    try {
      return marked.parse(article.content);
    } catch (e) {
      return article.content;
    }
  });

  injectCopyButtons() {
    const preElements = document.querySelectorAll('article pre');
    
    preElements.forEach((node) => {
      const pre = node as HTMLElement; // Explicit cast to access .style

      // Avoid double injection
      if (pre.parentElement?.classList.contains('code-block-wrapper')) return;

      // 1. Create a wrapper for relative positioning
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper relative group mb-6 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900 shadow-xl';
      
      // 2. Insert wrapper and move pre inside
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      
      // Reset default pre margins as wrapper handles it
      // Force padding to ensure code doesn't touch edges
      pre.style.margin = '0';
      pre.style.border = 'none'; 
      pre.style.backgroundColor = 'transparent'; 
      pre.style.padding = '1.5rem'; 
      pre.style.overflowX = 'auto';

      // 3. Create Copy Button
      const button = document.createElement('button');
      button.className = `
        absolute top-2 right-2 p-2 rounded-md 
        bg-slate-800/90 text-slate-400 
        opacity-0 group-hover:opacity-100 focus:opacity-100
        transition-all duration-200 
        hover:bg-sky-600 hover:text-white 
        focus:outline-none border border-slate-700/50
        backdrop-blur-sm z-10 cursor-pointer
      `;
      button.setAttribute('aria-label', 'Copy code');
      button.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      `;

      // 4. Add Click Event
      button.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code ? (code as HTMLElement).innerText : pre.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
          const originalHTML = button.innerHTML;
          // Success State
          button.innerHTML = `
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          `;
          button.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
          button.classList.remove('bg-slate-800/90', 'text-slate-400', 'hover:bg-sky-600');
          
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('bg-emerald-500', 'border-emerald-500', 'text-white');
            button.classList.add('bg-slate-800/90', 'text-slate-400', 'hover:bg-sky-600');
          }, 2000);
        });
      });

      wrapper.appendChild(button);
      
      // Optional: Add Language Label
      const codeBlock = pre.querySelector('code');
      if (codeBlock) {
        const classes = codeBlock.className.split(' ');
        const langClass = classes.find(c => c.startsWith('language-'));
        if (langClass) {
          const lang = langClass.replace('language-', '');
          const langLabel = document.createElement('div');
          langLabel.className = 'absolute top-3 left-4 text-xs font-mono text-slate-500 select-none uppercase tracking-wider font-bold opacity-60';
          langLabel.innerText = lang === 'text' ? 'PROMPT' : lang;
          wrapper.appendChild(langLabel);
          
          // Adjust pre padding to account for label
          pre.style.paddingTop = '3rem'; 
        }
      }
    });
  }
}
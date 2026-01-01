import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar.component';
import { ArticleComponent } from './components/article.component';
import { AssistantComponent } from './components/assistant.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, ArticleComponent, AssistantComponent],
  template: `
    <div class="flex h-screen w-screen overflow-hidden bg-slate-950">
      <app-sidebar class="flex-shrink-0 z-20"></app-sidebar>
      <main class="flex-1 relative min-w-0 z-10">
        <div class="absolute inset-0 bg-slate-950">
           <!-- Subtle grid background -->
           <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
           <app-article class="relative z-10 h-full"></app-article>
        </div>
      </main>
      <app-assistant></app-assistant>
    </div>
  `
})
export class AppComponent {}
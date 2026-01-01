import { Injectable, signal, computed } from '@angular/core';

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown content
}

export interface Category {
  name: string;
  articles: Article[];
}

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  private articles: Article[] = [
    // --- 1. 核心知识 (Knowledge) ---
    {
      id: 'knowledge-models',
      category: '核心知识',
      title: 'Gemini 3.0 全系模型矩阵',
      content: `
# Gemini 3.0 全系模型矩阵

Gemini 3.0 代表了原生多模态 AI 的巅峰。这一代模型不再仅仅是“回答问题”，而是具备了**自主推理**、**跨模态深度理解**和**物理世界交互**的能力。

## 核心模型参数表

| 模型代号 (Model ID) | 规格定位 | 核心优势 | 适用场景 |
| :--- | :--- | :--- | :--- |
| **gemini-3.0-pro-001** | **全能旗舰** | 平衡了推理深度与响应速度，支持复杂指令 | 企业级应用、复杂 Agent、代码架构设计 |
| **gemini-3.0-flash-001** | **极速轻量** | <50ms 延迟，**10M+ Token** 超长上下文 | 实时语音交互、海量文档分析、视频流处理 |
| **gemini-3.0-ultra-001** | **最强推理** | 深度思考 (Thinking) 满血版，擅长科学难题 | 科研辅助、数学推导、法律/医疗深度咨询 |

---

## 🚀 深度思考 (Thinking Process) 调用指南

Gemini 3.0 全系（尤其是 Pro 和 Ultra）原生集成了 \`thinkingConfig\`。与 2.0 时代不同，3.0 的思考过程是多模态的——它可以“想象”图像来辅助逻辑推理。

### 场景：复杂供应链调度
**推荐模型**: \`gemini-3.0-ultra-001\`

### 💻 API 调用代码 (Node.js SDK)

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

// 初始化 Gemini 3.0 客户端
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-3.0-ultra-001', // 使用 Ultra 模型处理高难度推理
  contents: \`
    任务：优化全球物流网络。
    输入数据：附带的 JSON 包含 50 个港口、200 艘货轮的实时位置及天气预报。
    目标：在台风“海葵”影响下，重新规划路线以最小化延误，并计算成本波动。
  \`,
  config: {
    // Gemini 3.0 独有的思考配置
    thinkingConfig: { 
      thinkingBudget: 16384, // 分配更多 Token 用于思维链推导
      includeThoughts: true  // 返回思考过程用于审计
    }, 
    temperature: 0.2,
  },
});

console.log(response.text);
\`\`\`
      `
    },

    // --- 2. 编程 (Programming) ---
    {
      id: 'code-gen',
      category: '编程与开发',
      title: 'Gemini 3.0 架构师模式',
      content: `
# 智能编程：从代码生成到架构设计

Gemini 3.0 Pro 在编程领域引入了 "Architect Mode"（架构师模式），不仅仅是补全代码，更能理解整个仓库的依赖关系。

**推荐模型**: \`gemini-3.0-pro-001\`

## 场景 1：全栈功能实现

**目标**：输入一个需求描述，生成包含前端组件、后端 API 和数据库 Schema 的完整方案。

### 📋 API 调用代码

\`\`\`typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-3.0-pro-001',
  contents: "为一个‘实时协作白板’应用设计核心数据结构和 WebSocket 事件协议。",
  config: {
    responseMimeType: "application/json",
    // 使用 Gemini 3.0 的增强 Schema 定义
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        databaseSchema: { type: Type.STRING, description: "Prisma schema format" },
        apiEndpoints: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              path: { type: Type.STRING },
              method: { type: Type.STRING },
              payload: { type: Type.OBJECT }
            }
          }
        },
        socketEvents: {
          type: Type.OBJECT, 
          description: "Key-value pairs of event names and payloads"
        }
      }
    }
  }
});

console.log(response.text);
\`\`\`

---

## 场景 2：自动化代码审查 (Code Review)

利用 **gemini-3.0-flash** 的超长上下文能力，一次性读取整个 GitHub 仓库的代码。

**Prompt**:
\`\`\`text
Review the entire codebase provided in the context.
Focus on:
1. Security vulnerabilities (specifically SQL Injection and XSS).
2. Performance bottlenecks in the rendering loop.
3. Adherence to the Angular Style Guide.

Report format: SARIF (Static Analysis Results Interchange Format).
\`\`\`
      `
    },

    // --- 3. PPT (Presentation) ---
    {
      id: 'ppt-auto',
      category: '办公与演示',
      title: '多模态文档生成',
      content: `
# 下一代文档自动化

Gemini 3.0 打通了文本与视觉的界限。它不仅能写 PPT 大纲，还能直接通过 Imagen 3.0 模型生成每一页的配图。

**推荐模型**: \`gemini-3.0-flash-001\` (负责大纲) + \`imagen-3.0-generate-001\` (负责配图)

## 场景：从会议录音生成可视化简报

**输入**：一段 2 小时的产品战略会议录音 (Audio)。
**输出**：包含关键决策点和可视化图表建议的 JSON。

### 💻 API 调用代码

\`\`\`typescript
const response = await ai.models.generateContent({
  model: 'gemini-3.0-flash-001', // Flash 模型原生支持音频模态输入
  contents: [
    { text: "提取会议中的关键里程碑，并为每个里程碑构思一张视觉配图。" },
    { 
      inlineData: { 
        mimeType: 'audio/mp3', 
        data: base64AudioData 
      } 
    }
  ],
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          timestamp: { type: "STRING" },
          topic: { type: "STRING" },
          summary: { type: "STRING" },
          visualConcept: { 
            type: "STRING",
            description: "Detailed prompt for Imagen 3.0 to generate a slide background"
          }
        }
      }
    }
  }
});
\`\`\`
      `
    },

    // --- 4. Canvas (Interactive Canvas) ---
    {
      id: 'canvas-logic',
      category: '交互式画布',
      title: '空间计算与 UI 生成',
      content: `
# 空间逻辑与 UI 生成

Gemini 3.0 增强了对二维和三维坐标系的理解能力，非常适合生成 UI 布局、流程图甚至 3D 场景描述。

**推荐模型**: \`gemini-3.0-pro-001\`

## 场景：Figma 风格 UI 描述生成

**目标**：生成可以直接导入设计工具的节点数据。

### 📋 Prompt 示例

\`\`\`text
Task: Design a "Dashboard for Electric Vehicle Charging".
Style: Neobrutalism.

Output JSON structure:
- Ensure all elements have specific (x, y, width, height) properties.
- Use a 12-column grid system.
- Components needed: BatteryStatus, RangeEstimator, NearestStationsMap.
\`\`\`

### 💻 API 配置
\`\`\`javascript
const response = await ai.models.generateContent({
  model: 'gemini-3.0-pro-001',
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    // 3.0 特性：指定空间推理模式
    thinkingConfig: {
      focus: "spatial_reasoning" 
    }
  }
});
\`\`\`
      `
    },

    // --- 5. 画图 (Drawing) ---
    {
      id: 'drawing-imagen',
      category: '图像创作',
      title: 'Imagen 3.0 / 4.0 创作',
      content: `
# Imagen 3.0 & 4.0：极致真实

Gemini 生态中集成了 Imagen 系列。3.0 版本注重指令遵循，而未来的 4.0 版本将引入完整的物理光影模拟。

**推荐模型**: \`imagen-3.0-generate-001\`

## 场景：高保真产品渲染

**目标**：在不进行 3D 建模的情况下，生成产品的多角度渲染图。

### 💻 API 调用代码

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const response = await ai.models.generateImages({
  model: 'imagen-3.0-generate-001',
  prompt: \`
    Studio photography of a transparent mechanical watch.
    Macro shot, focus on the gears and ruby bearings.
    Lighting: Softbox lighting from top-left, rim light on edges.
    Background: Deep matte black.
    Resolution: 8k, highly detailed.
  \`,
  config: {
    numberOfImages: 4,
    aspectRatio: "1:1",
    // 3.0 新特性：风格参考
    styleReference: {
       style: "minimalist_tech"
    }
  }
});

const imageUrl = response.generatedImages[0].image.uri;
\`\`\`
      `
    },

    // --- 6. 视频 (Video) ---
    {
      id: 'video-veo',
      category: '视频制作',
      title: 'Veo 2.0 视频生成',
      content: `
# Veo 2.0：电影级视频生成

Veo 2.0 是 Gemini 3.0 生态中的视频生成核心，支持长达 60秒 的 4K 60fps 生成。

**推荐模型**: \`veo-2.0-generate-001\`

## 场景：动态广告生成 (Text-to-Video)

**目标**：生成一段饮料广告视频，要求液体流动符合物理规律。

### 💻 API 调用代码

\`\`\`typescript
let operation = await ai.models.generateVideos({
  model: 'veo-2.0-generate-001',
  prompt: \`
    Close-up of a sparkling lemon soda being poured into a glass with ice.
    Bubbles rising rapidly. Condensation on the glass.
    Summer sunlight flaring through the liquid.
    Camera movement: Slow zoom in.
    Physics: Realistic fluid dynamics, high viscosity.
  \`,
  config: {
    numberOfVideos: 1,
    durationSeconds: 10,
    fps: 60
  }
});

// 轮询操作状态...
\`\`\`

### 💡 导演模式 (Director Mode)
Veo 2.0 允许你通过简单的文本命令控制复杂的摄影机运动：
*   **"Orbit around the subject at 30 degrees/sec"** (环绕)
*   **"Rack focus from foreground ice to background lemon tree"** (变焦)
      `
    }
  ];

  // State
  readonly currentArticleId = signal<string>('knowledge-models');
  readonly searchQuery = signal<string>('');

  // Selectors
  readonly currentArticle = computed(() => 
    this.articles.find(a => a.id === this.currentArticleId()) || this.articles[0]
  );

  readonly filteredArticles = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.articles;
    return this.articles.filter(a => 
      a.title.toLowerCase().includes(query) || 
      a.content.toLowerCase().includes(query)
    );
  });

  readonly categories = computed(() => {
    const grouped = new Map<string, Article[]>();
    
    const categoryOrder = [
      '核心知识', '编程与开发', '办公与演示', '交互式画布', '图像创作', '视频制作'
    ];
    
    const filtered = this.filteredArticles();

    filtered.forEach(article => {
      if (!grouped.has(article.category)) {
        grouped.set(article.category, []);
      }
      grouped.get(article.category)!.push(article);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => {
        const indexA = categoryOrder.indexOf(a[0]);
        const indexB = categoryOrder.indexOf(b[0]);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      })
      .map(([name, articles]) => ({ name, articles }));
  });

  selectArticle(id: string) {
    this.currentArticleId.set(id);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  getAllContentForAI(): string {
    return this.articles.map(a => `Title: ${a.title}\nContent:\n${a.content}\n---\n`).join('\n');
  }
}
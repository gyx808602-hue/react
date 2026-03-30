import React from 'react';
import { FolderTree, FileCode, CheckCircle2, XCircle, Layout, ShieldCheck, Zap, Layers } from 'lucide-react';

const BestPracticeItem = ({ title, description, isGood = true }: { title: string; description: string; isGood?: boolean }) => (
  <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
    <div className={`p-2 rounded-xl ${isGood ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
      {isGood ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
    </div>
    <div className="space-y-1">
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const Architecture = () => {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold mb-2">架构与最佳实践 (Architecture)</h2>
        <p className="text-slate-500">如何构建一个可维护、可扩展、高性能的 React 应用。</p>
      </header>

      {/* Folder Structure */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <FolderTree size={20} />
          <span>推荐目录结构</span>
        </div>
        
        <div className="bg-slate-900 text-slate-300 p-8 rounded-3xl shadow-xl font-mono text-sm overflow-x-auto">
          <pre className="whitespace-pre">
{`src/
├── assets/          # 静态资源 (图片, 字体)
├── components/      # 通用 UI 组件
│   ├── ui/          # 基础原子组件 (Button, Input)
│   └── common/      # 业务通用组件
├── hooks/           # 自定义 Hooks
├── lib/             # 第三方库配置 (axios, utils)
├── pages/           # 页面级组件 (路由入口)
├── services/        # API 请求封装
├── store/           # 全局状态管理 (Zustand/Redux)
├── types/           # TypeScript 类型定义
├── constants/       # 常量配置
└── App.tsx          # 根组件与路由配置`}
          </pre>
        </div>
      </section>

      {/* Best Practices Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-emerald-600 font-bold">
          <Zap size={20} />
          <span>编码规范与最佳实践</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BestPracticeItem 
            title="组件职责单一 (SRP)" 
            description="一个组件只做一件事。如果组件超过 200 行，考虑拆分子组件。"
          />
          <BestPracticeItem 
            title="优先使用函数组件" 
            description="Hooks 提供了更简洁的代码和更好的逻辑复用能力。"
          />
          <BestPracticeItem 
            title="状态提升 (Lifting State Up)" 
            description="当多个组件需要共享状态时，将状态移动到它们最近的共同父组件中。"
          />
          <BestPracticeItem 
            title="避免过度使用 Context" 
            description="Context 适合全局配置。频繁变动的状态应使用专门的状态库或局部状态。"
          />
          <BestPracticeItem 
            title="Key 的唯一性" 
            description="在渲染列表时，使用唯一的 ID 而非 index 作为 key，以保证渲染性能。"
          />
          <BestPracticeItem 
            title="错误边界 (Error Boundaries)" 
            description="使用错误边界捕获子组件树中的 JavaScript 错误，防止整个应用崩溃。"
          />
        </div>
      </section>

      {/* Component Patterns */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Layout size={24} />
          </div>
          <h4 className="font-bold text-lg">容器与展示组件</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            容器组件处理逻辑与数据获取，展示组件仅负责 UI 渲染。这种模式有助于逻辑与视图的分离。
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <h4 className="font-bold text-lg">防御式编程</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            始终处理 API 请求的错误状态、加载状态以及空数据状态。使用可选链 (?.) 防止运行时崩溃。
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <Layers size={24} />
          </div>
          <h4 className="font-bold text-lg">组合优于继承</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            React 具有强大的组合模型。通过 props.children 将组件嵌套，而不是通过复杂的继承关系。
          </p>
        </div>
      </section>

      {/* Performance Tips */}
      <div className="bg-indigo-600 p-10 rounded-3xl text-white space-y-6 shadow-2xl shadow-indigo-200">
        <h4 className="text-2xl font-bold flex items-center gap-3">
          <Zap size={28} />
          性能优化清单 (Checklist)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ul className="space-y-4 text-indigo-100">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>使用 <code>React.memo</code> 避免不必要的重渲染</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>使用 <code>useCallback</code> 稳定函数引用</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>使用 <code>useMemo</code> 缓存昂贵的计算结果</span>
            </li>
          </ul>
          <ul className="space-y-4 text-indigo-100">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>实施虚拟列表 (Virtual List) 处理大数据量</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>利用 <code>Suspense</code> 和 <code>lazy</code> 进行代码分割</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span>优化图片加载 (Lazy loading, WebP)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Architecture;

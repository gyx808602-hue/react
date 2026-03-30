import React from 'react';
import { BookOpen, Code2, Rocket, Star, Layers, History, Briefcase, Globe, FlaskConical, MousePointer2, Wrench, Box, FolderTree } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const ConceptCard = ({ title, description, icon: Icon, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", color)}>
      <Icon size={24} className="text-white" />
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-extrabold tracking-tight text-slate-900"
        >
          欢迎来到 React 全栈进阶之路 🚀
        </motion.h2>
        <p className="text-lg text-slate-600 max-w-3xl">
          本指南旨在帮助你从零开始，通过实际代码示例掌握 React 的每一个核心知识点。
          无论你是为了面试还是为了日常开发，这里都有你需要的干货。
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ConceptCard 
          title="JSX & 组件化" 
          description="理解声明式编程，掌握组件的生命周期与数据流。"
          icon={Code2}
          color="bg-blue-500"
        />
        <ConceptCard 
          title="Hooks 体系" 
          description="深入 useState, useEffect 等内置 Hooks，掌握逻辑复用。"
          icon={Star}
          color="bg-purple-500"
        />
        <ConceptCard 
          title="状态管理" 
          description="从 Props Drilling 到 Context API，再到外部状态库。"
          icon={Layers}
          color="bg-orange-500"
        />
        <ConceptCard 
          title="前后端联调" 
          description="模拟 API 请求，处理 Loading、Error 及竞态条件。"
          icon={Globe}
          color="bg-sky-500"
        />
        <ConceptCard 
          title="Refs 体系" 
          description="掌握 useRef, forwardRef 等‘逃生舱’，处理 DOM 交互。"
          icon={MousePointer2}
          color="bg-yellow-500"
        />
        <ConceptCard 
          title="自定义 Hooks" 
          description="将组件逻辑提取到可重用的函数中，实现真正的代码复用。"
          icon={Wrench}
          color="bg-purple-500"
        />
        <ConceptCard 
          title="Suspense & Portals" 
          description="掌握 React 的异步渲染与 DOM 传送技术。"
          icon={Box}
          color="bg-rose-500"
        />
        <ConceptCard 
          title="架构与最佳实践" 
          description="如何构建一个可维护、可扩展、高性能的 React 应用。"
          icon={FolderTree}
          color="bg-emerald-500"
        />
        <ConceptCard 
          title="性能优化" 
          description="掌握虚拟 DOM 原理，学会使用 memo, useMemo 减少重绘。"
          icon={Rocket}
          color="bg-emerald-500"
        />
        <ConceptCard 
          title="冷门/高级 API" 
          description="useId, useDeferredValue 等解决特定复杂场景的利器。"
          icon={FlaskConical}
          color="bg-pink-500"
        />
        <ConceptCard 
          title="版本演进" 
          description="从 Hooks 革命到 React 19 的 Actions，掌握 API 变迁。"
          icon={History}
          color="bg-indigo-500"
        />
        <ConceptCard 
          title="实战场景" 
          description="错误边界、传送门、企业级项目规范等真实开发经验。"
          icon={Briefcase}
          color="bg-slate-700"
        />
      </div>

      <section className="bg-blue-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={24} /> 学习建议
          </h3>
          <ul className="space-y-3 opacity-90">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>不要只是看代码，尝试修改它并观察结果。</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>关注每一个 Hooks 的依赖数组，这是最容易出错的地方。</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>面试时，不仅要说出“怎么做”，更要说出“为什么这么做”。</span>
            </li>
          </ul>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white rounded-2xl border border-slate-200">
          <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-600">
            <Star size={20} fill="currentColor" /> 最佳实践 (Best Practices)
          </h4>
          <ul className="space-y-4 text-slate-600">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900">组件单一职责：</strong> 每个组件只做一件事。如果组件太长，考虑拆分。</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900">组合优于继承：</strong> 使用 Props 和 Children 来构建复杂的 UI。</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong className="text-slate-900">Hooks 逻辑抽离：</strong> 将复杂的业务逻辑封装进自定义 Hooks。</span>
            </li>
          </ul>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-200">
          <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <Code2 size={20} /> 常用工具链
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Vite', 'Tailwind CSS', 'React Router', 'Lucide Icons', 'Framer Motion', 'TypeScript'].map(tool => (
              <span key={tool} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                {tool}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500 leading-relaxed">
            本项目使用了目前最流行的 React 生态工具，确保你学到的技术在实际工作中能立即上手。
          </p>
        </div>
      </section>
    </div>
  );
}

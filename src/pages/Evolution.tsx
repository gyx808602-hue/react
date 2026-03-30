import React from 'react';
import { History, Milestone, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const VersionBlock = ({ version, title, features, deprecated, color }: any) => (
  <div className="relative pl-8 border-l-2 border-slate-200 pb-12 last:pb-0">
    <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${color}`} />
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Milestone size={20} className="text-slate-400" />
          React {version}: {title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${color}`}>
          {version}
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles size={14} className="text-amber-500" /> 新增特性
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {features.map((f: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {deprecated && deprecated.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <AlertTriangle size={14} className="text-red-500" /> 弃用/变更
            </h4>
            <ul className="space-y-1">
              {deprecated.map((d: string, i: number) => (
                <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function Evolution() {
  return (
    <div className="space-y-10 pb-20">
      <header className="space-y-4">
        <h2 className="text-4xl font-extrabold tracking-tight">React 版本演进史</h2>
        <p className="text-lg text-slate-600 max-w-3xl">
          了解 React 的过去与未来，掌握 API 的变迁是成为高级工程师的必经之路。
        </p>
      </header>

      <div className="max-w-4xl">
        <VersionBlock 
          version="19.0"
          title="Actions & 编译器预览"
          color="bg-indigo-600"
          features={[
            "Actions: 简化异步操作与状态更新",
            "use: 新的 Hook 用于读取资源/Context",
            "ref 作为 Prop: 不再需要 forwardRef",
            "useActionState: 处理表单 Action 状态",
            "useOptimistic: 乐观更新内置支持",
            "自动批处理优化"
          ]}
          deprecated={[
            "forwardRef 逐渐被淘汰",
            "defaultProps (函数组件) 已弃用",
            "ReactDOM.render (已在 18 弃用，19 彻底移除)"
          ]}
        />

        <VersionBlock 
          version="18.0"
          title="并发模式 (Concurrent)"
          color="bg-blue-500"
          features={[
            "Concurrent Rendering: 并发渲染架构",
            "Automatic Batching: 自动批处理",
            "Transitions: startTransition 区分优先级",
            "Suspense on Server: 服务端流式渲染",
            "useId, useTransition, useDeferredValue"
          ]}
          deprecated={[
            "ReactDOM.render 替换为 createRoot",
            "componentWillMount 等旧生命周期彻底不建议使用"
          ]}
        />

        <VersionBlock 
          version="17.0"
          title="无新特性版本 (Stepping Stone)"
          color="bg-slate-500"
          features={[
            "新的 JSX 转换器 (无需 import React)",
            "事件委托变更 (从 document 移至 root)",
            "副作用清理时机优化",
            "支持多版本 React 共存"
          ]}
          deprecated={[
            "事件池 (Event Pooling) 已移除"
          ]}
        />

        <VersionBlock 
          version="16.8"
          title="Hooks 革命"
          color="bg-purple-500"
          features={[
            "React Hooks 正式发布",
            "useState, useEffect 改变了组件编写方式",
            "逻辑复用不再依赖 HOC 或 Render Props",
            "函数组件成为一等公民"
          ]}
          deprecated={[
            "Class 组件不再是唯一选择",
            "旧的生命周期函数开始标记为 UNSAFE_"
          ]}
        />
      </div>

      <section className="bg-slate-900 rounded-3xl p-10 text-white">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <History size={24} /> 为什么 API 会弃用？
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-400">
          <div className="space-y-2">
            <h4 className="text-white font-bold">1. 性能考量</h4>
            <p>例如 React 17 移除事件池，是因为现代浏览器性能已足够，而事件池增加了代码复杂度和心智负担。</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold">2. 架构升级</h4>
            <p>React 18 引入并发模式，为了支持非阻塞渲染，许多同步 API 必须被异步或优先级感知的 API 替代。</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold">3. 开发体验 (DX)</h4>
            <p>React 19 允许 ref 直接作为 prop 传递，消除了 forwardRef 带来的嵌套地狱，让代码更直观。</p>
          </div>
        </div>
      </section>
    </div>
  );
}

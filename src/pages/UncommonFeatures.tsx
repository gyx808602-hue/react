import React, { useState, useDeferredValue, useId, useTransition, useSyncExternalStore, Suspense } from 'react';
import { FlaskConical, Fingerprint, Timer, Zap, Share2, EyeOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';
/**
 * 1. useId: 生成唯一 ID
 * 解决 SSR 时的 ID 不匹配问题，以及表单 label 绑定
 */
const IdDemo = () => {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        使用 useId 绑定的输入框
      </label>
      <input 
        id={id} 
        type="text" 
        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`生成的 ID: ${id}`}
      />
    </div>
  );
};

/**
 * 2. useDeferredValue: 推迟更新非关键部分
 * 适合处理大量数据列表过滤，保持输入框流畅
 */
const DeferredList = ({ text }: { text: string }) => {
  const deferredText = useDeferredValue(text);
  
  // 模拟一个非常耗时的列表渲染
  const items = [];
  for (let i = 0; i < 2000; i++) {
    if (items.length > 50) break; // 仅展示前50个以防浏览器卡死
    if (deferredText && !`项目 ${i}`.includes(deferredText)) continue;
    items.push(<li key={i} className="p-2 bg-slate-50 rounded mb-1 text-xs">项目 {i} - 匹配: {deferredText}</li>);
  }

  return (
    <div className="mt-4">
      <p className="text-xs text-slate-400 mb-2 italic">
        {text !== deferredText ? "正在推迟更新列表..." : "列表已同步"}
      </p>
      <ul className="max-h-40 overflow-y-auto border border-slate-100 rounded-lg p-2">
        {items.length > 0 ? items : <li className="text-slate-400 text-xs">无匹配项</li>}
      </ul>
    </div>
  );
};

/**
 * 3. useSyncExternalStore: 订阅外部存储
 * 模拟订阅浏览器在线状态
 */
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine
  );
}

export default function UncommonFeatures() {
  const [query, setQuery] = useState('');
  const isOnline = useOnlineStatus();

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">冷门/高级 API (Uncommon APIs)</h2>
        <p className="text-slate-500">这些 API 不常用，但在特定复杂场景下是“救命稻草”。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* useId */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Fingerprint size={20} />
            <span>useId: 唯一标识符</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            用于生成跨服务端和客户端稳定的唯一 ID。主要用于可访问性属性（如 aria-describedby）。
          </p>
          <IdDemo />
          <IdDemo />
        </section>

        {/* useSyncExternalStore */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <Share2 size={20} />
            <span>useSyncExternalStore: 外部状态</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            推荐用于订阅外部存储（如浏览器 API、第三方状态库）。它能确保并发渲染时的状态一致性。
          </p>
          <div className={cn(
            "p-6 rounded-xl border flex items-center gap-3 transition-colors",
            isOnline ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
          )}>
            <div className={cn("w-3 h-3 rounded-full animate-pulse", isOnline ? "bg-emerald-500" : "bg-red-500")} />
            <span className="font-bold">当前网络状态: {isOnline ? "在线 (Online)" : "离线 (Offline)"}</span>
          </div>
        </section>

        {/* useDeferredValue */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <Timer size={20} />
            <span>useDeferredValue: 性能防抖</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                允许你推迟更新 UI 的非关键部分。与防抖 (Debounce) 不同，它没有固定延迟，React 会在主线程空闲时立即尝试更新。
              </p>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="输入数字搜索列表 (如: 1, 2, 3...)"
              />
            </div>
            <DeferredList text={query} />
          </div>
        </section>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <EyeOff size={24} /> 还有哪些“冷门”知识？
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <h4 className="text-blue-400 font-bold">useInsertionEffect</h4>
            <p className="text-slate-400">专门为 CSS-in-JS 库设计，在所有 DOM 变更之前触发。普通开发者几乎用不到。</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-blue-400 font-bold">useImperativeHandle</h4>
            <p className="text-slate-400">配合 forwardRef 使用，自定义暴露给父组件的实例值。通常用于封装复杂的第三方 UI 组件。</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-blue-400 font-bold">flushSync</h4>
            <p className="text-slate-400">强制 React 同步刷新更新并立即更新 DOM。这会严重损害性能，应极力避免使用。</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-blue-400 font-bold">React.lazy & Suspense</h4>
            <p className="text-slate-400">实现组件级别的代码分割 (Code Splitting)，减少首屏加载体积。在大型 SPA 中非常常用。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

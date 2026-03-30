import React, { useState, Suspense, lazy } from 'react';
import { createPortal } from 'react-dom';
import { Box, Layers, Zap, AlertCircle, X, Loader2, ExternalLink } from 'lucide-react';

/**
 * 1. React.lazy & Suspense: 代码分割与异步加载
 */
const LazyComponent = lazy(() => {
  // 模拟网络延迟
  return new Promise<{ default: React.ComponentType }>(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg text-center animate-in fade-in zoom-in duration-500">
            <Zap size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">我是异步加载的组件</h3>
            <p className="text-indigo-100 text-sm">通过 React.lazy 和 Suspense 实现，减少首屏加载体积。</p>
          </div>
        )
      });
    }, 2000);
  });
});

/**
 * 2. Portals: 传送门
 * 将子节点渲染到父组件以外的 DOM 节点中。
 */
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-lg font-bold">Portal 弹窗</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
        <div className="p-4 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>,
    document.body // 传送到 body 下
  );
};

const SuspensePortals = () => {
  const [showLazy, setShowLazy] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold mb-2">Suspense & Portals</h2>
        <p className="text-slate-500">掌握 React 的异步渲染与 DOM 传送技术。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Suspense Demo */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Layers size={20} />
            <span>Suspense & Lazy Loading</span>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed">
            React.lazy 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并为用户提供更好的加载体验。
          </p>

          <div className="min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-4">
            {!showLazy ? (
              <button 
                onClick={() => setShowLazy(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <Zap size={18} />
                点击加载异步组件
              </button>
            ) : (
              <Suspense fallback={
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="text-sm font-medium">正在加载组件...</p>
                </div>
              }>
                <LazyComponent />
              </Suspense>
            )}
          </div>
        </section>

        {/* Portals Demo */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-rose-600 font-bold">
            <Box size={20} />
            <span>React Portals</span>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed">
            Portal 提供了一种将子节点渲染到父组件以外的 DOM 节点中的优秀方案。常用于：对话框、悬浮卡、提示框。
          </p>

          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-rose-500 mt-1" size={20} />
              <div>
                <p className="font-bold text-rose-900">层级问题解决方案</p>
                <p className="text-sm text-rose-700 leading-relaxed">
                  当父组件有 <code>overflow: hidden</code> 或 <code>z-index</code> 限制时，
                  Portal 可以让弹窗“跳出”限制，渲染在 body 最外层。
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              打开 Portal 弹窗
            </button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box size={32} />
              </div>
              <h4 className="text-xl font-bold">传送成功！</h4>
              <p className="text-slate-500 text-sm">
                虽然我在代码里是这个页面的子组件，但在浏览器 DOM 树中，我直接挂载在 <code>&lt;body&gt;</code> 下。
              </p>
            </div>
          </Modal>
        </section>
      </div>

      <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl shadow-xl font-mono text-sm">
        <h4 className="text-white font-bold mb-4">核心原理：</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-indigo-400 font-bold">Suspense</p>
            <p className="text-xs leading-relaxed">
              底层通过抛出一个 Promise 来“挂起”组件渲染。
              React 捕获这个 Promise，渲染 fallback，
              当 Promise resolve 后重新尝试渲染。
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-rose-400 font-bold">Portals</p>
            <p className="text-xs leading-relaxed">
              尽管 Portal 可以被放置在 DOM 树中的任何地方，
              但在 React 树中，它依然表现得像普通子节点。
              这意味着 Context、事件冒泡依然遵循 React 树结构。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspensePortals;

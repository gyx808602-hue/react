import React, { useState, useMemo, useCallback } from 'react';
import { Zap, Timer, RefreshCw } from 'lucide-react';

/**
 * 子组件：使用 React.memo 防止不必要的渲染
 */
const ExpensiveComponent = React.memo(({ onAction, count }: { onAction: () => void, count: number }) => {
  console.log('子组件渲染了！');
  return (
    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
      <p className="text-emerald-700 font-bold mb-4">我是被 React.memo 保护的子组件</p>
      <p className="mb-4">父组件传来的 Count: {count}</p>
      <button 
        onClick={onAction}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        触发子组件动作
      </button>
    </div>
  );
});

export default function Performance() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  /**
   * 1. useMemo: 缓存计算结果
   * 只有当 count 改变时，才会重新计算
   */
  const expensiveValue = useMemo(() => {
    console.log('执行了昂贵的计算...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += count;
    }
    return result;
  }, [count]);

  /**
   * 2. useCallback: 缓存函数引用
   * 只有当 count 改变时，函数引用才会变化
   * 这对于传递给 React.memo 子组件的函数至关重要
   */
  const handleAction = useCallback(() => {
    console.log('子组件触发了动作，当前 count:', count);
  }, [count]);

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold mb-2">性能优化 (Performance)</h2>
        <p className="text-slate-500">让你的 React 应用运行得像闪电一样快。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <Timer size={20} />
            <span>计算缓存: useMemo</span>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">计算结果 (模拟耗时操作):</p>
              <p className="text-2xl font-mono font-bold text-amber-600">{expensiveValue}</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setCount(c => c + 1)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg"
              >
                增加 Count (触发重算)
              </button>
              <button 
                onClick={() => setOtherState(s => s + 1)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg flex items-center gap-2"
              >
                <RefreshCw size={16} /> 改变其他状态 ({otherState})
              </button>
            </div>
            <p className="text-xs text-slate-400 italic">
              // 注释：当你改变“其他状态”时，useMemo 保护的计算逻辑不会重新执行。
            </p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <Zap size={20} />
            <span>渲染优化: useCallback & memo</span>
          </div>
          
          <div className="space-y-4">
            <ExpensiveComponent onAction={handleAction} count={count} />
            <p className="text-xs text-slate-400 italic">
              // 注释：打开控制台查看渲染日志。改变“其他状态”不会导致子组件重新渲染，因为 handleAction 被 useCallback 缓存了。
            </p>
          </div>
        </section>
      </div>

      <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-4">性能优化黄金法则</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="font-bold text-blue-700">1. 保持状态局部化</p>
            <p className="text-sm text-blue-800">状态越靠近使用它的组件，受影响的组件就越少。</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-blue-700">2. 避免过度优化</p>
            <p className="text-sm text-blue-800">不要在所有地方都用 useMemo。只有当计算确实昂贵或为了维持引用一致性时才使用。</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-blue-700">3. 使用列表 Key</p>
            <p className="text-sm text-blue-800">始终为列表项提供唯一 ID，帮助 React 高效地进行 Diff 算法。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

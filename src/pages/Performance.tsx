import React, { useState, useMemo, useCallback, memo } from 'react';
import { Zap, Timer, RefreshCw, Info } from 'lucide-react';
import DemoSection from '../components/DemoSection';
import CodeBlock from '../components/CodeBlock';

/**
 * 子组件：使用 React.memo 防止不必要的渲染
 */
const ExpensiveChild = memo(({ onAction, count }: { onAction: () => void, count: number }) => {
  // 记录渲染时间，用于直观展示
  const renderTime = new Date().toLocaleTimeString();
  
  return (
    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center shadow-inner">
      <p className="text-emerald-700 font-bold mb-2">我是被 React.memo 保护的子组件</p>
      <p className="text-sm text-emerald-600 mb-4">最后渲染时间: {renderTime}</p>
      <p className="mb-4 font-mono text-lg">父组件传来的 Count: {count}</p>
      <button 
        onClick={onAction}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
      >
        触发子组件动作
      </button>
    </div>
  );
});

export default function Performance() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  // ---------------------------------------------------------
  // 1. useMemo 示例：缓存昂贵的计算结果
  // ---------------------------------------------------------
  const expensiveValue = useMemo(() => {
    console.log('执行了昂贵的计算...');
    // 模拟一个非常耗时的计算
    let result = 0;
    for (let i = 0; i < 10000000; i++) {
      result += count;
    }
    return result;
  }, [count]); // 只有当 count 改变时，才会重新执行计算

  // ---------------------------------------------------------
  // 2. useCallback 示例：缓存函数引用
  // ---------------------------------------------------------
  const handleAction = useCallback(() => {
    console.log('子组件触发了动作，当前 count:', count);
    alert(`子组件动作触发！当前 Count 为: ${count}`);
  }, [count]); // 只有当 count 改变时，才会生成新的函数引用

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">性能优化 (useMemo & useCallback)</h2>
        <p className="text-slate-500">
          React 默认会在状态改变时重新渲染整个组件树。掌握这两个 Hook，能让你的应用避免不必要的计算和渲染。
        </p>
      </header>

      {/* 状态控制面板 (公共) */}
      <div className="bg-slate-800 p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-slate-300 text-sm mb-1">全局状态控制台</p>
          <p className="text-xs text-slate-400">点击下方按钮改变状态，观察下方两个 Demo 的反应。</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setCount(c => c + 1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors shadow-lg shadow-blue-900/50"
          >
            增加 Count ({count})
          </button>
          <button 
            onClick={() => setOtherState(s => s + 1)}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-colors flex items-center gap-2 border border-slate-600"
          >
            <RefreshCw size={18} /> 改变无关状态 ({otherState})
          </button>
        </div>
      </div>

      {/* useMemo 示例 */}
      <DemoSection 
        title="useMemo: 缓存昂贵的计算结果" 
        icon={<Timer size={20} />} 
        iconColorClass="text-amber-600"
      >
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            <strong className="text-amber-600">作用：</strong> 
            <code>useMemo</code> 用于缓存一个<strong>计算结果</strong>。当组件重新渲染时，如果依赖项（数组中的值）没有发生变化，它会直接返回上一次缓存的值，而不是重新执行计算逻辑。
          </p>
          
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-sm text-amber-800 mb-2">模拟耗时 1000 万次循环的计算结果：</p>
            <p className="text-3xl font-mono font-bold text-amber-600">{expensiveValue}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 border border-slate-200">
            <p className="font-bold mb-1 flex items-center gap-1"><Info size={16}/> 观察方法：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>点击顶部的 <strong>"增加 Count"</strong>：依赖项改变，触发重新计算（可能会感觉到轻微卡顿）。</li>
              <li>点击顶部的 <strong>"改变无关状态"</strong>：组件虽然重新渲染，但依赖项 <code>count</code> 没变，直接使用缓存值，瞬间完成。</li>
            </ul>
          </div>
        </div>
        <div>
          <CodeBlock 
            title="useMemo 核心代码"
            code={`// 只有当 count 改变时，才会重新执行这个耗时函数
const expensiveValue = useMemo(() => {
  console.log('执行了昂贵的计算...');
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += count;
  }
  return result;
}, [count]); // 👈 依赖项数组`} 
          />
        </div>
      </DemoSection>

      {/* useCallback 示例 */}
      <DemoSection 
        title="useCallback: 缓存函数引用" 
        icon={<Zap size={20} />} 
        iconColorClass="text-emerald-600"
      >
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed">
            <strong className="text-emerald-600">作用：</strong> 
            <code>useCallback</code> 用于缓存一个<strong>函数本身</strong>。在 React 中，每次组件渲染都会创建新的函数实例。如果将新函数作为 props 传给子组件，会导致子组件即使使用了 <code>React.memo</code> 也会被迫重新渲染。
          </p>
          
          <ExpensiveChild onAction={handleAction} count={count} />

          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 border border-slate-200">
            <p className="font-bold mb-1 flex items-center gap-1"><Info size={16}/> 观察方法：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>点击顶部的 <strong>"增加 Count"</strong>：依赖项改变，生成新函数，子组件的<strong>最后渲染时间</strong>会更新。</li>
              <li>点击顶部的 <strong>"改变无关状态"</strong>：父组件重新渲染，但由于 <code>useCallback</code> 缓存了函数引用，子组件的 props 没变（<code>React.memo</code> 发挥作用），子组件<strong>不会重新渲染</strong>（时间不变）。</li>
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <CodeBlock 
            title="useCallback 核心代码"
            code={`// 1. 使用 useCallback 缓存函数
const handleAction = useCallback(() => {
  alert(\`当前 Count: \${count}\`);
}, [count]); // 👈 只有 count 变了，才生成新函数

// 2. 结合 React.memo 保护子组件
const ExpensiveChild = memo(({ onAction, count }) => {
  return <button onClick={onAction}>触发</button>;
});

// 3. 渲染子组件
<ExpensiveChild 
  onAction={handleAction} 
  count={count} 
/>`} 
          />
        </div>
      </DemoSection>

      {/* 总结 */}
      <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-4 text-lg">💡 面试常考：useMemo 和 useCallback 的区别是什么？</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="font-bold text-blue-700 mb-2">useMemo</p>
            <p className="text-sm text-slate-600 mb-3">缓存的是<strong>函数的返回值</strong>（计算结果）。</p>
            <code className="text-xs bg-slate-100 p-2 rounded block text-slate-700">
              useMemo(() =&gt; fn(), [deps])
            </code>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="font-bold text-blue-700 mb-2">useCallback</p>
            <p className="text-sm text-slate-600 mb-3">缓存的是<strong>函数本身</strong>（内存地址引用）。</p>
            <code className="text-xs bg-slate-100 p-2 rounded block text-slate-700">
              useCallback(fn, [deps])
            </code>
          </div>
        </div>
        <p className="mt-4 text-sm text-blue-800 font-medium">
          本质上：<code>useCallback(fn, deps)</code> 就等价于 <code>useMemo(() =&gt; fn, deps)</code>。
        </p>
      </div>
    </div>
  );
}

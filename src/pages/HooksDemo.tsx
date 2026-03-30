import React, { useState, useEffect, useReducer, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Info, Code } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import DemoSection from '../components/DemoSection';

/**
 * useReducer 示例：处理复杂状态逻辑
 */
const counterReducer = (state: { count: number }, action: { type: string }) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return { count: 0 };
    default: return state;
  }
};

export default function HooksDemo() {
  // 1. useState: 最基础的状态 Hook
  const [name, setName] = useState('React 学习者');
  
  // 2. useReducer: 适合多个子值或下一个状态依赖前一个状态的复杂逻辑
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  // 3. useRef: 访问 DOM 或存储跨渲染周期的变量（不触发重绘）
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);
  renderCount.current++;

  // 4. useEffect: 处理副作用（数据获取、订阅、手动修改 DOM）
  useEffect(() => {
    console.log('组件挂载或 count 改变了');
    // 清理函数：组件卸载或下次 effect 执行前调用
    return () => console.log('清理副作用');
  }, [state.count]);

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">Hooks 深度解析</h2>
        <p className="text-slate-500">掌握 Hooks 是现代 React 开发的核心。</p>
      </header>

      {/* useState 示例 */}
      <DemoSection 
        title="useState: 基础状态" 
        icon={<Info size={20} />} 
        iconColorClass="text-blue-600"
      >
        <div className="space-y-4">
          <p className="text-lg">你好，<span className="font-bold text-blue-600">{name}</span></p>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="输入你的名字"
          />
          <p className="text-xs text-slate-400 italic">// 注释：useState 返回一个状态值和更新它的函数。</p>
        </div>
        <div>
          <CodeBlock 
            title="useState 示例代码"
            code={`const [name, setName] = useState('React 学习者');

// 渲染输入框
<input 
  type="text" 
  value={name}
  onChange={(e) => setName(e.target.value)}
/>`} 
          />
        </div>
      </DemoSection>

      {/* useReducer 示例 */}
      <DemoSection 
        title="useReducer: 复杂逻辑" 
        icon={<RotateCcw size={20} />} 
        iconColorClass="text-purple-600"
      >
        <div>
          <div className="flex items-center gap-6">
            <div className="text-4xl font-mono font-bold w-20 text-center">{state.count}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch({ type: 'decrement' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
              >
                -
              </button>
              <button 
                onClick={() => dispatch({ type: 'increment' })}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold"
              >
                +
              </button>
              <button 
                onClick={() => dispatch({ type: 'reset' })}
                className="px-4 py-2 text-slate-500 hover:text-slate-700"
              >
                重置
              </button>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 italic">// 注释：当状态逻辑复杂时，useReducer 比 useState 更清晰，且易于测试。</p>
        </div>
        <div>
          <CodeBlock 
            title="useReducer 示例代码"
            code={`const counterReducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return { count: 0 };
    default: return state;
  }
};

const [state, dispatch] = useReducer(counterReducer, { count: 0 });

// 触发更新
<button onClick={() => dispatch({ type: 'increment' })}>+</button>`} 
          />
        </div>
      </DemoSection>

      {/* useRef 示例 */}
      <DemoSection 
        title="useRef: DOM 访问与持久化" 
        icon={<Play size={20} />} 
        iconColorClass="text-emerald-600"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              ref={inputRef}
              type="text" 
              className="px-4 py-2 border border-slate-200 rounded-lg outline-none"
              placeholder="点击按钮聚焦我"
            />
            <button 
              onClick={() => inputRef.current?.focus()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
            >
              聚焦输入框
            </button>
          </div>
          <p className="text-sm text-slate-600">
            本组件已渲染次数: <span className="font-bold text-emerald-600">{renderCount.current}</span>
          </p>
          <p className="text-xs text-slate-400 italic">// 注释：useRef 的改变不会触发重新渲染，非常适合存储定时器 ID 或 DOM 引用。</p>
        </div>
        <div>
          <CodeBlock 
            title="useRef 示例代码"
            code={`const inputRef = useRef<HTMLInputElement>(null);
const renderCount = useRef(0);

// 每次渲染自增，但不触发重绘
renderCount.current++;

// 绑定 DOM 并操作
<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>
  聚焦输入框
</button>`} 
          />
        </div>
      </DemoSection>
    </div>
  );
}

import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { MousePointer2, Target, Eye, EyeOff, Zap, Terminal, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

/**
 * 1. 基本用法：访问 DOM 元素
 */
const DomAccess = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    // 直接调用 DOM API
    inputRef.current?.focus();
    if (inputRef.current) {
      inputRef.current.style.borderColor = '#3b82f6';
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
        <Target size={20} />
        <span>DOM 访问 (useRef)</span>
      </div>
      <p className="text-sm text-slate-600">
        useRef 最常见的用途是访问 DOM 节点。它返回一个持久的对象，其 .current 属性指向该节点。
      </p>
      <div className="flex gap-2">
        <input 
          ref={inputRef}
          type="text" 
          placeholder="点击按钮聚焦我..."
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none transition-all"
        />
        <button 
          onClick={handleFocus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          聚焦输入框
        </button>
      </div>
    </div>
  );
};

/**
 * 2. 存储可变值 (Mutable Values)
 * useRef 的值改变不会触发重新渲染
 */
const MutableValue = () => {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-purple-600 font-bold mb-2">
        <Zap size={20} />
        <span>存储可变值</span>
      </div>
      <p className="text-sm text-slate-600">
        useRef 可以存储任何在渲染之间保持不变的值，且修改它<strong>不会</strong>触发组件重新渲染。
      </p>
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">State 计数 (触发渲染)</p>
          <p className="text-2xl font-bold text-slate-900">{count}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">总渲染次数 (Ref 记录)</p>
          <p className="text-2xl font-bold text-purple-600">{renderCount.current}</p>
        </div>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          +1
        </button>
      </div>
    </div>
  );
};

/**
 * 3. forwardRef & useImperativeHandle
 * 向父组件暴露自定义方法
 */
const CustomInput = forwardRef((props, ref) => {
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => setValue(''),
    getValue: () => value
  }));

  return (
    <div className="relative">
      <input 
        ref={inputRef}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 border border-slate-200 rounded-lg pr-10 outline-none focus:ring-2 focus:ring-emerald-500"
        placeholder="输入密码..."
      />
      <button 
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

const ForwardRefDemo = () => {
  const customInputRef = useRef<any>(null);

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
        <Layers size={20} />
        <span>forwardRef & useImperativeHandle</span>
      </div>
      <p className="text-sm text-slate-600">
        当你想从父组件调用子组件内部的方法（如聚焦、清除）时，需要使用这两个 Hook。
      </p>
      <CustomInput ref={customInputRef} />
      <div className="flex gap-2 pt-2">
        <button 
          onClick={() => customInputRef.current?.focus()}
          className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md hover:bg-emerald-100"
        >
          聚焦
        </button>
        <button 
          onClick={() => customInputRef.current?.clear()}
          className="text-xs px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-100 rounded-md hover:bg-slate-100"
        >
          清除内容
        </button>
        <button 
          onClick={() => alert('当前值: ' + customInputRef.current?.getValue())}
          className="text-xs px-3 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800"
        >
          获取值
        </button>
      </div>
    </div>
  );
};

export default function RefsDemo() {
  return (
    <div className="space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">Refs 体系 (useRef & forwardRef)</h2>
        <p className="text-slate-500">掌握 React 中“逃生舱”的使用，处理 DOM 交互与持久化数据。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DomAccess />
        <MutableValue />
        <div className="lg:col-span-2">
          <ForwardRefDemo />
        </div>
      </div>

      <section className="bg-slate-900 text-slate-300 p-8 rounded-3xl shadow-xl font-mono text-sm relative overflow-hidden">
        <div className="absolute top-4 right-4 text-slate-700 select-none flex items-center gap-2">
          <Terminal size={16} /> CHEAT SHEET
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-white font-bold border-b border-slate-700 pb-2">何时使用 Ref？</h4>
            <ul className="space-y-2 opacity-80">
              <li>• 管理焦点、文本选择或媒体播放</li>
              <li>• 触发强制动画</li>
              <li>• 集成第三方 DOM 库 (如 D3.js, ECharts)</li>
              <li>• 存储不需要触发渲染的变量 (如定时器 ID)</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold border-b border-slate-700 pb-2">注意事项</h4>
            <ul className="space-y-2 opacity-80">
              <li>• <strong>不要滥用：</strong> 优先考虑声明式数据流</li>
              <li>• <strong>不要在渲染期间读写：</strong> 应该在 useEffect 或事件处理函数中操作</li>
              <li>• <strong>Ref 是持久的：</strong> 在组件的整个生命周期内保持不变</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wrench, MousePointer, Monitor, Database, Clock, Search } from 'lucide-react';

/**
 * 1. useLocalStorage: 持久化状态
 */
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

/**
 * 2. useWindowSize: 响应式监听
 */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * 3. useDebounce: 防抖逻辑
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 4. usePrevious: 获取上一次的状态
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const CustomHooks = () => {
  // Demo 1: LocalStorage
  const [name, setName] = useLocalStorage('user-name', '匿名大侠');
  
  // Demo 2: Window Size
  const { width, height } = useWindowSize();
  
  // Demo 3: Debounce
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Demo 4: Previous
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold mb-2">自定义 Hooks (Custom Hooks)</h2>
        <p className="text-slate-500">将组件逻辑提取到可重用的函数中，实现真正的代码复用。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LocalStorage Demo */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-purple-600 font-bold">
            <Database size={20} />
            <span>useLocalStorage</span>
          </div>
          <p className="text-sm text-slate-500 italic">刷新页面，数据依然存在。</p>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="输入你的名字..."
          />
          <div className="p-3 bg-purple-50 rounded-lg text-purple-700 text-sm">
            当前存储值: <span className="font-bold">{name}</span>
          </div>
        </section>

        {/* Window Size Demo */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Monitor size={20} />
            <span>useWindowSize</span>
          </div>
          <p className="text-sm text-slate-500 italic">尝试调整浏览器窗口大小。</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-xs text-blue-600 mb-1 uppercase tracking-wider">Width</p>
              <p className="text-2xl font-bold text-blue-800">{width}px</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-xs text-blue-600 mb-1 uppercase tracking-wider">Height</p>
              <p className="text-2xl font-bold text-blue-800">{height}px</p>
            </div>
          </div>
        </section>

        {/* Debounce Demo */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-orange-600 font-bold">
            <Search size={20} />
            <span>useDebounce</span>
          </div>
          <p className="text-sm text-slate-500 italic">减少高频触发（如搜索建议、窗口缩放）。</p>
          <div className="relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="快速输入试试..."
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">实时输入: <span className="text-slate-600">{searchTerm}</span></p>
            <p className="text-xs text-orange-600 font-bold">防抖结果 (500ms): <span>{debouncedSearch}</span></p>
          </div>
        </section>

        {/* Previous Demo */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <Clock size={20} />
            <span>usePrevious</span>
          </div>
          <p className="text-sm text-slate-500 italic">在函数组件中追踪“旧值”。</p>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-1">Previous</p>
              <p className="text-3xl font-bold text-slate-300">{prevCount ?? '-'}</p>
            </div>
            <div className="text-4xl text-slate-200">→</div>
            <div className="text-center">
              <p className="text-xs text-green-600 mb-1">Current</p>
              <p className="text-3xl font-bold text-green-600">{count}</p>
            </div>
          </div>
          <button 
            onClick={() => setCount(c => c + 1)}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            增加计数
          </button>
        </section>
      </div>

      <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl shadow-xl font-mono text-sm">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <Wrench size={18} />
          自定义 Hook 设计原则
        </h4>
        <ul className="space-y-3">
          <li className="flex gap-2">
            <span className="text-blue-400">1.</span>
            <span>必须以 <code className="text-blue-400">use</code> 开头命名。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">2.</span>
            <span>内部可以调用其他 Hooks（如 useState, useEffect）。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">3.</span>
            <span>不共享状态，只共享逻辑。每个组件调用 Hook 都会产生独立的 State。</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400">4.</span>
            <span>适合提取：API 请求、表单处理、监听器、复杂计算。</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomHooks;

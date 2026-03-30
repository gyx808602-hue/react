import React, { useState, useEffect } from 'react';
import { Puzzle, Code, Globe, Terminal } from 'lucide-react';

/**
 * 自定义 Hook 示例：监听窗口大小
 * 逻辑复用的最佳实践
 */
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * 自定义 Hook 示例：模拟 API 请求
 */
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default function AdvancedPatterns() {
  const { width, height } = useWindowSize();
  const { data, loading } = useFetch<any>('https://jsonplaceholder.typicode.com/todos/1');

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold mb-2">高级模式 (Advanced Patterns)</h2>
        <p className="text-slate-500">掌握自定义 Hooks 和逻辑复用，写出优雅的代码。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 自定义 Hook 1 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Globe size={20} />
            <span>自定义 Hook: useWindowSize</span>
          </div>
          
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex justify-around items-center">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">宽度</p>
              <p className="text-3xl font-bold text-blue-600">{width}px</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">高度</p>
              <p className="text-3xl font-bold text-blue-600">{height}px</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            尝试调整浏览器窗口大小，观察数值变化。
          </p>
        </section>

        {/* 自定义 Hook 2 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-purple-600 font-bold">
            <Terminal size={20} />
            <span>自定义 Hook: useFetch</span>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-xl text-emerald-400 font-mono text-sm min-h-[120px] flex items-center justify-center">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                正在加载 API 数据...
              </div>
            ) : (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
          <p className="text-sm text-slate-600">
            封装通用的异步逻辑，让组件代码更简洁。
          </p>
        </section>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Code size={24} /> 为什么使用自定义 Hooks？
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h4 className="text-blue-400 font-bold">1. 逻辑复用</h4>
            <p className="text-slate-400 text-sm">
              将组件中与 UI 无关的逻辑（如数据获取、表单验证、事件监听）抽离出来，在多个组件间共享。
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-blue-400 font-bold">2. 关注点分离</h4>
            <p className="text-slate-400 text-sm">
              让组件只负责渲染 UI，而复杂的业务逻辑隐藏在 Hook 内部，提高代码的可读性和可维护性。
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-blue-400 font-bold">3. 易于测试</h4>
            <p className="text-slate-400 text-sm">
              独立的 Hook 可以单独进行单元测试，不需要渲染整个组件树。
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-blue-400 font-bold">4. 组合优于继承</h4>
            <p className="text-slate-400 text-sm">
              通过组合多个 Hooks，可以构建出功能极其强大的逻辑块，而不会陷入 HOC 的“嵌套地狱”。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, AlertCircle, CheckCircle2, Server, Terminal } from 'lucide-react';
import { cn } from '@/src/lib/utils';
/**
 * 模拟后端服务 (Mock API)
 */
const mockApiService = {
  fetchUserData: async (id: number) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟随机错误
    if (id === 404) throw new Error('用户未找到 (404)');
    if (Math.random() > 0.8) throw new Error('服务器繁忙，请稍后再试 (500)');
    
    return {
      id,
      name: `用户_${id}`,
      email: `user${id}@example.com`,
      role: id % 2 === 0 ? '管理员' : '普通用户',
      lastLogin: new Date().toLocaleString()
    };
  }
};

export default function DataFetching() {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 核心逻辑：处理前后端联调
   * 包含：Loading 状态、错误处理、竞态条件 (Race Condition) 处理
   */
  useEffect(() => {
    let isMounted = true; // 防止竞态条件的 flag
    const controller = new AbortController(); // 模拟请求取消

    const loadData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await mockApiService.fetchUserData(userId);
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // 清理函数：组件卸载或下一次 useEffect 执行前调用
    return () => {
      isMounted = false;
      controller.abort(); // 实际开发中用于取消 fetch 请求
    };
  }, [userId]);

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">前后端联调 (Data Fetching)</h2>
        <p className="text-slate-500">模拟真实 API 请求，掌握异步逻辑处理的最佳实践。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 控制面板 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Server size={20} />
            <span>模拟请求控制</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 404].map(id => (
                <button
                  key={id}
                  onClick={() => setUserId(id)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all",
                    userId === id 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  请求用户 {id === 404 ? '404' : id}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              点击上方按钮模拟不同 ID 的 API 请求。ID 404 会触发模拟错误。
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Terminal size={16} /> 联调逻辑清单
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 状态管理 (Loading/Error/Data)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 竞态条件处理 (Ignore Flag)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 组件卸载时的请求取消</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> 错误边界与重试机制</li>
            </ul>
          </div>
        </section>

        {/* 结果展示 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <RefreshCw size={20} className={cn(loading && "animate-spin")} />
              <span>API 响应结果</span>
            </div>
            {loading && <span className="text-xs font-medium text-blue-600 animate-pulse">正在通信中...</span>}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {loading && (
              <div className="space-y-4 w-full">
                <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-10 bg-slate-50 rounded-lg animate-pulse w-3/4" />
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center space-y-3 w-full">
                <AlertCircle size={40} className="text-red-500 mx-auto" />
                <p className="text-red-700 font-bold">{error}</p>
                <button 
                  onClick={() => setUserId(userId)} 
                  className="text-sm text-red-600 underline font-medium"
                >
                  重新尝试请求
                </button>
              </div>
            )}

            {data && !loading && (
              <div className="w-full space-y-4">
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {data.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{data.name}</h4>
                      <p className="text-xs text-slate-500">{data.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-emerald-100">
                    <div>
                      <p className="text-slate-400">角色</p>
                      <p className="font-medium">{data.role}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">最后登录</p>
                      <p className="font-medium text-[10px]">{data.lastLogin}</p>
                    </div>
                  </div>
                </div>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-auto max-h-32">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="bg-blue-600 rounded-3xl p-10 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-6">💡 生产环境建议：React Query</h3>
        <p className="mb-6 opacity-90 leading-relaxed">
          在真实的商业项目中，我们很少手动编写上述所有逻辑。行业标准是使用 <strong>TanStack Query (React Query)</strong>。
          它可以自动处理缓存、自动重试、窗口聚焦重新获取、分页等复杂功能。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="font-bold mb-1">手动 Fetch (本页演示)</p>
            <p className="text-xs opacity-70">适合简单场景，帮助理解 React 生命周期与副作用。</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="font-bold mb-1">React Query (推荐)</p>
            <p className="text-xs opacity-70">适合所有中大型项目，极大简化数据同步逻辑。</p>
          </div>
        </div>
      </div>
    </div>
  );
}

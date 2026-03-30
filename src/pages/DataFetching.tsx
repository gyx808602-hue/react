import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, AlertCircle, CheckCircle2, Server, Terminal, Zap, Code, Send } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/src/lib/utils';
import DemoSection from '../components/DemoSection';
import CodeBlock from '../components/CodeBlock';

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
  },
  updateUserData: async (id: number, newName: string) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟随机错误
    if (Math.random() > 0.8) throw new Error('更新失败，请重试');
    
    return { success: true, id, name: newName };
  }
};

// =========================================================================
// 自定义 Hook 封装 React Query (最佳实践)
// =========================================================================
function useUserData(userId: number) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => mockApiService.fetchUserData(userId),
    retry: 1,
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, name }: { id: number, name: string }) => mockApiService.updateUserData(id, name),
    onSuccess: (_, variables) => {
      // 更新成功后，立即使缓存失效，触发重新请求，或者直接更新缓存
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    }
  });
}

export default function DataFetching() {
  const [userId, setUserId] = useState(1);

  // =========================================================================
  // 方法一：传统的 useEffect + useState 方式
  // =========================================================================
  const [tradData, setTradData] = useState<any>(null);
  const [tradLoading, setTradLoading] = useState(false);
  const [tradError, setTradError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // 防止竞态条件的 flag
    
    const loadData = async () => {
      setTradLoading(true);
      setTradError(null);
      setTradData(null);

      try {
        const result = await mockApiService.fetchUserData(userId);
        if (isMounted) setTradData(result);
      } catch (err: any) {
        if (isMounted) setTradError(err.message);
      } finally {
        if (isMounted) setTradLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false; // 清理函数：组件卸载或下一次执行前调用
    };
  }, [userId]);

  // =========================================================================
  // 方法二：现代的 React Query 方式 (@tanstack/react-query)
  // =========================================================================
  const { 
    data: queryData, 
    isLoading: queryLoading, 
    isError: queryIsError, 
    error: queryError,
    refetch: queryRefetch,
    isFetching: queryIsFetching
  } = useQuery({
    queryKey: ['user', userId], // 缓存的唯一标识，当 userId 改变时自动重新请求
    queryFn: () => mockApiService.fetchUserData(userId),
    retry: 1, // 失败重试次数
  });

  // =========================================================================
  // 方法三：React Query 自定义 Hook + 数据修改 (Mutation)
  // =========================================================================
  const { data: customData, isLoading: customLoading } = useUserData(userId);
  const updateUserMutation = useUpdateUser();
  const [newName, setNewName] = useState('');

  const handleUpdate = () => {
    if (!newName.trim()) return;
    updateUserMutation.mutate({ id: userId, name: newName });
  };

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">前后端联调 (Data Fetching)</h2>
        <p className="text-slate-500">
          前端开发中最常见的任务。这里展示了传统的 <code>useEffect</code> 方式与现代的 <code>React Query</code> 方式的对比，以及最佳实践。
        </p>
      </header>

      {/* 全局控制面板 */}
      <div className="bg-slate-800 p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-slate-300 text-sm mb-1">全局请求参数控制</p>
          <p className="text-xs text-slate-400">点击下方按钮改变 userId，观察下方所有请求方式的反应。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 404].map(id => (
            <button
              key={id}
              onClick={() => setUserId(id)}
              className={cn(
                "px-4 py-2 rounded-lg font-bold transition-all shadow-md",
                userId === id 
                  ? "bg-blue-600 text-white shadow-blue-900/50" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600"
              )}
            >
              请求用户 {id === 404 ? '404' : id}
            </button>
          ))}
        </div>
      </div>

      {/* 方法一：传统方式 */}
      <DemoSection 
        title="方法一：传统 useEffect 方式" 
        icon={<Server size={20} />} 
        iconColorClass="text-slate-600"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-600 font-bold">
              <RefreshCw size={18} className={cn(tradLoading && "animate-spin")} />
              <span>状态: {tradLoading ? '请求中...' : tradError ? '错误' : '成功'}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] border border-slate-200 rounded-xl bg-slate-50 p-6">
            {tradLoading && (
              <div className="space-y-4 w-full">
                <div className="h-16 bg-slate-200 rounded-xl animate-pulse" />
                <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-3/4" />
              </div>
            )}

            {tradError && (
              <div className="text-center space-y-2">
                <AlertCircle size={32} className="text-red-500 mx-auto" />
                <p className="text-red-600 font-bold">{tradError}</p>
              </div>
            )}

            {tradData && !tradLoading && (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                    {tradData.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{tradData.name}</h4>
                    <p className="text-xs text-slate-500">{tradData.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            <strong>痛点：</strong>需要手动管理 loading、error、data 三个状态，还要处理竞态条件（isMounted flag），且没有缓存机制。
          </p>
        </div>
        <div>
          <CodeBlock 
            title="useEffect Fetch 核心代码"
            code={`const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  let isMounted = true; // 防止竞态条件
  
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchUser(userId);
      if (isMounted) setData(result);
    } catch (err) {
      if (isMounted) setError(err.message);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  loadData();
  return () => { isMounted = false; };
}, [userId]);`} 
          />
        </div>
      </DemoSection>

      {/* 方法二：React Query 方式 */}
      <DemoSection 
        title="方法二：React Query 方式 (基础)" 
        icon={<Zap size={20} />} 
        iconColorClass="text-blue-600"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <RefreshCw size={18} className={cn(queryIsFetching && "animate-spin")} />
              <span>状态: {queryLoading ? '首次加载中...' : queryIsFetching ? '后台刷新中...' : queryIsError ? '错误' : '成功'}</span>
            </div>
            {queryIsError && (
              <button 
                onClick={() => queryRefetch()} 
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-bold"
              >
                重试
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px] border border-blue-100 rounded-xl bg-blue-50/50 p-6 relative overflow-hidden">
            {queryLoading ? (
              <div className="space-y-4 w-full">
                <div className="h-16 bg-blue-100 rounded-xl animate-pulse" />
                <div className="h-8 bg-blue-100 rounded-lg animate-pulse w-3/4" />
              </div>
            ) : queryIsError ? (
              <div className="text-center space-y-2 z-10">
                <AlertCircle size={32} className="text-red-500 mx-auto" />
                <p className="text-red-600 font-bold">{(queryError as Error).message}</p>
              </div>
            ) : queryData ? (
              <div className="w-full z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {queryData.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{queryData.name}</h4>
                    <p className="text-xs text-slate-500">{queryData.email}</p>
                  </div>
                </div>
              </div>
            ) : null}
            
            {/* 缓存提示水印 */}
            {!queryLoading && !queryIsFetching && queryData && (
              <div className="absolute -bottom-4 -right-4 text-6xl font-black text-blue-500/5 select-none pointer-events-none">
                CACHED
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            <strong>优势：</strong>代码极简，自带缓存（切换回请求过的 ID 瞬间显示），自带重试机制，支持后台静默刷新。
          </p>
        </div>
        <div>
          <CodeBlock 
            title="React Query 核心代码"
            code={`import { useQuery } from '@tanstack/react-query';

const { 
  data, 
  isLoading, // 首次加载状态
  isError, 
  error,
  isFetching // 任何时候正在请求的状态
} = useQuery({
  // queryKey 是缓存的唯一标识
  queryKey: ['user', userId], 
  // queryFn 是实际的请求函数
  queryFn: () => fetchUser(userId),
  // 失败自动重试 1 次
  retry: 1, 
});`} 
          />
        </div>
      </DemoSection>

      {/* 方法三：自定义 Hook + Mutation */}
      <DemoSection 
        title="方法三：自定义 Hook + 数据修改 (最佳实践)" 
        icon={<Code size={20} />} 
        iconColorClass="text-emerald-600"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col min-h-[200px] border border-emerald-100 rounded-xl bg-emerald-50/30 p-6">
            <h4 className="font-bold text-emerald-800 mb-4">当前用户信息 (来自自定义 Hook)</h4>
            
            {customLoading ? (
              <div className="h-10 bg-emerald-100 rounded-lg animate-pulse w-1/2 mb-6" />
            ) : customData ? (
              <div className="text-lg font-bold text-slate-800 mb-6">
                {customData.name} <span className="text-sm font-normal text-slate-500">({customData.role})</span>
              </div>
            ) : (
              <div className="text-slate-500 mb-6">暂无数据</div>
            )}

            <div className="mt-auto border-t border-emerald-100 pt-4">
              <h5 className="text-sm font-bold text-slate-700 mb-2">修改用户名 (Mutation)</h5>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="输入新名字..."
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={updateUserMutation.isPending || !customData}
                />
                <button 
                  onClick={handleUpdate}
                  disabled={updateUserMutation.isPending || !customData || !newName.trim()}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updateUserMutation.isPending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  更新
                </button>
              </div>
              {updateUserMutation.isError && (
                <p className="text-red-500 text-xs mt-2">{(updateUserMutation.error as Error).message}</p>
              )}
              {updateUserMutation.isSuccess && (
                <p className="text-emerald-600 text-xs mt-2">更新成功！缓存已自动失效并重新获取。</p>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            <strong>最佳实践：</strong>将 <code>useQuery</code> 封装为自定义 Hook (<code>useUserData</code>)，并在修改数据时使用 <code>useMutation</code>，成功后调用 <code>invalidateQueries</code> 自动刷新数据。
          </p>
        </div>
        <div>
          <CodeBlock 
            title="自定义 Hook & Mutation 代码"
            code={`// 1. 封装 Query Hook
function useUserData(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}

// 2. 封装 Mutation Hook
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }) => updateUser(id, name),
    onSuccess: (_, variables) => {
      // 成功后使特定缓存失效，触发自动重新请求
      queryClient.invalidateQueries({ 
        queryKey: ['user', variables.id] 
      });
    }
  });
}

// 3. 在组件中使用
const { data } = useUserData(userId);
const mutation = useUpdateUser();

// 触发更新
mutation.mutate({ id: userId, name: '新名字' });`} 
          />
        </div>
      </DemoSection>

      {/* 总结对比 */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Terminal size={20} className="text-blue-600" /> 为什么现代 React 放弃了 useEffect Fetch？
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>缓存机制 (Caching)：</strong>React Query 会缓存请求结果。当你请求过 User 1，再去请求 User 2，再切回 User 1 时，React Query 会瞬间显示缓存数据，并在后台静默更新。</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>请求去重 (Deduplication)：</strong>如果页面上有 3 个组件同时请求同一个接口，React Query 会将它们合并为一个网络请求。</span>
            </li>
          </ul>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>自动重试 (Auto Retries)：</strong>网络波动导致请求失败时，React Query 默认会自动重试（可配置次数）。</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>数据修改与同步 (Mutations)：</strong>使用 <code>useMutation</code> 修改数据后，可以轻松地让相关缓存失效，自动拉取最新数据，保持 UI 同步。</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

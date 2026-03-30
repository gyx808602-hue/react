/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import AppRouter from './router';
import ErrorBoundary from './components/ErrorBoundary';

// 创建一个 React Query 客户端实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 默认关闭窗口聚焦重新获取
      retry: 1, // 失败重试次数
    },
  },
});

/**
 * React 全方位学习指南 - 主入口
 * 
 * 这里展示了：
 * 1. 错误边界 (ErrorBoundary) 捕获全局异常
 * 2. React Router 的组件化路由配置 (AppRouter)
 * 3. 布局组件 (Layout) 的封装
 * 4. React Query 提供者 (QueryClientProvider)
 */
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <AppRouter />
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}


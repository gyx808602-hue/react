import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

// 页面组件导入
import Home from '../pages/Home';
import HooksDemo from '../pages/HooksDemo';
import StateManagement from '../pages/StateManagement';
import Performance from '../pages/Performance';
import AdvancedPatterns from '../pages/AdvancedPatterns';
import DataFetching from '../pages/DataFetching';
import UncommonFeatures from '../pages/UncommonFeatures';
import RefsDemo from '../pages/RefsDemo';
import CustomHooks from '../pages/CustomHooks';
import SuspensePortals from '../pages/SuspensePortals';
import Architecture from '../pages/Architecture';
import WorkScenarios from '../pages/WorkScenarios';
import Evolution from '../pages/Evolution';
import InterviewPrep from '../pages/InterviewPrep';

// 加载占位组件
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

/**
 * 路由配置组件
 * 使用 useRoutes 钩子实现声明式路由
 */
export default function AppRouter() {
  const element = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/hooks', element: <HooksDemo /> },
    { path: '/state', element: <StateManagement /> },
    { path: '/fetching', element: <DataFetching /> },
    { path: '/refs', element: <RefsDemo /> },
    { path: '/custom-hooks', element: <CustomHooks /> },
    { path: '/suspense-portals', element: <SuspensePortals /> },
    { path: '/architecture', element: <Architecture /> },
    { path: '/performance', element: <Performance /> },
    { path: '/advanced', element: <AdvancedPatterns /> },
    { path: '/uncommon', element: <UncommonFeatures /> },
    { path: '/work', element: <WorkScenarios /> },
    { path: '/evolution', element: <Evolution /> },
    { path: '/interview', element: <InterviewPrep /> },
  ]);

  return (
    <Suspense fallback={<PageLoader />}>
      {element}
    </Suspense>
  );
}

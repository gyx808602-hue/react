/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HooksDemo from './pages/HooksDemo';
import StateManagement from './pages/StateManagement';
import Performance from './pages/Performance';
import AdvancedPatterns from './pages/AdvancedPatterns';
import DataFetching from './pages/DataFetching';
import UncommonFeatures from './pages/UncommonFeatures';
import RefsDemo from './pages/RefsDemo';
import CustomHooks from './pages/CustomHooks';
import SuspensePortals from './pages/SuspensePortals';
import Architecture from './pages/Architecture';
import WorkScenarios from './pages/WorkScenarios';
import Evolution from './pages/Evolution';
import InterviewPrep from './pages/InterviewPrep';

/**
 * React 全方位学习指南 - 主入口
 * 
 * 这里展示了：
 * 1. React Router 的基本用法 (BrowserRouter, Routes, Route)
 * 2. 布局组件 (Layout) 的封装
 * 3. 页面组件的按需加载 (本例为直接导入)
 */
export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hooks" element={<HooksDemo />} />
          <Route path="/state" element={<StateManagement />} />
          <Route path="/fetching" element={<DataFetching />} />
          <Route path="/refs" element={<RefsDemo />} />
          <Route path="/custom-hooks" element={<CustomHooks />} />
          <Route path="/suspense-portals" element={<SuspensePortals />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/advanced" element={<AdvancedPatterns />} />
          <Route path="/uncommon" element={<UncommonFeatures />} />
          <Route path="/work" element={<WorkScenarios />} />
          <Route path="/evolution" element={<Evolution />} />
          <Route path="/interview" element={<InterviewPrep />} />
        </Routes>
      </Layout>
    </Router>
  );
}


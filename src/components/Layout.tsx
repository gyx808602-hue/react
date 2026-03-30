import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  Layers, 
  Activity, 
  Puzzle, 
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  History,
  Briefcase,
  Globe,
  FlaskConical,
  MousePointer2,
  Wrench,
  Box,
  FolderTree
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem = ({ to, icon, label, active }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
    )}
  >
    <span className={cn("transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")}>
      {icon}
    </span>
    <span className="font-medium">{label}</span>
    {active && <ChevronRight className="ml-auto w-4 h-4" />}
  </Link>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* 侧边栏 */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={24} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">React Masterclass</h1>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <SidebarItem 
              to="/" 
              icon={<LayoutDashboard size={18} />} 
              label="核心概念 (Core)" 
              active={location.pathname === "/"} 
            />
            <SidebarItem 
              to="/hooks" 
              icon={<Activity size={18} />} 
              label="Hooks 深度解析" 
              active={location.pathname === "/hooks"} 
            />
            <SidebarItem 
              to="/state" 
              icon={<Layers size={18} />} 
              label="状态管理 (State)" 
              active={location.pathname === "/state"} 
            />
            <SidebarItem 
              to="/fetching" 
              icon={<Globe size={18} />} 
              label="前后端联调 (API)" 
              active={location.pathname === "/fetching"} 
            />
            <SidebarItem 
              to="/refs" 
              icon={<MousePointer2 size={18} />} 
              label="Refs 体系" 
              active={location.pathname === "/refs"} 
            />
            <SidebarItem 
              to="/custom-hooks" 
              icon={<Wrench size={18} />} 
              label="自定义 Hooks" 
              active={location.pathname === "/custom-hooks"} 
            />
            <SidebarItem 
              to="/suspense-portals" 
              icon={<Box size={18} />} 
              label="Suspense & Portals" 
              active={location.pathname === "/suspense-portals"} 
            />
            <SidebarItem 
              to="/architecture" 
              icon={<FolderTree size={18} />} 
              label="架构与最佳实践" 
              active={location.pathname === "/architecture"} 
            />
            <SidebarItem 
              to="/performance" 
              icon={<Zap size={18} />} 
              label="性能优化 (Performance)" 
              active={location.pathname === "/performance"} 
            />
            <SidebarItem 
              to="/advanced" 
              icon={<Puzzle size={18} />} 
              label="高级模式 (Advanced)" 
              active={location.pathname === "/advanced"} 
            />
            <SidebarItem 
              to="/uncommon" 
              icon={<FlaskConical size={18} />} 
              label="冷门/高级 API" 
              active={location.pathname === "/uncommon"} 
            />
            <SidebarItem 
              to="/work" 
              icon={<Briefcase size={18} />} 
              label="实战场景 (Work)" 
              active={location.pathname === "/work"} 
            />
            <SidebarItem 
              to="/evolution" 
              icon={<History size={18} />} 
              label="版本演进 (Evolution)" 
              active={location.pathname === "/evolution"} 
            />
            <SidebarItem 
              to="/interview" 
              icon={<HelpCircle size={18} />} 
              label="面试通关秘籍" 
              active={location.pathname === "/interview"} 
            />
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-2">学习进度</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-1/3 rounded-full" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">持续进阶中...</p>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-bottom border-slate-200 flex items-center px-8 sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">React Learner</p>
              <p className="text-xs text-slate-500">Level: Intermediate</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-sm" />
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

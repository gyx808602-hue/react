import React, { useState, useTransition, useActionState } from 'react';
import { Briefcase, FormInput, ShieldAlert, Layout, MousePointer2, Send } from 'lucide-react';

/**
 * 1. 错误边界 (Error Boundary) 示例
 * 注意：目前错误边界仍需使用 Class 组件或第三方库
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <h4 className="font-bold flex items-center gap-2 mb-2">
            <ShieldAlert size={18} /> 组件崩溃了
          </h4>
          <p className="text-sm">这是一个错误边界捕获的异常，防止了整个应用白屏。</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const BuggyComponent = () => {
  const [shouldCrash, setShouldCrash] = useState(false);
  if (shouldCrash) throw new Error('故意制造的崩溃');
  return (
    <button 
      onClick={() => setShouldCrash(true)}
      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm transition-colors"
    >
      点击模拟组件错误
    </button>
  );
};

/**
 * 2. React 19 Action 示例 (模拟)
 */
const ActionForm = () => {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('提交成功！');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        required
        placeholder="输入反馈内容..."
        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isPending ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <><Send size={18} /> 提交反馈</>
        )}
      </button>
      {message && <p className="text-sm text-emerald-600 font-medium">{message}</p>}
    </form>
  );
};

export default function WorkScenarios() {
  return (
    <div className="space-y-12 pb-20">
      <header>
        <h2 className="text-3xl font-bold mb-2">实战场景 (Work Scenarios)</h2>
        <p className="text-slate-500">在真实工作中，你会遇到的复杂情况及解决方案。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 错误处理 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <ShieldAlert size={20} />
            <span>健壮性：错误边界</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            在大型应用中，某个小组件的错误不应导致整个页面崩溃。错误边界（Error Boundary）是生产环境的必备。
          </p>
          <ErrorBoundary>
            <BuggyComponent />
          </ErrorBoundary>
          <p className="text-xs text-slate-400 italic">// 注释：错误边界只能通过 Class 组件实现，或使用 react-error-boundary 库。</p>
        </section>

        {/* 表单与 Action */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <FormInput size={20} />
            <span>交互：表单与异步 Action</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            React 19 强化了对表单的处理。通过 Transition 和 Action，我们可以更优雅地处理 Loading 状态。
          </p>
          <ActionForm />
          <p className="text-xs text-slate-400 italic">// 注释：在实际工作中，推荐使用 React Hook Form + Zod 进行表单校验。</p>
        </section>

        {/* 传送门 Portal */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold">
            <Layout size={20} />
            <span>布局：Portals (传送门)</span>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的方法。常用于：
              </p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center gap-2"><MousePointer2 size={14} /> 模态框 (Modals)</li>
                <li className="flex items-center gap-2"><MousePointer2 size={14} /> 悬浮卡片 (Tooltips)</li>
                <li className="flex items-center gap-2"><MousePointer2 size={14} /> 全局通知 (Toasts)</li>
              </ul>
            </div>
            <div className="w-full md:w-72 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
              <p className="text-xs text-slate-500 mb-4">React.createPortal(child, container)</p>
              <div className="py-4 px-2 bg-white rounded shadow-sm border border-slate-200 text-xs font-mono">
                {"<div id='modal-root'></div>"}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
        <h4 className="font-bold text-indigo-900 mb-4">企业级项目规范建议</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-white p-4 rounded-xl border border-indigo-100">
            <p className="font-bold text-indigo-700 mb-2">目录结构</p>
            <ul className="space-y-1 text-slate-600">
              <li>• components/ (通用 UI)</li>
              <li>• hooks/ (业务逻辑复用)</li>
              <li>• services/ (API 请求)</li>
              <li>• store/ (全局状态)</li>
              <li>• utils/ (工具函数)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-xl border border-indigo-100">
            <p className="font-bold text-indigo-700 mb-2">代码质量</p>
            <ul className="space-y-1 text-slate-600">
              <li>• 强制使用 TypeScript</li>
              <li>• ESLint + Prettier 自动化校验</li>
              <li>• 单元测试 (Vitest / Jest)</li>
              <li>• 核心业务逻辑必须有注释</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = (props: any) => {
  const { question, answer } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-blue-600 transition-colors"
      >
        <span className="text-lg font-semibold pr-8">{question}</span>
        {isOpen ? <ChevronUp className="shrink-0" /> : <ChevronDown className="shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-slate-600 leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function InterviewPrep() {
  const faqs = [
    {
      question: "React 中的虚拟 DOM 是什么？它是如何提高性能的？",
      answer: "虚拟 DOM (Virtual DOM) 是真实 DOM 的轻量级 JavaScript 对象表示。\n\n工作原理：\n1. 状态变更时，React 创建一个新的虚拟 DOM 树。\n2. Diff 算法：对比新旧虚拟 DOM 树的差异。\n3. Patch：只将差异部分更新到真实 DOM 中。\n\n优势：减少了直接操作真实 DOM 的昂贵开销，通过批量更新和最小化重绘提高了性能。"
    },
    {
      question: "useState 和 useReducer 有什么区别？什么时候用哪个？",
      answer: "useState：\n- 简单状态（数字、字符串、布尔值）。\n- 状态逻辑独立，不依赖其他状态。\n\nuseReducer：\n- 复杂状态逻辑（嵌套对象、数组）。\n- 下一个状态依赖于之前的状态。\n- 多个子值协同工作。\n- 适合需要传递 dispatch 而非回调函数的场景（性能优化）。"
    },
    {
      question: "React 的生命周期有哪些？Hooks 是如何对应的？",
      answer: "在函数组件中，useEffect 涵盖了大部分生命周期：\n\n- componentDidMount: useEffect(() => {...}, [])\n- componentDidUpdate: useEffect(() => {...}, [deps])\n- componentWillUnmount: useEffect(() => { return () => {...} }, [])\n\n注意：Hooks 并不是 1:1 的映射，而是一种基于“副作用同步”的思维方式。"
    },
    {
      question: "什么是 React.memo, useMemo 和 useCallback？",
      answer: "它们都是性能优化工具：\n\n- React.memo: 高阶组件，防止组件在 Props 未改变时重新渲染。\n- useMemo: 缓存计算结果，避免在每次渲染时进行昂贵的计算。\n- useCallback: 缓存函数引用，防止因函数重新创建导致子组件不必要的渲染。"
    },
    {
      question: "React 中的 Key 有什么作用？为什么不能用 Index？",
      answer: "Key 帮助 React 识别哪些元素改变了、添加了或删除了。\n\n为什么不用 Index：\n如果列表顺序发生变化（如排序、删除中间项），使用 Index 会导致 React 错误地复用 DOM 状态，引发 UI 错误或性能问题。应始终使用唯一的业务 ID。"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-2">
          <HelpCircle size={32} />
        </div>
        <h2 className="text-4xl font-bold">面试通关秘籍</h2>
        <p className="text-slate-500 text-lg">
          精选 React 高频面试题，助你深入理解底层原理。
        </p>
      </header>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 px-8">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
        <div className="shrink-0 text-amber-600">
          <Star size={24} fill="currentColor" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">面试小贴士</h4>
          <p className="text-amber-800 text-sm mt-1">
            在面试中，不仅要给出正确答案，最好能结合你实际项目中的经验。例如：“在我的项目中，我通过 useMemo 优化了一个包含 5000 条数据的过滤逻辑，将渲染时间从 100ms 降低到了 10ms。”
          </p>
        </div>
      </div>
    </div>
  );
}

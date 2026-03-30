import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'tsx', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 bg-[#1E1E1E] shadow-lg my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-slate-700">
        <span className="text-xs font-mono text-slate-300">{title || language}</span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

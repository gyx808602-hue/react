import React, { createContext, useContext, useState, useReducer } from 'react';
import { User, ShieldCheck, LogIn, LogOut, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

/**
 * 1. useReducer: 适合复杂状态逻辑
 * 类似于 Redux 的单向数据流
 */
type CartItem = { id: number; name: string; price: number; quantity: number };
type CartAction = 
  | { type: 'ADD'; payload: { id: number; name: string; price: number } }
  | { type: 'REMOVE'; payload: number }
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD':
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'REMOVE':
      return state.filter(item => item.id !== action.payload);
    case 'INCREMENT':
      return state.map(item => item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item);
    case 'DECREMENT':
      return state.map(item => item.id === action.payload && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item);
    default:
      return state;
  }
};

const CartDemo = () => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem = () => {
    const id = Math.floor(Math.random() * 1000);
    dispatch({ type: 'ADD', payload: { id, name: `商品_${id}`, price: 99 } });
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-orange-600 font-bold">
          <ShoppingCart size={20} />
          <span>购物车 (useReducer)</span>
        </div>
        <button 
          onClick={addItem}
          className="text-xs px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          添加随机商品
        </button>
      </div>

      <div className="space-y-3 max-h-[200px] overflow-auto pr-2">
        {cart.length === 0 ? (
          <p className="text-center text-slate-400 py-8 text-sm">购物车空空如也...</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-xs text-slate-500">¥{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => dispatch({ type: 'DECREMENT', payload: item.id })} className="p-1 hover:bg-slate-200 rounded"><Minus size={14} /></button>
                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                <button onClick={() => dispatch({ type: 'INCREMENT', payload: item.id })} className="p-1 hover:bg-slate-200 rounded"><Plus size={14} /></button>
                <button onClick={() => dispatch({ type: 'REMOVE', payload: item.id })} className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-sm text-slate-500">总计: {cart.reduce((acc, item) => acc + item.quantity, 0)} 件</span>
          <span className="font-bold text-orange-600">¥{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
        </div>
      )}
    </div>
  );
};

/**
 * 1. 创建 Context
 * 这是一个全局的“数据池”
 */
const AuthContext = createContext<{
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
} | undefined>(undefined);

/**
 * 2. 提供者组件 (Provider)
 * 包装在应用外层，向下传递数据
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (name: string) => setUser(name);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 3. 自定义 Hook (Consumer)
 * 方便组件快速获取 Context 数据
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 子组件示例：展示用户信息
const UserProfile = () => {
  const { user } = useAuth();
  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
        <User size={24} />
      </div>
      <div>
        <p className="text-sm text-blue-600 font-medium">当前用户</p>
        <p className="text-xl font-bold">{user || '未登录'}</p>
      </div>
    </div>
  );
};

// 子组件示例：操作按钮
const AuthButtons = () => {
  const { user, login, logout } = useAuth();
  const [inputName, setInputName] = useState('');

  return (
    <div className="space-y-4">
      {!user ? (
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="输入用户名"
            className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={() => login(inputName || '匿名大牛')}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn size={18} /> 登录
          </button>
        </div>
      ) : (
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut size={18} /> 退出登录
        </button>
      )}
    </div>
  );
};

export default function StateManagement() {
  return (
    <AuthProvider>
      <div className="space-y-10">
        <header>
          <h2 className="text-3xl font-bold mb-2">状态管理 (State Management)</h2>
          <p className="text-slate-500">从简单的 Props 到全局的 Context API。</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <ShieldCheck size={20} />
              <span>Context API 实践</span>
            </div>
            
            <p className="text-slate-600 leading-relaxed">
              Context 提供了一种无需通过组件树逐层传递 props，就能在组件之间共享值的方法。
              它最适合用于“全局”数据，如用户信息、主题或语言设置。
            </p>

            <UserProfile />
            <AuthButtons />
          </section>

          <section className="space-y-8">
            <CartDemo />
            
            <div className="bg-slate-900 text-slate-300 p-8 rounded-2xl shadow-xl font-mono text-sm overflow-hidden relative">
              <div className="absolute top-4 right-4 text-slate-700 select-none">CODE</div>
              <pre className="whitespace-pre-wrap">
{`// useReducer 核心思想：
const [state, dispatch] = useReducer(reducer, initial);

// 为什么用 useReducer？
- 逻辑复杂，多个子值相互依赖
- 下一个状态依赖于前一个状态
- 更好的可测试性与可预测性`}
              </pre>
            </div>
          </section>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="font-bold mb-4">面试必问：Context vs Redux</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-blue-600 mb-2">Context API</p>
              <ul className="text-sm space-y-2 text-slate-600">
                <li>• React 内置，无需额外安装</li>
                <li>• 适合低频更新的数据（如主题）</li>
                <li>• 容易导致不必要的重新渲染（需配合 memo）</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="font-bold text-purple-600 mb-2">Redux / Zustand</p>
              <ul className="text-sm space-y-2 text-slate-600">
                <li>• 外部库，功能更强大</li>
                <li>• 适合高频更新、复杂逻辑</li>
                <li>• 提供强大的调试工具 (DevTools)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

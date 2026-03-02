import React, { useState } from 'react';
import { Sparkles, Send, Loader2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Transaction, Summary } from '../types';
import { getFinancialInsights, askFinancialQuestion } from '../services/aiService';

interface AIAdvisorProps {
  transactions: Transaction[];
  summary: Summary;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, summary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);

  const handleGenerateInsights = async () => {
    setLoading(true);
    const result = await getFinancialInsights(transactions, summary);
    setInsight(result || null);
    setLoading(false);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', content: userQ }]);
    setLoading(true);

    const result = await askFinancialQuestion(userQ, transactions, summary);
    setChatHistory(prev => [...prev, { role: 'ai', content: result || 'Error' }]);
    setLoading(false);
  };

  return (
    <>
      {/* floating action button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl z-40 flex items-center gap-2"
      >
        <Sparkles size={24} />
        <span className="font-bold pr-2">AI Advisor</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white w-full md:w-[450px] h-[90vh] md:h-full rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* header */}
              <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Financial Advisor</h3>
                    <p className="text-xs text-indigo-100">Powered by Trilinomika AI</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!insight && chatHistory.length === 0 && (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Sparkles size={32} />
                    </div>
                    <h4 className="font-bold text-slate-900">How can I help you today?</h4>
                    <p className="text-sm text-slate-500">I can analyze your spending, project your future balance, or answer specific financial questions.</p>
                    
                    <button
                      onClick={handleGenerateInsights}
                      disabled={loading}
                      className="w-full bg-indigo-50 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                      Generate Financial Insights
                    </button>
                  </div>
                )}

                {insight && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
                  >
                    <div className="flex items-center gap-2 mb-3 text-indigo-600">
                      <Sparkles size={18} />
                      <span className="font-bold text-sm uppercase tracking-wider">AI Insights</span>
                    </div>
                    <div className="prose prose-sm prose-slate max-w-none">
                      <Markdown>{insight}</Markdown>
                    </div>
                  </motion.div>
                )}

                {chatHistory.map((chat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      chat.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-sm",
                      chat.role === 'user' 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-slate-100 text-slate-900 rounded-tl-none"
                    )}>
                      {chat.role === 'ai' ? (
                        <div className="prose prose-sm prose-slate max-w-none">
                          <Markdown>{chat.content}</Markdown>
                        </div>
                      ) : (
                        chat.content
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold">
                      {chat.role === 'user' ? 'You' : 'AI Advisor'}
                    </span>
                  </motion.div>
                ))}
                
                {loading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user' && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Loader2 className="animate-spin" size={16} />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>

              {/* input area */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <form onSubmit={handleAskQuestion} className="relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about your finances..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  <QuickAction label="Project next month" onClick={() => setQuestion("Project my balance for next month based on my spending.")} />
                  <QuickAction label="Top expenses?" onClick={() => setQuestion("What are my top 3 expense categories?")} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

function QuickAction({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200 transition-all"
    >
      {label}
    </button>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

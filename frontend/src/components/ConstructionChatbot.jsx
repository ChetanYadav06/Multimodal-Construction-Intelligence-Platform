import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  Bookmark, 
  CheckCircle2, 
  User, 
  ArrowRight,
  HelpCircle,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { queryChatbot } from '../api';

export default function ConstructionChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Construction & Civil Engineering Assistant. You can ask me about concrete curing regimes, OSHA 1926 fall protection, Indian Standards (IS 456 / NBC), structural load calculations, or site management directives.',
      actionable_suggestions: [
        'Ask about IS 456 minimum curing duration for OPC vs PPC',
        'Ask about OSHA 1926.501 fall protection mandates',
        'Ask for bar bending schedule (BBS) formulas'
      ],
      relevant_standards: ['IS 456:2000', 'OSHA 1926', 'NBC 2016']
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [domain, setDomain] = useState('General Construction');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatBottomRef = useRef(null);

  const sampleChips = [
    'What is the minimum curing period for M25 concrete under IS 456?',
    'What are OSHA 1926.501 fall protection requirements above 6 feet?',
    'Explain the difference between shear vs flexural cracking in beams',
    'What are the permissible cantilever scaffold load limits?'
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryToSend) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q) return;

    setError('');
    const userMsg = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      // Build conversation history
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await queryChatbot({
        query: q,
        domain: domain,
        conversation_history: history
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.response || 'No response generated.',
        actionable_suggestions: res.actionable_suggestions || [],
        relevant_standards: res.relevant_standards || [],
        follow_up_prompts: res.follow_up_prompts || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message || 'Chatbot request failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-7 h-7 text-indigo-400" />
          Construction Intelligence Chatbot
        </h2>
        <p className="text-sm text-slate-400">
          Interactive civil engineering conversational copilot providing real-time code references (IS 456, ACI 318, OSHA 1926), concrete technology guidance, and safety directives.
        </p>
      </div>

      {/* Suggested Quick Question Chips */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Quick Inquiries
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-left px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all text-xs text-slate-300"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-semibold">Domain Context:</span>
        {['General Construction', 'Structural Engineering', 'Concrete Technology', 'Site Safety OSHA', 'Building Codes'].map((dom) => (
          <button
            key={dom}
            type="button"
            onClick={() => setDomain(dom)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              domain === dom
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 min-h-[460px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-tr-sm'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm space-y-3'
              }`}
            >
              <div className="whitespace-pre-line font-sans">
                {msg.content}
              </div>

              {/* Actionable Suggestions */}
              {msg.actionable_suggestions?.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Actionable Directives:
                  </span>
                  <ul className="space-y-1">
                    {msg.actionable_suggestions.map((s, i) => (
                      <li key={i} className="text-slate-300 text-xs flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Relevant Standards */}
              {msg.relevant_standards?.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {msg.relevant_standards.map((st, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              )}

              {/* Follow-up Prompts */}
              {msg.follow_up_prompts?.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Suggested Next Inquiries:
                  </span>
                  {msg.follow_up_prompts.map((fp, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(fp)}
                      className="text-left w-full p-1.5 rounded text-[11px] text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 transition-colors flex items-center justify-between"
                    >
                      <span>→ {fp}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing civil engineering standards & formulating directives...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask a technical construction question (e.g. concrete curing times, beam shear reinforcement, scaffold loads)..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputQuery.trim()}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}


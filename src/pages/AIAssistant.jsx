import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Plus, MessageSquare, Sparkles } from "lucide-react";
import ChatMessage from "@/components/ai/ChatMessage";

const AGENT = "business_advisor";

const STARTER_PROMPTS = [
  { icon: "💼", text: "What SBA loan programs am I eligible for?" },
  { icon: "📋", text: "Help me write a business plan outline" },
  { icon: "🎓", text: "What skills should I develop for my industry?" },
  { icon: "🏭", text: "How do I find domestic suppliers for my supply chain?" },
  { icon: "🤝", text: "How do I connect with a SCORE mentor?" },
  { icon: "📊", text: "What documentation do I need for an SBA 7(a) loan?" },
];

export default function AIAssistant() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    base44.agents.listConversations({ agent_name: AGENT })
      .then(res => setConversations(res || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeConv?.id) return;
    const unsub = base44.agents.subscribeToConversation(activeConv.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [activeConv?.id]);

  const startConversation = async (firstMsg) => {
    const conv = await base44.agents.createConversation({
      agent_name: AGENT,
      metadata: { name: firstMsg.slice(0, 60) }
    });
    setActiveConv(conv);
    setMessages([]);
    setConversations(prev => [conv, ...prev]);
    return conv;
  };

  const openConversation = async (conv) => {
    const full = await base44.agents.getConversation(conv.id);
    setActiveConv(full);
    setMessages(full.messages || []);
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setInput("");
    setSending(true);
    let conv = activeConv;
    if (!conv) conv = await startConversation(msg);
    await base44.agents.addMessage(conv, { role: "user", content: msg });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-screen overflow-hidden">
      {/* Conversation sidebar */}
      <div className="hidden lg:flex w-64 bg-card border-r border-border flex-col">
        <div className="p-4 border-b border-border">
          <Button onClick={() => { setActiveConv(null); setMessages([]); }} className="w-full gap-2" size="sm">
            <Plus className="w-4 h-4" /> New Conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {loading && <p className="text-xs text-muted-foreground text-center p-4">Loading...</p>}
          {!loading && conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center p-4">No conversations yet.<br />Ask your first question below.</p>
          )}
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                activeConv?.id === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
              <span className="truncate text-xs">{conv.metadata?.name || "Conversation"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-foreground">Business Development Advisor</h1>
            <p className="text-xs text-muted-foreground">AI-powered guidance for American entrepreneurs</p>
          </div>
          <div className="ml-auto lg:hidden">
            <Button size="sm" variant="outline" onClick={() => { setActiveConv(null); setMessages([]); }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!activeConv && (
            <div className="max-w-2xl mx-auto mt-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-2">Your Business Advisor</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Expert guidance on SBA loans, business plans, workforce skills, supply chains, and connecting with SBDC & SCORE resources.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p.text)}
                    className="text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <span className="text-2xl block mb-2">{p.icon}</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {sending && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0">
          <div className="max-w-3xl mx-auto flex gap-3 items-end">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about SBA loans, business plans, skills, supply chains..."
              className="min-h-[48px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              size="icon"
              className="h-12 w-12 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            Powered by EmpowerHub AI — aligned with SBA, SBDC, and SCORE resources
          </p>
        </div>
      </div>
    </div>
  );
}
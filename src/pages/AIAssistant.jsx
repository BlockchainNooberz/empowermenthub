import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send, Bot, Plus, MessageSquare, Sparkles, Mic, MicOff,
  Paperclip, Download, Trash2, X, ChevronDown
} from "lucide-react";
import ChatMessage from "@/components/ai/ChatMessage";
import jsPDF from "jspdf";

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
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

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
    setShowMobileSidebar(false);
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConv?.id === convId) {
      setActiveConv(null);
      setMessages([]);
    }
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setInput("");
    setSending(true);
    let conv = activeConv;
    if (!conv) conv = await startConversation(msg);
    const fileUrls = attachedFiles.map(f => f.url);
    setAttachedFiles([]);
    await base44.agents.addMessage(conv, {
      role: "user",
      content: msg,
      ...(fileUrls.length > 0 && { file_urls: fileUrls })
    });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAttachedFiles(prev => [...prev, { name: file.name, url: file_url }]);
    }
    setUploading(false);
    e.target.value = "";
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice input is not supported in this browser.");

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => prev ? prev + " " + transcript : transcript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const exportPDF = () => {
    if (!messages.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("EmpowerHub Business Advisor — Chat Export", 14, 20);
    doc.setFontSize(9);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 28);
    let y = 38;
    messages.forEach((msg) => {
      if (msg.role === "tool" || !msg.content) return;
      const role = msg.role === "user" ? "You" : "Advisor";
      const lines = doc.splitTextToSize(`${role}: ${msg.content}`, 180);
      if (y + lines.length * 6 > 270) { doc.addPage(); y = 20; }
      doc.setFont(undefined, msg.role === "user" ? "bold" : "normal");
      doc.text(lines, 14, y);
      y += lines.length * 6 + 4;
    });
    doc.save("advisor-chat.pdf");
  };

  const ConversationList = () => (
    <>
      <div className="p-4 border-b border-border flex gap-2">
        <Button onClick={() => { setActiveConv(null); setMessages([]); setShowMobileSidebar(false); }} className="flex-1 gap-2" size="sm">
          <Plus className="w-4 h-4" /> New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {loading && <p className="text-xs text-muted-foreground text-center p-4">Loading...</p>}
        {!loading && conversations.length === 0 && (
          <p className="text-xs text-muted-foreground text-center p-4">No conversations yet.<br />Ask your first question below.</p>
        )}
        {conversations.map(conv => (
          <div key={conv.id} className="group relative">
            <button
              onClick={() => openConversation(conv)}
              className={`w-full text-left px-3 py-2.5 pr-8 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                activeConv?.id === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
              <span className="truncate text-xs">{conv.metadata?.name || "Conversation"}</span>
            </button>
            <button
              onClick={(e) => deleteConversation(e, conv.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-screen overflow-hidden relative">
      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileSidebar(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-semibold text-sm">Conversations</span>
              <button onClick={() => setShowMobileSidebar(false)}><X className="w-4 h-4" /></button>
            </div>
            <ConversationList />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 bg-card border-r border-border flex-col">
        <ConversationList />
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border bg-card flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-bold text-foreground leading-tight">Business Development Advisor</h1>
            <p className="text-xs text-muted-foreground">AI-powered guidance for American entrepreneurs</p>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button size="icon" variant="ghost" onClick={exportPDF} title="Export PDF">
                <Download className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" className="lg:hidden" onClick={() => { setActiveConv(null); setMessages([]); }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
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

        {/* Attached files preview */}
        {attachedFiles.length > 0 && (
          <div className="px-4 pb-1 flex flex-wrap gap-2">
            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-xs">
                <Paperclip className="w-3 h-3" />
                <span className="max-w-[120px] truncate">{f.name}</span>
                <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))}>
                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0">
          <div className="max-w-3xl mx-auto flex gap-2 items-end">
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.csv,.xlsx" />
            <Button
              size="icon"
              variant="ghost"
              className="flex-shrink-0 h-10 w-10"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Attach file"
            >
              <Paperclip className={`w-4 h-4 ${uploading ? "animate-pulse" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={`flex-shrink-0 h-10 w-10 ${isRecording ? "text-destructive bg-destructive/10" : ""}`}
              onClick={toggleVoice}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={isRecording ? "Listening..." : "Ask about SBA loans, business plans, skills, supply chains..."}
              className="min-h-[48px] max-h-[120px] resize-none flex-1"
              rows={1}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={(!input.trim() && attachedFiles.length === 0) || sending}
              size="icon"
              className="h-10 w-10 flex-shrink-0"
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
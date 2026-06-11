import ReactMarkdown from "react-markdown";
import { Bot, User, ChevronRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

function ToolCallBadge({ toolCall }) {
  const [open, setOpen] = useState(false);
  const name = (toolCall?.name || "tool").replace(/_/g, " ");
  const status = toolCall?.status || "pending";

  const icons = {
    running: <Loader2 className="w-3 h-3 animate-spin text-blue-500" />,
    in_progress: <Loader2 className="w-3 h-3 animate-spin text-blue-500" />,
    completed: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
    success: <CheckCircle2 className="w-3 h-3 text-emerald-500" />,
    failed: <AlertCircle className="w-3 h-3 text-red-500" />,
    error: <AlertCircle className="w-3 h-3 text-red-500" />,
  };

  return (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-md border border-border bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-colors"
    >
      {icons[status] || <ChevronRight className="w-3 h-3" />}
      <span className="capitalize">{name}</span>
      {toolCall?.results && <ChevronRight className={cn("w-3 h-3 transition-transform", open && "rotate-90")} />}
    </button>
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 items-start", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}

      <div className={cn("max-w-[80%]", isUser && "flex flex-col items-end")}>
        {message.content && (
          <div className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border rounded-tl-sm"
          )}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-a:text-primary"
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}

        {message.tool_calls?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {message.tool_calls.map((tc, i) => (
              <ToolCallBadge key={i} toolCall={tc} />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
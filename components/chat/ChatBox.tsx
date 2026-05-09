"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, User, Bot, Copy, Check, Trash2, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/formatters";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => Promise<unknown>;
  onClear: () => void;
  onStop?: () => void;
  className?: string;
}

/** Strip any accidental markdown that Groq may still emit alongside HTML */
function sanitizeHtml(raw: string): string {
  return raw
    // Remove fenced code blocks that wrap HTML
    .replace(/```html?\s*/gi, "")
    .replace(/```\s*/g, "")
    // Remove stray leading/trailing asterisks used for bold in markdown
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Remove single asterisk italics
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Convert bare markdown bullet lines that escaped the prompt rule
    .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
    .trim();
}

function ChatMessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    // Copy plain text (strip HTML tags)
    const plainText = message.content.replace(/<[^>]+>/g, "");
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const htmlContent = sanitizeHtml(message.content);

  return (
    <div className={cn("flex gap-3 group", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
        isUser ? "bg-violet-600" : "bg-muted border border-border"
      )}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-muted-foreground" />}
      </div>

      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        {/* Bubble */}
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isUser
            ? "bg-violet-600 text-white rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}>
          {isUser ? (
            // User messages: plain text
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            // Assistant messages: rendered HTML
            <div
              className="chat-html-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(message.timestamp)}
          </span>
          {!isUser && (
            <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="px-4 py-3 bg-muted rounded-2xl rounded-tl-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatBox({ messages, isLoading, error, onSendMessage, onClear, onStop, className }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    await onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "How can I improve my resume for a Data Science role?",
    "What skills should I prioritize learning next?",
    "Help me prepare for a technical interview",
    "Review my Python and ML experience level",
  ];

  return (
    <>
      {/* Scoped styles for HTML chat content */}
      <style>{`
        .chat-html-content p { margin: 0 0 0.5rem 0; }
        .chat-html-content p:last-child { margin-bottom: 0; }
        .chat-html-content ul { margin: 0.4rem 0 0.5rem 1.2rem; padding: 0; list-style: disc; }
        .chat-html-content li { margin-bottom: 0.25rem; line-height: 1.5; }
        .chat-html-content strong { font-weight: 650; }
        .chat-html-content em { font-style: italic; opacity: 0.9; }
        .chat-html-content span { }
      `}</style>

      <div className={cn("flex flex-col h-full", className)}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium">ResuMate AI</span>
            <span className="text-xs text-muted-foreground">Powered by Llama 3</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground gap-1.5 h-7"
          >
            <Trash2 className="w-3.5 h-3.5" />Clear
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <Bot className="w-8 h-8 text-violet-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-1">AI Career Assistant</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Ask me anything about your career, resume, or interview prep — I&apos;ll give you advice based on your actual profile.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSendMessage(s)}
                    className="p-3 text-left text-xs border border-border rounded-lg hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessageBubble key={i} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Anchor for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about your career, resume, or job search…"
              className="flex-1 min-h-[44px] max-h-32 resize-none text-sm"
              rows={1}
              disabled={isLoading}
            />
            {isLoading ? (
              <Button
                variant="outline"
                size="icon"
                onClick={onStop}
                className="h-11 w-11 flex-shrink-0"
              >
                <StopCircle className="w-4 h-4 text-red-500" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-11 w-11 flex-shrink-0 bg-violet-600 hover:bg-violet-700"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}

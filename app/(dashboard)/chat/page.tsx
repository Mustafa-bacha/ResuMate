"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useResume } from "@/hooks/useResume";
import { ChatBox } from "@/components/chat/ChatBox";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Zap } from "lucide-react";

export default function ChatPage() {
  const { token } = useAuth();
  const { messages, isLoading, error, sendMessage, clearChat, stopGeneration } = useChat(token);
  const { currentResume, fetchResumes } = useResume(token);

  useEffect(() => { if (token) fetchResumes(); }, [token]); // eslint-disable-line

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-0">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold">AI Career Assistant</h1>
            <p className="text-muted-foreground mt-1">Get personalized career advice powered by Llama 3</p>
          </div>
          <div className="flex items-center gap-2">
            {currentResume && (
              <Badge variant="secondary" className="gap-1.5 text-xs">
                <FileText className="w-3 h-3" />
                Context: {currentResume.fileName}
              </Badge>
            )}
            <Badge variant="outline" className="gap-1.5 text-xs">
              <Zap className="w-3 h-3 text-violet-500" />
              Llama 3.3 70B
            </Badge>
          </div>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            "Career Advice", "Resume Tips", "Interview Prep",
            "Skill Development", "Salary Negotiation", "Career Transition"
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => sendMessage(`Give me advice about: ${topic}`)}
              className="px-3 py-1 text-xs border border-border rounded-full hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-background border border-border rounded-xl overflow-hidden min-h-0">
        <ChatBox
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={sendMessage}
          onClear={clearChat}
          onStop={stopGeneration}
          className="h-full"
        />
      </div>

      {/* Info footer */}
      <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
        <MessageSquare className="w-3 h-3" />
        <span>AI responses are for guidance only. Always verify career advice with industry professionals.</span>
      </div>
    </div>
  );
}

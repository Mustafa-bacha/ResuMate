"use client";

import { useState, useCallback, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useChat(token: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };

  const sendMessage = useCallback(async (content: string, resumeId?: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ message: content, sessionId, resumeId }),
        signal: abortRef.current.signal,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response");

      if (!sessionId) setSessionId(data.sessionId);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      return data.message;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message = err instanceof Error ? err.message : "Failed to send message";
      setError(message);
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, sessionId, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    clearChat,
    stopGeneration,
  };
}

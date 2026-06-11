"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { MODELS } from "../lib/models";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RECENT_CHATS = [
  "Weather forecast for next week",
  "Startup idea validation",
  "Food tech market notes",
  "Python async patterns",
  "Landing page copy",
];

// ── Avatars ───────────────────────────────────────────────────────────────────
function UserAvatar() {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold select-none">
      U
    </div>
  );
}
function AIAvatar({ icon }) {
  return (
    <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
      {icon}
    </div>
  );
}

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-5 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

// ── Sidebar content (shared between desktop + mobile drawer) ──────────────────
function SidebarContent({ dm, selectedModel, setSelectedModel, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo row */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">OmniAI</span>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${
              dm
                ? "hover:bg-zinc-800 text-zinc-400"
                : "hover:bg-zinc-100 text-zinc-500"
            }`}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* New chat */}
      <div className="px-4 pb-3">
        <button
          className={`flex w-full items-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition ${
            dm
              ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
          }`}
        >
          <Plus size={15} />
          New chat
        </button>
      </div>

      {/* Recent chats */}
      <div className="px-3 flex-1 overflow-y-auto">
        <p
          className={`px-2 mb-2 text-[10px] uppercase font-semibold tracking-widest ${
            dm ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          Recent
        </p>
        <div className="space-y-0.5">
          {RECENT_CHATS.map((chat) => (
            <button
              key={chat}
              onClick={onClose}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                dm
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
              }`}
            >
              <MessageSquare size={13} className="shrink-0 opacity-60" />
              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Model selector */}
      <div
        className={`border-t p-3 ${dm ? "border-zinc-800" : "border-zinc-200"}`}
      >
        <p
          className={`px-2 mb-1.5 text-[10px] uppercase font-semibold tracking-widest ${
            dm ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          Model
        </p>
        <div className="space-y-0.5">
          {MODELS.map((model) => {
            const active = selectedModel.name === model.name;
            return (
              <button
                key={model.name}
                onClick={() => {
                  setSelectedModel(model);
                  onClose?.();
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? dm
                      ? "bg-zinc-800 text-white"
                      : "bg-zinc-200 text-zinc-900"
                    : dm
                    ? "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                }`}
              >
                <span className="shrink-0">{model.icon}</span>
                <span className="truncate font-medium">{model.name}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ models, selectedModel, setSelectedModel, dm }) {
  return (
    <div className="flex flex-col items-center w-full px-4">
      <div className="mb-2">
        <Sparkles size={32} className="text-violet-400" />
      </div>
      <h1
        className={`text-3xl sm:text-5xl font-bold tracking-tight text-center leading-tight mb-3 ${
          dm ? "text-white" : "text-zinc-900"
        }`}
      >
        What can I help with?
      </h1>
      <p
        className={`text-sm mb-8 text-center ${
          dm ? "text-zinc-500" : "text-zinc-400"
        }`}
      >
        Powered by GPT · Claude · Gemini · DeepSeek · Grok
      </p>

      {/* Model cards: 3-col on mobile, 5-col on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 w-full max-w-3xl">
        {models.map((model) => {
          const active = selectedModel.name === model.name;
          return (
            <button
              key={model.name}
              onClick={() => setSelectedModel(model)}
              className={`rounded-xl sm:rounded-2xl border p-3 sm:p-4 text-left transition-all active:scale-95 hover:scale-[1.03] ${
                active
                  ? dm
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-violet-400 bg-violet-50"
                  : dm
                  ? "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="mb-1.5 text-base">{model.icon}</div>
              <div
                className={`text-xs font-semibold leading-tight ${
                  dm ? "text-white" : "text-zinc-800"
                }`}
              >
                {model.name}
              </div>
              <div
                className={`text-[10px] mt-0.5 hidden sm:block ${
                  dm ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {model.company}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [darkMode, setDarkMode] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dm = darkMode;
  const hasMessages = messages.length > 0;
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [prompt]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;

    setPrompt("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: selectedModel.modelId,
          prompt: userPrompt,
        }),
      });

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let assistantMessage = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
        },
      ]);

      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const json = line.replace("data: ", "");

          if (json === "[DONE]" || !json.trim()) continue;

          try {
            const parsed = JSON.parse(json);

            const content = parsed.choices?.[0]?.delta?.content || "";

            assistantMessage += content;

            setMessages((prev) => {
              const copy = [...prev];

              copy[copy.length - 1] = {
                role: "assistant",
                content: assistantMessage,
              };

              return copy;
            });
          } catch {}
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting AI",
        },
      ]);
    }

    
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        dm ? "bg-[#0a0a0b] text-white" : "bg-white text-zinc-900"
      }`}
    >
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <aside
        className={`hidden md:flex w-60 shrink-0 flex-col border-r ${
          dm ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-zinc-50"
        }`}
      >
        <SidebarContent
          dm={dm}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onClose={null}
        />
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${dm ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white"}`}
      >
        <SidebarContent
          dm={dm}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* ── Main column ── */}
      <main className="relative flex flex-1 flex-col overflow-hidden min-w-0">
        {/* ── Header ── */}
        <header
          className={`flex shrink-0 items-center justify-between px-3 sm:px-5 py-3 border-b z-10 ${
            dm ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`md:hidden p-2 rounded-lg ${
                dm
                  ? "hover:bg-zinc-800 text-zinc-400"
                  : "hover:bg-zinc-100 text-zinc-500"
              }`}
            >
              <Menu size={18} />
            </button>

            {/* Logo — mobile only (desktop has it in sidebar) */}
            <div className="flex items-center gap-1.5 md:hidden">
              <div className="h-5 w-5 rounded-md bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Sparkles size={10} className="text-white" />
              </div>
              <span className="font-bold text-sm tracking-tight">OmniAI</span>
            </div>

            {/* Current model — desktop */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-semibold">
                {selectedModel.name}
              </span>
              <span
                className={`text-xs ${dm ? "text-zinc-600" : "text-zinc-400"}`}
              >
                ·
              </span>
              <span
                className={`text-xs ${dm ? "text-zinc-500" : "text-zinc-400"}`}
              >
                {selectedModel.company}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile model picker pill */}
            <button
              className={`flex md:hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                dm
                  ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600"
              }`}
              onClick={() => setSidebarOpen(true)}
            >
              {selectedModel.icon}
              <span>{selectedModel.name}</span>
              <ChevronDown size={12} className="opacity-50" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!dm)}
              className={`rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs transition ${
                dm
                  ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  : "border-zinc-200 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {dm ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
              <HeroSection
                models={MODELS}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                dm={dm}
              />
            </div>
          ) : (
            <div className="px-3 sm:px-4 py-6">
              <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <div key={i} className="flex justify-end gap-2 sm:gap-3">
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm leading-relaxed ${
                          dm
                            ? "bg-zinc-800 text-white"
                            : "bg-zinc-100 text-zinc-900"
                        }`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      <UserAvatar />
                    </div>
                  ) : (
                    <div key={i} className="flex gap-2 sm:gap-3">
                      <AIAvatar icon={msg.model?.icon} />
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm leading-relaxed ${
                          dm
                            ? "bg-zinc-900 border border-zinc-800 text-zinc-100"
                            : "bg-white border border-zinc-200 text-zinc-800"
                        }`}
                      >
                        <div className="markdown-body">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="flex gap-2 sm:gap-3">
                    <AIAvatar icon={selectedModel.icon} />
                    <div
                      className={`rounded-3xl border ${
                        dm
                          ? "bg-zinc-900 border-zinc-800"
                          : "bg-white border-zinc-200"
                      }`}
                    >
                      <TypingDots />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div
          className={`shrink-0 px-3 sm:px-4 pb-4 sm:pb-5 pt-2 sm:pt-3 z-10 ${
            dm
              ? "border-t border-zinc-800 bg-zinc-950"
              : "border-t border-zinc-200 bg-white"
          }`}
        >
          <div className="mx-auto max-w-3xl">
            <div
              className={`flex items-end gap-2 sm:gap-3 rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 transition-shadow focus-within:ring-1 ${
                dm
                  ? "border-zinc-700 bg-zinc-900 focus-within:ring-zinc-600"
                  : "border-zinc-300 bg-white focus-within:ring-zinc-300 shadow-sm"
              }`}
            >
              {/* Model pill — hidden on mobile to save space */}
              <div
                className={`hidden sm:flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium self-end mb-0.5 ${
                  dm ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {selectedModel.icon}
                <span>{selectedModel.name}</span>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedModel.name}…`}
                rows={1}
                className={`flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none ${
                  dm
                    ? "text-white placeholder:text-zinc-600"
                    : "text-zinc-900 placeholder:text-zinc-400"
                }`}
                style={{ minHeight: "24px", maxHeight: "160px" }}
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={loading || !prompt.trim()}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full self-end transition-all active:scale-95 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed ${
                  dm
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "bg-zinc-900 text-white hover:bg-zinc-700"
                }`}
              >
                <Send size={15} />
              </button>
            </div>

            {/* Hint — desktop only, too cluttered on mobile */}
            <p
              className={`mt-2 text-center text-[11px] hidden sm:block ${
                dm ? "text-zinc-700" : "text-zinc-400"
              }`}
            >
              <kbd
                className={`rounded px-1 py-0.5 font-mono text-[10px] ${
                  dm ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"
                }`}
              >
                Enter
              </kbd>{" "}
              to send ·{" "}
              <kbd
                className={`rounded px-1 py-0.5 font-mono text-[10px] ${
                  dm ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"
                }`}
              >
                Shift+Enter
              </kbd>{" "}
              for new line
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import React from "react";
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
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels";

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

function generateChatTitle(prompt) {
  return prompt.trim().replace(/\s+/g, " ").split(" ").slice(0, 4).join(" ");
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
function SidebarContent({
  dm,
  chats,
  selectedModel,
  setSelectedModel,
  onClose,
  loadMessages,
  createNewChat,
  user,
  openMenu,
  setOpenMenu,
  renameChat,
  deleteChat,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo row */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">HashmiAI</span>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={() => onClose?.()}
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
          onClick={createNewChat}
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
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center rounded-lg ${
                dm ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
              }`}
            >
              <button
                onClick={() => {
                  loadMessages(chat._id);
                  onClose?.();
                }}
                className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left text-sm ${
                  dm
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <MessageSquare size={13} className="shrink-0 opacity-60" />

                <span className="truncate">
                  {chat.title?.split(" ").slice(0, 5).join(" ")}
                  {chat.title?.split(" ").length > 5 ? "" : ""}
                </span>
              </button>

              {/* 3 Dots Menu */}
              <div className="relative mr-2 chat-menu">
              <button
  onClick={(e) => {
    e.stopPropagation();

    setOpenMenu(
      openMenu === chat._id
        ? null
        : chat._id
    );
  }}
  className={`px-2 md:opacity-0 md:group-hover:opacity-100 ${
    dm
      ? "text-zinc-500 hover:text-white"
      : "text-zinc-400 hover:text-black"
  }`}
>
  ⋯
</button>

                {openMenu === chat._id && (
                  <div
                    className={`absolute right-0 top-7 z-50 w-36 rounded-lg border shadow-xl ${
                      dm
                        ? "bg-zinc-900 border-zinc-800"
                        : "bg-white border-zinc-200"
                    }`}
                  >
                    <button
                      onClick={() => renameChat(chat)}
                      className={`w-full px-3 py-2 text-left text-sm ${
                        dm ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
                      }`}
                    >
                      Rename
                    </button>

                    <button
                      onClick={() => deleteChat(chat._id)}
                      className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model selector */}
      <div
        className={`hidden md:block  border-t p-3 ${dm ? "border-zinc-800" : "border-zinc-200"}`}
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

      {/* User Profile */}
      <div
        className={`border-t p-3 ${dm ? "border-zinc-800" : "border-zinc-200"}`}
      >
        <div
          className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
            dm
              ? "bg-zinc-900 hover:bg-zinc-800"
              : "bg-zinc-100 hover:bg-zinc-200"
          }`}
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${
                dm ? "text-white" : "text-zinc-900"
              }`}
            >
              {user?.name || "User"}
            </p>

            <p
              className={`text-xs truncate ${
                dm ? "text-zinc-500" : "text-zinc-500"
              }`}
            >
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className={`mt-2 w-full rounded-xl px-3 py-2 text-sm font-medium transition ${
            dm
              ? "bg-red-950 text-red-300 hover:bg-red-900"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ dm }) {
  const [user, setUser] = useState(null);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const firstName = user?.name?.split(" ")[0] || "Friend";

  const hour = new Date().getHours();

  let greeting = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17 && hour < 22) {
    greeting = "Good evening";
  } else {
    greeting = "Working late";
  }

  const prompts = [
    "How can I help you today?",
    "What are you working on today?",
    "What's on your mind?",
    "How can I assist you today?",
    "What would you like to build?",
    "What are we solving today?",
  ];

  const [fullText] = useState(
    prompts[Math.floor(Math.random() * prompts.length)]
  );

  useEffect(() => {
    let index = 0;

    setTypedText("");

    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));

      index++;

      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 text-center">
      <h1
        className={`text-5xl sm:text-7xl font-bold tracking-tight ${
          dm ? "text-white" : "text-zinc-900"
        }`}
      >
        <span className="text-violet-400">{greeting},</span> {firstName}.
      </h1>

      <p
        className={`mt-6 text-xl sm:text-2xl font-medium ${
          dm ? "text-zinc-400" : "text-zinc-500"
        }`}
      >
        {typedText}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  );
}
// ── Main ──────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [darkMode, setDarkMode] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const dm = darkMode;
  const hasMessages = messages.length > 0;
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    loadChats();

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        e.target.closest(".model-button") ||
        e.target.closest(".model-menu") ||
        e.target.closest(".chat-menu")
      ) {
        return;
      }
  
      setShowModelMenu(false);
      setOpenMenu(null);
    };
  
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );
  
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const loadChats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/chat/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setChats(data.chats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renameChat = async (chat) => {
    const title = window.prompt("Enter new chat name", chat.title);

    if (!title) return;

    await fetch("/api/chat/rename", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chat._id,
        title,
      }),
    });

    loadChats();
  };

  const deleteChat = async (chatId) => {
    if (!confirm("Delete this chat?")) return;

    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
      }),
    });

    loadChats();

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const createNewChat = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/chat/create", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: "New Chat",
          model: selectedModel.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentChatId(data.chat._id);

        setMessages([]);

        loadChats();

        return data.chat._id; // IMPORTANT
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/chat/messages?chatId=${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        setCurrentChatId(chatId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function generateChatTitle(prompt) {
    return "TEST TITLE";
  }

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userPrompt = prompt;

    let activeChatId = currentChatId;

    if (!activeChatId) {
      activeChatId = await createNewChat();

      if (!activeChatId) {
        console.error("Failed to create chat");
        return;
      }
    }

    const isFirstMessage = messages.length === 0;

    setPrompt("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      // Save user message
      await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: activeChatId,
          role: "user",
          content: userPrompt,
        }),
      });

      console.log("RENAMING:", generateChatTitle(userPrompt));

      if (isFirstMessage) {
        await fetch("/api/chat/rename", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId: activeChatId,
            title: generateChatTitle(userPrompt),
          }),
        });

        loadChats();
      }

      // Rename chat automatically if first message
      if (messages.length === 0) {
        const title =
          userPrompt.length > 40 ? userPrompt.slice(0, 40) + "..." : userPrompt;

        await fetch("/api/chat/rename", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: activeChatId,
            title,
          }),
        });

        loadChats();
      }

      // AI request
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

      if (!response.ok) {
        throw new Error("CREDIT_EXHAUSTED");
      }

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

      // Save assistant message
      await fetch("/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: activeChatId,
          role: "assistant",
          content: assistantMessage,
        }),
      });
    } catch (error) {
      console.error(error);

      const text = error?.message?.toLowerCase() || "";

      let message = "Unable to generate response right now.";

      if (
        text.includes("credit") ||
        text.includes("quota") ||
        text.includes("billing") ||
        text.includes("insufficient") ||
        text.includes("limit")
      ) {
        message = "⚠️ AI credits have been exhausted. Please try again later.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
        },
      ]);

      setLoading(false);
    } finally {
      setLoading(false);
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

<PanelGroup direction="horizontal">


      {/* ── Desktop sidebar (hidden on mobile) ── */}
      {/* ── Desktop sidebar (Resizable) ── */}
<Panel
  defaultSize={18}
  minSize={12}
  maxSize={35}
  className="hidden md:block"
>
  <aside
    className={`h-full flex flex-col border-r ${
      dm
        ? "border-zinc-800 bg-zinc-950"
        : "border-zinc-200 bg-zinc-50"
    }`}
  >
    <SidebarContent
      dm={dm}
      chats={chats}
      loadMessages={loadMessages}
      createNewChat={createNewChat}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      user={user}
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
      renameChat={renameChat}
      deleteChat={deleteChat}
    />
  </aside>
</Panel>

<PanelResizeHandle
  className={`hidden md:block w-1 cursor-col-resize ${
    dm
      ? "bg-zinc-800 hover:bg-violet-500"
      : "bg-zinc-200 hover:bg-violet-500"
  }`}
/>

<Panel defaultSize={82}>

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
          chats={chats}
          loadMessages={loadMessages}
          createNewChat={createNewChat}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onClose={() => setSidebarOpen(false)}
          user={user}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
          renameChat={renameChat}
          deleteChat={deleteChat}
        />
      </aside>

      {/* ── Main column ── */}
      <main className="relative flex h-full flex-col overflow-hidden min-w-0">
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
              <span className="font-bold text-sm tracking-tight">HashmiAI</span>
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
            <div className="relative md:hidden">
  <button
    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
      dm
        ? "border-zinc-700 bg-zinc-900 text-zinc-300"
        : "border-zinc-200 bg-zinc-50 text-zinc-600"
    }`}
    onClick={() =>
      setShowModelMenu(!showModelMenu)
    }
  >
    {selectedModel.icon}
    <span>{selectedModel.name}</span>
    <ChevronDown
      size={12}
      className="opacity-50"
    />
  </button>

  {showModelMenu && (
    <div
      className={`absolute right-0 top-11 w-48 rounded-xl border shadow-xl z-50 ${
        dm
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-zinc-200"
      }`}
    >
      {MODELS.map((model) => (
        <button
          key={model.name}
          onClick={() => {
            setSelectedModel(model);
            setShowModelMenu(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left ${
            dm
              ? "hover:bg-zinc-800"
              : "hover:bg-zinc-100"
          }`}
        >
          {model.icon}
          <span>{model.name}</span>
        </button>
      ))}
    </div>
  )}
</div>

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
              <div className="relative hidden sm:block shrink-0 model-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModelMenu(!showModelMenu);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium self-end mb-0.5 transition ${
                    dm
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {selectedModel.icon}
                  <span>{selectedModel.name}</span>
                  <ChevronDown size={12} />
                </button>

                {showModelMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute bottom-12 left-0 w-56 rounded-xl border overflow-hidden shadow-xl z-50 ${
                      dm
                        ? "bg-zinc-900 border-zinc-800"
                        : "bg-white border-zinc-200"
                    }`}
                  >
                    {MODELS.map((model) => (
                      <button
                        key={model.name}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left ${
                          dm ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
                        }`}
                      >
                        <span>{model.icon}</span>

                        <div>
                          <div className="font-medium">{model.name}</div>

                          <div
                            className={`text-xs ${
                              dm ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            {model.company}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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

      </Panel>

</PanelGroup>
    </div>
  );
}

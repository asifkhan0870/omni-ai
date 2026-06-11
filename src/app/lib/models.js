import {
    Bot,
    Brain,
    Sparkles,
    Flame,
    Rocket,
  } from "lucide-react";
  
  export const MODELS = [
    {
      name: "GPT-5",
      company: "OpenAI",
      modelId: "openai/gpt-5",
      icon: <Bot size={20} />,
    },
  
    {
      name: "Claude",
      company: "Anthropic",
      modelId: "anthropic/claude-sonnet-4",
      icon: <Brain size={20} />,
    },
  
    {
      name: "Gemini",
      company: "Google",
      modelId: "google/gemini-2.5-pro",
      icon: <Sparkles size={20} />,
    },
  
    {
      name: "DeepSeek",
      company: "DeepSeek",
      modelId: "deepseek/deepseek-chat-v3",
      icon: <Flame size={20} />,
    },
  
    {
      name: "Grok",
      company: "xAI",
      modelId: "x-ai/grok-4",
      icon: <Rocket size={20} />,
    },
  ];
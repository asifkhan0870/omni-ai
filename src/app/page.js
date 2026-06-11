import Link from "next/link";

export default function Home() {
  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-black
      text-white
    "
    >
      <div className="text-center">

        <h1 className="text-8xl font-bold">
          OmniAI
        </h1>

        <p className="mt-5 text-xl text-zinc-400">
          Chat with GPT, Claude, Gemini,
          DeepSeek and Grok.
        </p>

        <Link
          href="/chat"
          className="
          mt-10
          inline-block
          rounded-2xl
          bg-white
          px-8
          py-4
          text-lg
          font-medium
          text-black
        "
        >
          Launch App
        </Link>

      </div>
    </main>
  );
}
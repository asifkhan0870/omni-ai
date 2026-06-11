"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      router.push("/login");

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 blur-[140px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">

        <div className="w-full max-w-md">

          {/* Branding */}
          <div className="text-center mb-8">

            <h1 className="text-5xl font-bold tracking-tight">
              HashmiAI
            </h1>

            <p className="mt-3 text-zinc-400">
              GPT • Claude • Gemini • DeepSeek • Grok
            </p>

          </div>

          {/* Signup Card */}
          <form
            onSubmit={handleSignup}
            className="
            bg-zinc-900/70
            backdrop-blur-xl
            border
            border-zinc-800
            rounded-3xl
            p-8
            shadow-2xl
          "
          >

            <h2 className="text-3xl font-bold mb-2">
              Create Account
            </h2>

            <p className="text-zinc-400 mb-6">
              Start your AI workspace
            </p>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                outline-none
                focus:border-violet-500
              "
              />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                outline-none
                focus:border-violet-500
              "
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                outline-none
                focus:border-violet-500
              "
              />

              <button
                type="submit"
                disabled={loading}
                className="
                w-full
                rounded-xl
                bg-violet-600
                py-3
                font-semibold
                transition
                hover:bg-violet-500
                disabled:opacity-50
              "
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </div>

            <div className="mt-6 text-center">

              <p className="text-zinc-400">
                Already have an account?
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/login")
                }
                className="
                mt-2
                text-violet-400
                hover:text-violet-300
                font-medium
              "
              >
                Sign In
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
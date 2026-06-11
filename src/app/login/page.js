"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      router.push("/chat");

    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/20 blur-[140px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 blur-[140px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">

        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">

            <h1 className="text-5xl font-bold tracking-tight">
              Hashmi AI
            </h1>

            <p className="mt-3 text-zinc-400">
            The Hashmi Group AI aggregation platform
            </p>

          </div>

          {/* Card */}
          <form
            onSubmit={handleLogin}
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
              Welcome Back
            </h2>

            <p className="text-zinc-400 mb-6">
              Sign in to continue
            </p>

            <div className="space-y-4">

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
                  ? "Signing In..."
                  : "Sign In"}
              </button>

            </div>

            <div className="mt-6 text-center">

              <p className="text-zinc-400">
                Don't have an account?
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/signup")
                }
                className="
                mt-2
                text-violet-400
                hover:text-violet-300
                font-medium
              "
              >
                Create Account
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
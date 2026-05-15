"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. Check your email if confirmation is enabled.");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white border rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-black mb-2">Job CRM</h1>
        <p className="text-gray-600 mb-6">Login to your private dashboard.</p>

        <div className="grid gap-4">
          <input
            className="border rounded-lg p-3 text-black bg-white"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border rounded-lg p-3 text-black bg-white"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signIn}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Login
          </button>

          <button
            onClick={signUp}
            className="border text-black px-4 py-2 rounded-lg"
          >
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}
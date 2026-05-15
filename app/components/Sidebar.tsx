"use client";

import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-10">Job CRM</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/board">Board</Link>

        <button
          onClick={logout}
          className="mt-8 text-left text-red-300 hover:text-red-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-10">Job CRM</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/jobs">Jobs</Link>
        <Link
  href="/board"
  className="block px-4 py-2 rounded-lg hover:bg-gray-200"
>
  Board
</Link>
      </nav>
    </aside>
  );
}
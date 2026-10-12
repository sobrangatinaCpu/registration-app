import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome! Register to continue.</p>
      <Link
        href="/register"
        className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Register
      </Link>
    </main>
  );
}
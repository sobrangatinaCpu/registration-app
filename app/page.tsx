import Link from "next/link";
import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  const sql = neon(process.env.DATABASE_URL!);

  let rows: { id: number; role: string; full_name: string }[] = [];
  try {
    rows = (await sql`
      SELECT id, role, full_name FROM registrations
      ORDER BY created_at DESC LIMIT 20
    `) as typeof rows;
  } catch {
    // table doesn't exist yet
  }

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {registered && (
        <p className="rounded bg-green-100 p-3 text-green-800">
          Registration successful!
        </p>
      )}

      <Link
        href="/register"
        className="inline-block rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
      >
        Register
      </Link>

      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.full_name}</td>
              <td className="p-2 capitalize">{r.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
import { Suspense } from "react";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";

type Params = Promise<{ registered?: string }>;

async function Banner({ searchParams }: { searchParams: Params }) {
  const { registered } = await searchParams;

  if (!registered) return null;

  return (
    <p className="rounded bg-green-100 p-3 text-green-800">
      Registration successful!
    </p>
  );
}

async function Registrations() {
  const sql = neon(process.env.DATABASE_URL!);

  let rows: {
    id: number;
    role: string;
    full_name: string;
    data: Record<string, unknown> | null;
  }[] = [];

  try {
    rows = (await sql`
      SELECT id, role, full_name, data
      FROM registrations
      ORDER BY created_at DESC
      LIMIT 20
    `) as typeof rows;
  } catch (error) {
    console.error("Failed to load registrations:", error);

    return (
      <p className="text-red-600">
        Could not load registrations. Check the server logs.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-left">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="p-2">Student/Faculty ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => {
            const details = r.data ?? {};

            const displayId =
              r.role === "faculty"
                ? details.facultyId
                : details.studentId;

            return (
              <tr key={r.id} className="border-t">
                <td className="p-2">
                  {typeof displayId === "string" && displayId.trim()
                    ? displayId
                    : "Not provided"}
                </td>
                <td className="p-2">{r.full_name}</td>
                <td className="p-2 capitalize">{r.role}</td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No registrations yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard({
  searchParams,
}: {
  searchParams: Params;
}) {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Suspense fallback={null}>
        <Banner searchParams={searchParams} />
      </Suspense>

      <Link
        href="/register"
        className="inline-block rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
      >
        Register
      </Link>

      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <Registrations />
      </Suspense>
    </main>
  );
}

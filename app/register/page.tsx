"use client";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = "regular" | "irregular" | "faculty";
type Step = "choose" | "form" | "confirm";

const FIELDS: Record<Role, { name: string; label: string }[]> = {
  regular: [
    { name: "studentId", label: "Student ID" },
    { name: "fullName", label: "Full name" },
    { name: "section", label: "Section" },
  ],
  irregular: [
    { name: "studentId", label: "Student ID" },
    { name: "fullName", label: "Full name" },
    { name: "subjects", label: "Subjects to enroll" },
  ],
  faculty: [
    { name: "facultyId", label: "Faculty ID" },
    { name: "fullName", label: "Full name" },
    { name: "department", label: "Department" },
  ],
};

// Shared layout: title + Close (X) button that goes back to the Dashboard
function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-md p-8 space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold capitalize">{title}</h1>
        <Link
          href="/"
          aria-label="Close and go back to Dashboard"
          className="rounded px-3 py-1 text-xl hover:bg-gray-200/60"
        >
          ✕
        </Link>
      </div>
      {children}
    </main>
  );
}

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [role, setRole] = useState<Role | null>(null);
  const [data, setData] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...data }),
      });

      if (!res.ok) {
        setError("Could not save. This ID may already be registered.");
        setSubmitting(false);
        setStep("form");
        return;
      }

      router.push("/?registered=1"); // "Yes" → back to Dashboard
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
      setStep("form");
    }
  }

  // STEP 1: Student (Regular/Irregular) or Faculty?
  if (step === "choose")
    return (
      <Shell title="Who are you?">
        {(["regular", "irregular", "faculty"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => {
              setRole(r);
              setData({});
              setError("");
              setStep("form");
            }}
            className="block w-full rounded border p-4 text-left capitalize hover:bg-gray-200/60"
          >
            {r === "faculty" ? "Faculty" : `Student (${r})`}
          </button>
        ))}
        <Link href="/" className="inline-block rounded border px-6 py-2 hover:bg-gray-200/60">
          ← Back to Dashboard
        </Link>
      </Shell>
    );

  // STEP 2: Input credentials
  if (step === "form" && role)
    return (
      <Shell title={`${role} credentials`}>
        {error && <p className="text-red-600">{error}</p>}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("confirm");
          }}
        >
          {FIELDS[role].map((f) => (
            <label key={f.name} className="block">
              <span className="text-sm">{f.label}</span>
              <input
                required
                value={data[f.name] ?? ""}
                onChange={(e) => setData({ ...data, [f.name]: e.target.value })}
                className="mt-1 w-full rounded border p-2"
              />
            </label>
          ))}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("choose");
              }}
              className="rounded border px-6 py-2 hover:bg-gray-200/60"
            >
              ← Back
            </button>
            <button type="submit" className="rounded bg-black px-6 py-2 text-white">
              Next
            </button>
          </div>
        </form>
      </Shell>
    );

  // STEP 3: Confirm?
  return (
    <Shell title="Confirm?">
      <ul className="rounded border p-4 space-y-1">
        {role &&
          FIELDS[role].map((f) => (
            <li key={f.name}>
              <b>{f.label}:</b> {data[f.name]}
            </li>
          ))}
      </ul>
      <div className="flex gap-3">
        <button
          onClick={submit}
          disabled={submitting}
          className="rounded bg-green-600 px-6 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Yes"}
        </button>
        <button
          onClick={() => setStep("form")}
          disabled={submitting}
          className="rounded border px-6 py-2 disabled:opacity-50"
        >
          No
        </button>
      </div>
    </Shell>
  );
}
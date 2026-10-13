"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [role, setRole] = useState<Role | null>(null);
  const [data, setData] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, ...data }),
    });
    if (!res.ok) {
      setError("Something went wrong. Please check your details.");
      setStep("form");
      return;
    }
    router.push("/?registered=1");
  }

  // STEP 1: Student (Regular/Irregular) or Faculty?
  if (step === "choose")
    return (
      <main className="mx-auto max-w-md p-8 space-y-4">
        <h1 className="text-2xl font-bold">Who are you?</h1>
        {(["regular", "irregular", "faculty"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => {
              setRole(r);
              setData({});
              setStep("form");
            }}
            className="block w-full rounded border p-4 text-left capitalize hover:bg-gray-100"
          >
            {r === "faculty" ? "Faculty" : `Student (${r})`}
          </button>
        ))}
      </main>
    );

  // STEP 2: Input credentials
  if (step === "form" && role)
    return (
      <main className="mx-auto max-w-md p-8">
        <h1 className="mb-4 text-2xl font-bold capitalize">{role} credentials</h1>
        {error && <p className="mb-3 text-red-600">{error}</p>}
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
          <button className="rounded bg-black px-6 py-2 text-white">Next</button>
        </form>
      </main>
    );

  // STEP 3: Confirm?
  return (
    <main className="mx-auto max-w-md p-8 space-y-4">
      <h1 className="text-2xl font-bold">Confirm?</h1>
      <ul className="rounded border p-4 space-y-1">
        {role &&
          FIELDS[role].map((f) => (
            <li key={f.name}>
              <b>{f.label}:</b> {data[f.name]}
            </li>
          ))}
      </ul>
      <div className="flex gap-3">
        <button onClick={submit} className="rounded bg-green-600 px-6 py-2 text-white">
          Yes
        </button>
        <button
          onClick={() => setStep("form")}
          className="rounded border px-6 py-2"
        >
          No
        </button>
      </div>
    </main>
  );
}
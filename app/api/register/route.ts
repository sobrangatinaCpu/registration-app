   import { neon } from "@neondatabase/serverless";

   export async function POST(req: Request) {
     const body = await req.json();
     const sql = neon(process.env.DATABASE_URL!);

     await sql`CREATE TABLE IF NOT EXISTS registrations (
       id SERIAL PRIMARY KEY,
       role TEXT, full_name TEXT, data JSONB,
       created_at TIMESTAMP DEFAULT NOW()
     )`;
     await sql`INSERT INTO registrations (role, full_name, data)
               VALUES (${body.role}, ${body.fullName}, ${JSON.stringify(body)})`;

     return Response.json({ ok: true });
   }
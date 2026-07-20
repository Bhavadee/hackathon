import { NextResponse } from "next/server";
import { query } from "@/lib/pg";

export async function GET() {
  try {
    const result = await query<{ version: string }>(`SELECT extversion AS version FROM pg_extension WHERE extname = $1`, ["vector"]);
    return NextResponse.json({ status: "ok", database: "connected", pgvector: result.rows[0]?.version ?? "not enabled" });
  } catch {
    return NextResponse.json({ status: "degraded", database: "unavailable", pgvector: "unknown" }, { status: 503 });
  }
}

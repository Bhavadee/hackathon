import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://taas:taas@localhost:5432/taas";

const globalForPg = globalThis as unknown as { pgPool?: Pool };

function createPool() {
  const pool = new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 2_000,
    idleTimeoutMillis: 30_000,
    ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
  });

  pool.on("error", (error) => {
    console.error("[pg] Unexpected pool error:", error.message);
  });

  return pool;
}

export const pool = globalForPg.pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

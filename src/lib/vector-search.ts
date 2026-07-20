import { query } from "./pg";

export type KnowledgeMatch = {
  id: string;
  courseId: string | null;
  content: string;
  metadata: Record<string, string>;
  similarity: number;
};

export async function searchKnowledge(
  embedding: number[],
  limit = 5,
): Promise<KnowledgeMatch[]> {
  if (embedding.length !== 1536) {
    throw new Error("Knowledge embeddings must contain exactly 1536 dimensions.");
  }

  const vector = `[${embedding.join(",")}]`;
  const result = await query<KnowledgeMatch>(
    `SELECT
       id,
       course_id AS "courseId",
       content,
       metadata,
       1 - (embedding <=> $1::vector) AS similarity
     FROM knowledge_chunks
     WHERE embedding IS NOT NULL
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    [vector, Math.min(Math.max(limit, 1), 20)],
  );

  return result.rows;
}

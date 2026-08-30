"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function setClauseAction(reviewId: string, status: "accepted" | "flagged") {
  const user = await requireUser();
  const db = await getDb();
  await db.query(
    `update clause_reviews r set status = $1
      from contracts c
     where r.id = $2 and r.contract_id = c.id and c.organization_id = $3`,
    [status, reviewId, user.organizationId],
  );
  revalidatePath("/app");
}

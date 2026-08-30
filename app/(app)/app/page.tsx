import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { missingRequired, packetReady } from "@/lib/domain";
import { setClauseAction } from "@/features/work/actions";
import { Button } from "@/components/ui/button";

export default async function PacketsPage() {
  const user = await requireUser();
  const db = await getDb();
  const contracts = await db.query<{ id: string; name: string }>(
    "select id, name from contracts where organization_id = $1",
    [user.organizationId],
  );
  const reviews = await db.query<{ id: string; contract_id: string; title: string; required: boolean; status: string; catalog_id: string }>(
    `select r.id, r.contract_id, r.status, c.title, c.required, c.id as catalog_id
       from clause_reviews r
       join clause_catalog c on c.id = r.catalog_id`,
  );
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Packets</h1>
      {contracts.rows.map((contract) => {
        const rows = reviews.rows.filter((row) => row.contract_id === contract.id);
        const missing = missingRequired(rows);
        return (
          <section key={contract.id} className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold">{contract.name}</h2>
            <p className="text-sm text-muted-foreground">{packetReady(rows) ? "Ready" : `Missing required: ${missing.map((m) => m.title).join(", ")}`}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {rows.map((row) => (
                <li key={row.id} className="flex items-center justify-between">
                  <span>{row.title} {row.required ? "(required)" : ""} · {row.status}</span>
                  <div className="flex gap-1">
                    <form action={setClauseAction.bind(null, row.id, "accepted")}><Button size="sm">Accept</Button></form>
                    <form action={setClauseAction.bind(null, row.id, "flagged")}><Button size="sm" variant="outline">Flag</Button></form>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

import { PGlite } from "@electric-sql/pglite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "../lib/db/schema-sql";
import { hashPassword } from "../lib/auth/password";

const email = "demo@clausedesk.dev";
const orgId = "org_demo";
const userId = "user_demo";

async function main() {
  mkdirSync(path.join(process.cwd(), ".data"), { recursive: true });
  const db = new PGlite(path.join(process.cwd(), ".data", "pglite"));
  await db.waitReady;
  await db.exec(SCHEMA_SQL);
  const passwordHash = await hashPassword("DemoPass123!");
  await db.query("insert into users (id, email, password_hash) values ($1, $2, $3) on conflict (email) do nothing", [userId, email, passwordHash]);
  await db.query("insert into profiles (user_id, display_name) values ($1, $2) on conflict (user_id) do nothing", [userId, "Alex Demo"]);
  await db.query("insert into organizations (id, name, slug) values ($1, $2, $3) on conflict (id) do nothing", [orgId, "Mesa Vendor Desk", "clausedesk"]);
  await db.query("insert into organization_members (id, organization_id, user_id, role) values ($1, $2, $3, $4) on conflict do nothing", ["mem_1", orgId, userId, "owner"]);

  await db.query("insert into contracts (id, organization_id, name) values ($1,$2,$3)", ["ct1", orgId, "Northshore MSA"]);
  await db.query("insert into clause_catalog (id, organization_id, title, required) values ($1,$2,$3,$4)", ["cl_nda", orgId, "Confidentiality", true]);
  await db.query("insert into clause_catalog (id, organization_id, title, required) values ($1,$2,$3,$4)", ["cl_logo", orgId, "Logo use", false]);
  await db.query("insert into clause_reviews (id, contract_id, catalog_id, status) values ($1,$2,$3,$4)", ["rv1", "ct1", "cl_nda", "pending"]);
  await db.query("insert into clause_reviews (id, contract_id, catalog_id, status) values ($1,$2,$3,$4)", ["rv2", "ct1", "cl_logo", "pending"]);
  console.log("Seeded ClauseDesk");
}

main();

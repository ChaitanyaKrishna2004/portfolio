/**
 * Creates or updates every table to match the models.
 *
 *   npm run db:push          -- additive sync (safe, keeps data)
 *   npm run db:push -- --force  -- DROP every table and recreate (destroys data)
 */
import { sequelize } from "../src/models";

async function main() {
  const force = process.argv.includes("--force");

  await sequelize.authenticate();
  console.log(`connected → ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);

  if (force) {
    console.log("--force: dropping and recreating all tables");
  }

  await sequelize.sync(force ? { force: true } : { alter: true });

  const [rows] = await sequelize.query(
    `select table_name from information_schema.tables
     where table_schema = 'public' order by table_name`
  );

  console.log(`\n${(rows as { table_name: string }[]).length} tables in sync:`);
  for (const r of rows as { table_name: string }[]) console.log(`  · ${r.table_name}`);

  await sequelize.close();
}

main().catch((err) => {
  console.error("db:push failed —", err.message);
  process.exit(1);
});

/**
 * Prints the contact inbox. Handy until the admin CMS exists.
 *
 *   npx tsx scripts/check-messages.ts
 *   npx tsx scripts/check-messages.ts --clear-tests   (removes @example.com rows)
 */
import { Op } from "sequelize";
import { sequelize, ContactMessage } from "../src/models";

async function main() {
  if (process.argv.includes("--clear-tests")) {
    const removed = await ContactMessage.destroy({
      where: { email: { [Op.like]: "%@example.com" } },
    });
    console.log(`removed ${removed} test message(s)`);
  }

  const rows = await ContactMessage.findAll({ order: [["createdAt", "ASC"]] });

  console.log(`contact_messages: ${rows.length} row(s)`);
  for (const r of rows) {
    console.log(`  · [${r.status}] ${r.name} <${r.email}> — ${r.message.slice(0, 60)}`);
  }

  await sequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

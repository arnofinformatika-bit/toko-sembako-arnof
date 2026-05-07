import { prisma } from './lib/prisma.js';

async function main() {
  const users = await prisma.user.findMany();
  console.log('Current Users:');
  users.forEach(u => {
    console.log(`- ID: ${u.id}, Username: ${u.username}, Role: ${u.role}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

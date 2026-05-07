import { prisma } from './lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const users = [
    { username: 'admin', password: '12345678', role: 'ADMIN' },
    { username: 'bos', password: 'arnofguras1212', role: 'BOS' },
    { username: 'random', password: '123456', role: 'KASIR' }
  ];

  for (const u of users) {
    const hashedPassword = bcrypt.hashSync(u.password, 12);
    
    await prisma.user.upsert({
      where: { username: u.username },
      update: {
        password: hashedPassword,
        role: u.role
      },
      create: {
        username: u.username,
        password: hashedPassword,
        role: u.role
      }
    });
    console.log(`User ${u.username} seeded.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

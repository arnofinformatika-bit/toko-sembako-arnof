import { prisma } from './lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const username = 'arnof ubl';
  const newPassword = 'password123';
  const hash = bcrypt.hashSync(newPassword, 12);

  try {
    const user = await prisma.user.update({
      where: { username: username },
      data: { password: hash }
    });
    console.log(`Berhasil mengubah password untuk user: ${username}`);
    console.log(`Password baru: ${newPassword}`);
  } catch (error) {
    console.error(`Gagal mengubah password: ${error.message}`);
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

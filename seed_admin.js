import { prisma } from './lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { username: 'admin' }
  });
  
  if (!adminExists) {
    const hashPassword = bcrypt.hashSync('admin123', 12);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashPassword,
        role: 'ADMIN',
        no_telp: '08123456789'
      }
    });
    console.log('Berhasil membuat akun Admin default!');
    console.log('Username: admin');
    console.log('Password: admin123');
  } else {
    console.log('Akun admin sudah ada di database.');
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

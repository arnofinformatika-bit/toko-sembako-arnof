import { prisma } from './lib/prisma.js';

async function main() {
  const categories = ['Snack', 'Kebutuhan Dapur', 'Lainnya'];
  
  for (const cat of categories) {
    const existing = await prisma.kategori.findFirst({
      where: { nama_kategori: cat }
    });
    
    if (!existing) {
      await prisma.kategori.create({
        data: {
          nama_kategori: cat,
          deskripsi: `Kategori ${cat}`
        }
      });
      console.log(`Berhasil menambahkan kategori: ${cat}`);
    } else {
      console.log(`Kategori ${cat} sudah ada di database.`);
    }
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

import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from '../generated/prisma/client.ts'

// Fungsi parsing yang lebih kuat menggunakan URL built-in browser/node
const getDbConfig = () => {
    const urlString = process.env.DATABASE_URL;
    
    if (urlString && urlString.startsWith('mysql://')) {
        try {
            // Menggunakan URL parser asli agar tidak salah baca karakter spesial
            const url = new URL(urlString);
            return {
                user: url.username,
                password: url.password,
                host: url.hostname,
                port: parseInt(url.port || '3306'),
                database: url.pathname.replace('/', '').split('?')[0] // Ambil nama DB saja
            };
        } catch (e) {
            console.error("Gagal parsing DATABASE_URL:", e.message);
        }
    }

    // Fallback ke variabel individu atau localhost
    return {
        host: process.env.DB_HOST || 'Localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'db_toko_sembako',
        port: parseInt(process.env.DB_PORT || '3306')
    };
};

const dbConfig = getDbConfig();
console.log("Menghubungkan ke database di host:", dbConfig.host);

const adapter = new PrismaMariaDb(dbConfig);
const prisma = new PrismaClient({ adapter });

export { prisma };
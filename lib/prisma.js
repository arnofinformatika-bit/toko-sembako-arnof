import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from '@prisma/client'

const getDbConfig = () => {
    const urlString = process.env.DATABASE_URL;
    
    if (urlString && urlString.startsWith('mysql://')) {
        try {
            const url = new URL(urlString);
            return {
                user: url.username,
                password: url.password,
                host: url.hostname,
                port: parseInt(url.port || '3306'),
                database: url.pathname.replace('/', '').split('?')[0],
                // Tambahkan SSL untuk koneksi cloud (seperti Aiven)
                ssl: {
                    rejectUnauthorized: false // Membolehkan koneksi SSL dari Aiven/Cloud
                }
            };
        } catch (e) {
            console.error("Gagal parsing DATABASE_URL:", e.message);
        }
    }

    if (process.env.NODE_ENV === 'production' && !urlString) {
        throw new Error("DATABASE_URL is missing! Please set it in Vercel environment variables.");
    }

    return {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'db_toko_sembako',
        port: parseInt(process.env.DB_PORT || '3306')
    };
};

let prisma;

if (process.env.NODE_ENV === 'production') {
    // Di Vercel, gunakan koneksi standar agar lebih stabil
    // Pastikan DATABASE_URL sudah di-set di Dashboard Vercel
    prisma = new PrismaClient();
} else {
    // Di lokal, gunakan adapter jika diperlukan
    const dbConfig = getDbConfig();
    const adapter = new PrismaMariaDb(dbConfig);
    prisma = new PrismaClient({ adapter });
}

export { prisma };
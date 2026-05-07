import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from '../generated/prisma/client.ts'

// Fungsi untuk memecah DATABASE_URL menjadi objek yang dimengerti adapter
const parseDatabaseUrl = (url) => {
    try {
        const regex = /mysql:\/\/([^:]+):?([^@]+)?@([^:]+):?(\d+)?\/(.+)/
        const matches = url.match(regex)
        if (matches) {
            return {
                user: matches[1],
                password: matches[2] || '',
                host: matches[3],
                port: parseInt(matches[4] || '3306'),
                database: matches[5]
            }
        }
    } catch (e) {
        console.error("Gagal parsing DATABASE_URL, menggunakan default localhost")
    }
    return {
        host: 'Localhost',
        user: 'root',
        password: '',
        database: 'db_toko_sembako',
        port: 3306
    }
}

const dbConfig = process.env.DATABASE_URL 
    ? parseDatabaseUrl(process.env.DATABASE_URL)
    : {
        host: process.env.DB_HOST || 'Localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'db_toko_sembako',
        port: parseInt(process.env.DB_PORT || '3306')
      }

const adapter = new PrismaMariaDb(dbConfig)

const prisma = new PrismaClient({ adapter })
export { prisma }
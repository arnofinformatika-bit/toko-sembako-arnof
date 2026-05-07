import express from 'express'
import cors from 'cors'
import UserRoute from './routes/user.route.js'
import KategoriRoute from './routes/kategori.route.js'
import BarangRoute from './routes/barang.route.js'
import TransaksiRoute from './routes/transaksi.route.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
    res.send("Toko Sembako API is running!")
})

// Tambahkan prefix /api untuk semua rute backend
app.use('/api/user', UserRoute)
app.use('/api/kategori', KategoriRoute)
app.use('/api/barang', BarangRoute)
app.use('/api/transaksi', TransaksiRoute)

// Fallback untuk route yang tidak ditemukan
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: "API Route not found" })
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Server started on port 3000')
    })
}

export default app
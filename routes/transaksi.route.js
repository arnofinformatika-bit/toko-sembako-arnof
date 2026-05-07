import express from 'express'
import { createTransaksi, getAllTransaksi } from '../controllers/transaksi.controller.js'

const router = express.Router()

router.get('/', getAllTransaksi)
router.post('/', createTransaksi)

export default router

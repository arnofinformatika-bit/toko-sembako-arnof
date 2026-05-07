import express from 'express'
import { createKategori, deleteKategori, getAllKategori, updateKategori } from '../controllers/kategori.controller.js'

const router = express.Router()

router.get('/', getAllKategori)
router.post('/', createKategori)
router.put('/:id', updateKategori)
router.delete('/:id', deleteKategori)

export default router

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { fetchAPI } from '../utils/api';
import Notification from '../components/Notification';

function Barang() {
  const [barangList, setBarangList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_barang: '',
    harga: '',
    stok: '',
    kategori_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [barangRes, kategoriRes] = await Promise.all([
        fetchAPI('/barang'),
        fetchAPI('/kategori')
      ]);
      setBarangList(barangRes.data || []);
      setKategoriList(kategoriRes.data || []);
    } catch (error) {
      console.error("Gagal memuat data", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        harga: parseInt(formData.harga),
        stok: parseInt(formData.stok),
        kategori_id: parseInt(formData.kategori_id)
      };

      if (isEditing) {
        await fetchAPI(`/barang/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchAPI('/barang', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      resetForm();
      loadData();
      setNotification({ message: `Barang berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}`, type: 'success' });
    } catch (error) {
      console.error("Gagal menyimpan barang", error);
      setNotification({ message: error.message || "Terjadi kesalahan", type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama_barang: item.nama_barang,
      harga: item.harga.toString(),
      stok: item.stok.toString(),
      kategori_id: item.kategori_id.toString()
    });
    setEditId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        await fetchAPI(`/barang/${id}`, { method: 'DELETE' });
        loadData();
        setNotification({ message: "Barang berhasil dihapus", type: 'success' });
      } catch (error) {
        console.error("Gagal menghapus barang", error);
        setNotification({ message: error.message || "Gagal menghapus barang", type: 'error' });
      }
    }
  };

  const resetForm = () => {
    setFormData({ nama_barang: '', harga: '', stok: '', kategori_id: '' });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="animate-slide-up">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      <div className="page-header">
        <h1 className="page-title">Manajemen Barang</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={18} /> Tambah Barang
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {barangList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>{item.nama_barang}</td>
                    <td>{item.kategori?.nama_kategori || 'N/A'}</td>
                    <td>{formatRupiah(item.harga)}</td>
                    <td>
                      <span style={{ 
                        background: item.stok < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: item.stok < 10 ? 'var(--danger)' : 'var(--success)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {item.stok}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(item)} className="btn" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {barangList.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data barang</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Barang' : 'Tambah Barang'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Nama Barang</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.nama_barang}
                  onChange={(e) => setFormData({...formData, nama_barang: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Kategori</label>
                <select 
                  className="input-field"
                  value={formData.kategori_id}
                  onChange={(e) => setFormData({...formData, kategori_id: e.target.value})}
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {kategoriList.map(k => (
                    <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="input-group" style={{ flex: '1 1 150px' }}>
                  <label>Harga (Rp)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.harga}
                    onChange={(e) => setFormData({...formData, harga: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                <div className="input-group" style={{ flex: '1 1 150px' }}>
                  <label>Stok</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.stok}
                    onChange={(e) => setFormData({...formData, stok: e.target.value})}
                    required
                    min="0"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'var(--bg-gradient-end)' }}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Barang;

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { fetchAPI } from '../utils/api';
import Notification from '../components/Notification';

function Kategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nama_kategori: '', deskripsi: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadKategori();
  }, []);

  const loadKategori = async () => {
    try {
      const data = await fetchAPI('/kategori');
      setKategoriList(data.data || []);
    } catch (error) {
      console.error("Gagal memuat kategori", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await fetchAPI(`/kategori/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchAPI('/kategori', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      resetForm();
      loadKategori();
      setNotification({ message: `Kategori berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}`, type: 'success' });
    } catch (error) {
      console.error("Gagal menyimpan kategori", error);
      setNotification({ message: error.message || "Terjadi kesalahan", type: 'error' });
    }
  };

  const handleEdit = (item) => {
    setFormData({ nama_kategori: item.nama_kategori, deskripsi: item.deskripsi || '' });
    setEditId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await fetchAPI(`/kategori/${id}`, { method: 'DELETE' });
        loadKategori();
        setNotification({ message: "Kategori berhasil dihapus", type: 'success' });
      } catch (error) {
        console.error("Gagal menghapus kategori", error);
        setNotification({ message: "Gagal menghapus. Pastikan tidak ada barang yang terkait.", type: 'error' });
      }
    }
  };

  const resetForm = () => {
    setFormData({ nama_kategori: '', deskripsi: '' });
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
        <h1 className="page-title">Manajemen Kategori</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="page-layout">
        <div className="table-section">
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="table-container">
              {loading ? (
                <p>Memuat data...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Kategori</th>
                      <th>Deskripsi</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kategoriList.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td style={{ fontWeight: 500 }}>{item.nama_kategori}</td>
                        <td>{item.deskripsi || '-'}</td>
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
                    {kategoriList.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data kategori</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="form-section">
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-dark)' }}>
                  {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Nama Kategori</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.nama_kategori}
                    onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})}
                    required
                    placeholder="Misal: Minuman"
                  />
                </div>
                <div className="input-group">
                  <label>Deskripsi (Opsional)</label>
                  <textarea 
                    className="input-field" 
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    rows="3"
                    placeholder="Deskripsi singkat"
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Kategori;

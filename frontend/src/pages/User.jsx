import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { fetchAPI } from '../utils/api';

function User() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'KASIR',
    no_telp: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchAPI('/user');
      setUserList(res.data || []);
    } catch (error) {
      console.error("Gagal memuat data user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      
      // Jika edit dan password kosong, jangan kirim password (tetap yang lama)
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      if (isEditing) {
        await fetchAPI(`/user/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchAPI('/user/register', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Gagal menyimpan user", error);
      alert(error.message || "Terjadi kesalahan");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      username: item.username,
      password: '', // Kosongkan agar bisa diisi baru
      role: item.role,
      no_telp: item.no_telp || ''
    });
    setEditId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Jangan hapus diri sendiri (bisa ditambahkan validasi)
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.id === id) {
      alert("Anda tidak bisa menghapus akun Anda sendiri.");
      return;
    }

    if (window.confirm('Yakin ingin menghapus user ini?')) {
      try {
        await fetchAPI(`/user/${id}`, { method: 'DELETE' });
        loadData();
      } catch (error) {
        console.error("Gagal menghapus user", error);
        alert("Gagal menghapus. Data mungkin terkait dengan transaksi.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ username: '', password: '', role: 'KASIR', no_telp: '' });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <h1 className="page-title">Manajemen User</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={18} /> Tambah User
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
                  <th>Username</th>
                  <th>No. Telepon</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
                          <UserIcon size={16} />
                        </div>
                        {item.username}
                      </div>
                    </td>
                    <td>{item.no_telp || '-'}</td>
                    <td>
                      <span style={{ 
                        background: item.role === 'ADMIN' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: item.role === 'ADMIN' ? 'var(--primary-color)' : 'var(--success)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        {item.role === 'ADMIN' && <Shield size={12} />}
                        {item.role}
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
                {userList.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Belum ada data user</td>
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
            <h2 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit User' : 'Tambah User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password {isEditing && '(Kosongkan jika tidak ingin mengubah)'}</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!isEditing}
                />
              </div>
              <div className="input-group">
                <label>No. Telepon</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.no_telp}
                  onChange={(e) => setFormData({...formData, no_telp: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select 
                  className="input-field"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="KASIR">KASIR</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="BOS">BOS</option>
                  <option value="USER">USER</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
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

export default User;

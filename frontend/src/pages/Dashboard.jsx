import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Tags, TrendingUp } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    barang: 0,
    kategori: 0,
    transaksi: 0,
    pendapatan: 0
  });

  useEffect(() => {
    // We will fetch real data later
    // For now, static beautiful placeholders
    setStats({
      barang: 124,
      kategori: 12,
      transaksi: 85,
      pendapatan: 4500000
    });
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="animate-slide-up">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p style={{ color: 'var(--text-light)' }}>Selamat datang kembali, Kasir!</p>
      </div>

      <div className="card-grid">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Barang</span>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.8rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <Package size={24} />
            </div>
          </div>
          <span className="stat-value">{stats.barang}</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Kategori</span>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.8rem', borderRadius: '50%', color: 'var(--secondary-color)' }}>
              <Tags size={24} />
            </div>
          </div>
          <span className="stat-value">{stats.kategori}</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Total Transaksi</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.8rem', borderRadius: '50%', color: 'var(--success)' }}>
              <ShoppingBag size={24} />
            </div>
          </div>
          <span className="stat-value">{stats.transaksi}</span>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Pendapatan Hari Ini</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.8rem', borderRadius: '50%', color: 'var(--warning)' }}>
              <TrendingUp size={24} />
            </div>
          </div>
          <span className="stat-value" style={{ fontSize: '1.8rem' }}>{formatRupiah(stats.pendapatan)}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--text-dark)' }}>Aktivitas Terbaru</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((_, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ background: 'var(--white)', padding: '0.6rem', borderRadius: '50%' }}>
                  <ShoppingBag size={18} color="var(--primary-color)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500 }}>Transaksi #TRX-00{i+1}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Beberapa menit yang lalu</span>
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 600 }}>
                  {formatRupiah(150000)}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

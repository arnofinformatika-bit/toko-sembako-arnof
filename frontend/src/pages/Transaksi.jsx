import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle, Printer, X } from 'lucide-react';
import { fetchAPI } from '../utils/api';
import Notification from '../components/Notification';

function Transaksi() {
  const [barangList, setBarangList] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBarang();
  }, []);

  const loadBarang = async () => {
    try {
      const data = await fetchAPI('/barang');
      setBarangList(data.data || []);
    } catch (error) {
      console.error("Gagal memuat barang", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const addToCart = (barang) => {
    if (barang.stok <= 0) {
      setNotification({ message: "Stok barang habis!", type: 'error' });
      return;
    }
    
    setCart(prev => {
      const existing = prev.find(item => item.id === barang.id);
      if (existing) {
        if (existing.qty >= barang.stok) {
          setNotification({ message: "Melebihi stok yang tersedia", type: 'error' });
          return prev;
        }
        return prev.map(item => item.id === barang.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...barang, qty: 1 }];
    });
  };

  const updateQty = (id, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + change;
        if (newQty > 0 && newQty <= item.stok) {
          return { ...item, qty: newQty };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalBelanja = cart.reduce((total, item) => total + (item.harga * item.qty), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const payload = {
        // Untuk saat ini, asumsikan user_id = 1 (kasir pertama)
        user_id: 1, 
        items: cart.map(item => ({
          barang_id: item.id,
          jumlah: item.qty,
          harga_satuan: item.harga
        }))
      };

      const response = await fetchAPI('/transaksi', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Siapkan data struk dengan nama barang dari cart
      const receipt = {
        ...response.data,
        items: cart.map(item => ({
          nama_barang: item.nama_barang,
          jumlah: item.qty,
          harga_satuan: item.harga,
          subtotal: item.harga * item.qty
        }))
      };

      setReceiptData(receipt);
      setShowReceipt(true);
      setCart([]);
      loadBarang(); // Refresh stok
      setNotification({ message: "Transaksi berhasil diproses", type: 'success' });
    } catch (error) {
      console.error("Gagal transaksi", error);
      setNotification({ message: "Transaksi gagal: " + error.message, type: 'error' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  return (
    <div className="animate-slide-up transaction-layout">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      {/* Katalog Barang */}
      <div className="transaction-catalog">
        <div className="page-header">
          <h1 className="page-title">Pilih Barang</h1>
        </div>
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {loading ? (
            <p>Memuat katalog...</p>
          ) : (
            barangList.map(barang => (
              <div key={barang.id} className="glass-panel" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => addToCart(barang)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{barang.nama_barang}</h3>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>Stok: {barang.stok}</span>
                </div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{barang.kategori?.nama_kategori}</div>
                <div style={{ marginTop: 'auto', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                  {formatRupiah(barang.harga)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Keranjang Belanja */}
      <div className="glass-panel transaction-cart" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <ShoppingCart size={24} color="var(--primary-color)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Keranjang</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem 0' }}>
              Keranjang masih kosong
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, gap: '1rem' }}>
                  <span>{item.nama_barang}</span>
                  <span style={{ whiteSpace: 'nowrap' }}>{formatRupiah(item.harga * item.qty)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{formatRupiah(item.harga)} / pcs</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: 'var(--white)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: 'var(--white)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                      <Plus size={14} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', marginLeft: '0.5rem' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>Total Bayar</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>{formatRupiah(totalBelanja)}</span>
          </div>
          <button 
            className="btn btn-primary" 
            style={{ padding: '1rem', fontSize: '1.1rem', width: '100%' }}
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            <CheckCircle size={20} /> Proses Transaksi
          </button>
        </div>
      </div>

      {/* Modal Struk */}
      {showReceipt && receiptData && (
        <div className="modal-overlay">
          <div className="receipt-modal animate-slide-up">
            <div className="receipt-header">
              <h2 className="receipt-title">TokoSembako Arnof</h2>
              <p className="receipt-info">Jl.Gunung Waras,Kampung Gunung Waras,Kecamatan Pakuan Ratu. Kabupaten Way Kanan , Lampung</p>
              <p className="receipt-info">Telp: 0858-9661-19444</p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="receipt-item-row">
                <span>No. Transaksi:</span>
                <span>#{receiptData.id}</span>
              </div>
              <div className="receipt-item-row">
                <span>Tanggal:</span>
                <span>{new Date(receiptData.tanggal_transaksi).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="receipt-divider"></div>
            
            <div className="receipt-items">
              {receiptData.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.nama_barang}</div>
                  <div className="receipt-item-row">
                    <span style={{ color: '#666' }}>{item.jumlah} x {formatRupiah(item.harga_satuan)}</span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-total">
              <span>TOTAL</span>
              <span>{formatRupiah(receiptData.total_harga)}</span>
            </div>

            <div className="receipt-footer">
              <p>Terima kasih telah berbelanja!</p>
              <p>Barang yang sudah dibeli tidak dapat ditukar</p>
            </div>

            <div className="receipt-actions">
              <button className="btn" style={{ flex: 1, background: '#eee' }} onClick={closeReceipt}>
                <X size={18} /> Tutup
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePrint}>
                <Printer size={18} /> Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transaksi;

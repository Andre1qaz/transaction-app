import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTransaction, updateTransaction, getTransactionById } from '../api/transactionApi';

const INITIAL_STATE = {
  product_id: '', product_name: '', amount: '',
  customer_name: '', status: 0,
  transaction_date: '', create_by: '',
};

export default function TransactionForm({ mode }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (mode === 'edit' && id) {
      getTransactionById(id).then((res) => {
        const d = res.data.data;
        setForm({
          product_id: d.product_id,
          product_name: d.product_name,
          amount: d.amount,
          customer_name: d.customer_name,
          status: d.status,
          transaction_date: d.transaction_date?.slice(0, 16),
          create_by: d.create_by,
        });
      });
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'edit') {
        await updateTransaction(id, form);
        alert('Data berhasil diperbarui!');
      } else {
        await createTransaction(form);
        alert('Data berhasil ditambahkan!');
      }
      navigate('/');
    } catch {
      alert('Terjadi kesalahan. Coba lagi.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{mode === 'edit' ? ' Edit Transaksi' : ' Tambah Transaksi'}</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Product ID', name: 'product_id', type: 'text' },
            { label: 'Nama Produk', name: 'product_name', type: 'text' },
            { label: 'Jumlah (Amount)', name: 'amount', type: 'number' },
            { label: 'Nama Customer', name: 'customer_name', type: 'text' },
            { label: 'Tanggal Transaksi', name: 'transaction_date', type: 'datetime-local' },
            { label: 'Dibuat Oleh', name: 'create_by', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name} style={styles.formGroup}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          ))}
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
              <option value={0}>SUCCESS</option>
              <option value={1}>FAILED</option>
            </select>
          </div>
          <div style={styles.btnRow}>
            <button type="button" onClick={() => navigate('/')} style={styles.btnCancel}>Batal</button>
            <button type="submit" disabled={loading} style={styles.btnSubmit}>
              {loading ? 'Menyimpan...' : (mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Data')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 16px' },
  card: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '36px', width: '100%', maxWidth: '560px' },
  title: { color: '#1e3a5f', marginBottom: '28px', fontSize: '1.3rem' },
  formGroup: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: '#444' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #d0daea', borderRadius: '7px', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' },
  btnRow: { display: 'flex', gap: '12px', marginTop: '28px' },
  btnCancel: { flex: 1, padding: '11px', background: '#f0f0f0', color: '#555', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600' },
  btnSubmit: { flex: 2, padding: '11px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' },
};
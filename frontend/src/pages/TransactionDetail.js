import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactionById } from '../api/transactionApi';
import { STATUS_MAP } from '../utils/groupByMonthYear';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trx, setTrx] = useState(null);

  useEffect(() => {
    getTransactionById(id).then((res) => setTrx(res.data.data)).catch(() => alert('Data tidak ditemukan'));
  }, [id]);

  if (!trx) return <div style={{ textAlign: 'center', marginTop: '80px' }}>Memuat data...</div>;

  const fields = [
    ['ID Transaksi', trx.id],
    ['Product ID', trx.product_id],
    ['Nama Produk', trx.product_name],
    ['Jumlah', `Rp ${Number(trx.price).toLocaleString('id-ID')}`],
    ['Nama Customer', trx.customer_name],
    ['Status', STATUS_MAP[trx.status]],
    ['Tanggal Transaksi', new Date(trx.transaction_date).toLocaleString('id-ID')],
    ['Dibuat Oleh', trx.create_by],
    ['Dibuat Pada', new Date(trx.create_on).toLocaleString('id-ID')],
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}> Detail Transaksi #{trx.id}</h2>
        <table style={styles.table}>
          <tbody>
            {fields.map(([label, value]) => (
              <tr key={label}>
                <td style={styles.tdLabel}>{label}</td>
                <td style={styles.tdSep}>:</td>
                <td style={styles.tdValue}>
                  {label === 'Status' ? (
                    <span style={trx.status === 0 ? styles.success : styles.failed}>{value}</span>
                  ) : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.btnRow}>
          <button onClick={() => navigate('/')} style={styles.btnBack}>← Kembali</button>
          <button onClick={() => navigate(`/edit/${trx.id}`)} style={styles.btnEdit}>✏️ Edit</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 16px' },
  card: { background: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '36px', width: '100%', maxWidth: '560px' },
  title: { color: '#1e3a5f', marginBottom: '28px', fontSize: '1.3rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '28px' },
  tdLabel: { padding: '10px 0', fontWeight: '600', color: '#444', width: '170px', fontSize: '0.9rem', verticalAlign: 'top' },
  tdSep: { padding: '10px 8px', color: '#999', verticalAlign: 'top' },
  tdValue: { padding: '10px 0', color: '#222', fontSize: '0.9rem', verticalAlign: 'top' },
  success: { background: '#d4f0dc', color: '#1a7a37', padding: '3px 12px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600' },
  failed: { background: '#fde8e8', color: '#c0392b', padding: '3px 12px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600' },
  btnRow: { display: 'flex', gap: '12px' },
  btnBack: { flex: 1, padding: '11px', background: '#f0f0f0', color: '#555', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600' },
  btnEdit: { flex: 1, padding: '11px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600' },
};
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTransactions, deleteTransaction } from '../api/transactionApi';
import { groupByYearMonth, STATUS_MAP } from '../utils/groupByMonthYear';

export default function TransactionList() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [collapsedKeys, setCollapsedKeys] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllTransactions();
      setGrouped(groupByYearMonth(res.data.data));
    } catch {
      alert('Gagal memuat data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
    try {
      await deleteTransaction(id);
      fetchData();
    } catch {
      alert('Gagal menghapus');
    }
  };

  const toggleCollapse = (key) => {
    setCollapsedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <div style={styles.center}>Memuat data...</div>;

  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Daftar Transaksi</h2>
      {years.length === 0 && <p>Belum ada data transaksi.</p>}
      {years.map((year) => (
        <div key={year} style={styles.yearBlock}>
          <div style={styles.yearHeader}> Tahun {year}</div>
          {Object.keys(grouped[year]).sort((a, b) => b.localeCompare(a)).map((monthKey) => {
            const { label, items } = grouped[year][monthKey];
            const isCollapsed = collapsedKeys[monthKey];
            return (
              <div key={monthKey} style={styles.monthBlock}>
                <div style={styles.monthHeader} onClick={() => toggleCollapse(monthKey)}>
                  <span>{isCollapsed ? '▶' : '▼'} {label}</span>
                  <span style={styles.badge}>{items.length} transaksi</span>
                </div>
                {!isCollapsed && (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.thead}>
                          <th style={styles.th}>ID</th>
                          <th style={styles.th}>Product ID</th>
                          <th style={styles.th}>Nama Produk</th>
                          <th style={styles.th}>Harga</th>
                          <th style={styles.th}>Customer</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Tanggal Transaksi</th>
                          <th style={styles.th}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((trx, idx) => (
                          <tr key={trx.id} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                            <td style={styles.td}>{trx.id}</td>
                            <td style={styles.td}>{trx.product_id}</td>
                            <td style={styles.td}>{trx.product_name}</td>
                            <td style={styles.td}>Rp {Number(trx.amount).toLocaleString('id-ID')}</td>
                            <td style={styles.td}>{trx.customer_name}</td>
                            <td style={styles.td}>
                              <span style={trx.status === 0 ? styles.success : styles.failed}>
                                {STATUS_MAP[trx.status]}
                              </span>
                            </td>
                            <td style={styles.td}>{new Date(trx.transaction_date).toLocaleString('id-ID')}</td>
                            <td style={styles.td}>
                              <button onClick={() => navigate(`/detail/${trx.id}`)} style={styles.btnView}>Detail</button>
                              <button onClick={() => navigate(`/edit/${trx.id}`)} style={styles.btnEdit}>Edit</button>
                              <button onClick={() => handleDelete(trx.id)} style={styles.btnDelete}>Hapus</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' },
  title: { fontSize: '1.5rem', color: '#1e3a5f', marginBottom: '20px' },
  center: { textAlign: 'center', marginTop: '80px', fontSize: '1.1rem' },
  yearBlock: { marginBottom: '24px' },
  yearHeader: { background: '#1e3a5f', color: 'white', padding: '10px 18px', borderRadius: '8px 8px 0 0', fontWeight: 'bold', fontSize: '1rem' },
  monthBlock: { marginBottom: '12px', borderRadius: '0 0 8px 8px', border: '1px solid #dce8f5' },
  monthHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e8f0fb', padding: '10px 18px', cursor: 'pointer', fontWeight: '600', color: '#1e3a5f', userSelect: 'none' },
  badge: { background: '#1e3a5f', color: 'white', borderRadius: '12px', padding: '2px 10px', fontSize: '0.8rem' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f0f5ff' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '0.85rem', color: '#3a5a8c', fontWeight: '600', borderBottom: '2px solid #dce8f5' },
  td: { padding: '9px 14px', fontSize: '0.88rem', color: '#333', verticalAlign: 'middle' },
  rowEven: { background: '#ffffff' },
  rowOdd: { background: '#f8fbff' },
  success: { background: '#d4f0dc', color: '#1a7a37', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' },
  failed: { background: '#fde8e8', color: '#c0392b', padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' },
  btnView: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', marginRight: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  btnEdit: { background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', marginRight: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  btnDelete: { background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' },
};
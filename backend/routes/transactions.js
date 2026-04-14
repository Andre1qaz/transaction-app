const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET semua transaksi
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions ORDER BY transaction_date DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET satu transaksi berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST tambah transaksi baru
router.post('/', async (req, res) => {
  try {
    const { product_id, product_name, amount, customer_name, status, transaction_date, create_by } = req.body;
    const result = await pool.query(
      `INSERT INTO transactions (product_id, product_name, amount, customer_name, status, transaction_date, create_by, create_on)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [product_id, product_name, amount, customer_name, status, transaction_date, create_by]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update transaksi
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, product_name, amount, customer_name, status, transaction_date, create_by } = req.body;
    const result = await pool.query(
      `UPDATE transactions
       SET product_id=$1, product_name=$2, amount=$3, customer_name=$4, status=$5, transaction_date=$6, create_by=$7
       WHERE id=$8 RETURNING *`,
      [product_id, product_name, amount, customer_name, status, transaction_date, create_by, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE transaksi
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM transactions WHERE id=$1 RETURNING *', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
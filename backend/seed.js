const pool = require('./db');

const data = [
  { id: 1372, productID: "10001", productName: "Test 1", amount: "1000", customerName: "abc", status: 0, transactionDate: "2022-07-10 11:14:52", createBy: "abc", createOn: "2022-07-10 11:14:52" },
  { id: 1373, productID: "10002", productName: "Test 2", amount: "2000", customerName: "abc", status: 0, transactionDate: "2022-07-11 13:14:52", createBy: "abc", createOn: "2022-07-10 13:14:52" },
  { id: 1374, productID: "10001", productName: "Test 1", amount: "1000", customerName: "abc", status: 0, transactionDate: "2022-08-10 12:14:52", createBy: "abc", createOn: "2022-07-10 12:14:52" },
  { id: 1375, productID: "10002", productName: "Test 2", amount: "1000", customerName: "abc", status: 1, transactionDate: "2022-08-10 13:10:52", createBy: "abc", createOn: "2022-07-10 13:10:52" },
  { id: 1376, productID: "10001", productName: "Test 1", amount: "1000", customerName: "abc", status: 0, transactionDate: "2022-08-10 13:11:52", createBy: "abc", createOn: "2022-07-10 13:11:52" },
  { id: 1377, productID: "10002", productName: "Test 2", amount: "2000", customerName: "abc", status: 0, transactionDate: "2022-08-12 13:14:52", createBy: "abc", createOn: "2022-07-10 13:14:52" },
  { id: 1378, productID: "10001", productName: "Test 1", amount: "1000", customerName: "abc", status: 0, transactionDate: "2022-08-12 14:11:52", createBy: "abc", createOn: "2022-07-10 14:11:52" },
  { id: 1379, productID: "10002", productName: "Test 2", amount: "1000", customerName: "abc", status: 1, transactionDate: "2022-09-13 11:14:52", createBy: "abc", createOn: "2022-07-10 11:14:52" },
  { id: 1380, productID: "10001", productName: "Test 1", amount: "1000", customerName: "abc", status: 0, transactionDate: "2022-09-13 13:14:52", createBy: "abc", createOn: "2022-07-10 13:14:52" },
  { id: 1381, productID: "10002", productName: "Test 2", amount: "2000", customerName: "abc", status: 0, transactionDate: "2022-09-14 09:11:52", createBy: "abc", createOn: "2022-07-10 09:11:52" },
  { id: 1382, productID: "10001", productName: "Test 1", amount: "1000", customerName: "abc", status: 0, transactionDate: "2022-09-14 10:14:52", createBy: "abc", createOn: "2022-07-10 10:14:52" },
  { id: 1383, productID: "10002", productName: "Test 2", amount: "1000", customerName: "abc", status: 1, transactionDate: "2022-08-15 13:14:52", createBy: "abc", createOn: "2022-07-10 13:14:52" },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const item of data) {
      await client.query(
        `INSERT INTO transactions (id, product_id, product_name, amount, customer_name, status, transaction_date, create_by, create_on)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [item.id, item.productID, item.productName, item.amount, item.customerName, item.status, item.transactionDate, item.createBy, item.createOn]
      );
    }
    await client.query('COMMIT');
    console.log('Seed berhasil! Data transaksi sudah masuk ke database.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed gagal:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
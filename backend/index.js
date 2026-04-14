const express = require('express');
const cors = require('cors');
require('dotenv').config();

const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Transaction API is running' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
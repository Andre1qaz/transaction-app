import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getAllTransactions = () => axios.get(`${BASE_URL}/transactions`);
export const getTransactionById = (id) => axios.get(`${BASE_URL}/transactions/${id}`);
export const createTransaction = (data) => axios.post(`${BASE_URL}/transactions`, data);
export const updateTransaction = (id, data) => axios.put(`${BASE_URL}/transactions/${id}`, data);
export const deleteTransaction = (id) => axios.delete(`${BASE_URL}/transactions/${id}`);
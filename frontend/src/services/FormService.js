import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/invoices`, invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

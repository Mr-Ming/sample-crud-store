import axios from 'axios';
import { Product, ProductFormData } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  },

  createProduct: async (product: ProductFormData): Promise<Product> => {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
  },

  updateProduct: async (id: number, product: ProductFormData): Promise<Product> => {
    const response = await axios.put(`${API_URL}/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/products/${id}`);
  }
}; 
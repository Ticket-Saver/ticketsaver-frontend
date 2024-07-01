import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // URL del servidor Express
});

export const createCheckoutSession = async (cart, event) => {
  try {
    const response = await api.post('/checkout', { cart, event });
    return response.data;
  } catch (error) {
    throw error;
  }
};

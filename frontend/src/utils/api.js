import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth
export const login = (credentials) => api.post('/login', credentials);

// Designs
export const getDesigns = () => api.get('/designs');
export const getDesign = (id) => api.get(`/designs/${id}`);
export const saveDesign = (design) => api.post('/design', design);

// Orders
export const getOrders = () => api.get('/orders');
export const placeOrder = (order) => api.post('/order', order);

// Businesses
export const getBusinesses = (type) => api.get('/businesses', { params: type ? { type } : {} });
export const registerBusiness = (business) => api.post('/business', business);

// Ratings
export const submitRating = (ratingData) => api.post('/rating', ratingData);

// Fabrics
export const getFabrics = () => api.get('/fabrics');

export default api;

// api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// AUTH
export const registerCustomer = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// CATALOGUE
export const getCatalogue = (search = "") =>
  api.get("/catalogue/", { params: search ? { search } : {} });
export const getBook = (bookId) => api.get(`/catalogue/${bookId}`);
export const addBook = (data) => api.post("/catalogue/", data);
export const updateBook = (bookId, data) => api.put(`/catalogue/${bookId}`, data);
export const deleteBook = (bookId) => api.delete(`/catalogue/${bookId}`);

// CART
export const getCart = (customerId) => api.get(`/cart/${customerId}`);
export const addToCart = (data) => api.post("/cart/add", data);
export const updateCartQuantity = (data) => api.put("/cart/update", data);
export const removeFromCart = (customerId, bookId) =>
  api.delete(`/cart/${customerId}/${bookId}`);


// ORDERS
export const checkout = (data) => api.post("/orders/checkout", data);
export const getCustomerOrders = (customerId) =>
  api.get(`/orders/customer/${customerId}`);

// STAFF
export const getSalesReport = (dateFrom, dateTo) =>
  api.get("/staff/report", { params: { date_from: dateFrom, date_to: dateTo } });
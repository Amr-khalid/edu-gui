import axios from "axios";

// 1. استدعاء الرابط من الـ .env
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
});

// 2. الاختصار السحري (Interceptors)
// الكود ده هيتنفذ "تلقائياً" قبل أي طلب يروح للسيرفر
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // بيضيف التوكن في الهيدر أوتوماتيكياً
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

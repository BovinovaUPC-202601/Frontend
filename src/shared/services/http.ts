import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.message) {
            return Promise.reject(new Error(error.response.data.message));
        }
        if (error.response?.data) {
            const data = error.response.data;
            if (typeof data === 'string') return Promise.reject(new Error(data));
            if (Array.isArray(data.errors)) {
                const msg = data.errors.map((e: any) => e.message || e).join('. ');
                if (msg) return Promise.reject(new Error(msg));
            }
            if (data.title) return Promise.reject(new Error(data.title));
        }
        return Promise.reject(error);
    }
);

export default http;
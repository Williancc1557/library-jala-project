import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const booksAPI = {
  search: async (params: {
    q: string;
    startIndex?: number;
    maxResults?: number;
    orderBy?: string;
    category?: string;
    author?: string;
  }) => {
    const response = await api.get("/api/books/search", { params });
    return response.data;
  },

  getPopular: async (maxResults = 20) => {
    const response = await api.get("/api/books/popular", {
      params: { maxResults },
    });
    return response.data;
  },

  getByCategory: async (category: string, maxResults = 20) => {
    const response = await api.get(`/api/books/category/${category}`, {
      params: { maxResults },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/books/${id}`);
    return response.data;
  },

  getAllLocal: async () => {
    const response = await api.get("/api/books/local/all");
    return response.data;
  },

  getAvailable: async () => {
    const response = await api.get("/api/books/local/available");
    return response.data;
  },

  addToLibrary: async (googleBooksId: string) => {
    const response = await api.post(`/api/books/${googleBooksId}/add`);
    return response.data;
  },
};

export const loansAPI = {
  getMyLoans: async () => {
    const response = await api.get("/api/loans/my-loans");
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get("/api/loans/history");
    return response.data;
  },

  borrowBook: async (bookId: string) => {
    const response = await api.post(`/api/loans/borrow/${bookId}`);
    return response.data;
  },

  returnBook: async (loanId: string) => {
    const response = await api.post(`/api/loans/return/${loanId}`);
    return response.data;
  },

  reserveBook: async (bookId: string) => {
    const response = await api.post(`/api/loans/reserve/${bookId}`);
    return response.data;
  },

  getReservations: async () => {
    const response = await api.get("/api/loans/reservations");
    return response.data;
  },

  getOverdue: async () => {
    const response = await api.get("/api/loans/overdue");
    return response.data;
  },
};

export const readingAPI = {
  getStatus: async (bookId: string) => {
    const response = await api.get(`/api/reading/status/${bookId}`);
    return response.data;
  },

  updateStatus: async (
    bookId: string,
    data: {
      status: "reading" | "completed" | "wishlist" | "want-to-read";
      notes?: string;
      rating?: number;
    }
  ) => {
    const response = await api.post(`/api/reading/status/${bookId}`, data);
    return response.data;
  },

  getWishlist: async () => {
    const response = await api.get("/api/reading/wishlist");
    return response.data;
  },

  getCurrentlyReading: async () => {
    const response = await api.get("/api/reading/currently-reading");
    return response.data;
  },

  getCompleted: async () => {
    const response = await api.get("/api/reading/completed");
    return response.data;
  },

  removeStatus: async (bookId: string) => {
    const response = await api.delete(`/api/reading/status/${bookId}`);
    return response.data;
  },
};

export default api;


export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchAPI = async (endpoint, options = {}) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // Cek apakah response adalah JSON
    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Jika bukan JSON (misal HTML error dari Vercel), ambil teksnya
      const text = await response.text();
      console.error("Non-JSON response received:", text);
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchAPI = async (endpoint, options = {}) => {
  // Jika endpoint tidak diawali dengan /, tambahkan /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

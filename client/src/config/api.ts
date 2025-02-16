import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3003',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação (quando necessário)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Erro na requisição:', error);
      return Promise.reject(new Error('Não foi possível conectar ao servidor. Por favor, verifique sua conexão.'));
    }

    const { status, data } = error.response;

    switch (status) {
      case 404:
        return Promise.reject(new Error('Recurso não encontrado'));
      case 500:
        return Promise.reject(new Error('Erro interno do servidor. Por favor, tente novamente mais tarde.'));
      default:
        return Promise.reject(new Error(data.message || 'Ocorreu um erro inesperado'));
    }
  }
);

export default api; 
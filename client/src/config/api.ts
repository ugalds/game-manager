import axios from 'axios';

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const BASE_URL = 'http://localhost:3003/api';

// Função para verificar se o servidor está online
const checkServerStatus = async () => {
  try {
    await fetch(`${BASE_URL}/players`);
    return true;
  } catch {
    return false;
  }
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Função para tentar reconectar
const retryRequest = async (error: any, retryCount: number = 0) => {
  if (retryCount >= MAX_RETRIES) {
    return Promise.reject(new Error('Não foi possível conectar ao servidor após várias tentativas. Por favor, verifique se o servidor está rodando.'));
  }

  console.log(`Tentativa de reconexão ${retryCount + 1}/${MAX_RETRIES}...`);
  
  // Verifica se o servidor está online
  const isServerOnline = await checkServerStatus();
  if (!isServerOnline) {
    console.log('Servidor offline. Aguardando...');
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return retryRequest(error, retryCount + 1);
  }

  try {
    const config = error.config;
    return await api(config);
  } catch (retryError) {
    return retryRequest(error, retryCount + 1);
  }
};

// Interceptor para tratamento de erros e reconexão
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se for erro de conexão ou servidor
    if (!error.response || error.response.status >= 500) {
      return retryRequest(error);
    }

    // Tratamento de outros erros
    const { status, data } = error.response;
    switch (status) {
      case 404:
        return Promise.reject(new Error('Recurso não encontrado'));
      case 500:
        return Promise.reject(new Error('Erro interno do servidor. Por favor, tente novamente mais tarde.'));
      default:
        return Promise.reject(new Error(data?.message || 'Ocorreu um erro inesperado'));
    }
  }
);

export default api;

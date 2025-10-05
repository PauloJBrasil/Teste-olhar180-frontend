import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({ baseURL });

// Adiciona Authorization: Bearer <token> automaticamente se existir em localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: { username: string; password: string; email: string; phone: string }) => api.post('/auth/register', data),
  editUser: (id: number, data: { email?: string; phone?: string; password?: string }) => api.put(`/users/${id}`, data),
};

// Normaliza erros ProblemDetails vindos da API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const resp = error?.response;
    if (resp) {
      const status = resp.status;
      const path = (resp.config?.url || '').toString();
      let message = 'Erro na requisição';

      // Mapeamento específico por status/rota
      if (status === 401) {
        message = path.includes('/auth/login') ? 'Usuário ou senha inválidos' : 'Não autorizado';
      } else if (status === 409) {
        message = path.includes('/auth/register') ? 'Usuário ou email já existente' : 'Conflito na operação';
      }

      const d = resp.data;
      if (typeof d === 'string' && d.trim().length > 0) {
        // Se a API retornou texto simples, prioriza essa mensagem
        message = d;
      } else if (d && typeof d === 'object') {
        if (d.title || d.detail) {
          message = `${d.title ?? 'Erro'}${d.detail ? ': ' + d.detail : ''}`;
        } else if (d.errors) {
          try {
            const list = Object.values(d.errors).flat();
            if (Array.isArray(list) && list.length) message = list.join(' ');
          } catch {}
        } else if (d.message) {
          message = d.message;
        }
      }

      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);
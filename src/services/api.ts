import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para log de responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// DTOs baseados no backend
export interface AviaryDTO {
  id: number;
  name: string;
  initialAmountOfRoosters: number;
  initialAmountOfChickens: number;
  currentAmountOfRooster: number;
  currentAmountOfChickens: number;
  batchId: number;
}

export interface CollectChickenDTO {
  id?: number;
  aviaryId: number;
  deadRoosters: number;
  deadChickens: number;
  observation: string;
  collectionDate?: string;
}

export interface EggDetailDTO {
  type: EggType;
  quantity: number;
}

export interface CollectEggDataDTO {
  id?: number;
  aviaryId: number;
  eggDetail: EggDetailDTO[];
  collectionDate?: string;
}

export interface WaterDTO {
  id?: number;
  aviaryId: number;
  volume: number;
  collectionDate?: string;
}

// Enum baseado no backend
export enum EggType {
  CLEAN = 'CLEAN',
  CRACKED = 'CRACKED',
  BROKEN = 'BROKEN',
  NEST_DIRTY = 'NEST_DIRTY',
  SMALL = 'SMALL',
  DOUBLE_YOLK = 'DOUBLE_YOLK',
  THIN_SHELL = 'THIN_SHELL'
}

// Services - AGUARDANDO URLs CORRETAS DOS AVIÁRIOS
export const aviaryService = {
  // TODO: Substituir pela URL correta que você vai me enviar
  listAll: () => api.get<AviaryDTO[]>('/api/aviaries'), // ← URL INCORRETA
  listByBatch: (batchId: number) => api.get<AviaryDTO[]>(`/api/aviaries/batch/${batchId}`), // ← URL INCORRETA
  getById: (id: number) => api.get<AviaryDTO>(`/api/aviaries/${id}`), // ← URL INCORRETA
  create: (data: Omit<AviaryDTO, 'id'>) => api.post<AviaryDTO>('/api/aviaries', data),
  update: (id: number, data: Partial<AviaryDTO>) => api.put<AviaryDTO>(`/api/aviaries/${id}`, data),
  delete: (id: number) => api.delete(`/api/aviaries/${id}`)
};

// Services com endpoints corretos
export const eggCollectService = {
  create: (data: CollectEggDataDTO) => api.post<CollectEggDataDTO>('/api/collect-egg', data),
  listAll: () => api.get<CollectEggDataDTO[]>('/api/collect-egg'),
  listByAviary: (aviaryId: number) => api.get<CollectEggDataDTO[]>(`/api/collect-egg/aviary/${aviaryId}`),
  getByDate: (date: string) => api.get<CollectEggDataDTO[]>(`/api/collect-egg/date/${date}`),
  delete: (id: number) => api.delete(`/api/collect-egg/${id}`)
};

export const chickenCollectService = {
  create: (data: CollectChickenDTO) => api.post<CollectChickenDTO>('/api/collect-chicken', data),
  listAll: () => api.get<CollectChickenDTO[]>('/api/collect-chicken'),
  listByAviary: (aviaryId: number) => api.get<CollectChickenDTO[]>(`/api/collect-chicken/aviary/${aviaryId}`),
  getByDate: (date: string) => api.get<CollectChickenDTO[]>(`/api/collect-chicken/date/${date}`),
  delete: (id: number) => api.delete(`/api/collect-chicken/${id}`)
};

export const waterService = {
  create: (data: WaterDTO) => api.post<WaterDTO>('/api/water', data),
  listAll: () => api.get<WaterDTO[]>('/api/water'),
  listByAviary: (aviaryId: number) => api.get<WaterDTO[]>(`/api/water/aviary/${aviaryId}`),
  delete: (id: number) => api.delete(`/api/water/${id}`)
};

export default api;

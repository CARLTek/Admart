import { create } from 'zustand';
import { billboardService } from '../services/api';

export const useBillboardStore = create((set, get) => ({
  billboards: [],
  currentBillboard: null,
  myBillboards: [],
  isLoading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  
  fetchBillboards: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await billboardService.getAll(params);
      set({ 
        billboards: data.results || data,
        pagination: { count: data.count, next: data.next, previous: data.previous },
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchBillboardById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await billboardService.getById(id);
      set({ currentBillboard: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchMyBillboards: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await billboardService.getMyBillboards();
      set({ myBillboards: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  createBillboard: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await billboardService.create(data);
      set(state => ({ 
        myBillboards: [result, ...state.myBillboards],
        isLoading: false 
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  updateBillboard: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await billboardService.update(id, data);
      set(state => ({
        myBillboards: state.myBillboards.map(b => b.id === id ? result : b),
        currentBillboard: state.currentBillboard?.id === id ? result : state.currentBillboard,
        isLoading: false
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  deleteBillboard: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await billboardService.delete(id);
      set(state => ({
        myBillboards: state.myBillboards.filter(b => b.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  clearCurrentBillboard: () => set({ currentBillboard: null }),
  clearError: () => set({ error: null }),
}));

import { create } from 'zustand';
import { proposalService, bidService } from '../services/api';

export const useProposalStore = create((set, get) => ({
  proposals: [],
  myProposals: [],
  currentProposal: null,
  receivedBids: [],
  isLoading: false,
  error: null,
  
  fetchProposals: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await proposalService.getAll(params);
      set({ 
        proposals: data.results || data,
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchProposalById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await proposalService.getById(id);
      set({ currentProposal: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchMyProposals: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await proposalService.getMyProposals();
      set({ myProposals: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  createProposal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await proposalService.create(data);
      set(state => ({ 
        myProposals: [result, ...state.myProposals],
        isLoading: false 
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  submitProposal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const result = await proposalService.submit(id);
      set(state => ({
        myProposals: state.myProposals.map(p => p.id === id ? result : p),
        currentProposal: state.currentProposal?.id === id ? result : state.currentProposal,
        isLoading: false
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchReceivedBids: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await bidService.getReceivedBids();
      set({ receivedBids: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  acceptBid: async (bidId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await bidService.accept(bidId);
      set(state => ({
        receivedBids: state.receivedBids.map(b => b.id === bidId ? result : b),
        isLoading: false
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  rejectBid: async (bidId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await bidService.reject(bidId);
      set(state => ({
        receivedBids: state.receivedBids.map(b => b.id === bidId ? result : b),
        isLoading: false
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  clearCurrentProposal: () => set({ currentProposal: null }),
  clearError: () => set({ error: null }),
}));

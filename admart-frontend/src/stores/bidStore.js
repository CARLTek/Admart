import { create } from 'zustand';
import { bidService } from '../services/api';

export const useBidStore = create((set, get) => ({
  bids: [],
  myBids: [],
  currentBid: null,
  bidMessages: [],
  isLoading: false,
  error: null,
  
  fetchMyBids: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await bidService.getMyBids();
      set({ myBids: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchBidById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await bidService.getById(id);
      set({ currentBid: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  createBid: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await bidService.create(data);
      set(state => ({ 
        myBids: [result, ...state.myBids],
        isLoading: false 
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  withdrawBid: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const result = await bidService.withdraw(id);
      set(state => ({
        myBids: state.myBids.map(b => b.id === id ? result : b),
        isLoading: false
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchMessages: async (bidId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await bidService.getMessages(bidId);
      set({ bidMessages: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  sendMessage: async (bidId, message) => {
    set({ isLoading: true, error: null });
    try {
      const result = await bidService.sendMessage(bidId, message);
      set(state => ({ 
        bidMessages: [...state.bidMessages, result],
        isLoading: false 
      }));
      return result;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  clearCurrentBid: () => set({ currentBid: null, bidMessages: [] }),
  clearError: () => set({ error: null }),
}));

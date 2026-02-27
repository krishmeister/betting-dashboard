import { create } from 'zustand';

export const useStore = create((set) => ({
    // User configuration state
    currentUser: {
        role: 'player', // 'player' or 'superadmin'
        walletId: 1,    // Simulating wallet ID 1
        balance: 0
    },

    // Game lifecycle state
    gameState: 'idle', // 'idle' | 'queuing' | 'match_ready'

    // Admin Auth State
    isAdminAuthenticated: false,

    // Actions
    setCurrentUser: (user) => set((state) => ({ currentUser: { ...state.currentUser, ...user } })),
    setGameState: (newState) => set({ gameState: newState }),
    setAdminAuthenticated: (status) => set({ isAdminAuthenticated: status })
}));

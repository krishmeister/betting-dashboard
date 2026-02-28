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

    // Authenticated Node Identity (populated on login)
    adminNode: null,
    // Shape: { node_id, node_type, display_name, display_number, location, commission_rate, parent_node_id, username }

    // Actions
    setCurrentUser: (user) => set((state) => ({ currentUser: { ...state.currentUser, ...user } })),
    setGameState: (newState) => set({ gameState: newState }),
    setAdminAuthenticated: (status) => set({ isAdminAuthenticated: status }),
    setAdminNode: (node) => set({ adminNode: node, isAdminAuthenticated: true }),
    logoutAdmin: () => set({ adminNode: null, isAdminAuthenticated: false })
}));

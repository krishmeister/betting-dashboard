import axios from 'axios';

// The PHP API Endpoints handled locally
const PHP_URL = 'http://localhost:8080/api/v1/economy';

export const api = axios.create({
    baseURL: PHP_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const EconomyService = {
    // Mint operation pushing funds arbitrarily to a wallet (Admin)
    mintCredits: async (amount, superAdminWalletId) => {
        try {
            const response = await api.post('/mint', { amount, super_admin_wallet_id: superAdminWalletId });
            return response.data;
        } catch (error) {
            console.error('API Error minting credits:', error.response?.data || error.message);
            throw error;
        }
    },

    // Standard platform tier transfer
    transferCredits: async (senderId, receiverId, amount) => {
        try {
            const response = await api.post('/transfer', { sender_id: senderId, receiver_id: receiverId, amount });
            return response.data;
        } catch (error) {
            console.error('API Error transferring credits:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get current usable balance snapshot
    getBalance: async (walletId) => {
        try {
            const response = await api.get(`/balance/${walletId}`);
            return response.data.data;
        } catch (error) {
            console.error('API Error fetching balance:', error.response?.data || error.message);
            throw error;
        }
    }
};

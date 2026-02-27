import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { EconomyService } from '../services/api';

const SuperAdminDashboard = () => {
    const { currentUser } = useStore();
    const [balance, setBalance] = useState(0);
    const [mintAmount, setMintAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Dummy data arrays for the new Stake.com UI layouts
    const networkNodes = [
        { id: 1, name: 'North America Alpha', revShare: '20%', balance: '1,500,000 CR', status: 'Active' },
        { id: 2, name: 'EU Central Hub', revShare: '15%', balance: '850,000 CR', status: 'Active' },
        { id: 3, name: 'Asia Pacific Primary', revShare: '25%', balance: '2,100,000 CR', status: 'Active' },
    ];

    const globalLedger = [
        { id: 'TXN-9842', type: 'Genesis Mint', amount: '+50,000 CR', time: 'Just now', status: 'Completed', color: 'text-[#1fff20]' },
        { id: 'TXN-9841', type: 'Fee Split', amount: '+1,250 CR', time: '5 mins ago', status: 'Completed', color: 'text-[#b026ff]' },
        { id: 'TXN-9840', type: 'Fiat Transfer', amount: '-10,000 CR', time: '1 hour ago', status: 'Completed', color: 'text-red-500' },
        { id: 'TXN-9839', type: 'Fee Split', amount: '+850 CR', time: '2 hours ago', status: 'Completed', color: 'text-[#b026ff]' },
        { id: 'TXN-9838', type: 'Genesis Mint', amount: '+100,000 CR', time: '1 day ago', status: 'Completed', color: 'text-[#1fff20]' },
    ];

    useEffect(() => {
        fetchBalance();
    }, [currentUser.walletId]);

    const fetchBalance = async () => {
        try {
            const data = await EconomyService.getBalance(currentUser.walletId);
            setBalance(data.available_balance);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    };

    const handleMint = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await EconomyService.mintCredits(mintAmount, currentUser.walletId);
            setMintAmount('');
            alert('Credits successfully minted to Treasury.');
            fetchBalance();
        } catch (error) {
            console.error("Minting failed", error);
            alert("Minting failed. Check console or database connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">

            {/* Header / Title Area */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-display font-extrabold text-white tracking-wide">Global Command</h1>
                    <p className="text-[#8798a4] text-sm mt-1">Super Admin Treasury Control</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#213743] rounded-lg border border-[#0f212e]">
                    <div className="w-2 h-2 rounded-full bg-[#1fff20] shadow-[0_0_5px_#1fff20] animate-pulse"></div>
                    <span className="text-white font-bold text-sm">System Online</span>
                </div>
            </div>

            {/* 1. Top KPI Row (The Global View) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Minted */}
                <div className="bg-[#213743] p-6 rounded-lg border border-transparent hover:border-[#1fff20]/30 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#8798a4] text-sm font-bold uppercase tracking-wider">Total Minted</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20] group-hover:drop-shadow-[0_0_8px_rgba(31,255,32,0.8)] transition-all"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <p className="text-3xl font-display font-bold text-white tracking-tight">84,500,000</p>
                </div>

                {/* Circulating Supply */}
                <div className="bg-[#213743] p-6 rounded-lg border border-transparent hover:border-[#00f0ff]/30 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#8798a4] text-sm font-bold uppercase tracking-wider">Circulating Supply</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00f0ff] group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                    </div>
                    <p className="text-3xl font-display font-bold text-white tracking-tight">12,240,105</p>
                </div>

                {/* 24h Revenue */}
                <div className="bg-[#213743] p-6 rounded-lg border border-transparent hover:border-[#b026ff]/30 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#8798a4] text-sm font-bold uppercase tracking-wider">24h Platform Revenue</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b026ff] group-hover:drop-shadow-[0_0_8px_rgba(176,38,255,0.8)] transition-all"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <p className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                        +45,200
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20]"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    </p>
                </div>

                {/* Active Nodes */}
                <div className="bg-[#213743] p-6 rounded-lg border border-transparent hover:border-white/30 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[#8798a4] text-sm font-bold uppercase tracking-wider">Active Nodes</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    </div>
                    <p className="text-3xl font-display font-bold text-white tracking-tight">142 <span className="text-[#8798a4] text-lg">Live</span></p>
                </div>
            </div>

            {/* Split Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

                {/* 2. The Central Bank (Variables / Minting) */}
                <div className="xl:col-span-1">
                    <div className="bg-gradient-to-br from-[#213743] to-[#1a2c38] rounded-xl p-8 border border-[#0f212e] shadow-lg relative overflow-hidden group">

                        {/* Background Glow Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#00f0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-display font-bold text-white mb-2">The Central Bank</h2>
                            <p className="text-[#8798a4] text-sm mb-8">Current Treasury Balance: <strong className="text-white">{balance} CR</strong></p>

                            <form onSubmit={handleMint} className="space-y-6">
                                <div>
                                    <label className="block text-[#8798a4] text-xs font-bold uppercase tracking-wider mb-2">Mint Genesis Credits</label>
                                    <input
                                        type="number"
                                        value={mintAmount}
                                        onChange={(e) => setMintAmount(e.target.value)}
                                        className="w-full bg-[#0f212e] border-2 border-transparent focus:border-[#00f0ff]/50 rounded-lg p-4 text-2xl font-bold text-white placeholder-[#8798a4]/50 focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0080ff] text-black font-extrabold text-lg tracking-wide hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'INITIALIZING...' : 'MINT TO TREASURY'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* 3. Network Node Manager */}
                <div className="xl:col-span-2">
                    <div className="flex justify-between items-center mb-4 px-2 mt-2 xl:mt-0">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#b026ff]"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path></svg>
                            Active Master Nodes
                        </h2>
                        <button className="text-[#8798a4] hover:text-white font-bold text-sm transition-colors">View All Nodes</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {networkNodes.map(node => (
                            <div key={node.id} className="bg-[#213743] hover:bg-[#2b4756] border border-[#0f212e] rounded-xl p-5 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-[#1a2c38] flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00f0ff]"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{node.name}</h4>
                                            <span className="text-[#8798a4] text-xs font-semibold">{node.status}</span>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-[#1a2c38] text-[#1fff20] text-xs font-bold rounded">
                                        {node.revShare} Cut
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[#8798a4] text-xs uppercase tracking-wider mb-1 font-bold">Node Vault</p>
                                        <p className="text-white font-bold text-lg">{node.balance}</p>
                                    </div>
                                    <button className="px-4 py-1.5 border border-[#8798a4]/30 rounded text-[#8798a4] hover:text-white hover:border-white transition-all text-sm font-bold">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 4. The Global Ledger (Live Feed) */}
            <div className="w-full mt-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    <h2 className="text-xl font-bold text-white">Global Ledger</h2>
                </div>

                <div className="bg-[#1a2c38] rounded-t-lg overflow-hidden border border-[#213743]">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="text-[#8798a4] font-bold bg-[#0f212e]">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {globalLedger.map((row, idx) => (
                                <tr
                                    key={row.id}
                                    className={`border-t border-[#213743] font-semibold transition-colors hover:bg-[#213743]/50 ${idx % 2 === 0 ? 'bg-[#1a2c38]' : 'bg-[#172732]'}`}
                                >
                                    <td className="px-6 py-4 text-white uppercase">{row.id}</td>
                                    <td className="px-6 py-4 text-white">
                                        <span className="px-2 py-1 rounded bg-[#213743] text-xs border border-[#0f212e]">{row.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[#8798a4]">{row.time}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-white">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1fff20]"></div>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${row.color}`}>
                                        {row.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Table Footer */}
                <div className="bg-[#0f212e] rounded-b-lg border border-t-0 border-[#213743] py-3 flex justify-center mb-8">
                    <button className="text-[#8798a4] hover:text-white font-bold text-sm transition-colors uppercase tracking-wider">Load More Historical</button>
                </div>
            </div>

        </div>
    );
};

export default SuperAdminDashboard;

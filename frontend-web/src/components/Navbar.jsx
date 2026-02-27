import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { EconomyService } from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser } = useStore();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await EconomyService.getBalance(currentUser.walletId);
                setBalance(data.available_balance);
            } catch (error) {
                console.error("Could not fetch balance", error);
            }
        };
        fetchBalance();

        // Simple polling to keep navbar fresh if we aren't hooking native sockets deeply yet
        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [currentUser.walletId]);

    return (
        <nav className="sticky top-0 z-40 w-full h-16 bg-[#0f212e] flex items-center justify-between px-4 lg:px-8 border-b border-white/5 shadow-md">

            {/* Mobile Header Block (Hidden on Desktop since Sidebar handles it) */}
            <div className="flex md:hidden items-center gap-4">
                <button className="text-white hover:text-[#1fff20] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div onClick={() => navigate('/lobby')} className="text-xl font-display font-bold text-white tracking-widest cursor-pointer">
                    ELEV<span className="text-[#1fff20]">8</span>
                </div>
            </div>

            {/* Empty spacer for Desktop to push Search Bar center */}
            <div className="hidden md:block w-32"></div>

            {/* Center Global Search */}
            <div className="hidden md:flex w-full max-w-lg relative bg-[#0f212e] group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8798a4] group-focus-within:text-[#1fff20] transition-colors"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input
                    type="text"
                    className="w-full bg-[#1a2c38] border border-transparent rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-[#8798a4] focus:outline-none focus:border-[#1fff20]/30 focus:shadow-[0_0_10px_rgba(31,255,32,0.1)] transition-all"
                    placeholder="Search games..."
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 ml-auto">
                <div className="hidden sm:flex items-center bg-[#1a2c38] rounded-md h-10 border border-[#213743]">
                    <div className="flex items-center px-4 h-full">
                        <span className="text-white font-bold font-display">{balance}</span>
                        <span className="text-[#1fff20] ml-2 font-bold text-xs">CR</span>
                    </div>
                    <button className="h-full px-3 bg-[#1fff20] hover:bg-[#1cd41d] active:scale-95 transition-all rounded-r-md flex items-center justify-center border-l border-[#0f212e]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </div>

                {/* Admin Access / Treasury */}
                <button
                    onClick={() => navigate('/admin-login')}
                    className="p-2.5 rounded hover:bg-[#1a2c38] text-[#8798a4] hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </button>

                {/* User Avatar Placeholder */}
                <div className="w-10 h-10 rounded-md bg-[#213743] hover:bg-[#2b4756] cursor-pointer flex items-center justify-center transition-colors shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

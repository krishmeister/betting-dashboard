import React from 'react';
import { useNavigate } from 'react-router-dom';

const navCategories = [
    {
        title: 'Casino',
        items: [
            { id: 1, name: 'Motion Games', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg> },
            { id: 2, name: 'Standard Arenas', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> }
        ]
    },
    {
        title: 'Platform',
        items: [
            { id: 3, name: 'Promotions', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg> },
            { id: 4, name: 'VIP Club', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"></path><path d="M7 20v-4"></path><path d="M12 20v-8"></path><path d="M17 20V8"></path><path d="M22 4v16"></path></svg> },
            { id: 5, name: 'Leaderboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
            { id: 6, name: 'Support', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> }
        ]
    }
];

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-[#0f212e] h-screen sticky top-0 overflow-y-auto border-r border-white/5 scrollbar-hide">
            <div className="p-6">
                <div
                    className="flex items-center gap-2 cursor-pointer mb-8"
                    onClick={() => navigate('/lobby')}
                >
                    <div className="w-8 h-8 rounded bg-[#1fff20] flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_15px_rgba(31,255,32,0.4)]">
                        8
                    </div>
                    <span className="text-2xl font-display font-bold text-white tracking-widest uppercase">
                        ELEV<span className="text-[#1fff20]">8</span>
                    </span>
                </div>

                <div className="space-y-8">
                    {navCategories.map((category, idx) => (
                        <div key={idx}>
                            {category.title && (
                                <h4 className="text-[#8798a4] text-xs font-bold uppercase tracking-wider mb-3 px-2">
                                    {category.title}
                                </h4>
                            )}
                            <ul className="space-y-1">
                                {category.items.map(item => (
                                    <li key={item.id}>
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[#b1c0cd] hover:bg-[#1a2c38] hover:text-white transition-colors text-sm font-semibold group">
                                            <span className="text-[#8798a4] group-hover:text-white transition-colors">
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[#b1c0cd] hover:bg-[#1a2c38] hover:text-white transition-colors text-sm font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    English
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

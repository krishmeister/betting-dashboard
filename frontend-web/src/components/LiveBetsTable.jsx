import React from 'react';

const dummyData = [
    { id: 1, game: 'Whack-a-Mole', user: 'Hidden User', time: '6:45 PM', entry: '100 CR', mult: '1.9x', payout: '+190 CR', win: true },
    { id: 2, game: 'GoKeeper', user: 'Kratos99', time: '6:44 PM', entry: '500 CR', mult: '0.00x', payout: '0 CR', win: false },
    { id: 3, game: 'Fruit Ninja', user: 'Elev8or', time: '6:44 PM', entry: '250 CR', mult: '2.5x', payout: '+625 CR', win: true },
    { id: 4, game: 'Basketball', user: 'Hidden User', time: '6:41 PM', entry: '100 CR', mult: '1.9x', payout: '+190 CR', win: true },
    { id: 5, game: 'LokaFit', user: 'MotionKing', time: '6:39 PM', entry: '1000 CR', mult: '0.00x', payout: '0 CR', win: false },
    { id: 6, game: 'Whack-a-Mole', user: 'Hidden User', time: '6:35 PM', entry: '100 CR', mult: '1.9x', payout: '+190 CR', win: true },
];

const LiveBetsTable = () => {
    return (
        <div className="w-full mt-12 mb-8">
            <div className="flex items-center gap-4 mb-4 px-2">
                <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-full bg-[#213743] text-white font-bold text-sm hover:bg-[#2b4756] transition-colors flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#1fff20] animate-pulse"></div>
                        Casino Bets
                    </button>
                    <button className="px-5 py-2 rounded-full text-[#8798a4] font-bold text-sm hover:bg-[#213743] hover:text-white transition-colors">
                        High Rollers
                    </button>
                    <button className="px-5 py-2 rounded-full flex items-center gap-2 bg-[#213743] text-white font-bold text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        My Bets
                    </button>
                </div>
            </div>

            <div className="bg-[#1a2c38] rounded-t-lg overflow-hidden border border-[#213743]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-[#8798a4] font-bold bg-[#0f212e]">
                        <tr>
                            <th className="px-6 py-4">Game</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4 text-right">Bet Amount</th>
                            <th className="px-6 py-4 text-right">Multiplier</th>
                            <th className="px-6 py-4 text-right">Payout</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyData.map((row, idx) => (
                            <tr
                                key={row.id}
                                className={`border-t border-[#213743] font-semibold transition-colors hover:bg-[#213743]/50 ${idx % 2 === 0 ? 'bg-[#1a2c38]' : 'bg-[#172732]'}`}
                            >
                                <td className="px-6 py-4 text-white flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-[#213743] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20]"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                    {row.game}
                                </td>
                                <td className="px-6 py-4 text-white">{row.user}</td>
                                <td className="px-6 py-4 text-[#8798a4]">{row.time}</td>
                                <td className="px-6 py-4 text-right text-white">
                                    <span className="flex items-center justify-end gap-1">
                                        {row.entry}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-white font-bold">{row.mult}</td>
                                <td className={`px-6 py-4 text-right font-bold flex justify-end items-center gap-2 ${row.win ? 'text-[#1fff20]' : 'text-white'}`}>
                                    {row.payout}
                                    {row.win && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20]"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Table Footer matching Stake */}
            <div className="bg-[#0f212e] rounded-b-lg border border-t-0 border-[#213743] py-3 flex justify-center">
                <button className="text-[#8798a4] hover:text-white font-bold text-sm transition-colors uppercase tracking-wider">Load More</button>
            </div>
        </div>
    );
};

export default LiveBetsTable;

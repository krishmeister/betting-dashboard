import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { socket } from '../services/socket';
import { EconomyService } from '../services/api';
import LiveBetsTable from './LiveBetsTable';

const GameGridCard = ({ title, category, players, onSelect }) => (
    <div
        onClick={onSelect}
        className="group relative flex-none w-full aspect-[3/4] rounded-lg bg-[#213743] border border-transparent hover:border-[#8798a4]/30 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
        {/* Placeholder Graphic */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2c38] to-[#0f212e] flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-[#0f212e] via-[#0f212e]/80 to-transparent">
            <h3 className="text-white font-bold text-sm truncate">{title}</h3>

            {/* Live Player Indicator */}
            <div className="flex items-center gap-1.5 mt-1.5 opacity-80">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1fff20] shadow-[0_0_5px_#1fff20] animate-pulse"></div>
                <span className="text-[#8798a4] text-[10px] font-bold">{players} playing</span>
            </div>
        </div>
    </div>
);

const GameLobby = () => {
    const navigate = useNavigate();
    const { currentUser, gameState, setGameState } = useStore();
    const [balance, setBalance] = useState(0);

    const trendingGames = [
        { id: 1, title: 'Whack-a-Mole', category: 'Originals', players: '4,204' },
        { id: 2, title: 'Fruit Ninja: Katana', category: 'Motion', players: '1,892' },
        { id: 3, title: 'GoKeeper VR', category: 'Sports', players: '503' },
        { id: 4, title: 'Beat Sabers', category: 'Rhythm', players: '11,200' },
        { id: 5, title: 'Ninja Run', category: 'Endless', players: '8,401' }
    ];

    const classicArenas = [
        { id: 6, title: 'Basketball Pro', category: 'Sports', players: '210' },
        { id: 7, title: 'Viking Volleyball', category: 'Multiplayer', players: '55' },
        { id: 8, title: 'Elev8 Poker', category: 'Table', players: '9,440' },
        { id: 9, title: 'LokaFit Box', category: 'Fitness', players: '12' },
    ];

    useEffect(() => {
        EconomyService.getBalance(currentUser.walletId).then(d => setBalance(d.available_balance)).catch(console.error);

        const onQueueJoined = () => setGameState('queuing');
        const onMatchReady = () => {
            setGameState('match_ready');
            setTimeout(() => navigate('/arena'), 2000);
        };
        const onMatchFailed = (data) => {
            setGameState('idle');
            alert("Match failed: " + data.message);
        };

        socket.on('queue_joined', onQueueJoined);
        socket.on('match_ready', onMatchReady);
        socket.on('match_failed', onMatchFailed);

        return () => {
            socket.off('queue_joined', onQueueJoined);
            socket.off('match_ready', onMatchReady);
            socket.off('match_failed', onMatchFailed);
        };
    }, [setGameState, currentUser.walletId, navigate]);

    const handleFindMatch = () => {
        setGameState('queuing');
        socket.emit('join_queue', { walletId: currentUser.walletId });
    };

    // Fullscreen Overlay Intercepts
    if (gameState === 'queuing') {
        return (
            <div className="absolute inset-0 z-50 bg-[#0f212e] flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 border-4 border-[#213743] border-t-[#1fff20] rounded-full animate-spin mb-8"></div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">Finding Match...</h2>
                <p className="text-[#8798a4] text-sm font-semibold">Ensuring zero-latency connections</p>
                <button
                    onClick={() => setGameState('idle')}
                    className="mt-8 px-6 py-2 bg-[#213743] hover:bg-[#2b4756] text-white rounded font-bold text-sm transition-colors"
                >
                    Cancel Matchmaking
                </button>
            </div>
        );
    }

    if (gameState === 'match_ready') {
        return (
            <div className="absolute inset-0 z-50 bg-[#0f212e] flex flex-col items-center justify-center">
                <div className="w-32 h-32 mb-8 bg-[#1fff20]/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1fff20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">Match Found!</h2>
                <p className="text-[#1fff20] text-lg font-bold tracking-widest uppercase animate-pulse">Routing to Arena...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">

            {/* Dual Hero Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-10">
                {/* Left Hero: Whack a Mole Promo */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#0f212e] to-[#1a2c38] border border-[#213743] h-64 md:h-[340px] flex items-center p-8 group">
                    <div className="absolute right-0 top-0 w-3/4 h-full bg-gradient-to-l from-[#00f0ff]/20 via-[#8b5cf6]/20 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 max-w-sm">
                        <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">Featured Game</span>
                        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mb-2">Whack-a-Mole</h2>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#00f0ff] mb-4">Motion Edition</h3>
                        <p className="text-[#8798a4] text-sm mb-6 leading-relaxed">Stake your credits. Decimate targets with real body tracking. Winner takes the complete pool.</p>

                        <div className="flex gap-4 items-center">
                            <button
                                onClick={handleFindMatch}
                                className="px-8 py-3 bg-[#1fff20] hover:bg-[#1cd41d] active:scale-95 text-black rounded font-bold transition-all"
                            >
                                Play Now
                            </button>
                            <span className="text-white font-bold text-sm bg-[#213743] px-3 py-1.5 rounded">100 CR Entry</span>
                        </div>
                    </div>
                </div>

                {/* Right Hero: VIP Promo */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-tr from-[#213743] to-[#0f212e] border border-[#213743] h-64 md:h-[340px] flex items-center p-8 group hidden lg:flex">
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M2 20h.01"></path><path d="M7 20v-4"></path><path d="M12 20v-8"></path><path d="M17 20V8"></path><path d="M22 4v16"></path></svg>
                    </div>
                    <div className="relative z-10 max-w-sm">
                        <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-3 inline-block">Elev8 VIP Club</span>
                        <h2 className="text-4xl font-display font-extrabold text-white leading-tight mb-4">Join the Elite</h2>
                        <p className="text-[#8798a4] text-sm mb-8 leading-relaxed">Level up through our multi-tier node system. Unlock higher rakebacks, dedicated event hosting, and exclusive motion arenas.</p>
                        <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white rounded font-bold transition-all">
                            View Benefits
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Scrollers Section 1 */}
            <div className="mb-10">
                <div className="flex justify-between items-end mb-4 px-2">
                    <div className="flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        <h2 className="text-xl font-bold">Trending Motion Games</h2>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded bg-[#213743] hover:bg-[#2b4756] flex items-center justify-center text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button className="w-8 h-8 rounded bg-[#213743] hover:bg-[#2b4756] flex items-center justify-center text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                </div>

                {/* 3:4 Aspect Ratio Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {trendingGames.map(game => (
                        <GameGridCard
                            key={game.id}
                            title={game.title}
                            category={game.category}
                            players={game.players}
                            onSelect={handleFindMatch}
                        />
                    ))}
                </div>
            </div>

            {/* Grid Scrollers Section 2 */}
            <div className="mb-2">
                <div className="flex justify-between items-end mb-4 px-2">
                    <div className="flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <h2 className="text-xl font-bold">Classic Arenas</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {classicArenas.map(game => (
                        <GameGridCard
                            key={game.id}
                            title={game.title}
                            category={game.category}
                            players={game.players}
                            onSelect={handleFindMatch}
                        />
                    ))}
                </div>
            </div>

            {/* Replicated Stake.com Live Bets Ledger */}
            <LiveBetsTable />

        </div>
    );
};

export default GameLobby;

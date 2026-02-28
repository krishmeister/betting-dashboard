import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { socket } from '../services/socket';
import { EconomyService } from '../services/api';
import LiveBetsTable from './LiveBetsTable';

const GameGridCard = ({ title, category, players, entryFee, hot, onSelect }) => (
    <div
        onClick={onSelect}
        className="group relative flex-none w-full aspect-[3/4] rounded-xl bg-gradient-to-b from-[#1a2c38] to-[#0f212e] border border-white/5 hover:border-[#1fff20]/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(31,255,32,0.15)] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
    >
        {/* Game Background with Noise/Gleam */}
        <div className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1fff20]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Play Button - Glassmorphic */}
            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-80 group-hover:scale-110 group-hover:opacity-100 group-hover:border-[#1fff20]/50 group-hover:shadow-[0_0_20px_rgba(31,255,32,0.3)] transition-all duration-300 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-[#1fff20] transition-colors ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
        </div>

        {/* Hot Badge */}
        {hot && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] rounded text-white text-[9px] font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(255,107,0,0.4)] z-20 border border-white/20">
                🔥 Hot
            </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0a1622] via-[#0f212e]/90 to-transparent z-20">
            <h3 className="text-white font-extrabold text-[15px] truncate drop-shadow-md">{title}</h3>
            <p className="text-[#8798a4] text-[11px] font-bold uppercase tracking-wide mt-0.5">{category}</p>

            <div className="flex items-center justify-between mt-2.5">
                {/* Live Player Indicator */}
                <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded backdrop-blur-md border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1fff20] shadow-[0_0_8px_#1fff20] animate-pulse"></div>
                    <span className="text-[#b1c0cd] text-[10px] font-bold">{players}</span>
                </div>
                {/* Entry Fee */}
                {entryFee && (
                    <span className="text-[10px] font-extrabold text-[#1fff20] bg-[#1fff20]/10 px-2 py-1 rounded border border-[#1fff20]/20 shadow-[0_0_10px_rgba(31,255,32,0.1)]">
                        {entryFee}
                    </span>
                )}
            </div>
        </div>
    </div>
);

const GameLobby = () => {
    const navigate = useNavigate();
    const { currentUser, gameState, setGameState } = useStore();
    const [balance, setBalance] = useState(0);

    // Platform-relevant game data
    const hotMotionGames = [
        { id: 1, title: 'Fruit Ninja', category: 'Motion PvP', players: '4,204', entryFee: '50 CR', hot: true },
        { id: 2, title: 'Whack-a-Mole', category: 'Motion Solo', players: '3,892', entryFee: '100 CR', hot: true },
        { id: 3, title: 'Beat Dodge', category: 'Motion Rhythm', players: '1,503', entryFee: '25 CR', hot: false },
        { id: 4, title: 'Goalkeeper VR', category: 'Motion Sports', players: '891', entryFee: '200 CR', hot: false },
        { id: 5, title: 'Shadow Boxing', category: 'Motion Combat', players: '2,401', entryFee: '150 CR', hot: true },
        { id: 6, title: 'Dance Royale', category: 'Motion Party', players: '672', entryFee: '50 CR', hot: false },
    ];

    const casinoClassics = [
        { id: 7, title: 'Elev8 Roulette', category: 'Table Game', players: '9,440', entryFee: '10 CR', hot: true },
        { id: 8, title: 'Blackjack Pro', category: 'Card Game', players: '6,201', entryFee: '25 CR', hot: true },
        { id: 9, title: "Texas Hold'em", category: 'Poker', players: '4,100', entryFee: '50 CR', hot: false },
        { id: 10, title: 'Baccarat Royal', category: 'Card Game', players: '2,802', entryFee: '100 CR', hot: false },
        { id: 11, title: 'Hi-Lo Cards', category: 'Quick Play', players: '5,320', entryFee: '5 CR', hot: true },
        { id: 12, title: 'Dice Duel', category: 'Dice', players: '1,990', entryFee: '10 CR', hot: false },
    ];

    // Platform stats (simulated — in production these come from API)
    const platformStats = {
        onlinePlayers: '12,847',
        totalWonToday: '₹4,82,500',
        gamesPlayedToday: '34,219',
        biggestWin: '₹52,000',
    };

    // Leaderboard (simulated)
    const topWinners = [
        { rank: 1, player: 'MotionKing', game: 'Fruit Ninja', amount: '₹12,500', timeAgo: '4m ago' },
        { rank: 2, player: 'AceHigh99', game: 'Blackjack Pro', amount: '₹8,200', timeAgo: '11m ago' },
        { rank: 3, player: 'NinjaSlayer', game: 'Whack-a-Mole', amount: '₹6,400', timeAgo: '18m ago' },
        { rank: 4, player: 'RouletteQueen', game: 'Elev8 Roulette', amount: '₹5,100', timeAgo: '22m ago' },
        { rank: 5, player: 'DiceDevil', game: 'Hi-Lo Cards', amount: '₹4,800', timeAgo: '31m ago' },
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
                <p className="text-[#8798a4] text-sm font-semibold">Matching you with an opponent</p>
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

            {/* Live Platform Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-gradient-to-b from-[#1a2c38] to-[#0f212e] rounded-xl px-5 py-4 border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1fff20]/0 to-[#1fff20]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(31,255,32,0.15)]">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#1fff20] shadow-[0_0_12px_#1fff20] animate-pulse"></div>
                        </div>
                        <div>
                            <p className="text-[#8798a4] text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">Online Now</p>
                            <p className="text-white text-2xl font-display font-extrabold tracking-tight drop-shadow-md">{platformStats.onlinePlayers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-b from-[#1a2c38] to-[#0f212e] rounded-xl px-5 py-4 border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1fff20]/0 to-[#1fff20]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(31,255,32,0.15)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1fff20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(31,255,32,0.8)]"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div>
                            <p className="text-[#8798a4] text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">Won Today</p>
                            <p className="text-[#1fff20] text-2xl font-display font-extrabold tracking-tight drop-shadow-[0_0_10px_rgba(31,255,32,0.3)]">{platformStats.totalWonToday}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-b from-[#1a2c38] to-[#0f212e] rounded-xl px-5 py-4 border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/0 to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                        <div>
                            <p className="text-[#8798a4] text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">Games Played</p>
                            <p className="text-white text-2xl font-display font-extrabold tracking-tight drop-shadow-md">{platformStats.gamesPlayedToday}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-b from-[#1a2c38] to-[#0f212e] rounded-xl px-5 py-4 border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b00]/0 to-[#ff6b00]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,107,0,0.15)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                        <div>
                            <p className="text-[#8798a4] text-[10px] font-bold uppercase tracking-[0.15em] mb-0.5">Biggest Win</p>
                            <p className="text-[#ff6b00] text-2xl font-display font-extrabold tracking-tight drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]">{platformStats.biggestWin}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dual Hero Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mb-12">
                {/* Left Hero: Featured Motion Game */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0a1622] to-[#1a2c38] border border-white/10 h-[340px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center p-10 group">
                    <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.15),transparent_50%)] pointer-events-none"></div>
                    <div className="absolute right-0 bottom-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none"></div>

                    <div className="relative z-10 max-w-md">
                        <span className="px-3 py-1 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4 inline-block shadow-[0_0_15px_rgba(0,240,255,0.2)]">🔥 Featured Game</span>
                        <h2 className="text-5xl md:text-6xl font-display font-black text-white leading-tight mb-2 drop-shadow-xl tracking-tight">Fruit Ninja</h2>
                        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#00f0ff] to-[#1fff20] mb-5 tracking-wide">Motion PvP Arena</h3>
                        <p className="text-[#b1c0cd] text-sm mb-8 leading-relaxed font-medium">Use your body to slice fruits in real-time PvP battles. Wager your coins, outscore your opponent, winner takes the pot.</p>

                        <div className="flex gap-5 items-center">
                            <button
                                onClick={handleFindMatch}
                                className="px-10 py-4 bg-gradient-to-r from-[#1fff20] to-[#00ff88] hover:shadow-[0_0_30px_rgba(31,255,32,0.4)] hover:-translate-y-1 active:scale-95 text-black rounded-lg font-extrabold text-sm uppercase tracking-wider transition-all duration-300"
                            >
                                Play Now
                            </button>
                            <span className="text-white font-extrabold text-sm bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg shadow-inner">From 50 CR</span>
                        </div>
                    </div>
                </div>

                {/* Right Hero: Biggest Winners / Leaderboard */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tr from-[#1a2c38] to-[#0a1622] border border-white/10 h-[340px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col p-8 hidden lg:flex">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgoJPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+Cjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-8 h-8 rounded bg-[#ff6b00]/20 flex items-center justify-center border border-[#ff6b00]/30 shadow-[0_0_15px_rgba(255,107,0,0.3)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                        <h3 className="text-xl font-extrabold text-white tracking-wide drop-shadow-md">Top Winners Today</h3>
                        <div className="ml-auto flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-[#1fff20] shadow-[0_0_8px_#1fff20] animate-pulse"></div>
                            <span className="text-[#1fff20] text-[10px] font-extrabold uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2.5 overflow-hidden relative z-10">
                        {topWinners.map((winner) => (
                            <div key={winner.rank} className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-md rounded-xl border border-white/5 hover:bg-black/40 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-inner ${winner.rank === 1 ? 'bg-gradient-to-br from-[#ffd700] to-[#b8860b] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' :
                                        winner.rank === 2 ? 'bg-gradient-to-br from-[#e0e0e0] to-[#9e9e9e] text-black shadow-[0_0_10px_rgba(224,224,224,0.3)]' :
                                            winner.rank === 3 ? 'bg-gradient-to-br from-[#cd7f32] to-[#8b4513] text-white shadow-[0_0_10px_rgba(205,127,50,0.3)]' :
                                                'bg-[#213743] text-[#8798a4]'
                                        }`}>{winner.rank}</span>
                                    <div>
                                        <p className="text-white text-sm font-extrabold">{winner.player}</p>
                                        <p className="text-[#8798a4] text-[10px] font-bold uppercase tracking-wider mt-0.5">{winner.game}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#1fff20] text-sm font-black drop-shadow-[0_0_8px_rgba(31,255,32,0.4)] group-hover:scale-105 transition-transform origin-right">{winner.amount}</p>
                                    <p className="text-[#8798a4] text-[10px] uppercase font-bold mt-0.5">{winner.timeAgo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hot Motion Games Grid */}
            <div className="mb-10">
                <div className="flex justify-between items-end mb-4 px-2">
                    <div className="flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                        <h2 className="text-xl font-bold">🔥 Hot Motion Games</h2>
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

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {hotMotionGames.map(game => (
                        <GameGridCard
                            key={game.id}
                            title={game.title}
                            category={game.category}
                            players={game.players}
                            entryFee={game.entryFee}
                            hot={game.hot}
                            onSelect={handleFindMatch}
                        />
                    ))}
                </div>
            </div>

            {/* Casino Classics Grid */}
            <div className="mb-10">
                <div className="flex justify-between items-end mb-4 px-2">
                    <div className="flex items-center gap-2 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1fff20]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <h2 className="text-xl font-bold">🎰 Casino Classics</h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {casinoClassics.map(game => (
                        <GameGridCard
                            key={game.id}
                            title={game.title}
                            category={game.category}
                            players={game.players}
                            entryFee={game.entryFee}
                            hot={game.hot}
                            onSelect={handleFindMatch}
                        />
                    ))}
                </div>
            </div>

            {/* Why Elev8 Feature Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative">
                {/* Background ambient glow behind the strip */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1/2 bg-[#1fff20]/5 blur-[100px] pointer-events-none"></div>

                <div className="bg-gradient-to-b from-[#1a2c38] to-[#0f212e] rounded-2xl p-8 border border-white/5 text-center group hover:border-[#1fff20]/30 hover:shadow-[0_10px_40px_rgba(31,255,32,0.1)] transition-all duration-500 relative overflow-hidden z-10">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1fff20]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#1fff20]/40 group-hover:shadow-[0_0_20px_rgba(31,255,32,0.2)] transition-all duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1fff20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(31,255,32,0.8)]"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                    </div>
                    <h3 className="text-white font-extrabold text-xl mb-3 tracking-wide drop-shadow-md">Buy Coins, Play & Win</h3>
                    <p className="text-[#8798a4] text-sm leading-relaxed font-medium">Purchase coins from your local provider — Master, Franchisee, or Sub-Franchisee. Load your wallet and wager on any game to win real money.</p>
                </div>

                <div className="bg-gradient-to-b from-[#1a2c38] to-[#0f212e] rounded-2xl p-8 border border-white/5 text-center group hover:border-[#8b5cf6]/30 hover:shadow-[0_10px_40px_rgba(139,92,246,0.1)] transition-all duration-500 relative overflow-hidden z-10">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#8b5cf6]/40 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"><circle cx="12" cy="5" r="3" /><path d="M12 8v4" /><path d="M8 16l4-4 4 4" /><path d="M6 20h12" /><path d="M8 16v4" /><path d="M16 16v4" /></svg>
                    </div>
                    <h3 className="text-white font-extrabold text-xl mb-3 tracking-wide drop-shadow-md">Your Body is the Controller</h3>
                    <p className="text-[#8798a4] text-sm leading-relaxed font-medium">Play motion games like Fruit Ninja and Whack-a-Mole using your body. Powered by MediaPipe — no special hardware needed, just your webcam.</p>
                </div>

                <div className="bg-gradient-to-b from-[#1a2c38] to-[#0f212e] rounded-2xl p-8 border border-white/5 text-center group hover:border-[#00f0ff]/30 hover:shadow-[0_10px_40px_rgba(0,240,255,0.1)] transition-all duration-500 relative overflow-hidden z-10">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#00f0ff]/40 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    </div>
                    <h3 className="text-white font-extrabold text-xl mb-3 tracking-wide drop-shadow-md">Win & Cash Out Instantly</h3>
                    <p className="text-[#8798a4] text-sm leading-relaxed font-medium">Winnings are credited to your wallet the moment you win. No waiting, no hidden fees. Cash out through your coin provider anytime.</p>
                </div>
            </div>

            {/* Live Bets Ledger */}
            <LiveBetsTable />

        </div>
    );
};

export default GameLobby;

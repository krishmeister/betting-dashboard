import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setAdminAuthenticated = useStore(state => state.setAdminAuthenticated);

    const handleLogin = (e) => {
        e.preventDefault();

        // Hardcoded Prototype Auth
        if (username === 'admin' && password === '12345') {
            setAdminAuthenticated(true);
            navigate('/admin');
        } else {
            setError('Invalid credentials. Access denied.');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glow Effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-cyan/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-bold text-white tracking-widest uppercase mb-2">
                        ELEV<span className="text-accent-cyan hover:shadow-cyan-glow transition-shadow duration-300">8</span>
                    </h1>
                    <p className="text-gray-400 text-sm tracking-widest uppercase backdrop-blur-sm inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10">Treasury Nexus</p>
                </div>

                <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md bg-zinc-950/80">
                    <h2 className="text-xl font-semibold text-white mb-6 tracking-wide">Secure Authorization</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/30">
                            <p className="text-danger text-sm font-medium flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="username">
                                Clearance ID
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan transition-all"
                                placeholder="Enter coordinator ID"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="password">
                                Encryption Key
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full relative group mt-8"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative bg-zinc-950 rounded-xl px-4 py-3 border border-white/10 flex items-center justify-center gap-2">
                                <span className="font-bold text-white tracking-widest uppercase">Authenticate</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors duration-300"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </div>
                        </button>
                    </form>
                </div>

                <button
                    onClick={() => navigate('/lobby')}
                    className="mt-8 text-sm text-gray-500 hover:text-white transition-colors block text-center w-full underline decoration-gray-700 underline-offset-4"
                >
                    Return to Player Lobby
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;

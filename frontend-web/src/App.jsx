import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import GameLobby from './components/GameLobby';
import MotionArena from './components/MotionArena';
import { useStore } from './store';
import AdminLogin from './components/AdminLogin';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Route Guard Component
const ProtectedAdminRoute = ({ children }) => {
    const isAdminAuthenticated = useStore(state => state.isAdminAuthenticated);

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Full Screen Unwrapped Routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/arena" element={<MotionArena />} />

                {/* Dashboard Wrapped Routes */}
                <Route
                    path="/*"
                    element={
                        <div className="flex min-h-screen bg-[#1a2c38]">
                            <Sidebar />
                            <div className="flex-1 flex flex-col min-w-0">
                                <Navbar />
                                <main className="flex-1 overflow-y-auto">
                                    <Routes>
                                        <Route
                                            path="/admin"
                                            element={
                                                <ProtectedAdminRoute>
                                                    <SuperAdminDashboard />
                                                </ProtectedAdminRoute>
                                            }
                                        />
                                        <Route path="/lobby" element={<GameLobby />} />
                                        <Route path="*" element={<Navigate to="/lobby" replace />} />
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;

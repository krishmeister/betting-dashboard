import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { EconomyService } from '../services/api';

const SuperAdminDashboard = () => {
    const { currentUser, adminNode, logoutAdmin } = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('command');

    // Tier Helpers
    const nodeType = adminNode?.node_type || 'Super';
    const isSuper = nodeType.toUpperCase() === 'SUPER';
    const getChildTierName = () => {
        const map = { 'Super': 'Master', 'Master': 'Franchisee', 'Franchisee': 'Sub Franchisee' };
        return map[nodeType] || 'Sub ' + nodeType;
    };
    const getDashboardTitle = () => {
        if (isSuper) return 'Super Dashboard';
        return `${nodeType} Dashboard`;
    };

    // Create Node Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({ name: '', location: '', username: '', password: '', commissionRate: '10' });
    const [createdCreds, setCreatedCreds] = useState(null);

    // Regenerate Password State
    const [regenNodeId, setRegenNodeId] = useState('');
    const [regenResult, setRegenResult] = useState(null);

    const handleLogout = () => {
        logoutAdmin();
        navigate('/admin-login');
    };

    // Command Center State
    const [systemMetrics, setSystemMetrics] = useState({
        conversion_rate: '1.00', dau: 0, mau: 0, active_lobbies: 0, total_users: 0, total_nodes: 0
    });

    // Player Data State (For Sorting)
    const [playerData, setPlayerData] = useState([
        { id: '#4291-ABCD', username: 'SpeedDemon88', originNode: 'Master 1', location: 'Tokyo, Japan', stickiness: 14 },
        { id: '#9921-XCAW', username: 'Elev8King', originNode: 'Franchise 1.2', location: 'Sydney, Australia', stickiness: 2 },
        { id: '#1102-LPOP', username: 'CryptoWhale', originNode: 'Master 2', location: 'New York, USA', stickiness: 45 },
        { id: '#3341-ZZZQ', username: 'CasualGamer9', originNode: 'Sub_Franchise 1.2.1', location: 'London, UK', stickiness: 8 },
        { id: '#8890-MNVV', username: 'ProSniper_Xx', originNode: 'Franchisee 2.1', location: 'Los Angeles, USA', stickiness: 110 }
    ]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Revenue Center State
    const [revenueTree, setRevenueTree] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState({ 'Master 1': true, 'Master 2': true });

    // Search States
    const [revenueSearchQuery, setRevenueSearchQuery] = useState('');
    const [playerSearchQuery, setPlayerSearchQuery] = useState('');

    // Node Detail Drill-Down State
    const [selectedNode, setSelectedNode] = useState(null);

    // UI State
    const [loading, setLoading] = useState(false);

    const toggleNode = (id, e) => {
        if (e) e.stopPropagation();
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderRecursiveRows = (nodes, parentHierarchy, depth = 0) => {
        let rows = [];
        nodes.forEach(node => {
            const hasChildren = node.subNodes && node.subNodes.length > 0;
            const isExpanded = !!expandedNodes[node.id];

            rows.push(
                <tr key={node.id} className="border-b border-gray-800/30 hover:bg-bg-card transition-colors" style={{ backgroundColor: depth % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.2)' }}>
                    <td className="px-6 py-4" style={{ paddingLeft: `${1.5 + depth * 2}rem` }}>
                        <div className="flex items-center gap-2">
                            {hasChildren ? (
                                <button onClick={(e) => toggleNode(node.id, e)} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                                    {isExpanded ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    )}
                                </button>
                            ) : (
                                <div className="w-6"></div> // Spacer logic if no children
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>
                            <span className="text-gray-400 font-mono text-xs"><span className="text-gray-600">{parentHierarchy} →</span> <NodeTag nodeId={node.id} /></span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-white font-bold">{node.name}</td>
                    <td className="px-6 py-4 text-accent-cyan font-bold">{node.revShare} Cut</td>
                    <td className="px-6 py-4 text-white font-bold">{node.revenue}</td>
                    <td className="px-6 py-4 text-accent-cyan font-bold">{node.orgEarnings}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs border border-gray-600">Cleared</span>
                    </td>
                </tr>
            );

            if (isExpanded && hasChildren) {
                rows = rows.concat(renderRecursiveRows(node.subNodes, node.id, depth + 1));
            }
        });
        return rows;
    };

    useEffect(() => {
        // In full prod, these would be API calls to /api/v1/admin/command etc.
        // For now, load simulated structure 
        simulateDataLoad();
    }, []);

    const simulateDataLoad = () => {
        setSystemMetrics({
            conversion_rate: '1.00', dau: 4208, mau: 18500, active_lobbies: 142, total_users: 85400, total_nodes: 34
        });

        setRevenueTree([
            {
                id: 'Master 1', name: 'Asia Pacific Primary', revShare: '25%', revenue: '2,100,000 CR', orgEarnings: '525,000 CR',
                subNodes: [
                    { id: 'Franchisee 1.1', name: 'Japan Region', revShare: '15%', revenue: '1,000,000 CR', orgEarnings: '150,000 CR', subNodes: [] },
                    {
                        id: 'Franchisee 1.2', name: 'Australia Net', revShare: '10%', revenue: '600,000 CR', orgEarnings: '60,000 CR',
                        subNodes: [
                            { id: 'Sub_Franchise 1.2.1', name: 'Sydney Hub', revShare: '5%', revenue: '200,000 CR', orgEarnings: '10,000 CR', subNodes: [] }
                        ]
                    }
                ]
            },
            {
                id: 'Master 2', name: 'North America Alpha', revShare: '20%', revenue: '1,500,000 CR', orgEarnings: '300,000 CR',
                subNodes: [
                    { id: 'Franchisee 2.1', name: 'US West Coast', revShare: '10%', revenue: '500,000 CR', orgEarnings: '50,000 CR', subNodes: [] }
                ]
            }
        ]);
    };

    const handleConversionChange = (e) => {
        e.preventDefault();
        alert(`Conversion rate updated to ${systemMetrics.conversion_rate} INR`);
    };

    // Create Child Node Handler
    const handleCreateNode = (e) => {
        e.preventDefault();
        const childType = getChildTierName();
        // Capture values before any state updates
        const capturedName = createForm.name;
        const capturedLocation = createForm.location;
        const capturedUsername = createForm.username;
        const capturedPassword = createForm.password;
        const capturedCommission = createForm.commissionRate;

        // Simulated: In production this calls POST /api/v1/admin/create_node
        const existingCount = revenueTree.length;
        const newNumber = isSuper ? String(existingCount + 1) : `${adminNode?.display_number || '0'}.${existingCount + 1}`;
        const nodeId = `${childType} ${newNumber}`;
        const newNode = {
            id: nodeId, name: capturedName,
            revShare: capturedCommission + '%', revenue: '0 CR', orgEarnings: '0 CR',
            subNodes: []
        };
        setRevenueTree(prev => [...prev, newNode]);
        setCreatedCreds({ username: capturedUsername, password: capturedPassword, nodeId: nodeId, type: childType });
        setCreateForm({ name: '', location: '', username: '', password: '', commissionRate: '10' });
    };

    // Regenerate Password Handler
    const handleRegenPassword = () => {
        if (!regenNodeId) return;
        const newPass = Math.random().toString(36).slice(-10) + '!A1';
        setRegenResult({ nodeId: regenNodeId, newPassword: newPass });
    };

    // Sorting Logic for Player Table
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredPlayerData = React.useMemo(() => {
        let items = [...playerData];

        if (playerSearchQuery) {
            const q = playerSearchQuery.toLowerCase();
            items = items.filter(p =>
                p.id.toLowerCase().includes(q) ||
                p.username.toLowerCase().includes(q) ||
                p.location.toLowerCase().includes(q) ||
                p.originNode.toLowerCase().includes(q)
            );
        }

        if (sortConfig.key !== null) {
            items.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [playerData, sortConfig, playerSearchQuery]);

    // --- Search Logic for Revenue Tree ---
    const filterRevenueTree = (nodes, query) => {
        if (!query) return nodes;
        const q = query.toLowerCase();

        return nodes.map(node => {
            const isMatch = node.id.toLowerCase().includes(q) || (node.name && node.name.toLowerCase().includes(q));

            let filteredSubNodes = [];
            if (node.subNodes && node.subNodes.length > 0) {
                filteredSubNodes = filterRevenueTree(node.subNodes, query);
            }

            if (isMatch || filteredSubNodes.length > 0) {
                return {
                    ...node,
                    subNodes: isMatch ? node.subNodes : filteredSubNodes
                };
            }
            return null;
        }).filter(Boolean);
    };

    const filteredRevenueTree = React.useMemo(() => {
        return filterRevenueTree(revenueTree, revenueSearchQuery);
    }, [revenueTree, revenueSearchQuery]);

    // --- Node Detail Drill-Down Logic ---

    // Recursively find a node in the revenue tree
    const findNodeInTree = (nodeId, tree) => {
        for (const node of tree) {
            if (node.id === nodeId) return node;
            if (node.subNodes && node.subNodes.length > 0) {
                const found = findNodeInTree(nodeId, node.subNodes);
                if (found) return found;
            }
        }
        return null;
    };

    // Find the parent chain for a node
    const findParentChain = (nodeId, tree, chain = []) => {
        for (const node of tree) {
            if (node.id === nodeId) return [...chain, node.id];
            if (node.subNodes && node.subNodes.length > 0) {
                const result = findParentChain(nodeId, node.subNodes, [...chain, node.id]);
                if (result) return result;
            }
        }
        return null;
    };

    // Get players under a specific node
    const getPlayersForNode = (nodeId) => {
        return playerData.filter(p => p.originNode === nodeId);
    };

    // Get security status for a node
    const getNodeSecurityStatus = (nodeId) => {
        const securityNodes = [
            { id: 'Franchisee 2.1', status: 'active' },
            { id: 'Master 1', status: 'active' },
            { id: 'Master 2', status: 'active' },
            { id: 'Franchisee 1.1', status: 'active' },
            { id: 'Franchisee 1.2', status: 'active' },
            { id: 'Sub_Franchise 1.2.1', status: 'active' }
        ];
        const found = securityNodes.find(n => n.id === nodeId);
        return found ? found.status : 'active';
    };

    const openNodeDetail = (nodeId) => {
        setSelectedNode(nodeId);
    };

    const closeNodeDetail = () => {
        setSelectedNode(null);
    };

    // Reusable Clickable Node Tag
    const NodeTag = ({ nodeId, size = 'sm' }) => {
        const isMaster = nodeId.includes('Master');
        const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
        return (
            <button
                onClick={(e) => { e.stopPropagation(); openNodeDetail(nodeId); }}
                className={`${sizeClasses} rounded border font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-lg inline-flex items-center gap-1.5 ${isMaster
                    ? 'bg-[#b026ff]/15 text-accent-purple border-[#b026ff]/40 hover:bg-[#b026ff]/25 hover:shadow-[0_0_12px_rgba(176,38,255,0.3)]'
                    : 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30 hover:bg-accent-cyan/20 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={size === 'sm' ? 10 : 12} height={size === 'sm' ? 10 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                {nodeId}
            </button>
        );
    };

    // Full Node Detail Overlay
    const renderNodeDetailOverlay = () => {
        if (!selectedNode) return null;

        const nodeData = findNodeInTree(selectedNode, revenueTree);
        const parentChain = findParentChain(selectedNode, revenueTree) || [selectedNode];
        const nodePlayers = getPlayersForNode(selectedNode);
        const securityStatus = getNodeSecurityStatus(selectedNode);

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-10 animate-fadeIn" onClick={closeNodeDetail}>
                <div className="bg-bg-primary border border-gray-800 rounded-2xl w-full max-w-5xl shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0f212e] to-bg-card p-8 rounded-t-2xl border-b border-gray-800 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-4 h-4 rounded-full ${selectedNode.includes('Master') ? 'bg-accent-purple shadow-[0_0_12px_#b026ff]' : 'bg-accent-cyan shadow-[0_0_12px_#00f0ff]'}`}></div>
                                <h2 className="text-3xl font-display font-extrabold text-white">{nodeData?.name || selectedNode}</h2>
                            </div>
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm">
                                {parentChain.map((id, idx) => (
                                    <React.Fragment key={id}>
                                        {idx > 0 && <span className="text-gray-600">→</span>}
                                        <span className={`font-mono ${id === selectedNode ? 'text-white font-bold' : 'text-gray-500'}`}>{id}</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        <button onClick={closeNodeDetail} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Section 1: Revenue & Deal Info */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                Revenue & Deal Structure
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-bg-card p-5 rounded-xl border border-gray-800">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Revenue Share</p>
                                    <p className="text-2xl font-bold text-accent-green">{nodeData?.revShare || 'N/A'}</p>
                                </div>
                                <div className="bg-bg-card p-5 rounded-xl border border-gray-800">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total Revenue</p>
                                    <p className="text-2xl font-bold text-white">{nodeData?.revenue || '0 CR'}</p>
                                </div>
                                <div className="bg-bg-card p-5 rounded-xl border border-gray-800">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Commission Owed</p>
                                    <p className="text-2xl font-bold text-accent-cyan">{nodeData?.orgEarnings || '0 CR'}</p>
                                </div>
                                <div className="bg-bg-card p-5 rounded-xl border border-gray-800">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Sub-Nodes</p>
                                    <p className="text-2xl font-bold text-white">{nodeData?.subNodes?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Sub-Node Hierarchy */}
                        {nodeData?.subNodes && nodeData.subNodes.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>
                                    Child Nodes
                                </h3>
                                <div className="bg-bg-card border border-gray-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-gray-500 bg-black/40 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-3">Node ID</th>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Deal</th>
                                                <th className="px-6 py-3">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nodeData.subNodes.map(sub => (
                                                <tr key={sub.id} className="border-b border-gray-800/30 hover:bg-bg-secondary transition-colors">
                                                    <td className="px-6 py-3"><NodeTag nodeId={sub.id} /></td>
                                                    <td className="px-6 py-3 text-white font-bold">{sub.name}</td>
                                                    <td className="px-6 py-3 text-accent-cyan font-bold">{sub.revShare}</td>
                                                    <td className="px-6 py-3 text-white">{sub.revenue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Section 3: Players on this Node */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                                Players on this Node
                            </h3>
                            {nodePlayers.length > 0 ? (
                                <div className="bg-bg-card border border-gray-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-gray-500 bg-black/40 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-3">UUID</th>
                                                <th className="px-6 py-3">Username</th>
                                                <th className="px-6 py-3">Location</th>
                                                <th className="px-6 py-3">Stickiness</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nodePlayers.map(p => (
                                                <tr key={p.id} className="border-b border-gray-800/30 hover:bg-bg-secondary transition-colors">
                                                    <td className="px-6 py-3 font-mono text-gray-400">{p.id}</td>
                                                    <td className="px-6 py-3 text-white font-bold">{p.username}</td>
                                                    <td className="px-6 py-3 text-gray-300">{p.location}</td>
                                                    <td className={`px-6 py-3 font-bold ${p.stickiness > 30 ? 'text-accent-green' : 'text-accent-cyan'}`}>{p.stickiness} Days</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-bg-card border border-gray-800 rounded-xl p-6 text-center text-gray-500">
                                    No players currently registered on this node.
                                </div>
                            )}
                        </div>

                        {/* Section 4: Security Status */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                Security & Governance
                            </h3>
                            <div className="bg-bg-card border border-gray-800 rounded-xl p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">Current Status:</span>
                                        <span className={`px-3 py-1 rounded text-xs font-bold border ${securityStatus === 'active' ? 'bg-accent-green/10 text-accent-green border-accent-green/20' :
                                            securityStatus === 'paused' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>{securityStatus.charAt(0).toUpperCase() + securityStatus.slice(1)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded-lg text-sm font-bold transition-colors">Pause Node</button>
                                    <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-sm font-bold transition-colors">Ban Node</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Tab Content
    const renderContent = () => {
        switch (activeTab) {
            case 'command':
                return (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-white">Command Centre</h2>
                                <div className="px-3 py-1 bg-accent-green/20 text-accent-green rounded text-xs font-bold border border-accent-green/30">Live Birds-Eye View</div>
                            </div>
                            <button onClick={() => { setShowCreateModal(true); setCreatedCreds(null); }} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-extrabold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] active:scale-[0.98] transition-all flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                Create {getChildTierName()}
                            </button>
                        </div>

                        {/* Top KPI Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-bg-card p-6 rounded-xl border border-gray-800">
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total System Nodes</h3>
                                <p className="text-3xl font-display font-bold text-white">{systemMetrics.total_nodes}</p>
                            </div>
                            <div className="bg-bg-card p-6 rounded-xl border border-gray-800">
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Registered Players</h3>
                                <p className="text-3xl font-display font-bold text-white">{systemMetrics.total_users}</p>
                            </div>
                            <div className="bg-bg-card p-6 rounded-xl border border-gray-800">
                                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Active Server Lobbies</h3>
                                <p className="text-3xl font-display font-bold text-accent-green">{systemMetrics.active_lobbies}</p>
                            </div>
                        </div>

                        {/* Conversion Rate Engine */}
                        <div className="bg-bg-card border border-gray-800 rounded-xl p-8 shadow-lg max-w-2xl">
                            <h3 className="text-xl font-bold text-white mb-2">Global Coin Conversion</h3>
                            <p className="text-gray-400 text-sm mb-6">Automatically maps credit values to Fiat equivalents across the Elev8 Platform.</p>

                            <form onSubmit={handleConversionChange} className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">1 Coin (CR) =</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={systemMetrics.conversion_rate}
                                            onChange={(e) => setSystemMetrics({ ...systemMetrics, conversion_rate: e.target.value })}
                                            className="w-full bg-bg-secondary border-2 border-transparent focus:border-accent-cyan/50 rounded-lg pl-12 pr-4 py-4 text-2xl font-bold text-white placeholder-gray-600 focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-500">₹</span>
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button type="submit" className="py-4 px-8 rounded-lg bg-gradient-to-r from-accent-cyan to-[#0080ff] text-black font-extrabold text-lg tracking-wide hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-[0.98] transition-all">
                                        UPDATE VALUE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'revenue':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Revenue Centre</h2>
                                <p className="text-gray-400 text-sm mt-1">Infinite recursive hierarchy tracking global franchise earnings.</p>
                            </div>
                            <div className="relative w-72">
                                <input
                                    type="text"
                                    placeholder="Search Master or Node ID..."
                                    className="w-full bg-bg-card border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-black focus:outline-none focus:border-gray-600"
                                    value={revenueSearchQuery}
                                    onChange={(e) => setRevenueSearchQuery(e.target.value)}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>

                        {/* Recursive Revenue Accordion Blocks */}
                        <div className="space-y-4">
                            {filteredRevenueTree.length === 0 && (
                                <div className="text-center py-10 text-gray-500">No nodes found matching your search.</div>
                            )}
                            {filteredRevenueTree.map(master => (
                                <div key={master.id} className="bg-bg-card border border-accent-purple/30 rounded-xl overflow-hidden shadow-lg">
                                    {/* Master Header Block */}
                                    <div onClick={() => toggleNode(master.id)} className="bg-gradient-to-r from-bg-secondary to-bg-card p-5 flex justify-between items-center cursor-pointer hover:bg-bg-secondary transition-colors border-b border-gray-800/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-4 h-4 rounded-full bg-accent-purple shadow-[0_0_12px_#b026ff]"></div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{master.name}</h3>
                                                <p className="text-gray-400 text-sm font-mono mt-1">{master.id} <span className="mx-2 text-gray-700">•</span> <span className="text-accent-green font-bold px-2 py-0.5 bg-accent-green/10 rounded">{master.revShare} Global Deal</span></p>
                                            </div>
                                        </div>
                                        <div className="flex gap-8 items-center bg-black/40 px-6 py-3 rounded-lg border border-gray-800">
                                            <div className="text-right border-r border-gray-800 pr-8">
                                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Network Revenue</p>
                                                <p className="text-white font-bold text-lg">{master.revenue}</p>
                                            </div>
                                            <div className="text-right pl-2">
                                                <p className="text-accent-cyan text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse"></span>
                                                    Super Admin Cut
                                                </p>
                                                <p className="text-accent-cyan font-bold text-2xl drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">{master.orgEarnings}</p>
                                            </div>
                                            {expandedNodes[master.id] ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 ml-4"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 ml-4"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sub Nodes Table mapped dynamically */}
                                    {expandedNodes[master.id] && (
                                        <div className="p-0 bg-bg-primary/50 animate-fadeIn">
                                            <table className="w-full text-left text-sm whitespace-nowrap">
                                                <thead className="text-gray-500 bg-black/40 text-xs uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-3 font-semibold">Hierarchy Link</th>
                                                        <th className="px-6 py-3 font-semibold">Node Details</th>
                                                        <th className="px-6 py-3 font-semibold">Percentage Deal</th>
                                                        <th className="px-6 py-3 font-semibold">Generated Revenue</th>
                                                        <th className="px-6 py-3 font-semibold">Commission Owed Up</th>
                                                        <th className="px-6 py-3 font-semibold">Gateway Dues (7-Day)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderRecursiveRows(master.subNodes, master.id)}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'player':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Player Centre</h2>
                        </div>

                        {/* Live Highlight Area */}
                        <div className="bg-gradient-to-r from-accent-purple/20 to-bg-card border border-accent-purple/50 rounded-xl p-8 mb-8 shadow-[0_0_30px_rgba(176,38,255,0.1)]">
                            <h3 className="text-accent-purple font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-6">
                                <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"></div>
                                Live Platform Pulse
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Nodes Currently Streaming</p>
                                    <p className="text-4xl font-display font-bold text-white">42</p>
                                </div>
                                <div className="border-l border-gray-800/50 pl-8">
                                    <p className="text-gray-400 text-sm mb-1">Active Players Matchmaking</p>
                                    <p className="text-4xl font-display font-bold text-accent-cyan">1,245</p>
                                </div>
                                <div className="border-l border-gray-800/50 pl-8">
                                    <p className="text-gray-400 text-sm mb-1">Live Minute Revenue</p>
                                    <p className="text-4xl font-display font-bold text-accent-green">+850 CR</p>
                                </div>
                            </div>
                        </div>

                        {/* Analytic Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-bg-card p-6 rounded-xl border border-gray-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Daily Active Users (DAU)</h3>
                                    <p className="text-3xl font-display font-bold text-white">{systemMetrics.dau}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                            </div>
                            <div className="bg-bg-card p-6 rounded-xl border border-gray-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Monthly Active Users (MAU)</h3>
                                    <p className="text-3xl font-display font-bold text-white">{systemMetrics.mau}</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                        </div>

                        <div className="bg-bg-card rounded-xl border border-gray-800 overflow-hidden">
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-bg-secondary/50">
                                <h4 className="font-bold text-white">Player Database & Locations</h4>
                                <input
                                    type="text"
                                    placeholder="Search UUID, location or username..."
                                    className="bg-black/50 border border-gray-800 rounded px-3 py-1.5 text-sm text-white focus:outline-none"
                                    value={playerSearchQuery}
                                    onChange={(e) => setPlayerSearchQuery(e.target.value)}
                                />
                            </div>
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="text-gray-500 bg-black/40 text-xs uppercase tracking-wider select-none">
                                    <tr>
                                        <th className="px-6 py-3">Player UUID</th>
                                        <th className="px-6 py-3">Username</th>
                                        <th className="px-6 py-3 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('originNode')}>
                                            <div className="flex items-center gap-1">Origin Node
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortConfig.key === 'originNode' ? 'text-accent-cyan' : 'text-gray-600 group-hover:text-gray-400'} ${sortConfig.key === 'originNode' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('location')}>
                                            <div className="flex items-center gap-1">Location
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortConfig.key === 'location' ? 'text-accent-cyan' : 'text-gray-600 group-hover:text-gray-400'} ${sortConfig.key === 'location' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 cursor-pointer hover:text-white transition-colors group" onClick={() => handleSort('stickiness')}>
                                            <div className="flex items-center gap-1">Stickiness (Days)
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${sortConfig.key === 'stickiness' ? 'text-accent-cyan' : 'text-gray-600 group-hover:text-gray-400'} ${sortConfig.key === 'stickiness' && sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAndFilteredPlayerData.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No players found matching your search.</td>
                                        </tr>
                                    )}
                                    {sortedAndFilteredPlayerData.map((player) => (
                                        <tr key={player.id} className="border-b border-gray-800 hover:bg-bg-secondary transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-400">{player.id}</td>
                                            <td className="px-6 py-4 text-white font-bold">{player.username}</td>
                                            <td className="px-6 py-4">
                                                <NodeTag nodeId={player.originNode} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{player.location}</td>
                                            <td className={`px-6 py-4 font-bold ${player.stickiness > 30 ? 'text-accent-green' : player.stickiness < 10 ? 'text-gray-500' : 'text-accent-cyan'}`}>{player.stickiness} Days</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                Security Centre
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Ban Nodes Table */}
                            <div className="bg-bg-card rounded-xl border border-gray-800 overflow-hidden">
                                <div className="p-4 border-b border-gray-800 bg-bg-secondary/50">
                                    <h4 className="font-bold text-white mb-1">System Node Governance</h4>
                                    <p className="text-xs text-gray-500">Instantly suspend or ban franchisee hubs.</p>
                                </div>
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-gray-500 bg-black/40 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3">Node ID</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-800">
                                            <td className="px-4 py-3"><NodeTag nodeId="Franchisee 2.1" /></td>
                                            <td className="px-4 py-3"><span className="px-2 py-1 bg-accent-green/10 text-accent-green rounded text-xs border border-accent-green/20">Active</span></td>
                                            <td className="px-4 py-3 flex gap-2 justify-end">
                                                <button className="px-3 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded text-xs font-bold transition-colors">Pause</button>
                                                <button className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded text-xs font-bold transition-colors">Ban</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Ban Users Table */}
                            <div className="bg-bg-card rounded-xl border border-gray-800 overflow-hidden">
                                <div className="p-4 border-b border-gray-800 bg-bg-secondary/50">
                                    <h4 className="font-bold text-white mb-1">Platform User Governance</h4>
                                    <p className="text-xs text-gray-500">Isolate malicious player accounts globally.</p>
                                </div>
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-gray-500 bg-black/40 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3">Username</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-800">
                                            <td className="px-4 py-3 text-white font-bold">ToxicPlayer99</td>
                                            <td className="px-4 py-3"><span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs border border-red-500/20">Banned</span></td>
                                            <td className="px-4 py-3 flex gap-2 justify-end">
                                                <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs font-bold transition-colors">Restore</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Regenerate Password Section */}
                        <div className="bg-bg-card rounded-xl border border-gray-800 overflow-hidden">
                            <div className="p-4 border-b border-gray-800 bg-bg-secondary/50">
                                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    Regenerate Password
                                </h4>
                                <p className="text-xs text-gray-500">Reset credentials for any child node under your authority.</p>
                            </div>
                            <div className="p-6">
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Select Child Node</label>
                                        <select
                                            value={regenNodeId}
                                            onChange={(e) => { setRegenNodeId(e.target.value); setRegenResult(null); }}
                                            className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan/50"
                                        >
                                            <option value="">— Choose a node —</option>
                                            {revenueTree.map(node => (
                                                <React.Fragment key={node.id}>
                                                    <option value={node.id}>{node.id} — {node.name}</option>
                                                    {node.subNodes && node.subNodes.map(sub => (
                                                        <option key={sub.id} value={sub.id}>&nbsp;&nbsp;↳ {sub.id} — {sub.name}</option>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleRegenPassword}
                                        disabled={!regenNodeId}
                                        className="px-6 py-3 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        Regenerate
                                    </button>
                                </div>
                                {regenResult && (
                                    <div className="mt-4 p-4 rounded-lg bg-accent-green/10 border border-accent-green/30 animate-fadeIn">
                                        <p className="text-accent-green text-sm font-bold mb-1">✓ Password Regenerated for {regenResult.nodeId}</p>
                                        <p className="text-white text-lg font-mono bg-black/40 rounded px-3 py-2 mt-2 select-all">{regenResult.newPassword}</p>
                                        <p className="text-gray-500 text-xs mt-2">⚠ This password is shown only once. Store it securely.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex bg-bg-primary min-h-screen">

            {/* Super Admin Dashboard Embedded Sidebar */}
            <div className="w-64 bg-[#0f212e] border-r border-gray-800 shrink-0 hidden md:flex flex-col select-none">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-display font-extrabold text-white tracking-wide uppercase">{getDashboardTitle()}</h1>
                    <p className="text-[#8798a4] text-xs mt-1 uppercase tracking-widest font-bold">{adminNode?.display_name || 'Elev8 Core Admin'}</p>
                </div>

                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('command')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'command' ? 'bg-bg-card text-white border border-gray-800 shadow-md' : 'text-gray-400 hover:bg-bg-secondary hover:text-white'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Command Centre
                    </button>

                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'revenue' ? 'bg-bg-card text-white border border-gray-800 shadow-md' : 'text-gray-400 hover:bg-bg-secondary hover:text-white'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        Revenue Centre
                    </button>

                    <button
                        onClick={() => setActiveTab('player')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'player' ? 'bg-bg-card text-white border border-gray-800 shadow-md' : 'text-gray-400 hover:bg-bg-secondary hover:text-white'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Player Centre
                    </button>

                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'text-gray-400 hover:bg-red-500/5 hover:text-red-400'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        Security Centre
                    </button>
                </nav>

                <div className="mt-auto p-4 border-t border-gray-800 bg-[#0f212e] space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all text-sm font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                {renderContent()}
            </div>

            {/* Node Detail Overlay */}
            {renderNodeDetailOverlay()}

            {/* Create Node Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-bg-primary border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white">Create New {getChildTierName()}</h3>
                                <p className="text-gray-500 text-xs mt-1">This node will be created under your supervisory authority.</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {!createdCreds ? (
                            <form onSubmit={handleCreateNode} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{getChildTierName()} Name</label>
                                    <input type="text" required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan/50" placeholder="e.g. Asia Pacific Primary" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Location</label>
                                    <input type="text" value={createForm.location} onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })} className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan/50" placeholder="e.g. Tokyo, Japan" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Commission Rate (%)</label>
                                    <input type="number" step="0.1" required value={createForm.commissionRate} onChange={(e) => setCreateForm({ ...createForm, commissionRate: e.target.value })} className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan/50" />
                                </div>
                                <div className="border-t border-gray-800 pt-4 mt-4">
                                    <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider font-bold">Login Credentials</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Username</label>
                                            <input type="text" required value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan/50" placeholder="nodeuser" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
                                            <input type="text" required value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-cyan/50" placeholder="securepass" />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-accent-purple to-accent-cyan text-black font-extrabold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] active:scale-[0.98] transition-all">
                                    Create {getChildTierName()}
                                </button>
                            </form>
                        ) : (
                            <div className="p-6 space-y-4">
                                <div className="p-4 rounded-lg bg-accent-green/10 border border-accent-green/30">
                                    <p className="text-accent-green font-bold text-sm">✓ {createdCreds.type} Created Successfully!</p>
                                </div>
                                <div className="bg-bg-card p-4 rounded-lg border border-gray-800 space-y-3">
                                    <div><span className="text-gray-500 text-xs uppercase">Node ID:</span><p className="text-white font-mono font-bold">{createdCreds.nodeId}</p></div>
                                    <div><span className="text-gray-500 text-xs uppercase">Username:</span><p className="text-accent-cyan font-mono font-bold text-lg">{createdCreds.username}</p></div>
                                    <div><span className="text-gray-500 text-xs uppercase">Password:</span><p className="text-accent-cyan font-mono font-bold text-lg select-all">{createdCreds.password}</p></div>
                                </div>
                                <p className="text-gray-500 text-xs">⚠ These credentials are shown only once. Store them securely before closing this dialog.</p>
                                <button onClick={() => setShowCreateModal(false)} className="w-full py-3 rounded-lg bg-bg-card hover:bg-bg-secondary text-white font-bold text-sm border border-gray-800 transition-all">
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default SuperAdminDashboard;

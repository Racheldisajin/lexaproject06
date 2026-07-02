import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, ShieldCheck, Lightning, Crown, CheckSquare, List } from '@phosphor-icons/react';

export default function Navbar({ currentTab, notifications, setNotifications, onUpgradeClick, onToggleSidebar }) {
    const { user } = useAuth();
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const toggleNotifRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const getTabTitle = () => {
        switch (currentTab) {
            case 'dashboard': return 'Dashboard Overview';
            case 'documents': return 'Document Management';
            case 'signatures': return 'Digital Signatures';
            case 'certificates': return 'Certificate Management';
            case 'teams': return 'Team Management';
            case 'integrations': return 'API & Integrations';
            case 'users': return 'Users & Roles';
            case 'audit': return 'Audit Trail';
            case 'settings': return 'Settings';
            default: return 'LEXA DS';
        }
    };

    const getPlanBadge = () => {
        if (!user) return null;
        switch (user.plan) {
            case 'enterprise':
                return (
                    <span className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-bold rounded-full">
                        <Crown size={12} weight="fill" />
                        <span>LEXA Enterprise</span>
                    </span>
                );
            case 'secure':
                return (
                    <span className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-xs font-bold rounded-full">
                        <ShieldCheck size={12} weight="fill" />
                        <span>LEXA Secure</span>
                    </span>
                );
            default:
                return (
                    <button 
                        onClick={onUpgradeClick}
                        className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/40 text-xs font-bold rounded-full transition-colors cursor-pointer"
                    >
                        <Lightning size={12} weight="fill" className="text-slate-500" />
                        <span>Free Plan (Upgrade)</span>
                    </button>
                );
        }
    };

    return (
        <header className="h-16 border-b border-slate-200/80 bg-white px-4 md:px-8 flex items-center justify-between relative shrink-0">
            <div className="flex items-center space-x-3">
                <button 
                    onClick={onToggleSidebar}
                    className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <List size={24} />
                </button>
                <div>
                    <h2 className="text-sm md:text-lg font-bold text-slate-800 font-outfit leading-none">{getTabTitle()}</h2>
                    <span className="hidden md:block text-[10px] text-slate-400 font-medium mt-1">Sistem Tanda Tangan & Sertifikat Digital</span>
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                {/* Plan Badge */}
                {getPlanBadge()}

                {/* Notifications Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                        className={`p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all relative border border-slate-200/50 ${showNotifDropdown ? 'bg-slate-100' : ''}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full pulse-indicator"></span>
                        )}
                    </button>

                    {showNotifDropdown && (
                        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-xs font-bold text-slate-800">Notifikasi ({unreadCount})</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                                    >
                                        <CheckSquare size={12} />
                                        <span>Tandai semua dibaca</span>
                                    </button>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-xs text-slate-400">
                                        Tidak ada notifikasi baru
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            onClick={() => {
                                                toggleNotifRead(notif.id);
                                            }}
                                            className={`p-4 hover:bg-slate-50/80 transition-colors cursor-pointer text-left ${!notif.is_read ? 'bg-indigo-50/20' : ''}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-xs font-semibold ${!notif.is_read ? 'text-slate-900' : 'text-slate-600'}`}>{notif.title}</h4>
                                                <span className="text-[9px] text-slate-400">{notif.time}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

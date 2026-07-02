import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    SquaresFour, 
    FileText, 
    Certificate, 
    UsersThree, 
    Key, 
    SignOut,
    PenNib,
    Layout,
    Users,
    ClockCounterClockwise,
    Gear
} from '@phosphor-icons/react';

export default function Sidebar({ currentTab, setCurrentTab, isOpen }) {
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: SquaresFour },
        { id: 'documents', name: 'Documents', icon: FileText },
        { id: 'signatures', name: 'Signatures', icon: PenNib },
        { id: 'certificates', name: 'Certificates', icon: Certificate },
        { id: 'templates', name: 'Templates', icon: Layout },
        ...(user?.role === 'admin' ? [{ id: 'users', name: 'Users & Roles', icon: Users }] : []),
        { id: 'teams', name: 'Teams', icon: UsersThree },
        ...(user?.role === 'admin' ? [{ id: 'audit', name: 'Audit Trail', icon: ClockCounterClockwise }] : []),
        { id: 'integrations', name: 'Integrations', icon: Key },
        { id: 'settings', name: 'Settings', icon: Gear },
    ];

    return (
        <aside className={`w-64 bg-primary-950 text-slate-300 flex flex-col border-r border-slate-800/40 h-full fixed md:relative z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="flex-1 overflow-y-auto">
                {/* Brand header */}
                <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-900/60 bg-primary-950 sticky top-0 z-10">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-500/20">
                        <PenNib size={20} weight="bold" className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold font-outfit text-white tracking-wide leading-none">LEXA</h1>
                        <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-0.5 block">DS & Cert System</span>
                    </div>
                </div>

                {/* Menu items */}
                <nav className="mt-6 px-4 pb-6 space-y-1.5">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                                    isActive
                                        ? 'nav-item-active text-indigo-400'
                                        : 'hover:bg-white/5 hover:text-slate-100 text-slate-400'
                                }`}
                            >
                                <Icon size={20} weight={isActive ? "fill" : "regular"} className={isActive ? "text-indigo-400" : ""} />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* User footer profile */}
            <div className="p-4 border-t border-slate-900/60 bg-primary-950 shrink-0 mt-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="truncate w-28">
                            <h4 className="text-xs font-semibold text-white leading-tight truncate">{user?.name}</h4>
                            <span className="text-[10px] text-slate-500 capitalize leading-none">{user?.role}</span>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="p-2 hover:bg-rose-500/10 rounded-xl text-slate-500 hover:text-rose-400 transition-colors"
                        title="Logout"
                    >
                        <SignOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

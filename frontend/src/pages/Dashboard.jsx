import React, { useState } from 'react';
import { 
    FileText, 
    CheckCircle, 
    Clock, 
    File, 
    XCircle,
    Certificate,
    Warning,
    Calendar,
    ArrowUpRight,
    Plus,
    User,
    ShieldCheck,
    ArrowUp,
    ArrowDown,
    PencilSimple,
    UploadSimple,
    Pencil,
    Layout,
    UsersThree,
    Info,
    Key,
    MagnifyingGlass,
    CreditCard
} from '@phosphor-icons/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Filler
);

import { useAuth } from '../context/AuthContext';

export default function Dashboard({ stats, recentDocs, activities, onNavigateToTab }) {
    const { user } = useAuth();
    const docStats = stats?.documents || { total: 0, signed: 0, pending: 0, draft: 0, rejected: 0 };
    const certStats = stats?.certificates || { total: 0, valid: 0, expired: 0, expiringSoon: 0, nextExpiry: '' };

    const [timeFilter, setTimeFilter] = useState('month');
    const [filterStatus, setFilterStatus] = useState('all');

    // Main Donut Chart Data
    const donutData = {
        labels: ['Signed', 'Pending', 'Draft', 'Rejected'],
        datasets: [{
            data: [docStats.signed, docStats.pending, docStats.draft, docStats.rejected],
            backgroundColor: ['#6366f1', '#f59e0b', '#94a3b8', '#f43f5e'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const donutOptions = {
        cutout: '78%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 10,
                cornerRadius: 8,
                displayColors: true
            }
        },
        maintainAspectRatio: false
    };

    // Cert Donut Chart Data
    const certDonutData = {
        labels: ['Valid', 'Expiring Soon', 'Expired'],
        datasets: [{
            data: [certStats.valid, certStats.expiringSoon, certStats.expired],
            backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
            borderWidth: 0,
        }]
    };

    const certDonutOptions = {
        cutout: '78%',
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    };

    // Generate line chart data based on mock docs
    const getLineChartData = () => {
        // Simple mock implementation: distribute current total over last 5 weeks
        // In a real app, this would group documents by date
        const weekData = [0, 0, 0, 0, 0];
        if (docStats.total > 0) {
            // Just dummy distribution for visualization that grows with total
            weekData[4] = docStats.total; // Latest week has all for now
        }
        
        return {
            labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu Ini'],
            datasets: [{
                label: 'Dokumen Baru',
                data: weekData,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                borderWidth: 2,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366f1',
                pointBorderWidth: 2.5,
                pointRadius: 4.5,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        };
    };

    const lineData = getLineChartData();

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { 
                beginAtZero: true, 
                suggestedMax: Math.max(10, docStats.total + 5),
                ticks: { stepSize: Math.max(5, Math.ceil(docStats.total / 4)), color: '#94a3b8', font: { size: 10 } },
                border: { display: false },
                grid: { color: 'rgba(226, 232, 240, 0.6)' }
            },
            x: { 
                ticks: { color: '#94a3b8', font: { size: 10 } },
                border: { display: false },
                grid: { display: false }
            }
        }
    };

    const getRelativeTime = (timeStr) => {
        return timeStr || 'Baru saja';
    };

    const getActivityStyle = (action) => {
        switch (action) {
            case 'signed':
                return 'bg-emerald-500 ring-4 ring-emerald-500/10';
            case 'expired':
                return 'bg-rose-500 ring-4 ring-rose-500/10';
            case 'upload':
                return 'bg-indigo-500 ring-4 ring-indigo-500/10';
            case 'update':
                return 'bg-purple-500 ring-4 ring-purple-500/10';
            default:
                return 'bg-slate-500 ring-4 ring-slate-500/10';
        }
    };

    const getAuditTrailStyle = (action) => {
        switch (action) {
            case 'signed':
                return {
                    icon: PencilSimple,
                    color: 'text-emerald-600 bg-emerald-50 border border-emerald-100',
                    label: 'Signed',
                    badge: 'text-emerald-600 bg-emerald-50 border border-emerald-100/55'
                };
            case 'upload':
                return {
                    icon: UploadSimple,
                    color: 'text-indigo-600 bg-indigo-50 border border-indigo-100',
                    label: 'Uploaded',
                    badge: 'text-indigo-600 bg-indigo-50 border border-indigo-100/55'
                };
            case 'update':
                return {
                    icon: Pencil,
                    color: 'text-purple-600 bg-purple-50 border border-purple-100',
                    label: 'Updated',
                    badge: 'text-purple-600 bg-purple-50 border border-purple-100/55'
                };
            default:
                return {
                    icon: ShieldCheck,
                    color: 'text-slate-600 bg-slate-50 border border-slate-100',
                    label: 'System',
                    badge: 'text-slate-600 bg-slate-50 border border-slate-100/55'
                };
        }
    };

    const docPercentages = {
        signed: docStats.total > 0 ? Math.round((docStats.signed / docStats.total) * 100) : 0,
        pending: docStats.total > 0 ? Math.round((docStats.pending / docStats.total) * 100) : 0,
        draft: docStats.total > 0 ? Math.round((docStats.draft / docStats.total) * 100) : 0,
        rejected: docStats.total > 0 ? Math.round((docStats.rejected / docStats.total) * 100) : 0,
    };

    const certPercentages = {
        valid: certStats.total > 0 ? Math.round((certStats.valid / certStats.total) * 100) : 0,
        expiringSoon: certStats.total > 0 ? Math.round((certStats.expiringSoon / certStats.total) * 100) : 0,
        expired: certStats.total > 0 ? Math.round((certStats.expired / certStats.total) * 100) : 0,
    };

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans">
            
            {/* Top Welcome Title & Search Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 font-outfit flex items-center space-x-1.5">
                        <span>Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}!</span>
                        <span className="animate-bounce">👋</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Kelola dokumen, tanda tangan digital, dan sertifikat Anda dengan aman.</p>
                </div>
            </div>

            {/* Pending Signatures Alert */}
            {stats.documents.pendingForMe > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                        <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                            <Warning size={24} weight="fill" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 font-outfit">Anda memiliki {stats.documents.pendingForMe} dokumen yang perlu ditandatangani</h4>
                            <p className="text-xs text-slate-500 mt-0.5 font-sans">Harap segera periksa menu Signatures untuk memberikan persetujuan Anda.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onNavigateToTab('signatures')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
                    >
                        Tinjau & Tandatangani
                    </button>
                </div>
            )}

            {/* 4 Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1: Total Documents */}
                <div className="glass-card rounded-3xl p-6 hover-lift relative overflow-hidden group border border-white/60 bg-white/70">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-all duration-300 border border-indigo-100/40">
                            <FileText size={24} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[0.75rem] font-semibold tracking-wider text-slate-400 uppercase font-outfit">Total Documents</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight font-outfit">{docStats.total}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs relative z-10 justify-between">
                        <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            <ArrowUp size={12} weight="bold" className="mr-0.5" /> 18%
                        </span>
                        <span className="text-slate-400 font-medium">dari bulan lalu</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
                        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-indigo-500/10 fill-current stroke-indigo-500/30 stroke-[0.75px]">
                            <path d="M0,20 L0,10 C10,12 20,5 30,8 C40,11 50,7 60,10 C70,13 80,8 90,11 C100,14 100,20 100,20 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Card 2: Signed Documents */}
                <div className="glass-card rounded-3xl p-6 hover-lift relative overflow-hidden group border border-white/60 bg-white/70">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-all duration-300 border border-emerald-100/40">
                            <CheckCircle size={24} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[0.75rem] font-semibold tracking-wider text-slate-400 uppercase font-outfit">Signed Documents</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight font-outfit">{docStats.signed}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs relative z-10 justify-between">
                        <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            <ArrowUp size={12} weight="bold" className="mr-0.5" /> 22%
                        </span>
                        <span className="text-slate-400 font-medium">dari bulan lalu</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
                        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-emerald-500/10 fill-current stroke-emerald-500/30 stroke-[0.75px]">
                            <path d="M0,20 L0,5 C10,7 20,2 30,6 C40,10 50,4 60,8 C70,12 80,6 90,9 C100,12 100,20 100,20 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Card 3: Active Certificates */}
                <div className="glass-card rounded-3xl p-6 hover-lift relative overflow-hidden group border border-white/60 bg-white/70">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors"></div>
                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl group-hover:scale-110 transition-all duration-300 border border-violet-100/40">
                            <ShieldCheck size={24} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[0.75rem] font-semibold tracking-wider text-slate-400 uppercase font-outfit">Active Certificates</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight font-outfit">{certStats.total}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs relative z-10 justify-between">
                        <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            <ArrowUp size={12} weight="bold" className="mr-0.5" /> 12%
                        </span>
                        <span className="text-slate-400 font-medium">dari bulan lalu</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
                        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-violet-500/10 fill-current stroke-violet-500/30 stroke-[0.75px]">
                            <path d="M0,20 L0,12 C10,15 20,8 30,11 C40,14 50,9 60,13 C70,17 80,10 90,12 C100,14 100,20 100,20 Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Card 4: Expired Certificates */}
                <div className="glass-card rounded-3xl p-6 hover-lift relative overflow-hidden group border border-white/60 bg-white/70">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors"></div>
                    <div className="flex items-start space-x-4 relative z-10">
                        <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl group-hover:scale-110 transition-all duration-300 border border-rose-100/40">
                            <FileText size={24} weight="bold" />
                        </div>
                        <div>
                            <p className="text-[0.75rem] font-semibold tracking-wider text-slate-400 uppercase font-outfit">Expired Certificates</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight font-outfit">{certStats.expired}</h3>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs relative z-10 justify-between">
                        <span className="flex items-center text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-bold">
                            <ArrowDown size={12} weight="bold" className="mr-0.5" /> 2
                        </span>
                        <span className="text-slate-400 font-medium">dari bulan lalu</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
                        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-rose-500/10 fill-current stroke-rose-500/30 stroke-[0.75px]">
                            <path d="M0,20 L0,8 C10,10 20,5 30,8 C40,11 50,6 60,9 C70,12 80,7 90,10 C100,12 100,20 100,20 Z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Charts & Quick Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Chart Area (Spans 2 cols) */}
                <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200/60 bg-white/70">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 font-outfit text-sm">Documents Overview</h3>
                        <select 
                            value={timeFilter} 
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:bg-slate-100 cursor-pointer font-sans"
                        >
                            <option value="today">Hari Ini</option>
                            <option value="week">Minggu Ini</option>
                            <option value="month">Bulan Ini</option>
                            <option value="year">Tahun Ini</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-center h-64 font-sans">
                        {/* Donut Chart Canvas Container */}
                        <div className="relative w-40 h-40 flex-shrink-0">
                            <Doughnut data={donutData} options={donutOptions} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-bold text-slate-800 font-outfit">{docStats.total}</span>
                                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total</span>
                            </div>
                        </div>
                        
                        {/* Legend & Line Chart */}
                        <div className="flex-1 w-full flex flex-col h-full justify-between">
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-xs font-semibold">
                                <div className="flex items-center">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 shadow-sm shadow-indigo-500/20"></span>
                                    <span className="text-slate-500 font-medium w-14">Signed</span>
                                    <span className="font-bold text-slate-800 font-outfit">{docStats.signed} <span className="text-slate-400 font-normal text-[10px]">({docPercentages.signed}%)</span></span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 shadow-sm shadow-amber-500/20"></span>
                                    <span className="text-slate-500 font-medium w-14">Pending</span>
                                    <span className="font-bold text-slate-800 font-outfit">{docStats.pending} <span className="text-slate-400 font-normal text-[10px]">({docPercentages.pending}%)</span></span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-450 mr-2 shadow-sm shadow-slate-400/20"></span>
                                    <span className="text-slate-500 font-medium w-14">Draft</span>
                                    <span className="font-bold text-slate-800 font-outfit">{docStats.draft} <span className="text-slate-400 font-normal text-[10px]">({docPercentages.draft}%)</span></span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-sm shadow-rose-500/20"></span>
                                    <span className="text-slate-500 font-medium w-14">Rejected</span>
                                    <span className="font-bold text-slate-800 font-outfit">{docStats.rejected} <span className="text-slate-400 font-normal text-[10px]">({docPercentages.rejected}%)</span></span>
                                </div>
                            </div>
                            <div className="h-32 w-full mt-auto">
                                <p className="text-[10px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Document Status</p>
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card rounded-3xl p-6 border border-slate-200/60 bg-white/70 flex flex-col justify-between">
                    <h3 className="font-bold text-slate-800 font-outfit mb-4 text-sm">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        <button onClick={() => onNavigateToTab('documents')} className="bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100/50 p-4 rounded-2xl flex flex-col items-start justify-center transition-all group text-left cursor-pointer">
                            <UploadSimple size={24} className="text-blue-600 mb-1.5 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-xs font-bold text-slate-800">Upload Document</span>
                            <span className="text-[9px] text-slate-500 mt-0.5">Unggah dokumen baru</span>
                        </button>
                        <button onClick={() => onNavigateToTab('signatures')} className="bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100/50 p-4 rounded-2xl flex flex-col items-start justify-center transition-all group text-left cursor-pointer">
                            <Pencil size={24} className="text-emerald-600 mb-1.5 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-xs font-bold text-slate-800">Request Signature</span>
                            <span className="text-[9px] text-slate-500 mt-0.5">Minta tanda tangan</span>
                        </button>
                        <button onClick={() => onNavigateToTab('templates')} className="bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100/50 p-4 rounded-2xl flex flex-col items-start justify-center transition-all group text-left cursor-pointer">
                            <Layout size={24} className="text-purple-600 mb-1.5 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-xs font-bold text-slate-800">Create Template</span>
                            <span className="text-[9px] text-slate-500 mt-0.5">Buat template dokumen</span>
                        </button>
                        <button onClick={() => onNavigateToTab('certificates')} className="bg-orange-50/50 hover:bg-orange-100/60 border border-orange-100/50 p-4 rounded-2xl flex flex-col items-start justify-center transition-all group text-left cursor-pointer">
                            <ShieldCheck size={24} className="text-orange-500 mb-1.5 group-hover:-translate-y-1 transition-transform" />
                            <span className="text-xs font-bold text-slate-800">Create Certificate</span>
                            <span className="text-[9px] text-slate-500 mt-0.5">Buat sertifikat baru</span>
                        </button>
                        <button onClick={() => onNavigateToTab('documents')} className="col-span-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-3 rounded-2xl flex items-center space-x-3 transition-colors group cursor-pointer text-left">
                            <CheckCircle size={20} className="text-slate-600 group-hover:scale-115 transition-transform" />
                            <div>
                                <span className="text-xs font-bold text-slate-800 block">Verify Document</span>
                                <span className="text-[9px] text-slate-500">Verifikasi keaslian stempel digital</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                
                {/* Recent Documents Table & Condensed Audit Trail */}
                <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-200/60 bg-white/70">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-slate-800 font-outfit text-sm">Recent Documents</h3>
                        <div className="flex items-center space-x-1 text-[10px] font-bold">
                            <button onClick={() => setFilterStatus('all')} className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>All</button>
                            <button onClick={() => setFilterStatus('signed')} className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterStatus === 'signed' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Signed</button>
                            <button onClick={() => setFilterStatus('pending')} className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${filterStatus === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Pending</button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                            <thead className="text-[10px] text-slate-400 bg-slate-50/50 border-b border-slate-200/60 uppercase">
                                <tr>
                                    <th className="px-3 py-2.5 font-semibold rounded-l-xl">Document Name</th>
                                    <th className="px-3 py-2.5 font-semibold">Status</th>
                                    <th className="px-3 py-2.5 font-semibold">Type</th>
                                    <th className="px-3 py-2.5 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentDocs
                                    .filter(d => filterStatus === 'all' || d.status === filterStatus)
                                    .map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-3 py-3 font-bold text-slate-800 text-xs truncate max-w-[180px]">{doc.title}</td>
                                            <td className="px-3 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                                    doc.status === 'signed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                                                    doc.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                                                    'bg-slate-50 text-slate-500 border border-slate-200/50'
                                                }`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-slate-500 font-semibold">{doc.type}</td>
                                            <td className="px-3 py-3 text-slate-400 font-medium">{doc.date || 'Baru saja'}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Condensed Audit Trail */}
                    <div className="mt-8 flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 font-outfit text-sm">Audit Trail</h3>
                        <button 
                            onClick={() => onNavigateToTab('audit')} 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                            View All Activities
                        </button>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                        {activities.map((act) => {
                            const style = getAuditTrailStyle(act.action || 'system');
                            const Icon = style.icon;
                            return (
                                <div key={act.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-white/40 border border-slate-100 rounded-2xl hover:bg-white/95 transition-all">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-1.5 rounded-lg ${style.color}`}>
                                            <Icon size={14} weight="bold" />
                                        </div>
                                        <div>
                                            <p className="text-slate-700 font-medium leading-relaxed">{act.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium ml-10 md:ml-0">{act.time}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Side Column: Certificate Overview & Recent Activity */}
                <div className="space-y-6">
                    
                    {/* Certificate Overview */}
                    <div className="glass-card rounded-3xl p-6 border border-slate-200/60 bg-white/70">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 font-outfit text-sm">Certificate Overview</h3>
                            <button onClick={() => onNavigateToTab('certificates')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer">View All</button>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <Doughnut data={certDonutData} options={certDonutOptions} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-base font-bold text-slate-800 font-outfit">{certStats.total}</span>
                                    <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Active</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2 text-xs font-semibold">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-sm"></span>
                                        <span className="text-slate-500 font-medium">Valid</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{certStats.valid} ({certPercentages.valid}%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-2 shadow-sm"></span>
                                        <span className="text-slate-500 font-medium">Expiring</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{certStats.expiringSoon} ({certPercentages.expiringSoon}%)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-sm"></span>
                                        <span className="text-slate-500 font-medium">Expired</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{certStats.expired} ({certPercentages.expired}%)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-outfit">Next Expiry</p>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium">
                                <div className="flex items-center space-x-2 truncate">
                                    <div className="p-1.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg">
                                        <Certificate size={16} />
                                    </div>
                                    <span className="text-slate-700 font-bold truncate">{certStats.nextExpiry || 'Tidak ada sertifikat terdekat'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity List */}
                    <div className="glass-card rounded-3xl p-6 border border-slate-200/60 bg-white/70">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 font-outfit text-sm">Recent Activity</h3>
                            <button onClick={() => onNavigateToTab('audit')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer">View All</button>
                        </div>
                        
                        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-100">
                            {activities.map((act) => (
                                <div key={act.id} className="relative flex items-start space-x-3 pl-0.5">
                                    <div className={`w-3.5 h-3.5 rounded-full ${getActivityStyle(act.action)} border-2 border-white z-10 shrink-0 mt-1`}></div>
                                    <div className="flex-1 min-w-0 text-xs">
                                        <div className="font-bold text-slate-700 leading-snug">{act.description}</div>
                                        <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1.5 font-medium">
                                            <span>{act.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

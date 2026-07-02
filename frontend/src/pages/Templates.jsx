import React, { useState } from 'react';
import { 
    FileText, 
    Briefcase, 
    ShieldCheck, 
    CheckCircle, 
    Warning 
} from '@phosphor-icons/react';


export default function Templates() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    const handleUseTemplate = async (templateName) => {
        setLoading(true);
        setStatus(null);
        try {
            const response = await new Promise(r => setTimeout(r, 500));
            if (response.data.success) {
                setStatus({ type: 'success', msg: `Berhasil membuat draft dokumen dari template: ${templateName}` });
            } else {
                setStatus({ type: 'error', msg: 'Gagal membuat dokumen.' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Gagal menghubungi server.' });
        } finally {
            setLoading(false);
        }
    };

    const templates = [
        {
            id: 1,
            name: 'Template NDA Perjanjian Kerahasiaan',
            desc: 'Template standar untuk kemitraan bisnis dan perpanjangan vendor.',
            icon: FileText,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100/40'
        },
        {
            id: 2,
            name: 'Template PKS Layanan IT',
            desc: 'Template hukum perjanjian kerja sama penyediaan jasa komputasi awan dan support.',
            icon: Briefcase,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100/40'
        },
        {
            id: 3,
            name: 'Template SOP Internal',
            desc: 'Standar prosedur operasional kepatuhan data ISO27001 dan audit privasi.',
            icon: ShieldCheck,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100/40'
        }
    ];

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 font-outfit">Document Templates</h2>
                <p className="text-sm text-slate-500 mt-0.5 font-sans">Sederhanakan alur kerja dengan template dokumen pra-desain.</p>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-center space-x-3 text-xs font-sans ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    {status.type === 'success' ? <CheckCircle size={18} /> : <Warning size={18} />}
                    <span>{status.msg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                {templates.map((tpl) => {
                    const Icon = tpl.icon;
                    return (
                        <div 
                            key={tpl.id}
                            className="bg-white/80 backdrop-blur border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-300 shadow-sm"
                        >
                            <div>
                                <div className={`p-3 rounded-2xl border w-fit mb-4 ${tpl.color}`}>
                                    <Icon size={24} weight="bold" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 font-outfit">{tpl.name}</h4>
                                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{tpl.desc}</p>
                            </div>
                            <button 
                                disabled={loading}
                                onClick={() => handleUseTemplate(tpl.name)}
                                className="mt-6 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : 'Gunakan Template'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

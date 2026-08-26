import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    HeartPulse,
    ShieldCheck,
    Brain,
    Activity,
    AlertTriangle,
    FileText,
    Sparkles
} from "lucide-react";

const links = [
    { to: "/patient/dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { to: "/patient/healthtwin", label: "Digital Twin", icon: HeartPulse, badge: "Twin" },
    { to: "/patient/consents", label: "Consents & Security", icon: ShieldCheck },
    { to: "/patient/ai-prediction", label: "Heart AI Prediction", icon: Brain, badge: "AI" },
    { to: "/patient/diabetes-prediction", label: "Diabetes Prediction", icon: Activity },
    { to: "/patient/alerts", label: "My Alerts", icon: AlertTriangle },
    { to: "/patient/careplan", label: "My Care Plan", icon: FileText, badge: "Live" }
];

function PatientSidebar() {
    return (
        <aside className="sidebar-shell flex flex-col justify-between">
            <div>
                <div className="sidebar-brand">
                    <div className="brand-icon bg-gradient-to-tr from-emerald-500 to-teal-600">
                        <Activity size={20} />
                    </div>
                    <div>
                        <div className="brand-text-title flex items-center gap-1.5 font-bold tracking-tight">
                            HealthCare
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">PATIENT</span>
                        </div>
                        <div className="brand-text-sub text-xs text-emerald-300/80">Personal Health Companion</div>
                    </div>
                </div>

                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    My Health Journey
                </div>

                <nav className="sidebar-nav space-y-1 px-2">
                    {links.map(({ to, label, icon: Icon, badge }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `sidebar-link group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? "active bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-md shadow-emerald-500/20"
                                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={19} strokeWidth={2} className="transition-transform group-hover:scale-110" />
                                <span className="text-sm">{label}</span>
                            </div>
                            {badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                                    {badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/50 shadow-inner">
                <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-xs font-semibold text-white flex items-center gap-1">
                        Digital Twin Online <Sparkles size={11} className="text-emerald-400" />
                    </h3>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Vitals & Adherence synced to MongoDB Cloud.</p>
            </div>
        </aside>
    );
}

export default PatientSidebar;

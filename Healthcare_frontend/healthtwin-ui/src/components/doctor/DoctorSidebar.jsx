import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Activity,
    Brain,
    ShieldCheck,
    Stethoscope,
    AlertTriangle,
    ClipboardList,
    Sparkles
} from "lucide-react";

const links = [
    {
        to: "/doctor/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard
    },
    {
        to: "/doctor/patients",
        label: "Assigned Patients",
        icon: Users
    },
    {
        to: "/doctor/healthtwin",
        label: "Health Twins",
        icon: Stethoscope
    },
    {
        to: "/doctor/ai-prediction",
        label: "AI Risk Prediction",
        icon: Brain,
        badge: "AI"
    },
    {
        to: "/doctor/careplans",
        label: "AI Care Plans",
        icon: ClipboardList,
        badge: "Live"
    },
    {
        to: "/doctor/alerts",
        label: "Critical Alerts",
        icon: AlertTriangle,
        badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30"
    },
    {
        to: "/doctor/anomaly",
        label: "Anomaly Detection",
        icon: Activity
    }
];

function DoctorSidebar() {
    return (
        <aside className="sidebar-shell flex flex-col justify-between">
            <div>
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div className="brand-text-title flex items-center gap-1.5 font-bold tracking-tight">
                            HealthCare
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">PRO</span>
                        </div>
                        <div className="brand-text-sub text-xs text-blue-300/80">Doctor Portal & AI Intelligence</div>
                    </div>
                </div>

                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Clinical Workspace
                </div>

                <nav className="sidebar-nav space-y-1 px-2">
                    {links.map(({ to, label, icon: Icon, badge, badgeColor }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `sidebar-link group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? "active bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md shadow-blue-500/20"
                                        : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                                }`
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={19} strokeWidth={2} className="transition-transform group-hover:scale-110" />
                                <span className="text-sm">{label}</span>
                            </div>
                            {badge && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor || "bg-blue-500/20 text-blue-300 border-blue-500/30"}`}>
                                    {badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/50 shadow-inner">
                <div className="flex items-center gap-2.5">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                            DR
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-white flex items-center gap-1">
                            Attending Physician <Sparkles size={11} className="text-amber-400" />
                        </p>
                        <p className="text-[11px] text-emerald-400 font-medium">Care Coordination Active</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default DoctorSidebar;

import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Stethoscope, Sparkles, ShieldCheck } from "lucide-react";

const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/patients", label: "Patients", icon: Users },
    { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
    { to: "/admin/ai", label: "AI Insights", icon: Sparkles },
];

function Sidebar() {
    return (
        <aside className="sidebar-shell w-72 min-h-screen text-white">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">HealthCare</h2>
                    <p className="text-sm text-slate-300">Admin Console</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {links.map(({ to, label, icon: Icon }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer glass-panel">
                <p className="text-sm font-semibold text-slate-900">Protected care operations</p>
                <p className="mt-1 text-sm text-slate-600">Secure and intelligent monitoring for every patient journey.</p>
            </div>
        </aside>
    );
}

export default Sidebar;
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRoundCog,
  Activity,
  BrainCircuit,
  Brain,
  FileBarChart2,
  Settings,
  HeartPulse,
  Zap,
  FileHeart,
  AlertTriangle,
  Database,
  
} from "lucide-react";

const menus = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { title: "Patients", icon: Users, path: "/admin/patients" },
  { title: "Doctors", icon: UserRoundCog, path: "/admin/doctors" },
  { title: "Health Twins", icon: HeartPulse, path: "/admin/healthtwins" },
  { title: "Care Plans", icon: FileHeart, path: "/admin/careplans" },
 /* { title: "Vitals", icon: Activity, path: "/admin/vitals" },*/
 /* { title: "FHIR Data", icon: Database, path: "/admin/fhir" },*/
  { title: "AI Predictions", icon: Brain, path: "/admin/ai-predictions" },
 /* { title: "Reports", icon: FileBarChart2, path: "/admin/reports" },*/
  { title: "Model Management", icon: BrainCircuit, path: "/admin/models" },
  {
    title: "Alerts",
    icon: AlertTriangle,
    path:"/admin/alerts"
},
 {
        title: "Anomaly Detection",
        icon: Activity,
        path: "/admin/anomaly"
    },
];

function AdminSidebar() {
    return (
        <aside className="sidebar-shell flex flex-col">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <HeartPulse size={22} />
                </div>
                <div>
                    <div className="brand-text-title">HealthCare</div>
                    <div className="brand-text-sub">Admin Portal</div>
                </div>
            </div>

            <div className="sidebar-section-label">Operations</div>

            <nav className="sidebar-nav">
                {menus.map((menu) => {
                    const Icon = menu.icon;
                    return (
                        <NavLink
                            key={menu.path}
                            to={menu.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                        >
                            <Icon size={19} strokeWidth={2} />
                            <span>{menu.title}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-amber-500" />
                    <p className="text-sm font-semibold text-slate-900">System Status</p>
                </div>
                <p className="text-sm text-slate-600">All services operational. Last sync just now.</p>
            </div>
        </aside>
    );
}

export default AdminSidebar;

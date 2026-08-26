import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Stethoscope,
    Users,
    Activity,
    AlertTriangle,
    Eye,
    Sparkles,
    Clock,
    ShieldAlert,
    CheckCircle2,
    ArrowRight,
    HeartPulse,
    RefreshCw
} from "lucide-react";

import { getAssignedPatients } from "../../services/assignmentService";
import { getDoctorAlerts } from "../../services/alertService";
import DoctorLayout from "../../components/doctor/DoctorLayout";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

function Dashboard({ keycloak }) {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    async function loadDashboard() {
        try {
            setLoading(true);
            const doctorId = keycloak.tokenParsed?.doctorId || "DOC101";

            const [patientRes, alertRes] = await Promise.allSettled([
                getAssignedPatients(doctorId),
                getDoctorAlerts(doctorId)
            ]);

            if (patientRes.status === "fulfilled") {
                setPatients(Array.isArray(patientRes.value?.data) ? patientRes.value.data : []);
            }
            if (alertRes.status === "fulfilled") {
                setAlerts(Array.isArray(alertRes.value?.data) ? alertRes.value.data : []);
            }
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
        const interval = setInterval(loadDashboard, 15000);
        return () => clearInterval(interval);
    }, []);

    const criticalCount = alerts.filter(a => a.severity === "CRITICAL" || a.status === "NEW").length;
    const acknowledgedCount = alerts.filter(a => a.status === "ACKNOWLEDGED").length;
    const resolvedCount = alerts.filter(a => a.status === "RESOLVED").length;

    return (
        <DoctorLayout keycloak={keycloak}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* PAGE HEADER */}
                <motion.div variants={itemVariants} className="page-card">
                    <div className="page-header">
                        <div className="page-header__info">
                            <div className="page-status-chip page-status-chip--teal">
                                <Stethoscope size={14} /> Clinical Operations
                            </div>
                            <h1 className="page-title">Doctor Dashboard</h1>
                            <p className="page-subtitle">
                                Monitor your assigned patients, live vital updates, and critical patient alerts in real time.
                            </p>
                        </div>
                        <div className="page-header__actions flex items-center gap-3">
                            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
                                <Clock size={14} className="text-slate-400" /> Synced: {lastUpdated.toLocaleTimeString()}
                            </div>
                            <button
                                onClick={loadDashboard}
                                style={{ background: "#0f172a", color: "#ffffff" }}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer"
                            >
                                <RefreshCw size={14} className={loading ? "animate-spin text-white" : "text-white"} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* TOP METRICS STATS GRID */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Assigned Patients */}
                    <div
                        onClick={() => navigate("/doctor/patients")}
                        className="stat-card cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Assigned Patients</div>
                                <div className="stat-card__value">{patients.length}</div>
                                <div className="stat-card__meta">Active care panel</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(59, 130, 246, 0.12)" }}>
                                <Users size={22} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    <div
                        onClick={() => navigate("/doctor/alerts")}
                        className="stat-card cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                        style={{ background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)", borderColor: "#fecdd3" }}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label text-rose-800">Critical Alerts</div>
                                <div className="stat-card__value text-rose-950">{criticalCount}</div>
                                <div className="stat-card__meta text-rose-700">Immediate attention needed</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(244, 63, 94, 0.18)" }}>
                                <ShieldAlert size={22} className="text-rose-800" />
                            </div>
                        </div>
                    </div>

                    {/* Acknowledged */}
                    <div
                        onClick={() => navigate("/doctor/alerts")}
                        className="stat-card cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                        style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", borderColor: "#fde68a" }}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label text-amber-800">Acknowledged</div>
                                <div className="stat-card__value text-amber-950">{acknowledgedCount}</div>
                                <div className="stat-card__meta text-amber-700">Under clinical review</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(245, 158, 11, 0.18)" }}>
                                <AlertTriangle size={22} className="text-amber-800" />
                            </div>
                        </div>
                    </div>

                    {/* Resolved Alerts */}
                    <div
                        onClick={() => navigate("/doctor/alerts")}
                        className="stat-card cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                        style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", borderColor: "#a7f3d0" }}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label text-emerald-800">Resolved</div>
                                <div className="stat-card__value text-emerald-950">{resolvedCount}</div>
                                <div className="stat-card__meta text-emerald-700">Cleared cases</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(16, 185, 129, 0.18)" }}>
                                <CheckCircle2 size={22} className="text-emerald-700" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RECENT CRITICAL ALERTS SECTION */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        padding: "26px 30px",
                        background: "#ffffff",
                        borderRadius: "24px",
                        border: "1.5px solid #e2e8f0",
                        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
                    }}
                    className="w-full space-y-6"
                >
                    {/* Header bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 leading-tight">Recent Critical Alerts</h2>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">Real-time alerts triggered by patient biometrics</p>
                            </div>
                        </div>

                        <Link
                            to="/doctor/alerts"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                        >
                            <span>View All Alerts</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Table Container */}
                    {alerts.length === 0 ? (
                        <div className="py-12 text-center bg-slate-50/80 rounded-2xl border border-slate-200/80">
                            <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
                            <h3 className="text-base font-bold text-slate-900">All Patient Systems Normal</h3>
                            <p className="text-xs text-slate-500 mt-1">No active critical alerts detected for your assigned patients.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-2xs bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/90 border-b border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                                        <th style={{ padding: "14px 20px" }}>Patient ID</th>
                                        <th style={{ padding: "14px 20px" }}>Alert Details</th>
                                        <th style={{ padding: "14px 20px" }}>Severity</th>
                                        <th style={{ padding: "14px 20px" }}>Status</th>
                                        <th style={{ padding: "14px 20px" }} className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {alerts.slice(0, 5).map((alert) => (
                                        <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td style={{ padding: "16px 20px" }} className="font-mono font-bold text-slate-900">
                                                <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                                                    {alert.patientId}
                                                </span>
                                            </td>

                                            <td style={{ padding: "16px 20px" }} className="font-semibold text-slate-800">
                                                {alert.message}
                                            </td>

                                            <td style={{ padding: "16px 20px" }}>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-2xs ${
                                                        alert.severity === "CRITICAL"
                                                            ? "bg-rose-50 text-rose-700 border-rose-200"
                                                            : "bg-amber-50 text-amber-800 border-amber-200"
                                                    }`}
                                                >
                                                    <span className={`h-2 w-2 rounded-full ${alert.severity === "CRITICAL" ? "bg-rose-500 animate-pulse" : "bg-amber-500"}`} />
                                                    {alert.severity}
                                                </span>
                                            </td>

                                            <td style={{ padding: "16px 20px" }}>
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${
                                                        alert.status === "NEW"
                                                            ? "bg-rose-100 text-rose-800 border-rose-200"
                                                            : alert.status === "ACKNOWLEDGED"
                                                            ? "bg-amber-100 text-amber-800 border-amber-200"
                                                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                                                    }`}
                                                >
                                                    {alert.status}
                                                </span>
                                            </td>

                                            <td style={{ padding: "16px 20px" }} className="text-center">
                                                <button
                                                    onClick={() => navigate(`/doctor/patient360/${alert.patientId}`)}
                                                    style={{
                                                        padding: "8px 16px",
                                                        borderRadius: "12px",
                                                        background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                                                        color: "#ffffff"
                                                    }}
                                                    className="font-bold text-xs shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <Eye size={15} className="text-white shrink-0" />
                                                    <span>View Chart</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </DoctorLayout>
    );
}

export default Dashboard;
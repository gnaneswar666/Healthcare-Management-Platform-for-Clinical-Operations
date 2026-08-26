import { useEffect, useState } from "react";
import PatientLayout from "../../components/patient/PatientLayout";
import { getPatientAlerts } from "../../services/alertService";
import {
    AlertTriangle,
    CheckCircle2,
    Search,
    Eye,
    Clock,
    ShieldAlert
} from "lucide-react";

function Alerts({ keycloak }) {
    const [alerts, setAlerts] = useState([]);
    const [search, setSearch] = useState("");

    async function loadAlerts() {
        try {
            const patientId = keycloak?.tokenParsed?.patientId;
            if (!patientId) return;
            const res = await getPatientAlerts(patientId);
            setAlerts(res.data || []);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadAlerts();
        const interval = setInterval(loadAlerts, 5000);
        return () => clearInterval(interval);
    }, []);

    const filtered = alerts.filter(a =>
        a.message?.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = alerts.filter(a => a.active || a.status === "NEW").length;
    const acknowledgedCount = alerts.filter(a => a.status === "ACKNOWLEDGED").length;
    const resolvedCount = alerts.filter(a => a.status === "RESOLVED").length;

    const renderStatusBadge = (status) => {
        const raw = String(status || "").toUpperCase();
        if (raw === "NEW" || raw === "PENDING" || raw === "ACTIVE") {
            return (
                <span className="badge badge--danger inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-[6px]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                    </span>
                    Pending Doctor Review
                </span>
            );
        }
        if (raw === "ACKNOWLEDGED") {
            return (
                <span className="badge badge--warning inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-[6px]">
                    <Eye size={13} className="text-amber-600 shrink-0" />
                    Acknowledged by Care Team
                </span>
            );
        }
        return (
            <span className="badge badge--success inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-[6px]">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                Resolved & Action Completed
            </span>
        );
    };

    return (
        <PatientLayout keycloak={keycloak}>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--rose">
                            <AlertTriangle size={14} />
                            Health Alerts
                        </div>
                        <h1 className="page-title">My Health Alerts</h1>
                        <p className="page-subtitle">
                            Monitor health notifications generated from your latest clinical telemetry and AI risk assessments.
                        </p>
                    </div>
                </div>

                <div className="grid-section md:grid-cols-3 mb-6">
                    <div className="stat-card stat-card--brand">
                        <div className="stat-card__label">Total Health Alerts</div>
                        <div className="stat-card__value">{alerts.length}</div>
                    </div>
                    <div className="stat-card stat-card--rose">
                        <div className="stat-card__label">Pending Review</div>
                        <div className="stat-card__value">{activeCount}</div>
                    </div>
                    <div className="stat-card stat-card--emerald">
                        <div className="stat-card__label">Resolved / Reviewed</div>
                        <div className="stat-card__value">{acknowledgedCount + resolvedCount}</div>
                    </div>
                </div>

                <div className="relative mb-6">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                        className="input pl-11"
                        placeholder="Search alerts by clinical message..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Clinical Message</th>
                                <th>Severity Level</th>
                                <th>Care Review Status</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((alert) => (
                                <tr key={alert.id}>
                                    <td className="font-semibold text-slate-800">{alert.message}</td>
                                    <td>
                                        <span className={`badge ${
                                            alert.severity === "CRITICAL"
                                                ? "badge--danger"
                                                : "badge--warning"
                                        } rounded-[6px] font-extrabold`}>
                                            {alert.severity === "CRITICAL" && <ShieldAlert size={12} />}
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td>
                                        {renderStatusBadge(alert.status)}
                                    </td>
                                    <td className="text-slate-500 text-xs font-medium">
                                        <span className="flex items-center gap-1">
                                            <Clock size={13} className="text-slate-400 shrink-0" />
                                            {new Date(alert.createdAt).toLocaleString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="data-table__empty">
                                        <div className="py-8 flex flex-col items-center gap-2">
                                            <CheckCircle2 size={32} className="text-emerald-500" />
                                            <span className="font-bold text-slate-700">No alerts found</span>
                                            <span className="text-xs text-slate-400">All health metrics are operating within normal parameters.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PatientLayout>
    );
}

export default Alerts;
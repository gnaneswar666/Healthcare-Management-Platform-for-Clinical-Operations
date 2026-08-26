import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllAlerts, acknowledgeAlert } from "../../services/alertService";
import {
    AlertTriangle,
    ShieldCheck,
    CheckCircle2,
    Search,
    Eye
} from "lucide-react";

function Alerts() {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [search, setSearch] = useState("");

    async function loadAlerts() {
        try {
            const res = await getAllAlerts();
            setAlerts(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadAlerts();
        const interval = setInterval(loadAlerts, 5000);
        return () => clearInterval(interval);
    }, []);

    async function acknowledge(id) {
        await acknowledgeAlert(id);
        loadAlerts();
    }

    const filtered = alerts.filter(a =>
        (a.patientId || "").toLowerCase().includes(search.toLowerCase()) ||
        (a.message || "").toLowerCase().includes(search.toLowerCase())
    );

    const total = alerts.length;
    const active = alerts.filter(a => a.active).length;
    const acknowledged = alerts.filter(a => a.status === "ACKNOWLEDGED").length;
    const resolved = alerts.filter(a => a.status === "RESOLVED").length;

    return (
        <AdminLayout>
            <div className="page-card">
                <div className="page-header">
                    <div>
                        <div className="page-status-chip page-status-chip--rose">
                            <AlertTriangle size={14}/>
                            Alert Monitoring
                        </div>
                        <h1 className="page-title">
                            System Alerts
                        </h1>
                    </div>
                </div>

                <div className="grid-section md:grid-cols-4 mb-6">
                    <div className="stat-card stat-card--brand">
                        <div className="stat-card__label">Total Alerts</div>
                        <div className="stat-card__value">{total}</div>
                    </div>
                    <div className="stat-card stat-card--rose">
                        <div className="stat-card__label">Active</div>
                        <div className="stat-card__value">{active}</div>
                    </div>
                    <div className="stat-card stat-card--amber">
                        <div className="stat-card__label">Acknowledged</div>
                        <div className="stat-card__value">{acknowledged}</div>
                    </div>
                    <div className="stat-card stat-card--emerald">
                        <div className="stat-card__label">Resolved</div>
                        <div className="stat-card__value">{resolved}</div>
                    </div>
                </div>

                <div className="relative mb-6 w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                        <Search size={19} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Patient ID or message..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        style={{ paddingLeft: "3.1rem", paddingTop: "12px", paddingBottom: "12px" }}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 pr-10 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-2xs"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg p-1 transition-all cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Message</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(alert=>(
                                <tr key={alert.id}>
                                    <td className="font-mono font-bold text-slate-900">{alert.patientId}</td>
                                    <td>{alert.doctorId || "DOC101"}</td>
                                    <td>{alert.message}</td>
                                    <td>
                                        <span className={`badge ${alert.severity==="CRITICAL" ? "badge--danger" : "badge--warning"}`}>
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${alert.status==="NEW" ? "badge--danger" : alert.status==="ACKNOWLEDGED" ? "badge--warning" : "badge--success"}`}>
                                            {alert.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/patient/${alert.patientId}`)}
                                                style={{ background: "#2563eb", color: "#ffffff" }}
                                                className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                                            >
                                                <Eye size={14} />
                                                <span>View Patient</span>
                                            </button>

                                            {alert.status === "NEW" ? (
                                                <button
                                                    onClick={() => acknowledge(alert.id)}
                                                    className="btn btn--success btn--sm flex items-center gap-1 cursor-pointer"
                                                >
                                                    <ShieldCheck size={14} />
                                                    <span>Acknowledge</span>
                                                </button>
                                            ) : alert.status === "ACKNOWLEDGED" ? (
                                                <span className="badge badge--warning">Waiting</span>
                                            ) : (
                                                <span className="badge badge--success">
                                                    <CheckCircle2 size={13} />
                                                    Resolved
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Alerts;
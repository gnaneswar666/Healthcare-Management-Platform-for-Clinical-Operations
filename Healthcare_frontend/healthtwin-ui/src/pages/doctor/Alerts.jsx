import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Eye, Search, X } from "lucide-react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import {
    getDoctorAlerts,
    acknowledgeAlert
} from "../../services/alertService";
import { useNavigate } from "react-router-dom";

function Alerts({ keycloak }) {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [search, setSearch] = useState("");

    async function loadAlerts() {
        try {
            const doctorId = keycloak.tokenParsed.doctorId;
            const res = await getDoctorAlerts(doctorId);
            setAlerts(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function acknowledge(id) {
        try {
            await acknowledgeAlert(id);
            loadAlerts();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadAlerts();
        const interval = setInterval(loadAlerts, 15000);
        return () => clearInterval(interval);
    }, []);

    const filteredAlerts = alerts.filter(a =>
        (a.patientId || "").toLowerCase().includes(search.toLowerCase()) ||
        (a.message || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DoctorLayout keycloak={keycloak}>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--rose">
                            <AlertTriangle size={14} />
                            Alert Monitoring
                        </div>
                        <h1 className="page-title">
                            Critical Alerts
                        </h1>
                        <p className="page-subtitle">
                            Monitor and acknowledge alerts generated from your assigned patients.
                        </p>
                    </div>
                </div>

                <div className="grid-section md:grid-cols-4 mb-6">
                    <div className="stat-card stat-card--brand">
                        <div className="stat-card__label">Total Alerts</div>
                        <div className="stat-card__value">{alerts.length}</div>
                    </div>
                    <div className="stat-card stat-card--rose">
                        <div className="stat-card__label">Active</div>
                        <div className="stat-card__value">{alerts.filter(a=>a.active).length}</div>
                    </div>
                    <div className="stat-card stat-card--amber">
                        <div className="stat-card__label">Acknowledged</div>
                        <div className="stat-card__value">{alerts.filter(a=>a.status==="ACKNOWLEDGED").length}</div>
                    </div>
                    <div className="stat-card stat-card--emerald">
                        <div className="stat-card__label">Resolved</div>
                        <div className="stat-card__value">{alerts.filter(a=>a.status==="RESOLVED").length}</div>
                    </div>
                </div>

                {/* SEARCH INPUT WITH BLENDED ICON */}
                <div className="relative mb-6 w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                        <Search size={19} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Patient ID or alert message..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                                <th>Message</th>
                                <th className="text-center">Severity</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Created</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.map(alert => (

                    <tr key={alert.id}>

                        <td className="font-mono text-slate-600">

                            {alert.patientId}

                        </td>

                        <td>

                            <div className="font-medium">

                                {alert.message}

                            </div>

                        </td>

                        <td className="text-center">

                            <span
                                className={`badge ${
                                    alert.severity==="CRITICAL"
                                        ? "badge--danger"
                                        : "badge--warning"
                                }`}
                            >

                                {alert.severity}

                            </span>

                        </td>

                        <td className="text-center">

                            <span
                                className={`badge ${
                                    alert.status==="NEW"
                                        ? "badge--danger"
                                        : alert.status==="ACKNOWLEDGED"
                                        ? "badge--warning"
                                        : "badge--success"
                                }`}
                            >

                                {alert.status}

                            </span>

                        </td>

                        <td className="text-center text-slate-500 text-sm">

                            {new Date(alert.createdAt)
                                .toLocaleString()}

                        </td>

                        <td className="text-center">

    <div className="flex justify-center items-center gap-3 min-w-[250px]">

        <button
            onClick={() =>
                navigate(`/doctor/patient360/${alert.patientId}`)
            }
            className="btn btn--primary btn--sm w-28 justify-center"
        >
            <Eye size={15} />
            View
        </button>

        {
            alert.status === "NEW" ? (

                <button
                    onClick={() => acknowledge(alert.id)}
                    className="btn btn--success btn--sm w-40 justify-center"
                >
                    <CheckCircle size={15} />
                    Acknowledge
                </button>

            ) : alert.status === "ACKNOWLEDGED" ? (

                <div className="w-40 flex justify-center">
                    <span className="badge badge--warning">
                        Acknowledged
                    </span>
                </div>

            ) : (

                <div className="w-40 flex justify-center">
                    <span className="badge badge--success">
                        Resolved
                    </span>
                </div>

            )
        }

    </div>

</td>
                    </tr>

                ))

            }

            {

                alerts.length===0 &&

                <tr>

                    <td
                        colSpan={6}
                        className="data-table__empty"
                    >

                        No alerts available.

                    </td>

                </tr>

            }

            </tbody>

        </table>

    </div>

</div>

        </DoctorLayout>
    );

}

export default Alerts;
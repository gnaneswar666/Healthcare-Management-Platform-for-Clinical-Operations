import { useEffect, useState } from "react";
import {
    AlertTriangle,
    Activity,
    Search,
    RefreshCw,
    ShieldCheck,
    UserRound,
    X
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import { getHealthTwins } from "../../services/healthTwinService";
import { getAnomaly } from "../../services/anomalyService";

function AdminAnomaly({ keycloak }) {

    const [patients, setPatients] = useState([]);
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadAnomalies() {

        try {

            setLoading(true);

            const twinRes = await getHealthTwins();

            const twins = twinRes.data || [];

            setPatients(twins);

            const anomalyResults = await Promise.all(

                twins.map(async (twin) => {

                    try {

                        const res = await getAnomaly(twin.patientId);

                        return {
                            ...res.data,
                            patientId: twin.patientId
                        };

                    } catch (err) {

                        console.log(
                            `Anomaly failed for ${twin.patientId}`,
                            err
                        );

                        return {
                            patientId: twin.patientId,
                            anomalyDetected: false,
                            anomalyScore: 0,
                            severity: "NORMAL",
                            message: "Unable to calculate anomaly"
                        };

                    }

                })

            );

            setResults(anomalyResults);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadAnomalies();

        const interval = setInterval(
            loadAnomalies,
            15000
        );

        return () => clearInterval(interval);

    }, []);

    const filteredResults = results.filter((item) =>
        item.patientId
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const criticalCount = results.filter(
        r => r.severity === "CRITICAL"
    ).length;

    const warningCount = results.filter(
        r => r.severity === "WARNING"
    ).length;

    const normalCount = results.filter(
        r =>
            r.severity === "NORMAL" ||
            r.anomalyDetected === false
    ).length;

    return (
        <AdminLayout keycloak={keycloak}>

            <div className="page-card">

                {/* HEADER */}

                <div className="page-header">

                    <div className="page-header__info">

                        <div className="page-status-chip page-status-chip--brand">

                            <Activity size={14} />

                            AI Monitoring

                        </div>

                        <h1 className="page-title">

                            AI Anomaly Detection

                        </h1>

                        <p className="page-subtitle">

                            Detect unusual health patterns from
                            the latest HealthTwin vital readings.

                        </p>

                    </div>

                    <button
                        onClick={loadAnomalies}
                        className="btn btn--ghost btn--sm"
                    >

                        <RefreshCw size={15} />

                        Refresh

                    </button>

                </div>


                {/* SUMMARY */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                    <SummaryCard
                        icon={<ShieldCheck size={20} />}
                        title="Normal"
                        value={normalCount}
                        description="No anomaly detected"
                        type="normal"
                    />

                    <SummaryCard
                        icon={<AlertTriangle size={20} />}
                        title="Warning"
                        value={warningCount}
                        description="Needs attention"
                        type="warning"
                    />

                    <SummaryCard
                        icon={<AlertTriangle size={20} />}
                        title="Critical"
                        value={criticalCount}
                        description="Immediate attention"
                        type="critical"
                    />

                </div>


                {/* SEARCH */}

                <div className="flex items-center justify-between gap-4 mb-5">

                    <div className="relative w-full max-w-md">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                            <Search size={19} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search patient by ID or anomaly..."
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

                    <div className="page-meta">

                        <UserRound size={15} />

                        {filteredResults.length} Patients

                    </div>

                </div>


                {/* TABLE */}

                <div className="data-table-wrap">

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>Patient</th>

                                <th className="text-center">
                                    Anomaly
                                </th>

                                <th className="text-center">
                                    Score
                                </th>

                                <th className="text-center">
                                    Severity
                                </th>

                                <th>
                                    Analysis
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="data-table__empty"
                                    >

                                        <div className="flex justify-center items-center gap-2">

                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />

                                            Analysing HealthTwin data...

                                        </div>

                                    </td>

                                </tr>

                            ) : filteredResults.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className="data-table__empty"
                                    >

                                        No patients found.

                                    </td>

                                </tr>

                            ) : (

                                filteredResults.map((result) => (

                                    <tr key={result.patientId}>

                                        {/* PATIENT */}

                                        <td>

                                            <div className="flex items-center gap-3">

                                                <div className="avatar avatar--sm">

                                                    {result.patientId
                                                        ?.slice(-2)}

                                                </div>

                                                <div>

                                                    <div className="font-semibold text-slate-800">

                                                        {result.patientId}

                                                    </div>

                                                    <div className="text-xs text-slate-500">

                                                        HealthTwin monitoring

                                                    </div>

                                                </div>

                                            </div>

                                        </td>


                                        {/* DETECTED */}

                                        <td className="text-center">

                                            {result.anomalyDetected ? (

                                                <span className="badge badge--warning">

                                                    Detected

                                                </span>

                                            ) : (

                                                <span className="badge badge--success">

                                                    Normal

                                                </span>

                                            )}

                                        </td>


                                        {/* SCORE */}

                                        <td className="text-center">

                                            <span className="font-semibold text-slate-800">

                                                {result.anomalyScore ?? 0}

                                            </span>

                                        </td>


                                        {/* SEVERITY */}

                                        <td className="text-center">

                                            <SeverityBadge
                                                severity={
                                                    result.severity
                                                }
                                            />

                                        </td>


                                        {/* MESSAGE */}

                                        <td>

                                            <div className="text-sm text-slate-600 max-w-md">

                                                {result.message ||
                                                    "No abnormal pattern detected."}

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </AdminLayout>
    );
}


/* ================================
   SUMMARY CARD
================================ */

function SummaryCard({ icon, title, value, description, type }) {
  const styles = {
    normal: {
      wrapper: "border-emerald-100 bg-emerald-50/50",
      icon: "bg-emerald-100 text-emerald-600"
    },
    warning: {
      wrapper: "border-amber-100 bg-amber-50/50",
      icon: "bg-amber-100 text-amber-600"
    },
    critical: {
      wrapper: "border-rose-100 bg-rose-50/50",
      icon: "bg-rose-100 text-rose-600"
    }
  };

  const style = styles[type];

  return (
    <div className={`rounded-2xl border p-5 ${style.wrapper}`}>
      <div className="flex items-center gap-4">
        {/* Icon neatly aligned on the left */}
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${style.icon}`}
        >
          {icon}
        </div>

        {/* Text block aligned naturally */}
        <div className="flex flex-col">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}


/* ================================
   SEVERITY BADGE
================================ */

function SeverityBadge({ severity }) {

    if (severity === "CRITICAL") {

        return (
            <span className="badge badge--danger badge--dot">
                Critical
            </span>
        );

    }

    if (severity === "WARNING") {

        return (
            <span className="badge badge--warning badge--dot">
                Warning
            </span>
        );

    }

    return (
        <span className="badge badge--success badge--dot">
            Normal
        </span>
    );
}
export default AdminAnomaly;
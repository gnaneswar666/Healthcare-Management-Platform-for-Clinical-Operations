import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Search,
    RefreshCw,
    KeyRound,
    UserCheck,
    CheckCircle2,
    Clock,
    User,
    Mail,
    Server,
    Trash2,
    Database,
    Filter
} from "lucide-react";
import { getAuditLogs, clearAuditLogs } from "../../services/auditService";

function KeycloakAuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    async function fetchLogs() {
        setLoading(true);
        try {
            const data = await getAuditLogs();
            setLogs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load Keycloak audit logs:", err);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLogs();
    }, []);

    function handleClear() {
        if (window.confirm("Are you sure you want to clear all stored Keycloak registration audit logs?")) {
            clearAuditLogs();
            setLogs([]);
        }
    }

    const filteredLogs = logs.filter(log => {
        const query = search.toLowerCase();
        const matchesSearch =
            (log.patientId && log.patientId.toLowerCase().includes(query)) ||
            (log.email && log.email.toLowerCase().includes(query)) ||
            (log.registeredBy && log.registeredBy.toLowerCase().includes(query)) ||
            (log.details && log.details.toLowerCase().includes(query));

        const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Header Banner */}
            <div className="p-6 md:p-8 bg-slate-900 text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                        <KeyRound size={22} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-1">
                            <Server size={12} />
                            <span>Keycloak Identity Provider Service</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            Patient Login Registration Audit Logs
                        </h2>
                        <p className="text-xs md:text-sm text-slate-300 font-medium">
                            Real-time microservice activity log for patient Keycloak account creation & credential generation
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchLogs}
                        className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                        title="Refresh Logs"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin text-cyan-400" : "text-cyan-400"} />
                        <span>Refresh</span>
                    </button>

                    {logs.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                            title="Clear Logs"
                        >
                            <Trash2 size={14} />
                            <span>Clear</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Patient ID, email, admin..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 transition-all shadow-xs"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Filter size={14} className="text-slate-400" />
                        <span>Status:</span>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-300 text-xs font-semibold text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-600 cursor-pointer shadow-xs"
                    >
                        <option value="ALL">All Statuses ({logs.length})</option>
                        <option value="SUCCESS">Success</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>
            </div>

            {/* Logs Table / List */}
            {loading ? (
                <div className="py-16 text-center text-slate-500 text-xs font-semibold flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={24} className="animate-spin text-cyan-600" />
                    <span>Fetching Keycloak registration audit logs...</span>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs font-semibold flex flex-col items-center justify-center gap-2">
                    <Database size={32} className="text-slate-300" />
                    <span>No Keycloak registration logs match your criteria.</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                <th className="py-3.5 px-5">Log ID / Event</th>
                                <th className="py-3.5 px-5">Patient Details</th>
                                <th className="py-3.5 px-5">Keycloak Realm</th>
                                <th className="py-3.5 px-5">Registered By</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            <AnimatePresence>
                                {filteredLogs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-cyan-50/40 transition-colors"
                                    >
                                        {/* Log ID & Event */}
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                                                    <ShieldCheck size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-slate-900 font-mono text-[11px]">
                                                        {log.id}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                                                        {log.eventType || "KEYCLOAK_CREATE"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Patient Details */}
                                        <td className="py-4 px-5">
                                            <div>
                                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                    <User size={13} className="text-cyan-600" />
                                                    <span>{log.patientId}</span>
                                                </div>
                                                {log.email && (
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                                                        <Mail size={12} className="text-slate-400" />
                                                        <span>{log.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Keycloak Realm */}
                                        <td className="py-4 px-5">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] font-semibold">
                                                <Server size={12} className="text-indigo-600" />
                                                <span>{log.keycloakRealm || "healthcare-realm"}</span>
                                            </div>
                                        </td>

                                        {/* Registered By */}
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                                                <UserCheck size={14} className="text-emerald-600" />
                                                <span>{log.registeredBy || "Admin"}</span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-5">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                <CheckCircle2 size={12} />
                                                <span>{log.status || "SUCCESS"}</span>
                                            </span>
                                        </td>

                                        {/* Timestamp */}
                                        <td className="py-4 px-5 text-slate-500 font-medium text-[11px]">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-slate-400" />
                                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default KeycloakAuditLogs;

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import PatientCard from "../../components/doctor/PatientCard";
import {
    HeartPulse,
    Search,
    X,
    Users,
    Activity,
    AlertTriangle,
    RefreshCw,
    Clock,
    RotateCcw,
    ShieldAlert,
    UserCheck,
    Filter
} from "lucide-react";

import { getHealthTwins } from "../../services/HealthTwinService";
import { getAssignedPatients } from "../../services/assignmentService";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

function HealthTwins({ keycloak }) {
    const [healthTwins, setHealthTwins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const navigate = useNavigate();

    const loadHealthTwins = useCallback(async () => {
        try {
            const doctorId = keycloak.tokenParsed?.doctorId;

            // Assigned patients
            const patientRes = await getAssignedPatients(doctorId);
            const assignedIds = patientRes.data.map((p) => p.patientId);

            // All Health Twins
            const twinRes = await getHealthTwins();

            // Keep only assigned patients and merge patient identity
            const filtered = (twinRes.data || [])
                .filter((twin) => assignedIds.includes(twin.patientId))
                .map((twin) => {
                    const patient = patientRes.data.find(
                        (p) => p.patientId === twin.patientId
                    );
                    return { ...twin, patient };
                });

            setHealthTwins(filtered);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Failed to load Health Twins", err);
        } finally {
            setLoading(false);
        }
    }, [keycloak]);

    useEffect(() => {
        const initial = setTimeout(() => {
            loadHealthTwins();
        }, 0);
        const interval = setInterval(() => {
            loadHealthTwins();
        }, 15000);
        return () => {
            clearTimeout(initial);
            clearInterval(interval);
        };
    }, [loadHealthTwins]);

    const calculateRiskScore = (twin) => {
        if (!twin) return 0;

        // 1. Check explicit backend risk properties if available and > 0
        if (twin.riskScore != null && Number(twin.riskScore) > 0) return Math.round(Number(twin.riskScore));
        if (twin.predictionRisk != null && Number(twin.predictionRisk) > 0) return Math.round(Number(twin.predictionRisk));
        if (twin.risk != null && Number(twin.risk) > 0) return Math.round(Number(twin.risk));

        // 2. Dynamic Clinical Risk Calculation based on live vitals
        let score = 0;

        const hr = Number(twin.heartRate) || 0;
        if (hr > 0 && (hr < 60 || hr > 100)) score += 20;

        const o2 = Number(twin.oxygenLevel) || 0;
        if (o2 > 0 && o2 < 95) score += 25;

        const temp = Number(twin.temperature) || 0;
        if (temp >= 37.8) score += 20;

        if (twin.bloodPressure && typeof twin.bloodPressure === "string") {
            const parts = twin.bloodPressure.split("/").map(s => Number(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                const [sys, dia] = parts;
                if (sys >= 140 || dia >= 90) score += 20;
                else if (sys < 90 || dia < 60) score += 15;
            }
        }

        const h = Number(twin.height) || 0;
        const w = Number(twin.weight) || 0;
        if (h > 0 && w > 0) {
            const bmi = w / Math.pow(h / 100, 2);
            if (bmi >= 30 || bmi < 18.5) score += 15;
        }

        if (twin.chronicDiseases) {
            const hasDiseases = Array.isArray(twin.chronicDiseases)
                ? twin.chronicDiseases.length > 0
                : typeof twin.chronicDiseases === "string" && twin.chronicDiseases.trim().length > 0;
            if (hasDiseases) score += 20;
        }

        return Math.min(score, 100);
    };

    const getStatus = (risk) => {
        if (risk < 30) return "Healthy";
        if (risk < 70) return "Warning";
        return "Critical";
    };

    const healthyCount = healthTwins.filter((t) => calculateRiskScore(t) < 30).length;
    const warningCount = healthTwins.filter((t) => {
        const risk = calculateRiskScore(t);
        return risk >= 30 && risk < 70;
    }).length;
    const criticalCount = healthTwins.filter((t) => calculateRiskScore(t) >= 70).length;

    const filteredTwins = useMemo(() => {
        const q = search.toLowerCase().trim();
        return healthTwins.filter((twin) => {
            const risk = calculateRiskScore(twin);
            const status = getStatus(risk);

            if (statusFilter !== "ALL" && status.toUpperCase() !== statusFilter) {
                return false;
            }

            if (!q) return true;

            const name = `${twin.patient?.firstName || ""} ${twin.patient?.lastName || ""}`.toLowerCase();
            return (
                twin.patientId?.toLowerCase().includes(q) ||
                name.includes(q) ||
                (twin.bloodGroup || "").toLowerCase().includes(q)
            );
        });
    }, [healthTwins, search, statusFilter]);

    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const calculateBMI = (twin) => {
        if (!twin.height || !twin.weight) return null;
        const h = twin.height / 100;
        if (!h) return null;
        return (twin.weight / (h * h)).toFixed(1);
    };

    return (
        <DoctorLayout keycloak={keycloak}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Page Header */}
                <motion.div variants={itemVariants} className="page-card">
                    <div className="page-header">
                        <div className="page-header__info">
                            <div className="page-status-chip page-status-chip--brand">
                                <HeartPulse size={14} /> Digital Twin Monitoring
                            </div>
                            <h1 className="page-title">Health Twins</h1>
                            <p className="page-subtitle">Real-time monitoring of your assigned patients' digital twins — track vital signs, risk scores, and health status at a glance.</p>
                        </div>
                        <div className="page-header__actions">
                            <div className="page-meta">
                                <Clock size={15} />
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </div>
                            <button
                                onClick={loadHealthTwins}
                                className="btn btn--soft cursor-pointer"
                            >
                                <RefreshCw size={16} /> Refresh
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        onClick={() => setStatusFilter("ALL")}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`stat-card cursor-pointer transition-all ${statusFilter === "ALL" ? "ring-2 ring-blue-500 shadow-md" : ""}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Total Twins</div>
                                <div className="stat-card__value">{healthTwins.length}</div>
                                <div className="stat-card__meta">Monitored patients</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(59, 130, 246, 0.12)" }}>
                                <Users size={22} className="text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        onClick={() => setStatusFilter("HEALTHY")}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`stat-card cursor-pointer transition-all ${statusFilter === "HEALTHY" ? "ring-2 ring-emerald-500 shadow-md" : ""}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Healthy</div>
                                <div className="stat-card__value text-emerald-600">{healthyCount}</div>
                                <div className="stat-card__meta">Low risk patients</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                                <Activity size={22} className="text-emerald-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        onClick={() => setStatusFilter("WARNING")}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`stat-card cursor-pointer transition-all ${statusFilter === "WARNING" ? "ring-2 ring-amber-500 shadow-md" : ""}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Warning</div>
                                <div className="stat-card__value text-amber-500">{warningCount}</div>
                                <div className="stat-card__meta">Moderate risk</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(245, 158, 11, 0.12)" }}>
                                <AlertTriangle size={22} className="text-amber-500" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        onClick={() => setStatusFilter("CRITICAL")}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`stat-card cursor-pointer transition-all ${statusFilter === "CRITICAL" ? "ring-2 ring-red-500 shadow-md" : ""}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Critical</div>
                                <div className="stat-card__value text-red-600">{criticalCount}</div>
                                <div className="stat-card__meta">High risk patients</div>
                            </div>
                            <div className="stat-card__icon" style={{ background: "rgba(239, 68, 68, 0.12)" }}>
                                <HeartPulse size={22} className="text-red-500" />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* ADVANCED SEARCH & FILTER TOOLBAR */}
                <motion.div
                    variants={itemVariants}
                    style={{
                        padding: "26px 30px",
                        background: "#ffffff",
                        borderRadius: "24px",
                        border: "1.5px solid #e2e8f0",
                        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
                    }}
                    className="w-full space-y-5"
                >
                    {/* Row 1: Search Input */}
                    <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                            <Search size={20} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search patient by Name, Patient ID, or Blood Group (e.g. Sasi, P201, O+)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "3.25rem", paddingTop: "14px", paddingBottom: "14px" }}
                            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 pr-12 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-2xs"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-xl p-1.5 transition-all cursor-pointer"
                                title="Clear search text"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Row 2: Filter Segmented Bar & Actions */}
                    <div style={{ paddingTop: "16px", borderTop: "1.5px solid #f1f5f9" }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Segmented Filter Control Bar */}
                        <div style={{ padding: "6px", background: "#f1f5f9", borderRadius: "16px", border: "1px solid #e2e8f0" }} className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1">
                                <Filter size={13} /> Filter
                            </span>

                            {/* All Twins */}
                            <button
                                onClick={() => setStatusFilter("ALL")}
                                style={{
                                    background: statusFilter === "ALL" ? "#0f172a" : "transparent",
                                    color: statusFilter === "ALL" ? "#ffffff" : "#475569",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: statusFilter === "ALL" ? "700" : "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    boxShadow: statusFilter === "ALL" ? "0 2px 8px rgba(15, 23, 42, 0.2)" : "none"
                                }}
                            >
                                <Users size={14} />
                                <span>All Twins</span>
                                <span
                                    style={{
                                        background: statusFilter === "ALL" ? "rgba(255,255,255,0.2)" : "#cbd5e1",
                                        color: statusFilter === "ALL" ? "#ffffff" : "#334155",
                                        padding: "2px 7px",
                                        borderRadius: "8px",
                                        fontSize: "11px",
                                        fontWeight: "800"
                                    }}
                                >
                                    {healthTwins.length}
                                </span>
                            </button>

                            {/* Critical */}
                            <button
                                onClick={() => setStatusFilter("CRITICAL")}
                                style={{
                                    background: statusFilter === "CRITICAL" ? "#dc2626" : "transparent",
                                    color: statusFilter === "CRITICAL" ? "#ffffff" : "#991b1b",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: statusFilter === "CRITICAL" ? "700" : "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    boxShadow: statusFilter === "CRITICAL" ? "0 2px 8px rgba(220, 38, 38, 0.25)" : "none"
                                }}
                            >
                                <ShieldAlert size={14} />
                                <span>Critical</span>
                                <span
                                    style={{
                                        background: statusFilter === "CRITICAL" ? "rgba(255,255,255,0.25)" : "#fca5a5",
                                        color: statusFilter === "CRITICAL" ? "#ffffff" : "#7f1d1d",
                                        padding: "2px 7px",
                                        borderRadius: "8px",
                                        fontSize: "11px",
                                        fontWeight: "800"
                                    }}
                                >
                                    {criticalCount}
                                </span>
                            </button>

                            {/* Warning */}
                            <button
                                onClick={() => setStatusFilter("WARNING")}
                                style={{
                                    background: statusFilter === "WARNING" ? "#d97706" : "transparent",
                                    color: statusFilter === "WARNING" ? "#ffffff" : "#92400e",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: statusFilter === "WARNING" ? "700" : "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    boxShadow: statusFilter === "WARNING" ? "0 2px 8px rgba(217, 119, 6, 0.25)" : "none"
                                }}
                            >
                                <AlertTriangle size={14} />
                                <span>Warning</span>
                                <span
                                    style={{
                                        background: statusFilter === "WARNING" ? "rgba(255,255,255,0.25)" : "#fde68a",
                                        color: statusFilter === "WARNING" ? "#ffffff" : "#78350f",
                                        padding: "2px 7px",
                                        borderRadius: "8px",
                                        fontSize: "11px",
                                        fontWeight: "800"
                                    }}
                                >
                                    {warningCount}
                                </span>
                            </button>

                            {/* Healthy */}
                            <button
                                onClick={() => setStatusFilter("HEALTHY")}
                                style={{
                                    background: statusFilter === "HEALTHY" ? "#059669" : "transparent",
                                    color: statusFilter === "HEALTHY" ? "#ffffff" : "#065f46",
                                    border: "none",
                                    padding: "8px 16px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: statusFilter === "HEALTHY" ? "700" : "600",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    cursor: "pointer",
                                    boxShadow: statusFilter === "HEALTHY" ? "0 2px 8px rgba(5, 150, 105, 0.25)" : "none"
                                }}
                            >
                                <UserCheck size={14} />
                                <span>Healthy</span>
                                <span
                                    style={{
                                        background: statusFilter === "HEALTHY" ? "rgba(255,255,255,0.25)" : "#a7f3d0",
                                        color: statusFilter === "HEALTHY" ? "#ffffff" : "#044e37",
                                        padding: "2px 7px",
                                        borderRadius: "8px",
                                        fontSize: "11px",
                                        fontWeight: "800"
                                    }}
                                >
                                    {healthyCount}
                                </span>
                            </button>
                        </div>

                        {/* Reset Filters & Results Counter */}
                        <div className="flex items-center gap-3 self-end lg:self-auto">
                            {(search || statusFilter !== "ALL") && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setStatusFilter("ALL");
                                    }}
                                    style={{
                                        background: "#ffffff",
                                        color: "#0f172a",
                                        border: "1.5px solid #cbd5e1",
                                        padding: "8px 16px",
                                        borderRadius: "14px",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        cursor: "pointer"
                                    }}
                                    className="hover:bg-slate-100 transition-all shadow-2xs"
                                >
                                    <RotateCcw size={14} className="text-slate-600" />
                                    <span>Reset Filters</span>
                                </button>
                            )}

                            <span style={{ padding: "10px 16px", borderRadius: "14px", background: "#f1f5f9", border: "1px solid #e2e8f0" }} className="text-xs font-bold text-slate-700">
                                Showing <strong className="text-slate-900 font-extrabold">{filteredTwins.length}</strong> of {healthTwins.length} patients
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Loading */}
                {loading ? (
                    <motion.div variants={itemVariants} className="page-card flex items-center justify-center py-24">
                        <div className="flex flex-col items-center gap-4 text-slate-500">
                            <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
                            <span className="font-medium">Loading Health Twins...</span>
                        </div>
                    </motion.div>
                ) : filteredTwins.length === 0 ? (
                    <motion.div variants={itemVariants} className="page-card flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm border border-slate-200">
                            <HeartPulse size={40} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Health Twins Found</h3>
                        <p className="text-slate-500 max-w-md mb-4">
                            {search || statusFilter !== "ALL"
                                ? "No patient matches your current search or filter. Click 'Reset Filters' to view all assigned patients."
                                : "No health twins are currently registered for your assigned patients."}
                        </p>
                        {(search || statusFilter !== "ALL") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("ALL");
                                }}
                                className="btn btn--primary"
                            >
                                <RotateCcw size={15} /> Reset Filters
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        {filteredTwins.map((twin, index) => {
                            const risk = calculateRiskScore(twin);
                            const bmi = calculateBMI(twin);
                            const age = calculateAge(twin.patient?.dob);
                            const status = getStatus(risk);

                            return (
                                <motion.div
                                    key={twin.patientId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04 }}
                                    className="w-full flex"
                                >
                                    <PatientCard
                                        patient={{
                                            id: twin.patientId,
                                            name: `${twin.patient?.firstName || ""} ${twin.patient?.lastName || ""}`.trim(),
                                            firstName: twin.patient?.firstName,
                                            lastName: twin.patient?.lastName,
                                            gender: twin.patient?.gender,
                                            age,
                                            bloodGroup: twin.bloodGroup
                                        }}
                                        vitals={{
                                            heartRate: twin.heartRate,
                                            oxygenLevel: twin.oxygenLevel,
                                            temperature: twin.temperature,
                                            bloodPressure: twin.bloodPressure
                                        }}
                                        riskScore={risk}
                                        status={status}
                                        bmi={bmi}
                                        height={twin.height}
                                        weight={twin.weight}
                                        chronicDiseases={twin.chronicDiseases}
                                        lastUpdated={twin.lastUpdated}
                                        onViewTwin={() => navigate(`/doctor/patient360/${twin.patientId}`)}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </motion.div>
        </DoctorLayout>
    );
}

export default HealthTwins;


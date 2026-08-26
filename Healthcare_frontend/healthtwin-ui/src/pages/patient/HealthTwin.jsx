import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    Brain,
    Droplets,
    HeartPulse,
    Ruler,
    Shield,
    Weight,
    Thermometer,
    Heart,
    RefreshCw,
    Gauge,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Clock
} from "lucide-react";

import PatientLayout from "../../components/patient/PatientLayout";
import keycloak from "../../keycloak";
import { getHealthTwin } from "../../services/patient360Services";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07 }
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

function PatientHealthTwin() {
    const patientId = keycloak.tokenParsed?.patientId;
    const [healthTwin, setHealthTwin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const loadHealthTwin = useCallback(async () => {
        try {
            const response = await getHealthTwin(patientId);
            setHealthTwin(response);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to load health twin:", error);
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        const initial = setTimeout(() => {
            loadHealthTwin();
        }, 0);
        const interval = setInterval(() => {
            getHealthTwin(patientId)
                .then((response) => {
                    setHealthTwin(response);
                    setLastUpdated(new Date());
                })
                .catch((error) => console.error("Failed to load health twin:", error));
        }, 15000);
        return () => {
            clearTimeout(initial);
            clearInterval(interval);
        };
    }, [patientId, loadHealthTwin]);

    const calculateRiskScore = useCallback((twin) => {
        let score = 0;
        if (twin.heartRate < 60 || twin.heartRate > 100) score += 15;
        if (twin.temperature >= 38) score += 20;
        if (twin.oxygenLevel < 95) score += 25;
        if (twin.bloodPressure) {
            const [sys, dia] = twin.bloodPressure.split("/").map(Number);
            if (sys >= 140 || dia >= 90) score += 20;
            if (sys < 90 || dia < 60) score += 15;
        }
        if (twin.height && twin.weight) {
            const bmiVal = twin.weight / Math.pow(twin.height / 100, 2);
            if (bmiVal >= 30 || bmiVal < 18.5) score += 20;
        }
        if (twin.chronicDiseases?.length) score += 20;
        return Math.min(score, 100);
    }, []);

    const risk = useMemo(() => {
        if (!healthTwin) return 0;
        return calculateRiskScore(healthTwin);
    }, [healthTwin, calculateRiskScore]);

    const bmi = useMemo(() => {
        if (!healthTwin) return null;
        const h = healthTwin.height / 100;
        if (!h) return null;
        return (healthTwin.weight / (h * h)).toFixed(1);
    }, [healthTwin]);

    const bmiCategory = useCallback((bmiVal) => {
        const v = Number(bmiVal);
        if (v < 18.5) return "Underweight";
        if (v < 25) return "Normal";
        if (v < 30) return "Overweight";
        return "Obese";
    }, []);

    const riskLabel = risk < 30 ? "Healthy" : risk < 70 ? "Warning" : "Critical";
    const riskBadgeClass = risk < 30 ? "badge--success" : risk < 70 ? "badge--warning" : "badge--danger";
    const riskBarColor = risk < 30 ? "bg-emerald-500" : risk < 70 ? "bg-amber-500" : "bg-red-500";

    return (
        <PatientLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* ── Loading State ── */}
                {loading ? (
                    <motion.div variants={itemVariants} className="page-card flex items-center justify-center py-24">
                        <div className="flex flex-col items-center gap-4 text-slate-500">
                            <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
                            <span className="font-medium">Loading your digital twin...</span>
                        </div>
                    </motion.div>

                ) : !healthTwin ? (
                    /* ── Empty / No Health Twin ── */
                    <motion.div variants={itemVariants} className="page-card flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm border border-slate-200">
                            <Brain size={40} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Health Twin Found</h3>
                        <p className="text-slate-500 max-w-md">
                            No digital health record is currently available for your account. Please consult your healthcare provider to set up your digital twin profile.
                        </p>
                        <button className="btn btn--primary mt-6">
                            <Shield size={16} /> Contact Provider
                        </button>
                    </motion.div>

                ) : (
                    /* ── Health Twin Content ── */
                    <div className="space-y-8">
                        {/* ═══ Page Header ═══ */}
                        <motion.div variants={itemVariants} className="page-card">
                            <div className="page-header">
                                <div className="page-header__info">
                                    <div className="page-status-chip page-status-chip--brand">
                                        <Brain size={14} /> Digital Twin Dashboard
                                    </div>
                                    <h1 className="page-title">Health Twin</h1>
                                    <p className="page-subtitle">
                                        Your real-time digital health profile — anthropometrics, vital signs, risk indicators and medical record, always up to date.
                                    </p>
                                </div>
                                <div className="page-header__actions">
                                    <div className="badge badge--brand badge--dot">
                                        ID: {patientId}
                                    </div>
                                    <div className="page-meta">
                                        <RefreshCw size={15} />
                                        Auto-refresh
                                    </div>
                                    <div className="page-meta">
                                        <Clock size={15} />
                                        {lastUpdated.toLocaleTimeString()}
                                    </div>
                                    <span className={`badge badge--dot ${riskBadgeClass}`}>{riskLabel}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* ═══ Stat Cards Grid (Pure White Card Design) ═══ */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }} className="stat-card stat-card--brand">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="stat-card__label">Height</div>
                                        <div className="stat-card__value">{healthTwin.height || "—"} <span className="text-base font-medium text-slate-400">cm</span></div>
                                        <div className="stat-card__meta">Anthropometric</div>
                                    </div>
                                    <div className="stat-card__icon bg-blue-50 text-blue-600 border border-blue-100">
                                        <Ruler size={22} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }} className="stat-card stat-card--amber">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="stat-card__label">Weight</div>
                                        <div className="stat-card__value">{healthTwin.weight || "—"} <span className="text-base font-medium text-slate-400">kg</span></div>
                                        <div className="stat-card__meta">Anthropometric</div>
                                    </div>
                                    <div className="stat-card__icon bg-amber-50 text-amber-600 border border-amber-100">
                                        <Weight size={22} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }} className="stat-card stat-card--rose">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="stat-card__label">Blood Group</div>
                                        <div className="stat-card__value">{healthTwin.bloodGroup || "—"}</div>
                                        <div className="stat-card__meta">Medical record</div>
                                    </div>
                                    <div className="stat-card__icon bg-rose-50 text-rose-600 border border-rose-100">
                                        <Droplets size={22} />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }} className={`stat-card ${bmi && Number(bmi) >= 30 ? "stat-card--rose" : Number(bmi) >= 25 ? "stat-card--amber" : "stat-card--emerald"}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="stat-card__label">BMI</div>
                                        <div className="stat-card__value">{bmi || "—"}</div>
                                        <div className="stat-card__meta">
                                            {bmi ? bmiCategory(bmi) : "Body mass index"}
                                        </div>
                                    </div>
                                    <div className={`stat-card__icon ${bmi && Number(bmi) >= 30 ? "bg-rose-50 text-rose-600 border-rose-100" : Number(bmi) >= 25 ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                                        <Activity size={22} />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* ═══ Risk Overview + Vital Signs ═══ */}
                        <motion.div variants={itemVariants} className="grid-section lg:grid-cols-3">
                            {/* Risk Score Card */}
                            <div className="soft-card flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="stat-card__icon bg-amber-50 text-amber-600 border border-amber-100">
                                            <Gauge size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Risk Score</h3>
                                            <p className="text-xs text-slate-500">Aggregated health risk score</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center py-2">
                                        <div className="relative w-32 h-32 mb-4">
                                            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                                <motion.circle
                                                    cx="60" cy="60" r="54" fill="none"
                                                    stroke={risk < 30 ? "#10b981" : risk < 70 ? "#f59e0b" : "#ef4444"}
                                                    strokeWidth="8" strokeLinecap="round"
                                                    strokeDasharray={`${(risk / 100) * 339.292} 339.292`}
                                                    initial={{ strokeDasharray: "0 339.292" }}
                                                    animate={{ strokeDasharray: `${(risk / 100) * 339.292} 339.292` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <span className="text-3xl font-extrabold text-slate-900">{risk}%</span>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Risk</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${risk}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${riskBarColor}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className={`badge badge--dot ${riskBadgeClass}`}>{riskLabel}</span>
                                            <span className="text-xs font-semibold text-slate-500">Overall Status</span>
                                        </div>
                                    </div>
                                </div>

                                {healthTwin.chronicDiseases?.length > 0 && (
                                    <div className="mt-5 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-2">
                                            <AlertTriangle size={13} className="text-amber-500" />
                                            <span>{healthTwin.chronicDiseases.length} Chronic Condition(s):</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {healthTwin.chronicDiseases.map((d, i) => (
                                                <span key={i} className="badge badge--warning">{d}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Vital Signs (Fills vertical void with Clinical Targets Bar) */}
                            <div className="soft-card lg:col-span-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between gap-3 mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="stat-card__icon bg-rose-50 text-rose-600 border border-rose-100">
                                                <HeartPulse size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">Vital Signs</h3>
                                                <p className="text-xs text-slate-500">Latest physiological readings</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Vital value={healthTwin.heartRate ?? "—"} unit="bpm" label="Heart Rate" tone="rose" icon={<Heart size={14} />} />
                                        <Vital value={healthTwin.oxygenLevel ?? "—"} unit="%" label="SpO₂" tone="emerald" icon={<Droplets size={14} />} />
                                        <Vital value={healthTwin.temperature ?? "—"} unit="°C" label="Temperature" tone="amber" icon={<Thermometer size={14} />} />
                                        <Vital value={healthTwin.bloodPressure || "—"} unit="mmHg" label="Blood Pressure" tone="brand" icon={<Activity size={14} />} />
                                    </div>
                                </div>

                                {/* Clinical Guideline Ranges (Eliminates empty white void) */}
                                <div className="mt-6 pt-5 border-t border-slate-100">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 mb-3">
                                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                            <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">HR Target</span>
                                            <strong className="text-slate-800">60 - 100 bpm</strong>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                            <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">SpO₂ Target</span>
                                            <strong className="text-slate-800">95 - 100%</strong>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                            <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">Temp Target</span>
                                            <strong className="text-slate-800">36.1 - 37.2 °C</strong>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                                            <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider">BP Target</span>
                                            <strong className="text-slate-800">120/80 mmHg</strong>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <RefreshCw size={12} className="animate-spin text-blue-500" />
                                            Auto-refreshes every 15 seconds
                                        </span>
                                        <span className="font-medium text-slate-500">Normal Range Guidelines</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ═══ Risk Factors Grid ═══ */}
                        <motion.div variants={itemVariants} className="soft-card p-6 sm:p-8 pb-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="stat-card__icon bg-violet-50 text-violet-600 border border-violet-100">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Risk Factors</h3>
                                    <p className="text-xs text-slate-500">Individual vital sign clinical assessment</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <RiskFactor
                                    label="Heart Rate"
                                    value={healthTwin.heartRate}
                                    unit="bpm"
                                    min={60}
                                    max={100}
                                />
                                <RiskFactor
                                    label="Oxygen Level"
                                    value={healthTwin.oxygenLevel}
                                    unit="%"
                                    min={95}
                                    max={100}
                                />
                                <RiskFactor
                                    label="Temperature"
                                    value={healthTwin.temperature}
                                    unit="°C"
                                    min={36.1}
                                    max={37.8}
                                />
                                <RiskFactor
                                    label="Blood Pressure"
                                    value={healthTwin.bloodPressure}
                                    unit="mmHg"
                                />
                            </div>

                            {/* Calculation Note Pill with Generous Padding */}
                            <div className="flex items-center gap-3 px-5 py-4 mt-6 mb-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                                <Gauge size={16} className="text-slate-500 shrink-0" />
                                <span className="text-xs font-medium text-slate-600">
                                    Calculated from your latest vital signs, BMI, and medical history.
                                    {healthTwin.chronicDiseases?.length > 0 && ` Includes ${healthTwin.chronicDiseases.length} chronic condition(s).`}
                                </span>
                            </div>
                        </motion.div>

                        {/* ═══ Health Summary ═══ */}
                        <motion.div variants={itemVariants} className="soft-card">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="stat-card__icon bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Health Summary</h3>
                                    <p className="text-xs text-slate-500">Key indicators snapshot</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <SummaryRow
                                    label="Body Mass Index"
                                    value={bmi || "—"}
                                    meta={bmi ? bmiCategory(bmi) : null}
                                />
                                <SummaryRow
                                    label="Overall Status"
                                    value={riskLabel}
                                    badge={
                                        <span className={`badge badge--dot ${riskBadgeClass}`}>{riskLabel}</span>
                                    }
                                />
                                {healthTwin.allergies?.length > 0 && (
                                    <SummaryRow
                                        label="Allergies"
                                        value={healthTwin.allergies.join(", ")}
                                    />
                                )}
                                {healthTwin.currentMedications?.length > 0 && (
                                    <SummaryRow
                                        label="Current Medications"
                                        value={healthTwin.currentMedications.join(", ")}
                                    />
                                )}
                                {healthTwin.chronicDiseases?.length > 0 && (
                                    <SummaryRow
                                        label="Chronic Conditions"
                                        value={healthTwin.chronicDiseases.join(", ")}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </PatientLayout>
    );
}

// ── Local Vital component ──
function Vital({ label, value, unit, tone, icon }) {
    const toneMap = {
        rose: { bg: "bg-white border-slate-200/80 shadow-sm", iconBg: "bg-rose-100 text-rose-600 border border-rose-200/60", text: "text-rose-950" },
        amber: { bg: "bg-white border-slate-200/80 shadow-sm", iconBg: "bg-amber-100 text-amber-600 border border-amber-200/60", text: "text-amber-950" },
        emerald: { bg: "bg-white border-slate-200/80 shadow-sm", iconBg: "bg-emerald-100 text-emerald-600 border border-emerald-200/60", text: "text-emerald-950" },
        brand: { bg: "bg-white border-slate-200/80 shadow-sm", iconBg: "bg-blue-100 text-blue-600 border border-blue-200/60", text: "text-blue-950" },
    };
    const t = toneMap[tone] || toneMap.brand;

    return (
        <div className={`rounded-2xl border p-4 transition-all hover:shadow-md hover:border-slate-300 ${t.bg}`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${t.iconBg}`}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                    <p className={`text-xl font-extrabold tracking-tight leading-none mt-1 text-slate-900`}>
                        {value} <span className="text-xs font-semibold text-slate-400 ml-0.5">{unit}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Local RiskFactor component ──
function RiskFactor({ label, value, unit, min, max }) {
    const val = Number(value);
    const isWarning = !isNaN(val) && ((min !== undefined && val < min) || (max !== undefined && val > max));
    const isNormal = !isNaN(val) && isFinite(val);

    return (
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 px-4 py-3.5 transition-all hover:shadow-md hover:border-slate-300 duration-200">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${isWarning ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                {isWarning ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-extrabold text-slate-900 truncate">
                    {value ?? "—"}
                    {unit && <span className="font-semibold text-slate-400 ml-1 text-xs">{unit}</span>}
                </p>
            </div>
            {isNormal && (
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shrink-0 ${isWarning ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {isWarning ? "High" : "Normal"}
                </span>
            )}
        </div>
    );
}

// ── Local SummaryRow component ──
function SummaryRow({ label, value, meta, badge }) {
    const metaColors = {
        Normal: "text-emerald-600",
        Underweight: "text-blue-600",
        Overweight: "text-amber-600",
        Obese: "text-rose-600"
    };

    return (
        <div className="flex items-center justify-between rounded-2xl bg-slate-50/80 border border-slate-200/70 px-5 py-4 transition-all hover:shadow-md duration-200">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{value}</p>
            </div>
            <div className="text-right shrink-0">
                {badge ? (
                    badge
                ) : meta ? (
                    <span className={`text-xs font-bold ${metaColors[meta] || "text-slate-600"}`}>{meta}</span>
                ) : null}
            </div>
        </div>
    );
}

export default PatientHealthTwin;

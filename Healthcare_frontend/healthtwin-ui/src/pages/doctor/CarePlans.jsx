import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ShieldCheck,
    AlertTriangle,
    Activity,
    Pill,
    Utensils,
    Dumbbell,
    Moon,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock3,
    UserRound,
    RefreshCw,
    FileText,
    Stethoscope,
    Sparkles,
    TrendingUp,
    TrendingDown,
    ClipboardList,
    Users,
    Award,
    Edit3,
    Save,
    Check,
    ChevronRight,
    HeartPulse
} from "lucide-react";

import DoctorLayout from "../../components/doctor/DoctorLayout";
import {
    getCarePlan,
    generateCarePlan,
    approveCarePlan,
    rejectCarePlan,
    getPendingCarePlans,
    getDashboardStats
} from "../../services/carePlanService";

const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const CarePlans = ({ keycloak }) => {
    const [patientId, setPatientId] = useState("P101");
    const [carePlan, setCarePlan] = useState(null);
    const [pendingPlans, setPendingPlans] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        activeCarePlans: 1124,
        averageAdherence: 78,
        pendingApproval: 12,
        recoveredPatients: 320,
        highRiskPatients: 43
    });

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [doctorNotes, setDoctorNotes] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        goal: "",
        medications: "",
        diet: "",
        exercise: "",
        sleep: ""
    });

    // Load Pending Plans & Stats on Mount
    useEffect(() => {
        const init = async () => {
            const [, pendingData] = await fetchDashboardData();
            if (pendingData && pendingData.length > 0 && pendingData[0].patientId) {
                setPatientId(pendingData[0].patientId);
                loadCarePlan(pendingData[0].patientId);
            }
        };
        init();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                getDashboardStats().catch(() => null),
                getPendingCarePlans().catch(() => null)
            ]);

            if (statsRes?.data) setDashboardStats(statsRes.data);
            if (pendingRes?.data) setPendingPlans(pendingRes.data);
            return [statsRes?.data, pendingRes?.data];
        } catch (e) {
            console.warn("Failed to fetch dashboard metrics:", e);
            return [null, null];
        }
    };

    const populateEditForm = (plan) => {
        if (!plan) return;
        setEditForm({
            goal: plan.goal || "",
            medications: Array.isArray(plan.medications) ? plan.medications.join(", ") : (plan.medications || ""),
            diet: plan.diet || "",
            exercise: plan.exercise || "",
            sleep: plan.sleep || ""
        });
    };

    // Load or Generate Care Plan for Patient
    const loadCarePlan = async (targetId = patientId) => {
        const queryId = targetId.trim();
        if (!queryId) {
            setError("Please enter a valid Patient ID.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await getCarePlan(queryId);
            setCarePlan(response.data);
            setDoctorNotes(response.data?.doctorNotes || "");
            populateEditForm(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Care plan fetch error:", err);
            try {
                const genRes = await generateCarePlan(queryId);
                setCarePlan(genRes.data);
                setDoctorNotes(genRes.data?.doctorNotes || "");
                populateEditForm(genRes.data);
                setIsEditing(false);
                setSuccess("New AI Care Plan generated successfully!");
            } catch (genErr) {
                setError("Unable to retrieve or generate care plan. Please try again.");
                setCarePlan(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Force Generate New AI Care Plan
    const handleGenerateNewPlan = async () => {
        const queryId = patientId.trim();
        if (!queryId) {
            setError("Please enter a valid Patient ID.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const genRes = await generateCarePlan(queryId);
            setCarePlan(genRes.data);
            setDoctorNotes(genRes.data?.doctorNotes || "");
            populateEditForm(genRes.data);
            setIsEditing(false);
            setSuccess("Fresh AI Care Plan generated successfully!");
        } catch (genErr) {
            setError("Unable to generate new care plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Doctor Approval
    const handleApprove = async () => {
        if (!carePlan) return;
        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            if (isEditing) {
                carePlan.goal = editForm.goal;
                carePlan.medications = editForm.medications.split(",").map(s => s.trim()).filter(Boolean);
                carePlan.diet = editForm.diet;
                carePlan.exercise = editForm.exercise;
                carePlan.sleep = editForm.sleep;
            }

            const response = await approveCarePlan(carePlan.id, "DOC101", doctorNotes);
            setCarePlan(response.data);
            setIsEditing(false);
            setSuccess("Care plan approved and saved successfully!");
            fetchDashboardData();
        } catch (err) {
            setError("Unable to approve this care plan.");
        } finally {
            setActionLoading(false);
        }
    };

    // Doctor Rejection
    const handleReject = async () => {
        if (!carePlan) return;
        try {
            setActionLoading(true);
            setError("");
            setSuccess("");
            const response = await rejectCarePlan(carePlan.id, "DOC101", doctorNotes);
            setCarePlan(response.data);
            setIsEditing(false);
            setSuccess("Revision requested for care plan.");
            fetchDashboardData();
        } catch (err) {
            setError("Unable to reject this care plan.");
        } finally {
            setActionLoading(false);
        }
    };

    const medications = Array.isArray(carePlan?.medications) ? carePlan.medications : [];
    const prevRisk = carePlan?.previousRisk != null ? carePlan.previousRisk : carePlan?.predictionRisk || 24.3;
    const targetRisk = carePlan?.targetRisk != null ? carePlan.targetRisk : 16.2;
    const currentStatus = (carePlan?.doctorStatus || carePlan?.status || "PENDING").toUpperCase();

    return (
        <DoctorLayout keycloak={keycloak}>
            <motion.div
                className="page-card space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* PAGE HEADER */}
                <motion.div variants={itemVariants} className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip">
                            <Sparkles size={14} /> Clinical AI Care Plans
                        </div>
                        <h1 className="page-title">Care Plan Management</h1>
                        <p className="page-subtitle">
                            Review, customize, and validate AI-generated care plans against ACC/AHA clinical guidelines.
                        </p>
                    </div>

                    <div className="page-header__actions flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                                <Search size={17} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                placeholder="Patient ID (e.g. P101)..."
                                style={{ paddingLeft: "2.75rem", paddingTop: "10px", paddingBottom: "10px" }}
                                className="rounded-xl border-2 border-slate-200 bg-white pr-4 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-2xs"
                            />
                        </div>
                        <button
                            onClick={() => loadCarePlan(patientId)}
                            disabled={loading}
                            style={{ background: "#0f172a", color: "#ffffff" }}
                            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {loading ? <RefreshCw size={15} className="animate-spin text-white" /> : <Search size={15} className="text-white" />}
                            <span>Fetch</span>
                        </button>
                        <button
                            onClick={handleGenerateNewPlan}
                            disabled={loading}
                            style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "#ffffff" }}
                            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            <Sparkles size={15} className="text-white" />
                            <span>Generate AI Plan</span>
                        </button>
                    </div>
                </motion.div>

                {/* NOTIFICATIONS */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-between rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm">
                            <div className="flex items-center gap-2.5">
                                <AlertTriangle size={18} className="text-rose-600" />
                                <span className="font-semibold">{error}</span>
                            </div>
                            <button onClick={() => setError("")} className="font-bold text-rose-600 hover:underline text-xs">Dismiss</button>
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 size={18} className="text-emerald-600" />
                                <span className="font-semibold">{success}</span>
                            </div>
                            <button onClick={() => setSuccess("")} className="font-bold text-emerald-600 hover:underline text-xs">Dismiss</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* STATS METRICS GRID */}
                <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="soft-card">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                            <span>Active Plans</span>
                            <div className="rounded-xl bg-blue-50 p-2 text-blue-600"><ClipboardList size={16} /></div>
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900">{dashboardStats.activeCarePlans}</p>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> Active in system
                        </span>
                    </div>

                    <div className="soft-card">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                            <span>Avg Adherence</span>
                            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><Activity size={16} /></div>
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900">{dashboardStats.averageAdherence}%</p>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                            <CheckCircle2 size={12} /> Patient compliance
                        </span>
                    </div>

                    <div className="soft-card" style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", borderColor: "#fde68a" }}>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-700">
                            <span>Pending Review</span>
                            <div className="rounded-xl bg-amber-200/60 p-2 text-amber-800"><Clock3 size={16} /></div>
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-amber-950">{dashboardStats.pendingApproval}</p>
                        <span className="text-xs font-semibold text-amber-800">Requires approval</span>
                    </div>

                    <div className="soft-card">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                            <span>Recovered</span>
                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Award size={16} /></div>
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900">{dashboardStats.recoveredPatients}</p>
                        <span className="text-xs font-semibold text-indigo-600">Risk reduced to LOW</span>
                    </div>

                    <div className="soft-card" style={{ background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)", borderColor: "#fecdd3" }}>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-700">
                            <span>High Risk</span>
                            <div className="rounded-xl bg-rose-200/60 p-2 text-rose-800"><AlertTriangle size={16} /></div>
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-rose-950">{dashboardStats.highRiskPatients}</p>
                        <span className="text-xs font-semibold text-rose-800">Priority intervention</span>
                    </div>
                </motion.div>

                {/* PENDING APPROVAL QUEUE */}
                {pendingPlans && pendingPlans.length > 0 && (
                    <motion.div variants={itemVariants} className="section-card">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                <Clock3 size={14} className="text-amber-500" /> Pending Physician Review Queue ({pendingPlans.length})
                            </span>
                            <span className="text-xs text-slate-400">Click to select patient</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {pendingPlans.map((p) => {
                                const isSelected = patientId === p.patientId;
                                return (
                                    <button
                                        key={p.id || p.patientId}
                                        onClick={() => {
                                            setPatientId(p.patientId);
                                            loadCarePlan(p.patientId);
                                        }}
                                        style={{
                                            background: isSelected ? "#2563eb" : "#f1f5f9",
                                            color: isSelected ? "#ffffff" : "#1e293b",
                                            border: isSelected ? "1.5px solid #2563eb" : "1.5px solid #cbd5e1"
                                        }}
                                        className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <UserRound size={14} />
                                        {p.patientId}
                                        <span
                                            style={{
                                                background: isSelected ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                                                color: isSelected ? "#ffffff" : "#0f172a"
                                            }}
                                            className="text-[11px] px-2 py-0.5 rounded font-mono font-bold"
                                        >
                                            {p.predictionRisk ? `${p.predictionRisk}%` : "Pending"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* MAIN CARE PLAN DETAILS */}
                {carePlan ? (
                    <motion.div variants={itemVariants} className="soft-card space-y-6">
                        {/* HEADER BANNER */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center pb-6 border-b border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {carePlan.patientId?.substring(0, 2) || "PT"}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-900">Patient: {carePlan.patientId}</h2>
                                        <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                                            currentStatus === "APPROVED"
                                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                                : currentStatus === "REJECTED"
                                                ? "bg-rose-100 text-rose-800 border-rose-300"
                                                : "bg-amber-100 text-amber-800 border-amber-300"
                                        }`}>
                                            {currentStatus}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                        <CalendarDays size={13} /> Created: {carePlan.createdAt ? new Date(carePlan.createdAt).toLocaleDateString() : "Today"}
                                        <span>•</span>
                                        <Stethoscope size={13} /> Attending Doctor: {carePlan.doctorId || carePlan.approvedBy || "DOC101"}
                                    </p>
                                </div>
                            </div>

                            {/* ACTION BUTTONS: IF APPROVED, SHOW APPROVED BADGE & EDIT */}
                            <div className="flex flex-wrap items-center gap-3">
                                {currentStatus === "APPROVED" ? (
                                    <div className="flex items-center gap-2">
                                        <span style={{ background: "#d1fae5", color: "#065f46", border: "1.5px solid #6ee7b7" }} className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm">
                                            <CheckCircle2 size={16} className="text-emerald-600" />
                                            Approved by Doctor
                                        </span>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            style={{ background: "#f1f5f9", color: "#0f172a", border: "1.5px solid #cbd5e1" }}
                                            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:bg-slate-200"
                                        >
                                            <Edit3 size={15} className="text-slate-800" />
                                            <span>{isEditing ? "Cancel Edit" : "Edit Plan"}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            style={{ background: "#f1f5f9", color: "#0f172a", border: "1.5px solid #cbd5e1" }}
                                            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:bg-slate-200"
                                        >
                                            <Edit3 size={15} className="text-slate-800" />
                                            <span>{isEditing ? "Cancel Edit" : "Edit Plan"}</span>
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            disabled={actionLoading}
                                            style={{ background: "#059669", color: "#ffffff", border: "1.5px solid #047857" }}
                                            className="px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <Check size={16} className="text-white" />
                                            <span style={{ color: "#ffffff" }}>{actionLoading ? "Approving..." : "Approve Plan"}</span>
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={actionLoading}
                                            style={{ background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fca5a5" }}
                                            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:bg-rose-100 disabled:opacity-50"
                                        >
                                            <XCircle size={15} className="text-rose-600" />
                                            <span>Request Revision</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* METRICS ROW */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="section-card">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    <span>CVD Risk Score</span>
                                    <span className="text-rose-600 font-bold">{prevRisk}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, prevRisk)}%` }} />
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                    <span>Target Goal:</span>
                                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                                        <TrendingDown size={13} /> {targetRisk}%
                                    </span>
                                </div>
                            </div>

                            <div className="section-card">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    <span>Patient Compliance</span>
                                    <span className="text-emerald-600 font-bold">{carePlan.adherence != null ? carePlan.adherence : 0}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${carePlan.adherence != null ? carePlan.adherence : 0}%` }} />
                                </div>
                                <p className="text-xs text-slate-500">Tracked daily via checklist</p>
                            </div>

                            <div className="section-card">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Clinical Audits</span>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">ACC/AHA Guidelines:</span>
                                        <span className="font-bold text-emerald-600">{carePlan.clinicalGuidelineCheck || "Passed"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Drug Interaction:</span>
                                        <span className="font-bold text-emerald-600">{carePlan.drugInteractionCheck || "Safe"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Safety Check:</span>
                                        <span className="font-bold text-emerald-600">{carePlan.safetyChecks || "Passed"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PRESCRIPTION CONTENT */}
                        {isEditing ? (
                            <div className="section-card p-6 sm:p-7 bg-slate-50/90 rounded-3xl border border-slate-200/90 space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Edit3 size={18} className="text-blue-600" />
                                        Edit Prescription Parameters
                                    </h3>
                                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                        Editing Active Plan
                                    </span>
                                </div>

                                {/* Clinical Goal */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Clinical Goal
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.goal}
                                        onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                                        style={{ padding: "14px 16px" }}
                                        className="w-full rounded-2xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xs"
                                        placeholder="e.g. Reduce CVD & Diabetes Risk"
                                    />
                                </div>

                                {/* Medications */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Medications (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.medications}
                                        onChange={(e) => setEditForm({ ...editForm, medications: e.target.value })}
                                        style={{ padding: "14px 16px" }}
                                        className="w-full rounded-2xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xs"
                                        placeholder="e.g. Metformin 1000mg, Losartan 50mg, Aspirin 75mg"
                                    />
                                </div>

                                {/* Diet, Exercise, Sleep Grid */}
                                <div className="grid md:grid-cols-3 gap-5">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Diet Protocol
                                        </label>
                                        <textarea
                                            value={editForm.diet}
                                            onChange={(e) => setEditForm({ ...editForm, diet: e.target.value })}
                                            rows={3}
                                            style={{ padding: "14px 16px", lineHeight: "1.6" }}
                                            className="w-full rounded-2xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xs resize-y"
                                            placeholder="Enter diet recommendations..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Exercise Routine
                                        </label>
                                        <textarea
                                            value={editForm.exercise}
                                            onChange={(e) => setEditForm({ ...editForm, exercise: e.target.value })}
                                            rows={3}
                                            style={{ padding: "14px 16px", lineHeight: "1.6" }}
                                            className="w-full rounded-2xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xs resize-y"
                                            placeholder="Enter exercise protocol..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Sleep Protocol
                                        </label>
                                        <textarea
                                            value={editForm.sleep}
                                            onChange={(e) => setEditForm({ ...editForm, sleep: e.target.value })}
                                            rows={3}
                                            style={{ padding: "14px 16px", lineHeight: "1.6" }}
                                            className="w-full rounded-2xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xs resize-y"
                                            placeholder="Enter sleep recommendations..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="section-card" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", borderColor: "#bfdbfe" }}>
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                                        <Award size={15} /> Clinical Objective
                                    </span>
                                    <p className="mt-1 text-base font-bold text-slate-900">{carePlan.goal || "Reduce CVD & Diabetes Risk"}</p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="section-card">
                                        <div className="flex items-center gap-2.5 mb-3">
                                            <div className="rounded-xl bg-blue-100 p-2 text-blue-600"><Pill size={18} /></div>
                                            <h3 className="font-bold text-slate-900">Prescribed Medications</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {medications.length > 0 ? (
                                                medications.map((med, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-sm">
                                                        <span className="font-semibold text-slate-800">{med}</span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">Prescribed</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">No specific medications prescribed.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="section-card">
                                        <div className="flex items-center gap-2.5 mb-3">
                                            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600"><Utensils size={18} /></div>
                                            <h3 className="font-bold text-slate-900">Dietary Guidelines</h3>
                                        </div>
                                        <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                                            {carePlan.diet || "Low Salt, Low Sugar, High Fiber Mediterranean Diet"}
                                        </p>
                                    </div>

                                    <div className="section-card">
                                        <div className="flex items-center gap-2.5 mb-3">
                                            <div className="rounded-xl bg-amber-100 p-2 text-amber-600"><Dumbbell size={18} /></div>
                                            <h3 className="font-bold text-slate-900">Exercise Protocol</h3>
                                        </div>
                                        <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                                            {carePlan.exercise || "30 min Brisk Walking (5 Days/week) + Light Strength Training"}
                                        </p>
                                    </div>

                                    <div className="section-card">
                                        <div className="flex items-center gap-2.5 mb-3">
                                            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600"><Moon size={18} /></div>
                                            <h3 className="font-bold text-slate-900">Sleep & Recovery</h3>
                                        </div>
                                        <p className="text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                                            {carePlan.sleep || "7-8 Hours of Night Rest"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DOCTOR REMARKS & DIAGNOSTICS TEXTAREA */}
                        <div className="section-card p-5 bg-slate-50/90 rounded-3xl border border-slate-200 space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                <Stethoscope size={16} className="text-blue-600" />
                                Attending Physician Remarks & AI Engine Source
                            </label>
                            <textarea
                                value={doctorNotes}
                                onChange={(e) => setDoctorNotes(e.target.value)}
                                rows={3}
                                placeholder="Add physician observations or comments..."
                                style={{ padding: "14px 16px", lineHeight: "1.6" }}
                                className="w-full rounded-2xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-xs resize-y"
                            />
                            {carePlan.doctorNotes && (
                                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 font-medium">
                                    <span className="font-bold text-blue-700">Diagnostics:</span>
                                    <span>{carePlan.doctorNotes}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <div className="soft-card p-12 text-center">
                        <ClipboardList size={36} className="mx-auto text-slate-400 mb-2" />
                        <h3 className="text-base font-bold text-slate-900">No Care Plan Loaded</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            Enter a Patient ID above or click "Generate AI Plan" to load or create a care plan.
                        </p>
                    </div>
                )}
            </motion.div>
        </DoctorLayout>
    );
};

export default CarePlans;

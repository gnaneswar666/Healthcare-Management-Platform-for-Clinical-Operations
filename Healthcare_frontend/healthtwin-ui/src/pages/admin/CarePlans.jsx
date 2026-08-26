import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Search,
    ShieldCheck,
    AlertTriangle,
    Activity,
    Pill,
    Utensils,
    Dumbbell,
    Moon,
    CheckCircle2,
    Clock3,
    UserRound,
    FileText,
    TrendingUp,
    ClipboardList,
    Users,
    Award,
    HeartPulse,
    Check,
    ChevronRight,
    FileHeart,
    Stethoscope,
    ActivitySquare,
    Lock
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import { getPatients } from "../../services/patientService";
import {
    getCarePlan,
    getPendingCarePlans,
    getDashboardStats,
    getTodayProgress
} from "../../services/carePlanService";

const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut", staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } }
};

function CarePlans() {
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState("P101");
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ALL"); // ALL | PENDING | HIGH_RISK

    const [carePlan, setCarePlan] = useState(null);
    const [todayProgress, setTodayProgress] = useState(null);
    const [pendingPlans, setPendingPlans] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        activeCarePlans: 124,
        averageAdherence: 82,
        pendingApproval: 8,
        recoveredPatients: 34,
        highRiskPatients: 14
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Calculate age helper
    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 0 ? age : null;
    };

    // Load initial patient list and dashboard stats
    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                const [patientsRes, statsRes, pendingRes] = await Promise.all([
                    getPatients().catch(() => ({ data: [] })),
                    getDashboardStats().catch(() => null),
                    getPendingCarePlans().catch(() => null)
                ]);

                if (!isMounted) return;

                if (patientsRes?.data?.length > 0) {
                    setPatients(patientsRes.data);
                    const initialId = patientsRes.data[0].patientId || "P101";
                    setSelectedPatientId(initialId);
                    loadCarePlanData(initialId);
                }

                if (statsRes?.data) setDashboardStats(statsRes.data);
                if (pendingRes?.data) setPendingPlans(pendingRes.data);
            } catch (err) {
                console.error("Failed to load initial care plan data:", err);
            }
        };
        init();
        return () => { isMounted = false; };
    }, []);

    const loadCarePlanData = async (targetPatientId) => {
        if (!targetPatientId) return;
        setLoading(true);
        setError("");
        try {
            const [planRes, progRes] = await Promise.all([
                getCarePlan(targetPatientId).catch(() => null),
                getTodayProgress(targetPatientId).catch(() => null)
            ]);

            setCarePlan(planRes?.data || null);

            if (progRes?.data) {
                setTodayProgress(progRes.data);
            } else {
                setTodayProgress(null);
            }
        } catch (err) {
            console.error("Error loading care plan data:", err);
            setError("Unable to load care plan progress for patient " + targetPatientId);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPatient = (pId) => {
        setSelectedPatientId(pId);
        loadCarePlanData(pId);
    };

    // Filter patients by search & tab
    const filteredPatients = useMemo(() => {
        return patients.filter((p) => {
            const q = search.toLowerCase();
            const matchesSearch =
                (p.firstName || "").toLowerCase().includes(q) ||
                (p.lastName || "").toLowerCase().includes(q) ||
                (p.patientId || "").toLowerCase().includes(q);

            if (!matchesSearch) return false;

            if (activeTab === "PENDING") {
                return pendingPlans.some((pending) => pending.patientId === p.patientId);
            }
            if (activeTab === "HIGH_RISK") {
                return String(p.riskLevel || "").toUpperCase() === "HIGH" || String(p.riskLevel || "").toUpperCase() === "CRITICAL";
            }
            return true;
        });
    }, [patients, search, activeTab, pendingPlans]);

    const activePatient = patients.find((p) => p.patientId === selectedPatientId) || {
        firstName: "Patient",
        lastName: selectedPatientId,
        patientId: selectedPatientId
    };

    // Compute progress details from todayProgress API
    const progressTasks = useMemo(() => {
        if (!todayProgress) {
            return {
                completedCount: 0,
                totalTasks: 6,
                adherence: carePlan?.adherenceRate ?? Math.round(Number(carePlan?.adherenceScore || 0)),
                items: {
                    medication: false,
                    diet: false,
                    exercise: false,
                    sleep: false,
                    bp: false,
                    sugar: false
                }
            };
        }

        const items = {
            medication: !!todayProgress.medicationCompleted,
            diet: !!todayProgress.dietCompleted,
            exercise: !!todayProgress.exerciseCompleted,
            sleep: !!todayProgress.sleepCompleted,
            bp: !!todayProgress.bpChecked,
            sugar: !!todayProgress.sugarChecked
        };

        const completedCount = Object.values(items).filter(Boolean).length;
        const computedAdherence = todayProgress.adherence != null
            ? Math.round(todayProgress.adherence)
            : Math.round((completedCount / 6) * 100);

        return {
            completedCount,
            totalTasks: 6,
            adherence: computedAdherence,
            items
        };
    }, [todayProgress, carePlan]);

    const currentStatus = carePlan?.status || "APPROVED";

    return (
        <AdminLayout>
            <motion.div
                className="page-card p-6 sm:p-10 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 1. HERO HEADER WITH EXPANDED PADDING */}
                <motion.div variants={itemVariants} className="page-header pb-2 border-b border-slate-100">
                    <div className="page-header__info space-y-2">
                        <div className="page-status-chip page-status-chip--teal">
                            <FileHeart size={14} /> Care Plan Monitoring Dashboard
                        </div>
                        <h1 className="page-title text-2xl sm:text-3xl font-black">Patient Care Plan Progress</h1>
                        <p className="page-subtitle text-sm sm:text-base text-slate-500 font-medium max-w-2xl">
                            Read-only enterprise view for monitoring patient daily task completions, adherence rates, and physician care plan recommendations.
                        </p>
                    </div>
                    <div className="page-header__actions pt-2 sm:pt-0">
                        <div className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-[10px] bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold shadow-xs">
                            <Lock size={15} className="text-slate-500 shrink-0" />
                            <span>Admin Read-Only View</span>
                        </div>
                    </div>
                </motion.div>

                {/* 2. TOP METRICS STAT CARDS (EXPANDED PADDING & SPACING) */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5">
                    <div className="bg-white border border-slate-200/90 rounded-[12px] p-5 sm:p-6 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Plans</span>
                            <div className="w-9 h-9 rounded-[8px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <ClipboardList size={18} />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">{dashboardStats.activeCarePlans}</h3>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-0.5">
                            <TrendingUp size={13} /> Active in system
                        </span>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-[12px] p-5 sm:p-6 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">Avg Adherence</span>
                            <div className="w-9 h-9 rounded-[8px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Award size={18} />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">{dashboardStats.averageAdherence}%</h3>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-0.5">
                            <CheckCircle2 size={13} /> Daily compliance
                        </span>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200/90 rounded-[12px] p-5 sm:p-6 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-800">Pending Review</span>
                            <div className="w-9 h-9 rounded-[8px] bg-amber-200/60 text-amber-800 flex items-center justify-center shrink-0">
                                <Clock3 size={18} />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-amber-950 m-0">{pendingPlans.length || dashboardStats.pendingApproval}</h3>
                        <span className="text-xs font-bold text-amber-800 pt-0.5 block">Awaiting physician</span>
                    </div>

                    <div className="bg-white border border-slate-200/90 rounded-[12px] p-5 sm:p-6 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400">Recovered</span>
                            <div className="w-9 h-9 rounded-[8px] bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <ShieldCheck size={18} />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 m-0">{dashboardStats.recoveredPatients || 34}</h3>
                        <span className="text-xs font-bold text-indigo-600 pt-0.5 block">Risk reduced</span>
                    </div>

                    <div className="bg-rose-50/80 border border-rose-200/90 rounded-[12px] p-5 sm:p-6 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-rose-800">High Risk</span>
                            <div className="w-9 h-9 rounded-[8px] bg-rose-200/60 text-rose-800 flex items-center justify-center shrink-0">
                                <AlertTriangle size={18} />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black text-rose-950 m-0">{dashboardStats.highRiskPatients}</h3>
                        <span className="text-xs font-bold text-rose-800 pt-0.5 block">Priority cases</span>
                    </div>
                </motion.div>

                {/* 3. MAIN SPLIT CONTENT GRID (4 COLS LEFT / 8 COLS RIGHT WITH EXPANDED SPACING) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                    {/* LEFT PANEL: PATIENT DIRECTORY SELECTOR */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-5">
                        <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-7 shadow-xs space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 m-0 flex items-center gap-2.5">
                                    <Users size={20} className="text-blue-600" />
                                    Patients Directory
                                </h3>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-[6px]">{filteredPatients.length} Listed</span>
                            </div>

                            {/* SEARCH BOX */}
                            <div className="relative">
                                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search patient name or ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold rounded-[8px] border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all shadow-2xs"
                                />
                            </div>

                            {/* FILTER TABS */}
                            <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-[10px]">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("ALL")}
                                    className={`flex-1 py-2 text-xs font-extrabold rounded-[8px] transition-all cursor-pointer ${
                                        activeTab === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("PENDING")}
                                    className={`flex-1 py-2 text-xs font-extrabold rounded-[8px] transition-all cursor-pointer ${
                                        activeTab === "PENDING" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Pending ({pendingPlans.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("HIGH_RISK")}
                                    className={`flex-1 py-2 text-xs font-extrabold rounded-[8px] transition-all cursor-pointer ${
                                        activeTab === "HIGH_RISK" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    High Risk
                                </button>
                            </div>

                            {/* PATIENT LIST ITEMS WITH SPACIOUS CARDS */}
                            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                                {filteredPatients.map((p) => {
                                    const isSelected = p.patientId === selectedPatientId;
                                    const age = calculateAge(p.dob);
                                    const isPending = pendingPlans.some((pending) => pending.patientId === p.patientId);

                                    return (
                                        <button
                                            key={p.patientId}
                                            type="button"
                                            onClick={() => handleSelectPatient(p.patientId)}
                                            className={`w-full text-left p-4 rounded-[12px] border transition-all cursor-pointer flex items-center justify-between ${
                                                isSelected
                                                    ? "bg-blue-50/90 border-blue-400 shadow-xs"
                                                    : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center text-xs font-black shrink-0 ${
                                                    isSelected
                                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs"
                                                        : "bg-slate-100 text-slate-700 border border-slate-200"
                                                }`}>
                                                    {(p.firstName?.[0] || "") + (p.lastName?.[0] || "")}
                                                </div>
                                                <div className="min-w-0 space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-extrabold text-sm text-slate-900 truncate m-0">
                                                            {p.firstName} {p.lastName}
                                                        </p>
                                                        {isPending && (
                                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" title="Pending Doctor Review" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium m-0 flex items-center gap-2">
                                                        <span className="font-mono font-bold text-slate-600">{p.patientId}</span>
                                                        {age && <span>• {age} yrs</span>}
                                                        {p.gender && <span>• {p.gender}</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className={isSelected ? "text-blue-600" : "text-slate-300"} />
                                        </button>
                                    );
                                })}

                                {filteredPatients.length === 0 && (
                                    <div className="text-center py-12 text-xs text-slate-400 font-medium">
                                        No patients match the selected filter.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL: READ-ONLY CARE PLAN DETAILS & PROGRESS TRACKER */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6 sm:space-y-7">
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 rounded-[10px] p-4.5 text-xs sm:text-sm font-bold text-rose-700 flex items-center justify-between shadow-xs">
                                <div className="flex items-center gap-2.5">
                                    <AlertTriangle size={17} className="shrink-0 text-rose-600" />
                                    <span>{error}</span>
                                </div>
                                <button type="button" onClick={() => setError("")} className="text-rose-600 hover:underline">Dismiss</button>
                            </div>
                        )}

                        {loading ? (
                            <div className="bg-white border border-slate-200/90 rounded-[12px] p-16 sm:p-20 text-center shadow-xs">
                                <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-slate-100 border-t-blue-600 mx-auto mb-4" />
                                <p className="font-extrabold text-base sm:text-lg text-slate-800 m-0">Loading Patient Care Plan...</p>
                                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium m-0">Fetching latest compliance telemetry for Patient {selectedPatientId}</p>
                            </div>
                        ) : carePlan ? (
                            <div className="space-y-6 sm:space-y-7">
                                {/* CARE PLAN HEADER CARD WITH EXPANDED PADDING */}
                                <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-8 shadow-xs space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-6">
                                        <div className="flex items-center gap-4.5">
                                            <div className="w-14 h-14 rounded-[12px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                                                {(activePatient.firstName?.[0] || "") + (activePatient.lastName?.[0] || "")}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 m-0">
                                                        {activePatient.firstName} {activePatient.lastName}
                                                    </h2>
                                                    <span className={`px-3.5 py-1.5 rounded-[6px] text-xs font-extrabold border leading-normal ${
                                                        currentStatus === "APPROVED"
                                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                                            : currentStatus === "REJECTED"
                                                            ? "bg-rose-50 border-rose-200 text-rose-800"
                                                            : "bg-amber-50 border-amber-200 text-amber-900"
                                                    }`}>
                                                        Doctor Status: {currentStatus}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1 flex items-center gap-2 flex-wrap m-0">
                                                    <span>Patient ID: <strong className="font-mono text-slate-700">{selectedPatientId}</strong></span>
                                                    <span>•</span>
                                                    <span>Created: {carePlan.createdAt ? new Date(carePlan.createdAt).toLocaleDateString() : "Today"}</span>
                                                    <span>•</span>
                                                    <span>Physician: {carePlan.doctorId || carePlan.approvedBy || "DOC101"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-4 py-2.5 rounded-[8px] bg-slate-100 border border-slate-200 text-slate-600 text-xs sm:text-sm font-extrabold flex items-center gap-2 shrink-0 self-start sm:self-center">
                                            <Stethoscope size={16} className="text-blue-600 shrink-0" />
                                            <span>Doctor Approval Required</span>
                                        </div>
                                    </div>

                                    {/* LIVE DAILY ADHERENCE PROGRESS TRACKER CARD WITH PADDING */}
                                    <div className="bg-slate-50/80 border border-slate-200/80 rounded-[12px] p-6 sm:p-7 space-y-5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-0.5">
                                                <span className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                                                    <ActivitySquare size={18} className="text-emerald-600" />
                                                    Today's Patient Adherence Progress
                                                </span>
                                                <p className="text-xs sm:text-sm text-slate-500 font-medium m-0">
                                                    {progressTasks.completedCount} of {progressTasks.totalTasks} Daily Tasks Completed Today
                                                </p>
                                            </div>
                                            <span className="text-lg sm:text-xl font-black text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-4 py-1.5 rounded-[8px] w-fit leading-normal shadow-2xs">
                                                {progressTasks.adherence}% Adherence
                                            </span>
                                        </div>

                                        {/* Progress Bar Track */}
                                        <div className="h-4.5 w-full bg-slate-200/80 rounded-[8px] overflow-hidden p-0.5 border border-slate-300/40">
                                            <div
                                                className="h-full rounded-[6px] bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                                                style={{ width: `${Math.max(4, Math.min(100, progressTasks.adherence))}%` }}
                                            />
                                        </div>

                                        {/* 6 DAILY TASKS CHECKLIST STATUS STRIP (READ ONLY WITH SPACIOUS PADDING) */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                                            <div className={`p-3.5 sm:p-4 rounded-[10px] border flex items-center justify-between text-xs sm:text-sm font-extrabold ${
                                                progressTasks.items.medication ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600"
                                            }`}>
                                                <span className="flex items-center gap-2 truncate">
                                                    <Pill size={16} className={progressTasks.items.medication ? "text-emerald-600" : "text-slate-400"} />
                                                    Medication
                                                </span>
                                                {progressTasks.items.medication ? <Check size={16} className="text-emerald-600 shrink-0" /> : <span className="text-xs text-slate-400">Pending</span>}
                                            </div>

                                            <div className={`p-3.5 sm:p-4 rounded-[10px] border flex items-center justify-between text-xs sm:text-sm font-extrabold ${
                                                progressTasks.items.diet ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600"
                                            }`}>
                                                <span className="flex items-center gap-2 truncate">
                                                    <Utensils size={16} className={progressTasks.items.diet ? "text-emerald-600" : "text-slate-400"} />
                                                    Diet Protocol
                                                </span>
                                                {progressTasks.items.diet ? <Check size={16} className="text-emerald-600 shrink-0" /> : <span className="text-xs text-slate-400">Pending</span>}
                                            </div>

                                            <div className={`p-3.5 sm:p-4 rounded-[10px] border flex items-center justify-between text-xs sm:text-sm font-extrabold ${
                                                progressTasks.items.exercise ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600"
                                            }`}>
                                                <span className="flex items-center gap-2 truncate">
                                                    <Dumbbell size={16} className={progressTasks.items.exercise ? "text-emerald-600" : "text-slate-400"} />
                                                    Exercise
                                                </span>
                                                {progressTasks.items.exercise ? <Check size={16} className="text-emerald-600 shrink-0" /> : <span className="text-xs text-slate-400">Pending</span>}
                                            </div>

                                            <div className={`p-3.5 sm:p-4 rounded-[10px] border flex items-center justify-between text-xs sm:text-sm font-extrabold ${
                                                progressTasks.items.sleep ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600"
                                            }`}>
                                                <span className="flex items-center gap-2 truncate">
                                                    <Moon size={16} className={progressTasks.items.sleep ? "text-emerald-600" : "text-slate-400"} />
                                                    Sleep Log
                                                </span>
                                                {progressTasks.items.sleep ? <Check size={16} className="text-emerald-600 shrink-0" /> : <span className="text-xs text-slate-400">Pending</span>}
                                            </div>

                                            <div className={`p-3.5 sm:p-4 rounded-[10px] border flex items-center justify-between text-xs sm:text-sm font-extrabold ${
                                                progressTasks.items.bp ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600"
                                            }`}>
                                                <span className="flex items-center gap-2 truncate">
                                                    <Activity size={16} className={progressTasks.items.bp ? "text-emerald-600" : "text-slate-400"} />
                                                    BP Logged
                                                </span>
                                                {progressTasks.items.bp ? <Check size={16} className="text-emerald-600 shrink-0" /> : <span className="text-xs text-slate-400">Pending</span>}
                                            </div>

                                            <div className={`p-3.5 sm:p-4 rounded-[10px] border flex items-center justify-between text-xs sm:text-sm font-extrabold ${
                                                progressTasks.items.sugar ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600"
                                            }`}>
                                                <span className="flex items-center gap-2 truncate">
                                                    <HeartPulse size={16} className={progressTasks.items.sugar ? "text-emerald-600" : "text-slate-400"} />
                                                    Sugar Logged
                                                </span>
                                                {progressTasks.items.sugar ? <Check size={16} className="text-emerald-600 shrink-0" /> : <span className="text-xs text-slate-400">Pending</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PRIMARY GOAL BOX WITH PADDING */}
                                <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-8 shadow-xs space-y-4">
                                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-700 flex items-center gap-2.5 m-0">
                                        <TrendingUp size={18} className="text-blue-600" />
                                        Primary Clinical Goal
                                    </h3>
                                    <p className="text-sm sm:text-base font-extrabold text-slate-800 bg-blue-50/40 border border-blue-100 rounded-[10px] p-5 sm:p-6 m-0 leading-relaxed">
                                        {carePlan.goal || carePlan.primaryGoal || "Maintain optimal glycemic control, monitor BP twice daily, and adhere to prescribed medication schedule."}
                                    </p>
                                </div>

                                {/* CARE INTERVENTIONS GRID (4 CARDS WITH PADDING) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                    {/* MEDICATIONS CARD */}
                                    <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-7 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                                <Pill size={18} className="text-rose-500" />
                                                Medication Schedule
                                            </span>
                                            {progressTasks.items.medication ? (
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[6px]">Done Today</span>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-[6px]">Pending</span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-700 m-0 leading-relaxed">
                                            {Array.isArray(carePlan.medications) ? carePlan.medications.join(", ") : (carePlan.medications || "Take prescribed medication dosage as directed.")}
                                        </p>
                                    </div>

                                    {/* DIET CARD */}
                                    <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-7 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                                <Utensils size={18} className="text-amber-500" />
                                                Dietary Protocol
                                            </span>
                                            {progressTasks.items.diet ? (
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[6px]">Done Today</span>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-[6px]">Pending</span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-700 m-0 leading-relaxed">
                                            {carePlan.diet || "Low glycemic index, high fiber, controlled carbohydrates and reduced sodium intake."}
                                        </p>
                                    </div>

                                    {/* EXERCISE CARD */}
                                    <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-7 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                                <Dumbbell size={18} className="text-blue-500" />
                                                Exercise & Activity
                                            </span>
                                            {progressTasks.items.exercise ? (
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[6px]">Done Today</span>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-[6px]">Pending</span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-700 m-0 leading-relaxed">
                                            {carePlan.exercise || "30 minutes brisk walking or supervised physical exercise 5 days/week."}
                                        </p>
                                    </div>

                                    {/* SLEEP CARD */}
                                    <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-7 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                                <Moon size={18} className="text-indigo-500" />
                                                Sleep & Recovery
                                            </span>
                                            {progressTasks.items.sleep ? (
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-[6px]">Done Today</span>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-[6px]">Pending</span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-700 m-0 leading-relaxed">
                                            {carePlan.sleep || "7-8 hours quality sleep per night; maintain consistent bedtime schedule."}
                                        </p>
                                    </div>
                                </div>

                                {/* READ-ONLY CLINICAL NOTES CARD WITH PADDING */}
                                <div className="bg-white border border-slate-200/90 rounded-[12px] p-6 sm:p-8 shadow-xs space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-700 flex items-center gap-2.5 m-0">
                                            <FileText size={18} className="text-indigo-600" />
                                            Physician Review Notes & Clinical Remarks
                                        </h3>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-[6px]">Doctor Remarks</span>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200/80 rounded-[10px] p-5 sm:p-6 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                                        {carePlan.doctorNotes || carePlan.notes || "Care plan reviewed by attending physician. Patient compliance monitored regularly."}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-200/90 rounded-[12px] p-16 sm:p-20 text-center space-y-4 shadow-xs">
                                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                    <FileHeart size={36} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-slate-800 m-0">No Active Care Plan</h3>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto m-0 leading-relaxed">
                                    No active care plan progress recorded for Patient <strong className="text-slate-700">{selectedPatientId}</strong>. Care plan generation and physician approvals are managed by attending doctors.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}

export default CarePlans;

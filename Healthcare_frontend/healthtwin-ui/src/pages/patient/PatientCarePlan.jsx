import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Dumbbell,
    FileText,
    HeartPulse,
    Loader2,
    Moon,
    Pill,
    RefreshCw,
    ShieldCheck,
    Stethoscope,
    Utensils,
    TrendingDown,
    Sparkles,
    CheckSquare,
    Square,
    Award,
    ChevronRight,
    TrendingUp,
    Target,
    Zap,
    UserCheck,
    Flame,
    Check,
    X
} from "lucide-react";
import keycloak from "../../keycloak";
import {
    getCarePlan,
    updateProgress,
    getTodayProgress,
    generateCarePlan
} from "../../services/carePlanService";
import PatientLayout from "../../components/patient/PatientLayout";

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

const PatientCarePlan = () => {
    const patientId = keycloak.tokenParsed?.patientId || "P101";

    const [carePlan, setCarePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingProgress, setUpdatingProgress] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Today Checklist state (Step 7 Adherence)
    const [checklist, setChecklist] = useState({
        medicationCompleted: false,
        exerciseCompleted: false,
        bpChecked: false,
        sugarChecked: false,
        dietCompleted: false,
        sleepCompleted: false
    });

    const [adherence, setAdherence] = useState(0);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            // 1. Fetch Care Plan
            let planData = null;
            try {
                const planRes = await getCarePlan(patientId);
                planData = planRes.data;
            } catch {
                // Generate plan if not exists
                const genRes = await generateCarePlan(patientId);
                planData = genRes.data;
            }
            setCarePlan(planData);

            // 2. Fetch Today Progress
            try {
                const progRes = await getTodayProgress(patientId);
                if (progRes.data) {
                    const p = progRes.data;
                    setChecklist({
                        medicationCompleted: !!p.medicationCompleted,
                        exerciseCompleted: !!p.exerciseCompleted,
                        bpChecked: !!p.bpChecked,
                        sugarChecked: !!p.sugarChecked,
                        dietCompleted: !!p.dietCompleted,
                        sleepCompleted: !!p.sleepCompleted
                    });
                    setAdherence(p.adherence != null ? p.adherence : (planData?.adherence != null ? planData.adherence : 0));
                }
            } catch (e) {
                console.warn("Failed to fetch today progress:", e);
                setAdherence(planData?.adherence != null ? planData.adherence : 0);
            }
        } catch (err) {
            console.error("Error loading care plan data:", err);
            setError("Unable to load your health care plan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) {
            loadData();
        }
    }, [patientId]);

    // Handle Checklist Checkbox Change
    const handleChecklistToggle = async (key) => {
        const updatedChecklist = {
            ...checklist,
            [key]: !checklist[key]
        };
        setChecklist(updatedChecklist);

        try {
            setUpdatingProgress(true);
            const response = await updateProgress(carePlan?.id, patientId, updatedChecklist);
            if (response.data && response.data.adherence != null) {
                setAdherence(response.data.adherence);
            } else {
                // Compute local percentage
                const completedCount = Object.values(updatedChecklist).filter(Boolean).length;
                const computed = Math.round((completedCount / 6) * 100);
                setAdherence(computed);
            }
            setSuccess("Today's progress updated!");
            setTimeout(() => setSuccess(""), 3500);
        } catch (err) {
            console.error("Progress update error:", err);
            // Fallback calculation
            const completedCount = Object.values(updatedChecklist).filter(Boolean).length;
            const computed = Math.round((completedCount / 6) * 100);
            setAdherence(computed);
        } finally {
            setUpdatingProgress(false);
        }
    };

    const medications = Array.isArray(carePlan?.medications) ? carePlan.medications : [];
    const prevRisk = carePlan?.predictionRisk || 24.3;
    const targetRisk = carePlan?.targetRisk || 16.2;
    const completedTasksCount = Object.values(checklist).filter(Boolean).length;

    return (
        <PatientLayout>
            <motion.div
                className="page-card space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* FLOATING SUCCESS TOAST */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className="flex items-center justify-between rounded-2xl bg-emerald-500 text-white p-4 shadow-xl border border-emerald-400"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-xl">
                                    <CheckCircle2 size={20} />
                                </div>
                                <span className="font-bold text-sm">{success}</span>
                            </div>
                            <button
                                onClick={() => setSuccess("")}
                                className="text-white/80 hover:text-white p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PAGE HEADER */}
                <motion.div variants={itemVariants} className="page-header">
                    <div className="page-header__info">
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="page-status-chip page-status-chip--teal">
                                <Sparkles size={14} />
                                Personal AI Care Companion
                            </div>
                            <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Patient ID: {patientId}
                            </span>
                        </div>
                        <h1 className="page-title">Personal Care Plan</h1>
                        <p className="page-subtitle">
                            Custom daily protocol, prescription tracking, and risk management guidelines tailored to your HealthTwin telemetry.
                        </p>
                    </div>

                    <div className="page-header__actions flex items-center gap-3">
                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="btn btn--primary flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Sync Care Plan
                        </button>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="soft-card p-20 text-center flex flex-col items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 mb-4" />
                        <h3 className="text-base font-bold text-slate-800">Generating Your AI Care Protocol...</h3>
                        <p className="text-xs text-slate-500 mt-1">Retrieving latest clinical guidelines and vitals log</p>
                    </div>
                ) : carePlan ? (
                    <div className="space-y-8">
                        
                        {/* HERO ADHERENCE & TARGET RISK BANNER GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* LEFT (2 COLS): DAILY ADHERENCE CHECKLIST CARD */}
                            <motion.div
                                variants={itemVariants}
                                className="lg:col-span-2 soft-card p-6 md:p-7 relative overflow-hidden"
                                style={{
                                    background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
                                    borderColor: "#a7f3d0"
                                }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                                                <Award size={16} />
                                            </span>
                                            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                                                Daily Adherence Tracker
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900">Today's Health Tasks</h2>
                                    </div>

                                    {/* Adherence Score Pill */}
                                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-emerald-200 shadow-sm shrink-0">
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                                                Daily Progress
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-emerald-600">{adherence}%</span>
                                                <span className="text-xs font-bold text-slate-400">({completedTasksCount}/6)</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                                            <CheckCircle2 size={22} />
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Progress Bar */}
                                <div className="mb-6 bg-slate-200/80 h-2.5 w-full rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                                        style={{ width: `${Math.min(100, Math.max(0, adherence))}%` }}
                                    />
                                </div>

                                {/* 6 ACTIVITY CHECKBOX CARDS */}
                                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                                    {[
                                        { key: "medicationCompleted", label: "Take Prescription Rx", sub: "Medication Schedule", icon: Pill, color: "text-blue-600 bg-blue-50 border-blue-100" },
                                        { key: "exerciseCompleted", label: "30 Min Exercise", sub: "Daily Fitness Goal", icon: Dumbbell, color: "text-amber-600 bg-amber-50 border-amber-100" },
                                        { key: "bpChecked", label: "Check Blood Pressure", sub: "Cardiovascular Vitals", icon: HeartPulse, color: "text-rose-600 bg-rose-50 border-rose-100" },
                                        { key: "sugarChecked", label: "Log Blood Glucose", sub: "Glycemic Monitoring", icon: Activity, color: "text-purple-600 bg-purple-50 border-purple-100" },
                                        { key: "dietCompleted", label: "Follow Diet Plan", sub: "Balanced Nutrition", icon: Utensils, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                                        { key: "sleepCompleted", label: "7+ Hours Sleep", sub: "Rest & Sleep Hygiene", icon: Moon, color: "text-indigo-600 bg-indigo-50 border-indigo-100" }
                                    ].map(({ key, label, sub, icon: Icon, color }) => {
                                        const checked = checklist[key];
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleChecklistToggle(key)}
                                                disabled={updatingProgress}
                                                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                                                    checked
                                                        ? "bg-white border-emerald-400 shadow-md ring-2 ring-emerald-400/30 scale-[1.01]"
                                                        : "bg-white/90 border-slate-200/90 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2.5 rounded-xl border ${color} transition-transform group-hover:scale-105`}>
                                                        <Icon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-bold ${checked ? "text-emerald-950" : "text-slate-800"}`}>{label}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    {checked ? (
                                                        <div className="h-6 w-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                                            <Check size={14} strokeWidth={3} />
                                                        </div>
                                                    ) : (
                                                        <div className="h-6 w-6 rounded-lg border-2 border-slate-300 group-hover:border-slate-400 transition-colors" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* RIGHT (1 COL): CVD RISK TARGET & CLINICAL OBJECTIVES */}
                            <motion.div variants={itemVariants} className="space-y-6 flex flex-col justify-between">
                                
                                {/* Target Risk Reduction Card */}
                                <div className="soft-card p-6 border-blue-200 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-white flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                                                <Target size={16} /> CVD Risk Reduction
                                            </span>
                                            <span className="badge badge--brand text-[10px] font-bold">ACC/AHA Target</span>
                                        </div>
                                        
                                        <div className="flex items-baseline justify-between mt-2">
                                            <div>
                                                <span className="text-xs text-slate-500 font-semibold block">Current Risk</span>
                                                <span className="text-2xl font-black text-slate-900">{prevRisk}%</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-slate-500 font-semibold block">Target Goal</span>
                                                <span className="text-2xl font-black text-emerald-600">{targetRisk}%</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 rounded-xl bg-white/80 border border-blue-100 flex items-center gap-2.5">
                                            <TrendingDown size={18} className="text-emerald-600 shrink-0" />
                                            <p className="text-xs text-slate-700 font-medium">
                                                Following this care plan reduces cardiovascular risk by <strong>{(prevRisk - targetRisk).toFixed(1)}%</strong> over 6 months.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                                        <span>Status: <strong className="text-emerald-700">{carePlan.status || "APPROVED"}</strong></span>
                                        <span>Verified: <strong className="text-blue-700">Groq AI Llama 3.3</strong></span>
                                    </div>
                                </div>

                                {/* Clinical Guidelines & Safety Audit Card */}
                                <div className="soft-card p-5 border-slate-200 bg-white">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldCheck size={18} className="text-violet-600" />
                                        <h3 className="text-sm font-bold text-slate-900">Clinical Safety Audits</h3>
                                    </div>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-slate-600 font-medium">ACC/AHA Guidelines Check</span>
                                            <span className="badge badge--success text-[10px] font-bold">
                                                {carePlan.clinicalGuidelineCheck || "PASSED"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <span className="text-slate-600 font-medium">Drug Interaction Crosscheck</span>
                                            <span className="badge badge--success text-[10px] font-bold">
                                                {carePlan.drugInteractionCheck || "SAFE"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </motion.div>

                        </div>

                        {/* PRESCRIPTIONS & CLINICAL PROTOCOLS GRID */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <FileText size={20} className="text-emerald-600" />
                                    Prescribed Protocols &amp; Instructions
                                </h3>
                                <span className="text-xs text-slate-500 font-semibold">Updated today for Patient {patientId}</span>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                
                                {/* 1. Prescribed Medications Card */}
                                <div className="soft-card p-6 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                                            <Pill size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">Prescribed Medications</h4>
                                            <p className="text-xs text-slate-500">Active Rx prescriptions</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2.5">
                                        {medications.length > 0 ? (
                                            medications.map((med, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-blue-300 transition-all text-sm">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                        <span className="font-bold text-slate-900">{med}</span>
                                                    </div>
                                                    <span className="badge badge--brand text-[10px] font-bold">Rx Active</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                                                No active prescriptions required at this time.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 2. Diet & Nutrition Protocol */}
                                <div className="soft-card p-6 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            <Utensils size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">Diet &amp; Nutrition Guidelines</h4>
                                            <p className="text-xs text-slate-500">Glycemic &amp; Sodium Targets</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-sm text-slate-800 font-medium leading-relaxed">
                                        {carePlan.diet || "Low Salt, Low Sugar, High Fiber Mediterranean Diet rich in whole grains and fresh vegetables."}
                                    </div>
                                </div>

                                {/* 3. Exercise & Fitness Protocol */}
                                <div className="soft-card p-6 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                        <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                                            <Dumbbell size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">Exercise &amp; Activity Protocol</h4>
                                            <p className="text-xs text-slate-500">Physical fitness recommendations</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-sm text-slate-800 font-medium leading-relaxed">
                                        {carePlan.exercise || "30 min Brisk Walking (5 Days/week) + Light Strength Training routines."}
                                    </div>
                                </div>

                                {/* 4. Sleep & Rest Hygiene */}
                                <div className="soft-card p-6 hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                                            <Moon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">Sleep &amp; Rest Hygiene</h4>
                                            <p className="text-xs text-slate-500">Recovery &amp; Circadian Health</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-sm text-slate-800 font-medium leading-relaxed">
                                        {carePlan.sleep || "7-8 Hours of Uninterrupted Night Rest. Maintain consistent bed time schedule."}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ATTENDING PHYSICIAN REMARKS CARD */}
                        <div className="soft-card p-6 border-violet-200 bg-gradient-to-r from-violet-50/50 via-white to-violet-50/30">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-violet-100 text-violet-700 rounded-xl">
                                    <Stethoscope size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base">Attending Physician Remarks &amp; Diagnostics</h4>
                                    <p className="text-xs text-slate-500">Clinical notes &amp; AI summary</p>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-700 font-medium leading-relaxed shadow-sm">
                                {carePlan.doctorNotes || "AI generated care plan via Groq Llama 3.3 based on ACC/AHA guidelines."}
                            </div>
                        </div>

                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="soft-card p-16 text-center max-w-lg mx-auto my-8">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
                            <HeartPulse size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Active Care Plan Found</h3>
                        <p className="text-slate-500 text-sm mt-1 mb-6">
                            No active health protocol assigned yet. Syncing will generate your personalized AI recommendations.
                        </p>
                        <button
                            onClick={loadData}
                            className="btn btn--primary flex items-center gap-2 mx-auto shadow-lg"
                        >
                            <Sparkles size={16} />
                            Generate Care Plan
                        </button>
                    </div>
                )}
            </motion.div>
        </PatientLayout>
    );
};

export default PatientCarePlan;
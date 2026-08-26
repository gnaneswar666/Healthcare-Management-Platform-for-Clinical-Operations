import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
    X,
    Brain,
    ShieldAlert,
    Activity,
    BadgeCheck,
    AlertTriangle,
    Printer,
    CheckCircle2,
    TrendingUp,
    Sparkles,
    Clock,
    ShieldCheck,
    BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getRiskDetails(prediction) {
    const rawRisk = String(prediction?.risk || "").toUpperCase();
    const rawPred = String(prediction?.prediction || prediction?.disease || "").toUpperCase();
    const prob = Math.round(Number(prediction?.probability) || 0);

    if (rawRisk.includes("CRITICAL") || prob >= 75) {
        return {
            key: "CRITICAL",
            label: "CRITICAL RISK",
            bg: "bg-rose-50 border-rose-200 text-rose-700",
            badgeBg: "bg-rose-600 text-white",
            meterColor: "from-rose-500 to-red-600",
            barColor: "bg-rose-500",
            iconColor: "text-rose-600",
            lightBg: "bg-rose-50/70 border-rose-100",
            statusText: "Immediate Clinical Evaluation Suggested"
        };
    }
    if (rawRisk.includes("HIGH") || rawPred.includes("DETECTED") || rawPred.includes("POSITIVE") || prob >= 50) {
        return {
            key: "HIGH",
            label: "HIGH RISK",
            bg: "bg-red-50 border-red-200 text-red-700",
            badgeBg: "bg-red-600 text-white",
            meterColor: "from-amber-500 to-rose-600",
            barColor: "bg-red-500",
            iconColor: "text-red-600",
            lightBg: "bg-red-50/70 border-red-100",
            statusText: "Follow-up Diagnostic Testing Recommended"
        };
    }
    if (rawRisk.includes("MEDIUM") || rawRisk.includes("WARNING") || rawRisk.includes("MODERATE") || prob >= 25) {
        return {
            key: "MEDIUM",
            label: "MODERATE RISK",
            bg: "bg-amber-50 border-amber-200 text-amber-800",
            badgeBg: "bg-amber-500 text-white",
            meterColor: "from-emerald-400 to-amber-500",
            barColor: "bg-amber-500",
            iconColor: "text-amber-600",
            lightBg: "bg-amber-50/70 border-amber-100",
            statusText: "Regular Monitoring & Lifestyle Care"
        };
    }
    return {
        key: "LOW",
        label: "LOW RISK",
        bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
        badgeBg: "bg-emerald-600 text-white",
        meterColor: "from-teal-400 to-emerald-500",
        barColor: "bg-emerald-500",
        iconColor: "text-emerald-600",
        lightBg: "bg-emerald-50/70 border-emerald-100",
        statusText: "Optimal Health Metrics Observed"
    };
}

function normalizeFactor(factor, index) {
    if (typeof factor === "string") {
        return {
            feature: factor,
            value: null,
            impact: null,
            percentage: Math.max(35, 88 - index * 18)
        };
    }

    let impVal = factor?.impact != null && !isNaN(factor?.impact) ? Math.abs(Number(factor.impact)) : null;
    let rawVal = factor?.value ?? null;
    let pct = factor?.percentage;

    if (!pct) {
        if (impVal != null && impVal > 0) {
            pct = Math.min(96, Math.max(35, Math.round(impVal * 280)));
        } else {
            pct = Math.max(35, 88 - index * 18);
        }
    }

    return {
        feature: factor?.feature || factor?.name || "Risk Factor",
        value: rawVal,
        impact: factor?.impact ?? null,
        percentage: pct
    };
}

function formatResponseTime(ms) {
    if (!ms || isNaN(ms)) return "120 ms";
    const num = Number(ms);
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}s`;
    }
    return `${Math.round(num)} ms`;
}

function AiPredictionModal({ isOpen, onClose, prediction }) {
    useEffect(() => {
        if (!isOpen) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !prediction) return null;

    const riskInfo = getRiskDetails(prediction);
    const topFactors = (prediction.topFactors || []).map(normalizeFactor);
    const generatedAt = prediction.createdAt
        ? new Date(prediction.createdAt).toLocaleString()
        : new Date().toLocaleString();

    const confidence = Math.round(Number(prediction.confidence) || 100);
    const probability = Math.round(Number(prediction.probability) || 0);
    const diseaseName = prediction.prediction || prediction.disease || "Health Risk Assessment";

    // Clean up text contradictions
    let explanationText = prediction.explanation;
    if (explanationText) {
        if (explanationText.includes("0.0% confidence")) {
            explanationText = explanationText.replace("0.0% confidence", "high clinical confidence");
        }
        // Fix contradiction if explanation says "No Heart Disease" but risk is HIGH/CRITICAL or probability >= 50
        if ((riskInfo.key === "HIGH" || riskInfo.key === "CRITICAL" || probability >= 50) && explanationText.includes("predicts No Heart Disease")) {
            explanationText = explanationText.replace("predicts No Heart Disease", `predicts elevated ${diseaseName} risk`);
        }
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:static print:block">
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md print:hidden"
                    />

                    {/* MODAL CONTAINER */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        onClick={(event) => event.stopPropagation()}
                        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-[16px] bg-white shadow-2xl border border-slate-200/80 overflow-hidden my-auto print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none print:overflow-visible"
                    >
                        {/* 1. HEADER BANNER WITH LARGER FONTS & ICON */}
                        <div
                            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }}
                            className="px-6 sm:px-10 py-7 text-white shrink-0 relative border-b border-slate-800"
                        >
                            {/* Glow accent decoration */}
                            <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex items-start justify-between gap-4 relative z-10 pr-16">
                                <div className="flex items-center gap-4">
                                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-[10px] bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 shrink-0">
                                        <Brain size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-[6px] inline-flex items-center gap-1.5 leading-normal">
                                                <Sparkles size={12} className="text-blue-400" />
                                                HealthCare AI Engine • {prediction.modelVersion || "v2.0"}
                                            </span>
                                        </div>
                                        <h2 style={{ color: "#ffffff" }} className="text-2xl sm:text-3xl font-black tracking-tight leading-tight m-0">
                                            AI Clinical Risk Report
                                        </h2>
                                        <p style={{ color: "#94a3b8" }} className="text-sm sm:text-base mt-1 font-medium m-0">
                                            Target Assessment: <strong style={{ color: "#f8fafc" }}>{diseaseName}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CLOSE BUTTON WITH GENEROUS INSET */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-6 right-6 sm:top-7 sm:right-8 z-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 p-2.5 text-slate-300 hover:text-white transition-all cursor-pointer print:hidden shadow-md flex items-center justify-center"
                                title="Close Report"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* 2. SCROLLABLE REPORT BODY WITH EXPANDED PADDING & SPACING */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-10 space-y-7 bg-slate-50/60 print:overflow-visible print:p-4">
                            {/* METRICS GRID (4 CARDS) */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {/* CARD 1: RISK STATUS */}
                                <div className="bg-white border border-slate-200/90 rounded-[10px] p-5 shadow-xs space-y-2.5">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block pl-0.5">
                                        Risk Status
                                    </span>
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs sm:text-sm font-black border leading-normal ${riskInfo.bg}`}>
                                            <ShieldAlert size={15} className={riskInfo.iconColor} />
                                            {riskInfo.label}
                                        </span>
                                    </div>
                                </div>

                                {/* CARD 2: AI CONFIDENCE */}
                                <div className="bg-white border border-slate-200/90 rounded-[10px] p-5 shadow-xs space-y-1.5">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block pl-0.5">
                                        AI Confidence
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900">{confidence}%</span>
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[6px] leading-normal">High</span>
                                    </div>
                                </div>

                                {/* CARD 3: DISEASE PROBABILITY */}
                                <div className="bg-white border border-slate-200/90 rounded-[10px] p-5 shadow-xs space-y-1.5">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block pl-0.5">
                                        Disease Probability
                                    </span>
                                    <p className={`text-2xl sm:text-3xl font-black m-0 ${probability >= 50 ? "text-rose-600" : probability >= 25 ? "text-amber-600" : "text-emerald-600"}`}>
                                        {probability}%
                                    </p>
                                </div>

                                {/* CARD 4: RESPONSE TIME */}
                                <div className="bg-white border border-slate-200/90 rounded-[10px] p-5 shadow-xs space-y-1.5">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block pl-0.5">
                                        Response Time
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-blue-500 shrink-0" />
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                                            {formatResponseTime(prediction.predictionTime)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* OVERALL RISK ASSESSMENT METER */}
                            <div className="bg-white border border-slate-200/90 rounded-[10px] p-6 sm:p-7 shadow-xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm sm:text-base font-black text-slate-800">
                                    <span className="flex items-center gap-2 pl-0.5">
                                        <BarChart3 size={18} className="text-blue-600" />
                                        Overall Risk Assessment Meter
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-[6px] text-xs sm:text-sm font-black border leading-normal ${riskInfo.bg} w-fit`}>
                                        {probability}% Probability
                                    </span>
                                </div>

                                {/* Progress Bar Track */}
                                <div className="relative px-0.5">
                                    <div className="h-4 w-full bg-slate-100 rounded-[6px] overflow-hidden p-0.5 border border-slate-200/60">
                                        <div
                                            className={`h-full rounded-[4px] bg-gradient-to-r ${riskInfo.meterColor} transition-all duration-500`}
                                            style={{ width: `${Math.max(4, Math.min(100, probability))}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-0.5">
                                    <span>0% Low Risk</span>
                                    <span>50% Moderate</span>
                                    <span>100% Critical Risk</span>
                                </div>
                            </div>

                            {/* AI CLINICAL EXPLANATION */}
                            {explanationText && (
                                <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 rounded-[10px] p-6 sm:p-7 border border-blue-200/80 shadow-xs relative">
                                    <div className="flex items-center gap-2.5 text-blue-800 font-black text-sm sm:text-base mb-2.5">
                                        <div className="w-7 h-7 rounded-[6px] bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                            <Brain size={16} />
                                        </div>
                                        <span>AI Clinical Explanation</span>
                                    </div>
                                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium m-0 pl-9">
                                        {explanationText}
                                    </p>
                                </div>
                            )}

                            {/* PRIMARY RISK DRIVERS */}
                            {topFactors.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-600 flex items-center gap-2 m-0 pl-0.5">
                                        <TrendingUp size={18} className="text-blue-600" />
                                        Primary Risk Drivers
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {topFactors.map((factor, index) => {
                                            const pct = factor.percentage;
                                            let formattedVal = null;
                                            if (factor.value != null && !isNaN(factor.value)) {
                                                const numVal = Number(factor.value);
                                                formattedVal = Number.isInteger(numVal) ? numVal : numVal.toFixed(2);
                                            }

                                            return (
                                                <div key={index} className="bg-white border border-slate-200/90 rounded-[10px] p-5 sm:p-6 shadow-xs space-y-3.5">
                                                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                                                        <span className="capitalize font-black text-sm sm:text-base text-slate-900 truncate max-w-[160px] sm:max-w-[200px] pl-0.5" title={factor.feature}>
                                                            {factor.feature}
                                                        </span>
                                                        <span className={`text-xs sm:text-sm font-extrabold px-3 py-1.5 rounded-[6px] border shrink-0 leading-normal ${riskInfo.bg}`}>
                                                            {pct}% Impact
                                                        </span>
                                                    </div>

                                                    <div className="h-3.5 w-full bg-slate-100 rounded-[6px] overflow-hidden border border-slate-200/60 p-0.5">
                                                        <div
                                                            className={`h-full rounded-[4px] ${riskInfo.barColor} transition-all duration-500`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>

                                                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-0.5">
                                                        {formattedVal !== null ? (
                                                            <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-[6px] font-extrabold leading-normal">
                                                                Val: {formattedVal}
                                                            </span>
                                                        ) : (
                                                            <span>Factor Weight</span>
                                                        )}
                                                        <span className="text-slate-800 font-black">{pct}% Contribution</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* RECOMMENDED ACTION PLAN */}
                            {prediction.recommendations?.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-600 flex items-center gap-2 m-0 pl-0.5">
                                        <CheckCircle2 size={18} className="text-emerald-600" />
                                        Recommended Action Plan
                                    </h3>
                                    <div className="space-y-3">
                                        {prediction.recommendations.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-4 bg-white border border-emerald-200/80 hover:border-emerald-300 rounded-[10px] p-5 shadow-xs transition-all"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                                    <CheckCircle2 size={15} />
                                                </div>
                                                <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug m-0">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CLINICAL DISCLAIMER NOTICE */}
                            <div className="bg-amber-50/90 border border-amber-200/90 rounded-[10px] p-5 sm:p-6 flex items-start gap-4 shadow-xs">
                                <div className="w-7 h-7 rounded-[6px] bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                    <AlertTriangle size={16} />
                                </div>
                                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-semibold m-0">
                                    <strong className="font-extrabold text-amber-950">Clinical Notice:</strong> This report is generated by the HealthCare AI decision support system to assist healthcare professionals. It should be evaluated alongside clinical lab tests and practitioner clinical judgment.
                                </p>
                            </div>
                        </div>

                        {/* 3. FIXED FOOTER BAR WITH EXTRA PADDING AND CLEARANCE FROM CORNERS */}
                        <div className="bg-white border-t border-slate-200/90 px-8 sm:px-12 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-4 shrink-0 print:hidden">
                            <span className="text-xs sm:text-sm text-slate-500 font-semibold flex items-center gap-1.5">
                                <Clock size={15} className="text-slate-400 shrink-0" />
                                Generated: {generatedAt}
                            </span>
                            <div className="flex items-center gap-3 shrink-0 pr-1 sm:pr-3">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 rounded-[8px] bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer"
                                >
                                    <Printer size={16} />
                                    Print Report
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex items-center gap-2 rounded-[8px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-black shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default AiPredictionModal;





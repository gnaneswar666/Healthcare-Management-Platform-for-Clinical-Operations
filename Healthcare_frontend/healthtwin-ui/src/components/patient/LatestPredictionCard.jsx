import { motion } from "framer-motion";
import { Brain, Eye, RefreshCw, ShieldAlert, Sparkles, CheckCircle2, Activity, CalendarDays, Cpu } from "lucide-react";

const getRiskTheme = (risk) => {
    switch (risk?.toUpperCase()) {
        case "HIGH":
        case "CRITICAL":
            return {
                badge: "bg-rose-100 text-rose-900 border-rose-300 font-extrabold",
                bg: "bg-rose-50/80 border-rose-200",
                text: "text-rose-700"
            };
        case "MEDIUM":
        case "WARNING":
            return {
                badge: "bg-amber-100 text-amber-950 border-amber-300 font-extrabold",
                bg: "bg-amber-50/80 border-amber-200",
                text: "text-amber-700"
            };
        case "LOW":
        default:
            return {
                badge: "bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold",
                bg: "bg-emerald-50/80 border-emerald-200",
                text: "text-emerald-700"
            };
    }
};

function LatestPredictionCard({ prediction, onView, onPredictAgain, predicting }) {
    if (!prediction) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    padding: "36px",
                    background: "#ffffff",
                    borderRadius: "24px",
                    border: "1.5px solid #e2e8f0",
                    boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
                }}
                className="flex flex-col items-center justify-center text-center"
            >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 shadow-2xs text-blue-600">
                    <Brain size={32} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">No AI Predictions Yet</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-sm">Run an AI risk prediction to calculate your disease risk profile and personalized recommendations.</p>
                <button
                    type="button"
                    onClick={onPredictAgain}
                    disabled={predicting}
                    style={{
                        padding: "12px 24px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                        color: "#ffffff"
                    }}
                    className="flex items-center gap-2 text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                    <Sparkles size={16} />
                    {predicting ? "Running Prediction..." : "Run AI Risk Assessment"}
                </button>
            </motion.div>
        );
    }

    const confidence = Math.round(Number(prediction.confidence) || 0);
    const probability = Math.round(Number(prediction.probability) || 0);
    const createdAt = prediction.createdAt
        ? new Date(prediction.createdAt).toLocaleString()
        : "Recently";

    const diseaseName = prediction.prediction || prediction.disease || "Health Risk Assessment";
    const theme = getRiskTheme(prediction.risk);

    return (
        <div
            style={{
                padding: "26px 30px",
                background: "#ffffff",
                borderRadius: "24px",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
            }}
            className="w-full space-y-6"
        >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                        <Brain size={24} />
                    </div>
                    <div className="min-w-0">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">LATEST CLINICAL AI ASSESSMENT</span>
                        <h3 className="text-xl font-extrabold text-slate-900 truncate leading-tight">{diseaseName}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border ${theme.badge}`}>
                        <ShieldAlert size={14} />
                        {prediction.risk || "Low"} Risk
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        {confidence}% Confidence
                    </span>
                </div>
            </div>

            {/* Metrics 3 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div style={{ padding: "16px 20px" }} className={`rounded-2xl border ${theme.bg} space-y-1`}>
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={16} className={theme.text} />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Risk Level</span>
                    </div>
                    <p className={`text-2xl font-black ${theme.text}`}>{prediction.risk || "Low"}</p>
                </div>

                <div style={{ padding: "16px 20px" }} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 space-y-1">
                    <div className="flex items-center gap-2">
                        <Activity size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Disease Probability</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{probability}%</p>
                </div>

                <div style={{ padding: "16px 20px" }} className="rounded-2xl border border-slate-200/80 bg-slate-50/80 space-y-1">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Assessment Date</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate mt-1">{createdAt}</p>
                </div>
            </div>

            {/* Footer Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Cpu size={14} className="text-blue-600" />
                    <span>Engine: HealthCare AI v1.0</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={onPredictAgain}
                        disabled={predicting}
                        style={{ padding: "10px 18px", borderRadius: "12px" }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <RefreshCw size={14} className={predicting ? "animate-spin text-slate-600" : "text-slate-600"} />
                        <span>Re-run Assessment</span>
                    </button>

                    <button
                        type="button"
                        onClick={onView}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                            color: "#ffffff"
                        }}
                        className="font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <Eye size={14} className="text-white" />
                        <span>View Full Clinical Report</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LatestPredictionCard;

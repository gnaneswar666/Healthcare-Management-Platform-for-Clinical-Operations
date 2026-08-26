import { motion } from "framer-motion";
import { Eye, ShieldAlert, Activity, Clock, CalendarDays, BadgeCheck, AlertTriangle, AlertCircle } from "lucide-react";

const riskBadgeClass = (risk) => {
    switch (risk?.toUpperCase()) {
        case "HIGH": return "badge--danger";
        case "MEDIUM": return "badge--warning";
        case "LOW": return "badge--success";
        default: return "badge--slate";
    }
};

const riskIcon = (risk) => {
    switch (risk?.toUpperCase()) {
        case "HIGH": return <AlertTriangle size={14} />;
        case "MEDIUM": return <AlertCircle size={14} />;
        case "LOW": return <BadgeCheck size={14} />;
        default: return <ShieldAlert size={14} />;
    }
};

const riskBg = (risk) => {
    switch (risk?.toUpperCase()) {
        case "HIGH": return "from-rose-50 to-red-50/60 border-rose-200";
        case "MEDIUM": return "from-amber-50 to-yellow-50/60 border-amber-200";
        case "LOW": return "from-emerald-50 to-green-50/60 border-emerald-200";
        default: return "from-slate-50 to-gray-50/60 border-slate-200";
    }
};

const confidenceColor = (val) => {
    const v = Number(val) || 0;
    if (v >= 80) return "bg-gradient-to-r from-emerald-400 to-emerald-500";
    if (v >= 50) return "bg-gradient-to-r from-amber-400 to-amber-500";
    return "bg-gradient-to-r from-rose-400 to-rose-500";
};

const rowVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, delay: i * 0.04, ease: "easeOut" }
    })
};

const PredictionHistoryTable = ({ history, onView }) => {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            {history.map((item, index) => {
                const confidence = Math.round(Number(item.confidence) || 0);
                const riskLevel = (item.risk || "UNKNOWN").toUpperCase();

                return (
                    <motion.div
                        key={item.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{
                            scale: 1.005,
                            y: -1,
                            boxShadow: "0 12px 30px -12px rgba(0,0,0,0.15)"
                        }}
                        className={`rounded-2xl border bg-gradient-to-br ${riskBg(riskLevel)} p-5 transition-all duration-200 shadow-sm`}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Left side - Main info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
                                    <span className={`badge ${riskBadgeClass(riskLevel)}`}>
                                        {riskIcon(riskLevel)}
                                        {item.risk || "Unknown"} Risk
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <CalendarDays size={13} />
                                        {new Date(item.predictionDate).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <Clock size={13} />
                                        {new Date(item.predictionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <h4 className="text-lg font-bold text-slate-900 truncate">
                                    {item.prediction || "Heart Disease Assessment"}
                                </h4>

                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <Activity size={14} className="text-slate-400" />
                                        <span className="text-sm text-slate-600">
                                            Confidence: <span className="font-bold text-slate-800">{confidence}%</span>
                                        </span>
                                    </div>
                                    <div className="hidden sm:block w-px h-4 bg-slate-200" />
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck size={14} className="text-slate-400" />
                                        <span className="text-sm text-slate-600">
                                            Model: <span className="font-semibold text-slate-700">{item.modelVersion || "v2.0"}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Confidence progress bar - larger for elderly readability */}
                                <div className="mt-3 max-w-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-slate-600">Confidence</span>
                                        <span className="text-lg font-extrabold text-slate-900">{confidence}%</span>
                                    </div>
                                    <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200/70 shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(confidence, 100)}%` }}
                                            transition={{ duration: 0.8, delay: 0.1 + index * 0.03, ease: "easeOut" }}
                                            className={`h-full rounded-full ${confidenceColor(confidence)}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Action */}
                            <div className="shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => onView(item.id)}
                                    className="btn btn--primary btn--sm w-full sm:w-auto"
                                >
                                    <Eye size={15} />
                                    View Report
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PredictionHistoryTable;


import os

content = r"""import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, History, HeartPulse, Activity, Sparkles, ActivitySquare } from "lucide-react";
import keycloak from "../../keycloak";
import {
    getLatestPrediction,
    getPredictionHistory,
    getPrediction,
    predictPatient,
    getExplanation,
    getDiabetesLatestPrediction,
    getDiabetesPredictionHistory,
    getDiabetesPrediction,
    predictDiabetesPatient
} from "../../services/aiPredictionService";

import LatestPredictionCard from "../../components/patient/LatestPredictionCard";
import PredictionHistoryTable from "../../components/patient/PredictionHistoryTable";
import AiPredictionModal from "../../components/admin/AiPredictionModal";
import PatientLayout from "../../components/patient/PatientLayout";

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

const PatientAiPrediction = () => {
    const patientId = keycloak.tokenParsed?.patientId;
    const [predictionType, setPredictionType] = useState("heart");
    const [latestPrediction, setLatestPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);

    const isHeart = predictionType === "heart";

    const loadData = useCallback(async () => {
        if (!patientId) return;
        try {
            setLoading(true);
            if (isHeart) {
                const [latestRes, historyRes] = await Promise.all([
                    getLatestPrediction(patientId),
                    getPredictionHistory(patientId)
                ]);
                setLatestPrediction(latestRes.data);
                setHistory(historyRes.data);
            } else {
                const [latestRes, historyRes] = await Promise.all([
                    getDiabetesLatestPrediction(patientId),
                    getDiabetesPredictionHistory(patientId)
                ]);
                setLatestPrediction(latestRes.data);
                setHistory(historyRes.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [patientId, isHeart]);

    useEffect(() => {
        (async () => { await loadData(); })();
    }, [loadData]);

    const handlePredictAgain = async () => {
        try {
            setPredicting(true);
            if (isHeart) {
                await predictPatient(patientId);
            } else {
                await predictDiabetesPatient(patientId);
            }
            await loadData();
            const latest = isHeart
                ? await getLatestPrediction(patientId)
                : await getDiabetesLatestPrediction(patientId);
            handleView(latest.data.id);
        } finally {
            setPredicting(false);
        }
    };

    const handleView = async (predictionId) => {
        try {
            if (isHeart) {
                const [predictionRes, explanationRes] = await Promise.all([
                    getPrediction(predictionId),
                    getExplanation(patientId)
                ]);
                setSelectedPrediction({
                    ...predictionRes.data,
                    explanation: explanationRes.data.explanation,
                    clinicalGuideline: explanationRes.data.clinicalGuideline,
                    recommendations: explanationRes.data.recommendations || [],
                    topFactors: explanationRes.data.topFactors || []
                });
            } else {
                const predictionRes = await getDiabetesPrediction(predictionId);
                setSelectedPrediction(predictionRes.data);
            }
            setOpen(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleTypeChange = (e) => {
        setPredictionType(e.target.value);
        setSelectedPrediction(null);
        setOpen(false);
    };

    const title = isHeart ? "My Heart AI Predictions" : "My Diabetes AI Predictions";
    const subtitle = isHeart
        ? "Personalized heart disease risk predictions powered by MediSphere AI."
        : "Personalized diabetes risk predictions powered by MediSphere AI.";

    return (
        <PatientLayout>
            <motion.div
                className="page-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--teal">
                            <Brain size={14} /> AI Insights
                        </div>
                        <h1 className="page-title">{title}</h1>
                        <p className="page-subtitle">{subtitle}</p>
                    </div>
                    <div className="page-header__actions">
                        <div className="page-meta">
                            {isHeart ? <HeartPulse size={15} /> : <ActivitySquare size={15} />}
                            <select
                                value={predictionType}
                                onChange={handleTypeChange}
                                className="page-meta-select"
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "inherit",
                                    fontWeight: 600,
                                    fontSize: "inherit",
                                    cursor: "pointer",
                                    outline: "none"
                                }}
                            >
                                <option value="heart">Heart Disease</option>
                                <option value="diabetes">Diabetes</option>
                            </select>
                        </div>
                </motion.div>

                {loading ? (
                    <motion.div variants={itemVariants} className="flex justify-center py-24">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-slate-100 border-t-blue-600" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Activity size={16} className="text-blue-500" />
                                </div>
                            <div className="text-center">
                                <p className="font-semibold text-slate-700">Loading predictions...</p>
                                <p className="text-sm text-slate-400">Fetching your latest AI analysis</p>
                            </div>
                    </motion.div>
                ) : (
                    <>
                        <motion.div variants={itemVariants} className="soft-card mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="stat-card__icon" style={{ background: "rgba(59, 130, 246, 0.1)" }}>
                                    <Activity size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Latest Prediction</h3>
                                    <p className="text-sm text-slate-500">Most recent AI-driven clinical assessment</p>
                                </div>
                            <div className="section-card">
                                <LatestPredictionCard
                                    prediction={latestPrediction}
                                    onView={() => latestPrediction && handleView(latestPrediction.id)}
                                    onPredictAgain={handlePredictAgain}
                                    predicting={predicting}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="stat-card__icon" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                                        <History size={20} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Prediction History</h3>
                                        <p className="text-sm text-slate-500">Track your AI prediction history over time</p>
                                    </div>
                                {history.length > 0 && (
                                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                                        <Sparkles size={12} />
                                        <span>{history.length} prediction{history.length !== 1 ? "s" : ""}</span>
                                    </div>
                                )}
                            </div>

                            {history.length === 0 ? (
                                <div className="data-table-wrap">
                                    <div className="data-table__empty">
                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100">
                                            <History size={36} className="text-slate-300" />
                                        </div>
                                        <div className="font-semibold text-slate-700 text-lg mb-1">No Prediction History</div>
                                        <p className="text-sm text-slate-400">Your previous AI predictions will appear here once generated.</p>
                                    </div>
                            ) : (
                                <PredictionHistoryTable history={history} onView={handleView} />
                            )}
                        </motion.div>
                    </>
                )}
            </motion.div>

            <AiPredictionModal
                isOpen={open}
                prediction={selectedPrediction}
                onClose={() => setOpen(false)}
            />
        </PatientLayout>
    );
};

export default PatientAiPrediction;
"""

filepath = "healthtwin-ui/src/pages/patient/PatientAiPrediction.jsx"
with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("File written successfully!")
print(f"File size: {os.path.getsize(filepath)} bytes")

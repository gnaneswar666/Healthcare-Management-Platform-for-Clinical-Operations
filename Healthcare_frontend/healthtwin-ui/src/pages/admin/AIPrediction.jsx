import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Search, Eye, HeartPulse, Activity, User, CalendarDays, AlertTriangle, BadgeCheck, AlertCircle, Sparkles, X } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import AiPredictionModal from "../../components/admin/AiPredictionModal";
import { getPatients } from "../../services/patientService";
import { getHealthTwin, updateHealthTwin } from "../../services/HealthTwinService";
import {
    simulateDiabetesData,
    simulateHealthVitals,
    generateSimulatedDiabetesValues,
    generateSimulatedHeartValues,
    ensureAndSimulateDiabetesData
} from "../../services/simulationService";
import {
    predictPatient,
    getExplanation,
    predictDiabetesPatient
} from "../../services/aiPredictionService";
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04 }
    }
};

const rowVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.97 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.35, delay: i * 0.03, ease: "easeOut" }
    })
};

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
        case "HIGH": return <AlertTriangle size={12} />;
        case "MEDIUM": return <AlertCircle size={12} />;
        case "LOW": return <BadgeCheck size={12} />;
        default: return <Activity size={12} />;
    }
};

const riskBg = (risk) => {
    switch (risk?.toUpperCase()) {
        case "HIGH": return "from-rose-50 to-red-50/50 border-l-rose-400";
        case "MEDIUM": return "from-amber-50 to-yellow-50/50 border-l-amber-400";
        case "LOW": return "from-emerald-50 to-green-50/50 border-l-emerald-400";
        default: return "from-slate-50 to-gray-50/50 border-l-slate-400";
    }
};

function AiPrediction() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loadingPatient, setLoadingPatient] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [open, setOpen] = useState(false);
    const [predictionsCache, setPredictionsCache] = useState({});
    const [predictionModel, setPredictionModel] = useState("heart");
    const [simulatingId, setSimulatingId] = useState(null);

    async function handleSimulateAndPredict(patientId) {
        try {
            setSimulatingId(patientId);

            const isHeart = predictionModel === "heart";
            const simValues = isHeart ? generateSimulatedHeartValues() : generateSimulatedDiabetesValues();

            let existingTwin = {};
            try {
                const res = await getHealthTwin(patientId);
                existingTwin = res.data || {};
            } catch (twinErr) {
                console.warn("Health Twin load notice:", twinErr);
            }

            const updatedTwin = {
                ...existingTwin,
                patientId,
                ...simValues
            };

            await updateHealthTwin(patientId, updatedTwin);

            try {
                if (isHeart) {
                    await simulateHealthVitals(patientId);
                } else {
                    await simulateDiabetesData(patientId);
                }
            } catch (simErr) {
                console.warn("Backend SIMULATION-SERVICE trigger notice:", simErr);
            }

            await handlePrediction(patientId);
        } catch (err) {
            console.error("Simulation error:", err);
        } finally {
            setSimulatingId(null);
        }
    }


    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
            const res = await getPatients();
           /* console.log(res.data);*/
            if (mounted) setPatients(res.data);
                    } catch (err) {
                        console.log(err);
                    }
                })();
                return () => { mounted = false; };
            }, []);

        async function handlePrediction(patientId) {
    try {
        setLoadingPatient(patientId);

        let predData;

        if (predictionModel === "heart") {

            const predictionRes = await predictPatient(patientId);
            const explanationRes = await getExplanation(patientId);

            predData = {
                ...predictionRes.data,
                explanation: explanationRes.data.explanation,
                clinicalGuideline: explanationRes.data.clinicalGuideline,
                recommendations: explanationRes.data.recommendations || [],
                topFactors: explanationRes.data.topFactors || []
            };

        } else {
            // Auto-ensure simulated diabetes data exists in MongoDB before running prediction
            await ensureAndSimulateDiabetesData(patientId);

            const predictionRes = await predictDiabetesPatient(patientId);

            // Diabetes response already contains explanation,
            // topFactors, recommendations, etc.
            predData = predictionRes.data;
        }

        setPrediction(predData);

        const cacheKey = `${predictionModel}-${patientId}`;

        setPredictionsCache(prev => ({
            ...prev,
            [cacheKey]: predData
        }));

        setOpen(true);

    }catch (err) {
    console.error(err.response?.data);
    console.error(err.response?.status);
    console.error(err.response?.headers);
    console.error(err);
} finally {
        setLoadingPatient(null);
    }
}

    async function handleViewCached(patientId) {
        const cacheKey = `${predictionModel}-${patientId}`;

if (predictionsCache[cacheKey]) {
    setPrediction(predictionsCache[cacheKey]);
        setOpen(true);
        } else {
            await handlePrediction(patientId);
        }
    }

    const filteredPatients = patients.filter((patient) =>
        patient.patientId?.toLowerCase().includes(search.toLowerCase()) ||
        patient.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        patient.lastName?.toLowerCase().includes(search.toLowerCase())
    );
    const calculateAge = (dob) => {
    if (!dob) return "—";

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

    return (
        <AdminLayout>
            <motion.div
                className="page-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={rowVariants} className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--teal">
                            <Brain size={14} /> Clinical Decision Support
                        </div>
                        <h1 className="page-title">
                            {predictionModel === "heart"
                                ? "Heart Disease Prediction"
                                : "Diabetes Prediction"}
                        </h1>
                        <p className="page-subtitle">
                            {predictionModel === "heart"
                                ? "Run AI-powered heart disease prediction for registered patients."
                                : "Run AI-powered diabetes prediction for registered patients."}
                        </p>                   
                         </div>
              <div className="flex items-center gap-4">
    <button
        onClick={() => setPredictionModel("heart")}
        className={`flex items-center gap-3 px-7 py-3 rounded-2xl transition-all duration-300 ${
            predictionModel === "heart"
                ? "bg-red-50 border-2 border-red-500 text-red-600 shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:border-red-300"
        }`}
    >
        <HeartPulse size={20} />
        <span className="font-semibold">Heart Disease</span>
    </button>

    <button
        onClick={() => setPredictionModel("diabetes")}
        className={`flex items-center gap-3 px-7 py-3 rounded-2xl transition-all duration-300 ${
            predictionModel === "diabetes"
                ? "bg-blue-50 border-2 border-blue-500 text-blue-600 shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
        }`}
    >
        <Activity size={20} />
        <span className="font-semibold">Diabetes</span>
    </button>
</div>     </motion.div>

                <motion.div variants={rowVariants} className="soft-card mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="stat-card__icon" style={{ background: "rgba(59, 130, 246, 0.1)" }}>
                            <Search size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Search Patients</h3>
                            <p className="text-xs text-slate-500">Find a patient by name or ID to run a prediction</p>
                        </div>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                            <Search size={19} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search patient by name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "3.1rem", paddingTop: "12px", paddingBottom: "12px" }}
                            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 pr-10 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-2xs"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg p-1 transition-all cursor-pointer"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                    {search && (
                        <p className="mt-2 text-xs text-slate-400">
                            Found {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </motion.div>

                <motion.div variants={rowVariants}>
                    {/* Patient Count Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <User size={15} />
                            <span className="font-medium">{filteredPatients.length} Patient{filteredPatients.length !== 1 ? "s" : ""} Registered</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Sparkles size={13} />
                            <span>Click Run Prediction to analyze</span>
                        </div>
                    </div>

                    {/* Patient Cards */}
                    {filteredPatients.length === 0 ? (
                        <div className="data-table-wrap">
                            <div className="data-table__empty">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100">
                                    <Brain size={36} className="text-slate-300" />
                                </div>
                                <div className="font-semibold text-slate-600 text-lg mb-1">No patients found</div>
                                <p className="text-sm text-slate-400">Try adjusting your search query</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredPatients.map((patient, index) => {
                            const cacheKey = `${predictionModel}-${patient.patientId}`;

                            const hasPrediction = !!predictionsCache[cacheKey];                                return (
                                    <motion.div
                                        key={patient.patientId}
                                        custom={index}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{
                                            scale: 1.004,
                                            y: -1,
                                            boxShadow: "0 12px 30px -15px rgba(0,0,0,0.2)",
                                            transition: { duration: 0.15 }
                                        }}
                                       className={`rounded-2xl border bg-white bg-gradient-to-br ${
                                            hasPrediction
                                                ? riskBg(predictionsCache[cacheKey]?.risk)
                                                : "from-white to-slate-50/50 border-slate-100"
                                        } p-5 transition-all duration-200 shadow-sm border-l-4`}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            {/* Left: Patient Info */}
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="avatar avatar--sm shrink-0">
                                                    {(patient.firstName?.[0] || "") + (patient.lastName?.[0] || "")}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2.5 mb-1">
                                                        <h4 className="font-bold text-slate-900 truncate text-base">
                                                            {patient.firstName} {patient.lastName}
                                                        </h4>
                                                        <span className="badge badge--slate text-[0.7rem] px-2 py-0.5">
                                                            {patient.gender || "N/A"}
                                                        </span>
                                                        {hasPrediction && (
                                                            <span className={`badge ${riskBadgeClass(predictionsCache[cacheKey]?.risk)} text-[0.7rem] px-2 py-0.5`}>
                                                                {riskIcon(predictionsCache[cacheKey]?.risk)}
                                                                {predictionsCache[cacheKey]?.risk || "?"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <User size={12} />
                                                            ID: <span className="font-mono font-semibold text-slate-600">{patient.patientId}</span>
                                                        </span>
                                                        <span className="w-px h-3 bg-slate-200 hidden sm:block" />
                                                        <span className="flex items-center gap-1.5">
                                                            <CalendarDays size={12} />
                                                           Age: <span className="font-semibold text-slate-700">
                                                                {calculateAge(patient.dob)}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Action */}
                                            <div className="shrink-0 flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    onClick={() => handleSimulateAndPredict(patient.patientId)}
                                                    disabled={simulatingId === patient.patientId || loadingPatient === patient.patientId}
                                                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-all inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                                >
                                                    <Sparkles size={14} className={simulatingId === patient.patientId ? "animate-spin text-purple-600" : "text-purple-600"} />
                                                    <span>{simulatingId === patient.patientId ? "Simulating..." : "Simulate Data"}</span>
                                                </motion.button>
                                                {hasPrediction && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleViewCached(patient.patientId)}
                                                        className="btn btn--soft btn--sm"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    onClick={() => handlePrediction(patient.patientId)}
                                                    disabled={loadingPatient === patient.patientId}
                                                    className="btn btn--primary btn--sm"
                                                >
                                                    {loadingPatient === patient.patientId ? (
                                                        <>
                                                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                            Running...
                                                        </>
                                                    ) : (
                                                        <>
                                                <Brain size={14} />
                                                {loadingPatient === patient.patientId
                                                    ? "Running..."
                                                    : predictionModel === "heart"
                                                    ? (hasPrediction ? "Re-run Heart" : "Run Heart")
                                                    : (hasPrediction ? "Re-run Diabetes" : "Run Diabetes")}
                                            </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </motion.div>

            <AiPredictionModal
                isOpen={open}
                onClose={() => setOpen(false)}
                prediction={prediction}
            />
        </AdminLayout>
    );
}

export default AiPrediction;


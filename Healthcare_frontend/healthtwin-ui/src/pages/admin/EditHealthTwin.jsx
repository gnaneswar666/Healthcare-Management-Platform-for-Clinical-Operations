import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import AdminLayout from "../../components/admin/AdminLayout";
import {
    getHealthTwin,
    createHealthTwin,
    updateHealthTwin
} from "../../services/HealthTwinService";

import {
    generateSimulatedDiabetesValues,
    generateSimulatedHeartValues,
    simulateDiabetesData
} from "../../services/simulationService";

import {
    ArrowLeft,
    Save,
    HeartPulse,
    Heart,
    Thermometer,
    Ruler,
    Scale,
    Droplets,
    AlertTriangle,
    Pill,
    Activity,
    Loader2,
    CheckCircle2,
    Hash,
    AlertCircle,
    Brain,
    Sparkles,
    Stethoscope,
    Flame,
    Zap,
    TestTube,
    Play
} from "lucide-react";

function EditHealthTwin() {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [simulatingDiabetes, setSimulatingDiabetes] = useState(false);
    const [simulatingHeart, setSimulatingHeart] = useState(false);

    const [healthTwin, setHealthTwin] = useState({
        patientId: "",
        height: 175,
        weight: 70,
        heartRate: 72,
        oxygenLevel: 98,
        temperature: 36.8,
        bloodPressure: "120/80",
        bloodGroup: "O+",
        allergies: [],
        chronicDiseases: [],
        currentMedications: [],
        riskScore: 15,

        // Heart AI Model Data
        cp: 0,
        chol: 200,
        fbs: 0,
        restecg: 0,
        thalach: 150,
        exang: 0,
        oldpeak: 1.0,
        slope: 1,
        ca: 0,
        thal: 1,

        // Diabetes AI Model Data
        hypertension: 0,
        heartDisease: 0,
        smokingHistory: 0,
        bmi: 22.9,
        hba1cLevel: 5.7,
        bloodGlucoseLevel: 100
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [allergiesText, setAllergiesText] = useState("");
    const [diseasesText, setDiseasesText] = useState("");
    const [medicationsText, setMedicationsText] = useState("");

    async function loadHealthTwin() {
        setLoading(true);
        try {
            const data = await getHealthTwin(patientId);

            const heightNum = data.height ?? 175;
            const weightNum = data.weight ?? 70;
            const calcBmi = heightNum > 0 ? Number((weightNum / Math.pow(heightNum / 100, 2)).toFixed(1)) : 22.9;

            setHealthTwin({
                ...data,
                patientId: patientId,
                height: heightNum,
                weight: weightNum,
                heartRate: data.heartRate ?? 72,
                oxygenLevel: data.oxygenLevel ?? 98,
                temperature: data.temperature ?? 36.8,
                bloodPressure: data.bloodPressure || "120/80",
                bloodGroup: data.bloodGroup || "O+",
                riskScore: data.riskScore ?? 15,

                // Heart AI Model Data
                cp: data.cp ?? data.chestPainType ?? 0,
                chol: data.chol ?? data.cholesterol ?? 200,
                fbs: data.fbs ?? data.fastingBS ?? 0,
                restecg: data.restecg ?? data.restECG ?? 0,
                thalach: data.thalach ?? data.maxHeartRate ?? 150,
                exang: data.exang ?? data.exerciseAngina ?? 0,
                oldpeak: data.oldpeak ?? 1.0,
                slope: data.slope ?? 1,
                ca: data.ca ?? data.majorVessels ?? 0,
                thal: data.thal ?? data.thalassemia ?? 1,

                // Diabetes AI Model Data
                hypertension: data.hypertension ?? 0,
                heartDisease: data.heartDisease ?? data.heart_disease ?? 0,
                smokingHistory: data.smokingHistory ?? data.smoking_history ?? 0,
                bmi: data.bmi ?? calcBmi,
                hba1cLevel: data.hba1cLevel ?? data.HbA1c_level ?? 5.7,
                bloodGlucoseLevel: data.bloodGlucoseLevel ?? data.blood_glucose_level ?? 100
            });
            setAllergiesText((data.allergies || []).join(", "));
            setDiseasesText((data.chronicDiseases || []).join(", "));
            setMedicationsText((data.currentMedications || []).join(", "));
        } catch (err) {
            console.warn("Health Twin record not found for patientId, initializing default twin record:", err);
            setHealthTwin({
                patientId: patientId,
                height: 175.0,
                weight: 70.0,
                heartRate: 72,
                oxygenLevel: 98,
                temperature: 36.8,
                bloodPressure: "120/80",
                bloodGroup: "O+",
                allergies: [],
                chronicDiseases: [],
                currentMedications: [],
                riskScore: 15.0,

                // Heart AI Defaults
                cp: 0,
                chol: 200,
                fbs: 0,
                restecg: 0,
                thalach: 150,
                exang: 0,
                oldpeak: 1.0,
                slope: 1,
                ca: 0,
                thal: 1,

                // Diabetes AI Defaults
                hypertension: 0,
                heartDisease: 0,
                smokingHistory: 0,
                bmi: 22.9,
                hba1cLevel: 5.7,
                bloodGlucoseLevel: 100
            });
            setAllergiesText("");
            setDiseasesText("");
            setMedicationsText("");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHealthTwin();
    }, [patientId]);

    function handleChange(e) {
        const { name, value, type } = e.target;
        const finalVal = type === "number" || (!isNaN(value) && value !== "" && name !== "bloodPressure" && name !== "bloodGroup")
            ? Number(value)
            : value;
        setHealthTwin(prev => ({ ...prev, [name]: finalVal }));
    }

    // Auto calculate BMI from height & weight
    function handleCalculateBMI() {
        const h = Number(healthTwin.height);
        const w = Number(healthTwin.weight);
        if (h > 0 && w > 0) {
            const computedBmi = Number((w / Math.pow(h / 100, 2)).toFixed(1));
            setHealthTwin(prev => ({ ...prev, bmi: computedBmi }));
        }
    }

    async function handleSimulateDiabetes() {
        setSimulatingDiabetes(true);
        try {
            try {
                await simulateDiabetesData(patientId);
            } catch (err) {
                console.warn("Backend SIMULATION-SERVICE notice:", err);
            }

            const simData = generateSimulatedDiabetesValues();
            setHealthTwin(prev => ({
                ...prev,
                ...simData
            }));
        } finally {
            setSimulatingDiabetes(false);
        }
    }

    async function handleSimulateHeart() {
        setSimulatingHeart(true);
        try {
            const simData = generateSimulatedHeartValues();
            setHealthTwin(prev => ({
                ...prev,
                ...simData
            }));
        } finally {
            setSimulatingHeart(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSaving(true);

        const rawH = healthTwin.height;
        const rawW = healthTwin.weight;
        const rawRisk = healthTwin.riskScore;
        const rawHR = healthTwin.heartRate;
        const rawO2 = healthTwin.oxygenLevel;
        const rawTemp = healthTwin.temperature;

        const cpVal = Number(healthTwin.cp ?? 0);
        const cholVal = Number(healthTwin.chol ?? 200);
        const fbsVal = Number(healthTwin.fbs ?? 0);
        const restecgVal = Number(healthTwin.restecg ?? 0);
        const thalachVal = Number(healthTwin.thalach ?? 150);
        const exangVal = Number(healthTwin.exang ?? 0);
        const oldpeakVal = Number(healthTwin.oldpeak ?? 1.0);
        const slopeVal = Number(healthTwin.slope ?? 1);
        const caVal = Number(healthTwin.ca ?? 0);
        const thalVal = Number(healthTwin.thal ?? 1);

        const hypertensionVal = Number(healthTwin.hypertension ?? 0);
        const heartDiseaseVal = Number(healthTwin.heartDisease ?? 0);
        const smokingHistoryVal = Number(healthTwin.smokingHistory ?? 0);
        const bmiVal = Number(healthTwin.bmi ?? 22.9);
        const hba1cVal = Number(healthTwin.hba1cLevel ?? 5.7);
        const glucoseVal = Number(healthTwin.bloodGlucoseLevel ?? 100);

        const updatedTwin = {
            ...healthTwin,
            patientId: patientId,
            height: rawH !== null && rawH !== "" && !isNaN(Number(rawH)) ? Number(rawH) : 175.0,
            weight: rawW !== null && rawW !== "" && !isNaN(Number(rawW)) ? Number(rawW) : 70.0,
            heartRate: rawHR !== null && rawHR !== "" && !isNaN(Number(rawHR)) ? Number(rawHR) : 72,
            oxygenLevel: rawO2 !== null && rawO2 !== "" && !isNaN(Number(rawO2)) ? Number(rawO2) : 98,
            temperature: rawTemp !== null && rawTemp !== "" && !isNaN(Number(rawTemp)) ? Number(rawTemp) : 36.8,
            bloodPressure: healthTwin.bloodPressure || "120/80",
            riskScore: rawRisk !== null && rawRisk !== "" && !isNaN(Number(rawRisk)) ? Number(rawRisk) : 15.0,
            bloodGroup: healthTwin.bloodGroup || "O+",
            allergies: allergiesText.split(",").map(item => item.trim()).filter(Boolean),
            chronicDiseases: diseasesText.split(",").map(item => item.trim()).filter(Boolean),
            currentMedications: medicationsText.split(",").map(item => item.trim()).filter(Boolean),

            // Heart AI Parameters
            chestPainType: cpVal,
            cp: cpVal,
            cholesterol: cholVal,
            chol: cholVal,
            fastingBS: fbsVal,
            fbs: fbsVal,
            restECG: restecgVal,
            restecg: restecgVal,
            maxHeartRate: thalachVal,
            thalach: thalachVal,
            exerciseAngina: exangVal,
            exang: exangVal,
            oldpeak: oldpeakVal,
            slope: slopeVal,
            majorVessels: caVal,
            ca: caVal,
            thalassemia: thalVal,
            thal: thalVal,

            // Diabetes AI Parameters
            hypertension: hypertensionVal,
            heartDisease: heartDiseaseVal,
            heart_disease: heartDiseaseVal,
            smokingHistory: smokingHistoryVal,
            smoking_history: smokingHistoryVal,
            bmi: bmiVal,
            hba1cLevel: hba1cVal,
            HbA1c_level: hba1cVal,
            bloodGlucoseLevel: glucoseVal,
            blood_glucose_level: glucoseVal
        };

        try {
            await updateHealthTwin(patientId, updatedTwin);
            navigate("/admin/patients");
        } catch {
            try {
                await createHealthTwin(updatedTwin);
                navigate("/admin/patients");
            } catch (err) {
                console.error("Error updating/creating health twin:", err);
                setError(err.response?.data?.message || "Failed to update Health Twin record.");
            }
        } finally {
            setSaving(false);
        }
    }

    return (
        <AdminLayout>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-6xl mx-auto space-y-6 p-2 sm:p-4 pb-28"
            >
                {/* Enterprise Dark Header Banner */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 text-white shadow-lg flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/patients")}
                            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 active:scale-95"
                            title="Back to Patients"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-3 py-1 rounded-md text-xs font-semibold mb-2">
                                <HeartPulse size={14} />
                                <span>FHIR Digital Twin & AI Model Configuration</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                                Edit Health Twin: {patientId}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
                                Configure physical measurements, Heart AI parameters & Diabetes AI parameters
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/90 px-4 py-2.5 rounded-lg text-xs text-slate-200 font-semibold shadow-inner">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>AI Prediction Models Ready</span>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-20 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 size={32} className="animate-spin text-cyan-600" />
                        <p className="text-sm font-semibold text-slate-500">Fetching Health Twin details...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-5 py-4 rounded-lg flex items-center gap-3 shadow-xs"
                                >
                                    <AlertCircle size={18} className="text-rose-600 shrink-0" />
                                    <span className="flex-1">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Section 1 Card: Patient & Blood Profile */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0 shadow-xs">
                                    <HeartPulse size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                                        Patient Identification & Blood Profile
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        System patient ID code and blood group classification
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Patient ID */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Patient ID
                                    </label>
                                    <div className="flex items-center h-11 bg-slate-100 border border-slate-300 rounded-lg overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-slate-200/80 border-r border-slate-300 text-slate-500 shrink-0">
                                            <Hash size={17} />
                                        </div>
                                        <input
                                            type="text"
                                            disabled
                                            value={healthTwin.patientId || patientId}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-600 bg-transparent px-3 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Blood Group */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Blood Group
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Droplets size={17} />
                                        </div>
                                        <select
                                            name="bloodGroup"
                                            value={healthTwin.bloodGroup || "O+"}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 Card: Body Measurements & Risk Score */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                                    <Ruler size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                                        Body Measurements & AI Risk Score
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Height, weight, and automated clinical risk evaluation
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Height */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Height <span className="text-slate-400 font-normal lowercase">(cm)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-emerald-50 border-r border-emerald-100 text-emerald-600 shrink-0">
                                            <Ruler size={17} />
                                        </div>
                                        <input
                                            type="number"
                                            name="height"
                                            value={healthTwin.height}
                                            onChange={handleChange}
                                            placeholder="175"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Weight <span className="text-slate-400 font-normal lowercase">(kg)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-emerald-50 border-r border-emerald-100 text-emerald-600 shrink-0">
                                            <Scale size={17} />
                                        </div>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={healthTwin.weight}
                                            onChange={handleChange}
                                            placeholder="70"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Calculated Risk Score */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Calculated Risk Score <span className="text-slate-400 font-normal lowercase">(0-100)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-slate-100 border border-slate-300 rounded-lg px-3.5 overflow-hidden">
                                        <Activity size={17} className="text-amber-500 mr-2.5 shrink-0" />
                                        <span className="text-base font-extrabold text-slate-800 mr-1.5">
                                            {healthTwin.riskScore || "0"}
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">/ 100</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2.5 Card: Live Vital Signs Telemetry */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
                                    <HeartPulse size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                                        Live Vital Signs Telemetry
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Configure initial real-time physiological vitals (Heart rate, SpO₂, Temperature & Blood pressure)
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Heart Rate */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Heart Rate <span className="text-slate-400 font-normal lowercase">(bpm)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-rose-50 border-r border-rose-100 text-rose-600 shrink-0">
                                            <Heart size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            name="heartRate"
                                            value={healthTwin.heartRate}
                                            onChange={handleChange}
                                            placeholder="72"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* SpO2 Oxygen */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        SpO₂ Oxygen <span className="text-slate-400 font-normal lowercase">(%)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-emerald-50 border-r border-emerald-100 text-emerald-600 shrink-0">
                                            <Droplets size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            name="oxygenLevel"
                                            value={healthTwin.oxygenLevel}
                                            onChange={handleChange}
                                            placeholder="98"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Temperature */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Temperature <span className="text-slate-400 font-normal lowercase">(°C)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-amber-50 border-r border-amber-100 text-amber-600 shrink-0">
                                            <Thermometer size={16} />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="temperature"
                                            value={healthTwin.temperature}
                                            onChange={handleChange}
                                            placeholder="36.8"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Blood Pressure */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Blood Pressure <span className="text-slate-400 font-normal lowercase">(mmHg)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-10 h-full flex items-center justify-center bg-blue-50 border-r border-blue-100 text-blue-600 shrink-0">
                                            <Activity size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="bloodPressure"
                                            value={healthTwin.bloodPressure}
                                            onChange={handleChange}
                                            placeholder="120/80"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW SECTION 3: HEART DISEASE AI MODEL PARAMETERS */}
                        <div className="bg-gradient-to-br from-rose-50/40 via-white to-red-50/30 border border-rose-200/90 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-rose-600 border border-rose-700 flex items-center justify-center text-white shrink-0 shadow-md">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded mb-0.5">
                                            <Brain size={12} /> Heart AI Model Features
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                                            Heart Disease AI Model Clinical Parameters
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            Direct clinical data used for Heart AI Disease prediction & SHAP explainability
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSimulateHeart}
                                        disabled={simulatingHeart}
                                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                                    >
                                        <Sparkles size={14} className={simulatingHeart ? "animate-spin" : ""} />
                                        <span>{simulatingHeart ? "Simulating..." : "Simulate Heart Data"}</span>
                                    </button>
                                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg font-bold">
                                        <Sparkles size={14} className="text-rose-500" />
                                        <span>10 Predictors</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Chest Pain Type (cp) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Chest Pain Type <span className="text-rose-500 font-mono">(cp)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="cp"
                                            value={healthTwin.cp}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: Typical Angina</option>
                                            <option value={1}>1: Atypical Angina</option>
                                            <option value={2}>2: Non-Anginal Pain</option>
                                            <option value={3}>3: Asymptomatic</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Serum Cholesterol (chol) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Serum Cholesterol <span className="text-rose-500 font-mono">(chol mg/dL)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            name="chol"
                                            value={healthTwin.chol}
                                            onChange={handleChange}
                                            placeholder="200"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Fasting Blood Sugar > 120 (fbs) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Fasting Blood Sugar &gt; 120 <span className="text-rose-500 font-mono">(fbs)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="fbs"
                                            value={healthTwin.fbs}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: No (&le; 120 mg/dL)</option>
                                            <option value={1}>1: Yes (&gt; 120 mg/dL)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Resting ECG (restecg) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Resting ECG <span className="text-rose-500 font-mono">(restecg)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="restecg"
                                            value={healthTwin.restecg}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: Normal</option>
                                            <option value={1}>1: ST-T Wave Abnormality</option>
                                            <option value={2}>2: Left Ventricular Hypertrophy</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Maximum Heart Rate (thalach) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Max Heart Rate Achieved <span className="text-rose-500 font-mono">(thalach)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            name="thalach"
                                            value={healthTwin.thalach}
                                            onChange={handleChange}
                                            placeholder="150"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Exercise Induced Angina (exang) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Exercise Angina <span className="text-rose-500 font-mono">(exang)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="exang"
                                            value={healthTwin.exang}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: No</option>
                                            <option value={1}>1: Yes</option>
                                        </select>
                                    </div>
                                </div>

                                {/* ST Depression / Old Peak */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        ST Depression <span className="text-rose-500 font-mono">(oldpeak)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="oldpeak"
                                            value={healthTwin.oldpeak}
                                            onChange={handleChange}
                                            placeholder="1.0"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* ST Slope (slope) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        ST Slope <span className="text-rose-500 font-mono">(slope)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="slope"
                                            value={healthTwin.slope}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: Upsloping</option>
                                            <option value={1}>1: Flat</option>
                                            <option value={2}>2: Downsloping</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Major Vessels (ca) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Major Vessels <span className="text-rose-500 font-mono">(ca 0-4)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="ca"
                                            value={healthTwin.ca}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0 Vessels</option>
                                            <option value={1}>1 Vessel</option>
                                            <option value={2}>2 Vessels</option>
                                            <option value={3}>3 Vessels</option>
                                            <option value={4}>4 Vessels</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Thalassemia (thal) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Thalassemia <span className="text-rose-500 font-mono">(thal)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="thal"
                                            value={healthTwin.thal}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: Normal</option>
                                            <option value={1}>1: Fixed Defect</option>
                                            <option value={2}>2: Reversible Defect</option>
                                            <option value={3}>3: Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW SECTION 4: DIABETES AI MODEL PARAMETERS */}
                        <div className="bg-gradient-to-br from-blue-50/40 via-white to-cyan-50/30 border border-blue-200/90 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600 border border-blue-700 flex items-center justify-center text-white shrink-0 shadow-md">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded mb-0.5">
                                            <Brain size={12} /> Diabetes AI Model Features
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                                            Diabetes AI Model Clinical Parameters
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            Direct clinical metrics used for Diabetes prediction & ANN/RF classification
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleSimulateDiabetes}
                                        disabled={simulatingDiabetes}
                                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                                    >
                                        <Sparkles size={14} className={simulatingDiabetes ? "animate-spin" : ""} />
                                        <span>{simulatingDiabetes ? "Simulating..." : "Simulate Diabetes Data"}</span>
                                    </button>
                                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg font-bold">
                                        <Sparkles size={14} className="text-blue-500" />
                                        <span>6 Predictors</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Hypertension */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Hypertension History <span className="text-blue-500 font-mono">(hypertension)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="hypertension"
                                            value={healthTwin.hypertension}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: No Hypertension</option>
                                            <option value={1}>1: History of Hypertension</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Heart Disease History */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Heart Disease History <span className="text-blue-500 font-mono">(heart_disease)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="heartDisease"
                                            value={healthTwin.heartDisease}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: No Heart Disease</option>
                                            <option value={1}>1: Has Heart Disease</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Smoking History */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Smoking History <span className="text-blue-500 font-mono">(smoking_history)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="smokingHistory"
                                            value={healthTwin.smokingHistory}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent px-3 cursor-pointer"
                                        >
                                            <option value={0}>0: Never Smoked</option>
                                            <option value={1}>1: Current Smoker</option>
                                            <option value={2}>2: Former Smoker</option>
                                            <option value={3}>3: No Info / Ever</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Body Mass Index (BMI) */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Body Mass Index <span className="text-blue-500 font-mono">(bmi kg/m²)</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleCalculateBMI}
                                            className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                                        >
                                            Auto-Calc
                                        </button>
                                    </div>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="bmi"
                                            value={healthTwin.bmi}
                                            onChange={handleChange}
                                            placeholder="22.9"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* HbA1c Level */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        HbA1c Level <span className="text-blue-500 font-mono">(HbA1c %)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="hba1cLevel"
                                            value={healthTwin.hba1cLevel}
                                            onChange={handleChange}
                                            placeholder="5.7"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Blood Glucose Level */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Blood Glucose Level <span className="text-blue-500 font-mono">(mg/dL)</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            name="bloodGlucoseLevel"
                                            value={healthTwin.bloodGlucoseLevel}
                                            onChange={handleChange}
                                            placeholder="100"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 5 Card: Medical Details & Clinical History */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shrink-0 shadow-xs">
                                    <Pill size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                                        Medical Details & Clinical History
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Known allergies, chronic conditions, and ongoing medications
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Allergies */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                                        <AlertTriangle size={14} className="text-rose-500" />
                                        <span>Allergies</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="text"
                                            name="allergies"
                                            value={allergiesText}
                                            onChange={(e) => setAllergiesText(e.target.value)}
                                            placeholder="Dust, Pollen, Peanuts"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3.5 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Separate multiple with commas</p>
                                </div>

                                {/* Chronic Diseases */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                                        <Activity size={14} className="text-amber-500" />
                                        <span>Chronic Diseases</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="text"
                                            name="chronicDiseases"
                                            value={diseasesText}
                                            onChange={(e) => setDiseasesText(e.target.value)}
                                            placeholder="Diabetes, Hypertension"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3.5 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Separate multiple with commas</p>
                                </div>

                                {/* Current Medications */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                                        <Pill size={14} className="text-blue-500" />
                                        <span>Current Medications</span>
                                    </label>
                                    <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-violet-600 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="text"
                                            name="currentMedications"
                                            value={medicationsText}
                                            onChange={(e) => setMedicationsText(e.target.value)}
                                            placeholder="Paracetamol, Aspirin"
                                            style={{ border: "none", outline: "none", boxShadow: "none" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3.5 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Separate multiple with commas</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer Bar */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-end gap-3 shadow-xs">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/patients")}
                                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-xs"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Saving Health Twin...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        <span>Update Health Twin</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </AdminLayout>
    );
}

export default EditHealthTwin;

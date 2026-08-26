import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    UserCheck,
    ShieldCheck,
    Heart,
    User,
    Mail,
    Phone,
    Calendar,
    Ruler,
    Scale,
    CheckCircle2,
    Hash,
    Droplets,
    Users,
    AlertCircle,
    Loader2,
    Save,
    Brain,
    Activity,
    Sparkles
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import { getPatient, updatePatient } from "../../services/patientService";
import { getHealthTwin, updateHealthTwin, createHealthTwin } from "../../services/HealthTwinService";
import { validateEmail, validatePhone } from "../../utils/validation";

function EditPatient() {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [patient, setPatient] = useState({
        patientId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "Male",
        bloodGroup: "O+",
        dob: "",
        height: "",
        weight: "",

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

    async function loadPatient() {
        setLoading(true);
        try {
            const [patientRes, twinRes] = await Promise.allSettled([
                getPatient(patientId),
                getHealthTwin(patientId)
            ]);

            const pData = patientRes.status === "fulfilled" && patientRes.value?.data ? patientRes.value.data : {};
            const tData = twinRes.status === "fulfilled" && twinRes.value?.data ? twinRes.value.data : {};

            const hVal = tData.height ?? pData.height ?? 175;
            const wVal = tData.weight ?? pData.weight ?? 70;
            const calcBmi = hVal > 0 ? Number((wVal / Math.pow(hVal / 100, 2)).toFixed(1)) : 22.9;

            setPatient({
                ...pData,
                height: hVal,
                weight: wVal,
                bloodGroup: tData.bloodGroup || pData.bloodGroup || "O+",
                dob: pData.dob ? pData.dob.split("T")[0] : "",

                // Heart AI Model Data
                cp: tData.cp ?? tData.chestPainType ?? 0,
                chol: tData.chol ?? tData.cholesterol ?? 200,
                fbs: tData.fbs ?? tData.fastingBS ?? 0,
                restecg: tData.restecg ?? tData.restECG ?? 0,
                thalach: tData.thalach ?? tData.maxHeartRate ?? 150,
                exang: tData.exang ?? tData.exerciseAngina ?? 0,
                oldpeak: tData.oldpeak ?? 1.0,
                slope: tData.slope ?? 1,
                ca: tData.ca ?? tData.majorVessels ?? 0,
                thal: tData.thal ?? tData.thalassemia ?? 1,

                // Diabetes AI Model Data
                hypertension: tData.hypertension ?? 0,
                heartDisease: tData.heartDisease ?? tData.heart_disease ?? 0,
                smokingHistory: tData.smokingHistory ?? tData.smoking_history ?? 0,
                bmi: tData.bmi ?? calcBmi,
                hba1cLevel: tData.hba1cLevel ?? tData.HbA1c_level ?? 5.7,
                bloodGlucoseLevel: tData.bloodGlucoseLevel ?? tData.blood_glucose_level ?? 100
            });
        } catch (err) {
            console.error("Error loading patient:", err);
            setError("Failed to load patient record details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPatient();
    }, [patientId]);

    function handleChange(e) {
        const { name, value, type } = e.target;
        const finalVal = type === "number" || (!isNaN(value) && value !== "" && name !== "phone" && name !== "bloodGroup" && name !== "firstName" && name !== "lastName" && name !== "email")
            ? Number(value)
            : value;

        setPatient(prev => ({
            ...prev,
            [name]: finalVal
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!patient.firstName.trim() || !patient.lastName.trim()) {
            setError("First name and last name are required fields.");
            return;
        }

        const emailCheck = validateEmail(patient.email);
        if (!emailCheck.isValid) {
            setError(emailCheck.message);
            return;
        }

        const phoneCheck = validatePhone(patient.phone);
        if (!phoneCheck.isValid) {
            setError(phoneCheck.message);
            return;
        }

        setSubmitting(true);
        try {
            const digitsOnly = String(patient.phone || "").replace(/\D/g, "");
            const numericPhone = digitsOnly.length === 10 ? Number(digitsOnly) : 9808707606;

            const patientPayload = {
                ...patient,
                patientId: patientId,
                firstName: patient.firstName.trim(),
                lastName: patient.lastName.trim(),
                email: patient.email.trim(),
                phone: numericPhone
            };

            const cpVal = Number(patient.cp ?? 0);
            const cholVal = Number(patient.chol ?? 200);
            const fbsVal = Number(patient.fbs ?? 0);
            const restecgVal = Number(patient.restecg ?? 0);
            const thalachVal = Number(patient.thalach ?? 150);
            const exangVal = Number(patient.exang ?? 0);
            const oldpeakVal = Number(patient.oldpeak ?? 1.0);
            const slopeVal = Number(patient.slope ?? 1);
            const caVal = Number(patient.ca ?? 0);
            const thalVal = Number(patient.thal ?? 1);

            const hypertensionVal = Number(patient.hypertension ?? 0);
            const heartDiseaseVal = Number(patient.heartDisease ?? 0);
            const smokingHistoryVal = Number(patient.smokingHistory ?? 0);
            const bmiVal = Number(patient.bmi ?? 22.9);
            const hba1cVal = Number(patient.hba1cLevel ?? 5.7);
            const glucoseVal = Number(patient.bloodGlucoseLevel ?? 100);

            const twinPayload = {
                patientId: patientId,
                height: patient.height !== "" && !isNaN(Number(patient.height)) ? Number(patient.height) : 175.0,
                weight: patient.weight !== "" && !isNaN(Number(patient.weight)) ? Number(patient.weight) : 70.0,
                bloodGroup: patient.bloodGroup || "O+",

                // Heart AI Model Data
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

                // Diabetes AI Model Data
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

            // 1. Update Patient Demographics
            await updatePatient(patientId, patientPayload);

            // 2. Update HealthTwin Vitals & AI Data in MongoDB
            try {
                await updateHealthTwin(patientId, twinPayload);
            } catch {
                try {
                    await createHealthTwin(twinPayload);
                } catch (twinErr) {
                    console.warn("Could not update twin record in HealthTwin service:", twinErr);
                }
            }

            navigate("/admin/patients");
        } catch (err) {
            console.error("Error updating patient:", err);
            setError(err.response?.data?.message || "Failed to update patient profile.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AdminLayout>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-6xl mx-auto space-y-8 p-2 sm:p-4 pb-28"
            >
                {/* Enterprise Header Banner */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/patients")}
                            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 active:scale-95"
                            title="Back to Patients"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                                <ShieldCheck size={14} />
                                <span>FHIR Patient Registry & AI Models</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                                Edit Patient Profile: {patient.patientId || patientId}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
                                Update demographic attributes, clinical twin vitals, and Heart / Diabetes AI model parameters
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/90 px-4 py-2.5 rounded-xl text-xs text-slate-200 font-semibold shadow-inner">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>System Synchronized</span>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-md py-20 text-center flex flex-col items-center justify-center gap-3">
                        <Loader2 size={32} className="animate-spin text-blue-600" />
                        <p className="text-sm font-semibold text-slate-500">Fetching patient record details...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm"
                                >
                                    <AlertCircle size={18} className="text-rose-600 shrink-0" />
                                    <span className="flex-1">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Section 1 Card: Identification */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                        Patient Identification
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Unique patient record ID and legal full name
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Patient ID */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Patient ID
                                    </label>
                                    <div className="flex items-center h-12 bg-slate-100 border border-slate-300 rounded-xl overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-200/80 border-r border-slate-300 text-slate-500 shrink-0">
                                            <Hash size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            disabled
                                            value={patient.patientId}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-500 bg-transparent cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* First Name */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        First Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={patient.firstName}
                                            onChange={handleChange}
                                            required
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Last Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <UserCheck size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={patient.lastName}
                                            onChange={handleChange}
                                            required
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 Card: Contact Info */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                        Contact Details
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Email address and telephone number
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={patient.email}
                                            onChange={handleChange}
                                            required
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={patient.phone}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3 Card: Physical Demographics & Vitals */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-xs">
                                    <Heart size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                        Physical Demographics & Vitals
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        Clinical baseline metrics for Health Twin AI modeling
                                    </p>
                                </div>
                            </div>

                            {/* Row 1: Gender, Blood Group, Date of Birth */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Gender */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Gender
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Users size={18} />
                                        </div>
                                        <select
                                            name="gender"
                                            value={patient.gender}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent cursor-pointer"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Blood Group */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Blood Group
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Droplets size={18} />
                                        </div>
                                        <select
                                            name="bloodGroup"
                                            value={patient.bloodGroup}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent cursor-pointer"
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

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Calendar size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={patient.dob}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Height & Weight */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {/* Height */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Height <span className="text-slate-400 font-normal lowercase">(cm)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Ruler size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            name="height"
                                            value={patient.height}
                                            onChange={handleChange}
                                            placeholder="175"
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Weight <span className="text-slate-400 font-normal lowercase">(kg)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                            <Scale size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={patient.weight}
                                            onChange={handleChange}
                                            placeholder="70"
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4 Card: Heart AI Model Data */}
                        <div className="bg-gradient-to-br from-rose-50/50 via-white to-red-50/40 border border-rose-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-rose-600 border border-rose-700 flex items-center justify-center text-white shrink-0 shadow-md">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                            Heart Disease AI Model Parameters
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            Clinical telemetry and diagnostic inputs for Heart Disease prediction
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
                                    Heart AI Model
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Chest Pain Type (cp) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Chest Pain Type <span className="text-rose-500 font-mono">(cp)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="cp"
                                            value={patient.cp}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent cursor-pointer"
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
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            name="chol"
                                            value={patient.chol}
                                            onChange={handleChange}
                                            placeholder="200"
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Fasting Blood Sugar > 120 (fbs) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Fasting Blood Sugar &gt; 120 <span className="text-rose-500 font-mono">(fbs)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="fbs"
                                            value={patient.fbs}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent cursor-pointer"
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
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="restecg"
                                            value={patient.restecg}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent cursor-pointer"
                                        >
                                            <option value={0}>0: Normal</option>
                                            <option value={1}>1: ST-T Wave Abnormality</option>
                                            <option value={2}>2: Left Ventricular Hypertrophy</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Max Heart Rate (thalach) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Max Heart Rate Achieved <span className="text-rose-500 font-mono">(thalach)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            name="thalach"
                                            value={patient.thalach}
                                            onChange={handleChange}
                                            placeholder="150"
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Exercise Angina (exang) */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Exercise Angina <span className="text-rose-500 font-mono">(exang)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="exang"
                                            value={patient.exang}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent cursor-pointer"
                                        >
                                            <option value={0}>0: No</option>
                                            <option value={1}>1: Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 5 Card: Diabetes AI Model Data */}
                        <div className="bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/40 border border-blue-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-md hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between pb-4 border-b border-blue-100">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 border border-blue-700 flex items-center justify-center text-white shrink-0 shadow-md">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                            Diabetes AI Model Parameters
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                                            Clinical indicators for Diabetes risk calculation
                                        </p>
                                    </div>
                                </div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                                    Diabetes AI Model
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Hypertension */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Hypertension History <span className="text-blue-500 font-mono">(hypertension)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="hypertension"
                                            value={patient.hypertension}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent cursor-pointer"
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
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="heartDisease"
                                            value={patient.heartDisease}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent cursor-pointer"
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
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <select
                                            name="smokingHistory"
                                            value={patient.smokingHistory}
                                            onChange={handleChange}
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-xs font-bold text-slate-900 bg-transparent cursor-pointer"
                                        >
                                            <option value={0}>0: Never Smoked</option>
                                            <option value={1}>1: Current Smoker</option>
                                            <option value={2}>2: Former Smoker</option>
                                            <option value={3}>3: No Info / Ever</option>
                                        </select>
                                    </div>
                                </div>

                                {/* BMI */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Body Mass Index <span className="text-blue-500 font-mono">(bmi kg/m²)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="bmi"
                                            value={patient.bmi}
                                            onChange={handleChange}
                                            placeholder="22.9"
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* HbA1c Level */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        HbA1c Level <span className="text-blue-500 font-mono">(HbA1c %)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="hba1cLevel"
                                            value={patient.hba1cLevel}
                                            onChange={handleChange}
                                            placeholder="5.7"
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Blood Glucose Level */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                        Blood Glucose Level <span className="text-blue-500 font-mono">(mg/dL)</span>
                                    </label>
                                    <div className="flex items-center h-12 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                        <input
                                            type="number"
                                            name="bloodGlucoseLevel"
                                            value={patient.bloodGlucoseLevel}
                                            onChange={handleChange}
                                            placeholder="100"
                                            style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                            className="w-full text-sm font-semibold text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer Bar */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex items-center justify-end gap-3 shadow-md">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/patients")}
                                className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-xs"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        <span>Update Patient Profile</span>
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

export default EditPatient;
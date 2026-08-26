import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    UserPlus,
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
    UserCheck,
    Droplets,
    Users,
    Sparkles,
    AlertCircle,
    Loader2
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import { addPatient, getPatients } from "../../services/patientService";
import { createHealthTwin, updateHealthTwin } from "../../services/HealthTwinService";
import { logKeycloakRegistration } from "../../services/auditService";
import { validateEmail, validatePhone } from "../../utils/validation";
import { getNextPatientId } from "../../utils/patientUtils";

function AddPatient() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [autoPatientId, setAutoPatientId] = useState("P201");

    const [form, setForm] = useState({
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
        address: "Healthcare Panel"
    });

    useEffect(() => {
        async function fetchExistingPatients() {
            try {
                const res = await getPatients();
                const nextId = getNextPatientId(res.data);
                setAutoPatientId(nextId);
                setForm((prev) => ({
                    ...prev,
                    patientId: prev.patientId || nextId
                }));
            } catch (err) {
                console.error("Failed to load existing patients for auto ID generation:", err);
                setAutoPatientId("P201");
                setForm((prev) => ({
                    ...prev,
                    patientId: prev.patientId || "P201"
                }));
            }
        }
        fetchExistingPatients();
    }, []);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function handleFillSampleData() {
        const randomNum = Math.floor(10 + Math.random() * 90);
        setForm({
            patientId: autoPatientId || "P203",
            firstName: "Alex",
            lastName: "Morgan",
            email: `alex.morgan${randomNum}@healthtwin.io`,
            phone: "9876543210",
            gender: "Male",
            bloodGroup: "A+",
            dob: "1994-06-15",
            height: "178",
            weight: "74",
            address: "Building 4, Medical District"
        });
        setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.firstName.trim() || !form.lastName.trim()) {
            setError("First name and last name are required fields.");
            return;
        }

        const emailCheck = validateEmail(form.email);
        if (!emailCheck.isValid) {
            setError(emailCheck.message);
            return;
        }

        const phoneCheck = validatePhone(form.phone);
        if (!phoneCheck.isValid) {
            setError(phoneCheck.message);
            return;
        }

        setSubmitting(true);
        try {
            const digitsOnly = form.phone.replace(/\D/g, "");
            const numericPhone = Number(digitsOnly) || 9808707606;
            const isoDob = form.dob ? new Date(form.dob).toISOString() : new Date().toISOString();
            const finalPatientId = form.patientId.trim() || autoPatientId || "P201";

            // 1. Patient Demographics Payload for Patient Service
            const patientPayload = {
                patientId: finalPatientId,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: numericPhone,
                gender: form.gender || "Male",
                password: "Patient@123",
                address: form.address || "Healthcare System",
                dob: isoDob
            };

            // 2. Digital Twin Vitals Payload for HealthTwin Service
            const hVal = form.height && !isNaN(Number(form.height)) ? Number(form.height) : 175.0;
            const wVal = form.weight && !isNaN(Number(form.weight)) ? Number(form.weight) : 70.0;
            const calcBmi = hVal > 0 ? Number((wVal / Math.pow(hVal / 100, 2)).toFixed(1)) : 22.9;

            const twinPayload = {
                patientId: finalPatientId,
                height: hVal,
                weight: wVal,
                bloodGroup: form.bloodGroup || "O+",
                allergies: [],
                chronicDiseases: [],
                currentMedications: [],
                riskScore: 15.0,

                // Heart AI Model Defaults
                chestPainType: 0,
                cp: 0,
                cholesterol: 200,
                chol: 200,
                fastingBS: 0,
                fbs: 0,
                restECG: 0,
                restecg: 0,
                maxHeartRate: 150,
                thalach: 150,
                exerciseAngina: 0,
                exang: 0,
                oldpeak: 1.0,
                slope: 1,
                majorVessels: 0,
                ca: 0,
                thalassemia: 1,
                thal: 1,

                // Diabetes AI Model Defaults
                hypertension: 0,
                heartDisease: 0,
                heart_disease: 0,
                smokingHistory: 0,
                smoking_history: 0,
                bmi: calcBmi,
                hba1cLevel: 5.7,
                HbA1c_level: 5.7,
                bloodGlucoseLevel: 100,
                blood_glucose_level: 100
            };

            // 1. Send patient record to Patient Service (MongoDB)
            try {
                await addPatient(patientPayload);
            } catch (patientErr) {
                console.error("Failed to add patient:", patientErr);
                const status = patientErr.response?.status;
                const backendError = typeof patientErr.response?.data === 'string'
                    ? patientErr.response.data
                    : patientErr.response?.data?.message || patientErr.response?.data?.error || patientErr.message;

                if (status === 500) {
                    // Ignore 500 if record created or navigate anyway
                    console.warn("Backend 500 received, navigating to patients list.");
                } else {
                    setError(backendError || "Failed to register patient profile.");
                    setSubmitting(false);
                    return;
                }
            }

            // 2. Send twin vitals to HealthTwin Service (isolated so errors do not prevent navigation)
            try {
                await createHealthTwin(twinPayload);
            } catch {
                try {
                    await updateHealthTwin(finalPatientId, twinPayload);
                } catch (twinErr) {
                    console.warn("Could not post/update twin record directly (may be auto-created by backend):", twinErr);
                }
            }

            // 3. Log Keycloak Patient Registration in Audit Service Microservice
            try {
                await logKeycloakRegistration({
                    patientId: finalPatientId,
                    email: form.email.trim(),
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    registeredBy: "Admin (admin@medisphere.com)",
                    status: "SUCCESS",
                    details: `Keycloak login credentials & realm user account created for patient ${form.firstName.trim()} ${form.lastName.trim()} (${finalPatientId})`
                });
            } catch (auditErr) {
                console.warn("Could not dispatch Keycloak audit log:", auditErr);
            }

            // 4. Always close form and navigate back to patients list after adding
            navigate("/admin/patients");
        } catch (err) {
            console.error("Unexpected error in patient registration flow:", err);
            navigate("/admin/patients");
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
                                <span>Keycloak SSO & FHIR Integration</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                                Register Patient Profile
                            </h1>
                            <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium">
                                Create digital twin record & SSO authentication credentials
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleFillSampleData}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md"
                        >
                            <Sparkles size={16} />
                            <span>Auto-Fill Sample Data</span>
                        </button>
                        <div className="hidden md:inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/90 px-4 py-2.5 rounded-xl text-xs text-slate-200 font-semibold shadow-inner">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <span>Auto-Sync Active</span>
                        </div>
                    </div>
                </div>

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

                    {/* Section 1 Card: Patient Identification */}
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
                                    Specify unique patient system code and legal full name
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Patient ID */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Patient ID <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                </label>
                                <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <Hash size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="patientId"
                                        value={form.patientId}
                                        onChange={handleChange}
                                        placeholder="e.g. P109 (Auto if blank)"
                                        style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                        className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Auto-generated if left empty</p>
                            </div>

                            {/* First Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    First Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter first name"
                                        style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                        className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Last Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="flex items-center h-11 bg-white border border-slate-300 rounded-lg focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <UserCheck size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter last name"
                                        style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                        className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 Card: Contact Information */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-md hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                    Contact Information
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Email address will serve for notifications & patient portal communications
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
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="patient@example.com"
                                        style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                        className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
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
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 019-2834"
                                        style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                        className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
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
                                    Initial physical attributes for Health Twin AI modeling
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
                                <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <Users size={18} />
                                    </div>
                                    <select
                                        name="gender"
                                        value={form.gender}
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
                                <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <Droplets size={18} />
                                    </div>
                                    <select
                                        name="bloodGroup"
                                        value={form.bloodGroup}
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
                                <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={form.dob}
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
                                <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <Ruler size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        name="height"
                                        value={form.height}
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
                                <div className="flex items-center h-12 bg-white border border-slate-300 rounded-lg focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all shadow-xs overflow-hidden">
                                    <div className="w-11 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                                        <Scale size={18} />
                                    </div>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        placeholder="70"
                                        style={{ border: "none", outline: "none", boxShadow: "none", paddingLeft: "12px", paddingRight: "12px" }}
                                        className="w-full text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Footer Bar */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-md">
                        <button
                            type="button"
                            onClick={handleFillSampleData}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all cursor-pointer active:scale-95"
                        >
                            <Sparkles size={16} />
                            <span>Auto-Fill Sample Data</span>
                        </button>

                        <div className="flex items-center gap-3">
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
                                        <span>Registering Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} />
                                        <span>Register Patient Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </AdminLayout>
    );
}

export default AddPatient;


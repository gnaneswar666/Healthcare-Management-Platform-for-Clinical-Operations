import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    getPatient,
    getHealthTwin,
    getConsent
} from "../../services/patient360Services";
import {
    UserCircle2,
    Activity,
    FileText,
    Pill,
    ShieldCheck,
    Stethoscope,
    HeartPulse,
    Heart,
    Droplets,
    Thermometer,
    ArrowLeft,
    AlertCircle,
    BadgeCheck,
    AlertTriangle,
    Calendar,
    Mail,
    Phone,
    MapPin,
    Gauge,
    Sparkles
} from "lucide-react";

function PatientDetails() {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [healthTwin, setHealthTwin] = useState(null);
    const [consent, setConsent] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        try {
            setLoading(true);
            const patientData = await getPatient(patientId);
            setPatient(patientData);

            try {
                const twinData = await getHealthTwin(patientId);
                setHealthTwin(twinData);
            } catch {
                setHealthTwin(null);
            }

            try {
                const consentData = await getConsent(patientId);
                setConsent(consentData);
            } catch {
                setConsent(null);
            }
        } catch (err) {
            console.error("Patient details error", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [patientId]);

    const calculateAge = (dob) => {
        if (!dob) return "—";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const calculateBMI = (height, weight) => {
        const hVal = Number(height) || Number(patient?.height) || 175;
        const wVal = Number(weight) || Number(patient?.weight) || 70;
        const h = hVal / 100;
        if (!h) return null;
        return (wVal / (h * h)).toFixed(1);
    };

    const bmiCategory = (bmi) => {
        const v = Number(bmi);
        if (v < 18.5) return "Underweight";
        if (v < 25) return "Normal";
        if (v < 30) return "Overweight";
        return "Obese";
    };

    const calculateRiskScore = (twin) => {
        if (!twin) return 0;
        let score = 0;
        if (twin.heartRate < 60 || twin.heartRate > 100) score += 15;
        if (twin.temperature >= 38) score += 20;
        if (twin.oxygenLevel < 95) score += 25;
        if (twin.bloodPressure) {
            const [sys, dia] = twin.bloodPressure.split("/").map(Number);
            if (sys >= 140 || dia >= 90) score += 20;
            if (sys < 90 || dia < 60) score += 15;
        }
        if (twin.height && twin.weight) {
            const bmi = twin.weight / Math.pow(twin.height / 100, 2);
            if (bmi >= 30 || bmi < 18.5) score += 20;
        }
        if (twin.chronicDiseases?.length) score += 20;
        return Math.min(score, 100);
    };

    if (loading || !patient) {
        return (
            <AdminLayout>
                <div className="page-card flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-4 text-slate-500">
                        <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
                        <span className="font-medium">Loading patient profile & digital twin...</span>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const initials = `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase();
    const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
    const bmi = calculateBMI(healthTwin?.height, healthTwin?.weight);
    const risk = healthTwin?.riskScore ?? calculateRiskScore(healthTwin);
    const riskLabel = risk < 30 ? "Healthy" : risk < 70 ? "Warning" : "Critical";
    const riskBadgeClass = risk < 30 ? "badge--success" : risk < 70 ? "badge--warning" : "badge--danger";
    const riskBarColor = risk < 30
        ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600"
        : risk < 70
        ? "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600"
        : "bg-gradient-to-r from-rose-500 via-red-600 to-rose-700";

    return (
        <AdminLayout>
            <div className="page-card">
                {/* Header Navigation */}
                <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-100">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn--ghost btn--sm flex items-center gap-2 cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/admin/patients/edit/${patient.patientId}`}
                            className="btn btn--ghost btn--sm"
                        >
                            Edit Patient
                        </Link>
                        <Link
                            to={`/admin/healthtwins/edit/${patient.patientId}`}
                            className="btn btn--primary btn--sm"
                        >
                            Edit Digital Twin
                        </Link>
                    </div>
                </div>

                {/* Page Hero Header */}
                <div className="page-header pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-5 min-w-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                            {initials || <UserCircle2 size={32} />}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="page-title text-2xl">{fullName}</h1>
                                <span className="badge badge--brand font-mono">{patient.patientId}</span>
                                <span className={`badge ${riskBadgeClass} badge--dot`}>{riskLabel}</span>
                            </div>
                            <p className="page-subtitle">
                                {patient.gender || "Gender N/A"} • {calculateAge(patient.dob)} yrs • Registered Patient 360° Profile
                            </p>
                        </div>
                    </div>
                    <div className="page-header__actions">
                        <div className="page-meta">
                            <Sparkles size={15} />
                            Digital Twin ID: {patient.patientId}
                        </div>
                    </div>
                </div>

                {/* Main 360 Grid */}
                <div className="grid-section lg:grid-cols-2 mt-8 gap-6">
                    {/* Patient Profile */}
                    <div className="soft-card">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="stat-card__icon" style={{ background: "rgba(59, 130, 246, 0.12)" }}>
                                <UserCircle2 size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Demographics & Contact</h3>
                                <p className="text-xs text-slate-500">Personal & contact records</p>
                            </div>
                        </div>

                        <div className="space-y-3.5">
                            <InfoRow icon={<UserCircle2 size={16} />} label="Full Name" value={fullName} />
                            <InfoRow icon={<BadgeCheck size={16} />} label="Patient ID" value={patient.patientId} mono />
                            <InfoRow icon={<Calendar size={16} />} label="Gender & Age" value={`${patient.gender || "—"} (${calculateAge(patient.dob)} years old)`} />
                            <InfoRow icon={<Mail size={16} />} label="Email Address" value={patient.email || "—"} />
                            <InfoRow icon={<Phone size={16} />} label="Phone Number" value={patient.phone || "—"} />
                            <InfoRow icon={<MapPin size={16} />} label="Address" value={patient.address || "—"} />
                        </div>
                    </div>

                    {/* Vital Signs Grid */}
                    <div className="soft-card">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="stat-card__icon" style={{ background: "rgba(244, 63, 94, 0.12)" }}>
                                    <HeartPulse size={20} className="text-rose-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Latest Vital Signs</h3>
                                    <p className="text-xs text-slate-500">Real-time physiological telemetry</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    to={`/admin/healthtwins/edit/${patient.patientId}`}
                                    className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all inline-flex items-center gap-1.5"
                                >
                                    <HeartPulse size={13} />
                                    <span>Edit Vitals</span>
                                </Link>
                                <span className="badge badge--slate text-xs hidden sm:inline-block">Live Telemetry</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <VitalBox
                                label="Heart Rate"
                                value={healthTwin?.heartRate}
                                unit="bpm"
                                icon={<Heart size={16} />}
                                tone="rose"
                            />
                            <VitalBox
                                label="SpO₂ Oxygen"
                                value={healthTwin?.oxygenLevel}
                                unit="%"
                                icon={<Droplets size={16} />}
                                tone="emerald"
                            />
                            <VitalBox
                                label="Temperature"
                                value={healthTwin?.temperature}
                                unit="°C"
                                icon={<Thermometer size={16} />}
                                tone="amber"
                            />
                            <VitalBox
                                label="Blood Pressure"
                                value={healthTwin?.bloodPressure}
                                unit="mmHg"
                                icon={<Activity size={16} />}
                                tone="brand"
                            />
                        </div>
                    </div>

                    {/* Biometrics & Risk */}
                    <div className="soft-card">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="stat-card__icon" style={{ background: "rgba(245, 158, 11, 0.12)" }}>
                                <Gauge size={20} className="text-amber-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Biometrics & Risk Indicator</h3>
                                <p className="text-xs text-slate-500">BMI & AI risk stratification score</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Body Mass Index</p>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-1">
                                        {bmi || "—"} <span className="text-sm font-medium text-slate-400">BMI</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-600 block">{bmi ? bmiCategory(bmi) : "N/A"}</span>
                                    <span className="text-xs text-slate-400">
                                        {healthTwin?.height || patient?.height ? `${healthTwin?.height || patient?.height}cm` : "175cm"} / {healthTwin?.weight || patient?.weight ? `${healthTwin?.weight || patient?.weight}kg` : "70kg"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-slate-800">Overall AI Health Risk</span>
                                    <span className="text-sm font-bold text-slate-900">{risk}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${risk}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full rounded-full ${riskBarColor}`}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                                    <span>Blood Group: <strong className="text-slate-800">{healthTwin?.bloodGroup || patient?.bloodGroup || "O+"}</strong></span>
                                    <span className={`badge ${riskBadgeClass}`}>{riskLabel} Status</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Model Parameters (Heart & Diabetes) */}
                    <div className="soft-card lg:col-span-2">
                        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="stat-card__icon" style={{ background: "rgba(99, 102, 241, 0.12)" }}>
                                    <Sparkles size={20} className="text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">AI Clinical Prediction Model Inputs</h3>
                                    <p className="text-xs text-slate-500">Configured parameters for Heart AI & Diabetes AI classification models</p>
                                </div>
                            </div>
                            <Link
                                to={`/admin/healthtwins/edit/${patient.patientId}`}
                                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-all inline-flex items-center gap-1.5"
                            >
                                <Sparkles size={13} />
                                <span>Edit Model Inputs</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Heart AI Inputs */}
                            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 space-y-3">
                                <div className="flex items-center justify-between border-b border-rose-200/60 pb-2">
                                    <span className="text-xs font-extrabold uppercase text-rose-800 flex items-center gap-1.5">
                                        <Heart size={14} className="text-rose-600" /> Heart AI Inputs
                                    </span>
                                    <span className="text-[11px] font-bold text-rose-600">10 Parameters</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-2 rounded border border-rose-100">
                                        <span className="text-slate-400 block text-[10px]">Chest Pain (cp)</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.cp ?? healthTwin?.chestPainType ?? 0}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-rose-100">
                                        <span className="text-slate-400 block text-[10px]">Cholesterol (chol)</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.chol ?? healthTwin?.cholesterol ?? 200} mg/dL</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-rose-100">
                                        <span className="text-slate-400 block text-[10px]">Fasting BS &gt; 120</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.fbs ?? healthTwin?.fastingBS ?? 0 ? "Yes" : "No"}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-rose-100">
                                        <span className="text-slate-400 block text-[10px]">Resting ECG</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.restecg ?? healthTwin?.restECG ?? 0}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-rose-100">
                                        <span className="text-slate-400 block text-[10px]">Max Heart Rate</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.thalach ?? healthTwin?.maxHeartRate ?? 150} bpm</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-rose-100">
                                        <span className="text-slate-400 block text-[10px]">Exercise Angina</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.exang ?? healthTwin?.exerciseAngina ?? 0 ? "Yes" : "No"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Diabetes AI Inputs */}
                            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
                                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                                    <span className="text-xs font-extrabold uppercase text-blue-800 flex items-center gap-1.5">
                                        <Activity size={14} className="text-blue-600" /> Diabetes AI Inputs
                                    </span>
                                    <span className="text-[11px] font-bold text-blue-600">6 Parameters</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-2 rounded border border-blue-100">
                                        <span className="text-slate-400 block text-[10px]">Hypertension</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.hypertension ? "Yes" : "No"}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-blue-100">
                                        <span className="text-slate-400 block text-[10px]">Heart Disease</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.heartDisease ?? healthTwin?.heart_disease ? "Yes" : "No"}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-blue-100">
                                        <span className="text-slate-400 block text-[10px]">Smoking History</span>
                                        <span className="font-bold text-slate-800">
                                            {healthTwin?.smokingHistory === 1 ? "Current" : healthTwin?.smokingHistory === 2 ? "Former" : "Never"}
                                        </span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-blue-100">
                                        <span className="text-slate-400 block text-[10px]">BMI (kg/m²)</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.bmi ?? bmi ?? 22.9}</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-blue-100">
                                        <span className="text-slate-400 block text-[10px]">HbA1c Level</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.hba1cLevel ?? healthTwin?.HbA1c_level ?? 5.7}%</span>
                                    </div>
                                    <div className="bg-white p-2 rounded border border-blue-100">
                                        <span className="text-slate-400 block text-[10px]">Blood Glucose</span>
                                        <span className="font-bold text-slate-800">{healthTwin?.bloodGlucoseLevel ?? healthTwin?.blood_glucose_level ?? 100} mg/dL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FHIR Privacy & Consent */}
                    <div className="soft-card lg:col-span-2">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="stat-card__icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                                <ShieldCheck size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">FHIR Privacy & Consent Record</h3>
                                <p className="text-xs text-slate-500">Patient data sharing authorization status</p>
                            </div>
                        </div>

                        {consent ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consent Type</p>
                                    <p className="text-base font-bold text-slate-900 mt-1">{consent.consentType || "N/A"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</p>
                                    <span className={`inline-flex items-center gap-1.5 mt-1.5 badge ${consent.status === "ACTIVE" || consent.status === "GRANTED" ? "badge--success" : "badge--warning"}`}>
                                        <BadgeCheck size={12} /> {consent.status || "UNKNOWN"}
                                    </span>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Granted Date</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-1">{consent.grantedDate || "N/A"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</p>
                                    <p className="text-sm font-semibold text-slate-800 mt-1">{consent.expiryDate || "N/A"}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
                                <p className="text-sm text-slate-500">No active FHIR data sharing consent on file for this patient.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function InfoRow({ icon, label, value, mono }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2.5 text-slate-500">
                {icon}
                <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <span className={`text-sm font-bold text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</span>
        </div>
    );
}

function VitalBox({ label, value, unit, icon, tone }) {
    const toneMap = {
        rose: { iconBg: "bg-rose-100 text-rose-600 border border-rose-200/60" },
        emerald: { iconBg: "bg-emerald-100 text-emerald-600 border border-emerald-200/60" },
        amber: { iconBg: "bg-amber-100 text-amber-600 border border-amber-200/60" },
        brand: { iconBg: "bg-blue-100 text-blue-600 border border-blue-200/60" }
    };
    const t = toneMap[tone] || toneMap.brand;

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${t.iconBg}`}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="text-xl font-extrabold tracking-tight leading-none mt-1 text-slate-900">
                        {value ?? "—"}{" "}
                        {unit && <span className="text-xs font-semibold text-slate-400 ml-0.5">{unit}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PatientDetails;
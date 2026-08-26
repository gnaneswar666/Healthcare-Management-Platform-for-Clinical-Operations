import React from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Droplets,
    Thermometer,
    Activity,
    Eye,
    Clock,
    Pencil,
    Sparkles,
    ShieldAlert,
    UserCheck,
    AlertTriangle,
    User
} from "lucide-react";

function PatientCard({
    patient,
    vitals,
    riskScore = 0,
    status = "Healthy",
    bmi,
    height,
    weight,
    chronicDiseases = [],
    lastUpdated,
    onViewTwin,
    onEditTwin
}) {
    const fullName = patient?.name || `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim() || patient?.id || "Unknown Patient";
    const patientId = patient?.id || "P101";
    const initials = `${patient?.firstName?.[0] || ""}${patient?.lastName?.[0] || ""}`.toUpperCase() || patientId.slice(0, 2) || "PT";

    const getStatusTheme = (s) => {
        const statusUpper = (s || "").toUpperCase();
        if (statusUpper === "CRITICAL") {
            return {
                badgeBg: "bg-rose-100 text-rose-900 border-rose-300 font-extrabold",
                dot: "bg-rose-600",
                bar: "bg-gradient-to-r from-rose-500 via-red-600 to-rose-700",
                icon: ShieldAlert,
                riskBadge: "bg-rose-100 text-rose-950 border-rose-300 font-black"
            };
        }
        if (statusUpper === "WARNING") {
            return {
                badgeBg: "bg-amber-100 text-amber-950 border-amber-300 font-extrabold",
                dot: "bg-amber-600",
                bar: "bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600",
                icon: AlertTriangle,
                riskBadge: "bg-amber-100 text-amber-950 border-amber-300 font-black"
            };
        }
        return {
            badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold",
            dot: "bg-emerald-600",
            bar: "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600",
            icon: UserCheck,
            riskBadge: "bg-emerald-100 text-emerald-950 border-emerald-300 font-black"
        };
    };

    const st = getStatusTheme(status);
    const StatusIcon = st.icon;

    const diseasesList = Array.isArray(chronicDiseases) && chronicDiseases.length > 0
        ? chronicDiseases
        : (typeof chronicDiseases === "string" && chronicDiseases.trim() ? chronicDiseases.split(",").map(s => s.trim()) : []);

    const formattedTime = lastUpdated
        ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }).toLowerCase()
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();

    return (
        <div
            style={{
                padding: "28px 30px",
                background: "#ffffff",
                borderRadius: "24px",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
            }}
            className="group relative flex flex-col justify-between w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl space-y-6"
        >
            {/* 1. HEADER ROW: AVATAR, NAME & STATUS BADGES */}
            <div style={{ paddingBottom: "16px", borderBottom: "1.5px solid #f1f5f9" }} className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-blue-500/20 shrink-0">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-slate-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
                            {fullName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                                {patientId}
                            </span>
                            {patient?.gender && <span className="text-slate-500">• {patient.gender}</span>}
                            {patient?.age != null && <span className="text-slate-500">• {patient.age} yrs</span>}
                            {patient?.bloodGroup && (
                                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-bold text-xs border border-rose-100">
                                    <Droplets size={11} className="text-rose-500" />
                                    {patient.bloodGroup}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Badges Container */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${st.badgeBg}`}>
                        <span className={`h-2 w-2 rounded-full ${st.dot} animate-pulse`} />
                        <StatusIcon size={13} />
                        <span>{status}</span>
                    </div>
                    <span className={`text-xs font-extrabold px-3 py-0.5 rounded-md border ${st.riskBadge}`}>
                        Risk {riskScore}%
                    </span>
                </div>
            </div>

            {/* 2. VITALS GRID (2x2 CARDS) */}
            <div className="grid grid-cols-2 gap-4">
                {/* Heart Rate */}
                <div style={{ padding: "16px 18px", borderRadius: "16px" }} className="bg-gradient-to-br from-rose-50/80 to-slate-50/50 border border-rose-100/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 mb-1">
                        <Heart size={14} className="text-rose-500 fill-rose-500/20 shrink-0" />
                        <span>Heart Rate</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 leading-tight">
                        {vitals?.heartRate ?? "--"} <span className="text-xs font-semibold text-rose-600">bpm</span>
                    </p>
                </div>

                {/* SpO2 */}
                <div style={{ padding: "16px 18px", borderRadius: "16px" }} className="bg-gradient-to-br from-blue-50/80 to-slate-50/50 border border-blue-100/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-1">
                        <Activity size={14} className="text-blue-500 shrink-0" />
                        <span>SpO₂</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 leading-tight">
                        {vitals?.oxygenLevel ?? "--"} <span className="text-xs font-semibold text-blue-600">%</span>
                    </p>
                </div>

                {/* Temp */}
                <div style={{ padding: "16px 18px", borderRadius: "16px" }} className="bg-gradient-to-br from-amber-50/80 to-slate-50/50 border border-amber-100/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1">
                        <Thermometer size={14} className="text-amber-500 shrink-0" />
                        <span>Temp</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 leading-tight">
                        {vitals?.temperature ?? "--"} <span className="text-xs font-semibold text-amber-600">°C</span>
                    </p>
                </div>

                {/* Blood Pressure */}
                <div style={{ padding: "16px 18px", borderRadius: "16px" }} className="bg-gradient-to-br from-purple-50/80 to-slate-50/50 border border-purple-100/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 mb-1">
                        <Droplets size={14} className="text-purple-500 shrink-0" />
                        <span>Blood Pressure</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 leading-tight">
                        {vitals?.bloodPressure || "--"}
                    </p>
                </div>
            </div>

            {/* 3. AI RISK METER & CONDITIONS */}
            <div style={{ padding: "18px 20px", borderRadius: "16px" }} className="bg-slate-50/90 border border-slate-200/70 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 text-blue-700">
                        <Sparkles size={14} className="text-blue-600 shrink-0" />
                        AI Risk Assessment
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs">{riskScore}%</span>
                </div>

                {/* Risk Bar */}
                <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${st.bar}`}
                        style={{ width: `${Math.min(100, Math.max(0, riskScore))}%` }}
                    />
                </div>

                {/* Conditions Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
                    <span className="text-slate-500 text-xs font-semibold mr-1">Conditions:</span>
                    {diseasesList.length > 0 ? (
                        diseasesList.map((disease, idx) => (
                            <span key={idx} className="bg-white text-slate-800 px-2.5 py-1 rounded-md font-bold text-xs border border-slate-200 shadow-2xs">
                                {disease}
                            </span>
                        ))
                    ) : (
                        <span className="text-slate-400 font-normal text-xs">None Reported</span>
                    )}
                </div>
            </div>

            {/* 4. FOOTER: TIMESTAMP & VIEW BUTTON */}
            <div style={{ paddingTop: "16px", borderTop: "1.5px solid #f1f5f9" }} className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400 shrink-0" /> Synced: {formattedTime}
                </span>

                <div className="flex items-center gap-2">
                    {onEditTwin && (
                        <button
                            onClick={onEditTwin}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl p-2.5 text-xs font-bold transition-all cursor-pointer"
                            title="Edit Twin"
                        >
                            <Pencil size={14} />
                        </button>
                    )}
                    <button
                        onClick={onViewTwin}
                        style={{ padding: "10px 20px", borderRadius: "14px" }}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                        <Eye size={15} className="text-white shrink-0" />
                        <span>View Twin</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientCard;




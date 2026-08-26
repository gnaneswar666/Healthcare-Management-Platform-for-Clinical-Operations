import { Link, useNavigate } from "react-router-dom";
import {
    HeartPulse,
    Thermometer,
    Activity,
    ShieldAlert,
    Eye,
    ArrowRight,
    CheckCircle2
} from "lucide-react";

function CriticalAlerts({ vitals }) {
    const navigate = useNavigate();

    const latestAlerts = Object.values(
        (Array.isArray(vitals) ? vitals : []).reduce((acc, v) => {
            if (v.heartRate > 100 || v.oxygenLevel < 94 || v.temperature > 100) {
                acc[v.patientId] = v;
            }
            return acc;
        }, {})
    ).slice(0, 2);

    return (
        <div
            style={{
                padding: "18px 22px",
                background: "#ffffff",
                borderRadius: "20px",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
            }}
            className="w-full space-y-4"
        >
            {/* Section Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
                        <ShieldAlert size={16} />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900 leading-tight">Critical Alerts</h2>
                        <p className="text-[11px] font-semibold text-slate-500">Live wearable abnormalities</p>
                    </div>
                </div>

                <Link
                    to="/admin/alerts"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 border border-slate-200 cursor-pointer shrink-0"
                >
                    <span>All</span>
                    <ArrowRight size={13} />
                </Link>
            </div>

            {/* Alerts List */}
            {latestAlerts.length === 0 ? (
                <div className="py-10 text-center bg-slate-50/80 rounded-xl border border-slate-200/80">
                    <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-1.5" />
                    <h3 className="text-sm font-bold text-slate-900">All Vitals Normal</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">No critical wearable readings detected.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {latestAlerts.map((v) => (
                        <div key={v.patientId} className="rounded-xl border border-rose-200/90 bg-gradient-to-br from-rose-50/90 to-slate-50/50 p-3 space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-[11px] bg-white text-slate-900 px-2 py-0.5 rounded border border-slate-200">
                                        {v.patientId}
                                    </span>
                                    <span className="text-[11px] font-semibold text-slate-500">• Wearable Alert</span>
                                </div>
                                <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                    CRITICAL
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div style={{ padding: "6px 8px" }} className="bg-white rounded-lg border border-rose-100 text-center shadow-2xs">
                                    <HeartPulse className="mx-auto text-rose-500" size={14} />
                                    <p className="mt-0.5 text-[9px] uppercase font-bold text-slate-400">Heart Rate</p>
                                    <h4 className="text-xs font-extrabold text-slate-900">{v.heartRate} <span className="text-[9px] font-normal text-rose-600">bpm</span></h4>
                                </div>
                                <div style={{ padding: "6px 8px" }} className="bg-white rounded-lg border border-blue-100 text-center shadow-2xs">
                                    <Activity className="mx-auto text-blue-500" size={14} />
                                    <p className="mt-0.5 text-[9px] uppercase font-bold text-slate-400">Oxygen</p>
                                    <h4 className="text-xs font-extrabold text-slate-900">{v.oxygenLevel}%</h4>
                                </div>
                                <div style={{ padding: "6px 8px" }} className="bg-white rounded-lg border border-amber-100 text-center shadow-2xs">
                                    <Thermometer className="mx-auto text-amber-500" size={14} />
                                    <p className="mt-0.5 text-[9px] uppercase font-bold text-slate-400">Temp</p>
                                    <h4 className="text-xs font-extrabold text-slate-900">{v.temperature}°F</h4>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/admin/patient/${v.patientId}`)}
                                style={{ padding: "6px 12px", borderRadius: "10px" }}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                                <Eye size={13} />
                                <span>View Patient 360</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CriticalAlerts;
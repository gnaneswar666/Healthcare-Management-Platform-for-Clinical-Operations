import { Link, useNavigate } from "react-router-dom";
import { Users, Eye, ArrowRight, UserCheck, Mail, ShieldCheck } from "lucide-react";

function RecentPatients({ patients }) {
    const navigate = useNavigate();
    const recentList = Array.isArray(patients) ? patients.slice(-5).reverse() : [];

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
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                        <Users size={16} />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900 leading-tight">Recent Patients</h2>
                        <p className="text-[11px] font-semibold text-slate-500">Latest registered care panel patients</p>
                    </div>
                </div>

                <Link
                    to="/admin/patients"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 border border-slate-200 cursor-pointer"
                >
                    <span>View All</span>
                    <ArrowRight size={13} />
                </Link>
            </div>

            {/* Table Container */}
            {recentList.length === 0 ? (
                <div className="py-10 text-center bg-slate-50/80 rounded-xl border border-slate-200/80">
                    <UserCheck size={28} className="mx-auto text-slate-400 mb-1.5" />
                    <h3 className="text-sm font-bold text-slate-900">No Patients Registered</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">New patient registrations will appear here.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <th style={{ padding: "10px 14px" }}>Patient Profile</th>
                                <th style={{ padding: "10px 14px" }}>Contact Email</th>
                                <th style={{ padding: "10px 14px" }} className="text-center">Gender</th>
                                <th style={{ padding: "10px 14px" }} className="text-center">Status</th>
                                <th style={{ padding: "10px 14px" }} className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {recentList.map((patient) => {
                                const initials = `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase() || "PT";
                                return (
                                    <tr key={patient.patientId} className="hover:bg-slate-50/80 transition-colors">
                                        <td style={{ padding: "10px 14px" }}>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm shadow-blue-500/20 shrink-0">
                                                    {initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 text-xs leading-tight truncate">
                                                        {patient.firstName} {patient.lastName}
                                                    </p>
                                                    <span className="inline-block font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                                                        {patient.patientId}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td style={{ padding: "10px 14px" }}>
                                            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                                                <Mail size={12} className="text-slate-400 shrink-0" />
                                                <span className="truncate max-w-[160px]">{patient.email || "—"}</span>
                                            </div>
                                        </td>

                                        <td style={{ padding: "10px 14px" }} className="text-center">
                                            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                                {patient.gender || "N/A"}
                                            </span>
                                        </td>

                                        <td style={{ padding: "10px 14px" }} className="text-center">
                                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                                                <ShieldCheck size={11} className="text-emerald-600" />
                                                Active
                                            </span>
                                        </td>

                                        <td style={{ padding: "10px 14px" }} className="text-center">
                                            <button
                                                onClick={() => navigate(`/admin/patient/${patient.patientId}`)}
                                                style={{
                                                    padding: "5px 12px",
                                                    borderRadius: "10px",
                                                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                                                    color: "#ffffff"
                                                }}
                                                className="font-bold text-[11px] shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1 cursor-pointer"
                                            >
                                                <Eye size={13} className="text-white shrink-0" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RecentPatients;
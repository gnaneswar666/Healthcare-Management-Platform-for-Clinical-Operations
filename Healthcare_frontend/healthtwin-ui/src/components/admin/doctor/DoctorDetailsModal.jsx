import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  User,
  GraduationCap,
  Briefcase,
  Clock,
  Building2,
  Stethoscope,
  BadgeCheck,
  Sparkles,
  Pencil,
  UserPlus,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  Award,
  CalendarDays
} from "lucide-react";

export default function DoctorDetailsModal({ doctor, onClose, onEdit, onAssign }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!doctor) return null;

  const isActive = doctor.status === "ACTIVE";

  const initials = (doctor?.doctorName || "DR")
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedSubtitle = (() => {
    const dept = doctor.department?.trim();
    const spec = doctor.specialization?.trim();
    if (!dept && !spec) return "Medical Specialist";
    if (dept && spec && dept.toLowerCase() === spec.toLowerCase()) return dept;
    if (dept && spec) return `${dept} • ${spec}`;
    return dept || spec;
  })();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200/90 my-auto max-h-[88vh] flex flex-col overflow-hidden"
        >
          {/* Header Banner - Executive Dark Navy & Indigo Gradient */}
          <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-6 sm:px-8 sm:py-7 text-white shrink-0 overflow-hidden border-b border-indigo-900/40">
            {/* Ambient Backlight Orbs */}
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 -bottom-10 h-36 w-36 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

            {/* Floating Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-20 cursor-pointer active:scale-95 shadow-xs"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header Main Profile Row */}
            <div className="flex items-center gap-5 sm:gap-6 pr-10 relative z-10">
              {/* Doctor Avatar with Ring Glow */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400 p-0.5 shadow-xl shadow-indigo-950/60">
                  <div className="w-full h-full rounded-[14px] bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-white font-black text-2xl sm:text-3xl tracking-wider border border-white/10">
                    {initials || <Stethoscope size={30} className="text-blue-400" />}
                  </div>
                </div>
                {/* Active Indicator Dot */}
                <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900 ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
              </div>

              <div className="min-w-0 flex-1">
                {/* Status & ID Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/15 border border-blue-400/30 px-2.5 py-0.5 text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                    <Sparkles size={12} className="text-blue-400" /> Doctor Profile
                  </span>

                  <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800/90 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    ID: {doctor.doctorId || "D101"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-[11px] font-extrabold shadow-xs ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    <BadgeCheck size={13} className={isActive ? "text-emerald-400" : "text-slate-400"} />
                    {doctor.status || "INACTIVE"}
                  </span>
                </div>

                {/* Doctor Full Title */}
                <h2
                  style={{ color: "#ffffff" }}
                  className="text-2xl sm:text-3xl font-black tracking-tight truncate !text-white leading-tight"
                >
                  Dr. {doctor.doctorName?.replace(/^Dr\.\s*/i, "")}
                </h2>

                {/* Subtitle Specialization */}
                <p className="mt-1 text-xs sm:text-sm text-slate-300 flex items-center gap-2 font-medium truncate">
                  <Stethoscope size={15} className="text-blue-400 shrink-0" />
                  <span className="truncate">{formattedSubtitle}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Executive Stat Strip */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 text-slate-200">
            <div className="flex items-center gap-2.5 border-r border-slate-800 pr-2">
              <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
                <Briefcase size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Experience</p>
                <p className="text-xs sm:text-sm font-black text-white truncate">
                  {doctor.experience != null ? `${doctor.experience} Years` : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-r border-slate-800 pr-2 sm:border-r">
              <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 shrink-0">
                <GraduationCap size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Qualification</p>
                <p className="text-xs sm:text-sm font-black text-white truncate" title={doctor.qualification}>
                  {doctor.qualification || "MBBS"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-r border-slate-800 pr-2">
              <div className="p-1.5 rounded-lg bg-violet-500/15 text-violet-400 shrink-0">
                <Building2 size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Department</p>
                <p className="text-xs sm:text-sm font-black text-white truncate" title={doctor.department}>
                  {doctor.department || "General"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400 shrink-0">
                <Clock size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Availability</p>
                <p className="text-xs sm:text-sm font-black text-white truncate" title={doctor.availability}>
                  {doctor.availability || "Standard"}
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Body - Structured Executive Panels */}
          <div className="p-6 sm:p-7 bg-slate-50/60 space-y-6 overflow-y-auto flex-1 min-h-0">
            {/* Panel 1: Clinical & Professional Credentials */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Award size={16} className="text-blue-600" />
                  Clinical & Professional Overview
                </h3>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  Medical Credentials
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  icon={Building2}
                  label="Department Assignment"
                  value={doctor.department}
                  badge="Primary Department"
                />

                <DetailRow
                  icon={Stethoscope}
                  label="Medical Specialization"
                  value={doctor.specialization}
                  badge="Specialist"
                />

                <DetailRow
                  icon={GraduationCap}
                  label="Highest Qualification"
                  value={doctor.qualification}
                />

                <DetailRow
                  icon={Briefcase}
                  label="Years of Experience"
                  value={doctor.experience != null ? `${doctor.experience} Years Practice` : "—"}
                />
              </div>
            </div>

            {/* Panel 2: Contact & Availability Information */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Mail size={16} className="text-indigo-600" />
                  Contact & Schedule Details
                </h3>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                  Direct Communication
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Email with Copy Action */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                      <Mail size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Email Address</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{doctor.email || "—"}</p>
                    </div>
                  </div>
                  {doctor.email && (
                    <button
                      onClick={() => handleCopy(doctor.email, "email")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                      title="Copy Email"
                    >
                      {copiedField === "email" ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                    </button>
                  )}
                </div>

                {/* Phone with Copy Action */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                      <Phone size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Phone Number</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{doctor.phone || "—"}</p>
                    </div>
                  </div>
                  {doctor.phone && (
                    <button
                      onClick={() => handleCopy(doctor.phone, "phone")}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer shrink-0"
                      title="Copy Phone"
                    >
                      {copiedField === "phone" ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                    </button>
                  )}
                </div>

                <DetailRow
                  icon={User}
                  label="Gender"
                  value={doctor.gender}
                />

                <DetailRow
                  icon={Clock}
                  label="Working Hours / Availability"
                  value={doctor.availability}
                />
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-white px-6 sm:px-8 py-4 gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Registered Practitioner</span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(doctor);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-2 shadow-2xs active:scale-95"
                >
                  <Pencil size={14} className="text-slate-500" />
                  <span>Edit Profile</span>
                </button>
              )}

              {onAssign && (
                <button
                  onClick={() => {
                    onClose();
                    onAssign(doctor);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs transition-all cursor-pointer inline-flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95"
                >
                  <UserPlus size={14} />
                  <span>Assign Patients</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 shrink-0 shadow-2xs">
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {value || "—"}
          </p>
        </div>
      </div>
      {badge && (
        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
          {badge}
        </span>
      )}
    </div>
  );
}
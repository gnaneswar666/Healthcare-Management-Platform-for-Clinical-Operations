import { motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Building2,
  BadgeCheck,
  Stethoscope
} from "lucide-react";

import { deleteDoctor } from "../../../services/doctorService";

export default function DoctorCard({
  doctor,
  onView,
  onEdit,
  onAssign,
  refresh,
}) {
  const initials = (doctor?.doctorName || "DR")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isActive = doctor?.status === "ACTIVE";

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Dr. ${doctor?.doctorName}?`);
    if (!confirmDelete) return;

    try {
      await deleteDoctor(doctor.doctorId);
      if (refresh) refresh();
    } catch (err) {
      console.error(err);
      alert("Unable to delete doctor.");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        padding: "26px",
        background: "#ffffff",
        borderRadius: "26px",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.05)"
      }}
      className="group flex flex-col justify-between hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full"
    >
      {/* Top Meta Bar: Doctor ID & Status Badge */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          ID: {doctor?.doctorId || "D101"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide shrink-0 ${
            isActive
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
          {doctor?.status || "INACTIVE"}
        </span>
      </div>

      {/* Doctor Info Row */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 shrink-0">
          {initials || <Stethoscope size={24} />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug truncate group-hover:text-blue-600 transition-colors">
            Dr. {doctor?.doctorName?.replace(/^Dr\.\s*/i, "")}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
              <Building2 size={12} /> {doctor?.department || "General"}
            </span>
            {doctor?.specialization && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
                <BadgeCheck size={12} /> {doctor?.specialization}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Professional Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <Briefcase size={14} className="text-blue-600" /> Experience
          </div>
          <p className="text-base font-extrabold text-slate-900">
            {doctor?.experience != null ? `${doctor.experience} Yrs` : "—"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <GraduationCap size={14} className="text-indigo-600" /> Qualification
          </div>
          <p className="text-base font-extrabold text-slate-900 truncate" title={doctor?.qualification}>
            {doctor?.qualification || "MBBS"}
          </p>
        </div>
      </div>

      {/* Contact Snippets */}
      <div className="space-y-2.5 text-xs text-slate-600 mb-6 pt-1">
        {doctor?.email && (
          <div className="flex items-center gap-2.5 truncate">
            <Mail size={14} className="text-slate-400 shrink-0" />
            <span className="truncate font-semibold text-slate-700">{doctor.email}</span>
          </div>
        )}
        {doctor?.phone && (
          <div className="flex items-center gap-2.5">
            <Phone size={14} className="text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-700">{doctor.phone}</span>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 border-t border-slate-100 space-y-3 mt-auto">
        {/* Primary View Action */}
        <button
          type="button"
          onClick={() => onView && onView(doctor)}
          style={{
            padding: "11px 20px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
            color: "#ffffff"
          }}
          className="w-full font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Eye size={16} className="text-white" />
          <span>View Full Profile</span>
        </button>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onEdit && onEdit(doctor)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-all cursor-pointer"
            title="Edit Doctor Profile"
          >
            <Pencil size={13} className="text-slate-500" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onAssign && onAssign(doctor)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 transition-all cursor-pointer"
            title="Assign Patients"
          >
            <UserPlus size={13} className="text-blue-600" />
            <span>Assign</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 transition-all cursor-pointer"
            title="Delete Doctor"
          >
            <Trash2 size={13} className="text-rose-600" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
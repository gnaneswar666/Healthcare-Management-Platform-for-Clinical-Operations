import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  Stethoscope,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Briefcase,
  Clock,
  User,
  Sparkles,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { addDoctor, getDoctors } from "../../../services/doctorService";
import { validateEmail, validatePhone } from "../../../utils/validation";
import { getNextDoctorId } from "../../../utils/doctorUtils";

export default function AddDoctorModal({ show, handleClose, refresh, existingDoctors = [] }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [autoDoctorId, setAutoDoctorId] = useState("D101");

  const [doctor, setDoctor] = useState({
    doctorId: "",
    doctorName: "",
    email: "",
    phone: "",
    gender: "Male",
    specialization: "",
    qualification: "",
    experience: "",
    department: "",
    availability: "10:00 AM - 06:00 PM"
  });

  useEffect(() => {
    async function initDoctorId() {
      if (!show) return;
      let doctorList = existingDoctors;
      if (!doctorList || doctorList.length === 0) {
        try {
          const res = await getDoctors();
          doctorList = res.data || [];
        } catch (err) {
          console.error("Failed to fetch doctors for auto ID generation:", err);
        }
      }
      const nextId = getNextDoctorId(doctorList);
      setAutoDoctorId(nextId);
      setDoctor((prev) => ({
        ...prev,
        doctorId: nextId,
        doctorName: "",
        email: "",
        phone: "",
        gender: "Male",
        specialization: "",
        qualification: "",
        experience: "",
        department: "",
        availability: "10:00 AM - 06:00 PM"
      }));
      setError("");
    }
    initDoctorId();
  }, [show, existingDoctors]);

  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value
    });
  };

  const saveDoctor = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!doctor.doctorName.trim()) {
      setError("Doctor Name is required.");
      return;
    }

    const emailCheck = validateEmail(doctor.email);
    if (!emailCheck.isValid) {
      setError(emailCheck.message);
      return;
    }

    const phoneCheck = validatePhone(doctor.phone);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.message);
      return;
    }

    setSubmitting(true);
    try {
      const finalDoctorId = doctor.doctorId.trim() || autoDoctorId || "D101";
      const payload = {
        ...doctor,
        doctorId: finalDoctorId,
        doctorName: doctor.doctorName.trim(),
        email: doctor.email.trim(),
        experience: doctor.experience ? Number(doctor.experience) : 0,
        status: "ACTIVE"
      };

      await addDoctor(payload);
      setSubmitting(false);
      setError("");
      if (refresh) refresh();
      handleClose();
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      setError(err.response?.data?.message || "Failed to Add Doctor.");
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200/90 my-auto max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header Banner - Sleek Dark Indigo Gradient */}
          <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-6 sm:px-8 sm:py-7 text-white shrink-0 overflow-hidden border-b border-indigo-900/40">
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

            {/* Floating Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-20 cursor-pointer active:scale-95 shadow-xs"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header Content */}
            <div className="flex items-center gap-4 sm:gap-5 pr-10 relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-950/60 shrink-0">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-extrabold border border-white/10">
                  <Stethoscope size={28} className="text-blue-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/15 border border-blue-400/30 px-2.5 py-0.5 text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                    <Sparkles size={12} className="text-blue-400" /> Doctor Administration
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800/90 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    ID: {autoDoctorId}
                  </span>
                </div>
                <h2
                  style={{ color: "#ffffff" }}
                  className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight"
                >
                  Add New Doctor
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-medium">
                  Register clinical credentials & department assignments
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={saveDoctor} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 min-h-0 bg-slate-50/60">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2.5 shadow-2xs">
                  <AlertCircle size={18} className="text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Doctor ID - Auto Generated & Disabled */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Doctor ID
                    </label>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Auto Generated
                    </span>
                  </div>
                  <div className="flex items-center h-11 bg-slate-100 border border-slate-300 rounded-xl overflow-hidden cursor-not-allowed">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-200/80 border-r border-slate-300 text-slate-500 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <input
                      type="text"
                      name="doctorId"
                      value={doctor.doctorId}
                      disabled
                      className="w-full text-sm font-mono font-bold text-slate-700 bg-transparent px-3 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Doctor Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Doctor Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="doctorName"
                      value={doctor.doctorName}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      required
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={doctor.email}
                      onChange={handleChange}
                      placeholder="sarah.jenkins@hospital.com"
                      required
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={doctor.phone}
                      onChange={handleChange}
                      placeholder="9808707606"
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Department
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <Building2 size={16} />
                    </div>
                    <input
                      type="text"
                      name="department"
                      value={doctor.department}
                      onChange={handleChange}
                      placeholder="e.g. Cardiology"
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Specialization
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <Stethoscope size={16} />
                    </div>
                    <input
                      type="text"
                      name="specialization"
                      value={doctor.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Pediatric Cardiology"
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Qualification
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <GraduationCap size={16} />
                    </div>
                    <input
                      type="text"
                      name="qualification"
                      value={doctor.qualification}
                      onChange={handleChange}
                      placeholder="e.g. MD, DM Cardiology"
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Experience (Years) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Experience (Years)
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <Briefcase size={16} />
                    </div>
                    <input
                      type="number"
                      name="experience"
                      value={doctor.experience}
                      onChange={handleChange}
                      placeholder="e.g. 12"
                      min="0"
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Availability / Working Hours */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Availability / Schedule
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <Clock size={16} />
                    </div>
                    <input
                      type="text"
                      name="availability"
                      value={doctor.availability}
                      onChange={handleChange}
                      placeholder="10:00 AM - 06:00 PM"
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Gender Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Gender
                  </label>
                  <div className="flex items-center h-11 bg-white border border-slate-300 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-2xs overflow-hidden">
                    <div className="w-10 h-full flex items-center justify-center bg-slate-100 border-r border-slate-200 text-slate-500 shrink-0">
                      <User size={16} />
                    </div>
                    <select
                      name="gender"
                      value={doctor.gender}
                      onChange={handleChange}
                      className="w-full text-sm font-semibold text-slate-900 bg-transparent px-3 outline-none cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 sm:px-8 py-4 gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>Active Doctor Profile Creation</span>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Doctor...</span>
                    </>
                  ) : (
                    <span>Save Doctor</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Loader2,
  Users,
  UserPlus,
  UserMinus,
  Stethoscope,
  BadgeCheck,
  Mars,
  Venus,
  CheckCircle2,
  UserCircle2,
  Sparkles,
  Droplets,
  CheckSquare,
  Square,
  Filter,
  ArrowRightLeft
} from "lucide-react";

import {
  assignPatient,
  getAssignedPatients,
  unAssignPatient,
} from "../../../services/assignmentService";

import { getPatients } from "../../../services/patientService";

export default function AssignPatientsModal({ doctor, onClose }) {
  const [patients, setPatients] = useState([]);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("available"); // for mobile screens

  // Batch selection states
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);

  useEffect(() => {
    if (!doctor) return;
    let active = true;

    Promise.all([
      getPatients(),
      getAssignedPatients(doctor.doctorId),
    ])
      .then(([patientRes, assignedRes]) => {
        if (!active) return;
        setPatients(patientRes.data || []);
        setAssignedPatients(assignedRes.data || []);
      })
      .catch((err) => {
        console.error("Error fetching assignment data:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [doctor]);

  // Filtered Available Patients
  const filteredPatients = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return patients.filter((patient) => {
      const alreadyAssigned = assignedPatients.some(
        (a) => a.patientId === patient.patientId
      );

      if (alreadyAssigned) return false;

      if (genderFilter !== "ALL" && patient.gender?.toUpperCase() !== genderFilter) {
        return false;
      }

      const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();

      return (
        fullName.includes(keyword) ||
        patient.patientId?.toLowerCase().includes(keyword) ||
        patient.email?.toLowerCase().includes(keyword)
      );
    });
  }, [patients, assignedPatients, search, genderFilter]);

  // Filtered Assigned Patients
  const filteredAssigned = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return assignedPatients.filter((patient) => {
      if (genderFilter !== "ALL" && patient.gender?.toUpperCase() !== genderFilter) {
        return false;
      }

      const fullName = `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase();

      return (
        fullName.includes(keyword) ||
        patient.patientId?.toLowerCase().includes(keyword) ||
        patient.email?.toLowerCase().includes(keyword)
      );
    });
  }, [assignedPatients, search, genderFilter]);

  // Single Assign
  const handleAssign = async (patientId) => {
    try {
      setActionLoading(patientId);
      await assignPatient({
        doctorId: doctor.doctorId,
        patientId,
      });

      setSelectedAvailable((prev) => prev.filter((id) => id !== patientId));

      const [patientRes, assignedRes] = await Promise.all([
        getPatients(),
        getAssignedPatients(doctor.doctorId),
      ]);
      setPatients(patientRes.data || []);
      setAssignedPatients(assignedRes.data || []);
    } catch (err) {
      console.error("Failed to assign patient:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Single Remove
  const handleRemove = async (patientId) => {
    try {
      setActionLoading(patientId);
      await unAssignPatient(doctor.doctorId, patientId);

      setSelectedAssigned((prev) => prev.filter((id) => id !== patientId));

      const [patientRes, assignedRes] = await Promise.all([
        getPatients(),
        getAssignedPatients(doctor.doctorId),
      ]);
      setPatients(patientRes.data || []);
      setAssignedPatients(assignedRes.data || []);
    } catch (err) {
      console.error("Failed to unassign patient:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Batch Assign
  const handleBatchAssign = async () => {
    if (selectedAvailable.length === 0) return;
    try {
      setActionLoading("batch-assign");
      await Promise.all(
        selectedAvailable.map((patientId) =>
          assignPatient({ doctorId: doctor.doctorId, patientId })
        )
      );
      setSelectedAvailable([]);
      const [patientRes, assignedRes] = await Promise.all([
        getPatients(),
        getAssignedPatients(doctor.doctorId),
      ]);
      setPatients(patientRes.data || []);
      setAssignedPatients(assignedRes.data || []);
    } catch (err) {
      console.error("Failed batch assignment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Batch Remove
  const handleBatchRemove = async () => {
    if (selectedAssigned.length === 0) return;
    try {
      setActionLoading("batch-remove");
      await Promise.all(
        selectedAssigned.map((patientId) =>
          unAssignPatient(doctor.doctorId, patientId)
        )
      );
      setSelectedAssigned([]);
      const [patientRes, assignedRes] = await Promise.all([
        getPatients(),
        getAssignedPatients(doctor.doctorId),
      ]);
      setPatients(patientRes.data || []);
      setAssignedPatients(assignedRes.data || []);
    } catch (err) {
      console.error("Failed batch remove:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Selection Toggles
  const toggleSelectAvailable = (patientId) => {
    setSelectedAvailable((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const toggleSelectAllAvailable = () => {
    if (selectedAvailable.length === filteredPatients.length) {
      setSelectedAvailable([]);
    } else {
      setSelectedAvailable(filteredPatients.map((p) => p.patientId));
    }
  };

  const toggleSelectAssigned = (patientId) => {
    setSelectedAssigned((prev) =>
      prev.includes(patientId)
        ? prev.filter((id) => id !== patientId)
        : [...prev, patientId]
    );
  };

  const toggleSelectAllAssigned = () => {
    if (selectedAssigned.length === filteredAssigned.length) {
      setSelectedAssigned([]);
    } else {
      setSelectedAssigned(filteredAssigned.map((p) => p.patientId));
    }
  };

  const counts = {
    total: patients.length,
    assigned: assignedPatients.length,
    available: Math.max(0, patients.length - assignedPatients.length),
  };

  const assignedPercentage = counts.total > 0
    ? Math.round((counts.assigned / counts.total) * 100)
    : 0;

  if (!doctor) return null;

  const doctorInitials = (doctor?.doctorName || "DR")
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 md:p-12 overflow-y-auto bg-slate-950/75 backdrop-blur-md">
        {/* Backdrop overlay click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Window Container with Generous Outer Margin & Padding */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200/90 my-auto flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header Banner - Executive Navy Gradient with Flex Close Button */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-8 py-6 text-white shrink-0 border-b border-indigo-900/40">
            <div className="flex items-center justify-between gap-6">
              {/* Doctor Details */}
              <div className="flex items-center gap-5 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-black text-xl tracking-wider">
                      {doctorInitials || <Stethoscope size={24} className="text-blue-400" />}
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/20 border border-blue-400/40 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-200 uppercase tracking-wider">
                      <Sparkles size={12} className="text-blue-300" /> Patient Assignment Hub
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      ID: {doctor.doctorId}
                    </span>
                  </div>

                  <h2
                    style={{ color: "#ffffff" }}
                    className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight truncate !text-white"
                  >
                    Dr. {doctor.doctorName?.replace(/^Dr\.\s*/i, "")}
                  </h2>
                  <p
                    style={{ color: "#cbd5e1" }}
                    className="text-xs sm:text-sm text-slate-300 font-semibold mt-1 flex items-center gap-2 truncate"
                  >
                    <Stethoscope size={14} className="text-blue-400 shrink-0" />
                    <span className="truncate">{doctor.department || "Clinical Operations"}</span>
                    {doctor.specialization && (
                      <span className="text-slate-400 truncate">• {doctor.specialization}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Side Header Controls: Capacity Meter & Close Button */}
              <div className="flex items-center gap-5 shrink-0">
                {/* Patient Capacity Load Meter */}
                <div className="hidden sm:flex items-center gap-3.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 px-4 shadow-inner">
                  <div className="text-right">
                    <p style={{ color: "#94a3b8" }} className="text-[10px] font-extrabold uppercase tracking-wider">
                      Assigned Load
                    </p>
                    <p style={{ color: "#ffffff" }} className="text-base font-black text-white leading-none mt-1">
                      {counts.assigned} <span className="text-xs text-slate-400 font-semibold">/ {counts.total} Patients</span>
                    </p>
                  </div>
                  <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-11 h-11 transform -rotate-90">
                      <circle
                        cx="22"
                        cy="22"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        className="text-slate-700"
                        fill="transparent"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        className="text-blue-400"
                        fill="transparent"
                        strokeDasharray={100}
                        strokeDashoffset={100 - (100 * assignedPercentage) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span style={{ color: "#ffffff" }} className="absolute text-[10px] font-black text-white">
                      {assignedPercentage}%
                    </span>
                  </div>
                </div>

                {/* Close Button - Cleanly positioned inside flex right container */}
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-95 shadow-xs shrink-0"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar with Generous Spacing */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-8 py-4 shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar with Explicit Left Padding to Prevent Icon Collision */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patient by name, ID, or email..."
                  style={{ paddingLeft: "2.75rem", paddingRight: "2.5rem" }}
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer z-10"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Gender Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1 shrink-0">
                  <Filter size={13} /> Filter:
                </span>
                {["ALL", "MALE", "FEMALE"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setGenderFilter(gender)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      genderFilter === gender
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-300"
                    }`}
                  >
                    {gender === "ALL" ? "All Patients" : gender === "MALE" ? "Male" : "Female"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex lg:hidden border-b border-slate-200 bg-slate-200/80 p-2 gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("available")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "available"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users size={15} />
              <span>Available ({filteredPatients.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("assigned")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "assigned"
                  ? "bg-white text-emerald-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BadgeCheck size={15} />
              <span>Assigned ({filteredAssigned.length})</span>
            </button>
          </div>

          {/* Main Dual-Column Transfer Content Area with Padded Container */}
          <div className="flex-1 min-h-0 bg-slate-100/60 p-6 sm:p-8 overflow-hidden">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <SkeletonColumn title="Available Patients" />
                <SkeletonColumn title="Assigned Patients" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
                {/* Left Transfer Column: Available Patients */}
                <div
                  className={`flex flex-col h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden ${
                    activeTab !== "available" ? "hidden lg:flex" : "flex"
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/70 px-6 py-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleSelectAllAvailable}
                        disabled={filteredPatients.length === 0}
                        className="text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30 cursor-pointer"
                        title="Select All Available"
                      >
                        {selectedAvailable.length > 0 &&
                        selectedAvailable.length === filteredPatients.length ? (
                          <CheckSquare size={18} className="text-blue-600" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-blue-900">
                          Available Patients
                        </h3>
                        <span className="text-xs font-black text-blue-700 bg-white border border-blue-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                          {filteredPatients.length}
                        </span>
                      </div>
                    </div>

                    {/* Batch Assign Button */}
                    {selectedAvailable.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        disabled={actionLoading === "batch-assign"}
                        onClick={handleBatchAssign}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {actionLoading === "batch-assign" ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <UserPlus size={14} />
                        )}
                        <span>Assign Selected ({selectedAvailable.length})</span>
                      </motion.button>
                    )}
                  </div>

                  {/* Patient Scroll List */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-3.5 min-h-0">
                    {filteredPatients.length === 0 ? (
                      <EmptyColumn
                        icon={UserCircle2}
                        title="No Available Patients"
                        subtitle={
                          search || genderFilter !== "ALL"
                            ? "No patient matches your active filter criteria."
                            : "All registered patients are currently assigned to this doctor."
                        }
                      />
                    ) : (
                      filteredPatients.map((patient) => (
                        <PatientTransferCard
                          key={patient.patientId}
                          patient={patient}
                          type="available"
                          isSelected={selectedAvailable.includes(patient.patientId)}
                          onToggleSelect={() => toggleSelectAvailable(patient.patientId)}
                          onAction={() => handleAssign(patient.patientId)}
                          loading={actionLoading === patient.patientId}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Right Transfer Column: Assigned Patients */}
                <div
                  className={`flex flex-col h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden ${
                    activeTab !== "assigned" ? "hidden lg:flex" : "flex"
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-50/70 px-6 py-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleSelectAllAssigned}
                        disabled={filteredAssigned.length === 0}
                        className="text-slate-400 hover:text-amber-600 transition-colors disabled:opacity-30 cursor-pointer"
                        title="Select All Assigned"
                      >
                        {selectedAssigned.length > 0 &&
                        selectedAssigned.length === filteredAssigned.length ? (
                          <CheckSquare size={18} className="text-amber-600" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <BadgeCheck size={16} className="text-emerald-600" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                          Assigned Patients
                        </h3>
                        <span className="text-xs font-black text-emerald-700 bg-white border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                          {filteredAssigned.length}
                        </span>
                      </div>
                    </div>

                    {/* Batch Remove Button */}
                    {selectedAssigned.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        disabled={actionLoading === "batch-remove"}
                        onClick={handleBatchRemove}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {actionLoading === "batch-remove" ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <UserMinus size={14} />
                        )}
                        <span>Remove Selected ({selectedAssigned.length})</span>
                      </motion.button>
                    )}
                  </div>

                  {/* Patient Scroll List */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-3.5 min-h-0">
                    {filteredAssigned.length === 0 ? (
                      <EmptyColumn
                        icon={CheckCircle2}
                        title="No Assigned Patients"
                        subtitle={
                          search || genderFilter !== "ALL"
                            ? "No assigned patient matches your active filter criteria."
                            : "This doctor currently has no patients assigned."
                        }
                      />
                    ) : (
                      filteredAssigned.map((patient) => (
                        <PatientTransferCard
                          key={patient.patientId}
                          patient={patient}
                          type="assigned"
                          isSelected={selectedAssigned.includes(patient.patientId)}
                          onToggleSelect={() => toggleSelectAssigned(patient.patientId)}
                          onAction={() => handleRemove(patient.patientId)}
                          loading={actionLoading === patient.patientId}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar - Well Padded Bottom so Cancel/Done Buttons are Never Cut Off */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-white px-8 py-5 gap-4 shrink-0">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
              <ArrowRightLeft size={16} className="text-blue-600 shrink-0" />
              <span>
                Total Registry: <span className="font-black text-slate-900">{counts.total}</span> | Assigned:{" "}
                <span className="font-black text-emerald-600">{counts.assigned}</span> | Available:{" "}
                <span className="font-black text-blue-600">{counts.available}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function PatientTransferCard({
  patient,
  type,
  isSelected,
  onToggleSelect,
  onAction,
  loading,
}) {
  const isAssigned = type === "assigned";
  const initials =
    `${patient.firstName?.[0] || ""}${patient.lastName?.[0] || ""}`.toUpperCase() || "PT";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.16 }}
      className={`group flex items-center justify-between gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 shadow-xs"
          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Selection Checkbox */}
        <button
          type="button"
          onClick={onToggleSelect}
          className="text-slate-400 hover:text-blue-600 transition-colors p-1 cursor-pointer shrink-0"
        >
          {isSelected ? (
            <CheckSquare size={18} className="text-blue-600" />
          ) : (
            <Square size={18} />
          )}
        </button>

        {/* Patient Avatar Badge */}
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
          {initials}
        </div>

        {/* Patient Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
              {patient.firstName} {patient.lastName}
            </h4>
            {isAssigned && <BadgeCheck size={15} className="text-emerald-500 shrink-0" />}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 font-medium">
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
              {patient.patientId}
            </span>

            {patient.gender && (
              <span className="inline-flex items-center gap-0.5 text-slate-600">
                {patient.gender === "Female" ? (
                  <Venus size={12} className="text-rose-500" />
                ) : (
                  <Mars size={12} className="text-blue-500" />
                )}
                {patient.gender}
              </span>
            )}

            {patient.bloodGroup && (
              <span className="inline-flex items-center gap-0.5 text-slate-600">
                <Droplets size={11} className="text-rose-500" />
                {patient.bloodGroup}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button (Assign or Remove) */}
      <button
        type="button"
        disabled={loading}
        onClick={onAction}
        className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs active:scale-95 disabled:opacity-50 ${
          isAssigned
            ? "border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
        }`}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : isAssigned ? (
          <>
            <UserMinus size={14} />
            <span>Remove</span>
          </>
        ) : (
          <>
            <UserPlus size={14} />
            <span>Assign</span>
          </>
        )}
      </button>
    </motion.div>
  );
}

function EmptyColumn({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 px-4 text-center h-full min-h-[220px]">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
        <Icon size={22} />
      </div>
      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">{title}</h4>
      <p className="mt-1 text-[11px] text-slate-500 max-w-xs font-semibold">{subtitle}</p>
    </div>
  );
}

function SkeletonColumn({ title }) {
  return (
    <div className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 p-5 space-y-3.5">
      <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-100 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-28 bg-slate-200 rounded" />
            <div className="h-2.5 w-40 bg-slate-200 rounded" />
          </div>
          <div className="w-16 h-7 bg-slate-200 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}

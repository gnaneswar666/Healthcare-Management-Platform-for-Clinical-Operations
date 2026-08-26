import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  Building2,
  Briefcase,
  Stethoscope,
} from "lucide-react";

import DoctorCard from "./DoctorCard";
import AddDoctorModal from "./AddDoctorModal";
import EditDoctorModal from "./EditDoctorModal";
import DoctorDetailsModal from "./DoctorDetailsModal";
import AssignPatientsModal from "./AssignPatientsModal";
import StatCard from "../StatCard";

import { getDoctors } from "../../../services/doctorService.js";

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await getDoctors();
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchSearch =
        doctor.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        doctor.email.toLowerCase().includes(search.toLowerCase()) ||
        doctor.doctorId.toLowerCase().includes(search.toLowerCase());

      const matchDepartment =
        !department || doctor.department === department;

      const matchStatus =
        !status || doctor.status === status;

      return matchSearch && matchDepartment && matchStatus;
    });
  }, [doctors, search, department, status]);

  const totalDoctors = doctors.length;
  const activeDoctors = doctors.filter((d) => d.status === "ACTIVE").length;
  const departments = [...new Set(doctors.map((d) => d.department))].length;
  const totalExperience = doctors.reduce((sum, d) => sum + d.experience, 0);

  const uniqueDepartments = [...new Set(doctors.map((d) => d.department))];

  return (
    <div className="page-card mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__info">
          <div className="page-status-chip">
            <Stethoscope size={14} />
            Doctor Administration
          </div>
          <h1 className="page-title">Doctor Management</h1>
          <p className="page-subtitle">
            Manage doctors and patient assignments
          </p>
        </div>
        <div className="page-header__actions">
          <button
            onClick={() => setShowAdd(true)}
            className="btn btn--primary"
          >
            <Plus size={18} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid-section md:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard
          icon={<Users size={22} />}
          title="Total Doctors"
          value={totalDoctors}
          variant="brand"
        />
        <StatCard
          icon={<UserCheck size={22} />}
          title="Active Doctors"
          value={activeDoctors}
          variant="emerald"
        />
        <StatCard
          icon={<Building2 size={22} />}
          title="Departments"
          value={departments}
          variant="violet"
        />
        <StatCard
          icon={<Briefcase size={22} />}
          title="Experience"
          value={`${totalExperience} Years`}
          variant="amber"
        />
      </div>

      {/* Filters */}
      <div className="section-card mb-8">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-search"
            />
          </div>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="input"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dep) => (
              <option key={dep}>{dep}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setDepartment("");
              setStatus("");
            }}
            className="btn btn--ghost"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          Loading doctors...
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="soft-card py-20 text-center">
          <h3 className="text-xl font-semibold text-slate-700">
            No Doctors Found
          </h3>
          <p className="mt-2 text-slate-500">
            Try changing the search or filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.doctorId}
              doctor={doctor}
              refresh={loadDoctors}
              onView={(doctor) => {
                setSelectedDoctor(doctor);
                setShowView(true);
              }}
              onEdit={(doctor) => {
                setSelectedDoctor(doctor);
                setShowEdit(true);
              }}
              onAssign={(doctor) => {
                setSelectedDoctor(doctor);
                setShowAssign(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddDoctorModal
          show={showAdd}
          handleClose={() => setShowAdd(false)}
          refresh={loadDoctors}
          existingDoctors={doctors}
        />
      )}

      {showEdit && selectedDoctor && (
        <EditDoctorModal
          doctor={selectedDoctor}
          onClose={() => {
            setShowEdit(false);
            setSelectedDoctor(null);
          }}
          refresh={loadDoctors}
        />
      )}

      {showView && selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onClose={() => {
            setShowView(false);
            setSelectedDoctor(null);
          }}
          onEdit={(doc) => {
            setSelectedDoctor(doc);
            setShowView(false);
            setShowEdit(true);
          }}
          onAssign={(doc) => {
            setSelectedDoctor(doc);
            setShowView(false);
            setShowAssign(true);
          }}
        />
      )}

      {showAssign && selectedDoctor && (
        <AssignPatientsModal
          doctor={selectedDoctor}
          onClose={() => {
            setShowAssign(false);
            setSelectedDoctor(null);
          }}
        />
      )}
    </div>
  );
}


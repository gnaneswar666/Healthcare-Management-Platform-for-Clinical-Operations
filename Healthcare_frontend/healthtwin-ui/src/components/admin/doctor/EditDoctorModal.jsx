import { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { updateDoctor } from "../../../services/doctorService.js";
import { validateEmail, validatePhone } from "../../../utils/validation";

export default function EditDoctorModal({
  doctor,
  onClose,
  refresh,
}) {
  const [form, setForm] = useState({
    doctorId: "",
    doctorName: "",
    email: "",
    phone: "",
    gender: "",
    specialization: "",
    qualification: "",
    experience: "",
    department: "",
    availability: "",
    status: "ACTIVE",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (doctor) {
      setForm({
        doctorId: doctor.doctorId || "",
        doctorName: doctor.doctorName || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        gender: doctor.gender || "",
        specialization: doctor.specialization || "",
        qualification: doctor.qualification || "",
        experience: doctor.experience || "",
        department: doctor.department || "",
        availability: doctor.availability || "",
        status: doctor.status || "ACTIVE",
      });
      setError("");
    }
  }, [doctor]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.doctorName.trim()) {
      setError("Doctor Name is required.");
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

    try {
      await updateDoctor(form.doctorId, form);
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update doctor.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Edit Doctor</h2>
            <p className="text-slate-500">Update doctor information</p>
          </div>
          <button onClick={onClose} className="btn btn--ghost btn--icon">
            <X size={22} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-6 md:grid-cols-2">
            <Input
              label="Doctor ID"
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              disabled
            />
            <Input
              label="Doctor Name"
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <Input
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
            />
            <Input
              label="Specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
            />
            <Input
              label="Qualification"
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
            />
            <Input
              label="Experience"
              name="experience"
              type="number"
              value={form.experience}
              onChange={handleChange}
            />
            <Input
              label="Availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn--ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Update Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Input */
function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={`input ${disabled ? "!bg-slate-100 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}


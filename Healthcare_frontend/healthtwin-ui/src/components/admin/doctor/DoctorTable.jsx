import { Eye, Pencil, Trash2, UserPlus } from "lucide-react";
import { deleteDoctor } from "../../../services/doctorService";

function DoctorTable({ doctors, refresh, editDoctor, viewDoctor }) {

  const removeDoctor = async (doctorId) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await deleteDoctor(doctorId);
      refresh();
    } catch (err) {
      console.log(err);
      alert("Failed to delete doctor");
    }
  };

  return (
    <div className="data-table-wrap">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-slate-800">Doctors</h2>
        <p className="text-sm text-slate-500">
          View and manage registered doctors
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Email</th>
              <th>Department</th>
              <th>Experience</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="6" className="data-table__empty">
                  <div className="font-medium text-slate-500">
                    No doctors found.
                  </div>
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr
                  key={doctor.doctorId}
                  className="border-b border-slate-100 transition-colors hover:bg-blue-50/50"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar--sm">
                        {doctor.doctorName?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {doctor.doctorName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {doctor.doctorId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-slate-600">{doctor.email}</td>
                  <td className="text-slate-600">{doctor.department}</td>
                  <td className="text-slate-600">{doctor.experience} Years</td>
                  <td>
                    <span
                      className={`badge ${
                        doctor.status === "ACTIVE"
                          ? "badge--success"
                          : "badge--danger"
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => viewDoctor(doctor)}
                        className="btn btn--ghost btn--icon btn--sm"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => editDoctor(doctor)}
                        className="btn btn--ghost btn--icon btn--sm"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => alert("Assign Patients - Next Step")}
                        className="btn btn--ghost btn--icon btn--sm"
                        title="Assign Patients"
                      >
                        <UserPlus size={15} />
                      </button>
                      <button
                        onClick={() => removeDoctor(doctor.doctorId)}
                        className="btn btn--ghost btn--icon btn--sm hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorTable;


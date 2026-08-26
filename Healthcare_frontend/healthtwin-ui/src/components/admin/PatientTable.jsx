import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Heart, Pencil, Trash2 } from "lucide-react";

function PatientTable({ patients, onDelete }) {
    return (
        <div className="data-table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Patient ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Blood Group</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="data-table__empty">
                                <div className="font-medium text-slate-500">No patients found</div>
                            </td>
                        </tr>
                    ) : (
                        patients.map((patient, index) => (
                            <motion.tr
                                key={patient.patientId}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: 0.02 * index }}
                                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.03)" }}
                                className="border-b border-slate-100 transition-colors"
                            >
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-800">
                                                {patient.firstName} {patient.lastName}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-mono text-[0.82rem] text-slate-500">
                                    {patient.patientId}
                                </td>
                                <td className="max-w-[200px] truncate text-slate-600">
                                    {patient.email}
                                </td>
                                <td className="text-slate-600">
                                    {patient.phone}
                                </td>
                                <td>
                                    <span className="badge badge--slate">{patient.gender}</span>
                                </td>
                                <td className="font-semibold text-slate-700">
                                    {patient.bloodGroup}
                                </td>
                                <td className="text-center">
                                    <span className="badge badge--success badge--dot">Active</span>
                                </td>
                                <td>
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            to={`/admin/patient/${patient.patientId}`}
                                            className="btn btn--ghost btn--icon btn--sm"
                                            title="View Patient"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        <Link
                                            to={`/admin/patients/edit/${patient.patientId}`}
                                            className="btn btn--ghost btn--icon btn--sm"
                                            title="Edit Patient"
                                        >
                                            <Pencil size={15} />
                                        </Link>
                                        <Link
                                            to={`/admin/healthtwins/edit/${patient.patientId}`}
                                            className="btn btn--ghost btn--icon btn--sm"
                                            title="Edit Health Twin"
                                        >
                                            <Heart size={15} />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(patient)}
                                            className="btn btn--ghost btn--icon btn--sm hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200"
                                            title="Delete Patient"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PatientTable;


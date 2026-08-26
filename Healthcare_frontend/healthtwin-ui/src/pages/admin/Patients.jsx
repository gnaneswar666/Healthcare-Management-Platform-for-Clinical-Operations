import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users as UsersIcon } from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import PatientSearch from "../../components/admin/PatientSearch";
import PatientFilters from "../../components/admin/PatientFilters";
import PatientTable from "../../components/admin/PatientTable";
import DeletePatientModal from "../../components/admin/DeletePatientModal";
import LoadingSpinner from "../../components/admin/LoadingSpinner";

import { getPatients, deletePatient } from "../../services/patientService";
import { getHealthTwin } from "../../services/HealthTwinService";

function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [gender, setGender] = useState("");

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    async function loadPatients() {
        try {
            const response = await getPatients();
            const patientData = response.data;

            const patientsWithBloodGroup = await Promise.all(
                patientData.map(async (patient) => {
                    try {
                        const twinResponse = await getHealthTwin(patient.patientId);
                        return {
                            ...patient,
                            bloodGroup: twinResponse.data.bloodGroup || "N/A"
                        };
                    } catch {
                        return {
                            ...patient,
                            bloodGroup: "N/A"
                        };
                    }
                })
            );

            setPatients(patientsWithBloodGroup);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const keyword = search.toLowerCase();
            const matchesSearch =
                patient.firstName?.toLowerCase().includes(keyword) ||
                patient.lastName?.toLowerCase().includes(keyword) ||
                patient.patientId?.toLowerCase().includes(keyword) ||
                patient.email?.toLowerCase().includes(keyword);
            const matchesGender = gender === "" || patient.gender === gender;
            return matchesSearch && matchesGender;
        });
    }, [patients, search, gender]);

    function handleDeleteClick(patient) {
        setSelectedPatient(patient);
        setDeleteOpen(true);
    }

    async function confirmDelete() {
        try {
            await deletePatient(selectedPatient.patientId);
            setPatients((prev) =>
                prev.filter(
                    (p) => p.patientId !== selectedPatient.patientId
                )
            );
        } catch (err) {
            console.error(err);
            alert("Unable to delete patient.");
        } finally {
            setDeleteOpen(false);
        }
    }

    return (
        <AdminLayout>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--violet">
                            <UsersIcon size={14} />
                            Patient Registry
                        </div>
                        <h1 className="page-title">Patients Management</h1>
                        <p className="page-subtitle">Manage all registered patients, their profiles and digital twin records.</p>
                    </div>
                    <div className="page-header__actions">
                        <div className="page-meta">
                            <UsersIcon size={15} />
                            {filteredPatients.length} total patients
                        </div>
                        <Link
                            to="/admin/patients/add"
                            className="btn btn--primary"
                        >
                            <Plus size={18} />
                            Add Patient
                        </Link>
                    </div>
                </div>

                <div className="section-card mb-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <PatientSearch
                            search={search}
                            setSearch={setSearch}
                        />
                        <PatientFilters
                            gender={gender}
                            setGender={setGender}
                        />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <PatientTable
                        patients={filteredPatients}
                        onDelete={handleDeleteClick}
                    />
                )}
            </div>

            <DeletePatientModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onDelete={confirmDelete}
            />
        </AdminLayout>
    );
}

export default Patients;

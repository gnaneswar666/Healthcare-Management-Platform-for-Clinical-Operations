import { useEffect, useState } from "react";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import { getAssignedPatients } from "../../services/assignmentService";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, Eye } from "lucide-react";
import { getHealthTwins } from "../../services/healthTwinService";
import { Search, Activity, AlertTriangle, HeartPulse, X } from "lucide-react";
function Patients({ keycloak }) {

    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
const [healthTwins, setHealthTwins] = useState([]);
   async function loadPatients() {

    try {

        const doctorId = keycloak.tokenParsed.doctorId;

        const patientRes = await getAssignedPatients(doctorId);

        const twinRes = await getHealthTwins();

        const merged = patientRes.data.map(patient => {

            const twin = twinRes.data.find(
                t => t.patientId === patient.patientId
            );

            return {
                ...patient,
                twin
            };

        });

        setPatients(merged);

        setHealthTwins(twinRes.data);

    } catch (err) {

        console.log(err);

    }

}

    useEffect(() => {

        loadPatients();

        const interval = setInterval(loadPatients, 15000);

        return () => clearInterval(interval);

    }, []);
    const calculateRiskScore = (twin) => {

    if (!twin) return 0;

    let score = 0;

    if (twin.heartRate < 60 || twin.heartRate > 100)
        score += 15;

    if (twin.temperature >= 38)
        score += 20;

    if (twin.oxygenLevel < 95)
        score += 25;

    if (twin.bloodPressure) {

        const [sys, dia] =
            twin.bloodPressure.split("/").map(Number);

        if (sys >= 140 || dia >= 90)
            score += 20;

        if (sys < 90 || dia < 60)
            score += 15;
    }

    if (twin.height && twin.weight) {

        const bmi =
            twin.weight /
            Math.pow(twin.height / 100, 2);

        if (bmi >= 30 || bmi < 18.5)
            score += 20;
    }

    if (twin.chronicDiseases?.length)
        score += 20;

    return Math.min(score, 100);

};
const filteredPatients = patients.filter(p =>
    p.patientId.toLowerCase().includes(search.toLowerCase()) ||
    `${p.firstName} ${p.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
);
const healthy = filteredPatients.filter(
    p => calculateRiskScore(p.twin) < 30
).length;

const warning = filteredPatients.filter(p => {
    const r = calculateRiskScore(p.twin);
    return r >= 30 && r < 70;
}).length;

const critical = filteredPatients.filter(
    p => calculateRiskScore(p.twin) >= 70
).length;

    return (
        <DoctorLayout keycloak={keycloak}>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--brand">
                            <UsersIcon size={14} />
                            Your Panel
                        </div>
                        <h1 className="page-title">
                            Assigned Patients
                        </h1>
                        <p className="page-subtitle">
                            View your assigned patients and access their complete 360° clinical profile.
                        </p>
                    </div>
                    <div className="page-meta">
                        <UsersIcon size={15} />
                        {patients.length} Patients Assigned
                    </div>
                </div>

                <div className="grid-section md:grid-cols-4 mb-6">
                    <div className="stat-card stat-card--brand">
                        <div className="stat-card__label">
                            Assigned
                        </div>
                        <div className="stat-card__value">
                            {filteredPatients.length}
                        </div>
                    </div>

                    <div className="stat-card stat-card--emerald">
                        <div className="stat-card__label">
                            Healthy
                        </div>
                        <div className="stat-card__value">
                            {healthy}
                        </div>
                    </div>

                    <div className="stat-card stat-card--amber">
                        <div className="stat-card__label">
                            Warning
                        </div>
                        <div className="stat-card__value">
                            {warning}
                        </div>
                    </div>

                    <div className="stat-card stat-card--rose">
                        <div className="stat-card__label">
                            Critical
                        </div>
                        <div className="stat-card__value">
                            {critical}
                        </div>
                    </div>
                </div>

                <div className="relative mb-6 w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                        <Search size={19} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search assigned patient by Patient ID or Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: "3.1rem", paddingTop: "12px", paddingBottom: "12px" }}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 pr-10 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-2xs"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg p-1 transition-all cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                <div className="data-table-wrap">

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>Patient ID</th>

                                <th>Name</th>

                                <th className="text-center">
                                    Gender
                                </th>

                                <th className="text-center">
                                    Phone
                                </th>
                                  <th className="text-center">Risk</th>
                                    <th className="text-center">Status</th>

                                <th className="text-center">
                                    360° View
                                </th>
                              

                            </tr>

                        </thead>

                        <tbody>

                            {
                                filteredPatients.map((p) => (

                                    <tr key={p.patientId}>

                                        <td className="font-mono text-[0.82rem] text-slate-600">
                                            {p.patientId}
                                        </td>

                                        <td>

                                            <div className="flex items-center gap-3">

                                                <div className="avatar avatar--sm">

                                                    {(p.firstName?.[0] || "") +
                                                        (p.lastName?.[0] || "")}

                                                </div>

                                                <span className="font-semibold text-slate-800">

                                                    {p.firstName} {p.lastName}

                                                </span>

                                            </div>

                                        </td>

                                        <td className="text-center">

                                            <span className="badge badge--slate">

                                                {p.gender}

                                            </span>

                                        </td>

                                        <td className="text-center text-slate-700">

                                            {p.phone}

                                        </td>
                                        <td className="text-center">

                                                {calculateRiskScore(p.twin)}%

                                            </td>

                                            <td className="text-center">

                                            {
                                                calculateRiskScore(p.twin) < 30 ?

                                                    <span className="badge badge--success">
                                                        Healthy
                                                    </span>

                                                :

                                                calculateRiskScore(p.twin) < 70 ?

                                                    <span className="badge badge--warning">
                                                        Warning
                                                    </span>

                                                :

                                                    <span className="badge badge--danger">
                                                        Critical
                                                    </span>
                                            }

                                            </td>

                                        <td className="text-center">

                                            <button
                                                onClick={() =>
                                                    navigate(`/doctor/patient360/${p.patientId}`)
                                                }
                                                className="btn btn--primary btn--sm"
                                            >

                                                <Eye size={15} />

                                                View

                                            </button>

                                        </td>
                                        

                                    </tr>

                                ))
                            }

                            {
                                filteredPatients.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan={7}
                                            className="data-table__empty"
                                        >

                                            No patients assigned.

                                        </td>

                                    </tr>

                                )
                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </DoctorLayout>

    );

}

export default Patients;
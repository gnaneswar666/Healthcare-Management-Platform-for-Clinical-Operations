import { useEffect, useState } from "react";
import keycloak from "../../keycloak";
import PatientLayout from "../../components/patient/PatientLayout";
import {
    UserCircle2,
    Activity,
    Pill,
    ShieldCheck,
    FileText,
    AlertCircle,
    HeartPulse
} from "lucide-react";
import {
    getPatient,
    getHealthTwin,
    getConsent
} from "../../services/patient360Services";

function Patient360() {

    const [patient, setPatient] = useState(null);
    const [healthTwin, setHealthTwin] = useState(null);
    const [consent, setConsent] = useState(null);

    async function loadData() {

        try {

            const patientId = keycloak.tokenParsed?.patientId;

            if (!patientId) {
                console.error("Patient ID not found");
                return;
            }

            const patientData = await getPatient(patientId);
            console.log(patientData);
            setPatient(patientData);

            try {
                const twin = await getHealthTwin(patientId);
                setHealthTwin(twin);
                console.log("HealthTwin:", twin);
            } catch {
                setHealthTwin(null);
            }

            try {
                const consentData = await getConsent(patientId);
                setConsent(consentData);
            } catch {
                setConsent(null);
            }

        } catch (err) {
            console.error(err);
        }

    }

    useEffect(() => {

        (async () => {
            await loadData();
        })();

        const interval = setInterval(() => {
            loadData();
        }, 15000);

        return () => clearInterval(interval);

    }, []);
    const calculateAge = (dob) => {
    if (!dob) return "—";

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};
 const calculateRiskScore = (twin) => {
    let score = 0;

    // Heart Rate
    if (twin.heartRate < 60 || twin.heartRate > 100)
        score += 15;

    // Temperature
    if (twin.temperature >= 38)
        score += 20;

    // Oxygen
    if (twin.oxygenLevel < 95)
        score += 25;

    // Blood Pressure
    if (twin.bloodPressure) {
        const [sys, dia] = twin.bloodPressure
            .split("/")
            .map(Number);

        if (sys >= 140 || dia >= 90)
            score += 20;

        if (sys < 90 || dia < 60)
            score += 15;
    }

    // BMI
    if (twin.height && twin.weight) {
        const bmi =
            twin.weight /
            Math.pow(twin.height / 100, 2);

        if (bmi >= 30 || bmi < 18.5)
            score += 20;
    }

    // Chronic diseases
    if (twin.chronicDiseases?.length)
        score += 20;

    return Math.min(score, 100);
};


    if (!patient) {

        return (

            <PatientLayout>
                <div className="page-card flex items-center justify-center py-20">
                    <div className="flex items-center gap-3 text-slate-500">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                        Loading your health hub...
                    </div>
                </div>
            </PatientLayout>

        );

    }

    return (

        <PatientLayout>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--emerald">
                            <HeartPulse size={14} />
                            My Health Hub
                        </div>
                        <h1 className="page-title">
                            {patient.name}
                        </h1>
                        <p className="page-subtitle">
                            Your complete 360° health overview — profile, digital twin, vitals, medical details and consent status at a glance.
                        </p>
                    </div>
                    <div className="page-header__actions">
                        <div className="badge badge--brand badge--dot">
                            Patient ID: {patient.patientId}
                        </div>
                        <div className="page-meta">
                            <UserCircle2 size={15} />
                            {patient.gender} • {calculateAge(patient.dob) ?? "—"} yrs
                        </div>
                    </div>
                </div>

                <div className="grid-section lg:grid-cols-2">
                    <div className="soft-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="stat-card__icon !bg-brand-50 !backdrop-filter-none" style={{ background: "#eff6ff" }}>
                                <UserCircle2 size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Patient Profile</h3>
                                <p className="text-sm text-slate-500">Contact & demographics</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <Row label="Patient ID" value={patient.patientId} mono />
                            <Row label="Full name" value={patient.firstName+" " + patient.lastName} />
                            <Row label="Gender" value={patient.gender} />
                            <Row label="Age" value={`${calculateAge(patient.dob)  ?? "—"} years`} />
                            <Row label="Email" value={patient.email} />
                            <Row label="Phone" value={patient.phone} />
                            <Row label="Address" value={patient.address} />
                        </div>
                    </div>

                    <div className="soft-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="stat-card__icon" style={{ background: "rgba(244, 63, 94, 0.12)" }}>
                                <Activity size={20} className="text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Latest Vitals</h3>
                                <p className="text-sm text-slate-500">Most recent biometric readings</p>
                            </div>
                        </div>
                        {healthTwin ? (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <Vital label="Heart Rate" value={`${healthTwin.heartRate ?? "—"}`} unit="bpm" tone="rose" />
                                <Vital label="Temperature" value={`${healthTwin.temperature ?? "—"}`} unit="°F" tone="amber" />
                                <Vital label="SpO₂" value={`${healthTwin.oxygenLevel ?? "—"}`} unit="%" tone="emerald" />
                                <Vital label="BP" value={healthTwin.bloodPressure ?? "—"} unit="mmHg" tone="brand" />
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700 flex items-start gap-2">
                                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="font-semibold">No HealthTwin record on file</div>
                                    <p className="mt-0.5 text-rose-600/90 text-[0.85rem]">Capture vitals to populate the latest readings panel.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="soft-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="stat-card__icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>
                                <Activity size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Health Summary</h3>
                                <p className="text-sm text-slate-500">Anthropometrics & risk</p>
                            </div>
                        </div>
                        {healthTwin ? (
                            <div className="space-y-3 text-sm">
                                <Row label="Height" value={healthTwin.height ? `${healthTwin.height} cm` : "—"} />
                                <Row label="Weight" value={healthTwin.weight ? `${healthTwin.weight} kg` : "—"} />
                                <Row label="Blood Group" value={healthTwin.bloodGroup ?? "—"} />
                                <div>
                                    <div className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Risk Score</div>
                                    <span className="badge badge--rose badge--dot">
                                        {calculateRiskScore(healthTwin)?? "—"}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <EmptyHint title="No summary data" tone="slate" />
                        )}
                    </div>

                    <div className="soft-card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="stat-card__icon" style={{ background: "rgba(139, 92, 246, 0.12)" }}>
                                <Pill size={20} className="text-violet-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Medical Details</h3>
                                <p className="text-sm text-slate-500">Allergies, conditions & meds</p>
                            </div>
                        </div>
                        {healthTwin ? (
                            <div className="space-y-4 text-sm">
                                <div>
                                    <div className="text-slate-500 mb-1.5 text-xs uppercase tracking-wider font-semibold">Allergies</div>
                                    <ChipRow items={healthTwin.allergies} tone="rose" fallback="None reported" />
                                </div>
                                <div>
                                    <div className="text-slate-500 mb-1.5 text-xs uppercase tracking-wider font-semibold">Chronic Conditions</div>
                                    <ChipRow items={healthTwin.chronicDiseases} tone="violet" fallback="None reported" />
                                </div>
                                <div>
                                    <div className="text-slate-500 mb-1.5 text-xs uppercase tracking-wider font-semibold">Current Medications</div>
                                    <ChipRow items={healthTwin.currentMedications} tone="brand" fallback="None reported" />
                                </div>
                            </div>
                        ) : (
                            <EmptyHint title="No medical details" tone="slate" />
                        )}
                    </div>

                    <div className="soft-card lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="stat-card__icon" style={{ background: "rgba(14, 165, 233, 0.12)" }}>
                                <ShieldCheck size={20} className="text-sky-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Consent Record</h3>
                                <p className="text-sm text-slate-500">FHIR consent & data sharing authorization</p>
                            </div>
                        </div>
                        {consent ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <div className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Type</div>
                                    <div className="font-semibold text-slate-800">{consent.consentType}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Status</div>
                                    <span className={`badge badge--dot ${(consent.status?.toLowerCase?.()?.includes("grant") || consent.status?.toLowerCase?.()?.includes("activ")) ? "badge--success" : "badge--warning"}`}>
                                        {consent.status ?? "—"}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Granted</div>
                                    <div className="font-semibold text-slate-800">
                                        {new Date(consent.grantedDate).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 mb-1 text-xs uppercase tracking-wider font-semibold">Expiry</div>
                                    <div className="font-semibold text-slate-800">
                                        {new Date(consent.expiryDate).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <EmptyHint title="No consent on file" tone="amber" icon={<FileText size={18} />} />
                        )}
                    </div>
                </div>
            </div>
        </PatientLayout>

    );

}

function Row({ label, value, mono }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold pt-0.5 whitespace-nowrap">{label}</span>
            <span className={`font-semibold text-slate-800 text-right ${mono ? "font-mono text-[0.82rem]" : ""}`}>
                {value || "—"}
            </span>
        </div>
    );
}

function Vital({ label, value, unit, tone }) {
    const toneMap = {
        rose: "bg-rose-50 text-rose-700 border-rose-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
        brand: "bg-blue-50 text-blue-700 border-blue-100",
    };
    return (
        <div className={`rounded-2xl border px-4 py-3 ${toneMap[tone] || toneMap.brand}`}>
            <div className="text-[0.72rem] uppercase tracking-wider opacity-80 font-semibold">{label}</div>
            <div className="mt-1 font-bold text-lg leading-tight">
                {value} <span className="text-[0.8rem] font-medium opacity-75">{unit}</span>
            </div>
        </div>
    );
}

function ChipRow({ items, tone, fallback }) {
    const map = {
        rose: "badge--rose",
        violet: "badge--violet",
        brand: "badge--brand",
        slate: "badge--slate",
    };
    if (!items || !items.length) {
        return <div className="text-slate-400 italic text-sm">{fallback}</div>;
    }
    return (
        <div className="flex flex-wrap gap-2">
            {items.filter(Boolean).map((x, i) => (
                <span key={i} className={`badge ${map[tone] || "badge--slate"}`}>
                    {x}
                </span>
            ))}
        </div>
    );
}

function EmptyHint({ title, tone = "slate", icon }) {
    const toneMap = {
        slate: "bg-slate-50 text-slate-600 border-slate-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return (
        <div className={`rounded-2xl border px-4 py-5 text-sm flex items-start gap-2 ${toneMap[tone]}`}>
            <span className="mt-0.5">{icon || <FileText size={18} className="flex-shrink-0 opacity-70" />}</span>
            <div>
                <div className="font-semibold">{title}</div>
            </div>
        </div>
    );
}

export default Patient360;
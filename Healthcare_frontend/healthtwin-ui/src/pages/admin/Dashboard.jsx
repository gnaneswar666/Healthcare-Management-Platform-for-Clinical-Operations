import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import RecentPatients from "../../components/admin/RecentPatients";
import CriticalAlerts from "../../components/admin/CriticalAlerts";
import QuickActions from "../../components/admin/QuickActions";
import DashboardCharts from "../../components/admin/DashboardCharts";
import RecentActivities from "../../components/admin/RecentActivities";
import { Users, HeartPulse, ShieldCheck, Activity, Sparkles } from "lucide-react";
import { getPatients, getHealthTwins, getConsents, getVitals } from "../../services/dashboardService";

function Dashboard() {
    const [patients, setPatients] = useState([]);
    const [twins, setTwins] = useState([]);
    const [consents, setConsents] = useState([]);
    const [vitals, setVitals] = useState([]);

    async function loadDashboard() {
        try {
            const [patientData, twinData, consentData, vitalData] = await Promise.all([
                getPatients(),
                getHealthTwins(),
                getConsents(),
                getVitals()
            ]);

            setPatients(patientData);
            setTwins(twinData);
            setConsents(consentData);
            setVitals(vitalData);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadDashboard();
        const interval = setInterval(loadDashboard, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AdminLayout>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip">
                            <Sparkles size={14} />
                            Executive overview
                        </div>
                        <h1 className="page-title">Admin Dashboard</h1>
                        <p className="page-subtitle">A polished operational view of patients, digital twins, consents, and clinical activity across the platform.</p>
                    </div>
                    <div className="page-meta">
                        <Activity size={15} />
                        Updated in real time from connected care systems
                    </div>
                </div>

                <div className="grid-section md:grid-cols-2 xl:grid-cols-4 mb-8">
                    <StatCard title="Patients" value={patients.length} subtitle="Registered Patients" icon={<Users size={24} />} variant="brand" />
                    <StatCard title="Health Twins" value={twins.length} subtitle="Active Digital Twins" icon={<HeartPulse size={24} />} variant="emerald" />
                    <StatCard title="Consents" value={consents.length} subtitle="FHIR Consents on file" icon={<ShieldCheck size={24} />} variant="violet" />
                    <StatCard title="Vitals" value={vitals.length} subtitle="Wearable Records" icon={<Activity size={24} />} variant="rose" />
                </div>

                <div className="grid-section xl:grid-cols-3 mb-8">
                    <div className="xl:col-span-2">
                        <RecentPatients patients={patients} />
                    </div>
                    <div>
                        <CriticalAlerts vitals={vitals} />
                    </div>
                </div>

                

                <div className="mb-8">
                    <DashboardCharts patients={patients} consents={consents} />
                </div>

                <RecentActivities patients={patients} consents={consents} vitals={vitals} />
            </div>
        </AdminLayout>
    );
}

export default Dashboard;

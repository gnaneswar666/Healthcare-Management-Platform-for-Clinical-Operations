import AdminLayout from "../../components/admin/AdminLayout";
import { Activity } from "lucide-react";

function Vitals() {
    return (
        <AdminLayout>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--rose">
                            <Activity size={14} />
                            Biometric Feed
                        </div>
                        <h1 className="page-title">Vitals</h1>
                        <p className="page-subtitle">Monitor wearable and clinical vitals feeds across the patient population in real time.</p>
                    </div>
                    <div className="page-meta">
                        <Activity size={15} />
                        Live Biometric Telemetry
                    </div>
                </div>

                <div className="section-card flex items-center justify-center py-20 text-center">
                    <div>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
                            <Activity size={32} className="text-rose-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Vitals Dashboard</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Population-wide vitals trends, threshold alerts and anomaly detection are ready for configuration in this module.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Vitals;

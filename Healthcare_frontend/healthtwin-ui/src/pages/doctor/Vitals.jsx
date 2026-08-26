import DoctorLayout from "../../components/doctor/DoctorLayout";
import { HeartPulse } from "lucide-react";

function Vitals() {
    return (
        <DoctorLayout>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--rose">
                            <HeartPulse size={14} />
                            Vitals Capture
                        </div>
                        <h1 className="page-title">Record Vitals</h1>
                        <p className="page-subtitle">Quick-entry vitals capture form — log biometrics for any patient on your panel with full audit trace.</p>
                    </div>
                    <div className="page-meta">
                        <HeartPulse size={15} />
                        Clinical Biometrics
                    </div>
                </div>

                <div className="section-card flex items-center justify-center py-20 text-center">
                    <div>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50">
                            <HeartPulse size={32} className="text-rose-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Bulk Vitals Entry</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            A dedicated vitals capture module with patient search, multi-field biometric entry, and historical review is coming here.
                        </p>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}

export default Vitals;

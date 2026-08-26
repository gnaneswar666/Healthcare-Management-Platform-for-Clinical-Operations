import AdminLayout from "../../components/admin/AdminLayout";
import { Database } from "lucide-react";

function FHIRDashboard() {
    return (
        <AdminLayout>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--violet">
                            <Database size={14} />
                            Interoperability Layer
                        </div>
                        <h1 className="page-title">FHIR Data Hub</h1>
                        <p className="page-subtitle">Fast Healthcare Interoperability Resources dashboard — sync status, resources and audit trail.</p>
                    </div>
                    <div className="page-meta">
                        <Database size={15} />
                        HL7 FHIR R4
                    </div>
                </div>

                <div className="section-card flex items-center justify-center py-20 text-center">
                    <div>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                            <Database size={32} className="text-violet-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">FHIR Interoperability</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Patient, Consent, Observation and Condition FHIR resources will be visible here with full audit history and server status.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default FHIRDashboard;

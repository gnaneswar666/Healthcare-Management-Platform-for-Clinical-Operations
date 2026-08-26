import AdminLayout from "../../components/admin/AdminLayout";
import KeycloakAuditLogs from "../../components/admin/KeycloakAuditLogs";
import { FileBarChart2 } from "lucide-react";

function Reports() {
    return (
        <AdminLayout>
            <div className="page-card space-y-6">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--amber">
                            <FileBarChart2 size={14} />
                            Business Intelligence & Audit Logs
                        </div>
                        <h1 className="page-title">Reports & Audit Trails</h1>
                        <p className="page-subtitle">Inspect patient registration logs, Keycloak identity credentials activity, and system audit trails.</p>
                    </div>
                    <div className="page-meta">
                        <FileBarChart2 size={15} />
                        Analytics & Audit Suite
                    </div>
                </div>

                {/* Keycloak Registration Audit Log Microservice Component */}
                <KeycloakAuditLogs />
            </div>
        </AdminLayout>
    );
}

export default Reports;


import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import FooterStatus from "./FooterStatus";

function AdminLayout({ children }) {
    return (
        <div className="app-shell flex min-h-screen">
            <AdminSidebar />
            <div className="app-main">
                <AdminHeader />
                <main className="app-content">
                    <div className="app-content-inner">
                        {children}
                    </div>
                </main>
                <FooterStatus />
            </div>
        </div>
    );
}

export default AdminLayout;

import Navbar from "../navbar/Navbar";
import DoctorSidebar from "./DoctorSidebar";

function DoctorLayout({ children }) {
    return (
        <div className="app-shell flex min-h-screen">
            <DoctorSidebar />
            <div className="app-main">
                <Navbar />
                <main className="app-content">
                    <div className="app-content-inner">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DoctorLayout;

import Navbar from "../navbar/Navbar";
import PatientSidebar from "./PatientSidebar";

function PatientLayout({ children }) {
    return (
        <div className="app-shell flex min-h-screen">
            <PatientSidebar />
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

export default PatientLayout;

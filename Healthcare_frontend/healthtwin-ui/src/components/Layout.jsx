import Navbar from "./navbar/Navbar";
import Sidebar from "./Sidebar";

function Layout({ children, keycloak }) {
    return (
        <div className="app-shell flex min-h-screen">
            <Sidebar />

            <div className="app-main">
                <Navbar keycloak={keycloak} />

                <main className="app-content">
                    <div className="app-content-inner">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Layout;
import { Navigate } from "react-router-dom";

function ProtectedRoute({ keycloak, allowedRoles, children }) {

    const roles = keycloak?.tokenParsed?.realm_access?.roles || [];

    const hasRole = allowedRoles.some(allowed =>
        roles.some(role => role.toUpperCase() === allowed.toUpperCase())
    );

    if (!hasRole) {

        if (roles.some(r => r.toUpperCase() === "ADMIN")) {
            return <Navigate to="/admin/dashboard" replace />;
        }

        if (roles.some(r => r.toUpperCase() === "DOCTOR")) {
            return <Navigate to="/doctor/dashboard" replace />;
        }

        if (roles.some(r => r.toUpperCase() === "PATIENT")) {
            return <Navigate to="/patient/dashboard" replace />;
        }

        if (keycloak && !keycloak.authenticated) {
            keycloak.login();
            return null;
        }

        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Login
import Login from "./pages/Login";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPatients from "./pages/admin/Patients";
import Doctors from "./pages/admin/Doctors";
import AddPatient from "./pages/admin/AddPatient";
import HealthTwins from "./pages/admin/HealthTwins";
import AdminVitals from "./pages/admin/Vitals";
import FHIRDashboard from "./pages/admin/FHIRDashboard";
import AIPrediction from "./pages/admin/AIPrediction";
import Reports from "./pages/admin/Reports";
import EditPatient from "./pages/admin/EditPatient";
import PatientDetails from "./pages/admin/PatientDetails";
import EditHealthTwin from "./pages/admin/EditHealthTwin";
import AiPrediction from "./pages/admin/AIPrediction";
import ModelManagement from "./pages/admin/ModelManagement";
import AdminAlerts from "./pages/admin/Alert";
import AdminCarePlans from "./pages/admin/CarePlans";
// Doctor
import AdminAnomaly from "./pages/admin/Anomaly";
import DoctorAnomaly from "./pages/doctor/Anomaly";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorHealthTwin from "./pages/doctor/HealthTwin";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPatient360 from "./pages/doctor/Patient360";
import Alerts from "./pages/doctor/Alerts";
import DoctorAiPrediction from "./pages/doctor/AiPrediction";
import DoctorCarePlans from "./pages/doctor/CarePlans";


// Patient
import Patient360 from "./pages/patient/Patient360";
import PatientHealthTwin from "./pages/patient/HealthTwin";
import Consents from "./pages/patient/Consents";
import PatientAiPrediction from "./pages/patient/PatientAiPrediction";
import PatientDiabetesPrediction from "./pages/patient/PatientDiabetesPrediction";
import PatientAlerts from "./pages/patient/Alerts";


// Protected routes
import ProtectedRoute from "./components/ProtectedRoute";
import PatientCarePlan from "./pages/patient/PatientCarePlan";

function App({ keycloak }) {

  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];

  const isAdmin = roles.some(r => r.toUpperCase() === "ADMIN");
  const isDoctor = roles.some(r => r.toUpperCase() === "DOCTOR");
  const isPatient = roles.some(r => r.toUpperCase() === "PATIENT");

  useEffect(() => {
    if (keycloak && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [keycloak]);

  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect after login */}
        <Route
          path="/"
          element={
            isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : isDoctor ? (
              <Navigate to="/doctor/dashboard" replace />
            ) : isPatient ? (
              <Navigate to="/patient/dashboard" replace />
            ) : (
              <Login keycloak={keycloak} />
            )
          }
        />

        {/* Admin */}
                <Route
            path="/admin/dashboard"
            element={
                <ProtectedRoute
                    keycloak={keycloak}
                    allowedRoles={["ADMIN"]}
                >
                    <AdminDashboard keycloak={keycloak} />
                </ProtectedRoute>
            }
        />
        <Route
    path="/admin/patients"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <AdminPatients />
        </ProtectedRoute>
    }
/>
           
  <Route
    path="/admin/patients/add"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <AddPatient />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/patients/edit/:patientId"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <EditPatient />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/healthtwins"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <HealthTwins />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/healthtwins/edit/:patientId"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <EditHealthTwin />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/vitals"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <AdminVitals />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/ai-predictions"
    element={<AiPrediction />}
/>
<Route
    path="/admin/patient/:patientId"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <PatientDetails />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/fhir"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <FHIRDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/ai"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <AIPrediction />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/reports"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <Reports />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/models"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <ModelManagement />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/doctors"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <Doctors keycloak={keycloak} />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/alerts"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <AdminAlerts keycloak={keycloak}/>
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/anomaly"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <AdminAnomaly keycloak={keycloak} />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/careplans"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["ADMIN"]}
        >
            <AdminCarePlans keycloak={keycloak} />
        </ProtectedRoute>
    }
/>





        {/* Doctor */}
              <Route
          path="/doctor/dashboard"
          element={
              <ProtectedRoute
                  keycloak={keycloak}
                  allowedRoles={["DOCTOR"]}
              >
                  <DoctorDashboard keycloak={keycloak}/>
              </ProtectedRoute>
          }
      />
         <Route
    path="/doctor/alerts"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["DOCTOR"]}
        >
            <Alerts keycloak={keycloak}/>
        </ProtectedRoute>
    }
/>
   <Route
    path="/doctor/patients"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["DOCTOR"]}
        >
            <DoctorPatients keycloak={keycloak} />
        </ProtectedRoute>
    }
/>
            <Route
    path="/doctor/healthtwin"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["DOCTOR"]}
        >
            <DoctorHealthTwin keycloak={keycloak}/>
        </ProtectedRoute>
    }
/>
      <Route
    path="/doctor/patient360/:patientId"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["DOCTOR"]}
        >
            <DoctorPatient360 />
        </ProtectedRoute>
    }
/>
<Route
    path="/doctor/ai-prediction"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["DOCTOR"]}
        >
            <DoctorAiPrediction keycloak={keycloak}/>
        </ProtectedRoute>
    }
/>
<Route
    path="/doctor/anomaly"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["DOCTOR"]}
        >
            <DoctorAnomaly keycloak={keycloak} />
        </ProtectedRoute>
    }
/>
<Route
    path="/doctor/careplans"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["DOCTOR"]}
        >
            <DoctorCarePlans keycloak={keycloak} />
        </ProtectedRoute>
    }
/>

        {/* Patient */}
          <Route
        path="/patient/healthtwin"
        element={
            <ProtectedRoute
                keycloak={keycloak}
                allowedRoles={["PATIENT"]}
            >
                <PatientHealthTwin keycloak={keycloak}/>
            </ProtectedRoute>
        }
    />
          <Route
        path="/patient/consents"
        element={
            <ProtectedRoute
                keycloak={keycloak}
                allowedRoles={["PATIENT"]}
            >
                <Consents keycloak={keycloak}/>
            </ProtectedRoute>
        }
    />
    <Route
        path="/patient/dashboard"
        element={
            <ProtectedRoute
                keycloak={keycloak}
                allowedRoles={["PATIENT"]}
            >
                <Patient360 />
            </ProtectedRoute>
        }
    />
   <Route
    path="/patient/ai-prediction"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["PATIENT"]}
        >
            <PatientAiPrediction />
        </ProtectedRoute>
    }
/>
<Route
    path="/patient/diabetes-prediction"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["PATIENT"]}
        >
            <PatientDiabetesPrediction />
        </ProtectedRoute>
    }
/>
<Route
    path="/patient/alerts"
    element={
        <ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["PATIENT"]}
        >
            <PatientAlerts keycloak={keycloak}/>
        </ProtectedRoute>
    }
/>
<Route
  path="/patient/careplan"
  element={
<ProtectedRoute
            keycloak={keycloak}
            allowedRoles={["PATIENT"]}
        >      <PatientCarePlan keycloak={keycloak} />
    </ProtectedRoute>
  }
/>
   
      </Routes>
    </BrowserRouter>
  );
}

export default App;
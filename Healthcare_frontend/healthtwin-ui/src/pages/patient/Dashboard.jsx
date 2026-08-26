import { useEffect, useState } from "react";
import PatientLayout from "../../components/patient/PatientLayout";

function Dashboard() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => forceUpdate((c) => c + 1), 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <PatientLayout>
            <h1 className="text-3xl font-bold">
                Patient Dashboard
            </h1>
        </PatientLayout>
    );
}

export default Dashboard;

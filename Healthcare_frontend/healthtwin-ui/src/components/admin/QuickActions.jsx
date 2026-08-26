import { Link } from "react-router-dom";
import {
    UserPlus,
    Users,
    Stethoscope,
    HeartPulse,
    Activity,
    ShieldCheck,
    BrainCircuit,
    FileText
} from "lucide-react";

const actions = [

    {
        title: "Add Patient",
        icon: UserPlus,
        color: "bg-gradient-to-r from-blue-600 to-indigo-600",
        link: "/admin/patients/add"
    },

    {
        title: "Patients",
        icon: Users,
        color: "bg-gradient-to-r from-cyan-600 to-blue-600",
        link: "/admin/patients"
    },

    {
        title: "Doctors",
        icon: Stethoscope,
        color: "bg-gradient-to-r from-green-600 to-emerald-600",
        link: "/admin/doctors"
    },

    {
        title: "Health Twins",
        icon: HeartPulse,
        color: "bg-gradient-to-r from-emerald-500 to-green-700",
        link: "/admin/healthtwins"
    },

    {
        title: "Vitals",
        icon: Activity,
        color: "bg-gradient-to-r from-red-500 to-orange-500",
        link: "/admin/vitals"
    },

    {
        title: "FHIR",
        icon: ShieldCheck,
        color: "bg-gradient-to-r from-purple-600 to-indigo-700",
        link: "/admin/fhir"
    },

    {
        title: "AI Prediction",
        icon: BrainCircuit,
        color: "bg-gradient-to-r from-pink-600 to-purple-700",
        link: "/admin/ai"
    },

    {
        title: "Reports",
        icon: FileText,
        color: "bg-gradient-to-r from-orange-500 to-yellow-500",
        link: "/admin/reports"
    }

];

function QuickActions() {
    return (
        <div className="page-card mt-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
                    <p className="text-sm text-slate-500">Common administrative workflows</p>
                </div>
                <div className="metric-chip">Fast access</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.title}
                            to={action.link}
                            className={`${action.color} rounded-[20px] p-5 text-white shadow-[0_18px_35px_-20px_rgba(15,23,42,0.55)] transition duration-300 hover:-translate-y-1`}
                        >
                            <Icon size={28} />
                            <p className="mt-4 font-semibold">{action.title}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default QuickActions;
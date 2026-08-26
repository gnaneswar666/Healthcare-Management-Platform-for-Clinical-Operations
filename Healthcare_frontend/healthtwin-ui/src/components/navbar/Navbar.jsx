import { Bell, LogOut, UserCircle2, Sparkles, CalendarDays } from "lucide-react";
import keycloak from "../../keycloak";

function Navbar() {
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    const username = keycloak.tokenParsed?.preferred_username || "User";
    const email = keycloak.tokenParsed?.email || "";

    const isDoctor = roles.includes("DOCTOR");
    const isPatient = roles.includes("PATIENT");

    const chipLabel = isDoctor ? "Clinical workspace" : isPatient ? "My health hub" : "Workspace";
    const greetingRole = isDoctor ? "Doctor" : isPatient ? "" : "";
    const subtitle = isDoctor
        ? "Oversee patient care and clinical insights in real time."
        : isPatient
        ? "Monitor your Digital Twin and wellness journey in real time."
        : "Welcome to your workspace.";

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (
        <header className="px-4 pt-4 sm:px-6 lg:px-8">
            <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[24px] px-4 py-4 sm:px-6 lg:px-8">
                <div>
                    <div className="page-status-chip mb-2">
                        <Sparkles size={14} />
                        {chipLabel}
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Welcome back{greetingRole ? `, ${greetingRole}` : ""}
                    </h1>
                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                        <CalendarDays size={15} />
                        {today} • {subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn btn--ghost btn--icon relative" aria-label="Notifications">
                        <Bell size={18} />
                        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                    </button>

                    <div className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-white/85 px-3 py-2">
                        <UserCircle2 size={38} className="text-blue-600" />
                        <div className="hidden sm:block">
                            <h3 className="font-semibold text-slate-800 text-[0.92rem]">{username}</h3>
                            <p className="text-sm text-slate-500">
                                {isDoctor ? "Care Team" : isPatient ? "Patient" : "Member"}
                                {email ? ` • ${email}` : ""}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => keycloak.logout()}
                        className="btn btn--dark"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

function DashboardCharts({ patients, consents }) {
    const genderData = [
        { name: "Male", value: patients.filter((p) => p.gender === "Male").length },
        { name: "Female", value: patients.filter((p) => p.gender === "Female").length }
    ];

    const consentData = [
        { name: "Granted", value: consents.filter((c) => c.status === "GRANTED").length },
        { name: "Revoked", value: consents.filter((c) => c.status === "REVOKED").length }
    ];

    const COLORS = ["#2563eb", "#10b981", "#ef4444", "#f59e0b"];

    return (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="page-card">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Patient Demographics</h2>
                        <p className="text-sm text-slate-500">Distribution across registered patients</p>
                    </div>
                    <div className="metric-chip">Live data</div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={genderData} dataKey="value" outerRadius={90} innerRadius={48} label>
                            {genderData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="page-card">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Consent Overview</h2>
                        <p className="text-sm text-slate-500">Grant and revocation activity</p>
                    </div>
                    <div className="metric-chip">Status</div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={consentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default DashboardCharts;
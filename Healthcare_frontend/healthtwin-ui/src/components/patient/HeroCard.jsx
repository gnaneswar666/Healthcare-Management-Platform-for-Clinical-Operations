import { Activity, Clock } from "lucide-react";

function HeroCard({ patientName = "Patient", score = 92 }) {

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
            ? "Good Afternoon"
            : "Good Evening";

    return (

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

            <div className="flex justify-between items-center">

                {/* Left */}

                <div>

                    <div className="flex items-center gap-3">

                        <h1 className="text-4xl font-bold text-slate-800">

                            {greeting}, {patientName}

                        </h1>

                        <span className="text-4xl">
                            👋
                        </span>

                    </div>

                    <p className="mt-3 text-slate-500 text-lg">

                        Welcome back to HealthCare. Monitor your Digital Twin in real time.

                    </p>

                    <div className="flex items-center gap-2 mt-6 text-slate-500">

                        <Clock size={18}/>

                        Last Sync : Just now

                    </div>

                </div>

                {/* Right */}

                <div className="bg-slate-50 rounded-3xl p-6 w-60">

                    <div className="flex justify-between">

                        <h3 className="font-semibold text-slate-700">

                            Health Score

                        </h3>

                        <Activity className="text-green-500"/>

                    </div>

                    <div className="mt-6">

                        <div className="text-5xl font-bold text-green-600">

                            {score}%

                        </div>

                        <div className="mt-4 h-3 bg-slate-200 rounded-full">

                            <div
                                className="h-3 bg-green-500 rounded-full"
                                style={{ width: `${score}%` }}
                            />

                        </div>

                        <p className="text-green-600 mt-3 font-semibold">

                            Excellent

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default HeroCard;
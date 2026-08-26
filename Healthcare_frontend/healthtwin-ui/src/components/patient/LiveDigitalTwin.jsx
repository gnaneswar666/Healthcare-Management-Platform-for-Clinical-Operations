import { motion } from "framer-motion";
import {
    HeartPulse,
    Droplets,
    Thermometer,
    Activity,
    Brain
} from "lucide-react";

function LiveDigitalTwin({ twin }) {
    const vitals = [
        {
            label: "Heart Rate",
            value: `${twin?.heartRate ?? "--"} BPM`,
            icon: HeartPulse,
            gradient: "from-rose-400 to-pink-500",
            color: "text-rose-500",
            bg: "bg-rose-50"
        },
        {
            label: "Blood Pressure",
            value: twin?.bloodPressure ?? "--",
            icon: Droplets,
            gradient: "from-blue-400 to-indigo-500",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            label: "Oxygen Level",
            value: `${twin?.oxygenLevel ?? "--"}%`,
            icon: Activity,
            gradient: "from-emerald-400 to-teal-500",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            label: "Temperature",
            value: `${twin?.temperature ?? "--"} °C`,
            icon: Thermometer,
            gradient: "from-amber-400 to-orange-500",
            color: "text-amber-500",
            bg: "bg-amber-50"
        }
    ];

    const getNormalRange = (label) => {
        const ranges = {
            "Heart Rate": { min: 60, max: 100, current: twin?.heartRate },
            "Blood Pressure": { min: 90, max: 140, current: twin?.bloodPressure ? parseInt(twin.bloodPressure.split("/")[0]) : null },
            "Oxygen Level": { min: 95, max: 100, current: twin?.oxygenLevel },
            "Temperature": { min: 36.1, max: 37.8, current: twin?.temperature }
        };
        const range = ranges[label];
        if (!range || range.current === null || range.current === undefined) return 50;
        if (range.current < range.min) return Math.max(5, (range.current / range.min) * 30);
        if (range.current > range.max) return Math.min(95, 70 + ((range.current - range.max) / range.max) * 30);
        return 30 + ((range.current - range.min) / (range.max - range.min)) * 40;
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-[2px] shadow-2xl mb-6">
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.2),transparent,rgba(16,185,129,0.2),transparent)]"
            />
            <div className="relative rounded-[22px] bg-white p-6 lg:p-8 h-full overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                                <Brain size={20} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Live Digital Twin</h2>
                                <p className="text-sm text-slate-500">Real-time physiological monitoring</p>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 font-semibold text-sm">
                            <motion.span
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className="flex h-2 w-2"
                            >
                                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </motion.span>
                            Live
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        {/* Avatar Section */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute -inset-3 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-xl"
                                />
                                <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-[3px] border-white shadow-2xl flex items-center justify-center overflow-hidden">
                                    <motion.div
                                        animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                                        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                        className="absolute w-28 h-28 bg-gradient-to-br from-blue-200/25 to-indigo-200/25 rounded-full blur-2xl"
                                    />
                                    <svg viewBox="0 0 120 120" className="w-28 h-28 relative z-10">
                                        <defs>
                                            <linearGradient id="avatarGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#1d4ed8" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="60" cy="42" r="18" fill="url(#avatarGrad2)" opacity="0.9" />
                                        <ellipse cx="60" cy="90" rx="32" ry="20" fill="url(#avatarGrad2)" opacity="0.7" />
                                        <circle cx="60" cy="42" r="16" fill="url(#avatarGrad2)" />
                                        <ellipse cx="60" cy="88" rx="28" ry="18" fill="url(#avatarGrad2)" />
                                        <circle cx="52" cy="38" r="2.5" fill="white" opacity="0.8" />
                                        <circle cx="68" cy="38" r="2.5" fill="white" opacity="0.8" />
                                        <path d="M52 48 Q60 54, 68 48" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
                                    </svg>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 border-[3px] border-white shadow-xl flex items-center justify-center"
                                >
                                    <HeartPulse size={18} className="text-white" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Vitals List with Progress Bars */}
                        <div className="space-y-3">
                            {vitals.map((item, index) => {
                                const Icon = item.icon;
                                const progress = getNormalRange(item.label);
                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                        whileHover={{ x: 3 }}
                                        className={`group relative overflow-hidden rounded-2xl p-4 border border-slate-100 ${item.bg} transition-all duration-200 hover:shadow-md`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} shadow-md flex items-center justify-center`}>
                                                    <Icon size={18} className="text-white" />
                                                </div>
                                                <span className="font-medium text-slate-700">{item.label}</span>
                                            </div>
                                            <strong className="text-lg font-bold text-slate-900">{item.value}</strong>
                                        </div>
                                        {/* Mini progress bar */}
                                        <div className="mt-2.5 h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                                transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                                                className={`h-full rounded-full bg-gradient-to-r ${item.gradient}`}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveDigitalTwin;


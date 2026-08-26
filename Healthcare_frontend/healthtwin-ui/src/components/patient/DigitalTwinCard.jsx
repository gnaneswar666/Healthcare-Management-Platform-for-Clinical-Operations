import { motion } from "framer-motion";
import {
    HeartPulse,
    Droplets,
    Activity,
    Thermometer,
    Brain,
    Sparkles
} from "lucide-react";

function DigitalTwinCard({ twin }) {
    const vitals = [
        {
            title: "Heart Rate",
            value: `${twin?.heartRate ?? "--"} BPM`,
            icon: HeartPulse,
            gradient: "from-rose-400 to-pink-500",
            bg: "bg-rose-50",
            border: "border-rose-100",
            glow: "shadow-rose-500/20"
        },
        {
            title: "Blood Pressure",
            value: twin?.bloodPressure ?? "--",
            icon: Droplets,
            gradient: "from-blue-400 to-indigo-500",
            bg: "bg-blue-50",
            border: "border-blue-100",
            glow: "shadow-blue-500/20"
        },
        {
            title: "Oxygen",
            value: `${twin?.oxygenLevel ?? "--"} %`,
            icon: Activity,
            gradient: "from-emerald-400 to-teal-500",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            glow: "shadow-emerald-500/20"
        },
        {
            title: "Temperature",
            value: `${twin?.temperature ?? "--"} °C`,
            icon: Thermometer,
            gradient: "from-amber-400 to-orange-500",
            bg: "bg-amber-50",
            border: "border-amber-100",
            glow: "shadow-amber-500/20"
        }
    ];

    const getRiskStatus = () => {
        const hr = twin?.heartRate;
        const oxy = twin?.oxygenLevel;
        const temp = twin?.temperature;
        if (hr > 120 || oxy < 90 || temp > 39) return { text: "Critical", badge: "badge--danger", color: "from-rose-500 to-red-600" };
        if (hr > 100 || temp > 37.8 || oxy < 95) return { text: "Warning", badge: "badge--warning", color: "from-amber-400 to-orange-500" };
        return { text: "Healthy & Stable", badge: "badge--success", color: "from-emerald-400 to-emerald-500" };
    };

    const status = getRiskStatus();

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[2px] shadow-2xl mb-8">
            {/* Animated gradient border */}
            <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(59,130,246,0.3),transparent,rgba(139,92,246,0.3),transparent)]"
            />
            <div className="relative rounded-[22px] bg-white p-6 lg:p-8 h-full backdrop-blur-xl">
                {/* Decorative top-right gradient blob */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                                <Brain size={22} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Live Digital Twin</h2>
                                <p className="text-slate-500 text-sm">Real-time monitoring of your health</p>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 font-semibold text-sm">
                            <motion.span
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                className="flex h-2.5 w-2.5"
                            >
                                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                            </motion.span>
                            <span>Live Connected</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8 items-center">
                        {/* Avatar Section */}
                        <div className="lg:col-span-2 flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative"
                            >
                                {/* Outer glow ring */}
                                <motion.div
                                    animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-xl"
                                />
                                {/* Avatar container */}
                                <div className="relative w-52 h-52 rounded-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-[3px] border-white shadow-2xl flex items-center justify-center overflow-hidden">
                                    {/* Animated background orbs */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                        className="absolute w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl"
                                    />
                                    <svg viewBox="0 0 120 120" className="w-32 h-32 relative z-10">
                                        <defs>
                                            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#1d4ed8" />
                                            </linearGradient>
                                            <radialGradient id="avatarGlow">
                                                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </radialGradient>
                                        </defs>
                                        <circle cx="60" cy="42" r="18" fill="url(#avatarGrad)" opacity="0.9" />
                                        <ellipse cx="60" cy="90" rx="32" ry="20" fill="url(#avatarGrad)" opacity="0.7" />
                                        <circle cx="60" cy="42" r="16" fill="url(#avatarGrad)" />
                                        <ellipse cx="60" cy="88" rx="28" ry="18" fill="url(#avatarGrad)" />
                                        <circle cx="52" cy="38" r="2.5" fill="white" opacity="0.8" />
                                        <circle cx="68" cy="38" r="2.5" fill="white" opacity="0.8" />
                                        <path d="M52 48 Q60 54, 68 48" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
                                    </svg>
                                </div>
                                {/* Heart pulse badge */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    className="absolute -bottom-1 -right-1 w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 border-[3px] border-white shadow-xl flex items-center justify-center shadow-rose-500/30"
                                >
                                    <HeartPulse size={22} className="text-white" />
                                </motion.div>
                            </motion.div>
                            <h3 className="mt-6 text-xl font-bold text-slate-900">Digital Twin</h3>
                            <span className={`badge ${status.badge} badge--dot mt-2`}>{status.text}</span>
                        </div>

                        {/* Vital Signs Grid */}
                        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                            {vitals.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * index }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className={`group relative overflow-hidden ${item.bg} rounded-2xl p-5 border ${item.border} shadow-md hover:shadow-xl ${item.glow} transition-all duration-300`}
                                    >
                                        {/* Hover gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative z-10">
                                            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg mb-3`}>
                                                <Icon size={20} className="text-white" />
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">{item.title}</p>
                                            <h3 className="text-xl font-bold text-slate-900 mt-1">{item.value}</h3>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Status Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/50"
                    >
                        <Sparkles size={16} className="text-blue-500" />
                        <span className="text-sm text-slate-600">
                            <strong className="text-slate-800">AI Monitoring Active</strong> — Tracking {Object.values(twin || {}).filter(v => v !== undefined && v !== null && v !== "").length} health parameters in real-time
                        </span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default DigitalTwinCard;


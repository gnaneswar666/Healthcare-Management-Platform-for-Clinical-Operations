import { motion } from "framer-motion";
import { HeartPulse, Activity, Thermometer } from "lucide-react";

function LivePatientAvatar({ healthTwin }) {

    const heartRate = healthTwin?.heartRate || 0;
    const oxygen = healthTwin?.oxygenLevel || 0;
    const temperature = healthTwin?.temperature || 0;

let status = "healthy";
    let gradientBg = "from-emerald-400 to-emerald-500";
    let gradientCard = "from-emerald-50 to-teal-50";
    let borderColor = "border-emerald-200";
    let emoji = "😊";
    let ringGradient = "from-emerald-400/30 via-teal-400/20 to-emerald-400/30";

    if (heartRate > 120 || oxygen < 90 || temperature > 39) {
        status = "critical";
        gradientBg = "from-rose-500 to-red-600";
        gradientCard = "from-rose-50 to-red-50";
        borderColor = "border-rose-200";
        emoji = "😟";
        ringGradient = "from-rose-400/30 via-red-400/20 to-rose-400/30";
    } else if (heartRate > 100 || temperature > 37.8) {
        status = "warning";
        gradientBg = "from-amber-400 to-orange-500";
        gradientCard = "from-amber-50 to-orange-50";
        borderColor = "border-amber-200";
        emoji = "😐";
        ringGradient = "from-amber-400/30 via-orange-400/20 to-amber-400/30";
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientCard} border-2 ${borderColor} p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}
        >
            {/* Decorative background orbs */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Avatar with animated rings */}
                <div className="relative mb-4">
                    {/* Outer animated ring */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className={`absolute -inset-4 rounded-full bg-gradient-to-br ${ringGradient} blur-md`}
                    />
                    {/* Middle decorative ring */}
                    <div className="absolute -inset-2 rounded-full border-2 border-dashed border-slate-200/60 animate-[spin_12s_linear_infinite]" />

                    {/* Emoji avatar */}
                    <div className="relative w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-6xl select-none"
                        >
                            {emoji}
                        </motion.div>
                    </div>

                    {/* Heart pulse indicator */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 border-[3px] border-white shadow-lg flex items-center justify-center"
                    >
                        <HeartPulse size={16} className="text-white" />
                    </motion.div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${gradientBg} text-white shadow-lg font-semibold text-sm mb-5`}>
                    <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="flex h-2 w-2"
                    >
                        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </motion.span>
                    {status} • Live
                </div>

                {/* Vital Stats Grid */}
                <div className="grid grid-cols-3 gap-3 w-full">
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 p-4 text-center shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex justify-center mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                                <HeartPulse size={14} className="text-white" />
                            </div>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{heartRate || "--"}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">BPM</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -3 }}
                        className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 p-4 text-center shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex justify-center mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                <Activity size={14} className="text-white" />
                            </div>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{oxygen || "--"}%</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">SpO₂</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -3 }}
                        className="rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 p-4 text-center shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex justify-center mb-1">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                <Thermometer size={14} className="text-white" />
                            </div>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{temperature || "--"}°</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">TEMP</p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default LivePatientAvatar;

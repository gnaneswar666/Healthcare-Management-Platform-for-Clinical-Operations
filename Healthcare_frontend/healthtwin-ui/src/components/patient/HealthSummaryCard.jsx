import {
  Activity,
  Ruler,
  Weight,
  Droplets,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

function MetricCard({ icon, title, value, subtitle, gradient, borderColor }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative overflow-hidden rounded-2xl bg-white border ${borderColor || "border-slate-100"} p-5 shadow-md hover:shadow-xl transition-all duration-300 group`}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient || "from-blue-500 to-indigo-600"} shadow-lg flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-0.5 truncate">{value}</h3>
          {subtitle && (
            <p className="text-sm font-medium text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function HealthSummaryCard({ healthTwin }) {

  const score = healthTwin?.riskScore ?? 0;

let riskText = "Low";
  let barColor = "bg-gradient-to-r from-emerald-400 to-emerald-500";
  let badgeClass = "badge--success";
  let gradientIcon = "from-emerald-400 to-teal-500";

  if (score >= 60) {
    riskText = "High";
    barColor = "bg-gradient-to-r from-rose-400 to-red-500";
    badgeClass = "badge--danger";
    gradientIcon = "from-rose-400 to-red-500";
  } else if (score >= 30) {
    riskText = "Moderate";
    barColor = "bg-gradient-to-r from-amber-400 to-orange-500";
    badgeClass = "badge--warning";
    gradientIcon = "from-amber-400 to-orange-500";
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[2px] shadow-2xl">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent,rgba(16,185,129,0.3),transparent,rgba(59,130,246,0.3),transparent)]"
      />
      <div className="relative rounded-[22px] bg-white p-6 lg:p-8 h-full overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
              <Activity className="w-9 h-9 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Health Summary</h2>
              <p className="text-slate-500 text-sm">Overall Health Metrics</p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard
              icon={<Ruler className="w-8 h-8 text-white" />}
              title="Height"
              value={`${healthTwin?.height ?? "--"} cm`}
              gradient="from-blue-500 to-indigo-600"
              borderColor="border-blue-100"
            />
            <MetricCard
              icon={<Weight className="w-8 h-8 text-white" />}
              title="Weight"
              value={`${healthTwin?.weight ?? "--"} kg`}
              gradient="from-orange-400 to-amber-500"
              borderColor="border-orange-100"
            />
            <MetricCard
              icon={<Droplets className="w-8 h-8 text-white" />}
              title="Blood Group"
              value={healthTwin?.bloodGroup || "--"}
              gradient="from-rose-400 to-pink-500"
              borderColor="border-rose-100"
            />
            <MetricCard
              icon={<ShieldCheck className={`w-8 h-8 text-white`} />}
              title="Risk Status"
              value={riskText}
              subtitle={`Score: ${score}`}
              gradient={gradientIcon}
              borderColor={score >= 60 ? "border-rose-100" : score >= 30 ? "border-amber-100" : "border-emerald-100"}
            />
          </div>

          {/* Risk Score Section */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradientIcon} shadow-sm`}>
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Risk Score</h3>
                  <p className="text-xs text-slate-500">Overall health risk assessment</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-900">{score}%</span>
                <div className={`badge ${badgeClass} badge--dot text-xs`}>{riskText} Risk</div>
              </div>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(score, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full rounded-full ${barColor}`}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-slate-400">Low</span>
              <span className="text-xs text-slate-400">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

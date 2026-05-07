import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  changePositive?: boolean
  icon: LucideIcon
  gradient: string
  delay?: number
}

export default function StatCard({
  label,
  value,
  change,
  changePositive = true,
  icon: Icon,
  gradient,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-5 relative overflow-hidden group hover:border-[#3A3A4A] transition-colors"
    >
      {/* Background glow */}
      <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.07] rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            changePositive
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {changePositive ? "↑" : "↓"} {change}
          </span>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          {value}
        </p>
        <p className="text-sm text-[#94A3B8] mt-1">{label}</p>
      </div>
    </motion.div>
  )
}

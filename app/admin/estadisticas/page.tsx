"use client"

import { motion } from "framer-motion"
import { BarChart2, TrendingUp, Users, Handshake, Calendar } from "lucide-react"

// Mock chart data
const monthlyMembers = [
  { month: "Nov", count: 12 },
  { month: "Dic", count: 19 },
  { month: "Ene", count: 25 },
  { month: "Feb", count: 31 },
  { month: "Mar", count: 38 },
  { month: "Abr", count: 45 },
  { month: "May", count: 52 },
]

const tierDistribution = [
  { tier: "Miembro", count: 31, color: "bg-[#4A4A5A]", pct: 60 },
  { tier: "Empresa", count: 15, color: "bg-indigo-500", pct: 29 },
  { tier: "Inversor", count: 6, color: "bg-amber-500", pct: 11 },
]

const sectorDistribution = [
  { sector: "Tecnología", count: 14, pct: 27 },
  { sector: "Finanzas", count: 11, pct: 21 },
  { sector: "Construcción", count: 9, pct: 17 },
  { sector: "Consultoría", count: 7, pct: 13 },
  { sector: "Salud", count: 6, pct: 12 },
  { sector: "Retail", count: 5, pct: 10 },
  { sector: "Marketing", count: 4, pct: 8 },
]

const sectorColors = [
  "bg-indigo-500", "bg-emerald-500", "bg-amber-500",
  "bg-pink-500", "bg-teal-500", "bg-purple-500", "bg-blue-500",
]

const maxCount = Math.max(...monthlyMembers.map((m) => m.count))

export default function AdminEstadisticasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          Estadísticas
        </h2>
        <p className="text-[#94A3B8] text-sm mt-1">
          Visión general del crecimiento y actividad de la plataforma
        </p>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total miembros", value: "52", icon: Users, color: "from-indigo-500 to-purple-600" },
          { label: "Intros enviadas", value: "234", icon: Handshake, color: "from-emerald-500 to-teal-500" },
          { label: "Crecimiento mensual", value: "+15%", icon: TrendingUp, color: "from-amber-500 to-orange-500" },
          { label: "Meses activo", value: "7", icon: Calendar, color: "from-pink-500 to-rose-500" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-5 relative overflow-hidden group hover:border-[#3A3A4A] transition-colors"
          >
            <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${color} opacity-[0.07] rounded-full blur-xl`} />
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <p className="text-2xl font-bold text-[#E2E8F0]">{value}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Growth chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6"
      >
        <h3 className="font-semibold text-[#E2E8F0] flex items-center gap-2 mb-6">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          Crecimiento de Miembros
        </h3>

        <div className="flex items-end gap-3 h-40">
          {monthlyMembers.map((m, i) => {
            const height = Math.round((m.count / maxCount) * 100)
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-[#94A3B8]">{m.count}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg relative group cursor-pointer"
                  style={{ minHeight: "8px" }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2A2A3A] border border-[#3A3A4A] text-xs text-[#E2E8F0] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {m.count} miembros
                  </div>
                </motion.div>
                <span className="text-[11px] text-[#4A4A5A]">{m.month}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Two column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6"
        >
          <h3 className="font-semibold text-[#E2E8F0] mb-5">Distribución por Tier</h3>
          <div className="space-y-4">
            {tierDistribution.map(({ tier, count, color, pct }) => (
              <div key={tier}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#E2E8F0]">{tier}</span>
                  <span className="text-sm font-medium text-[#94A3B8]">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-[#1A1A24] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sector distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6"
        >
          <h3 className="font-semibold text-[#E2E8F0] mb-5">Distribución por Sector</h3>
          <div className="space-y-3">
            {sectorDistribution.map(({ sector, count, pct }, i) => (
              <div key={sector} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${sectorColors[i]} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#E2E8F0] truncate">{sector}</span>
                    <span className="text-xs text-[#94A3B8] ml-2">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#1A1A24] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.45 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                      className={`h-full ${sectorColors[i]} rounded-full`}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#4A4A5A] w-8 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

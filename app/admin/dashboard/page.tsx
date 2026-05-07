"use client"

import { motion } from "framer-motion"
import StatCard from "@/components/admin/StatCard"
import {
  Users,
  Handshake,
  TrendingUp,
  UserCheck,
  Activity,
  ArrowRight,
  Star,
} from "lucide-react"

// Mock data — replace with Firestore queries when ready
const mockMembers = [
  { id: "1", name: "María Rodríguez", role: "CEO & Fundadora", company: "TechDom", tier: "Empresa", sector: "Tecnología", status: "activo", joined: "2025-12-01", avatar: "MR" },
  { id: "2", name: "Carlos Jiménez", role: "Director", company: "BuildRD", tier: "Inversor", sector: "Construcción", status: "activo", joined: "2025-11-15", avatar: "CJ" },
  { id: "3", name: "Ana Peralta", role: "Gerente Financiera", company: "FinConsult", tier: "Empresa", sector: "Finanzas", status: "activo", joined: "2026-01-20", avatar: "AP" },
  { id: "4", name: "Roberto Santos", role: "Emprendedor", company: "SaludPlus", tier: "Miembro", sector: "Salud", status: "pendiente", joined: "2026-04-10", avatar: "RS" },
  { id: "5", name: "Laura Marte", role: "Fundadora", company: "RetailHub", tier: "Miembro", sector: "Retail", status: "activo", joined: "2026-03-05", avatar: "LM" },
]

const mockIntros = [
  { id: "1", from: "María Rodríguez", to: "Carlos Jiménez", message: "Me interesa hablar sobre oportunidades de inversión en tecnología.", time: "Hace 2h", status: "pendiente" },
  { id: "2", from: "Ana Peralta", to: "Roberto Santos", message: "Tengo experiencia en el sector salud que podría ser útil.", time: "Hace 5h", status: "pendiente" },
  { id: "3", from: "Laura Marte", to: "Carlos Jiménez", message: "Busco capital para expansión de mi cadena de retail.", time: "Hace 1d", status: "enviada" },
]

const actividadReciente = [
  { text: "Patricia Núñez se unió como Miembro", time: "Hace 4h", type: "join" },
  { text: "Carlos Jiménez actualizó su perfil", time: "Hace 6h", type: "update" },
  { text: "3 nuevas solicitudes de intro enviadas", time: "Hace 8h", type: "intro" },
  { text: "Nuevo miembro verificado en Finanzas", time: "Hace 1d", type: "verify" },
]

export default function AdminDashboardPage() {
  const totalMembers = mockMembers.length
  const newThisMonth = mockMembers.filter(m => m.joined >= "2026-04-01").length
  const pendingIntros = mockIntros.filter(i => i.status === "pendiente").length
  const activeMembers = mockMembers.filter(m => m.status === "activo").length

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          Panel de Control
        </h2>
        <p className="text-[#94A3B8] mt-1 text-sm">
          Vista general de la plataforma Nexus · {new Date().toLocaleDateString("es-DO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de miembros"
          value={totalMembers}
          change="12% este mes"
          changePositive
          icon={Users}
          gradient="from-indigo-500 to-purple-600"
          delay={0}
        />
        <StatCard
          label="Nuevos este mes"
          value={newThisMonth}
          change="2 esta semana"
          changePositive
          icon={UserCheck}
          gradient="from-emerald-500 to-teal-500"
          delay={0.05}
        />
        <StatCard
          label="Intros pendientes"
          value={pendingIntros}
          icon={Handshake}
          gradient="from-amber-500 to-orange-500"
          delay={0.1}
        />
        <StatCard
          label="Miembros activos"
          value={activeMembers}
          change="96% tasa de retención"
          changePositive
          icon={TrendingUp}
          gradient="from-pink-500 to-rose-500"
          delay={0.15}
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Members */}
        <div className="lg:col-span-2 bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[#E2E8F0] flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Miembros Recientes
            </h3>
            <button
              onClick={() => window.location.href = "/admin/miembros"}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {mockMembers.slice(0, 4).map((m) => {
              const tierColor =
                m.tier === "Inversor"
                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  : m.tier === "Empresa"
                  ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                  : "text-[#94A3B8] bg-[#2A2A3A] border-[#3A3A4A]"

              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0A0A0F] border border-[#1A1A24] hover:border-[#2A2A3A] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#E2E8F0] truncate">{m.name}</p>
                    <p className="text-xs text-[#94A3B8] truncate">{m.role} · {m.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tierColor}`}>
                      {m.tier}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${m.status === "activo" ? "bg-emerald-400" : "bg-amber-400"}`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6">
          <h3 className="font-semibold text-[#E2E8F0] flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-emerald-400" />
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {actividadReciente.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  a.type === "join" ? "bg-emerald-400" :
                  a.type === "intro" ? "bg-indigo-400" :
                  a.type === "verify" ? "bg-amber-400" : "bg-[#4A4A5A]"
                }`} />
                <div>
                  <p className="text-sm text-[#E2E8F0] leading-snug">{a.text}</p>
                  <p className="text-xs text-[#4A4A5A] mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Intros Preview */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[#E2E8F0] flex items-center gap-2">
            <Handshake className="w-4 h-4 text-amber-400" />
            Solicitudes de Intro Pendientes
            {pendingIntros > 0 && (
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-medium">
                {pendingIntros} pendiente{pendingIntros > 1 ? "s" : ""}
              </span>
            )}
          </h3>
          <button
            onClick={() => window.location.href = "/admin/solicitudes"}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Ver todas <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid gap-3">
          {mockIntros.filter(i => i.status === "pendiente").map((intro) => (
            <div key={intro.id} className="flex items-start gap-4 p-4 bg-[#0A0A0F] border border-[#1A1A24] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {intro.from.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#E2E8F0]">
                  <span className="font-medium">{intro.from}</span>
                  <span className="text-[#94A3B8]"> → </span>
                  <span className="font-medium">{intro.to}</span>
                </p>
                <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">{intro.message}</p>
                <p className="text-[11px] text-[#4A4A5A] mt-1">{intro.time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-medium">
                  Aprobar
                </button>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium">
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

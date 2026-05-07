"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Handshake, CheckCircle2, XCircle, Clock, Filter } from "lucide-react"

type IntroStatus = "pendiente" | "enviada" | "rechazada"

interface IntroRequest {
  id: string
  from: string
  fromRole: string
  to: string
  toRole: string
  message: string
  time: string
  status: IntroStatus
}

const mockIntros: IntroRequest[] = [
  { id: "1", from: "María Rodríguez", fromRole: "CEO · TechDom", to: "Carlos Jiménez", toRole: "Director · BuildRD", message: "Me interesa hablar sobre oportunidades de inversión en tecnología e infraestructura digital.", time: "Hace 2h", status: "pendiente" },
  { id: "2", from: "Ana Peralta", fromRole: "Gerente · FinConsult", to: "Roberto Santos", toRole: "Fundador · SaludPlus", message: "Tengo experiencia en estructuración financiera que podría ser útil para el crecimiento de tu empresa.", time: "Hace 5h", status: "pendiente" },
  { id: "3", from: "Laura Marte", fromRole: "Fundadora · RetailHub", to: "Carlos Jiménez", toRole: "Director · BuildRD", message: "Busco capital para expansión de mi cadena de retail a Santiago y La Romana.", time: "Hace 1d", status: "enviada" },
  { id: "4", from: "José Almonte", fromRole: "Consultor · AlmonteGroup", to: "María Rodríguez", toRole: "CEO · TechDom", message: "Tenemos clientes que necesitan soluciones de tecnología que tu empresa podría proveer.", time: "Hace 2d", status: "enviada" },
  { id: "5", from: "Patricia Núñez", fromRole: "Directora · NuñezTech", to: "Ana Peralta", toRole: "Gerente · FinConsult", message: "Necesito asesoría financiera para una ronda de inversión semilla.", time: "Hace 3d", status: "rechazada" },
]

const statusConfig: Record<IntroStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: {
    label: "Pendiente",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  enviada: {
    label: "Enviada",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  rechazada: {
    label: "Rechazada",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
}

export default function AdminSolicitudesPage() {
  const [filter, setFilter] = useState<"todas" | IntroStatus>("todas")
  const [intros, setIntros] = useState<IntroRequest[]>(mockIntros)

  const filtered = intros.filter((i) => filter === "todas" || i.status === filter)

  const handleApprove = (id: string) => {
    setIntros((prev) => prev.map((i) => (i.id === id ? { ...i, status: "enviada" } : i)))
  }

  const handleReject = (id: string) => {
    setIntros((prev) => prev.map((i) => (i.id === id ? { ...i, status: "rechazada" } : i)))
  }

  const pendingCount = intros.filter((i) => i.status === "pendiente").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          Solicitudes de Introducción
        </h2>
        <p className="text-[#94A3B8] text-sm mt-1">
          Gestiona y aprueba las solicitudes de intro entre miembros
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(["pendiente", "enviada", "rechazada"] as IntroStatus[]).map((status) => {
          const count = intros.filter((i) => i.status === status).length
          const cfg = statusConfig[status]
          return (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? "todas" : status)}
              className={`p-4 rounded-xl border text-left transition-all ${
                filter === status
                  ? "bg-[#1A1A24] border-[#3A3A4A]"
                  : "bg-[#111118] border-[#2A2A3A] hover:border-[#3A3A4A]"
              }`}
            >
              <p className="text-2xl font-bold text-[#E2E8F0]">{count}</p>
              <div className={`inline-flex items-center gap-1 text-xs font-medium mt-1 px-2 py-0.5 rounded-full border ${cfg.color}`}>
                {cfg.icon}
                {cfg.label}
              </div>
            </button>
          )
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#4A4A5A]" />
        {(["todas", "pendiente", "enviada", "rechazada"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1A1A24]"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Intro cards */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((intro) => {
            const cfg = statusConfig[intro.status]
            const isPending = intro.status === "pendiente"

            return (
              <motion.div
                key={intro.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-5 hover:border-[#3A3A4A] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Handshake className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Parties */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#E2E8F0]">{intro.from}</span>
                        <span className="text-[11px] text-[#94A3B8]">{intro.fromRole}</span>
                      </div>
                      <span className="text-[#4A4A5A] text-lg font-light">→</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#E2E8F0]">{intro.to}</span>
                        <span className="text-[11px] text-[#94A3B8]">{intro.toRole}</span>
                      </div>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-[#94A3B8] bg-[#0A0A0F] border border-[#1A1A24] rounded-xl p-3 leading-relaxed">
                      "{intro.message}"
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-[#4A4A5A]">{intro.time}</p>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>

                        {isPending && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(intro.id)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-medium"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleReject(intro.id)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-[#4A4A5A] text-sm">
            No hay solicitudes con este estado
          </div>
        )}
      </div>
    </div>
  )
}

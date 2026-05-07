"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ChevronDown, X, MoreHorizontal, Shield, Ban, Trash2, Eye } from "lucide-react"

type MemberStatus = "activo" | "pendiente" | "suspendido"
type MemberTier = "Miembro" | "Empresa" | "Inversor"

interface AdminMember {
  id: string
  name: string
  role: string
  company: string
  tier: MemberTier
  sector: string
  status: MemberStatus
  joined: string
  avatar: string
  email: string
  whatsapp?: string
}

// Mock data
const allMembers: AdminMember[] = [
  { id: "1", name: "María Rodríguez", role: "CEO & Fundadora", company: "TechDom", tier: "Empresa", sector: "Tecnología", status: "activo", joined: "2025-12-01", avatar: "MR", email: "maria@techdom.do", whatsapp: "+1 809-555-0101" },
  { id: "2", name: "Carlos Jiménez", role: "Director de Inversiones", company: "BuildRD", tier: "Inversor", sector: "Construcción", status: "activo", joined: "2025-11-15", avatar: "CJ", email: "carlos@buildrd.do", whatsapp: "+1 809-555-0102" },
  { id: "3", name: "Ana Peralta", role: "Gerente Financiera", company: "FinConsult RD", tier: "Empresa", sector: "Finanzas", status: "activo", joined: "2026-01-20", avatar: "AP", email: "ana@finconsult.do" },
  { id: "4", name: "Roberto Santos", role: "Emprendedor", company: "SaludPlus", tier: "Miembro", sector: "Salud", status: "pendiente", joined: "2026-04-10", avatar: "RS", email: "roberto@saludplus.do" },
  { id: "5", name: "Laura Marte", role: "Fundadora", company: "RetailHub DO", tier: "Miembro", sector: "Retail", status: "activo", joined: "2026-03-05", avatar: "LM", email: "laura@retailhub.do" },
  { id: "6", name: "José Almonte", role: "Consultor Estratégico", company: "AlmonteGroup", tier: "Empresa", sector: "Consultoría", status: "activo", joined: "2026-02-18", avatar: "JA", email: "jose@almontegroup.do" },
  { id: "7", name: "Patricia Núñez", role: "Directora Comercial", company: "NuñezTech", tier: "Miembro", sector: "Tecnología", status: "activo", joined: "2026-04-28", avatar: "PN", email: "patricia@nuneztech.do" },
  { id: "8", name: "Andrés Castillo", role: "Inversor Ángel", company: "CastilloCapital", tier: "Inversor", sector: "Finanzas", status: "suspendido", joined: "2025-10-30", avatar: "AC", email: "andres@castillocap.do" },
]

const tierColors: Record<MemberTier, string> = {
  Inversor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Empresa: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Miembro: "text-[#94A3B8] bg-[#2A2A3A] border-[#3A3A4A]",
}

const statusConfig: Record<MemberStatus, { label: string; color: string }> = {
  activo: { label: "Activo", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  pendiente: { label: "Pendiente", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  suspendido: { label: "Suspendido", color: "text-red-400 bg-red-500/10 border-red-500/20" },
}

export default function AdminMembersPage() {
  const [search, setSearch] = useState("")
  const [filterTier, setFilterTier] = useState<"todos" | MemberTier>("todos")
  const [filterStatus, setFilterStatus] = useState<"todos" | MemberStatus>("todos")
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null)

  const filtered = allMembers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = filterTier === "todos" || m.tier === filterTier
    const matchStatus = filterStatus === "todos" || m.status === filterStatus
    return matchSearch && matchTier && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
            Miembros
          </h2>
          <p className="text-[#94A3B8] text-sm mt-1">{allMembers.length} miembros registrados en la plataforma</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5A]" />
          <input
            type="text"
            placeholder="Buscar por nombre, empresa o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111118] border border-[#2A2A3A] rounded-xl text-sm text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value as any)}
          className="px-4 py-2.5 bg-[#111118] border border-[#2A2A3A] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
        >
          <option value="todos">Todos los tiers</option>
          <option value="Miembro">Miembro</option>
          <option value="Empresa">Empresa</option>
          <option value="Inversor">Inversor</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2.5 bg-[#111118] border border-[#2A2A3A] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="suspendido">Suspendido</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-[#2A2A3A] text-xs font-medium text-[#4A4A5A] uppercase tracking-wide">
          <span>Miembro</span>
          <span>Empresa</span>
          <span>Tier</span>
          <span>Estado</span>
          <span />
        </div>

        {/* Rows */}
        <div>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[#4A4A5A] text-sm">
                No se encontraron miembros con esos filtros
              </div>
            ) : (
              filtered.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-[#1A1A24] hover:bg-[#0A0A0F] transition-colors relative"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {m.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#E2E8F0] truncate">{m.name}</p>
                      <p className="text-xs text-[#94A3B8] truncate">{m.email}</p>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="min-w-0">
                    <p className="text-sm text-[#E2E8F0] truncate">{m.company}</p>
                    <p className="text-xs text-[#94A3B8] truncate">{m.role}</p>
                  </div>

                  {/* Tier */}
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full border ${tierColors[m.tier]} whitespace-nowrap`}>
                    {m.tier}
                  </span>

                  {/* Status */}
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full border ${statusConfig[m.status].color} whitespace-nowrap`}>
                    {statusConfig[m.status].label}
                  </span>

                  {/* Actions */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)}
                      className="p-2 text-[#4A4A5A] hover:text-[#E2E8F0] hover:bg-[#1A1A24] rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {openMenu === m.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-10 z-20 bg-[#111118] border border-[#2A2A3A] rounded-xl shadow-2xl shadow-black/50 overflow-hidden w-44"
                          >
                            <button
                              onClick={() => { setSelectedMember(m); setOpenMenu(null) }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1A1A24] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ver perfil
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1A1A24] transition-colors">
                              <Shield className="w-3.5 h-3.5" /> Cambiar tier
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors">
                              <Ban className="w-3.5 h-3.5" /> Suspender
                            </button>
                            <div className="border-t border-[#2A2A3A]" />
                            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#2A2A3A] flex items-center justify-between">
          <p className="text-xs text-[#4A4A5A]">
            Mostrando {filtered.length} de {allMembers.length} miembros
          </p>
        </div>
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#E2E8F0]">{selectedMember.name}</h3>
                    <p className="text-sm text-[#94A3B8]">{selectedMember.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-[#4A4A5A] hover:text-[#E2E8F0] transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  ["Empresa", selectedMember.company],
                  ["Sector", selectedMember.sector],
                  ["Tier", selectedMember.tier],
                  ["Estado", statusConfig[selectedMember.status].label],
                  ["Correo", selectedMember.email],
                  ["WhatsApp", selectedMember.whatsapp || "No registrado"],
                  ["Se unió", new Date(selectedMember.joined).toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" })],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[#94A3B8]">{label}</span>
                    <span className="text-[#E2E8F0] font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors">
                  Cambiar tier
                </button>
                <button className="py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
                  Suspender cuenta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

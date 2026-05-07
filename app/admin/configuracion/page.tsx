"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Globe, Bell, Shield, Save, ChevronRight } from "lucide-react"

export default function AdminConfiguracionPage() {
  const [platformName, setPlatformName] = useState("NEXUS")
  const [maxMembers, setMaxMembers] = useState("500")
  const [requireApproval, setRequireApproval] = useState(false)
  const [notifyNewMember, setNotifyNewMember] = useState(true)
  const [notifyNewIntro, setNotifyNewIntro] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? "bg-indigo-500" : "bg-[#2A2A3A]"}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          Configuración
        </h2>
        <p className="text-[#94A3B8] text-sm mt-1">Ajustes globales de la plataforma Nexus</p>
      </div>

      {/* Platform settings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 space-y-5"
      >
        <h3 className="font-semibold text-[#E2E8F0] flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Plataforma
        </h3>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">Nombre de la plataforma</label>
          <input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">Límite máximo de miembros</label>
          <input
            type="number"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </motion.div>

      {/* Access settings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 space-y-4"
      >
        <h3 className="font-semibold text-[#E2E8F0] flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Acceso y Aprobación
        </h3>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-[#E2E8F0]">Requerir aprobación para nuevos miembros</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">Los nuevos registros quedarán en estado "pendiente" hasta ser aprobados</p>
          </div>
          <Toggle enabled={requireApproval} onChange={() => setRequireApproval(!requireApproval)} />
        </div>
      </motion.div>

      {/* Notification settings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#111118] border border-[#2A2A3A] rounded-2xl p-6 space-y-4"
      >
        <h3 className="font-semibold text-[#E2E8F0] flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Notificaciones del Admin
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-[#1A1A24]">
          <div>
            <p className="text-sm text-[#E2E8F0]">Nuevo miembro registrado</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">Recibir alerta cuando alguien se registre</p>
          </div>
          <Toggle enabled={notifyNewMember} onChange={() => setNotifyNewMember(!notifyNewMember)} />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-[#E2E8F0]">Nueva solicitud de intro</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">Recibir alerta cuando se envíe una solicitud de introducción</p>
          </div>
          <Toggle enabled={notifyNewIntro} onChange={() => setNotifyNewIntro(!notifyNewIntro)} />
        </div>
      </motion.div>

      {/* Admin access info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5"
      >
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-indigo-400">Acceso de administrador</p>
            <p className="text-xs text-[#94A3B8] mt-1">
              Para otorgar acceso admin a un usuario, debe asignarse el custom claim{" "}
              <code className="bg-[#1A1A24] px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[11px]">admin: true</code>{" "}
              en Firebase Authentication. Contacta al superadmin para hacer este cambio.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Save button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
          saved
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        }`}
      >
        <Save className="w-4 h-4" />
        {saved ? "¡Cambios guardados!" : "Guardar cambios"}
      </motion.button>
    </div>
  )
}

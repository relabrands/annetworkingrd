"use client"

import { usePathname, useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import {
  LayoutDashboard,
  Users,
  Handshake,
  BarChart2,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/miembros", label: "Miembros", icon: Users },
  { href: "/admin/solicitudes", label: "Solicitudes", icon: Handshake },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: BarChart2 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.replace("/admin")
  }

  return (
    <aside className="w-60 bg-[#0D0D14] border-r border-[#2A2A3A] flex-shrink-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#2A2A3A]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Handshake className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
              NEXUS
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] text-indigo-400 font-medium">
              <ShieldCheck className="w-2.5 h-2.5" />
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-[#1A1A24]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#2A2A3A]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

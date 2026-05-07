"use client"

import { Bell, Search } from "lucide-react"

interface AdminHeaderProps {
  adminName: string
}

export default function AdminHeader({ adminName }: AdminHeaderProps) {
  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="h-16 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#2A2A3A] flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5A]" />
        <input
          type="text"
          placeholder="Buscar miembros, solicitudes..."
          className="pl-10 pr-4 py-2 bg-[#111118] border border-[#2A2A3A] rounded-xl text-sm text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/50 w-64 transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors rounded-lg hover:bg-[#1A1A24]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {initials || "A"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#E2E8F0] leading-none">{adminName}</p>
            <p className="text-[11px] text-indigo-400 mt-0.5">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  )
}

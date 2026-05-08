"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import OnboardingFlow from "@/components/onboarding/OnboardingFlow"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore"
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  User,
  Settings,
  Bell,
  Search,
  Filter,
  Send,
  X,
  Lock,
  Upload,
  Eye,
  Users,
  Handshake,
  Calendar,
  ChevronRight,
  MessageSquare,
  Star,
  Building2,
  Briefcase,
  TrendingUp,
  Sun,
  Moon,
  Monitor,
  LogOut,
} from "lucide-react"

// Types
type MemberTier = "Miembro" | "Empresa" | "Inversor"
type Sector = "Tecnología" | "Construcción" | "Salud" | "Finanzas" | "Retail" | "Consultoría" | "Marketing"

interface Member {
  id: string
  name: string
  role: string
  company: string
  sector: Sector
  tier: MemberTier
  avatar: string
  offers: string[]
  seeking: string[]
  bio: string
  whatsapp?: string
  matchScore?: number
  matchReasons?: string[]
}

// Mock Data - Dominican Business Professionals
const members: Member[] = [
  {
    id: "1",
    name: "María Rodríguez",
    role: "CEO & Fundadora",
    company: "TechRD Solutions",
    sector: "Tecnología",
    tier: "Inversor",
    avatar: "MR",
    offers: ["Inversión Serie A", "Mentoría Tech", "Red de contactos"],
    seeking: ["Startups fintech", "Equipos técnicos"],
    bio: "Inversora ángel con 15+ años en el sector tecnológico dominicano.",
    matchScore: 91,
    matchReasons: ["Mismo sector", "Interés de inversión alineado", "Red complementaria"],
  },
  {
    id: "2",
    name: "Carlos Méndez",
    role: "Director de Operaciones",
    company: "Constructora Méndez",
    sector: "Construcción",
    tier: "Empresa",
    avatar: "CM",
    offers: ["Desarrollo inmobiliario", "Joint ventures", "Terrenos comerciales"],
    seeking: ["Financiamiento", "Socios estratégicos"],
    bio: "Tercera generación en construcción, especializado en proyectos comerciales.",
    matchScore: 78,
    matchReasons: ["Servicios complementarios", "Potencial de crecimiento"],
  },
  {
    id: "3",
    name: "Ana Lucía Peña",
    role: "Directora Médica",
    company: "Centro Médico Integral",
    sector: "Salud",
    tier: "Empresa",
    avatar: "AP",
    offers: ["Alianzas clínicas", "Tecnología médica"],
    seeking: ["Software de gestión", "Inversión en expansión"],
    bio: "Especialista en gestión hospitalaria con visión de transformación digital.",
    matchScore: 65,
    matchReasons: ["Busca soluciones tecnológicas"],
  },
  {
    id: "4",
    name: "Roberto Santana",
    role: "Managing Partner",
    company: "Capital Caribe",
    sector: "Finanzas",
    tier: "Inversor",
    avatar: "RS",
    offers: ["Capital de riesgo", "Due diligence", "Estructuración financiera"],
    seeking: ["Deals en tecnología", "Real estate comercial"],
    bio: "Ex-banquero de inversión, ahora enfocado en el ecosistema emprendedor local.",
    matchScore: 88,
    matchReasons: ["Interés de inversión alineado", "Misma tesis de inversión", "Deal flow activo"],
  },
  {
    id: "5",
    name: "Gabriela Torres",
    role: "Fundadora",
    company: "Retail Dominicana",
    sector: "Retail",
    tier: "Empresa",
    avatar: "GT",
    offers: ["Canales de distribución", "E-commerce expertise"],
    seeking: ["Productos innovadores", "Tech partners"],
    bio: "Pionera en e-commerce dominicano con red de 50+ tiendas físicas.",
    matchScore: 72,
    matchReasons: ["Canales complementarios", "Potencial de crecimiento"],
  },
  {
    id: "6",
    name: "Luis Alberto Gómez",
    role: "Consultor Senior",
    company: "Strategic Partners RD",
    sector: "Consultoría",
    tier: "Miembro",
    avatar: "LG",
    offers: ["Estrategia corporativa", "M&A advisory"],
    seeking: ["Clientes corporativos", "Red de inversores"],
    bio: "Ex-McKinsey, especializado en estrategia para mercados emergentes.",
    matchScore: 83,
    matchReasons: ["Servicios profesionales", "Expansión de red"],
  },
  {
    id: "7",
    name: "Patricia Núñez",
    role: "CTO",
    company: "FinTech Caribe",
    sector: "Tecnología",
    tier: "Empresa",
    avatar: "PN",
    offers: ["Desarrollo fintech", "API banking", "Blockchain"],
    seeking: ["Inversión seed", "Alianzas bancarias"],
    bio: "Ingeniera de sistemas con expertise en pagos digitales y criptomonedas.",
    matchScore: 94,
    matchReasons: ["Mismo sector", "Tecnología complementaria", "Alto potencial de crecimiento"],
  },
  {
    id: "8",
    name: "Miguel Ángel Vega",
    role: "Presidente",
    company: "Grupo Inmobiliario Vega",
    sector: "Construcción",
    tier: "Inversor",
    avatar: "MV",
    offers: ["Co-inversión inmobiliaria", "Desarrollo de proyectos"],
    seeking: ["Proyectos turísticos", "Smart buildings"],
    bio: "Desarrollador inmobiliario con portfolio de $200M+ en propiedades.",
    matchScore: 69,
    matchReasons: ["Enfoque inmobiliario", "Disponibilidad de capital"],
  },
  {
    id: "9",
    name: "Camila Fernández",
    role: "Head of Growth",
    company: "HealthTech RD",
    sector: "Salud",
    tier: "Miembro",
    avatar: "CF",
    offers: ["Marketing digital", "Growth hacking", "Patient acquisition"],
    seeking: ["Funding", "Healthcare partnerships"],
    bio: "Especialista en crecimiento para startups de salud digital.",
    matchScore: 76,
    matchReasons: ["Experiencia en salud", "Enfoque en crecimiento"],
  },
  {
    id: "10",
    name: "Fernando Castillo",
    role: "CFO",
    company: "Inversiones del Caribe",
    sector: "Finanzas",
    tier: "Empresa",
    avatar: "FC",
    offers: ["Estructuración fiscal", "Family office services"],
    seeking: ["Deal flow", "Co-inversores"],
    bio: "CPA con 20 años de experiencia en gestión de patrimonios familiares.",
    matchScore: 81,
    matchReasons: ["Experiencia financiera", "Red de inversión"],
  },
]

// Current User Context
export const CurrentUserContext = createContext<Member | null>(null)

// Activity feed data
const activityFeed = [
  { type: "intro", text: "María Rodríguez y Carlos Méndez fueron conectados", time: "Hace 2h" },
  { type: "member", text: "Patricia Núñez se unió a Nexus", time: "Hace 4h" },
  { type: "event", text: "Networking Dinner - Jueves 8PM", time: "Mañana" },
  { type: "intro", text: "Roberto Santana envió 3 intros hoy", time: "Hace 5h" },
  { type: "member", text: "Nuevo miembro verificado en Finanzas", time: "Hace 1d" },
]

// Sector colors
const sectorColors: Record<Sector, string> = {
  Tecnología: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Construcción: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Salud: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Finanzas: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Retail: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Consultoría: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Marketing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

// Tier badge colors
const tierColors: Record<MemberTier, string> = {
  Miembro: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  Empresa: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Inversor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
}

// Components
function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const incrementTime = duration / end
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, incrementTime)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-[#2A2A3A] rounded ${className}`} />
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 50, x: "-50%" }}
      className="fixed bottom-6 left-1/2 z-50 bg-card border border-border px-4 py-3 rounded-lg shadow-xl flex items-center gap-3"
    >
      <Sparkles className="w-4 h-4 text-indigo-400" />
      <span className="text-sm text-foreground">{message}</span>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
        <div className="w-8 h-8" />
        <div className="w-8 h-8" />
        <div className="w-8 h-8" />
      </div>
    )
  }

  const themes = [
    { value: "light", icon: Sun, label: "Claro" },
    { value: "dark", icon: Moon, label: "Oscuro" },
    { value: "system", icon: Monitor, label: "Auto" },
  ] as const

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-all ${
            theme === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}

function MemberCard({
  member,
  onRequestIntro,
  onViewDetail,
  showMatchScore = false,
}: {
  member: Member
  onRequestIntro: (member: Member) => void
  onViewDetail: (member: Member) => void
  showMatchScore?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), Math.random() * 500 + 200)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onViewDetail(member)}
      className="relative bg-[#111118] border border-[#2A2A3A] rounded-lg p-4 hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {member.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[#E2E8F0] truncate">{member.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${tierColors[member.tier]}`}>
              {member.tier}
            </span>
          </div>
          <p className="text-sm text-[#94A3B8] truncate">{member.role}</p>
          <p className="text-sm text-[#94A3B8] truncate">{member.company}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${sectorColors[member.sector]}`}>
              {member.sector}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-[#94A3B8]">
              <span className="text-emerald-400">Ofrece:</span> {member.offers[0]}
            </p>
            <p className="text-xs text-[#94A3B8]">
              <span className="text-indigo-400">Busca:</span> {member.seeking[0]}
            </p>
          </div>
        </div>
        {showMatchScore && member.matchScore && (
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-emerald-400">
              <AnimatedCounter value={member.matchScore} />%
            </div>
            <p className="text-xs text-[#94A3B8]">afinidad</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-0 bottom-0 p-4 pt-8 bg-gradient-to-t from-[#111118] via-[#111118] to-transparent rounded-b-lg"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRequestIntro(member)
              }}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Solicitar Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function MatchCard({
  member,
  onSendIntro,
  onViewDetail,
}: {
  member: Member
  onSendIntro: (member: Member) => void
  onViewDetail: (member: Member) => void
}) {
  const currentUser = useContext(CurrentUserContext) as Member;
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), Math.random() * 500 + 300)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onViewDetail(member)}
      className="bg-[#111118] border border-[#2A2A3A] rounded-lg p-4 sm:p-6 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-center gap-4 sm:block">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {member.avatar}
          </div>
          <div className="sm:hidden flex-1">
            <h3 className="text-lg font-semibold text-[#E2E8F0]">{member.name}</h3>
            <p className="text-sm text-[#94A3B8]">
              {member.role} @ {member.company}
            </p>
          </div>
          <div className="sm:hidden text-right">
            <div className="text-2xl font-bold text-emerald-400">
              <AnimatedCounter value={member.matchScore || 0} />%
            </div>
            <p className="text-xs text-[#94A3B8]">match</p>
          </div>
        </div>
        <div className="flex-1">
          <div className="hidden sm:flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold text-[#E2E8F0]">{member.name}</h3>
              <p className="text-sm text-[#94A3B8]">
                {member.role} @ {member.company}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-400">
                <AnimatedCounter value={member.matchScore || 0} />%
              </div>
              <p className="text-xs text-[#94A3B8]">compatibilidad</p>
            </div>
          </div>

          {/* Match score bar */}
          <div className="mt-3 sm:mt-4 h-2 bg-[#1A1A24] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${member.matchScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>

          {/* Two columns comparison */}
          <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#0A0A0F] rounded-lg p-3">
              <p className="text-xs text-emerald-400 font-medium mb-2">Lo que ofrecen</p>
              <ul className="space-y-1">
                {member.offers.map((offer, i) => (
                  <li key={i} className="text-sm text-[#E2E8F0]">
                    {offer}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0A0A0F] rounded-lg p-3">
              <p className="text-xs text-indigo-400 font-medium mb-2">Lo que buscas</p>
              <ul className="space-y-1">
                {currentUser.seeking.map((need, i) => (
                  <li key={i} className="text-sm text-[#E2E8F0]">
                    {need}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Match reasons */}
          <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
            {member.matchReasons?.map((reason, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                {reason}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onSendIntro(member)
            }}
            className="mt-3 sm:mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar Introducción
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function MemberDetailModal({
  member,
  onClose,
  onRequestIntro,
}: {
  member: Member
  onClose: () => void
  onRequestIntro: (member: Member) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header with avatar */}
        <div className="relative bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-6 pb-12">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-[#111118]">
              {member.avatar}
            </div>
          </div>
        </div>

        <div className="p-6 pt-14">
          {/* Name and badges */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#E2E8F0]">{member.name}</h2>
              <p className="text-[#94A3B8]">{member.role}</p>
              <p className="text-[#94A3B8] text-sm flex items-center gap-1.5 mt-1">
                <Building2 className="w-4 h-4" />
                {member.company}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${tierColors[member.tier]}`}>
                {member.tier}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${sectorColors[member.sector]}`}>
                {member.sector}
              </span>
            </div>
          </div>

          {/* Match score if available */}
          {member.matchScore && (
            <div className="mb-4 p-3 bg-[#0A0A0F] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#94A3B8]">Score de Afinidad</span>
                <span className="text-lg font-bold text-emerald-400">{member.matchScore}%</span>
              </div>
              <div className="h-2 bg-[#1A1A24] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${member.matchScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                />
              </div>
              {member.matchReasons && member.matchReasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {member.matchReasons.map((reason, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Acerca de</h3>
            <p className="text-[#E2E8F0] text-sm leading-relaxed">{member.bio}</p>
          </div>

          {/* What they offer */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-emerald-400 mb-2">Lo que ofrecen</h3>
            <div className="flex flex-wrap gap-2">
              {member.offers.map((offer, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm"
                >
                  {offer}
                </span>
              ))}
            </div>
          </div>

          {/* What they seek */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-indigo-400 mb-2">Lo que están buscando</h3>
            <div className="flex flex-wrap gap-2">
              {member.seeking.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-[#2A2A3A] text-[#94A3B8] hover:text-[#E2E8F0] hover:border-[#3A3A4A] rounded-lg text-sm font-medium transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose()
                onRequestIntro(member)
              }}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Solicitar Intro
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function IntroModal({
  member,
  onClose,
  onSend,
}: {
  member: Member
  onClose: () => void
  onSend: () => void
}) {
  const currentUser = useContext(CurrentUserContext) as Member;
  const [isGenerating, setIsGenerating] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false)
      setMessage(
        `Hola ${member.name},\n\nSoy Robinson de Nexus Ventures. Vi tu perfil en Nexus y creo que podríamos tener una conversación muy interesante.\n\nEstoy buscando ${currentUser.seeking[0].toLowerCase()} y noté que tienes experiencia en ${member.offers[0].toLowerCase()}. Me encantaría explorar posibles sinergias entre lo que ofreces y lo que estamos construyendo.\n\n¿Te gustaría agendar una llamada esta semana?\n\nSaludos,\nRobinson`
      )
    }, 2000)
    return () => clearTimeout(timer)
  }, [member])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#111118] border border-[#2A2A3A] rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-[#2A2A3A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {member.avatar}
            </div>
            <div>
              <h3 className="font-semibold text-[#E2E8F0]">Enviar intro a {member.name}</h3>
              <p className="text-xs text-[#94A3B8]">{member.role} @ {member.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-indigo-400 font-medium">Introducción generada por IA</span>
          </div>
          <div className={`relative ${isGenerating ? "shimmer-border" : ""} rounded-lg`}>
            {isGenerating ? (
              <div className="bg-[#0A0A0F] rounded-lg p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-48 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg p-4 text-sm text-[#E2E8F0] resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#2A2A3A] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSend}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Enviar Introducción
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Page Components
function Dashboard({ onRequestIntro, onViewDetail }: { onRequestIntro: (member: Member) => void; onViewDetail: (member: Member) => void }) {
  const topMatches = members.filter((m) => m.matchScore && m.matchScore >= 78).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
            Buenos días, Robinson
          </h1>
          <p className="text-[#94A3B8] mt-1">Esto es lo que está pasando en tu red</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full border text-sm font-medium ${tierColors["Empresa"]}`}>
          <Briefcase className="w-4 h-4 inline mr-1.5" />
          Empresa
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Your Matches Today */}
          <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-[#E2E8F0]">Tus Conexiones de Hoy</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {topMatches.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg p-4 hover:border-emerald-500/50 transition-all cursor-pointer"
                  onClick={() => onViewDetail(member)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                      {member.avatar}
                    </div>
                    <div className="text-right ml-auto">
                      <div className="text-xl font-bold text-emerald-400">
                        <AnimatedCounter value={member.matchScore || 0} />%
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#E2E8F0] truncate">{member.name}</h3>
                  <p className="text-xs text-[#94A3B8] truncate">{member.role}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full border ${sectorColors[member.sector]}`}>
                    {member.sector}
                  </span>
                  <p className="mt-2 text-xs text-[#94A3B8]">
                    <span className="text-indigo-400">Seeks:</span> {member.seeking[0]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-lg p-4">
              <div className="flex items-center gap-2 text-[#94A3B8] mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs">Active Members</span>
              </div>
              <div className="text-2xl font-bold text-[#E2E8F0]">
                <AnimatedCounter value={287} duration={2000} />
              </div>
            </div>
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-lg p-4">
              <div className="flex items-center gap-2 text-[#94A3B8] mb-2">
                <Handshake className="w-4 h-4" />
                <span className="text-xs">Intros This Week</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                <AnimatedCounter value={42} duration={1500} />
              </div>
            </div>
            <div className="bg-[#111118] border border-[#2A2A3A] rounded-lg p-4">
              <div className="flex items-center gap-2 text-[#94A3B8] mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-xs">Vistas de Perfil</span>
              </div>
              <div className="text-2xl font-bold text-indigo-400">
                <AnimatedCounter value={18} duration={1200} />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#E2E8F0] mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {activityFeed.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "intro"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : activity.type === "member"
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {activity.type === "intro" ? (
                    <Handshake className="w-4 h-4" />
                  ) : activity.type === "member" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#E2E8F0]">{activity.text}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Discover({ onRequestIntro, onViewDetail }: { onRequestIntro: (member: Member) => void; onViewDetail: (member: Member) => void }) {
  const [sectorFilter, setSectorFilter] = useState<Sector | "All">("All")
  const [tierFilter, setTierFilter] = useState<MemberTier | "All">("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = members.filter((m) => {
    if (sectorFilter !== "All" && m.sector !== sectorFilter) return false
    if (tierFilter !== "All" && m.tier !== tierFilter) return false
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          Descubrir Miembros
        </h1>
        <p className="text-[#94A3B8] mt-1">Encuentra tu próxima conexión de negocios</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-[#111118] border border-[#2A2A3A] rounded-xl">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Buscar miembros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-sm text-[#E2E8F0] placeholder-[#94A3B8] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Filter className="w-4 h-4 text-[#94A3B8] hidden sm:block" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as Sector | "All")}
            className="flex-1 sm:flex-none bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            <option value="All">Todos los Sectores</option>
            {Object.keys(sectorColors).map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as MemberTier | "All")}
            className="flex-1 sm:flex-none bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            <option value="All">Todos los Niveles</option>
            {Object.keys(tierColors).map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <MemberCard key={member.id} member={member} onRequestIntro={onRequestIntro} onViewDetail={onViewDetail} />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#94A3B8]">No se encontraron miembros con esos filtros.</p>
        </div>
      )}
    </div>
  )
}

function MyMatches({ onSendIntro, onViewDetail }: { onSendIntro: (member: Member) => void; onViewDetail: (member: Member) => void }) {
  const matchedMembers = members
    .filter((m) => m.matchScore)
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          Tus Conexiones IA
        </h1>
        <p className="text-[#94A3B8] mt-1">Conexiones seleccionadas basadas en tu perfil y objetivos</p>
      </div>

      <div className="space-y-4">
        {matchedMembers.map((member) => (
          <MatchCard key={member.id} member={member} onSendIntro={onSendIntro} onViewDetail={onViewDetail} />
        ))}
      </div>
    </div>
  )
}

function Profile({ onShowToast }: { onShowToast: (message: string) => void }) {
  const currentUser = useContext(CurrentUserContext) as Member;
  const [profileStrength] = useState(72)
  const sectors: Sector[] = ["Tecnología", "Construcción", "Salud", "Finanzas", "Retail", "Consultoría", "Marketing"]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
          Tu Perfil
        </h1>
        <p className="text-[#94A3B8] mt-1">Gestiona tu presencia profesional</p>
      </div>

      {/* Profile Strength */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#94A3B8]">Fuerza del Perfil</span>
          <span className="text-sm font-semibold text-indigo-400">{profileStrength}%</span>
        </div>
        <div className="h-2 bg-[#1A1A24] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profileStrength}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          />
        </div>
        <p className="text-xs text-[#94A3B8] mt-2">Añade tu WhatsApp para alcanzar el 85%</p>
      </div>

      {/* Avatar Upload */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.avatar}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center text-white transition-colors">
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-[#E2E8F0]">{currentUser.name}</h3>
            <p className="text-sm text-[#94A3B8]">{currentUser.role}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">Nombre</label>
            <input
              type="text"
              defaultValue={currentUser.name}
              className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">Rol</label>
            <input
              type="text"
              defaultValue={currentUser.role}
              className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">Empresa</label>
          <input
            type="text"
            defaultValue={currentUser.company}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">Sector</label>
          <select
            defaultValue={currentUser.sector}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#E2E8F0] focus:outline-none focus:border-indigo-500/50 transition-colors"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">Lo que Ofrezco</label>
          <div className="flex flex-wrap gap-2">
            {currentUser.offers.map((offer, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm"
              >
                {offer}
                <button className="ml-2 hover:text-emerald-300">×</button>
              </span>
            ))}
            <button className="px-3 py-1.5 border border-dashed border-[#2A2A3A] rounded-full text-sm text-[#94A3B8] hover:border-emerald-500/50 hover:text-emerald-400 transition-colors">
              + Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">Lo que Busco</label>
          <div className="flex flex-wrap gap-2">
            {currentUser.seeking.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-sm"
              >
                {item}
                <button className="ml-2 hover:text-indigo-300">×</button>
              </span>
            ))}
            <button className="px-3 py-1.5 border border-dashed border-[#2A2A3A] rounded-full text-sm text-[#94A3B8] hover:border-indigo-500/50 hover:text-indigo-400 transition-colors">
              + Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">Biografía</label>
          <textarea
            rows={3}
            defaultValue={currentUser.bio}
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#E2E8F0] resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-[#94A3B8] mb-2">WhatsApp (opcional)</label>
          <input
            type="tel"
            placeholder="+1 809 XXX XXXX"
            className="w-full px-4 py-2.5 bg-[#0A0A0F] border border-[#2A2A3A] rounded-lg text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Tier Selection */}
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6">
        <h3 className="font-semibold text-[#E2E8F0] mb-4">Nivel de Membresía</h3>
        <div className="grid grid-cols-3 gap-3">
          {(["Miembro", "Empresa", "Inversor"] as MemberTier[]).map((tier) => {
            const isActive = currentUser.tier === tier
            const isLocked = tier === "Inversor" && currentUser.tier !== "Inversor"
            return (
              <button
                key={tier}
                disabled={isLocked}
                className={`relative p-4 rounded-lg border text-center transition-all ${
                  isActive
                    ? "border-indigo-500 bg-indigo-500/10"
                    : isLocked
                      ? "border-[#2A2A3A] opacity-50 cursor-not-allowed"
                      : "border-[#2A2A3A] hover:border-indigo-500/50"
                }`}
              >
                {isLocked && (
                  <Lock className="absolute top-2 right-2 w-4 h-4 text-[#94A3B8]" />
                )}
                <div className={`font-semibold ${isActive ? "text-indigo-400" : "text-[#E2E8F0]"}`}>
                  {tier}
                </div>
                <div className="text-xs text-[#94A3B8] mt-1">
                  {tier === "Miembro" && "Acceso gratuito"}
                  {tier === "Empresa" && "$99/mes"}
                  {tier === "Inversor" && "$299/mes"}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Settings (Mobile only) */}
      <div className="md:hidden bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 flex flex-row items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#E2E8F0]">Tema</h3>
          <p className="text-xs text-[#94A3B8]">Elige tu tema preferido</p>
        </div>
        <ThemeToggle />
      </div>

      <button
        onClick={() => onShowToast("¡Perfil actualizado!")}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-medium transition-colors"
      >
        Guardar Cambios
      </button>
    </div>
  )
}

function CompletionModal({ currentUser, onClose }: { currentUser: Member; onClose: () => void }) {
  const [offers, setOffers] = useState<string[]>(currentUser.offers || [])
  const [seeking, setSeeking] = useState<string[]>(currentUser.seeking || [])
  const [isSaving, setIsSaving] = useState(false)
  const [customOfferText, setCustomOfferText] = useState("")
  const [customSeekingText, setCustomSeekingText] = useState("")

  const PREDEFINED_OFFERS = [
    "Capital Semilla", "Mentoría Estratégica", "Red de Inversionistas", 
    "Desarrollo de Producto", "Marketing", "Partnerships", "Talento Técnico"
  ]
  const PREDEFINED_SEEKING = [
    "Inversión Serie A", "Startups B2B SaaS", "Mentores de negocio",
    "Talento Técnico", "Asesoría Legal", "Socios Comerciales", "Clientes B2B"
  ]

  const toggleArray = (array: string[], setArray: (val: string[]) => void, item: string) => {
    if (array.includes(item)) setArray(array.filter((i) => i !== item))
    else setArray([...array, item])
  }

  const handleAddCustomOffer = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customOfferText.trim()
    if (trimmed && !offers.includes(trimmed)) {
      setOffers([...offers, trimmed])
    }
    setCustomOfferText("")
  }

  const handleAddCustomSeeking = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customSeekingText.trim()
    if (trimmed && !seeking.includes(trimmed)) {
      setSeeking([...seeking, trimmed])
    }
    setCustomSeekingText("")
  }

  const handleSave = async () => {
    if (offers.length === 0 || seeking.length === 0) {
      alert("Por favor selecciona al menos una opción en ambos campos.")
      return
    }
    setIsSaving(true)
    try {
      await updateDoc(doc(db, "users", currentUser.id), {
        "profile.offers": offers,
        "profile.needs": seeking,
      })
      onClose()
    } catch (e) {
      console.error(e)
      alert("Error al guardar.")
    } finally {
      setIsSaving(false)
    }
  }

  const displayOffers = Array.from(new Set([...PREDEFINED_OFFERS, ...offers]))
  const displaySeeking = Array.from(new Set([...PREDEFINED_SEEKING, ...seeking]))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111118] border border-[#2A2A3A] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>
          Completa tu perfil
        </h2>
        <p className="text-[#94A3B8] mb-6 text-sm">
          Para brindarte las mejores conexiones, necesitamos saber qué ofreces y qué estás buscando en Nexus.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-emerald-400 mb-3">Lo que ofrezco</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {displayOffers.map(item => (
                <button
                  key={item}
                  onClick={() => toggleArray(offers, setOffers, item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    offers.includes(item)
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                      : "bg-[#1A1A24] text-[#94A3B8] border-[#2A2A3A] hover:bg-[#2A2A3A]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <form onSubmit={handleAddCustomOffer} className="flex gap-2">
              <input 
                type="text" 
                value={customOfferText}
                onChange={(e) => setCustomOfferText(e.target.value)}
                placeholder="Añadir otro..." 
                className="flex-1 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
              <button 
                type="submit"
                disabled={!customOfferText.trim()}
                className="bg-[#2A2A3A] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#3A3A4A] transition-colors disabled:opacity-50"
              >
                +
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-sm font-medium text-indigo-400 mb-3">Lo que busco</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {displaySeeking.map(item => (
                <button
                  key={item}
                  onClick={() => toggleArray(seeking, setSeeking, item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    seeking.includes(item)
                      ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/50"
                      : "bg-[#1A1A24] text-[#94A3B8] border-[#2A2A3A] hover:bg-[#2A2A3A]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <form onSubmit={handleAddCustomSeeking} className="flex gap-2">
              <input 
                type="text" 
                value={customSeekingText}
                onChange={(e) => setCustomSeekingText(e.target.value)}
                placeholder="Añadir otro..." 
                className="flex-1 bg-[#1A1A24] border border-[#2A2A3A] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
              />
              <button 
                type="submit"
                disabled={!customSeekingText.trim()}
                className="bg-[#2A2A3A] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#3A3A4A] transition-colors disabled:opacity-50"
              >
                +
              </button>
            </form>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || offers.length === 0 || seeking.length === 0}
            className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
          >
            {isSaving ? "Guardando..." : "Guardar y Continuar"}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main App
export default function NexusApp() {
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<"dashboard" | "discover" | "matches" | "profile">("dashboard")
  const [toast, setToast] = useState<string | null>(null)
  const [introModal, setIntroModal] = useState<Member | null>(null)

  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem("nexus_onboarding_done")
    setOnboardingDone(!!done)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeDoc = onSnapshot(doc(db, "users", user.uid), 
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data()
              const offers = data.profile?.offers || []
              const seeking = data.profile?.needs || data.profile?.seeking || []
              
              const memberData: Member = {
                id: user.uid,
                name: data.name || "",
                role: data.role === "investor" ? "Inversor" : data.role === "entrepreneur" ? "Emprendedor" : data.role === "professional" ? "Profesional" : data.role === "student" ? "Estudiante" : data.role,
                company: data.company || "",
                sector: data.sector || "Tecnología",
                tier: data.tier || "Miembro",
                avatar: data.name ? data.name.substring(0, 2).toUpperCase() : "NX",
                offers: offers,
                seeking: seeking,
                bio: data.profile?.bio || "",
              }
              
              setCurrentUser(memberData)
              
              if (offers.length === 0 || seeking.length === 0) {
                setShowCompletionModal(true)
              } else {
                setShowCompletionModal(false)
              }
            } else {
              console.warn("User document does not exist!")
              setCurrentUser(null)
            }
            setIsLoadingAuth(false)
          },
          (error) => {
            console.error("Error fetching user data:", error)
            alert("Hubo un error cargando el perfil. Revisa los permisos de Firebase o tu conexión.")
            setIsLoadingAuth(false)
          }
        )
        return () => unsubscribeDoc()
      } else {
        setCurrentUser(null)
        setIsLoadingAuth(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("nexus_onboarding_done", "1")
    setOnboardingDone(true)
  }

  // Show nothing until we know if onboarding was done
  const [detailModal, setDetailModal] = useState<Member | null>(null)

  if (onboardingDone === null || isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show onboarding if not done or if there's no user logged in
  if (!currentUser || !onboardingDone) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  const showToast = (message: string) => setToast(message)

  const handleRequestIntro = (member: Member) => {
    setIntroModal(member)
  }

  const handleViewDetail = (member: Member) => {
    setDetailModal(member)
  }

  const handleSendIntro = () => {
    setIntroModal(null)
    showToast("¡Intro enviada!")
  }

  const handleLogout = async () => {
    try {
      const { auth } = await import("@/lib/firebase")
      const { signOut } = await import("firebase/auth")
      await signOut(auth)
    } catch (e) {
      console.error(e)
    }
    localStorage.removeItem("nexus_onboarding_done")
    setOnboardingDone(false)
  }

  const navItems = [
    { id: "dashboard", label: "Panel", icon: LayoutDashboard },
    { id: "discover", label: "Descubrir", icon: Compass },
    { id: "matches", label: "Mis Conexiones", icon: Sparkles },
    { id: "profile", label: "Perfil", icon: User },
  ] as const

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {showCompletionModal && currentUser && (
        <CompletionModal currentUser={currentUser} onClose={() => setShowCompletionModal(false)} />
      )}
  <div className="h-[100dvh] overflow-hidden bg-background flex">
  {/* Grain overlay */}
  <div className="grain-overlay" />
  
  {/* Sidebar */}
  <aside className="w-64 border-r border-border bg-sidebar flex-shrink-0 hidden md:flex flex-col">
  <div className="p-6">
  <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-syne)" }}>
  NEXUS
  </h1>
  <p className="text-xs text-muted-foreground mt-1">Red de Negocios Dominicana</p>
  </div>
  
  <nav className="flex-1 px-3 overflow-y-auto">
  {navItems.map((item) => {
  const Icon = item.icon
  const isActive = activeTab === item.id
  return (
  <button
  key={item.id}
  onClick={() => setActiveTab(item.id)}
  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
  isActive
  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            )
          })}
        </nav>

  {/* User section */}
  <div className="p-4 border-t border-border mt-auto">
  <div className="flex items-center gap-3 mb-4">
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
  {currentUser.avatar}
  </div>
  <div className="flex-1 min-w-0">
  <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
  <p className="text-xs text-muted-foreground truncate">{currentUser.company}</p>
  </div>
  <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
  <Settings className="w-5 h-5" />
  </button>
  </div>
  
  {/* Theme & Logout */}
  <div className="flex items-center gap-2">
    <div className="flex-1">
      <ThemeToggle />
    </div>
    <button 
      onClick={handleLogout}
      className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
      title="Cerrar sesión"
    >
      <LogOut className="w-5 h-5" />
    </button>
  </div>
  </div>
  </aside>

  {/* Mobile nav */}
  <div className="md:hidden fixed bottom-0 inset-x-0 bg-background border-t border-border z-40">
  <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
isActive ? "text-indigo-400" : "text-muted-foreground"
  }`}
  >
  <Icon className="w-5 h-5" />
  <span className="text-xs">{item.label}</span>
  </button>
  )
  })}
  </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#2A2A3A]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="md:hidden">
              <h1 className="text-xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
                NEXUS
              </h1>
            </div>
            <div className="hidden md:block" />
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
              </button>
              <button className="p-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && <Dashboard onRequestIntro={handleRequestIntro} onViewDetail={handleViewDetail} />}
              {activeTab === "discover" && <Discover onRequestIntro={handleRequestIntro} onViewDetail={handleViewDetail} />}
              {activeTab === "matches" && <MyMatches onSendIntro={handleRequestIntro} onViewDetail={handleViewDetail} />}
              {activeTab === "profile" && <Profile onShowToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Intro Modal */}
      <AnimatePresence>
        {introModal && (
          <IntroModal member={introModal} onClose={() => setIntroModal(null)} onSend={handleSendIntro} />
        )}
      </AnimatePresence>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {detailModal && (
          <MemberDetailModal
            member={detailModal}
            onClose={() => setDetailModal(null)}
            onRequestIntro={handleRequestIntro}
          />
        )}
      </AnimatePresence>
    </div>
    </CurrentUserContext.Provider>
  )
}

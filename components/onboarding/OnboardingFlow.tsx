"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import {
  Sparkles,
  Users,
  TrendingUp,
  ChevronRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Handshake,
} from "lucide-react"

// ─── Onboarding Steps Data ───────────────────────────────────────────────────
const steps = [
  {
    id: 1,
    badge: "Conexiones inteligentes",
    title: "Conecta con los\nmejores empresarios",
    description:
      "Accede a una red curada de más de 287 empresarios, inversores y emprendedores dominicanos listos para hacer negocios.",
    icon: Users,
    gradient: "from-indigo-500 to-purple-600",
    bgAccent: "bg-indigo-500/10",
    stats: [
      { label: "Miembros activos", value: "287+" },
      { label: "Sectores", value: "12" },
      { label: "Conexiones/mes", value: "1,400+" },
    ],
  },
  {
    id: 2,
    badge: "IA para tu red",
    title: "Matches perfectos\ncon Inteligencia Artificial",
    description:
      "Nuestro algoritmo analiza tu perfil, objetivos y sector para encontrar los socios más afines a tu negocio.",
    icon: Sparkles,
    gradient: "from-emerald-500 to-teal-500",
    bgAccent: "bg-emerald-500/10",
    stats: [
      { label: "Precisión del match", value: "94%" },
      { label: "Tiempo promedio", value: "3 min" },
      { label: "Matches exitosos", value: "600+" },
    ],
  },
  {
    id: 3,
    badge: "Crecimiento real",
    title: "Impulsa tu negocio\nal siguiente nivel",
    description:
      "Desde almuerzos de negocios hasta introduciones directas por WhatsApp — todo diseñado para resultados concretos.",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-500",
    bgAccent: "bg-amber-500/10",
    stats: [
      { label: "Deals cerrados", value: "$2.4M+" },
      { label: "Crecimiento promedio", value: "38%" },
      { label: "Satisfacción", value: "4.9/5" },
    ],
  },
]

// ─── Auth Screen ─────────────────────────────────────────────────────────────
function AuthScreen({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("register")
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        if (name) {
          await updateProfile(userCredential.user, { displayName: name })
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      onComplete()
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está en uso.")
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Credenciales incorrectas.")
      } else {
        setError("Ocurrió un error. Inténtalo de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      key="auth"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-[#0A0A0F] flex flex-col"
    >
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* Top gradient blob */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col justify-between p-6 max-w-md mx-auto w-full pt-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors mb-8 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver</span>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Handshake className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>NEXUS</h1>
            <p className="text-xs text-[#94A3B8]">Dominican Business Network</p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#E2E8F0] leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
            {mode === "register" ? "Crea tu cuenta" : "Bienvenido de vuelta"}
          </h2>
          <p className="text-[#94A3B8] mt-2">
            {mode === "register"
              ? "Únete a la red empresarial más exclusiva de RD"
              : "Inicia sesión para continuar"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-[#111118] border border-[#2A2A3A] rounded-xl mb-6">
          {(["register", "login"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? "bg-indigo-500 text-white shadow"
                  : "text-[#94A3B8] hover:text-[#E2E8F0]"
              }`}
            >
              {m === "register" ? "Registrarse" : "Iniciar Sesión"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm text-[#94A3B8] mb-2">Nombre completo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Robinson Sánchez"
                    className="w-full px-4 py-3 bg-[#111118] border border-[#2A2A3A] rounded-xl text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="w-full pl-11 pr-4 py-3 bg-[#111118] border border-[#2A2A3A] rounded-xl text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#94A3B8] mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5A]" />
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-[#111118] border border-[#2A2A3A] rounded-xl text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A5A] hover:text-[#94A3B8] transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "login" && (
            <div className="text-right">
              <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8">
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl text-base shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {mode === "register" ? "Crear cuenta gratis" : "Iniciar sesión"}
            </motion.button>

            <p className="text-center text-xs text-[#4A4A5A] mt-4">
              Al continuar aceptas nuestros{" "}
              <span className="text-indigo-400 cursor-pointer hover:underline">Términos</span> y{" "}
              <span className="text-indigo-400 cursor-pointer hover:underline">Política de Privacidad</span>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

// ─── Single Onboarding Step ───────────────────────────────────────────────────
function OnboardingStep({
  step,
  isLast,
  onNext,
  onSkip,
  current,
  total,
}: {
  step: typeof steps[0]
  isLast: boolean
  onNext: () => void
  onSkip: () => void
  current: number
  total: number
}) {
  const Icon = step.icon

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-[#0A0A0F] flex flex-col"
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Background gradient blob */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br ${step.gradient} opacity-10 rounded-full blur-[140px] pointer-events-none`}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Handshake className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
            NEXUS
          </span>
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
        >
          Omitir
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between px-6 pb-10 max-w-md mx-auto w-full relative z-10">
        {/* Visual */}
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          {/* Icon circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            className={`relative mb-10`}
          >
            <div
              className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl`}
            >
              <Icon className="w-14 h-14 text-white" strokeWidth={1.5} />
            </div>
            {/* Glow ring */}
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} blur-xl opacity-40 -z-10`}
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${step.bgAccent} border border-white/10 text-[#E2E8F0] mb-4`}>
              {step.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl font-bold text-[#E2E8F0] text-center leading-tight mb-4 whitespace-pre-line"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {step.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#94A3B8] text-center text-base leading-relaxed mb-8"
          >
            {step.description}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-3 gap-3 w-full"
          >
            {step.stats.map((stat, i) => (
              <div
                key={i}
                className={`${step.bgAccent} border border-white/10 rounded-2xl p-3 text-center`}
              >
                <div className={`text-xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-1 leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom controls */}
        <div className="space-y-5">
          {/* Dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === current - 1 ? 24 : 8,
                  backgroundColor: i === current - 1 ? "#6366f1" : "#2A2A3A",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>

          {/* Next button (always visible) */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className={`w-full py-4 bg-gradient-to-r ${step.gradient} text-white font-semibold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90`}
          >
            {isLast ? "Comenzar ahora" : "Continuar"}
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {!isLast && (
            <p className="text-center text-xs text-[#4A4A5A]">
              Paso {current} de {total}
            </p>
          )}

          {isLast && (
            <p className="text-center text-xs text-[#4A4A5A]">
              ¡Ya casi estás! Crea tu cuenta gratis.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Onboarding Flow ─────────────────────────────────────────────────────
export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [screen, setScreen] = useState<"step" | "auth">("step")
  const [stepIndex, setStepIndex] = useState(0)

  const currentStep = steps[stepIndex]
  const isLast = stepIndex === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      setScreen("auth")
    } else {
      setStepIndex((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    setScreen("auth")
  }

  const handleBack = () => {
    setScreen("step")
    setStepIndex(steps.length - 1)
  }

  return (
    <AnimatePresence mode="wait">
      {screen === "step" ? (
        <OnboardingStep
          key={`step-${stepIndex}`}
          step={currentStep}
          isLast={isLast}
          onNext={handleNext}
          onSkip={handleSkip}
          current={stepIndex + 1}
          total={steps.length}
        />
      ) : (
        <AuthScreen key="auth" onBack={handleBack} onComplete={onComplete} />
      )}
    </AnimatePresence>
  )
}

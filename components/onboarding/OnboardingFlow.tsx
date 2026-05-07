"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Users, TrendingUp, ChevronRight, Handshake } from "lucide-react"
import RegistrationWizard from "@/components/onboarding/RegistrationWizard"

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
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    stats: [
      { label: "Deals cerrados", value: "$2.4M+" },
      { label: "Crecimiento promedio", value: "38%" },
      { label: "Satisfacción", value: "4.9/5" },
    ],
  },
]

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
      className="h-[100dvh] bg-[#0A0A0F] flex flex-col relative overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 z-0 scale-105"
        style={{ backgroundImage: `url('${step.image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-[#0A0A0F]/20 z-0" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Background gradient blob */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br ${step.gradient} opacity-20 rounded-full blur-[140px] pointer-events-none z-0`}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-2 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Handshake className="w-3.5 h-3.5 text-white" />
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

      {/* Content — fills remaining space, no scroll */}
      <div className="flex-1 flex flex-col justify-between px-5 pb-6 max-w-md mx-auto w-full relative z-10 overflow-hidden">

        {/* Visual center block */}
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl`}>
              <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} blur-xl opacity-40 -z-10`} />
          </motion.div>

          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${step.bgAccent} border border-white/10 text-[#E2E8F0]`}
          >
            {step.badge}
          </motion.span>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-2xl font-bold text-[#E2E8F0] text-center leading-snug whitespace-pre-line"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            {step.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#94A3B8] text-center text-sm leading-relaxed"
          >
            {step.description}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-3 gap-2 w-full mt-1"
          >
            {step.stats.map((stat, i) => (
              <div key={i} className={`${step.bgAccent} border border-white/10 rounded-xl p-2.5 text-center`}>
                <div className={`text-lg font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-[9px] text-[#94A3B8] mt-0.5 leading-tight">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom controls — always pinned */}
        <div className="space-y-3 shrink-0">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === current - 1 ? 20 : 6,
                  backgroundColor: i === current - 1 ? "#6366f1" : "#2A2A3A",
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>

          {/* CTA button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className={`w-full py-3.5 bg-gradient-to-r ${step.gradient} text-white font-semibold rounded-2xl text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90`}
          >
            {isLast ? "Comenzar ahora" : "Continuar"}
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <p className="text-center text-[11px] text-[#4A4A5A]">
            {isLast ? "¡Ya casi estás! Crea tu cuenta gratis." : `Paso ${current} de ${total}`}
          </p>
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
        <RegistrationWizard key="auth" onBack={handleBack} onComplete={onComplete} />
      )}
    </AnimatePresence>
  )
}

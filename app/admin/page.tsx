"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { isAdminUser } from "@/lib/adminAuth"
import { useRouter } from "next/navigation"
import { Handshake, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const isAdmin = await isAdminUser(cred.user)

      if (!isAdmin) {
        await auth.signOut()
        setError("Acceso denegado. Tu cuenta no tiene permisos de administrador.")
        setLoading(false)
        return
      }

      router.push("/admin/dashboard")
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.")
      } else if (err.code === "auth/user-not-found") {
        setError("No existe una cuenta con ese correo.")
      } else if (err.code === "auth/too-many-requests") {
        setError("Demasiados intentos. Espera unos minutos e inténtalo de nuevo.")
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.")
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#111118]/80 border border-[#2A2A3A] rounded-2xl p-8 shadow-2xl backdrop-blur-xl">

          {/* Logo + Badge */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
                NEXUS
              </h1>
              <p className="text-[11px] text-[#94A3B8]">Panel de Administración</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Acceso Restringido
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>
              Iniciar sesión
            </h2>
            <p className="text-sm text-[#94A3B8] mt-1">
              Solo para administradores autorizados
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5A]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexus.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5A]" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
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

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Verificando acceso..." : "Entrar al panel"}
            </motion.button>
          </form>

          <p className="text-center text-xs text-[#4A4A5A] mt-6">
            ¿Problemas para acceder?{" "}
            <span className="text-indigo-400 cursor-pointer hover:underline">
              Contacta al superadmin
            </span>
          </p>
        </div>

        <p className="text-center text-[11px] text-[#2A2A3A] mt-4">
          Nexus Admin © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  )
}

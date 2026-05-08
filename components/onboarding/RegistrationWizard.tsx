"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Phone, User, Building2, GraduationCap, Briefcase, TrendingUp, Handshake, Check, AlertTriangle, ChevronRight } from "lucide-react"

type UserRole = "investor" | "professional" | "entrepreneur" | "student"

const ROLES = [
  { id: "investor" as UserRole, label: "Inversionista", desc: "Tengo capital y busco oportunidades", icon: TrendingUp, gradient: "from-amber-500 to-orange-500", border: "border-amber-500", text: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "professional" as UserRole, label: "Profesional", desc: "Trabajo en empresa y quiero expandir mi red", icon: Briefcase, gradient: "from-indigo-500 to-purple-600", border: "border-indigo-500", text: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "entrepreneur" as UserRole, label: "Emprendedor / Dueño de negocio", desc: "Tengo o estoy construyendo mi propio negocio", icon: Building2, gradient: "from-emerald-500 to-teal-500", border: "border-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "student" as UserRole, label: "Estudiante", desc: "Estoy en la universidad y quiero hacer networking", icon: GraduationCap, gradient: "from-pink-500 to-rose-500", border: "border-pink-500", text: "text-pink-400", bg: "bg-pink-500/10" },
]

const SECTORS = ["Tecnología", "Construcción", "Salud", "Finanzas", "Retail", "Consultoría", "Bienes Raíces", "Turismo", "Educación", "Manufactura", "Marketing"]

function Chips({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = selected.includes(o)
        return (
          <button key={o} type="button" onClick={() => onChange(on ? selected.filter(s => s !== o) : [...selected, o])}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${on ? "bg-indigo-500 border-indigo-500 text-white" : "bg-[#0A0A0F] border-[#2A2A3A] text-[#94A3B8] hover:border-indigo-500/50"}`}>
            {on && <Check className="w-3 h-3" />}{o}
          </button>
        )
      })}
    </div>
  )
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl text-sm text-[#E2E8F0] focus:outline-none focus:border-indigo-500/60 appearance-none">
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Input({ icon: Icon, type = "text", value, onChange, placeholder, right }: any) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A5A]" />}
      <input type={type} value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full ${Icon ? "pl-11" : "pl-4"} ${right ? "pr-12" : "pr-4"} py-3 bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl text-[#E2E8F0] placeholder-[#4A4A5A] focus:outline-none focus:border-indigo-500/60 text-sm transition-colors`} />
      {right}
    </div>
  )
}

export default function RegistrationWizard({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [mode, setMode] = useState<"register" | "login">("register")
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)

  // Step 1
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)

  // Step 2
  const [role, setRole] = useState<UserRole | null>(null)

  // Step 3 - investor
  const [invSectors, setInvSectors] = useState<string[]>([])
  const [invRange, setInvRange] = useState("")
  const [invOffers, setInvOffers] = useState<string[]>([])

  // Step 3 - professional
  const [proTitle, setProTitle] = useState("")
  const [proCompany, setProCompany] = useState("")
  const [proSector, setProSector] = useState("")
  const [proYears, setProYears] = useState("")
  const [proOffers, setProOffers] = useState<string[]>([])

  // Step 3 - entrepreneur
  const [bizName, setBizName] = useState("")
  const [bizSector, setBizSector] = useState("")
  const [bizStage, setBizStage] = useState("")
  const [bizNeeds, setBizNeeds] = useState<string[]>([])

  // Step 3 - student
  const [studUni, setStudUni] = useState("")
  const [studCareer, setStudCareer] = useState("")
  const [studYear, setStudYear] = useState("")
  const [studNeeds, setStudNeeds] = useState<string[]>([])

  // Login
  const [lEmail, setLEmail] = useState("")
  const [lPass, setLPass] = useState("")
  const [showLPass, setShowLPass] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const goNext = (n: number) => { setDir(1); setStep(n); setError("") }
  const goPrev = (n: number) => { setDir(-1); setStep(n); setError("") }

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim() || password.length < 6) return setError("Completa todos los campos. La contraseña debe tener mínimo 6 caracteres.")
    goNext(2)
  }

  const handleStep2 = () => {
    if (!role) return setError("Selecciona tu perfil.")
    goNext(3)
  }

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: name })
      let sector = "", company = "", profile: any = {}
      if (role === "investor") { sector = invSectors[0] || ""; profile = { sectors: invSectors, range: invRange, offers: invOffers } }
      else if (role === "professional") { sector = proSector; company = proCompany; profile = { title: proTitle, years: proYears, offers: proOffers } }
      else if (role === "entrepreneur") { sector = bizSector; company = bizName; profile = { stage: bizStage, needs: bizNeeds } }
      else if (role === "student") { profile = { university: studUni, career: studCareer, year: studYear, needs: studNeeds } }
      await setDoc(doc(db, "users", cred.user.uid), { uid: cred.user.uid, name, email, phone, role, tier: "Miembro", sector, company, profile, createdAt: serverTimestamp(), status: "activo" })
      onComplete()
    } catch (err: any) {
      setError(err.code === "auth/email-already-in-use" ? "Este correo ya está en uso." : "Error al crear tu cuenta. Inténtalo de nuevo.")
    } finally { setLoading(false) }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setLoading(true)
    try { await signInWithEmailAndPassword(auth, lEmail, lPass); onComplete() }
    catch { setError("Credenciales incorrectas. Verifica tu correo y contraseña.") }
    finally { setLoading(false) }
  }

  const totalSteps = 3
  const roleConfig = role ? ROLES.find(r => r.id === role)! : null

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0F] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-25 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/90 to-transparent z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-10 pb-3 shrink-0">
        <button onClick={mode === "register" && step > 1 ? () => goPrev(step - 1) : onBack}
          className="flex items-center gap-2 text-[#94A3B8] hover:text-[#E2E8F0] transition-colors">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm">Volver</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Handshake className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>NEXUS</span>
        </div>
        {mode === "register" ? (
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1 rounded-full transition-all duration-300 ${s === step ? "w-6 bg-indigo-500" : s < step ? "w-4 bg-indigo-500/50" : "w-4 bg-[#2A2A3A]"}`} />
            ))}
          </div>
        ) : <div className="w-20" />}
      </div>

      {/* Tab switcher */}
      <div className="relative z-10 px-5 mb-4 shrink-0">
        <div className="flex p-1 bg-[#111118] border border-[#2A2A3A] rounded-xl">
          {(["register", "login"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setStep(1); setError("") }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "bg-indigo-500 text-white" : "text-[#94A3B8] hover:text-[#E2E8F0]"}`}>
              {m === "register" ? "Registrarse" : "Iniciar Sesión"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait" custom={dir}>
          {mode === "login" ? (
            <motion.form key="login" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} onSubmit={handleLogin} className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>Bienvenido de vuelta</h2>
                <p className="text-[#94A3B8] text-sm mt-1">Inicia sesión para continuar</p>
              </div>
              {error && <div className="flex gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
              <div><label className="block text-sm text-[#94A3B8] mb-2">Correo electrónico</label><Input icon={Mail} type="email" value={lEmail} onChange={setLEmail} placeholder="tu@empresa.com" /></div>
              <div>
                <label className="block text-sm text-[#94A3B8] mb-2">Contraseña</label>
                <Input icon={Lock} type={showLPass ? "text" : "password"} value={lPass} onChange={setLPass} placeholder="••••••••"
                  right={<button type="button" onClick={() => setShowLPass(!showLPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A5A]">{showLPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
              </div>
              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-70">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Iniciar sesión
              </motion.button>
            </motion.form>
          ) : step === 1 ? (
            <motion.form key="step1" initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 40 }} onSubmit={handleStep1} className="space-y-4">
              <div className="mb-6">
                <p className="text-xs text-indigo-400 font-medium mb-1">Paso 1 de 3</p>
                <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>Crea tu cuenta</h2>
                <p className="text-[#94A3B8] text-sm mt-1">Únete a la red empresarial más exclusiva de RD</p>
              </div>
              {error && <div className="flex gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
              <div><label className="block text-sm text-[#94A3B8] mb-2">Nombre completo</label><Input icon={User} value={name} onChange={setName} placeholder="Robinson Sánchez" /></div>
              <div><label className="block text-sm text-[#94A3B8] mb-2">Correo electrónico</label><Input icon={Mail} type="email" value={email} onChange={setEmail} placeholder="tu@empresa.com" /></div>
              <div><label className="block text-sm text-[#94A3B8] mb-2">Número de teléfono</label><Input icon={Phone} type="tel" value={phone} onChange={setPhone} placeholder="+1 (809) 555-1234" /></div>
              <div>
                <label className="block text-sm text-[#94A3B8] mb-2">Contraseña</label>
                <Input icon={Lock} type={showPass ? "text" : "password"} value={password} onChange={setPassword} placeholder="••••••••"
                  right={<button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A5A]">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />
              </div>
              <motion.button whileTap={{ scale: 0.98 }} type="submit"
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                Continuar <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.form>
          ) : step === 2 ? (
            <motion.div key="step2" initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 40 }} className="space-y-4">
              <div className="mb-6">
                <p className="text-xs text-indigo-400 font-medium mb-1">Paso 2 de 3</p>
                <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>¿Quién eres?</h2>
                <p className="text-[#94A3B8] text-sm mt-1">Selecciona el perfil que mejor te describe</p>
              </div>
              {error && <div className="flex gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}
              <div className="grid grid-cols-1 gap-3">
                {ROLES.map(r => {
                  const Icon = r.icon
                  const active = role === r.id
                  return (
                    <motion.button key={r.id} whileTap={{ scale: 0.98 }} type="button" onClick={() => setRole(r.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${active ? `${r.bg} ${r.border}` : "bg-[#111118] border-[#2A2A3A] hover:border-[#3A3A4A]"}`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${active ? r.text : "text-[#E2E8F0]"}`}>{r.label}</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5 leading-snug">{r.desc}</p>
                      </div>
                      {active && <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center shrink-0`}><Check className="w-3 h-3 text-white" /></div>}
                    </motion.button>
                  )
                })}
              </div>
              <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={handleStep2}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                Continuar <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.form key="step3" initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -dir * 40 }} onSubmit={handleFinish} className="space-y-4">
              <div className="mb-6">
                <p className="text-xs text-indigo-400 font-medium mb-1">Paso 3 de 3</p>
                <h2 className="text-2xl font-bold text-[#E2E8F0]" style={{ fontFamily: "var(--font-syne)" }}>Completa tu perfil</h2>
                {roleConfig && <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full ${roleConfig.bg} border ${roleConfig.border} ${roleConfig.text} text-xs font-medium`}>{roleConfig.label}</div>}
              </div>
              {error && <div className="flex gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

              {role === "investor" && (<>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Sectores de interés</label><Chips options={SECTORS} selected={invSectors} onChange={setInvSectors} /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Capital disponible para invertir</label><Select value={invRange} onChange={setInvRange} placeholder="Selecciona un rango" options={["$25K - $100K", "$100K - $500K", "$500K - $1M", "+$1M"]} /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">¿Qué ofreces a la red?</label><Chips options={["Capital", "Mentoría", "Red de contactos", "Experiencia del sector", "Acceso a mercados"]} selected={invOffers} onChange={setInvOffers} /></div>
              </>)}

              {role === "professional" && (<>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Cargo / Título profesional</label><Input value={proTitle} onChange={setProTitle} placeholder="Director de Marketing" /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Empresa donde trabajas</label><Input icon={Building2} value={proCompany} onChange={setProCompany} placeholder="Nombre de la empresa" /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Sector</label><Select value={proSector} onChange={setProSector} placeholder="Selecciona tu sector" options={SECTORS} /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Años de experiencia</label><Select value={proYears} onChange={setProYears} placeholder="Selecciona" options={["1-3 años", "3-5 años", "5-10 años", "+10 años"]} /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">¿Qué puedes ofrecer a la red?</label><Chips options={["Expertise técnico", "Red de clientes", "Mentoría", "Alianzas estratégicas", "Conocimiento del sector"]} selected={proOffers} onChange={setProOffers} /></div>
              </>)}

              {role === "entrepreneur" && (<>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Nombre del negocio</label><Input icon={Building2} value={bizName} onChange={setBizName} placeholder="Mi Empresa RD" /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Sector</label><Select value={bizSector} onChange={setBizSector} placeholder="Selecciona tu sector" options={SECTORS} /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Etapa del negocio</label><Select value={bizStage} onChange={setBizStage} placeholder="Selecciona" options={["Idea / Pre-lanzamiento", "Startup (0-1 año)", "En crecimiento (1-3 años)", "Consolidado (+3 años)"]} /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">¿Qué buscas en la red?</label><Chips options={["Inversión", "Clientes", "Socios", "Mentoría", "Proveedores", "Alianzas"]} selected={bizNeeds} onChange={setBizNeeds} /></div>
              </>)}

              {role === "student" && (<>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Universidad / Institución</label><Input icon={GraduationCap} value={studUni} onChange={setStudUni} placeholder="PUCMM, INTEC, UNPHU..." /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Carrera</label><Input value={studCareer} onChange={setStudCareer} placeholder="Administración de Empresas..." /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">Año de estudio</label><Select value={studYear} onChange={setStudYear} placeholder="Selecciona" options={["1er año", "2do año", "3er año", "4to año", "Egresado reciente"]} /></div>
                <div><label className="block text-sm text-[#94A3B8] mb-2">¿Qué buscas en la red?</label><Chips options={["Mentoría", "Pasantías", "Networking", "Empleo", "Inspiración emprendedora"]} selected={studNeeds} onChange={setStudNeeds} /></div>
              </>)}

              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-70">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creando tu cuenta...</> : <>Unirme a Nexus <ChevronRight className="w-4 h-4" /></>}
              </motion.button>
              <p className="text-center text-xs text-[#4A4A5A]">Al continuar aceptas nuestros <span className="text-indigo-400 cursor-pointer">Términos</span> y <span className="text-indigo-400 cursor-pointer">Política de Privacidad</span></p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

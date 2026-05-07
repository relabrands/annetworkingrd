"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { isAdminUser } from "@/lib/adminAuth"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [adminName, setAdminName] = useState("")

  // Allow the login page itself without auth guard
  const isLoginPage = pathname === "/admin"

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin")
        return
      }

      const isAdmin = await isAdminUser(user)
      if (!isAdmin) {
        await auth.signOut()
        router.replace("/admin")
        return
      }

      setAdminName(user.displayName || user.email || "Admin")
      setChecking(false)
    })

    return () => unsubscribe()
  }, [isLoginPage, router])

  if (isLoginPage) return <>{children}</>

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-[#94A3B8] text-sm">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader adminName={adminName} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

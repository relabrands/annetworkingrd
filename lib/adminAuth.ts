import { auth } from "@/lib/firebase"
import { User } from "firebase/auth"

/**
 * Verifica si el usuario autenticado tiene el custom claim 'admin: true'.
 * El claim se lee del token JWT del usuario (se refresca si es necesario).
 */
export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false
  try {
    const tokenResult = await user.getIdTokenResult(/* forceRefresh */ true)
    return tokenResult.claims?.admin === true
  } catch {
    return false
  }
}

/**
 * Obtiene el token con claims del usuario actual, o null si no está autenticado.
 */
export async function getAdminClaims(user: User | null) {
  if (!user) return null
  try {
    return await user.getIdTokenResult(true)
  } catch {
    return null
  }
}

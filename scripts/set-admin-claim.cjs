// Script temporal para asignar custom claims de admin
// Usa Application Default Credentials (gcloud auth application-default login)
const { initializeApp, cert, getApps } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')

// Use application default credentials (ADC) via gcloud
const app = getApps().length === 0
  ? initializeApp({ projectId: 'an-networkingrd' })
  : getApps()[0]

const auth = getAuth(app)

async function setAdminClaim() {
  const uid = 'rtZYRUF0EGQm6u4DBNdyFs2PQPo1'
  await auth.setCustomUserClaims(uid, { admin: true, superadmin: true })
  console.log(`✅ Claims admin + superadmin asignados a UID: ${uid}`)

  // Verify
  const user = await auth.getUser(uid)
  console.log('Claims actuales:', user.customClaims)
}

setAdminClaim().catch(console.error)

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin SDK with environment variables
const firebaseConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'xtrawrkx',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
}

// Initialize Firebase Admin if not already initialized
const app = getApps().length === 0 ? initializeApp({
    credential: cert(firebaseConfig),
    projectId: firebaseConfig.projectId,
}) : getApps()[0]

export const auth = getAuth(app)
export default app

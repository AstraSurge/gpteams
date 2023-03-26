import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)

admin.initializeApp({
  credential: admin.credential.cert(credentials),
})

export const firestore = getFirestore()

/**
 * admin config, includes admin's configuration for entire system
 * TODO: add type definition about admin config
 */
export const adminConfigRef = firestore.collection('config').doc('admin')

// initial admin config if not exists
adminConfigRef.get().then((doc) => {
  if (!doc.exists) {
    adminConfigRef.set({
      whitelist: [],
      blacklist: [],
      openaiApiKeys: [],
    })
  }
})

export default admin

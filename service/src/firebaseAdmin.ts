import admin from 'firebase-admin'
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

const setSystemConfig = async () => {
  const doc = await adminConfigRef.get()
  if (!doc.exists) {
    await adminConfigRef.set({
      whitelist: [],
      blacklist: [],
      openaiApiKeys: [],
    })
  }
}

const setGroupConfig = async () => {
  const querySnapshot = await firestore.collection('groups').where('isDefault', '==', true).get()
  if (querySnapshot.docs.length > 0)
    return

  await firestore.collection('groups').add({
    isDefault: true,
    operationPoints: 0,
  })
}

export const initFirestore = async () => {
  await setSystemConfig()
  await setGroupConfig()
}

export default admin

import * as admin from 'firebase-admin'

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)

admin.initializeApp({
  credential: admin.credential.cert(credentials),
})

export default admin

import * as admin from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'

admin.initializeApp({
  // applicationDefault() will load credentials by environment variable:
  // GOOGLE_APPLICATION_CREDENTIALS, which means path to service account key file
  credential: applicationDefault(),
})

export default admin

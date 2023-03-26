import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable')

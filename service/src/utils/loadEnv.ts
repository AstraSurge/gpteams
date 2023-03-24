import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.OPENAI_API_KEY)
  throw new Error('Missing OPENAI_API_KEY environment variable')

if (!process.env.AUTH_PHONE_REGEX && !process.env.AUTH_EMAIL_REGEX)
  throw new Error('Missing AUTH_PHONE_REGEX or AUTH_EMAIL_REGEX environment variable')

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
  throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable')

import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function verifyGoogleCredentials(credential) {
  const ticket = await client.verifyIdToken({
    idToken: credential,
  })
  const payload = ticket.getPayload()
  const regex = new RegExp(process.env.AUTH_EMAIL_REGEX)
  return regex.test(payload.email)
}

export function hasAuth() {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  return !!AUTH_SECRET_KEY?.length || !!GOOGLE_CLIENT_ID?.length
}

export async function verifyLogin(credential: string) {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

  try {
    if (!hasAuth())
      return true

    if (AUTH_SECRET_KEY?.length > 0 && AUTH_SECRET_KEY === credential)
      return true

    if (GOOGLE_CLIENT_ID?.length > 0 && await verifyGoogleCredentials(credential))
      return true
  }
  catch {
    return false
  }
  return false
}

const auth = async (req, res, next) => {
  try {
    const Authorization = (req.header('Authorization') || '').replace('Bearer ', '').trim()

    if (await verifyLogin(Authorization))
      return next()

    throw new Error('Error: 无访问权限 | No access rights')
  }
  catch (error) {
    res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
  }
}

export { auth }

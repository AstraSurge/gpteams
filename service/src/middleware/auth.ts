import admin from 'src/firebaseAdmin'

export function hasAuth() {
  // TODO: refactor hasAuth() related code，since we will integrate with firebase auth, and create a user management system
  return true
}

export async function verifyLogin(credential: string) {
  try {
    if (process.env.AUTH_PHONE_REGEX) {
      const decodedToken = await admin.auth().verifyIdToken(credential)
      const regex = new RegExp(process.env.AUTH_PHONE_REGEX)
      if (regex.test(decodedToken.phone_number))
        return true
    }

    if (process.env.AUTH_EMAIL_REGEX) {
      const decodedToken = await admin.auth().verifyIdToken(credential)
      const regex = new RegExp(process.env.AUTH_EMAIL_REGEX)
      if (regex.test(decodedToken.email))
        return true
    }
  }
  catch (e) {
    console.error(e)
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

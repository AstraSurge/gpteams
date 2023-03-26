import admin, { adminConfigRef } from '~/firebaseAdmin'

export async function verifyToken(credential: string) {
  const decodedToken = await admin.auth().verifyIdToken(credential)
  return decodedToken
}

const isAuthenticated = async (req, res, next) => {
  try {
    const Authorization = (req.header('Authorization') || '').replace('Bearer ', '').trim()
    const decodedToken = await verifyToken(Authorization)

    // if user is root, skip the rest of the auth process
    const rootAccount = process.env.ROOT_ACCOUNT.trim()
    if ((decodedToken.email_verified && decodedToken.email === rootAccount) || decodedToken.phone_number === rootAccount) {
      res.locals.isRoot = true
      return next()
    }

    const adminConfig = await adminConfigRef.get()

    const whitelist = adminConfig?.data()?.whitelist ?? []
    const blacklist = adminConfig?.data()?.blacklist ?? []

    const blacklistRegex = blacklist.map((item: string) => new RegExp(item))

    if (blacklistRegex.some((item: RegExp) => item.test(decodedToken.email) || item.test(decodedToken.phone_number)))
      throw new Error('Auth Error')

    const whitelistRegex = whitelist.map((item: string) => new RegExp(item))

    if (!whitelistRegex.some((item: RegExp) => item.test(decodedToken.email) || item.test(decodedToken.phone_number)))
      throw new Error('Auth Error')

    next()
  }
  catch (error) {
    console.error(error)
    res.send({ status: 'Unauthorized', message: 'Auth Error', data: null })
  }
}

const isRoot = async (req, res, next) => {
  if (!res.locals.isRoot) {
    res.send({ status: 'Unauthorized', message: 'Auth Error', data: null })
    return
  }
  next()
}

export { isAuthenticated, isRoot }

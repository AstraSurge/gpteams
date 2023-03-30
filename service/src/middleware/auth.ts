import type { Response } from 'express'
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import admin, { adminConfigRef } from '~/firebaseAdmin'
import { generateRegExp } from '~/utils/generateRegExp'

export async function verifyToken(credential: string) {
  const decodedToken = await admin.auth().verifyIdToken(credential)
  return decodedToken
}

export async function isAdmin(decodedToken: DecodedIdToken) {
  const rootAccount = process.env.ROOT_ACCOUNT.trim()
  return (decodedToken.email_verified && decodedToken.email === rootAccount) || decodedToken.phone_number === rootAccount
}

export async function isAuthenticated(decodedToken: DecodedIdToken) {
  // admin can access all
  if (await isAdmin(decodedToken))
    return true

  const adminConfig = await adminConfigRef.get()

  const whitelist = adminConfig?.data()?.whitelist ?? []
  const blacklist = adminConfig?.data()?.blacklist ?? []

  const blacklistRegex = blacklist.map((item: string) => generateRegExp(item))

  if (blacklistRegex.some((item: RegExp) => item.test(decodedToken.email) || item.test(decodedToken.phone_number)))
    return false

  const whitelistRegex = whitelist.map((item: string) => generateRegExp(item))

  if (!whitelistRegex.some((item: RegExp) => item.test(decodedToken.email) || item.test(decodedToken.phone_number)))
    return false

  return true
}

const checkAuth = async (req, res, next) => {
  try {
    const Authorization = (req.header('Authorization') || '').replace('Bearer ', '').trim()
    const decodedToken = await verifyToken(Authorization)

    res.locals.uid = decodedToken.uid
    // if user is Admin, skip the rest of the auth process
    if (await isAdmin(decodedToken)) {
      res.locals.isAdmin = true
      return next()
    }

    if (await isAuthenticated(decodedToken))
      return next()

    throw new Error('Auth Error')
  }
  catch (error) {
    console.error(error)
    res.status(401).send({ status: 'Unauthorized', message: 'Auth Error', data: null })
  }
}

const checkAdmin = async (req, res: Response, next) => {
  if (!res.locals.isAdmin) {
    res.status(403).send({ status: 'Unauthorized', message: 'Auth Error', data: null })
    return
  }
  next()
}

export { checkAuth, checkAdmin }

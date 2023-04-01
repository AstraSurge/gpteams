import './utils/loadEnv'
import express from 'express'
import history from 'connect-history-api-fallback'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatReplyProcess } from './chatgpt'
import { checkAuth, isAdmin, isAuthenticated } from './middleware/auth'
import adminRouter from './routers/adminRouter'
import admin, { initFirestore } from './firebaseAdmin'
import rateLimiterMiddleware from './middleware/rateLimiter'

const app = express()
const router = express.Router()

app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', checkAuth, rateLimiterMiddleware, async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {} } = req.body as { prompt: string; options?: ChatContext }
    let firstChunk = true

    await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
      res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
      firstChunk = false
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/verify', async (req, res) => {
  try {
    const Authorization = (req.header('Authorization') || '').replace('Bearer ', '').trim()
    const decodedToken = await admin.auth().verifyIdToken(Authorization)

    if (!await isAuthenticated(decodedToken)) {
      res.status(401).send({
        status: 'Unauthorized',
        message: 'Auth Error',
        data: null,
      })
      return
    }

    let role = 'user'

    if (await isAdmin(decodedToken))
      role = 'admin'

    res.status(200).send({
      status: 'Success',
      data: {
        role,
      },
    })
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/firebase-config', async (_, res) => {
  res.status(200).send({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  })
})

app.use(history())
app.use(express.static('public'))

app.use('/api', router)
app.use('/api', adminRouter)

initFirestore().then(() => {
  globalThis.console.log('Firestore initialized')
  let port = 3002
  if (process.env.PORT) {
    if (!/^\d+$/.test(process.env.PORT))
      globalThis.console.error(`Warning: Invalid port number "${process.env.PORT}". Using default port 3000 instead.`)
    else
      port = parseInt(process.env.PORT)
  }
  app.listen(port, '0.0.0.0', () => globalThis.console.log(`Server is running on port ${port}`))
})

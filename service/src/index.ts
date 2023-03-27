import './utils/loadEnv'
import express from 'express'
import history from 'connect-history-api-fallback'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatReplyProcess, updateApiKey } from './chatgpt'
import { isAuthenticated, isRoot } from './middleware/auth'
import admin, { adminConfigRef } from './firebaseAdmin'
import addToBlacklist from './utils/addToBlacklist'

const app = express()
const router = express.Router()

app.use(history({
  index: '/',
}))
app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', isAuthenticated, async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage } = req.body as RequestProps
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

router.get('/system-settings', async (req, res) => {
  try {
    const configSnapshot = await adminConfigRef.get()
    const configData = configSnapshot.data()
    // remove openaiApiKeys from response for security reason
    const { openaiApiKeys: _, ...rest } = configData ?? {}
    res.status(200).json({
      status: 'Success',
      data: rest,
    } ?? {})
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

router.put('/system-settings', async (req, res) => {
  try {
    const configData = req.body

    if (configData?.openaiApiKeys?.length > 0) {
      const apiKey = configData.openaiApiKeys[0]
      await updateApiKey(apiKey)
    }

    await adminConfigRef.set(configData, { merge: true })
    res.status(200).send({
      message: 'Config updated successfully',
      status: 'Success',
    })
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/users', isAuthenticated, isRoot, async (req, res) => {
  try {
    const userList = []
    let nextPageToken

    do {
      const result = await admin.auth().listUsers(1000, nextPageToken)
      result.users.forEach(user => userList.push(user.toJSON()))
      nextPageToken = result.pageToken
    } while (nextPageToken)

    res.status(200).json({
      data: userList,
      status: 'Success',
    })
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

router.put('/users/:uid/disable', async (req, res) => {
  try {
    const uid = req.params.uid
    await admin.auth().updateUser(uid, { disabled: true })
    res.status(200).send({
      message: 'User disabled successfully',
      status: 'Success',
    })
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

router.put('/users/:uid/enable', async (req, res) => {
  try {
    const uid = req.params.uid
    await admin.auth().updateUser(uid, { disabled: false })
    res.status(200).send({
      message: 'User enabled successfully',
      status: 'Success',
    })
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

app.delete('/users/:uid', async (req, res) => {
  try {
    const uid = req.params.uid
    const userInfo = await admin.auth().getUser(uid)
    await addToBlacklist([userInfo.email, userInfo.phoneNumber])
    await admin.auth().deleteUser(uid)
    res.status(200).send({
      message: 'User deleted successfully',
      status: 'Success',
    })
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))

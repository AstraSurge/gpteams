import express from 'express'
import { updateChatgptModel, updateOpenaiApiKey } from '~/chatgpt'
import admin, { adminConfigRef } from '~/firebaseAdmin'
import { checkAdmin, checkAuth } from '~/middleware/auth'
import groupModel from '~/model/groups'
import addToBlacklist from '~/utils/addToBlacklist'

const adminRouter = express.Router()

adminRouter.use(checkAuth, checkAdmin)

adminRouter.get('/system-settings', async (req, res) => {
  try {
    const configSnapshot = await adminConfigRef.get()
    const configData = configSnapshot.data()
    // remove openaiApiKeys from response for security reason
    const { openaiApiKeys: _, ...systemConfig } = configData ?? {}

    const defaultRateLimits = (await groupModel.getDefaultGroup()).operationPoints

    res.status(200).json({
      status: 'Success',
      data: {
        ...systemConfig,
        defaultRateLimits,
      },
    } ?? {})
  }
  catch (error) {
    res.status(500).send(error.message)
  }
})

adminRouter.put('/system-settings', async (req, res) => {
  try {
    const configData = req.body

    if (configData?.openaiApiKeys?.length > 0) {
      const apiKey = configData.openaiApiKeys[0]
      await updateOpenaiApiKey(apiKey)
    }

    if (configData?.chatgptModel?.length > 0) {
      const model = configData.chatgptModel[0]
      await updateChatgptModel(model)
    }

    if (typeof configData?.defaultRateLimits === 'number') {
      const { defaultRateLimits } = configData
      await groupModel.updateGroup((await groupModel.getDefaultGroup()).id, {
        operationPoints: defaultRateLimits,
      })
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

adminRouter.get('/users', async (req, res) => {
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

adminRouter.put('/users/:uid/disable', async (req, res) => {
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

adminRouter.put('/users/:uid/enable', async (req, res) => {
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

adminRouter.delete('/users/:uid', async (req, res) => {
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

export default adminRouter

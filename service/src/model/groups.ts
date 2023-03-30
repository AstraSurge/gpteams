import { firestore } from '~/firebaseAdmin'

interface Group {
  id: string
  name: string
  description: string
  operationPoints: number
}

const groupModel = {
  getAllGroups: async () => {
    const snapshot = await firestore.collection('groups').get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Group),
    }))
  },

  getGroupById: async (groupId) => {
    const docRef = firestore.collection('groups').doc(groupId)
    const doc = await docRef.get()
    if (!doc.exists)
      return null

    return {
      id: doc.id,
      ...doc.data() as Group,
    }
  },

  getDefaultGroup: async () => {
    const snapshot = await firestore.collection('groups').where('isDefault', '==', true).get()
    if (snapshot.empty)
      return null
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data() as Group,
    }
  },

  addGroup: async (groupData) => {
    const docRef = await firestore.collection('groups').add(groupData)
    return docRef.id
  },

  updateGroup: async (groupId, newData) => {
    const docRef = firestore.collection('groups').doc(groupId)
    await docRef.update(newData)
    return true
  },

  deleteGroup: async (groupId) => {
    const docRef = firestore.collection('groups').doc(groupId)
    await docRef.delete()
    return true
  },

  subscribeToGroups: (callback) => {
    return firestore.collection('groups').onSnapshot((snapshot) => {
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Group),
      }))
      callback(groups)
    })
  },

}

export default groupModel

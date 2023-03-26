import { FieldValue } from 'firebase-admin/firestore'
import { adminConfigRef } from '~/firebaseAdmin'

export default async function addToBlacklist(userEmailOrPhone: string[]) {
  const filteredUserEmailOrPhone = userEmailOrPhone.filter((item: string) => !!item)

  await adminConfigRef.update({
    blacklist: FieldValue.arrayUnion(...filteredUserEmailOrPhone),
  })
}

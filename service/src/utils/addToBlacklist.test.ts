import { FieldValue } from 'firebase-admin/firestore'
import addToBlacklist from './addToBlacklist'
import { adminConfigRef } from '~/firebaseAdmin'

// Mock configRef.update
jest.mock('~/firebaseAdmin', () => ({
  adminConfigRef: {
    update: jest.fn(),
  },
}))

describe('addToBlacklist', () => {
  beforeEach(() => {
    // clear all mocks before each test
    jest.clearAllMocks()
  })

  test('should add non-empty emails to the blacklist', async () => {
    const userEmails = [
      'email1@example.com',
      '',
      'email2@example.com',
      'email3@example.com',
      null,
    ]
    const expectedEmails = FieldValue.arrayUnion(...['email1@example.com', 'email2@example.com', 'email3@example.com'])

    await addToBlacklist(userEmails)

    expect(adminConfigRef.update).toHaveBeenCalledWith({
      blacklist: expectedEmails,
    })
  })
})

import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import type { FirebaseOptions } from 'firebase/app'
import axios from 'axios'
import { deleteFn, get, post, put } from '@/utils/request'

export function verifyIdToken(token: string) {
  return post<{
    role: 'admin' | 'user'
  }>({
    url: '/verify',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return post<T>({
    url: '/chat-process',
    data: { prompt: params.prompt, options: params.options },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export enum ProviderId {
  Google = 'google.com',
  Facebook = 'facebook.com',
  Twitter = 'twitter.com',
  Github = 'github.com',
  Email = 'password',
  Phone = 'phone',
  Microsoft = 'microsoft.com',
}

export interface User {
  uid: string
  email?: string
  emailVerified?: boolean
  phoneNumber?: string
  displayName: string
  photoURL: string
  disabled: boolean
  metadata: {
    creationTime: string
    lastSignInTime: string
    lastRefreshTime: string
  }
  providerData: [{
    providerId: ProviderId
    uid: string
    phoneNumber?: string
    email?: string
    photoURL?: string
    displayName?: string
  }]

}

export function fetchUsers<T = User[]>() {
  return get<T>({
    url: '/users',
  })
}

export function disableUser<T = any>(uid: string) {
  return put<T>({
    url: `/users/${uid}/disable`,
  })
}

export function enableUser<T = any>(uid: string) {
  return put<T>({
    url: `/users/${uid}/enable`,
  })
}

export function deleteUser<T = any>(uid: string) {
  return deleteFn<T>({
    url: `/users/${uid}/delete`,
  })
}

export interface SystemSettings {
  blacklist?: string[]
  whitelist?: string[]
  openaiApiKeys?: string[]
  chatgptModel?: string[]
  defaultRateLimits?: number
}

export function fetchSystemSettings<T = SystemSettings>() {
  return get<T>({
    url: '/system-settings',
  })
}

export function updateSystemSettings<T = SystemSettings>(data: T) {
  return put<T>({
    url: '/system-settings',
    data,
  })
}

export async function getFirebaseConfig<T = FirebaseOptions>() {
  const service = axios.create({
    baseURL: import.meta.env.VITE_GLOB_API_URL,
  })
  const resp = await service.get('/firebase-config', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return resp.data as T
}

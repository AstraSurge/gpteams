import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { FINISH_SIGN_IN_ROUTE } from '@/constants/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: () => import('@/views/chat/layout/Layout.vue'),
    redirect: '/chat',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/signIn/index.vue'),
  },
  {
    path: FINISH_SIGN_IN_ROUTE,
    name: 'FinishSignIn',
    component: () => import('@/views/finishSignIn/index.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/layout/index.vue'),
    redirect: '/admin/user-management',
    meta: {
      requiresAdmin: true,
    },
    children: [
      {
        path: '/admin/user-management',
        name: 'UserManagement',
        component: () => import('@/views/admin/userManagement/index.vue'),
      },
      {
        path: '/admin/system-settings',
        name: 'SystemSettings',
        component: () => import('@/views/admin/systemSettings/index.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}

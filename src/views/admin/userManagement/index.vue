<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NAvatar, NButton, NCard, NDataTable, NNumberAnimation, NPopconfirm, NSpace, NStatistic, NTag, NText, NTooltip } from 'naive-ui'
import { computed, h, onMounted } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { t } from '@/locales'
import type { User } from '@/api'
import { useAdminStore, useAppStore } from '@/store'
import { SvgIcon } from '@/components/common'

const { users, loadUsers, enableUser, disableUser, deleteUser } = useAdminStore()

const { language } = useAppStore()

const auth = useFirebaseAuth()

const createColumns = ({
  updateUserStatus,
  deleteUser,
}: {
  updateUserStatus: (row: User) => void
  deleteUser: (row: User) => void
}): DataTableColumns<User> => {
  return [
    {
      title: t('admin.avatar'),
      key: 'photoURL',
      align: 'center',
      render: row => h(
        NAvatar,
        {
          round: true,
          size: 'small',
          src: row.photoURL,
          imgProps: {
            alt: t('common.avatarAlt', { name: row.displayName }),
          },
        },
      ),
    },
    {
      title: t('admin.uid'),
      key: 'uid',
    },
    {
      title: t('admin.displayName'),
      key: 'displayName',
    },
    {
      title: t('admin.email'),
      key: 'email',
    },
    {
      title: t('admin.phoneNumber'),
      key: 'phoneNumber',
    },
    {
      title: t('admin.signInMethod'),
      key: 'providerData',
      filterOptions: [
        {
          label: t('admin.password'),
          value: 'password',
        },
        {
          label: t('admin.googlecom'),
          value: 'google.com',
        },
        {
          label: t('admin.phone'),
          value: 'phone',
        },
        {
          label: t('admin.githubcom'),
          value: 'github.com',
        },
        {
          label: t('admin.microsoftcom'),
          value: 'microsoft.com',
        },
      ],

      filter: (value, row) => row.providerData.map(item => item.providerId as string).includes(value.toString()),

      render: row => row.providerData.map(item => item.providerId).map(item => h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type: 'info',
          bordered: false,
        },
        {
          default: () => t(`admin.${item.replace(/\./g, '')}`),
        },
      )),
    },
    {
      title: t('admin.creationTime'),
      key: 'metadata.creationTime',
      sorter: (a, b) => new Date(a.metadata.creationTime).getTime() - new Date(b.metadata.creationTime).getTime(),
      render: row => new Date(row.metadata.creationTime).toLocaleString(language),
    },
    {
      title: t('admin.lastSignInTime'),
      key: 'metadata.lastSignInTime',
      sorter: (a, b) => new Date(a.metadata.lastSignInTime).getTime() - new Date(b.metadata.lastSignInTime).getTime(),
      render: row => new Date(row.metadata.lastSignInTime).toLocaleString(language),
    },
    {
      title: t('admin.status'),
      key: 'disabled',
      align: 'center',
      filterOptions: [
        {
          label: t('admin.enabled'),
          value: 0,
        },
        {
          label: t('admin.disabled'),
          value: 1,
        },
      ],

      filter: (value, row) => row.disabled === !!value,
      render(row) {
        return h(
          NText,
          {
            type: row.disabled ? 'error' : 'success',
            class: 'inline-block',
          },
          () => h(NTooltip,
            {
              placement: 'top',
            },
            {
              default: () => row.disabled ? t('admin.disabled') : t('admin.enabled'),
              trigger: () => h(
                SvgIcon,
                {
                  class: 'w-6 h-6',
                  icon: row.disabled ? 'material-symbols:close' : 'material-symbols:check',
                  color: row.disabled ? 'error' : 'success',
                },
                { default: () => row.disabled ? t('admin.disabled') : t('admin.enabled') },
              ),
            },
          ))
      },
    },
    {
      title: t('admin.action'),
      key: 'actions',
      align: 'center',
      render(row) {
        return h(NSpace, {
          class: 'inline-flex',
        }, () => [
          h(
            NButton,
            {

              type: 'info',
              text: true,
              size: 'small',
              disabled: auth?.currentUser?.uid === row.uid,
              onClick: () => updateUserStatus(row),
            },
            { default: () => row.disabled ? t('admin.enable') : t('admin.disable') },
          ),
          h(
            NPopconfirm,
            {
              onConfirm: () => deleteUser(row),
            },
            {
              default: () => t('admin.deleteUserConfirmTips'),
              trigger: h(
                NButton,
                {
                  type: 'error',
                  text: true,
                  size: 'small',
                  disabled: auth?.currentUser?.uid === row.uid,
                  onClick: () => deleteUser(row),
                },
                { default: () => t('admin.delete') },
              ),
            },
          ),
        ])
      },
    },
  ]
}

const columns = createColumns({
  updateUserStatus: (row) => {
    if (row.disabled)
      enableUser(row.uid)
    else
      disableUser(row.uid)
  },
  deleteUser: (row) => {
    deleteUser(row.uid)
  },
})

const activeUsersIn24Hours = computed(() => users.data.filter(user => new Date(user.metadata.lastSignInTime).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000).length)

// find the most popular sign in method
const mostPopularSignInMethod = computed(() => {
  const signInMethods = users.data.map(user => user.providerData.map(item => item.providerId))
  const signInMethodsCount = signInMethods.flat().reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const mostPopularSignInMethod = (Object.keys(signInMethodsCount) || []).reduce((a, b) => signInMethodsCount[a] > signInMethodsCount[b] ? a : b, '-')
  return t(`admin.${mostPopularSignInMethod.replace(/\./g, '')}`)
})

onMounted(async () => {
  await loadUsers()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-8">
      <NCard>
        <NStatistic :label="t('admin.numberOfActiveUsersIn24Hours')">
          <span class="font-extrabold text-4xl">
            <NNumberAnimation ref="numberAnimationInstRef" :from="0" :to="activeUsersIn24Hours" /></span>
        </NStatistic>
      </NCard>
      <NCard>
        <NStatistic :label="t('admin.numberOfAllUsers')">
          <span class="font-extrabold text-4xl">
            <NNumberAnimation ref="numberAnimationInstRef" :from="0" :to="users.data.length" /></span>
        </NStatistic>
      </NCard>
      <NCard>
        <NStatistic :label="t('admin.mostPopularSignInMethod')">
          <span class="font-extrabold text-slate-700 dark:text-slate-100 text-4xl">
            {{ mostPopularSignInMethod }}
          </span>
        </NStatistic>
      </NCard>
    </div>
    <NDataTable class="w-full" :bordered="false" :row-key="(row: User) => row.uid" :data="users.data" :loading="users.loading" :columns="columns" />
  </div>
</template>

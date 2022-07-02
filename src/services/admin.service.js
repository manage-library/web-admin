import { api } from '../helpers/api'

export const getAccounts = async (params) => {
  const res = await api.get('/users', { params })

  return res
}

export const getAccountsAll = async () => {
  const res = await api.get('/users')

  return res
}

export const getRoles = async () => {
  const res = await api.get('/accounts/roles')

  return res
}

export const updateVip = async (updateAccountId, params) => {
  const res = await api.post(`/users/${updateAccountId}/upgrade-vip`, params)
  return res
}

export const createAccount = async ({ userName, password, roleId }) => {
  const res = await api.post(`/accounts`, { userName, password, roleId })

  return res.data
}

export const updateAccount = async ({ userId, roleId }) => {
  const res = await api.put(`/accounts`, { userId, roleId })

  return res.data
}

export const removeAccount = async ({ userId }) => {
  const res = await api.delete(`/accounts/${userId}`)

  return res.data
}

export const resetPassword = async ({ oldPassword, newPassword }) => {
  const res = await api.put(`users/change-password`, {
    oldPassword,
    password: newPassword,
  })

  return res.data
}

export const updateInfo = async ({ userName, phoneNumber }) => {
  const res = await api.put(`/accounts/user-infomation`, {
    userName,
    phoneNumber,
  })

  return res.data
}

// export const getMe = async () => {
//   const res = await api.get('/accounts/get-me')

//   return res
// }

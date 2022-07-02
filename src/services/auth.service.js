import { api } from '../helpers/api'

export const login = async ({ email, password }) => {
  const res = await api.post('/auth/login', { email, password })

  return res.data
}

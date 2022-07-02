import { api } from '../helpers/api'

export const getUsers = async () => {
  const res = api.get('/bookHirings/readers')

  return res
}

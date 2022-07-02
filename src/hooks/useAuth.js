import { useQuery } from 'react-query'
import { AUTH } from '../constants/queriesKey'
import { login } from '../services/auth.service'

export const useAuth = ({ username, password }) => {
  const { data, isLoading, error } = useQuery(AUTH, async () => {
    const res = await login({ username, password })

    return res.data
  })

  return { data, isLoading, error }
}

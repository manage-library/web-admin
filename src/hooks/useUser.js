import { useQuery } from 'react-query'
import { USER } from '../constants/queriesKey'
import { getUsers } from '../services/user.service'

export const useUsers = () => {
  const { data, isLoading, error } = useQuery(USER, async () => {
    const res = await getUsers()

    return res.data
  })

  return { data, isLoading, error }
}

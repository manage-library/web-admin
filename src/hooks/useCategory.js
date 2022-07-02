import { useQuery } from 'react-query'
import { CATEGORY } from '../constants/queriesKey'
import { getCategory } from '../services/category.service'

export const useCategory = () => {
  const { data, isLoading, error } = useQuery(CATEGORY, async () => {
    const res = await getCategory()

    return res.data
  })

  return { data, isLoading, error }
}

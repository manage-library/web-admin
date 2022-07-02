import { useQuery } from 'react-query'
import { BORROWER } from '../constants/queriesKey'
import { getBorrower } from '../services/borrower.service'

export const useBorrowers = ({
  readerName,
  bookName,
  term,
  categoryId,
  isReturned,
  isExpired,
  pageSize,
  pageNumber,
}) => {
  const { data, isLoading, error } = useQuery(
    [BORROWER, readerName, bookName, term, categoryId, isReturned, isExpired, pageSize, pageNumber],
    async () => {
      const res = await getBorrower({
        readerName,
        bookName,
        term,
        categoryId,
        isReturned,
        isExpired,
        pageSize,
        pageNumber,
      })

      return res.data
    },
  )

  return { data, isLoading, error }
}

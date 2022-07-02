import { useQuery } from 'react-query'
import { BOOK, EXPIRE_BOOK, HIRING_BOOK, RETURN_BOOK } from '../constants/queriesKey'
import { getBooks, getExpireBooks, getHiringBooks, getReturnBooks } from '../services/book.service'

export const useBooks = ({
  pageNumber,
  pageSize,
  searchKey,
  selectCategories,
  searchKeyAuthor,
  type,
  sortTypeView,
  sortTypeLike,
  sortBy,
}) => {
  const { data, isLoading, error } = useQuery(
    [
      BOOK,
      pageNumber,
      searchKey,
      selectCategories,
      searchKeyAuthor,
      type,
      sortTypeView,
      sortTypeLike,
      sortBy,
    ],
    async () => {
      const res = await getBooks({
        pageNumber,
        pageSize,
        bookName: searchKey,
        categoryId: selectCategories,
        authorName: searchKeyAuthor,
        isVip: type,
        sortType: sortTypeView ? sortTypeView : sortTypeLike,
        sortBy,
      })

      return res
    },
  )

  return { data, isLoading, error }
}

export const useHiringBook = ({ pageNumber = 1, pageSize = 20, searchKey }) => {
  const { data, isLoading, error } = useQuery([HIRING_BOOK, pageNumber, searchKey], async () => {
    const res = await getHiringBooks({ pageNumber, pageSize, searchKey })

    return res
  })

  return { data, isLoading, error }
}

export const useReturnBook = ({ pageNumber = 1, pageSize = 20, searchKey }) => {
  const { data, isLoading, error } = useQuery([RETURN_BOOK, pageNumber, searchKey], async () => {
    const res = await getReturnBooks({ pageNumber, pageSize, searchKey })

    return res
  })

  return { data, isLoading, error }
}

export const useExpiredBook = ({ pageNumber = 1, pageSize = 20, searchKey }) => {
  const { data, isLoading, error } = useQuery([EXPIRE_BOOK, pageNumber, searchKey], async () => {
    const res = await getExpireBooks({ pageNumber, pageSize, searchKey })

    return res
  })

  return { data, isLoading, error }
}

import { api } from '../helpers/api'

export const getBorrower = async ({
  readerName,
  bookName,
  term,
  categoryId,
  isReturned,
  isExpired,
  pageSize,
  pageNumber,
}) => {
  const res = await api.get('/bookHirings/student-hiring-books', {
    params: {
      readerName,
      bookName,
      term,
      categoryId,
      isReturned,
      isExpired,
      pageSize,
      pageNumber,
    },
  })

  return res.data
}

export const createBorrower = async ({ studentIdentify, bookIds, expiredDate }) => {
  const res = await api.post('/bookHirings/hire-books', { studentIdentify, bookIds, expiredDate })

  return res.data
}

export const updateBorrower = async ({ borrowerId, expiredDate, returnDate, note }) => {
  const res = await api.put(`/bookHirings/hiring-books/${borrowerId}`, {
    returnDate,
    note,
    expiredDate,
  })

  return res.data
}

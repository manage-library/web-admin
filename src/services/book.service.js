import { api } from '../helpers/api'

export const getBooks = async (params) => {
  const res = await api.get('/books', {
    params,
  })

  return res.data
}

export const getBookSelected = async (updateBookId) => {
  // const res = await api.get(`/books/${updateBookId}`)
  // return res.data
}

export const getChapters = async (selectBook) => {
  const res = await api.get(`/books/${selectBook}`)

  return res.data
}

export const getContent = async (selectBook, chapterId) => {
  const res = await api.get(`/books/${selectBook}/chapters/${chapterId}`)

  return res.data
}

export const addChap = async (bookId, params) => {
  const res = await api.post(`/books/${bookId}/chapters`, [params])

  return res.data
}

export const editChap = async (chapterId, bookId, params) => {
  const res = await api.put(`/books/${bookId}/chapters/${chapterId}`, params)

  return res.data
}

export const deleteChapter = async (selectBook, chapterId) => {
  const res = await api.delete(`/books/${selectBook}/chapters/${chapterId}`)

  return res.data
}

export const createBook = async (params) => {
  const res = await api.post(`/books`, params)
  return res.data
}

export const updateBook = async (bookId, params) => {
  console.log('hoanln', bookId, params)
  const res = await api.put(`/books/${bookId}`, params)

  return res.data
}

export const removeBook = async ({ bookId }) => {
  const res = await api.put(`/books/${bookId}`, { isVisible: false })

  return res.data
}

export const getHiringBooks = async (params) => {
  const res = await api.get('/bookHirings/hiring-books', {
    params,
  })

  return res.data
}

export const getReturnBooks = async (params) => {
  const res = await api.get('/bookHirings/returned-books', {
    params,
  })

  return res.data
}

export const getExpireBooks = async (params) => {
  const res = await api.get('/bookHirings/expired-books', {
    params,
  })

  return res.data
}

import { api } from '../helpers/api'

export const getCategory = () => {
  return api.get('/categories')
}

export const createCategory = (params) => {
  return api.post('/categories', params)
}

export const updateCategory = (updateCategoryId, params) => {
  return api.put(`/categories/${updateCategoryId}`, params)
}

export const removeCategory = ({ categoryId }) => {
  return api.delete(`/categories/${categoryId}`)
}

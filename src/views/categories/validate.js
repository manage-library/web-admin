import * as Yup from 'yup'

export const createCategorySchema = Yup.object({
  categoryName: Yup.string().required(),
})

export const updateCategorySchema = Yup.object({
  categoryName: Yup.string().required(),
})

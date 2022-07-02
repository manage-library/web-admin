import * as Yup from 'yup'

export const createBookSchema = Yup.object({
  name: Yup.string().required(),
  image: Yup.string().required(),
  authorDescription: Yup.string().required(),
  description: Yup.string().required(),

  // quantity: Yup.number().required(),
  // description: Yup.string(),
  // categoryId: Yup.string().required(),
  // term: Yup.number().required(),
  // thumbnail: Yup.mixed().required(),
  // pdfFile: Yup.mixed().required(),
})

export const updateBookSchema = Yup.object({
  name: Yup.string().required(),
  image: Yup.string().required(),
  authorDescription: Yup.string().required(),
  description: Yup.string().required(),
})

export const changeChapSchemas = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  content: Yup.string().required(),
})

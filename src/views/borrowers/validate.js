import * as Yup from 'yup'

export const createBorrowerSchema = Yup.object({
  studentIdentify: Yup.string().required(),
  bookIds: Yup.array().required(),
  expiredDate: Yup.string().required(),
})

export const updateBorrowerSchema = Yup.object({
  expiredDate: Yup.string().required(),
  returnDate: Yup.string().nullable(),
  note: Yup.string(),
})

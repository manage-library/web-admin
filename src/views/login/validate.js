import * as Yup from 'yup'

export const authSchema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
})

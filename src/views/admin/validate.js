import * as Yup from 'yup'

export const createAccountSchema = Yup.object({
  userName: Yup.string().required(),
  password: Yup.string().required(),
  roleId: Yup.string().required(),
})

export const updateAccountSchema = Yup.object({
  roleId: Yup.string().required(),
})

import * as Yup from 'yup'

export const resetPasswordSchema = Yup.object({
  oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
  newPassword: Yup.string().required('Vui lòng nhập mật khẩu mới'),
  confirmPassword: Yup.string()
    .required('Vui lòng nhập xác nhận mật khẩu mới')
    .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu phải trùng với mật khẩu đăng ký'),
})

export const changeInfoSchema = Yup.object({
  userName: Yup.string().required(),
  phoneNumber: Yup.string().required(),
})

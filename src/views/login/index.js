import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login } from '../../services/auth.service'
import { authSchema } from './validate'

const Login = () => {
  const navigate = useNavigate()

  const { mutate: handleLogin, isLoading } = useMutation(
    ({ email, password }) => {
      return login({ email, password })
    },
    {
      onSuccess: (res) => {
        localStorage.setItem('accessToken', res?.data?.accessToken)
        setTimeout(() => navigate('/books'), 1000)
      },
      onError: (err) => {
        toast.error('Tài khoản hoặc mật khẩu không đúng')
      },
    },
  )

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema,
    onSubmit: handleLogin,
  })

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Xin Chào,...</h1>
                    <p className="text-medium-emphasis">Quản lý sách</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        name="email"
                        feedbackInvalid={formik.errors.email}
                        invalid={formik.errors.email}
                        onChange={formik.handleChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        feedbackInvalid={formik.errors.password}
                        invalid={formik.errors.password}
                        onChange={formik.handleChange}
                      />
                    </CInputGroup>
                    <CRow className="d-flex justify-content-center">
                      <CCol md={6}>
                        <CButton
                          color="primary"
                          className="px-4 w-100"
                          onClick={formik.handleSubmit}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Đăng Nhập'}
                        </CButton>
                      </CCol>
                    </CRow>

                    <CCol className="pt-4">Liên hệ hỗ trợ: kma@actvn.edu.vn</CCol>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

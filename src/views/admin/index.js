import {
  CAlert,
  CButton,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import debounce from 'lodash.debounce'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { ACCOUNT } from 'src/constants/queriesKey'
import { useAccounts, useAccountsAll } from 'src/hooks/useAdmin'
import { updateVip } from 'src/services/admin.service'

const typeVip = (type) => {
  switch (type) {
    case 0:
      return 'VIP_0'
    case 1:
      return 'VIP_1'
    case 3:
      return 'VIP_2'
    case 6:
      return 'VIP_3'
    default:
      break
  }
}

const Admin = () => {
  const queryClient = useQueryClient()

  const [openModal, setOpenModal] = useState(false)
  const [updateAccountId, setUpdateAccountId] = useState()
  const [searchKey, setSearchKey] = useState('')
  const [typeVip1, setTypeVip1] = useState(0)

  const { data: accounts, isLoading } = useAccounts({ searchKey })

  const { data: accountsAll } = useAccountsAll()

  const dataArr = accounts?.data
  let countVip0 = 0
  let countVip1 = 0
  let countVip2 = 0
  let countVip3 = 0

  accountsAll?.data.map((account) => {
    switch (account?.vip_id) {
      case 0:
        countVip0++
        break
      case 1:
        countVip1++
        break
      case 3:
        countVip2++
        break
      case 6:
        countVip3++
        break
      default:
        break
    }
  })

  const onClose = () => {
    setOpenModal(false)
    setUpdateAccountId(null)
  }

  const { mutate: handleChangeTypeVip, isLoading: isLoadingSubmitTypeVip } = useMutation(
    () => {
      return updateVip(updateAccountId, { vipId: typeVip1 })
    },
    {
      onSuccess: async () => {
        toast.success('Thay đổi thành công')
        await queryClient.invalidateQueries(ACCOUNT)
        onClose()
      },
      onError: () => {
        toast.success('Thay đổi thành công')
      },
    },
  )

  const formik = useFormik({
    onSubmit: handleChangeTypeVip,
  })

  const searchUser = debounce((e) => {
    setSearchKey(e.target.value)
  }, 500)

  return (
    <div>
      <CRow>
        <CCol md={3}>
          <CAlert color="success">Số tài khoản VIP_3: {countVip3}</CAlert>
        </CCol>

        <CCol md={3}>
          <CAlert color="info">Số tài khoản VIP_2: {countVip2}</CAlert>
        </CCol>

        <CCol md={3}>
          <CAlert color="danger">Số tài khoản VIP_1: {countVip1}</CAlert>
        </CCol>

        <CCol md={3}>
          <CAlert color="dark">Số tài khoản VIP_0: {countVip0}</CAlert>
        </CCol>
      </CRow>
      <div className="mb-3 d-flex">
        <CRow xs={{ gutterX: 5 }} className="flex-grow-1">
          <CCol xs="auto">
            <CFormLabel htmlFor="name">Tên người dùng</CFormLabel>
            <CFormInput id="name" type="text" placeholder="Admin" onChange={searchUser} />
          </CCol>
        </CRow>
      </div>

      <CTable hover align="middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Thứ Tự</CTableHeaderCell>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Loại tài khoản</CTableHeaderCell>
            <CTableHeaderCell>Họ và tên</CTableHeaderCell>
            <CTableHeaderCell>Giới tính</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Ngày sinh</CTableHeaderCell>
            <CTableHeaderCell>Vai trò</CTableHeaderCell>
            <CTableHeaderCell className="action-column" />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {dataArr?.map((account, index) => (
            <CTableRow key={account.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableHeaderCell>{account.id}</CTableHeaderCell>
              <CTableHeaderCell>{typeVip(account.vip_id)}</CTableHeaderCell>

              <CTableDataCell>{account.full_name || 'chưa rõ'}</CTableDataCell>
              <CTableDataCell>{account.gender || 'chưa rõ'}</CTableDataCell>
              <CTableDataCell>{account.email || 'chưa rõ'}</CTableDataCell>
              <CTableDataCell>{account.date_of_births || 'chưa rõ'}</CTableDataCell>
              <CTableDataCell>{account.role_id === 2 ? 'admin' : 'user thường'}</CTableDataCell>
              <CTableDataCell className=" mt-3">
                <CButton onClick={() => setUpdateAccountId(account.id)}>Cập Nhật VIP</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {isLoading && <Skeleton count={5} />}

      <CModal visible={openModal || updateAccountId} onClose={onClose} alignment="center">
        <CModalHeader>
          <CModalTitle>Cập nhật VIP</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol sm={8} className=" py-2 px-4">
            <CFormCheck
              type="radio"
              name="typeVipRadio"
              id="typeVipRadio1"
              label="VIP_0"
              defaultChecked
              onClick={() => setTypeVip1(0)}
            />
            <CFormCheck
              type="radio"
              name="typeVipRadio"
              id="typeVipRadio2"
              label="VIP_1"
              onClick={() => setTypeVip1(1)}
            />
            <CFormCheck
              type="radio"
              name="typeVipRadio"
              id="typeVipRadio3"
              label="VIP_2"
              onClick={() => setTypeVip1(3)}
            />
            <CFormCheck
              type="radio"
              name="typeVipRadio"
              id="typeVipRadio4"
              label="VIP_3"
              onClick={() => setTypeVip1(6)}
            />
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={formik.handleSubmit} disabled={isLoadingSubmitTypeVip}>
            {isLoadingSubmitTypeVip ? 'Loading...' : 'Lưu Thay Đổi'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Admin

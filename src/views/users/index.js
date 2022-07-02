import {
  CButton,
  CCol,
  CFormInput,
  CFormLabel,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { useUsers } from 'src/hooks/useUser'
import UserImage from '../../assets/images/hacker.png'

const Users = () => {
  const { data: users } = useUsers()

  return (
    <div>
      <div className="d-flex">
        <CRow xs={{ gutterX: 5 }} className="flex-grow-1 mb-3">
          <CCol md={3} xs="auto">
            <CFormLabel>Tên Người Dùng</CFormLabel>
            <CFormInput type="text" placeholder="Nguyễn Văn A..." />
          </CCol>

          <CCol md={3} xs="auto">
            <CFormLabel>Mã Sinh Viên</CFormLabel>
            <CFormInput type="text" placeholder="CT0000000" />
          </CCol>

          <CCol md={3} xs="auto">
            <CFormLabel>Email</CFormLabel>
            <CFormInput type="text" placeholder="CT00000@actvn.edu.vn" />
          </CCol>
        </CRow>
      </div>

      <CTable bordered hover align="middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Thứ Tự</CTableHeaderCell>
            <CTableHeaderCell>Ảnh Đại Diện</CTableHeaderCell>
            <CTableHeaderCell>Mã Sinh Viên</CTableHeaderCell>
            <CTableHeaderCell>Họ và Tên</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Số Điện Thoại</CTableHeaderCell>
            <CTableHeaderCell>Tổng Sách Đang Mượn</CTableHeaderCell>
            <CTableHeaderCell>Tổng Sách Đã Trả</CTableHeaderCell>
            <CTableHeaderCell>Tổng Sách Quá Hạn</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users?.map((record, index) => (
            <CTableRow key={record.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableDataCell>
                <CImage rounded width={70} height={60} src={record.thumbnail || UserImage} />
              </CTableDataCell>
              <CTableDataCell>{record.studentIdentify}</CTableDataCell>
              <CTableDataCell>{record.name}</CTableDataCell>
              <CTableDataCell>{record.email}</CTableDataCell>
              <CTableDataCell>{record.numberPhone}</CTableDataCell>
              <CTableDataCell>{record.totalHiring}</CTableDataCell>
              <CTableDataCell>{record.totalReturned}</CTableDataCell>
              <CTableDataCell>{record.totalExpired}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default Users

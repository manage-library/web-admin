import React, { useState } from 'react'

import {
  CAlert,
  CCol,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useExpiredBook, useHiringBook, useReturnBook } from 'src/hooks/useBook'
import { useNavigate } from 'react-router-dom'

const Statistics = () => {
  const { data: hiringBook } = useHiringBook({})
  const { data: returnedBook } = useReturnBook({})
  const { data: expiredBook } = useExpiredBook({})
  const [preview, setPreview] = useState(false)
  const navigate = useNavigate()

  const data = [
    {
      id: 'a155e925-3e01-425f-e684-08da364a9561',
      title: 'Toán A1',
      subTitle: null,
      quantity: 15,
      description: 'Nghệ thuật khắc kỷ',
      categoryCode: 'Tailieu',
      categoryId: 'e48cbdb2-138c-4556-e42a-08da31ee11ec',
      thumbnail:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/thumbnails/a155e925-3e01-425f-e684-08da364a9561/nnn.png',
      pdfFile:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/pdfs/a155e925-3e01-425f-e684-08da364a9561/BÀI TẬP LỚN.docx',
      createdAt: '0001-01-01T00:00:00',
      updatedAt: '2022-05-16T14:26:04.8855785',
      deletedAt: null,
      term: 1,
      hiredFrom: null,
      status: 0,
      remainingCount: 1,
      hiringCount: 10,
      expiredCount: 4,
    },
    {
      id: '0afdd9e9-99d3-458e-6291-08da3652a896',
      title: 'toán A2',
      subTitle: null,
      quantity: 24,
      description: 'Nghệ thuật khắc kỷ',
      categoryCode: 'Tailieu',
      categoryId: 'e48cbdb2-138c-4556-e42a-08da31ee11ec',
      thumbnail:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/thumbnails/0afdd9e9-99d3-458e-6291-08da3652a896/Tao_khung_Anh_Bia_Sach_Tren_Tay5ceb98fbce77f_526dacef3186c69755fc330bff5dec1a.jpg',
      pdfFile:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/pdfs/0afdd9e9-99d3-458e-6291-08da3652a896/XU HƯỚNG PHÁT TRIỂN MOBILE APP NĂM 2021.docx',
      createdAt: '0001-01-01T00:00:00',
      updatedAt: '2022-05-22T17:21:57.0996169',
      deletedAt: null,
      term: 1,
      hiredFrom: null,
      status: 0,
      remainingCount: 12,
      hiringCount: 4,
      expiredCount: 8,
    },
    {
      id: 'e805d662-7a7b-4146-831e-08da3652b3ef',
      title: 'Toán A3',
      subTitle: null,
      quantity: 17,
      description: 'Nghệ thuật khắc kỷ',
      categoryCode: 'Tailieu',
      categoryId: 'e48cbdb2-138c-4556-e42a-08da31ee11ec',
      thumbnail:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/thumbnails/e805d662-7a7b-4146-831e-08da3652b3ef/tam-quan-trong-cua-viec-thiet-ke-bia-sach-dep.jpg',
      pdfFile:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/pdfs/e805d662-7a7b-4146-831e-08da3652b3ef/Chapter_06_Data_Encription_Standard.pdf',
      createdAt: '0001-01-01T00:00:00',
      updatedAt: '2022-05-22T17:22:07.2609856',
      deletedAt: null,
      term: 1,
      hiredFrom: null,
      status: 0,
      remainingCount: 5,
      hiringCount: 2,
      expiredCount: 10,
    },
    {
      id: 'c5ea75cf-3689-40a5-9448-08da3b2037eb',
      title: 'Triết Học Mác Lenin',
      subTitle: null,
      quantity: 27,
      description: 'Nghệ thuật khắc kỷ',
      categoryCode: 'Tailieu',
      categoryId: 'e48cbdb2-138c-4556-e42a-08da31ee11ec',
      thumbnail:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/thumbnails/c5ea75cf-3689-40a5-9448-08da3b2037eb/8-1626444967.jpg',
      pdfFile:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/pdfs/c5ea75cf-3689-40a5-9448-08da3b2037eb/May.-Chương-trình-ưu-đãi-dành-đối-tác-B2B2C.pdf',
      createdAt: '0001-01-01T00:00:00',
      updatedAt: '2022-05-22T17:22:26.0153911',
      deletedAt: null,
      term: 1,
      hiredFrom: null,
      status: 0,
      remainingCount: 20,
      hiringCount: 3,
      expiredCount: 4,
    },
    {
      id: 'f1b91cf8-8f9f-48af-9449-08da3b2037eb',
      title: 'toán cao cấp A1',
      subTitle: null,
      quantity: 19,
      description: null,
      categoryCode: 'Tailieu',
      categoryId: 'e48cbdb2-138c-4556-e42a-08da31ee11ec',
      thumbnail:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/thumbnails/f1b91cf8-8f9f-48af-9449-08da3b2037eb/Screen Shot 2022-05-15 at 15.11.27.png',
      pdfFile:
        'https://book-management-storage.s3.us-east-1.amazonaws.com/pdfs/f1b91cf8-8f9f-48af-9449-08da3b2037eb/cac-dang-bai-tap-dai-so-9.pdf',
      createdAt: '0001-01-01T00:00:00',
      updatedAt: '2022-05-22T19:42:57.2135178',
      deletedAt: null,
      term: 1,
      hiredFrom: null,
      status: 0,
      remainingCount: 6,
      hiringCount: 3,
      expiredCount: 10,
    },
  ]

  return (
    <div className="pb-5">
      <CRow>
        <CCol md={3}>
          <CAlert color="success">Số Sách Còn Lại: 100</CAlert>
        </CCol>

        <CCol md={3}>
          <CAlert color="info">Số Sách Đang Mượn: 201</CAlert>
        </CCol>

        <CCol md={3}>
          <CAlert color="danger">Số Sách Quá Hạn: 24</CAlert>
        </CCol>
      </CRow>

      <div className="mt-5">
        <CTable bordered hover align="middle">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Thứ Tự</CTableHeaderCell>
              <CTableHeaderCell>Ảnh</CTableHeaderCell>
              <CTableHeaderCell>Tên Sách</CTableHeaderCell>
              <CTableHeaderCell>Loại Sách</CTableHeaderCell>
              <CTableHeaderCell>Kì Học</CTableHeaderCell>
              <CTableHeaderCell>Số Lượng</CTableHeaderCell>
              <CTableHeaderCell>Số Lượng Còn Lại</CTableHeaderCell>
              <CTableHeaderCell>Số Lượng Đang Mượn</CTableHeaderCell>
              <CTableHeaderCell>Số Lượng Quá Hạn</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data?.map((book, index) => (
              <CTableRow
                key={book.id}
                onClick={() => navigate(`/borrowers?bookName=${book.title}`)}
              >
                <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                <CTableDataCell>
                  <CImage rounded width={70} height={50} src={book.thumbnail} />
                </CTableDataCell>
                <CTableDataCell
                  className="text-primary text-underline cursor-pointer"
                  onClick={() => setPreview(book.pdfFile)}
                >
                  {book.title}
                </CTableDataCell>
                <CTableDataCell>{book.categoryCode}</CTableDataCell>
                <CTableDataCell>Kì {book.term}</CTableDataCell>
                <CTableDataCell>{book.quantity}</CTableDataCell>
                <CTableDataCell>{book.remainingCount}</CTableDataCell>
                <CTableDataCell>{book.hiringCount}</CTableDataCell>
                <CTableDataCell>{book.expiredCount}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </div>
  )
}

export default Statistics

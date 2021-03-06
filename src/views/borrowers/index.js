import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import React, { useState, useMemo, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { useMutation, useQueryClient } from 'react-query'
import { diff, formatDate } from 'src/helpers/dayjs'
import { useBooks } from 'src/hooks/useBook'
import { useCategory } from 'src/hooks/useCategory'
import { useUsers } from 'src/hooks/useUser'
import { useBorrowers } from 'src/hooks/useBorrower'
import { createBorrower, updateBorrower } from 'src/services/borrower.service'
import { createBorrowerSchema, updateBorrowerSchema } from './validate'
import AutoCompleteComponent from 'src/components/Autocomplete'
import Select from 'react-select'
import Skeleton from 'react-loading-skeleton'
import debounce from 'lodash.debounce'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

const Borrowers = () => {
  const queryCache = useQueryClient()

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [updateBorrowerId, setUpdateBorrowerId] = useState()
  const [searchUserKey, setSearchUserKey] = useState()
  const [searchBookKey, setSearchBookKey] = useState(undefined)
  const [term, setTerm] = useState()
  const [categoryId, setCategoryId] = useState()
  const [status, setStatus] = useState()
  const [page, setPage] = useState(1)

  const search = new URLSearchParams(useLocation().search).get('bookName')

  const { data: categories } = useCategory()
  const { data: books } = useBooks({})
  const { data: users } = useUsers()
  const { data: borrower, isLoading } = useBorrowers({
    readerName: searchUserKey,
    bookName: searchBookKey !== undefined ? searchBookKey : search,
    term,
    categoryId,
    isReturned: status === '1' || '',
    isExpired: status === '2' || '',
    pageNumber: page,
  })

  const { mutate: onSubmit, isLoading: isLoadingSubmit } = useMutation(
    async () => {
      const res = updateBorrowerId
        ? await updateBorrower({ borrowerId: updateBorrowerId, ...formik.values })
        : await createBorrower({ ...formik.values })

      return res.data
    },
    {
      onSuccess: async () => {
        onClose()
        await queryCache.invalidateQueries()
        toast.success('Thay ?????i Th??nh C??ng')
      },
      onError: () => {
        toast.error('C?? L???i X???y ra')
      },
    },
  )

  const formik = useFormik({
    initialValues: {
      studentIdentify: '',
      bookIds: [],
      expiredDate: '',
      returnDate: '',
      note: '',
    },
    validationSchema: updateBorrowerId ? updateBorrowerSchema : createBorrowerSchema,
    onSubmit: onSubmit,
  })

  const recordUpdate = useMemo(() => {
    if (updateBorrowerId) {
      const data = borrower?.find((el) => el.id === updateBorrowerId)
      return data
    }
    return {}
  }, [updateBorrowerId])

  useEffect(() => {
    if (updateBorrowerId) {
      const data = borrower?.find((el) => el.id === updateBorrowerId)
      formik.setFieldValue('expiredDate', data.expiredDate, false)
      formik.setFieldValue('returnDate', data.returnedDate, false)
      formik.setFieldValue('note', data.note || '', false)
    }
  }, [updateBorrowerId])

  const onClose = () => {
    setIsOpenModal(false)
    setUpdateBorrowerId(null)
  }

  const searchUser = debounce((e) => {
    setSearchUserKey(e.target.value)
  }, 500)

  const searchBook = debounce((e) => {
    setSearchBookKey(e.target.value)
  }, 500)

  return (
    <div>
      <div className="mb-3 d-flex">
        <CRow xs={{ gutterX: 5 }} className="flex-grow-1 mb-3">
          <CCol md={2} xs="auto">
            <CFormLabel>T??n Ng?????i ?????c</CFormLabel>
            <CFormInput type="text" placeholder="Nguy???n V??n A..." onChange={searchUser} />
          </CCol>

          <CCol md={2} xs="auto">
            <CFormLabel>T??n S??ch</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Ch?? Ph??o..."
              onChange={searchBook}
              defaultValue={search}
            />
          </CCol>

          <CCol md={2} xs="auto">
            <CFormLabel htmlFor="name">K?? H???c</CFormLabel>
            <CFormSelect
              options={[
                { label: 'L???a Ch???n', value: '' },
                ...Array.from({ length: 10 }, (_, i) => ({ label: `K?? ${i + 1}`, value: i + 1 })),
              ]}
              onChange={(e) => {
                setTerm(e.target.value)
              }}
            />
          </CCol>

          <CCol md={1.5} xs="auto">
            <CFormLabel htmlFor="name">Lo???i S??ch</CFormLabel>
            <CFormCheck
              type="radio"
              label="T???t C???"
              name="categoryId"
              value=""
              onChange={(e) => {
                setCategoryId('')
              }}
              defaultChecked
            />
            {categories?.data?.map((category) => (
              <CFormCheck
                type="radio"
                name="categoryId"
                key={category.id}
                label={category.categoryName}
                value={category.id}
                onChange={(e) => {
                  setCategoryId(e.target.value)
                }}
              />
            ))}
          </CCol>

          <CCol md={1.5} xs="auto">
            <CFormLabel htmlFor="name">Tr???ng Th??i</CFormLabel>
            <CFormCheck
              type="radio"
              label="T???t C???"
              name="hiringStatus"
              value=""
              defaultChecked
              onChange={() => {
                setStatus('')
              }}
            />
            <CFormCheck
              type="radio"
              label="????ng H???n"
              name="hiringStatus"
              value="1"
              onChange={(e) => {
                setStatus(e.target.value)
              }}
            />
            <CFormCheck
              type="radio"
              label="Qu?? H???n"
              name="hiringStatus"
              value="2"
              onChange={(e) => {
                setStatus(e.target.value)
              }}
            />
          </CCol>
        </CRow>

        <div className="d-flex align-items-center">
          <CButton color="success" className="text-white" onClick={() => setIsOpenModal(true)}>
            Th??m M???i
          </CButton>
        </div>
      </div>

      <CTable bordered hover align="middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Th??? T???</CTableHeaderCell>
            <CTableHeaderCell>???nh</CTableHeaderCell>
            <CTableHeaderCell>T??n S??ch</CTableHeaderCell>
            <CTableHeaderCell>Lo???i S??ch</CTableHeaderCell>
            <CTableHeaderCell>K?? H???c</CTableHeaderCell>
            <CTableHeaderCell>Ng?????i ?????c</CTableHeaderCell>
            <CTableHeaderCell>M?? Sinh Vi??n</CTableHeaderCell>
            <CTableHeaderCell>Ng??y M?????n</CTableHeaderCell>
            <CTableHeaderCell>Ng??y Tr??? (D??? Ki???n)</CTableHeaderCell>
            <CTableHeaderCell>Ng??y Tr??? (Th???c T???)</CTableHeaderCell>
            <CTableHeaderCell className="w-150" />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {borrower?.map((record, index) => (
            <CTableRow key={record.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableDataCell>
                <CImage rounded width={70} height={50} src={record.thumbnail} />
              </CTableDataCell>
              <CTableDataCell>{record.title}</CTableDataCell>
              <CTableDataCell>{record.categoryCode}</CTableDataCell>
              <CTableDataCell>K?? {record.term}</CTableDataCell>
              <CTableDataCell>{record.studentName}</CTableDataCell>
              <CTableDataCell>{record.studentIdentify}</CTableDataCell>
              <CTableDataCell>{formatDate(record.hiredFrom)}</CTableDataCell>
              <CTableDataCell>{formatDate(record.expiredDate)}</CTableDataCell>
              <CTableDataCell>
                <span
                  className={`${
                    (!record.returnedDate && diff(new Date(), record.expiredDate) > 0) ||
                    (record.returnedDate && diff(record.returnedDate, record.expiredDate) > 0)
                      ? 'text-danger'
                      : 'text-success'
                  }`}
                >
                  {formatDate(record.returnedDate) || 'Ch??a Tr???'}
                </span>
              </CTableDataCell>
              <CTableDataCell>
                <CButton onClick={() => setUpdateBorrowerId(record.id)}>C???p Nh???t</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {isLoading && <Skeleton count={5} />}

      <CPagination align="end">
        <CPaginationItem aria-label="Trang Tr?????c">
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {Array.from({ length: 3 }, (_, i) => (
          <CPaginationItem active={i + 1 === page} onClick={() => setPage(i + 1)}>
            {i + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>

      <CModal visible={isOpenModal} onClose={onClose} alignment="center">
        <CModalHeader>
          <CModalTitle>M?????n s??ch</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                T??n S??ch
              </CFormLabel>
              <CCol sm={8}>
                {books && (
                  <Select
                    options={[...books.data].map((book) => ({
                      label: book.title,
                      value: book.id,
                    }))}
                    isMulti
                    onChange={(value) => {
                      formik.setFieldValue(
                        'bookIds',
                        value.map((el) => el.value),
                      )
                    }}
                  />
                )}

                {formik.errors.bookIds && <div className="error">{formik.errors.bookIds}</div>}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel htmlFor="studentIdentify" className="col-sm-4 col-form-label">
                Ng?????i ?????c
              </CFormLabel>
              <CCol sm={8}>
                {users && (
                  <AutoCompleteComponent
                    items={users}
                    searchKey={searchUserKey}
                    setSearchKey={setSearchUserKey}
                    onSelect={(value) =>
                      formik.setFieldValue('studentIdentify', value.studentIdentify)
                    }
                    label="studentIdentify"
                  />
                )}
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel htmlFor="expiredDate" className="col-sm-4 col-form-label">
                Ng??y Tr??? (D??? Ki???n)
              </CFormLabel>
              <CCol sm={8}>
                <DatePicker
                  id="expiredDate"
                  name="expiredDate"
                  className="datePicker"
                  dateFormat="dd/MM/yyyy"
                  selected={formik.values?.expiredDate && new Date(formik.values?.expiredDate)}
                  onChange={(value) => formik.setFieldValue('expiredDate', value || '')}
                />

                {formik.errors.expiredDate && (
                  <div className="error">{formik.errors.expiredDate}</div>
                )}
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            ????ng
          </CButton>
          <CButton color="primary" onClick={formik.handleSubmit} disabled={isLoadingSubmit}>
            {isLoadingSubmit ? 'Loading...' : 'L??u Thay ?????i'}
          </CButton>
        </CModalFooter>
      </CModal>

      {updateBorrowerId && (
        <CModal visible={updateBorrowerId} onClose={onClose} alignment="center">
          <CModalHeader>
            <CModalTitle>C???p nh???t m?????n s??ch</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                  T??n S??ch
                </CFormLabel>
                <CCol sm={8}>
                  {books && (
                    <Select
                      options={[...books.data].map((book) => ({
                        label: book.title,
                        value: book.id,
                      }))}
                      isDisabled={true}
                      onChange={(value) => {
                        formik.setFieldValue(
                          'bookIds',
                          value.map((el) => el.value),
                        )
                      }}
                      value={{ label: recordUpdate.title, value: recordUpdate.bookId }}
                    />
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="studentIdentify" className="col-sm-4 col-form-label">
                  Ng?????i ?????c
                </CFormLabel>
                <CCol sm={8}>
                  {users && (
                    <AutoCompleteComponent
                      items={users}
                      searchKey={searchUserKey}
                      setSearchKey={setSearchUserKey}
                      onSelect={(value) =>
                        formik.setFieldValue('studentIdentify', value.studentIdentify)
                      }
                      defaultValue={recordUpdate.studentIdentify}
                      disable={true}
                      label="studentIdentify"
                    />
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="hireFrom" className="col-sm-4 col-form-label">
                  Ng??y M?????n
                </CFormLabel>
                <CCol sm={8}>
                  <DatePicker
                    id="hireFrom"
                    name="hireFrom"
                    className="datePicker"
                    selected={recordUpdate.hiredFrom && new Date(recordUpdate.hiredFrom)}
                    disabled={true}
                    dateFormat="dd/MM/yyyy"
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="expiredDate" className="col-sm-4 col-form-label">
                  Ng??y Tr??? (D??? Ki???n)
                </CFormLabel>
                <CCol sm={8}>
                  <DatePicker
                    id="expiredDate"
                    name="expiredDate"
                    className="datePicker"
                    dateFormat="dd/MM/yyyy"
                    selected={formik.values?.expiredDate && new Date(formik.values?.expiredDate)}
                    onChange={(value) => formik.setFieldValue('expiredDate', value || '')}
                  />

                  {formik.errors.expiredDate && (
                    <div className="error">{formik.errors.expiredDate}</div>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="returnedDate" className="col-sm-4 col-form-label">
                  Ng??y Tr??? (Th???c T???)
                </CFormLabel>
                <CCol sm={8}>
                  <DatePicker
                    id="returnDate"
                    name="returnDate"
                    className="datePicker"
                    dateFormat="dd/MM/yyyy"
                    selected={formik.values?.returnDate && new Date(formik.values?.returnDate)}
                    onChange={(value) => formik.setFieldValue('returnDate', value || '')}
                  />

                  {formik.errors.returnDate && (
                    <div className="error">{formik.errors.returnDate}</div>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="note" className="col-sm-4 col-form-label">
                  M?? t???
                </CFormLabel>
                <CCol sm={8}>
                  <CFormTextarea
                    id="note"
                    name="note"
                    rows="5"
                    text="Must be 8-20 words long."
                    feedbackInvalid={formik.errors?.note}
                    onChange={formik.handleChange}
                    invalid={!!formik.errors?.note}
                    value={formik.values?.note}
                  ></CFormTextarea>
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={onClose}>
              ????ng
            </CButton>
            <CButton color="primary" onClick={formik.handleSubmit} disabled={isLoadingSubmit}>
              {isLoadingSubmit ? 'Loading...' : 'L??u Thay ?????i'}
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  )
}

export default Borrowers

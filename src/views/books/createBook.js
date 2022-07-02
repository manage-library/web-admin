import { useFormik } from 'formik'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { BOOK } from 'src/constants/queriesKey'
import { useCategory } from 'src/hooks/useCategory'
import { createBook, getChapters, updateBook } from 'src/services/book.service'
import { createBookSchema, updateBookSchema } from './validate'

const {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CRow,
  CFormLabel,
  CCol,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CModalFooter,
  CButton,
  CFormCheck,
} = require('@coreui/react')

const CreateBookComponent = ({ isOpen, onClose, updateBookId, book = {} }) => {
  const { data: categories } = useCategory()
  const queryClient = useQueryClient()
  const [typeBookRadio, setTypeBookRadio] = useState(false)
  const [releaseStatus, setReleaseStatus] = useState(1)

  const { data: dataBookSelected } = useQuery(
    ['BOOK_SELECT'],
    async () => {
      const res = await getChapters(updateBookId)

      return res.data
    },
    {
      enabled: !!updateBookId,
    },
  )

  const { mutate: handleSubmit, isLoading } = useMutation(
    async () => {
      const arrayCategoryIds = JSON.parse('[' + formik.values?.sub + ']')
      const object = {
        categoryIds: arrayCategoryIds,
      }
      const params = {
        ...formik.values,
        ...object,
        ...{ isVip: typeBookRadio },
        ...{ releaseStatus },
      }

      // const res = updateBookId
      //   ? await updateChap({ bookId: updateBookId, formData })
      //   : await createChap(formik.values)
      // return res.data
      const res = updateBookId ? await updateBook(updateBookId, params) : await createBook(params)
      return res.data
    },
    {
      onSuccess: async () => {
        onClose()
        await queryClient.invalidateQueries(BOOK)
        toast.success('Thay Đổi Thành Công')
      },
      onError: () => {
        toast.error('Có Lỗi Xảy ra')
      },
    },
  )

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      authorDescription: '',
      image: '',
      sub: 1,
      isVisible: true,
    },
    validationSchema: updateBookId ? updateBookSchema : createBookSchema,
    onSubmit: handleSubmit,
  })

  return (
    <CModal
      visible={isOpen || !!updateBookId}
      onClose={() => {
        onClose()
        formik.setValues({
          name: '',
          description: '',
          authorDescription: '',
          image: '',
          sub: 1,
          isVisible: true,
        })
      }}
      alignment="center"
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>Thêm sách mới</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CForm>
          <CRow className="mb-3">
            <CFormLabel htmlFor="image" className="col-sm-4 col-form-label">
              Ảnh
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                id="image"
                type="text"
                name="image"
                feedbackInvalid={formik.errors?.image}
                onChange={formik.handleChange}
                invalid={!!formik.errors?.image}
                value={formik.values?.image}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="name" className="col-sm-4 col-form-label">
              Tên Sách
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                id="name"
                type="text"
                name="name"
                feedbackInvalid={formik.errors?.name}
                onChange={formik.handleChange}
                invalid={!!formik.errors?.name}
                value={formik.values?.name}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="authorDescription" className="col-sm-4 col-form-label">
              Tác giả
            </CFormLabel>
            <CCol sm={8}>
              <CFormInput
                id="authorDescription"
                type="text"
                name="authorDescription"
                feedbackInvalid={formik.errors?.authorDescription}
                onChange={formik.handleChange}
                invalid={!!formik.errors?.authorDescription}
                value={formik.values?.authorDescription}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3 ">
            <CFormLabel htmlFor="author" className="col-sm-4 col-form-label">
              Loại sách
            </CFormLabel>
            <CCol sm={8} className="d-flex justify-content-evenly pt-1">
              <CFormCheck
                type="radio"
                name="typeBookRadiox"
                id="typeBookRadio1"
                label="Sách thường"
                defaultChecked
                onClick={() => setTypeBookRadio(false)}
              />
              <CFormCheck
                type="radio"
                name="typeBookRadiox"
                id="typeBookRadio2"
                label="Sách Vip"
                onClick={() => setTypeBookRadio(true)}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3 ">
            <CFormLabel htmlFor="releaseStatus" className="col-sm-4 col-form-label">
              Tình trạng xuất bản
            </CFormLabel>
            <CCol sm={8} className="d-flex justify-content-evenly pt-1">
              <CFormCheck
                type="radio"
                name="releaseStatusx"
                id="releaseStatus1"
                label="Chưa hoàn thiện"
                defaultChecked
                onClick={() => setReleaseStatus(1)}
              />
              <CFormCheck
                type="radio"
                name="releaseStatusx"
                id="releaseStatus2"
                label="Đã hoàn thiện"
                onClick={() => setReleaseStatus(2)}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="sub" className="col-sm-4 col-form-label">
              Loại Sách
            </CFormLabel>
            <CCol sm={8}>
              <CFormSelect
                aria-label="Default select example"
                id="sub"
                name="sub"
                feedbackInvalid={formik.errors?.sub}
                onChange={formik.handleChange}
                invalid={!!formik.errors?.sub}
                value={formik.values?.sub}
              >
                {categories?.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
              Mô tả
            </CFormLabel>
            <CCol sm={8}>
              <CFormTextarea
                id="description"
                name="description"
                rows="5"
                text="Must be 8-20 words long."
                feedbackInvalid={formik.errors?.description}
                onChange={formik.handleChange}
                invalid={!!formik.errors?.description}
                value={formik.values?.description}
              ></CFormTextarea>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton
          color="secondary"
          onClick={() => {
            formik.setValues(
              {
                name: '',
                description: '',
                authorDescription: '',
                image: '',
                sub: 1,
                isVisible: true,
              },
              false,
            )
            onClose()
          }}
        >
          Đóng
        </CButton>
        <CButton color="primary" onClick={formik.handleSubmit} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Lưu Thay Đổi'}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

CreateBookComponent.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  updateBookId: PropTypes.any,
  book: PropTypes.object,
}

export default CreateBookComponent

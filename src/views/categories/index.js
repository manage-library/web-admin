import {
  CButton,
  CCol,
  CForm,
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
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { CATEGORY } from 'src/constants/queriesKey'
import { createCategory, removeCategory, updateCategory } from 'src/services/category.service'
import { useCategory } from '../../hooks/useCategory'
import { createCategorySchema, updateCategorySchema } from './validate'

const Categories = () => {
  const queryClient = useQueryClient()

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [updateCategoryId, setUpdateCategoryId] = useState()
  const [indexRow, setIndexRow] = useState()
  const [removeCategoryId, setRemoveCategoryId] = useState()

  const onClose = () => {
    setOpenModalAdd(false)
    setUpdateCategoryId(null)
    setIndexRow(null)
    formik.setValues({}, false)
  }

  const { data: categories, isLoading, error } = useCategory()

  const { mutate: handleChangeCategory, isLoading: isLoadingSubmitCategory } = useMutation(
    ({ categoryName }) => {
      return updateCategoryId
        ? updateCategory(updateCategoryId, { name: categoryName })
        : createCategory({ name: categoryName })
    },
    {
      onSuccess: async () => {
        toast.success('Thay đổi thành công')
        await queryClient.invalidateQueries(CATEGORY)
        onClose()
      },
      onError: () => {
        toast.error('Có Lỗi Xảy ra')
      },
    },
  )

  const { mutate: handleRemoveCategory, isLoading: isLoadingRemoveCategory } = useMutation(
    () => {
      return removeCategory({ categoryId: removeCategoryId })
    },
    {
      onSuccess: async () => {
        toast.success('Thay đổi thành công')
        await queryClient.invalidateQueries(CATEGORY)
        setRemoveCategoryId(null)
      },
      onError: (e) => {
        toast.error('Không thể xóa thể loại sách đã tồn tại sách')
      },
    },
  )

  const formik = useFormik({
    initialValues: {
      categoryName: '',
      subtitle: '',
      thumbnail: '',
    },
    validationSchema: updateCategoryId ? updateCategorySchema : createCategorySchema,
    onSubmit: handleChangeCategory,
  })

  useEffect(() => {
    if (updateCategoryId) {
      formik.setValues(
        {
          ...categories?.data?.find((category) => category.id === updateCategoryId),
          thumbnail: undefined,
        },
        false,
      )
    }
  }, [updateCategoryId])

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <CButton color="success" className="text-white" onClick={() => setOpenModalAdd(true)}>
          Thêm Mới
        </CButton>
      </div>
      <CTable align="middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Thứ tự</CTableHeaderCell>
            <CTableHeaderCell>Id</CTableHeaderCell>
            <CTableHeaderCell>Thể loại</CTableHeaderCell>
            <CTableHeaderCell className="action-column" />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories?.data?.map((category, index) => (
            <CTableRow key={category.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableHeaderCell>{category.id}</CTableHeaderCell>
              <CTableDataCell>{category.name}</CTableDataCell>
              <CTableDataCell className="d-flex justify-content-evenly mt-3">
                <CButton
                  onClick={() => {
                    setIndexRow(index)
                    setUpdateCategoryId(category.id)
                    formik.setFieldValue('categoryName', category.categoryName, false)
                    formik.setFieldValue('subtitle', category.subtitle, false)
                  }}
                >
                  Cập Nhật
                </CButton>
                <CButton
                  color="danger"
                  className="text-white"
                  onClick={() => setRemoveCategoryId(category.id)}
                >
                  Xóa
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {isLoading && <Skeleton count={5} />}

      <CModal visible={openModalAdd || updateCategoryId} onClose={onClose} alignment="center">
        <CModalHeader>
          <CModalTitle>
            {updateCategoryId ? 'Cập nhật thể loại sách' : 'Tạo mới thể loại sách'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {updateCategoryId && (
                <>
                  <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                    Tên thể loại cũ
                  </CFormLabel>
                  <CCol sm={8}>{categories?.data[indexRow]?.name}</CCol>
                </>
              )}
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="staticEmail" className="col-sm-4 col-form-label">
                Tên thể loại mới
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput
                  type="text"
                  name="categoryName"
                  value={formik.values?.categoryName}
                  feedbackInvalid={formik.errors?.categoryName}
                  invalid={!!formik.errors?.categoryName}
                  onChange={formik.handleChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={formik.handleSubmit} disabled={isLoadingSubmitCategory}>
            {isLoadingSubmitCategory ? 'Loading...' : 'Lưu Thay Đổi'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={removeCategoryId}
        onClose={() => setRemoveCategoryId(null)}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Xoá thể loại sách</CModalTitle>
        </CModalHeader>
        <CModalBody>Bạn có chắc chắn muốn xoá ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRemoveCategoryId(null)}>
            Đóng
          </CButton>
          <CButton
            color="primary"
            onClick={handleRemoveCategory}
            disabled={isLoadingRemoveCategory}
          >
            {isLoadingRemoveCategory ? 'Loading...' : 'Lưu Thay Đổi'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Categories

import {
  CButton,
  CCol,
  CForm,
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
import debounce from 'lodash.debounce'
import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { BOOK } from 'src/constants/queriesKey'
import { useCategory } from 'src/hooks/useCategory'
import {
  addChap,
  deleteChapter,
  editChap,
  getChapters,
  getContent,
  removeBook,
} from 'src/services/book.service'
import { useBooks } from '../../hooks/useBook'
import CreateBookComponent from './createBook'
import { changeChapSchemas } from './validate'

const Books = () => {
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)
  const [updateBookId, setUpdateBookId] = useState()
  const [removeBookId, setRemoveBookId] = useState()
  const [preview, setPreview] = useState(false)
  const [selectDetail, setSelectDetail] = useState(undefined)
  const [searchKey, setSearchKey] = useState('')
  const [sortTypeView, setSortTypeView] = useState(undefined)
  const [sortTypeLike, setSortTypeLike] = useState(undefined)
  const [sortBy, setSortBy] = useState(undefined)
  const [searchKeyAuthor, setSearchKeyAuthor] = useState('')
  const [selectCategories, setSelectCategories] = useState(0)
  const [type, setSelectType] = useState()
  const [showChapter, setShowChapter] = useState()
  const [chapterArr, setChapterArr] = useState([])
  const [page, setPage] = useState(1)
  const [showContent, setShowContent] = useState()
  const [bookId, setBookId] = useState(0)
  const [contentArr, setContentArr] = useState([])
  const [changeContent, setChangeContent] = useState(false)
  const [chapterId, setChapterId] = useState()

  const { data: categories } = useCategory()
  const { data: books, isLoading } = useBooks({
    searchKey,
    pageNumber: page,
    selectCategories,
    searchKeyAuthor,
    type,
    sortTypeView,
    sortTypeLike,
    sortBy,
  })

  const onClose = () => {
    setIsOpen(false)
    setUpdateBookId(null)
  }

  const { mutate: handleGetChapter } = useMutation(async (selectBook) => {
    const res = await getChapters(selectBook)
    setBookId(selectBook)
    setChapterArr(res?.data?.chapters)
    return res.data
  })

  const { mutate: handleGetContent } = useMutation(async (chapterId) => {
    const res = await getContent(bookId, chapterId)
    setContentArr(res?.data)
    return res.data
  })

  const { mutate: handleChangeContent } = useMutation(
    async () => {
      const res = chapterId
        ? await editChap(chapterId, bookId, formikChangeChap.values)
        : await addChap(bookId, formikChangeChap.values)
      return res.data
    },
    {
      onSuccess: async () => {
        setChangeContent(false)
        await queryClient.invalidateQueries(BOOK)
        toast.success('Thay Đổi Thành Công')
      },
      onError: () => {
        toast.error('Có Lỗi Xảy ra')
      },
    },
  )

  const { mutate: handleDeleteChapter } = useMutation(
    async (chapterId) => {
      const res = await deleteChapter(bookId, chapterId)
      return res.data
    },
    {
      onSuccess: async () => {
        setShowChapter(false)
        await queryClient.invalidateQueries(BOOK)
        toast.success('Xóa chương thành công')
      },
      onError: () => {
        toast.error('Có Lỗi Xảy ra')
      },
    },
  )

  const { mutate: handleRemoveBook, isLoading: isLoadingRemoveBook } = useMutation(
    async () => {
      const res = await removeBook({ bookId: removeBookId })

      return res.data
    },
    {
      onSuccess: async () => {
        setRemoveBookId(null)
        await queryClient.invalidateQueries(BOOK)
        toast.success('Thay Đổi Thành Công')
      },
      onError: () => {
        toast.error('Có Lỗi Xảy ra')
      },
    },
  )

  const searchBook = debounce((e) => {
    setSearchKey(e.target.value)
  }, 500)

  const searchAuthor = debounce((e) => {
    setSearchKeyAuthor(e.target.value)
  }, 500)

  const cate = (e) => {
    setSelectCategories(e.target.value)
  }

  const searchType = (e) => {
    setSelectType(e.target.value)
  }

  const onPressView = () => {
    setSortBy(2)
    setSortTypeLike(undefined)
    if (sortTypeView) {
      if (sortTypeView === 'ASC') setSortTypeView('DESC')
      else setSortTypeView('ASC')
    } else setSortTypeView('ASC')
  }

  const onPressLike = () => {
    setSortBy(1)
    setSortTypeView(undefined)
    if (sortTypeLike) {
      if (sortTypeLike === 'ASC') setSortTypeLike('DESC')
      else setSortTypeLike('ASC')
    } else setSortTypeLike('ASC')
  }

  const formikChangeChap = useFormik({
    initialValues: {
      name: '',
      content: '',
      description: '',
    },
    validationSchema: changeChapSchemas,
    onSubmit: handleChangeContent,
  })

  return (
    <div>
      <div className="mb-3 d-flex">
        <CRow xs={{ gutterX: 5 }} className="flex-grow-1">
          <CCol md={3} xs="auto">
            <CFormLabel htmlFor="name">Thể loại sách</CFormLabel>
            <CFormSelect aria-label="Default select example" onChange={cate}>
              <option value="0">Tất cả</option>
              {categories?.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={3} xs="auto">
            <CFormLabel htmlFor="name">Tên Sách</CFormLabel>
            <CFormInput
              id="name"
              type="text"
              placeholder="Đường Kách Mệnh..."
              onChange={searchBook}
            />
          </CCol>

          <CCol md={3} xs="auto">
            <CFormLabel htmlFor="name">Tên tác giả</CFormLabel>
            <CFormInput
              id="name"
              type="text"
              placeholder="Hồ Chí Minh..."
              onChange={searchAuthor}
            />
          </CCol>
          <CCol md={2} xs="auto">
            <CFormLabel htmlFor="name">Loại sách</CFormLabel>
            <CFormSelect
              options={[
                { label: 'Tất cả', value: '--' },
                { label: 'Sách VIP', value: 'true' },
                { label: 'Sách thường', value: 'false' },
              ]}
              onChange={searchType}
            ></CFormSelect>
          </CCol>
        </CRow>

        <div className="d-flex align-items-center">
          <CButton color="success" className="text-white" onClick={() => setIsOpen(true)}>
            Thêm Mới
          </CButton>
        </div>
      </div>

      <CTable hover align="middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Thứ Tự</CTableHeaderCell>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Ảnh</CTableHeaderCell>
            <CTableHeaderCell>Tên sách</CTableHeaderCell>
            <CTableHeaderCell>Thể loại sách</CTableHeaderCell>
            <CTableHeaderCell>Số lượng chương đã phát hành</CTableHeaderCell>
            <CTableHeaderCell>Tình trạng xuất bản</CTableHeaderCell>
            <CTableHeaderCell
              className=" cursor-pointer"
              onClick={() => {
                onPressView()
              }}
            >
              Số Lượt xem
            </CTableHeaderCell>
            <CTableHeaderCell
              className=" cursor-pointer"
              onClick={() => {
                onPressLike()
              }}
            >
              Số Like
            </CTableHeaderCell>
            {/* <CTableHeaderCell>Cập nhật lần cuối</CTableHeaderCell> */}
            <CTableHeaderCell className="action-column" />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {books?.data?.map((book, index) => (
            <CTableRow key={book.id}>
              <CTableHeaderCell>{index + 1}</CTableHeaderCell>
              <CTableHeaderCell>{book.id}</CTableHeaderCell>
              <CTableDataCell>
                <CImage rounded width={70} height={50} src={book.image} />
              </CTableDataCell>
              <CTableDataCell
                className="text-primary text-underline cursor-pointer"
                onClick={() => {
                  setPreview(true)
                  setSelectDetail(index)
                }}
              >
                {book.name}
              </CTableDataCell>
              <CTableDataCell>{book?.bookCategory[0]?.category?.name}</CTableDataCell>
              <CTableDataCell
                className="text-primary text-underline cursor-pointer"
                onClick={() => {
                  handleGetChapter(book.id)
                  setShowChapter(true)
                }}
              >
                {book?.countChapter}
              </CTableDataCell>
              <CTableDataCell>
                {book?.release_status === 2 ? 'Đã hoàn thiện' : 'Chưa hoàn thiện'}
              </CTableDataCell>
              <CTableDataCell>{book.countView}</CTableDataCell>
              <CTableDataCell>{book.countLike}</CTableDataCell>
              {/* <CTableDataCell>{formatDate(book.updatedAt || book.createdAt)}</CTableDataCell> */}
              <CTableDataCell className="d-flex justify-content-evenly mt-3">
                <CButton onClick={() => setUpdateBookId(book.id)}>Cập Nhật</CButton>
                <CButton
                  color="danger"
                  className="text-white"
                  onClick={() => setRemoveBookId(book.id)}
                >
                  Xóa
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {isLoading && <Skeleton count={5} />}

      <CPagination align="end">
        <CPaginationItem aria-label="Trang Trước" disabled={page === 1}>
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {Array.from({ length: Math.round(books?.totalRecords / books?.pageSize) + 1 }, (_, i) => (
          <CPaginationItem active={i + 1 === page} onClick={() => setPage(i + 1)}>
            {i + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          aria-label="Next"
          disabled={page >= Math.round(books?.totalRecords / books?.pageSize) + 1}
        >
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>

      <CreateBookComponent
        isOpen={isOpen}
        onClose={onClose}
        updateBookId={updateBookId}
        book={books?.data?.find((book) => book.id === updateBookId)}
      />

      <CModal visible={removeBookId} onClose={() => setRemoveBookId(null)} alignment="center">
        <CModalHeader>
          <CModalTitle>Xoá sách</CModalTitle>
        </CModalHeader>
        <CModalBody>Bạn có chắc chắn muốn xoá ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRemoveBookId(null)}>
            Đóng
          </CButton>
          <CButton color="primary" onClick={handleRemoveBook} disabled={isLoadingRemoveBook}>
            {isLoadingRemoveBook ? 'Loading...' : 'Chắc chắn xoá'}
          </CButton>
        </CModalFooter>
      </CModal>

      {preview && selectDetail !== undefined && (
        <CModal
          visible={!!preview}
          onClose={() => {
            setPreview(false)
          }}
          alignment="center"
          size="xl"
        >
          <CModalHeader>
            <CModalTitle>Chi tiết sách</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mb-3 ">
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Id
              </CFormLabel>
              <CCol sm={1}>{books?.data[selectDetail]?.id}</CCol>
              <CCol sm={7}>
                {books?.data[selectDetail]?.is_vip ? '<Sách Vip>' : '<Sách thường>  '}
              </CCol>

              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Ảnh
              </CFormLabel>
              <CCol sm={8}>
                <CImage rounded src={books?.data[selectDetail]?.image} />
              </CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Tên sách
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.name}</CCol>

              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Thể loại
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.bookCategory[0]?.category?.name}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Mô tả
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.description}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Người đăng
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.author?.full_name}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Tác giả
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.author_description || 'Chưa rõ'}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Số lượng chương đã phát hành
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countChapter}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Số lượng lượt xem
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countView}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Số lượng lượt like
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countLike}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Số lượng lượt tải xuống
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countDownload}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Điểm đánh giá
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.rate?.value}/5</CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setPreview(false)}>
              Đóng
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {showChapter && (
        <CModal
          visible={!!showChapter}
          onClose={() => {
            setShowChapter(false)
          }}
          alignment="center"
          size="xl"
        >
          <CModalHeader>
            <CModalTitle>Số lượng chương đã phát hành</CModalTitle>
          </CModalHeader>

          <CTable hover align="middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Thứ Tự</CTableHeaderCell>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Tên chương</CTableHeaderCell>
                <CTableHeaderCell>Mô tả</CTableHeaderCell>
                <CTableHeaderCell className="action-column" />
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {chapterArr.map((chapter, index) => (
                <CTableRow key={chapter.id}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableHeaderCell>{chapter.id}</CTableHeaderCell>
                  <CTableHeaderCell
                    className="text-primary text-underline cursor-pointer"
                    onClick={() => {
                      handleGetContent(chapter.id)
                      setShowContent(true)
                      setShowChapter(false)
                    }}
                  >
                    {chapter.name}
                  </CTableHeaderCell>
                  <CTableHeaderCell>{chapter.description || 'Chưa có mô tả'}</CTableHeaderCell>
                  <CTableDataCell>
                    <CButton
                      onClick={() => {
                        // handleGetContent(chapter.id)
                        setChangeContent(true)
                        setShowChapter(false)
                        setChapterId(chapter.id)
                      }}
                    >
                      Cập Nhật
                    </CButton>
                    <CButton
                      color="danger"
                      className="text-white"
                      onClick={() => handleDeleteChapter(chapter.id)}
                    >
                      Xóa
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <CModalFooter>
            <div className="d-flex p-2">
              <CButton
                color="success"
                className="text-white"
                onClick={() => {
                  setChapterId()
                  setChangeContent(true)
                }}
              >
                Thêm Mới
              </CButton>
            </div>
            <CButton
              color="secondary"
              onClick={() => {
                setShowChapter(false)
              }}
            >
              Đóng
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {showContent && (
        <CModal
          visible={!!showContent}
          onClose={() => {
            setShowContent(false)
          }}
          alignment="center"
          size="xl"
        >
          <CModalHeader>
            <CModalTitle>Tên chương: {contentArr.name}</CModalTitle>
          </CModalHeader>

          <CFormLabel htmlFor="content" className=" col-sm-4 col-form-label px-4 py-2">
            Nội dung:
          </CFormLabel>

          <CModalBody className="px-4">{contentArr.content}</CModalBody>

          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setShowContent(false)
              }}
            >
              Đóng
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {changeContent && (
        <CModal
          visible={!!changeContent}
          onClose={() => {
            setChangeContent(false)
            formikChangeChap.setValues(
              {
                name: '',
                content: '',
                description: '',
              },
              false,
            )
          }}
          alignment="center"
          size="xl"
        >
          <CModalHeader>
            <CModalTitle>
              {chapterId ? `Cập nhật chương: ${chapterId}` : `Thêm chương mới`}
            </CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CFormLabel htmlFor="name" className="col-sm-4 col-form-label">
                  Tên chương
                </CFormLabel>
                <CCol sm={8}>
                  <CFormInput
                    id="name"
                    type="text"
                    name="name"
                    feedbackInvalid={formikChangeChap.errors?.name}
                    onChange={formikChangeChap.handleChange}
                    invalid={!!formikChangeChap.errors?.name}
                    value={formikChangeChap.values?.name}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                  Mô tả
                </CFormLabel>
                <CCol sm={8}>
                  <CFormInput
                    id="description"
                    type="text"
                    name="description"
                    feedbackInvalid={formikChangeChap.errors?.description}
                    onChange={formikChangeChap.handleChange}
                    invalid={!!formikChangeChap.errors?.description}
                    value={formikChangeChap.values?.description}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CFormLabel htmlFor="content" className="col-sm-4 col-form-label">
                  Nội dung
                </CFormLabel>
                <CCol sm={8}>
                  <CFormTextarea
                    id="content"
                    name="content"
                    rows="5"
                    feedbackInvalid={formikChangeChap.errors?.content}
                    onChange={formikChangeChap.handleChange}
                    invalid={!!formikChangeChap.errors?.content}
                    value={formikChangeChap.values?.content}
                  ></CFormTextarea>
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>

          <CModalFooter>
            <CButton color="primary" onClick={formikChangeChap.handleSubmit} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Lưu Thay Đổi'}
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                setChangeContent(false)
                formikChangeChap.setValues(
                  {
                    name: '',
                    content: '',
                    description: '',
                  },
                  false,
                )
              }}
            >
              Đóng
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  )
}

export default Books

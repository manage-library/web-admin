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
        toast.success('Thay ?????i Th??nh C??ng')
      },
      onError: () => {
        toast.error('C?? L???i X???y ra')
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
        toast.success('X??a ch????ng th??nh c??ng')
      },
      onError: () => {
        toast.error('C?? L???i X???y ra')
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
        toast.success('Thay ?????i Th??nh C??ng')
      },
      onError: () => {
        toast.error('C?? L???i X???y ra')
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
            <CFormLabel htmlFor="name">Th??? lo???i s??ch</CFormLabel>
            <CFormSelect aria-label="Default select example" onChange={cate}>
              <option value="0">T???t c???</option>
              {categories?.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={3} xs="auto">
            <CFormLabel htmlFor="name">T??n S??ch</CFormLabel>
            <CFormInput
              id="name"
              type="text"
              placeholder="???????ng K??ch M???nh..."
              onChange={searchBook}
            />
          </CCol>

          <CCol md={3} xs="auto">
            <CFormLabel htmlFor="name">T??n t??c gi???</CFormLabel>
            <CFormInput
              id="name"
              type="text"
              placeholder="H??? Ch?? Minh..."
              onChange={searchAuthor}
            />
          </CCol>
          <CCol md={2} xs="auto">
            <CFormLabel htmlFor="name">Lo???i s??ch</CFormLabel>
            <CFormSelect
              options={[
                { label: 'T???t c???', value: '--' },
                { label: 'S??ch VIP', value: 'true' },
                { label: 'S??ch th?????ng', value: 'false' },
              ]}
              onChange={searchType}
            ></CFormSelect>
          </CCol>
        </CRow>

        <div className="d-flex align-items-center">
          <CButton color="success" className="text-white" onClick={() => setIsOpen(true)}>
            Th??m M???i
          </CButton>
        </div>
      </div>

      <CTable hover align="middle">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Th??? T???</CTableHeaderCell>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>???nh</CTableHeaderCell>
            <CTableHeaderCell>T??n s??ch</CTableHeaderCell>
            <CTableHeaderCell>Th??? lo???i s??ch</CTableHeaderCell>
            <CTableHeaderCell>S??? l?????ng ch????ng ???? ph??t h??nh</CTableHeaderCell>
            <CTableHeaderCell>T??nh tr???ng xu???t b???n</CTableHeaderCell>
            <CTableHeaderCell
              className=" cursor-pointer"
              onClick={() => {
                onPressView()
              }}
            >
              S??? L?????t xem
            </CTableHeaderCell>
            <CTableHeaderCell
              className=" cursor-pointer"
              onClick={() => {
                onPressLike()
              }}
            >
              S??? Like
            </CTableHeaderCell>
            {/* <CTableHeaderCell>C???p nh???t l???n cu???i</CTableHeaderCell> */}
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
                {book?.release_status === 2 ? '???? ho??n thi???n' : 'Ch??a ho??n thi???n'}
              </CTableDataCell>
              <CTableDataCell>{book.countView}</CTableDataCell>
              <CTableDataCell>{book.countLike}</CTableDataCell>
              {/* <CTableDataCell>{formatDate(book.updatedAt || book.createdAt)}</CTableDataCell> */}
              <CTableDataCell className="d-flex justify-content-evenly mt-3">
                <CButton onClick={() => setUpdateBookId(book.id)}>C???p Nh???t</CButton>
                <CButton
                  color="danger"
                  className="text-white"
                  onClick={() => setRemoveBookId(book.id)}
                >
                  X??a
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {isLoading && <Skeleton count={5} />}

      <CPagination align="end">
        <CPaginationItem aria-label="Trang Tr?????c" disabled={page === 1}>
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
          <CModalTitle>Xo?? s??ch</CModalTitle>
        </CModalHeader>
        <CModalBody>B???n c?? ch???c ch???n mu???n xo?? ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRemoveBookId(null)}>
            ????ng
          </CButton>
          <CButton color="primary" onClick={handleRemoveBook} disabled={isLoadingRemoveBook}>
            {isLoadingRemoveBook ? 'Loading...' : 'Ch???c ch???n xo??'}
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
            <CModalTitle>Chi ti???t s??ch</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className="mb-3 ">
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Id
              </CFormLabel>
              <CCol sm={1}>{books?.data[selectDetail]?.id}</CCol>
              <CCol sm={7}>
                {books?.data[selectDetail]?.is_vip ? '<S??ch Vip>' : '<S??ch th?????ng>  '}
              </CCol>

              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                ???nh
              </CFormLabel>
              <CCol sm={8}>
                <CImage rounded src={books?.data[selectDetail]?.image} />
              </CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                T??n s??ch
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.name}</CCol>

              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Th??? lo???i
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.bookCategory[0]?.category?.name}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                M?? t???
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.description}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                Ng?????i ????ng
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.author?.full_name}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                T??c gi???
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.author_description || 'Ch??a r??'}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                S??? l?????ng ch????ng ???? ph??t h??nh
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countChapter}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                S??? l?????ng l?????t xem
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countView}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                S??? l?????ng l?????t like
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countLike}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                S??? l?????ng l?????t t???i xu???ng
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.countDownload}</CCol>
              <CFormLabel htmlFor="description" className="col-sm-4 col-form-label">
                ??i???m ????nh gi??
              </CFormLabel>
              <CCol sm={8}>{books?.data[selectDetail]?.rate?.value}/5</CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setPreview(false)}>
              ????ng
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
            <CModalTitle>S??? l?????ng ch????ng ???? ph??t h??nh</CModalTitle>
          </CModalHeader>

          <CTable hover align="middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Th??? T???</CTableHeaderCell>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>T??n ch????ng</CTableHeaderCell>
                <CTableHeaderCell>M?? t???</CTableHeaderCell>
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
                  <CTableHeaderCell>{chapter.description || 'Ch??a c?? m?? t???'}</CTableHeaderCell>
                  <CTableDataCell>
                    <CButton
                      onClick={() => {
                        // handleGetContent(chapter.id)
                        setChangeContent(true)
                        setShowChapter(false)
                        setChapterId(chapter.id)
                      }}
                    >
                      C???p Nh???t
                    </CButton>
                    <CButton
                      color="danger"
                      className="text-white"
                      onClick={() => handleDeleteChapter(chapter.id)}
                    >
                      X??a
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
                Th??m M???i
              </CButton>
            </div>
            <CButton
              color="secondary"
              onClick={() => {
                setShowChapter(false)
              }}
            >
              ????ng
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
            <CModalTitle>T??n ch????ng: {contentArr.name}</CModalTitle>
          </CModalHeader>

          <CFormLabel htmlFor="content" className=" col-sm-4 col-form-label px-4 py-2">
            N???i dung:
          </CFormLabel>

          <CModalBody className="px-4">{contentArr.content}</CModalBody>

          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setShowContent(false)
              }}
            >
              ????ng
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
              {chapterId ? `C???p nh???t ch????ng: ${chapterId}` : `Th??m ch????ng m???i`}
            </CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CFormLabel htmlFor="name" className="col-sm-4 col-form-label">
                  T??n ch????ng
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
                  M?? t???
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
                  N???i dung
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
              {isLoading ? 'Loading...' : 'L??u Thay ?????i'}
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
              ????ng
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  )
}

export default Books

import React from 'react'

const CategoriesComponent = React.lazy(() => import('../views/categories'))
const BooksComponent = React.lazy(() => import('../views/books'))
const BorrowersComponent = React.lazy(() => import('../views/borrowers'))
const UsersComponent = React.lazy(() => import('../views/users'))
const AdminComponent = React.lazy(() => import('../views/admin'))
const StatisticsComponent = React.lazy(() => import('../views/statistics'))

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Thể loại',
    element: CategoriesComponent,
    needsAuth: true,
    roles: ['Admin', 'Librarier'],
  },
  {
    path: '/categories',
    exact: true,
    name: 'Thể loại',
    element: CategoriesComponent,
    needsAuth: true,
    roles: ['Admin', 'Librarier'],
  },
  {
    path: '/books',
    exact: true,
    name: 'Sách',
    element: BooksComponent,
    needsAuth: true,
    roles: ['Admin', 'Librarier'],
  },
  {
    path: '/borrowers',
    exact: true,
    name: 'Mượn - Trả',
    element: BorrowersComponent,
    needsAuth: true,
    roles: ['Admin', 'Librarier'],
  },
  {
    path: '/users',
    exact: true,
    name: 'Người Dùng Hệ Thống',
    element: AdminComponent,
    needsAuth: true,
    roles: ['Admin'],
  },
  {
    path: '/readers',
    exact: true,
    name: 'Người Đọc',
    element: UsersComponent,
    needsAuth: true,
    roles: ['Admin', 'Librarier'],
  },
  {
    path: '/statistics',
    exact: true,
    name: 'Thống Kê',
    element: StatisticsComponent,
    needsAuth: true,
    roles: ['Admin'],
  },
]

export default routes

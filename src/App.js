import { createBrowserHistory } from 'history'
import React, { Component, Suspense } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './scss/style.scss'

export const history = createBrowserHistory()

const queryClient = new QueryClient()

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/login'))
const Page404 = React.lazy(() => import('./views/page404'))
const Page500 = React.lazy(() => import('./views/page500'))

class App extends Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <HashRouter history={history}>
          <Suspense fallback={loading}>
            <Routes>
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
          </Suspense>
        </HashRouter>

        <ToastContainer autoClose={2000} />
      </QueryClientProvider>
    )
  }
}

export default App

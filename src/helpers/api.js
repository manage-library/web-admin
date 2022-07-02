import axios from 'axios'
import { history } from '../App'

const baseURL = process.env.REACT_APP_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.accessToken}`,
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.accessToken}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) =>
    new Promise((resolve, reject) => {
      resolve(response)
    }),
  (error) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error)
      })
    }

    if (error.response.status === 401) {
      localStorage.removeItem('accessToken')

      window.location = '/#/login'
    }

    if (error.response.status === 403) {
      localStorage.removeItem('accessToken')

      if (history) {
        history.push('/login')
      } else {
        window.location = '/login'
      }
    } else {
      return new Promise((resolve, reject) => {
        reject(error)
      })
    }
  },
)

export const api = axiosInstance

import dayjs from 'dayjs'

export const formatDate = (value) => {
  if (!value) return null

  return dayjs(value).format('DD/MM/YYYY')
}

export const diff = (date1, date2) => {
  return dayjs(date1).diff(dayjs(date2))
}

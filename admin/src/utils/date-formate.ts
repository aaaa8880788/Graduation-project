import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const detaultFormate = 'YYYY-MM-DD HH:mm:ss'

export function formateUtcString(
  utcString: string,
  format: string = detaultFormate
) {
  return dayjs.utc(utcString).format(format)
}

export function formateString(
  timeString: string,
  format: string = detaultFormate
) {
  return dayjs(timeString).format(format)
}

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn';
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.locale('zh-cn'); // 使用本地化语言
dayjs.extend(utc)
dayjs.extend(relativeTime);

const detaultFormate = 'YYYY-MM-DD HH:mm:ss'

export function formateUtcString(
  utcString,
  format = detaultFormate
) {
  return dayjs.utc(utcString).format(format)
}

export function formateString(
  timeString,
  format = detaultFormate
) {
  return dayjs(timeString).format(format)
}

// 显示xxx时间前 (显示为几分钟前 几小时前 几天前 几个月前 )
export function getLastTime(time) {
  return dayjs(time).fromNow().replace(' ', '');
}

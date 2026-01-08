// let md_5 = require("md5");
//
// export function md5(id: any, createdAt: any) {
//     let hash = `${md_5(id)}_${createdAt}`
//     return hash
// }
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import i18n from 'i18next'

export function setCookie(name: string, value: any, days: number) {
  let expires = '';
  if (days) {
    let date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export function getCookie(name: string) {
  let nameEQ = name + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function eraseCookie(name: string) {
  setCookie(name, '', -1)
}

export function number_format(number: any, addCurrency?: boolean, decimals?: any, _dec_point?: any, thousands_sep?: any) {
  let n = number,
    c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals
  
  let t = thousands_sep == undefined ? ',' : thousands_sep,
    s = n < 0 ? '-' : ''
  let i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + '',
    // @ts-ignore
    j: number = (j = i.length) > 3 ? j % 3 : 0
  
  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (addCurrency ? ' đ' : '')
}

export function number_format_custom(number: any, decimals?: any, _dec_point?: any, thousands_sep?: any) {
  if (number == 0 || number == null || number == undefined || number == '' || isNaN(number)) return '---'
  
  let n = number,
    c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals
  
  let t = thousands_sep == undefined ? ',' : thousands_sep,
    s = n < 0 ? '-' : ''
  let i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + '',
    // @ts-ignore
    j: number = (j = i.length) > 3 ? j % 3 : 0
  
  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t)
}

export function goBack() {
  window.history.back()
}

export function goBack2() {
  window.history.go(-2)
}

export function format_slice(str: number) {
  if (str === 0) {
    return str
  } else {
    return str.toFixed(1)
  }
}

export function getLocalDateTime(_date: number | string, format: 'dd_mm_yyyy' | 'dd/mm/yyyy' | 'dd-mm-yyyy' | 'dd-mm-yyyy, hh:m_m:ss' | 'dd/mm/yyyy, hh:m_m:ss' | 'yyyy-mm-dd hh:m_m:ss' | 'yyyy-mm-dd') {
  const date = new Date(_date)
  const D = date.getDate()
  const H = date.getHours()
  const m_m = date.getMinutes()
  const S = date.getSeconds()
  const M = date.getMonth() + 1
  
  const dd = D < 10 ? '0' + D : D
  const hh = H < 10 ? '0' + H : H
  const mm = M < 10 ? '0' + M : M
  const min = m_m < 10 ? '0' + m_m : m_m
  const ss = S < 10 ? '0' + S : S
  const yyyy = date.getFullYear()
  
  let result: string = format
  result = result.replace('D', D.toString())
  result = result.replace('M', M.toString())
  result = result.replace('dd', dd.toString())
  result = result.replace('mm', mm.toString())
  result = result.replace('yyyy', yyyy.toString())
  result = result.replace('hh', hh.toString())
  result = result.replace('m_m', min.toString())
  result = result.replace('ss', ss.toString())
  
  return _date ? result : ''
}

export function slug(value: string) {
  let str = value ?? 'detail'
  // Chuyển hết sang chữ thường
  str = str.toLowerCase()
  
  // xóa dấu
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
  str = str.replace(/(đ)/g, 'd')
  
  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, '')
  
  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, '-')
  
  // xóa phần dự - ở đầu
  str = str.replace(/^-+/g, '')
  
  // xóa phần dư - ở cuối
  str = str.replace(/-+$/g, '')
  
  // return
  return str
}

export function convertDate(timestamp: number) {
  let months_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  let date = new Date(timestamp * 1000)
  let year = date.getFullYear()
  let month = months_arr[date.getMonth()]
  let day = date.getDate()
  let convdataTime = day + ' thg ' + month + ', ' + year
  return convdataTime
}

export function convertDatetime(timestamp: number) {
  let months_arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  let date = new Date(timestamp * 1000)
  let year = date.getFullYear()
  let month = months_arr[date.getMonth()]
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = '0' + date.getMinutes()
  let convdataTime = day + ' thg ' + month + ', ' + year + ' - ' + hours + ':' + minutes.substr(-2)
  return convdataTime
}

export function formatNumberPhone(number_phone: string) {
  return number_phone.replace(/(^(?:\d{2}))?(\d{3})(?=(?:\d{5})+$)/g, '$1.$2.')
}

export function convertToLocalDate(utcTime: any) {
  const time: number = new Date(utcTime).getTime() / 1000 + 7 * 60 * 60
  return convertDatetime(time)
}

export function convertToLocalDate2(utcTime: any) {
  const time: number = new Date(utcTime).getTime() / 1000
  return convertDatetime(time)
}

export function timeAccept(utcTime: any) {
  const time: number = new Date(utcTime).getTime() / 1000 + 7 * 60 * 60 + 2 * 24 * 60 * 60
  return convertDatetime(time)
}

export function convertToDate(utcTime: any) {
  const time: number = new Date(utcTime).getTime() / 1000 + 7 * 60 * 60
  return convertDate(time)
}

export function mentionTime(utcTime: any) {
  const time: number = new Date(utcTime).getTime() / 1000 + 7 * 60 * 60 + 4 * 24 * 60 * 60
  return convertDatetime(time)
}

export const numberWithCommas = (x: any) => {
  x = x.toString().replace(/[.]/g, '')
  let pattern = /(-?\d+)(\d{3})/
  while (pattern.test(x)) {
    x = x.replace(pattern, '$1.$2')
  }
  return x
}

export function countJoinDate(time: number) {
  const createdAt = new Date(time).getTime()
  const now = new Date().getTime()
  const distance = now - createdAt
  let days = Math.floor(distance / (1000 * 60 * 60 * 24))
  if (days < 1) {
    return 'Today'
  }
  if (days >= 1 && days < 30) {
    return days + (days == 1 ? ' day' : ' days') + ' ago'
  }
  if (days > 30 && days < 365) {
    let month = Math.floor(days / 30)
    return month + (month == 1 ? ' month' : ' months') + ' ago'
  }
  if (days >= 365) {
    let year = Math.floor(days / 365)
    return year + (year == 1 ? ' year' : ' years') + ' ago'
  }
}

export function localDateTime(dateTimeString: string) {
  if (dateTimeString == '' || dateTimeString == undefined) {
    return ''
  }
  let dateTime = new Date(dateTimeString)
  return dateTime.toLocaleString()
}

export function localDate(dateTimeString: string) {
  if (dateTimeString == '' || dateTimeString == undefined) {
    return ''
  }
  let dateTime = new Date(dateTimeString)
  return dateTime.toLocaleDateString()
}

export function getToDay(): Date {
  return new Date()
}

export function parserDateFromSecond(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function parserDateFromMiliSecond(timestamp: number): Date {
  return new Date(timestamp)
}

export function validateInput(event: any) {
  const test = '`~!@#$%^&*()_+-={}[]:;"<>?,./'
  const key = event.key
  
  if (test.indexOf(key) !== -1 || key == "'") {
    event.preventDefault()
  }
}

export function areObjectsDifferentDeep(obj1: { [x: string]: any } | null, obj2: { [x: string]: any } | null) {
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return obj1 !== obj2 // So sánh trực tiếp cho các giá trị nguyên thủy
  }
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) {
    return true // Số lượng key khác nhau
  }
  
  for (const key of keys1) {
    // So sánh giá trị của từng key
    if (!keys2.includes(key) || areObjectsDifferentDeep(obj1[key], obj2[key])) {
      return true
    }
  }
  
  return false // Không có sự khác biệt
}

export function countObjects(arr: string | any[]) {
  let count = arr.length // Bắt đầu với số lượng object cha
  for (const item of arr) {
    // Kiểm tra nếu có vehicleLoadTransfers
    if (item.vehicleLoadTransfers) {
      count += item.vehicleLoadTransfers.length
    }
  }
  return count
}

export function debounce(func: (arg0: any) => void, delay: number | undefined) {
  let timeout: string | number | NodeJS.Timeout | undefined;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // @ts-ignore
      func(...args);
    }, delay);
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  const currency = i18n.t('currency')
  return new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat(i18n.language).format(num);
}

export function formatData(mb: number, decimal = 1) {
  const gb = mb / 1024;
  return Number.isInteger(gb) ? gb.toString() : gb.toFixed(decimal);
}

export const getRandomAvatar = () => {
  const DEFAULT_AVATARS = [
    '/assets/images/avatar_1.svg',
    '/assets/images/avatar_2.svg',
    '/assets/images/avatar_3.svg',
    '/assets/images/avatar_4.svg',
  ]
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)]
}
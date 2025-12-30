import {makeAutoObservable} from "mobx"
import {toastUtil} from "@/utils/toastUtil.ts";
import {orderService} from "@/services/orderService.ts";

export interface Transaction {
  id: string
  status: "ALL" | "COMPLETED" | "PROCESSING" | "CANCEL" | "PAID"
  name: string
  orderId: string
  code: string
  createdAt: number
  paymentState: "ALL" | "COMPLETED" | "PROCESSING" | "CANCEL" | "PAID"
  paidAt: number
  totalPrice: number
  vnTotalPrice: number
  vnCurrency: vnCurrency
  productGroupImageUrls: string[]
}

export interface vnCurrency {
  id: string
  name: string
  code: string
  symbol: string
}

export interface OrderDetail {
  id: string
  code: string
  paymentState: "ALL" | "COMPLETED" | "PROCESSING" | "CANCEL" | "PAID"
  paymentMethod: string
  name: string
  phoneNumber: string
  email: string
  totalPrice: number
  groups: orderProductGroup[]
  originalPrice: number
  minusPrice: number
  vouchers: any
}

export interface orderProductGroup {
  id: string
  name: string
  productId: string
  productGroupId: string
  productGroupTitle: string
  quantity: number
  price: number
  status: string
  imageUrl: string
  items: orderItems[]
  carriers: CarrierList[]
  capacityToDays: CapacityToDays[]
  dayToCapacities: DayToCapacities[]
}


export interface CarrierList {
  id: string,
  name: string,
  regionCode: string,
  imageUrl: string,
  status: "ACTIVE" | "INACTIVE",
  types: string
  createdAt: number,
  updatedAt: number,
}

export interface orderItems {
  title: string
  iccid: string
  lpa: string
  imsis: string
  qrcode: string
  qrcodeUrl: string
  isRoaming: boolean
  msisdn: string
  price: number
  quantity: number
  status: number
  validity: number
  dataAmount: number
  usage: Usage
  smdpPlus: string
  activationCode: string
}

export interface Usage {
  expiredAt: any
  isUnlimited: boolean
  remaining: number
  remainingText: number
  remainingVoice: number
  status: string
  total: number
  totalText: number
  totalVoice: number
}

export interface Capacity {
  dataAmount: string
  sms: number
  voice: number
  isUnlimited: boolean
  data: string
}

export interface CapacityToDays {
  capacity: Capacity
  days: number[]
}

export interface DayToCapacities {
  day: number
  capacities: Capacity[]
}

class OrderStore {
  isLoading = false
  isLoadingMore = false
  isLoadingDetail = false
  page = 0
  totalPages = 0
  orderList: Transaction[] = []
  orderDetail: OrderDetail = {
    id: "",
    code: "",
    paymentState: "ALL",
    paymentMethod: "",
    name: "",
    phoneNumber: "",
    email: "",
    totalPrice: 0,
    originalPrice: 0,
    minusPrice: 0,
    groups: [],
    vouchers: null
  }
  startDate: any | null = null
  endDate: any | null = null
  paymentState: string = ""
  
  constructor() {
    makeAutoObservable(this)
  }
  
  getOrders = async () => {
    this.page = 0
    this.isLoading = true
    const result = await orderService.getOrders(this.page)
    this.isLoading = false
    if (result.status === 200) {
      this.orderList = result.data.content
      this.totalPages = result.data.totalPages
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  getOrdersMore = async () => {
    this.isLoadingMore = true
    const result = await orderService.getOrders(this.page)
    this.isLoadingMore = false
    if (result.status === 200) {
      this.orderList = this.orderList.concat(result.data.content)
      this.totalPages = result.data.totalPages
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  getOrderDetail = async (id: string | undefined) => {
    this.isLoadingDetail = true
    const result = await orderService.getDetailOrder(id)
    this.isLoadingDetail = false
    if (result.status === 200) {
      this.orderDetail = result.data
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  getSimStatus = async (iccid: string) => {
    const result = await orderService.getSimStatus(iccid)
    if (result.status === 200) {
      return result.data
    }
  }
  
}

export const orderStore = new OrderStore()

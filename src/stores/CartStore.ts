import {makeAutoObservable} from "mobx"
import {cartService} from "@/services/cartService.ts";
import {toastUtil} from "@/utils/toastUtil.ts";
import i18n from "i18next";

export interface CartItem {
  productVariantId: number | undefined
  productId: string | undefined
  sellingPrice: number | null
  quantity: number | null
  dataAmount: number
  data: string
  validityDays: number
  sms: number
  voice: number
  productImageUrl: string
  productTitle: string
  productGroupImageUrl: string
  productGroupTitle: string
}

export interface DataVoucher {
  code: string,
  detail: string,
  value: number
}

export interface CartCheckoutItem {
  productGroupId: number
  productGroupImageUrl: string
  productGroupTitle: string
  productId: number
  productImageUrl: string
  productTitle: string
  items: CartItem[]
}

export interface DataCheckout {
  originalPrice: number
  totalPrice: number
  minusPrice: number
  milesEarned: number
  voucher: DataVoucher | null
  productInfos: CartCheckoutItem[]
}

class CartStore {
  isLoading = false
  isLoadingButton = false
  items: CartItem[] = []
  itemRush: CartItem | null = null
  dataCheckout: DataCheckout | null = null
  itemsCheckout: CartCheckoutItem[] = []
  voucherCheckout: DataVoucher | null = null
  isCheckoutWithVoucher = false
  voucherCode: any = null
  voucherSuccess = false
  
  constructor() {
    makeAutoObservable(this)
    this.loadCartFromStorage()
  }
  
  getCart = async () => {
    const result = await cartService.getCart()
    if (result.status === 200) {
      this.items = result.data.items || []
    } else {
      this.items = []
      toastUtil.error(result.data.message, 99)
    }
    this.saveCartToStorage()
  }
  
  getCheckout = async (sign?: any, voucherCode?: string, email?: string) => {
    this.voucherSuccess = false
    const result = await cartService.getCheckout(this.itemRush, sign, voucherCode, email)
    if (voucherCode) {
      this.isCheckoutWithVoucher = true
    } else {
      this.isCheckoutWithVoucher = false
    }
    if (result.status === 200) {
      if (voucherCode && !this.voucherCheckout) {
        toastUtil.success(i18n.t('payment.voucherSuccess'), 99)
      }
      this.dataCheckout = result.data
      this.itemsCheckout = result.data.productInfos || []
      this.voucherCheckout = result.data.voucher || null
      this.voucherCode = this.voucherCheckout?.code || ""
      if (this.voucherCode) {
        this.isCheckoutWithVoucher = true
        this.voucherSuccess = true
      }
    } else {
      // this.itemsCheckout = []
      this.voucherSuccess = false
      this.voucherCheckout = null
      toastUtil.error(result.data.message, 98)
    }
    this.saveCartToStorage()
  }
  
  addItem = async (variantId: number | undefined, productId: string | undefined, price: number | null, quantity: number | null, sign?: any) => {
    const data: any = {
      id: '',
      item: {
        "productVariantId": variantId,
        "productId": productId,
        "sellingPrice": price,
        "quantity": quantity
      },
      guestId: localStorage.getItem("wii-guestId") || ""
    }
    this.isLoadingButton = true
    const result = await cartService.addToCart(data, sign)
    this.isLoadingButton = false
    if (result.status === 200) {
      toastUtil.success(i18n.t('cart.addCartSuccess'), 99)
      await this.getCart()
    } else {
      toastUtil.error(result.data.message, 99)
    }
    this.saveCartToStorage()
  }
  
  updateItem = async (sign?: any) => {
    const data: any = this.items
    
    this.isLoadingButton = true
    const result = await cartService.updateCart(data, sign)
    this.isLoadingButton = false
    if (result.status === 200) {
      await this.getCart()
    } else {
      toastUtil.error(result.data.message, 99)
    }
    
    this.saveCartToStorage()
  }
  
  mergeCart = async (sign?: any) => {
    const result = await cartService.mergeCart(sign)
    if (result.status === 200) {
    } else {
    }
  }
  
  createOrder = async (name: string, phoneNumber: string, email: string, voucherCode: string, sign?: any, isRush?: boolean, note?: string) => {
    const data: any = {
      products: isRush ? [this.itemRush] : this.items,
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      note: note || "",
      guestId: localStorage.getItem("wii-guestId") || "",
      isRush: isRush || false,
      voucherCode: this.voucherCheckout?.code || voucherCode
    }
    
    this.isLoadingButton = true
    const result = await cartService.createOrder(data, sign)
    this.isLoadingButton = false
    if (result.status === 200) {
      window.location.href = result.data
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  get totalItems() {
    return this.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0
  }
  
  get totalPrice() {
    // For simplicity, let's assume a fixed price for now or calculate based on product data
    // In a real app, you'd fetch/calculate the price based on selected capacity/duration
    return this.items.reduce((total, item) => total + (item.sellingPrice ?? 0) * (item.quantity ?? 0), 0)
  }
  
  private saveCartToStorage = () => {
    localStorage.setItem("cart", JSON.stringify(this.items))
  }
  
  private loadCartFromStorage = () => {
    // const savedCart = localStorage.getItem("cart")
    // if (savedCart) {
    //   this.items = JSON.parse(savedCart)
    // } else return
  }
}

export const cartStore = new CartStore()

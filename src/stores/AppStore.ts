import {makeAutoObservable} from "mobx"
import {appService} from "@/services/appService.ts";
import {toastUtil} from "@/utils/toastUtil.ts";

export interface Profile {
  id: string,
  username: string,
  displayName: string
  avatar: string
  phoneNumber: string
  email: string
}

export interface CategoryList {
  id: string,
  name: string,
  productGroups: ProductGroupList[]
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
  regionFlag: string,
  regionName: string,
}

export interface ProductGroupList {
  id: string,
  carriers: CarrierList[]
  channelId: string,
  title: string,
  imageUrl: string,
  status: "ACTIVE" | "INACTIVE",
  channelProductStatus: string,
  regions: {
    id: string,
    code: string,
    name: string,
    imageUrl: string,
    createdAt: number,
    updatedAt: number
  }
  capacityToDays: CapacityToDays[]
  dayToCapacities: DayToCapacities[]
  variants: EsimProductVariant[]
  minPrice: number
  vnMinPrice: number
  lowestPrice: number
  vnLowestPrice: number
  highestPrice: number
  vnHighestPrice: number
  localCurrency: LocalCurrency
  vnCurrency: LocalCurrency
  packageType: string
}

export interface LocalCurrency {
  id: string
  code: string
  name: string
  symbol: string
}

export interface ListProductGroupByCategory {
  id: string
  name: string,
  productGroups: ProductGroupList[]
}

export interface ProductGroupDetail {
  product: ProductGroupList[]
  productGroup: any
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

export interface EsimProductVariant {
  id: number
  code: string
  productId: number
  title: string
  description: string | null
  qrInstallation: string | null
  manualInstallation: string | null
  dataAmount: number // in MB
  sms: number
  voice: number
  data: string // e.g., "5 GB"
  validityDays: number
  netPrice: number
  minPrice: number
  sellingPrice: number // This is the price we need
  minusPrice: number
  markupPercentage: number | null
  isUnlimited: boolean
  status: string
  channelProductVariantStatus: string
  isFairUsagePolicy: boolean
  fairUsagePolicy: string
}

export interface Deviceslist {
  id: string
  model: string
  osType: string
  brand: string
  name: string
}

class AppStore {
  isLoading = false
  isLocal: any = false
  keySearch = ""
  listPopular: ProductGroupList[] = []
  listCategory: CategoryList[] = []
  listCategorySearch: CategoryList[] = []
  listProductGroupByCategory: ListProductGroupByCategory = {
    id: "",
    name: "",
    productGroups: []
  }
  productGroupDetail: ProductGroupDetail | null = {
    product: [],
    productGroup: {},
  }
  activeEsimProductId: string | null = ""
  infoProduct: ProductGroupList | undefined
  profile: Profile | null = null
  devicesList: Deviceslist[] | null = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  getProfile = async () => {
    const result = await appService.getProfile()
    if (result.status === 200) {
      this.profile = result.data
    } else {
      this.profile = null
    }
  }
  
  getAllCategory = async () => {
    this.isLoading = true
    const result = await appService.getAllCategory()
    this.isLoading = false
    if (result.status === 200) {
      console.log(result.data)
      if (this.isLocal === null) {
        this.listPopular = result.data.data.map((item: { productGroup: ProductGroupList }) => item.productGroup);
        console.log(this.listPopular)
      } else {
        this.listCategory = result.data
      }
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  searchProduct = async () => {
    this.isLoading = true
    const result = await appService.searchProduct(this.keySearch)
    this.isLoading = false
    if (result.status === 200) {
      this.listCategorySearch = result.data
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  getAllGroupByCategory = async (id: string | undefined) => {
    this.isLoading = true
    const result = await appService.getAllGroupByCategory(id)
    this.isLoading = false
    if (result.status === 200) {
      this.listProductGroupByCategory = result.data
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  getProductGroupDetail = async (id: string | undefined) => {
    this.isLoading = true
    const result = await appService.getProductGroupDetail(id)
    this.isLoading = false
    if (result.status === 200) {
      this.productGroupDetail = result.data
    } else {
      this.productGroupDetail = null
    }
  }
  
  getDevicesList = async () => {
    const result = await appService.getDeviceCompatible()
    if (result.status === 200) {
      this.devicesList = result.data
    } else {
      this.devicesList = null
    }
  }
}

export const appStore = new AppStore()

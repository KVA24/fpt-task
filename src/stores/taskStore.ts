import {makeAutoObservable} from "mobx"
import {appService} from "@/services/taskService.ts";
import {toastUtil} from "@/utils/toastUtil.ts";

export interface WalletItem {
  id: string
  code: string
  name: string | null
  balance: number
  expiredAt: string | null
  lastGranted: string | null
}

export interface WalletMap {
  [walletCode: string]: WalletItem
}

export interface Profile {
  userId: string
  externalId: string
  displayName: string
  avatarUrl: string | null
  msisdn: string | null
  wallet: WalletMap
}

export interface CategoryList {
  id: string,
  name: string,
  sort: number
}

export interface TaskItem {
  id: number | null
  name: string
  rewardAmount: number
  taskCategoryId: number
  deepLink: string
  description: string
  position: number
  imageId: string
  isCompleted: boolean
  completedAt: string | null
  expiredTime: string | null
  rewardSuccess: boolean
}


class TaskStore {
  isLoading = false
  profile: Profile | null = null
  listCategory: CategoryList[] = []
  listTask: TaskItem[] = []
  
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
      this.listCategory = result.data.data
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  getAllTask = async () => {
    this.isLoading = true
    const result = await appService.getAllTask()
    this.isLoading = false
    if (result.status === 200) {
      console.log(result.data)
      this.listTask = result.data.data
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  filterTasksByCategoryId = (
    taskCategoryId: number
  ): TaskItem[] => {
    return this.listTask.filter(task => task.taskCategoryId === taskCategoryId)
  }
}

export const taskStore = new TaskStore()

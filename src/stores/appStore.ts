import {makeAutoObservable} from "mobx"
import {appService} from "@/services/appService.ts";
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


export enum RankType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY"
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  externalId: string
  displayName: string
  avatarUrl: string
  score: number
}

export interface LeaderboardResponse {
  period: RankType
  periodStart: string
  periodEnd: string
  entries: LeaderboardEntry[]
  totalUsers: number
}

class AppStore {
  isAuthentication = false
  isLoading = false
  profile: Profile | null = null
  listCategory: CategoryList[] = []
  listTask: TaskItem[] = []
  rankType: RankType = RankType.WEEKLY
  leaderBoardResponse: LeaderboardResponse | null = null
  leaderBoard: LeaderboardEntry[] | null = []
  leaderBoardMe: LeaderboardEntry[] | null = []
  
  constructor() {
    makeAutoObservable(this)
  }
  
  getProfile = async () => {
    const result = await appService.getProfile()
    if (result.status === 200) {
      this.isAuthentication = true
      this.profile = result.data
    } else {
      this.isAuthentication = false
      this.profile = null
    }
  }
  
  getAllCategory = async () => {
    this.isLoading = true
    const result = await appService.getAllCategory()
    this.isLoading = false
    if (result.status === 200) {
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
      this.listTask = result.data.data
    } else {
      toastUtil.error(result.data.message, 99)
    }
  }
  
  filterTasks = (
    taskCategoryId: number
  ): TaskItem[] => {
    if (taskCategoryId === -1) {
      return this.listTask
    } else {
      return this.listTask.filter(task => task.taskCategoryId === taskCategoryId)
    }
  }
  
  getLeaderBoard = async (isMe?: boolean) => {
    this.isLoading = true
    const result = await appService.getLeaderBoard(this.rankType)
    this.isLoading = false
    if (result.status === 200) {
      this.leaderBoardResponse = result.data.data
      if (isMe) {
        this.leaderBoardMe = result.data.data
      } else {
        this.leaderBoard = result.data.data.entries
      }
      console.log(this.leaderBoardResponse)
      console.log(this.leaderBoard)
    } else {
      this.leaderBoard = null
      this.leaderBoardMe = null
      toastUtil.error(result.data.message, 99)
    }
  }
}

export const appStore = new AppStore()

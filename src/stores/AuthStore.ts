import {makeAutoObservable} from "mobx"

export interface User {
  id: string
  email: string
  name: string
  password?: string
  avatar?: string
  phone?: string
  address?: string
  birthday?: string
  gender?: "male" | "female" | "other"
  role?: "admin" | "user"
  isOnline?: boolean
  isVerified?: boolean
  isBlocked?: boolean
}

class AuthStore {
  user: User | null = null
  isLoading = false
  isAuthenticated = false
  
  constructor() {
    makeAutoObservable(this)
    this.getProfile()
    this.loadUserFromStorage()
  }
  
  getProfile = () => {
    return this.user
  }
  
  login = async (email: string, password: string): Promise<boolean> => {
    this.isLoading = true
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const user: User = {
        id: "1",
        email,
        name: "User Name",
        password
      }
      
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem("user", JSON.stringify(user))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      this.isLoading = false
    }
  }
  
  logout = () => {
    this.user = null
    this.isAuthenticated = false
    localStorage.removeItem("user")
  }
  
  private loadUserFromStorage = () => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      this.user = JSON.parse(savedUser)
      this.isAuthenticated = true
    }
  }
}

export const authStore = new AuthStore()

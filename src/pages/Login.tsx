"use client"

import type React from "react"
import {useState} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {stores} from "@/stores"

const Login: React.FC = observer(() => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {authStore} = stores
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await authStore.login(email, password)
    if (success) {
      navigate("/")
    }
  }
  
  return (
    <div
      className="mobile-container flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-blue-500">🌐Infi</span>
            <span className="text-green-500">Gate</span>
          </h1>
          <p className="text-gray-600">Đăng nhập để tiếp tục</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t("auth.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="example@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t("auth.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={authStore.isLoading}
              className="w-full bg-gradient-to-l from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authStore.isLoading ? (
                <div className="flex items-center justify-center">
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                t("auth.login")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
})

export default Login

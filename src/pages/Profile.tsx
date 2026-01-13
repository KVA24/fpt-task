"use client"

import React, {useEffect, useMemo} from "react"
import {observer} from "mobx-react-lite"
import {appStore, TabProfile} from "@/stores/appStore"
import BottomNavigation from "@/components/BottomNavigation"
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {getRandomAvatar} from "@/utils/utils.ts";
import {InfoIcon} from "lucide-react"

const Profile: React.FC = observer(() => {
  const {t} = useTranslation()
  
  useEffect(() => {
    if (!appStore.profile) {
      appStore.getProfile().then()
    }
    if (appStore.listCategory.length === 0) {
      appStore.getAllCategory().then()
    }
    if (appStore.listTask.length === 0) {
      appStore.getAllTask().then()
    }
  }, [])
  
  const profile = appStore.profile
  const wallet = profile?.wallet || {}
  
  const fPoint = wallet["F-POINT"]?.balance || 0
  const love = wallet["LOVE"]?.balance || 0
  
  const getCategoryProgress = (categoryId: string | number) => {
    const tasksInCategory = appStore.listTask.filter((task) => {
      const taskCatId = typeof categoryId === "string" ? Number.parseInt(categoryId) : categoryId
      return task.taskCategoryId === taskCatId
    })
    const completed = tasksInCategory.filter((task) => task.isCompleted).length
    return {
      completed,
      total: tasksInCategory.length,
      percentage: tasksInCategory.length > 0 ? (completed / tasksInCategory.length) * 100 : 0,
    }
  }
  
  const getButtonStatus = (categoryId: string | number) => {
    const progress = getCategoryProgress(categoryId)
    return progress.completed === progress.total && progress.total > 0
  }
  
  const getStatusButtonClass = (isCompleted: boolean) => {
    if (isCompleted) {
      return "bg-green-300 text-green-600 shadow-md"
    }
    return "bg-[#E07B5A] text-white"
  }
  
  const getStatusButtonText = (isCompleted: boolean) => {
    if (isCompleted) {
      return "Đã thực hiện"
    }
    return "Thực hiện"
  }
  
  const tabs = [
    {
      id: "task",
      label: t("navigation.tasks"),
    },
    {
      id: "history",
      label: t("navigation.historyProfile"),
    },
    {
      id: "reward",
      label: t("navigation.reward"),
    },
  ]
  
  const handleBackApp = () => {
    window.location.href = "lotusmiles://backScreen"
  }
  
  const avatarUrl = useMemo(() => getRandomAvatar(), [])
  
  return (
    <div className="mobile-container flex flex-col h-screen overflow-hidden">
      <header
        className="z-50 w-full flex items-center justify-between px-4 bg-[url('/assets/images/bg-profile.svg')] bg-cover bg-center bg-no-repeat border-b border-gray-100 h-[100px] max-w-[428px] flex-shrink-0">
        
        <Link to={"/"} className="flex items-center gap-2">
          <img src="/assets/icon/fpt_logo.svg" alt="Logo" className="w-[141px] h-[44px]"/>
        </Link>
        
        <button onClick={handleBackApp}
                className="pl-2 transition-colors"
                aria-label={t("common.close")}>
          <img src="/assets/icon/close.svg" alt="Close"/>
        </button>
      </header>
      <div className="flex flex-col items-center justify-center w-full space-y-2 z-50 mt-[-40px]">
        <img
          src={appStore.profile?.avatarUrl || avatarUrl}
          alt="avatar"
          className="w-20 h-20 object-cover"
          onError={(e) => {
            e.currentTarget.src = avatarUrl
          }}
        />
        <span className="text-h5 font-semibold">{appStore.profile?.displayName}</span>
        <span className="text-body3 text-gray-500">UserId: {appStore.profile?.msisdn || "---"}</span>
        <div className="w-full bg-white p-4 py-0">
          <div className="grid grid-cols-3 gap-4">
            {/* Thành viên */}
            <div className="flex flex-col items-center p-2 shadow-[inset_0_4px_8px_#2970ff80] rounded-t-md">
              <div className="flex items-center gap-1">
                <span className="text-body2 font-medium text-gray-800">Hạng</span>
                <InfoIcon size={20} className={"text-blue-600"}/>
              </div>
              <span className="text-body2 font-medium text-gray-800">-</span>
            </div>
            
            {/* F-Point */}
            <div className="flex flex-col items-center p-2 shadow-[inset_0_4px_8px_#ff730080] rounded-t-md">
              <span className="text-xs text-gray-500 mb-1">F-Point</span>
              <div className="flex items-center gap-1">
                <img src="/assets/icon/FPoint.svg" alt="FPoint" className="w-5 h-5"/>
                <span className="text-body2 font-medium text-gray-800">{fPoint}</span>
              </div>
            </div>
            
            {/* Love */}
            <div className="flex flex-col items-center p-2 shadow-[inset_0_4px_8px_#ee63c480] rounded-t-md">
              <span className="text-xs text-gray-500 mb-1">Diamonds</span>
              <div className="flex items-center gap-1">
                <img src="/assets/icon/diamond.svg" alt="Diamond" className="w-5 h-5"/>
                <span className="text-body2 font-medium text-gray-800">{love}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gray-50">
        {/* User Stats Section */}
        <nav
          className="sticky top-0 w-full max-w-[428px] h-12 bg-white flex-shrink-0">
          <div className="flex h-full">
            {tabs.map((tab) => {
              const isActive = appStore.tabProfile === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    appStore.tabProfile = tab.id
                  }}
                  className={`flex-1 flex flex-col items-center justify-center px-2 transition-all duration-200 relative
                ${appStore.tabProfile === tab.id
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
                  }
                >
                  <span className="text-xs font-medium mt-1">{tab.label}</span>
                  
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-600 rounded-t-full"/>
                  )}
                </button>
              )
            })}
          </div>
        </nav>
        
        {appStore.tabProfile === TabProfile.task && (
          <div className="px-4 py-4 space-y-3">
            {appStore.listCategory.map((category) => {
              const progress = getCategoryProgress(category.id)
              const isCompleted = getButtonStatus(category.id)
              
              return (
                <div key={category.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-2">
                  <div className="flex items-center gap-3 border-b-2 pb-4 border-dashed">
                    <img src="/assets/icon/badge.svg" alt="Zap" className="w-6 h-6"/>
                    <h3 className="text-body2 font-medium text-gray-900 flex-1 pt-1">{category.name}</h3>
                  </div>
                  
                  {/* Progress Text */}
                  <div className="flex items-center justify-between">
                    <p className="text-body4 text-gray-800">
                      Đã hoàn thành {progress.completed} / {progress.total}
                    </p>
                    
                    <button
                      className={`px-2 py-2 rounded-xl text-body3 font-medium transition-colors button-bg ${getStatusButtonClass(isCompleted)}`}
                    >
                      {getStatusButtonText(isCompleted)}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {appStore.tabProfile === TabProfile.history && (
          <div className="px-4 py-4 space-y-3">
            {appStore.listCategory.map((category) => {
              const progress = getCategoryProgress(category.id)
              const isCompleted = getButtonStatus(category.id)
              
              return (
                <div key={category.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-2">
                  <div className="flex items-center gap-3 border-b-2 pb-4 border-dashed">
                    <img src="/assets/icon/badge.svg" alt="Zap" className="w-6 h-6"/>
                    <h3 className="text-body2 font-medium text-gray-900 flex-1 pt-1">{category.name}</h3>
                  </div>
                  
                  {/* Progress Text */}
                  <div className="flex items-center justify-between">
                    <p className="text-body4 text-gray-800">
                      Đã hoàn thành {progress.completed} / {progress.total}
                    </p>
                    
                    <button
                      className={`px-2 py-2 rounded-xl text-body3 font-medium transition-colors button-bg ${getStatusButtonClass(isCompleted)}`}
                    >
                      {getStatusButtonText(isCompleted)}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {appStore.tabProfile === TabProfile.reward && (
          <div className="px-4 py-4 space-y-3">
            {appStore.listCategory.map((category) => {
              const progress = getCategoryProgress(category.id)
              const isCompleted = getButtonStatus(category.id)
              
              return (
                <div key={category.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-2">
                  <div className="flex items-center gap-3 border-b-2 pb-4 border-dashed">
                    <img src="/assets/icon/badge.svg" alt="Zap" className="w-6 h-6"/>
                    <h3 className="text-body2 font-medium text-gray-900 flex-1 pt-1">{category.name}</h3>
                  </div>
                  
                  {/* Progress Text */}
                  <div className="flex items-center justify-between">
                    <p className="text-body4 text-gray-800">
                      Đã hoàn thành {progress.completed} / {progress.total}
                    </p>
                    
                    <button
                      className={`px-2 py-2 rounded-xl text-body3 font-medium transition-colors button-bg ${getStatusButtonClass(isCompleted)}`}
                    >
                      {getStatusButtonText(isCompleted)}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default Profile

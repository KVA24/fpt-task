"use client"

import type React from "react"
import {useTranslation} from "react-i18next"
import {useLocation, useNavigate} from "react-router-dom"

const BottomNavigation: React.FC = () => {
  const {t} = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  
  const tabs = [
    {
      id: "tasks",
      label: t("navigation.tasks"),
      icon: <img src="/assets/icon/bottom_chip.png" alt="tasks" className="w-6 h-6"/>,
      iconActive: <img src="/assets/icon/bottom_chip-active.png" alt="tasks" className="w-6 h-6"/>,
      path: "/",
    },
    {
      id: "leaderboard",
      label: t("navigation.leaderboard"),
      icon: <img src="/assets/icon/bottom_order.png" alt="leaderboard" className="w-6 h-6"/>,
      iconActive: <img src="/assets/icon/bottom_order-active.png" alt="leaderboard" className="w-6 h-6"/>,
      path: "/history",
    },
    {
      id: "profile",
      label: t("navigation.profile"),
      icon: <img src="/assets/icon/bottom_profile.png" alt="Profile" className="w-6 h-6"/>,
      iconActive: <img src="/assets/icon/bottom_profile-active.png" alt="Profile" className="w-6 h-6"/>,
      path: "/profile",
    },
  ]
  
  return (
    <nav
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-white border-t border-gray-200 shadow-lg">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center py-3 px-2 transition-all duration-200 relative ${
                isActive ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isActive ? tab.iconActive : tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-t-full"></div>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation

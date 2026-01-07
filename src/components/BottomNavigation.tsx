"use client"

import React from "react"
import {useTranslation} from "react-i18next"
import {NavLink} from "react-router-dom"

const BottomNavigation: React.FC = () => {
  const {t} = useTranslation()
  
  const tabs = [
    {
      id: "tasks",
      label: t("navigation.tasks"),
      icon: <img src="/assets/icon/mission.svg" alt="tasks" className="w-6 h-6"/>,
      iconActive: <img src="/assets/icon/mission-active.svg" alt="tasks" className="w-6 h-6"/>,
      path: "/",
    },
    {
      id: "leaderboard",
      label: t("navigation.leaderboard"),
      icon: <img src="/assets/icon/rank.svg" alt="leaderboard" className="w-6 h-6"/>,
      iconActive: <img src="/assets/icon/rank-active.svg" alt="leaderboard" className="w-6 h-6"/>,
      path: "/rank",
    },
    {
      id: "profile",
      label: t("navigation.profile"),
      icon: <img src="/assets/icon/profile.svg" alt="Profile" className="w-6 h-6"/>,
      iconActive: <img src="/assets/icon/profile-active.svg" alt="Profile" className="w-6 h-6"/>,
      path: "/profile",
    },
  ]
  
  return (
    <nav
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[428px] bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({isActive}) =>
              `flex-1 flex flex-col items-center py-3 px-2 transition-all duration-200 relative
                ${isActive
                ? "text-primary-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
            }
          >
            {({isActive}) => (
              <>
                {isActive ? tab.iconActive : tab.icon}
                <span className="text-xs font-medium">{tab.label}</span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-600 rounded-t-full"/>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation

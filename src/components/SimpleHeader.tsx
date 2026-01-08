"use client"

import type React from "react"
import {ChevronLeft} from "lucide-react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {observer} from "mobx-react-lite"

interface SimpleHeaderProps {
  title: string
  noBack?: boolean
  noFilter?: boolean
  noCart?: boolean
  noClose?: boolean
  noHome?: boolean
  onClickFilter?: () => void
}

const SimpleHeader: React.FC<SimpleHeaderProps> = observer(({
                                                              title,
                                                              noBack,
                                                              noFilter,
                                                              noClose,
                                                              noHome,
                                                              onClickFilter
                                                            }) => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  
  const handleBack = () => {
    navigate(-1)
  }
  
  const handleBackApp = () => {
    window.location.href = "lotusmiles://backScreen"
  }
  
  return (
    <header
      className="z-50 w-full flex items-center justify-between px-4 bg-gradient-to-l from-[#BF5435] to-[#FF9070] border-b border-gray-100 h-[70px] max-w-[428px] flex-shrink-0">
      <div className="flex items-center gap-2">
        {!noBack && (
          <button onClick={handleBack}
                  className="flex items-center text-primary-600 transition-colors gap-2">
            <ChevronLeft size={24} className="mr-1 text-white"/>
          </button>
        )}
        <h1 className="text-lg font-semibold text-white flex-grow text-center">{title}</h1>
      </div>
      
      <div className="flex items-center">
        {!noFilter && (
          <button
            onClick={onClickFilter}
            className="p-2 rounded-full transition-colors"
            aria-label={t("common.search")}
          >
            <img src="/assets/icon/filter.svg" alt="Search"/>
          </button>
        )}
        
        {!noClose && (
          <button onClick={handleBackApp}
                  className="pl-2 transition-colors border-l border-white"
                  aria-label={t("common.close")}>
            <img src="/assets/icon/close.svg" alt="Close"/>
          </button>
        )}
        
        {!noHome && (
          // <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label={t("common.home")}>
          //   <HouseIcon size={20} onClick={() => navigate("/")} className="text-gray-500"/>
          // </button>
          <></>
        )}
      </div>
    </header>
  )
})

export default SimpleHeader

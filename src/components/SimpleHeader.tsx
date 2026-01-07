"use client"

import type React from "react"
import {ChevronLeft} from "lucide-react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {stores} from "@/stores"

interface SimpleHeaderProps {
  title: string
  noBack?: boolean
  noSearch?: boolean
  noCart?: boolean
  noClose?: boolean
  noHome?: boolean
}

const SimpleHeader: React.FC<SimpleHeaderProps> = observer(({title, noBack, noSearch, noCart, noClose, noHome}) => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {cartStore} = stores
  
  const handleBack = () => {
    navigate(-1)
  }
  
  const handleCartClick = () => {
    navigate("/cart")
  }
  
  const handleSearchClick = () => {
    navigate("/search")
  }
  
  const cartItemCount = cartStore.totalItems
  
  return (
    <header
      className="fixed top-0 z-50 w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 h-[75px] max-w-[428px]">
      <div className="flex items-center gap-2">
        {!noBack && (
          <button onClick={handleBack}
                  className="flex items-center text-primary-600 hover:text-blue-600 transition-colors gap-2">
            <ChevronLeft size={24} className="mr-1 text-black"/>
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 flex-grow text-center">{title}</h1>
      </div>
      
      <div className="flex items-center">
        {!noSearch && (
          <button
            onClick={handleSearchClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={t("common.search")}
          >
            <img src="/assets/icon/search.png" alt="Search"/>
          </button>
        )}
        
        {!noCart && (
          <button
            onClick={handleCartClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            aria-label={t("common.cart")}
          >
            <img src="/assets/icon/cart.png" alt="Search" className="w-5 h-5"/>
            {cartItemCount > 0 && (
              <span
                className="absolute top-[2px] right-[6px] bg-red-500 text-white text-tiny rounded-full h-4 w-4 flex items-center justify-center">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
            )}
          </button>
        )}
        
        {!noClose && (
          // <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label={t("common.close")}>
          //   <img src="/assets/icon/close.png" alt="Close"/>
          // </button>
          <></>
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

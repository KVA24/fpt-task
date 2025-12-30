import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite" // Import observer
import {stores} from "@/stores" // Import stores
import i18n from "i18next"
import LanguageListModal from "@/components/LanguageListModal.tsx";
// import {ChevronLeft} from "lucide-react";

const Header: React.FC = observer(() => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {cartStore} = stores
  const [isLanguageListModalOpen, setIsLanguageModalOpen] = useState(false)
  
  const handleCartClick = () => {
    navigate("/cart")
  }
  
  // const handleSearchClick = () => {
  //   navigate("/search") // Navigate to search page
  // }
  
  const handleBackApp = () => {
    window.location.href = "lotusmiles://backScreen"
  }
  
  const cartItemCount = cartStore.totalItems
  
  return (
    <div className="fixed top-0 w-full z-50 max-w-[428px]">
      {/* Main Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 h-[75px]">
        <div className="flex items-center gap-2">
          {/*<button onClick={handleBackApp} className="bg-gray-100 rounded-full p-1">*/}
          {/*  <ChevronLeft size={22} className="text-black"/>*/}
          {/*</button>*/}
          <img src="/assets/images/logo_new.svg" alt="Logo" className="w-[141px] h-[44px]"/>
        </div>
        
        <div className="flex items-center">
          {/*<button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label={t("common.search")}*/}
          {/*        onClick={handleSearchClick}*/}
          {/*>*/}
          {/*  <img src="/assets/icon/search.png" alt="Search"/>*/}
          {/*</button>*/}
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                  aria-label={t("common.cart")}
                  onClick={handleCartClick}>
            <img src="/assets/icon/cart.png" alt="Search"/>
            {cartItemCount > 0 && (
              <span
                className="absolute top-[2px] right-[6px] bg-red-500 text-white text-tiny rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </button>
          
          <button className="p-2 transition-colors border-l border-gray-10 0"
                  onClick={() => {
                    setIsLanguageModalOpen(true)
                    // if (i18n.language === "vi") {
                    //   i18n.changeLanguage("en").then()
                    // } else {
                    //   i18n.changeLanguage("vi").then()
                    // }
                  }}
                  aria-label={t("common.switch")}>
            {i18n.language === "vi" ?
              <img src="/assets/flags/vietnam.svg" alt="viFlag" className="w-5 h-5 rounded-full"/>
              :
              <img src="/assets/flags/united-kingdom.svg" alt="enFlag" className="w-5 h-5 rounded-full"/>
            }
          </button>
          
          <button onClick={handleBackApp}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  aria-label={t("common.close")}>
            <img src="/assets/icon/close.png" alt="Close"/>
          </button>
        </div>
      </header>
      
      <LanguageListModal isOpen={isLanguageListModalOpen} onClose={() => setIsLanguageModalOpen(false)}/>
    </div>
  )
})

export default Header

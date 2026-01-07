import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {observer} from "mobx-react-lite"
import {stores} from "@/stores"
import LanguageListModal from "@/components/LanguageListModal.tsx"

const Header: React.FC = observer(() => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {cartStore} = stores
  const [isLanguageListModalOpen, setIsLanguageModalOpen] = useState(false)
  
  const handleClick = () => {
    navigate("/history")
  }
  
  const handleBackApp = () => {
    window.location.href = "lotusmiles://backScreen"
  }
  
  const cartItemCount = cartStore.totalItems
  
  return (
    <div
      className="w-full z-50 max-w-[428px] h-[200px] bg-[url('/assets/images/bg-header.svg')] bg-cover bg-center bg-no-repeat flex-shrink-0">
      {/* Main Header */}
      <header className="flex items-center justify-between px-4 bg-transparent h-[70px]">
        <div className="flex items-center gap-2">
          <img src="/assets/icon/fpt_logo.svg" alt="Logo" className="w-[141px] h-[44px]"/>
        </div>
        
        <div className="flex items-center">
          <button className="pr-2 rounded-full transition-colors relative"
                  aria-label={t("common.cart")}
                  onClick={handleClick}>
            <img src="/assets/icon/file.svg" alt="Search"/>
            {cartItemCount > 0 && (
              <span
                className="absolute top-[2px] right-[6px] bg-red-500 text-white text-tiny rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </button>
          
          <button onClick={handleBackApp}
                  className="pl-2 transition-colors border-l border-white"
                  aria-label={t("common.close")}>
            <img src="/assets/icon/close.svg" alt="Close"/>
          </button>
        </div>
      </header>
      
      <LanguageListModal isOpen={isLanguageListModalOpen} onClose={() => setIsLanguageModalOpen(false)}/>
    </div>
  )
})

export default Header
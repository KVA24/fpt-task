import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {Link, useNavigate} from "react-router-dom"
import {observer} from "mobx-react-lite"
import LanguageListModal from "@/components/LanguageListModal.tsx"

interface HeaderProps {
  noFilter?: boolean
}

const Header: React.FC<HeaderProps> = observer(({noFilter}) => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const [isLanguageListModalOpen, setIsLanguageModalOpen] = useState(false)
  
  const handleClick = () => {
    navigate("/history")
  }
  
  const handleBackApp = () => {
    window.location.href = "lotusmiles://backScreen"
  }
  
  return (
    <div
      className="w-full z-50 max-w-[428px] h-[200px] bg-[url('/assets/images/bg-header.svg')] bg-cover bg-center bg-no-repeat flex-shrink-0">
      {/* Main Header */}
      <header className="flex items-center justify-between px-4 bg-transparent h-[70px]">
        <Link to={"/"} className="flex items-center gap-2">
          <img src="/assets/icon/fpt_logo.svg" alt="Logo" className="w-[141px] h-[44px]"/>
        </Link>
        
        <div className="flex items-center">
          {!noFilter && (
            <button className="pr-2 transition-colors relative border-r border-white"
                    aria-label={t("common.cart")}
                    onClick={handleClick}>
              <img src="/assets/icon/file.svg" alt="Search"/>
            </button>
          )}
          
          <button onClick={handleBackApp}
                  className="pl-2 transition-colors"
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
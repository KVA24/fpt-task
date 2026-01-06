import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import i18n from "i18next"
import LanguageListModal from "@/components/LanguageListModal.tsx";

const Header: React.FC = observer(() => {
  const {t} = useTranslation()
  const [isLanguageListModalOpen, setIsLanguageModalOpen] = useState(false)
  
  return (
    <div className="fixed top-0 w-full z-50 max-w-[428px]">
      {/* Main Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 h-[75px]">
        
        
        <div className="flex items-center">
          <button className="p-2 transition-colors"
                  onClick={() => {
                    setIsLanguageModalOpen(true)
                  }}
                  aria-label={t("common.switch")}>
            {i18n.language === "vi" ?
              <img src="/assets/flags/vietnam.svg" alt="viFlag" className="w-5 h-5 rounded-full"/>
              :
              <img src="/assets/flags/united-kingdom.svg" alt="enFlag" className="w-5 h-5 rounded-full"/>
            }
          </button>
        </div>
      </header>
      
      <LanguageListModal isOpen={isLanguageListModalOpen} onClose={() => setIsLanguageModalOpen(false)}/>
    </div>
  )
})

export default Header

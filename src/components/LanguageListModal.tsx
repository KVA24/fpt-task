"use client"

import type React from "react"
import {X} from "lucide-react"
import {useTranslation} from "react-i18next"
import i18n from "i18next";

interface LanguageListModalProps {
  isOpen: boolean
  onClose: () => void
}

const LanguageListModal: React.FC<LanguageListModalProps> = ({isOpen, onClose}) => {
  const {t} = useTranslation()
  
  const languageOption = [
    {
      id: "vi",
      label: t('home.languages.vietnamese'),
      imageUrl: "/assets/flags/vietnam.svg",
    },
    {
      id: "en",
      label: t('home.languages.english'),
      imageUrl: "/assets/flags/united-kingdom.svg",
    },
  ]
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center top-0 bottom-0 left-0 right-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl shadow-lg animate-slide-up max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t("common.close")}
          >
            <X size={20} className="text-gray-600"/>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{t("home.changeLanguage")}</h2>
          <div className="w-8"></div>
          {/* Placeholder for alignment */}
        </div>
        
        {/* Status Options */}
        <div className="max-h-96 overflow-y-auto p-4">
          <div className="space-y-1">
            {languageOption.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  i18n.changeLanguage(option.id).then(() => onClose())
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <img src={option.imageUrl} alt={option.label} className="w-8 h-8 rounded-full"/>
                  <span className="text-base text-gray-800">{option.label}</span>
                </div>
                <input type="radio"
                       name="date" className="custom-radio"
                       onChange={() => {
                         i18n.changeLanguage(option.id).then(() => onClose())
                       }}
                       checked={i18n.language === option.id}/>
              </button>
            ))}
          </div>
        </div>
        
        {/* Top handle indicator */}
        <div className="flex justify-center py-2 absolute -top-5 w-full">
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default LanguageListModal

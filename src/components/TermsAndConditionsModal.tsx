"use client"

import React, {useRef} from "react"
import {useState} from "react"
import {ChevronLeft, ChevronRight, X} from "lucide-react"
import {useTranslation} from "react-i18next"

interface DeviceListModalProps {
  isOpen: boolean
  onClose: () => void
  onAgree: () => void
}

interface TermCategory {
  id: string
  title: string
  content: string
}

const TermsAndConditionsModal: React.FC<DeviceListModalProps> = ({isOpen, onClose, onAgree}) => {
  const {t} = useTranslation()
  
  const [currentView, setCurrentView] = useState<"list" | "detail">("list")
  const [selectedTerm, setSelectedTerm] = useState<TermCategory | null>(null)
  const divRef = useRef<HTMLDivElement>(null);
  
  const handleSelectTerm = (term: TermCategory) => {
    divRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setSelectedTerm(term)
    setCurrentView("detail")
  }
  
  const handleBack = () => {
    setCurrentView("list")
    setSelectedTerm(null)
  }
  
  const termsCategories_1: TermCategory[] = [
    {
      id: "1",
      title: t('termsAndConditions.policy_1.title-1'),
      content: t('termsAndConditions.policy_1.content-1')
    },
    {
      id: "2",
      title: t('termsAndConditions.policy_1.title-2'),
      content: t('termsAndConditions.policy_1.content-2')
    },
    {
      id: "3",
      title: t('termsAndConditions.policy_1.title-3'),
      content: t('termsAndConditions.policy_1.content-3')
    },
    {
      id: "4",
      title: t('termsAndConditions.policy_1.title-4'),
      content: t('termsAndConditions.policy_1.content-4')
    },
    {
      id: "5",
      title: t('termsAndConditions.policy_1.title-5'),
      content: t('termsAndConditions.policy_1.content-5')
    },
    {
      id: "6",
      title: t('termsAndConditions.policy_1.title-6'),
      content: t('termsAndConditions.policy_1.content-6')
    },
  ]
  
  const termsCategories_2: TermCategory[] = [
    {
      id: "1",
      title: t('termsAndConditions.policy_2.title-1'),
      content: t('termsAndConditions.policy_2.content-1')
    },
    {
      id: "2",
      title: t('termsAndConditions.policy_2.title-2'),
      content: t('termsAndConditions.policy_2.content-2')
    },
    {
      id: "3",
      title: t('termsAndConditions.policy_2.title-3'),
      content: t('termsAndConditions.policy_2.content-3')
    },
    {
      id: "4",
      title: t('termsAndConditions.policy_2.title-4'),
      content: t('termsAndConditions.policy_2.content-4')
    },
    {
      id: "5",
      title: t('termsAndConditions.policy_2.title-5'),
      content: t('termsAndConditions.policy_2.content-5')
    },
    {
      id: "6",
      title: t('termsAndConditions.policy_2.title-6'),
      content: t('termsAndConditions.policy_2.content-6')
    },
    {
      id: "7",
      title: t('termsAndConditions.policy_2.title-7'),
      content: t('termsAndConditions.policy_2.content-7')
    },
    {
      id: "8",
      title: t('termsAndConditions.policy_2.title-8'),
      content: t('termsAndConditions.policy_2.content-8')
    },
    {
      id: "9",
      title: t('termsAndConditions.policy_2.title-9'),
      content: t('termsAndConditions.policy_2.content-9')
    },
    {
      id: "10",
      title: t('termsAndConditions.policy_2.title-10'),
      content: t('termsAndConditions.policy_2.content-10')
    },
    {
      id: "11",
      title: t('termsAndConditions.policy_2.title-11'),
      content: t('termsAndConditions.policy_2.content-11')
    },
  ]
  
  const termsCategories_3: TermCategory[] = [
    // {
    //   id: "1",
    //   title: t('termsAndConditions.policy_3.title-1'),
    //   content: t('termsAndConditions.policy_3.content-1')
    // },
    {
      id: "2",
      title: t('termsAndConditions.policy_3.title-2'),
      content: t('termsAndConditions.policy_3.content-2')
    },
  ]
  
  const termsCategories_5: TermCategory[] = [
    {
      id: "1",
      title: t('termsAndConditions.policy_5.title-1'),
      content: t('termsAndConditions.policy_5.content-1')
    },
    {
      id: "2",
      title: t('termsAndConditions.policy_2.title-2'),
      content: t('termsAndConditions.policy_5.content-2')
    },
    {
      id: "2",
      title: t('termsAndConditions.policy_5.title-2'),
      content: t('termsAndConditions.policy_5.content-2')
    },
  ]
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center top-0 bottom-0 left-0 right-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
        onClose()
        setCurrentView("list")
      }}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl shadow-lg animate-slide-up max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {currentView === "detail" ? (
            <button onClick={handleBack}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors gap-2">
              <ChevronLeft size={24} className="mr-1"/>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={t("common.close")}
            >
              <X size={20} className="text-gray-600"/>
            </button>
          )}
          
          <h2 className="text-lg font-semibold text-gray-900">
            {currentView === "list" ? t("termsAndConditions.title") : selectedTerm?.title}
          </h2>
          <div></div>
        </div>
        
        <div className="h-[500px] overflow-y-auto p-4" ref={divRef}>
          {/* Content Area */}
          {currentView === "list" && (
            <div className="space-y-4 p-2">
              <p className="text-md font-semibold">{t('termsAndConditions.policy_1.title')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_1.title-outSide-1')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_1.title-outSide-2')}</p>
            </div>
          )}
          <div className="flex-grow p-2">
            {currentView === "list" ? (
              <div className="space-y-0">
                {termsCategories_1.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectTerm(term)}
                  >
                    <span className="text-base font-medium text-gray-800">{term.title}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                {selectedTerm && <div style={{fontSize: 14}} dangerouslySetInnerHTML={{__html: selectedTerm.content}}/>}
              </div>
            )}
          </div>
          {currentView === "list" && (
            <div className="space-y-4 p-2">
              <p className="text-md font-semibold">{t('termsAndConditions.policy_2.title')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_2.title-outSide-1')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_2.title-outSide-2')}</p>
            </div>
          )}
          <div className="flex-grow p-2">
            {currentView === "list" && (
              <div className="space-y-0">
                {termsCategories_2.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectTerm(term)}
                  >
                    <span className="text-base font-medium text-gray-800">{term.title}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                  </div>
                ))}
              </div>
            )}
          </div>
          {currentView === "list" && (
            <div className="space-y-4 p-2">
              <p className="text-md font-semibold">{t('termsAndConditions.policy_3.title')}</p>
            </div>
          )}
          <div className="flex-grow p-2">
            {currentView === "list" && (
              <div className="space-y-0">
                {termsCategories_3.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectTerm(term)}
                  >
                    <span className="text-base font-medium text-gray-800">{term.title}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                  </div>
                ))}
              </div>
            )}
          </div>
          {currentView === "list" && (
            <div className="space-y-4 p-2">
              <p className="text-md font-semibold">{t('termsAndConditions.policy_4.title')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_4.title-outSide-1')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_4.title-outSide-2')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_4.title-outSide-3')}</p>
            </div>
          )}
          {currentView === "list" && (
            <div className="space-y-4 p-2">
              <p className="text-md font-semibold">{t('termsAndConditions.policy_5.title')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_5.title-outSide-1')}</p>
            </div>
          )}
          <div className="flex-grow p-2">
            {currentView === "list" && (
              <div className="space-y-0">
                {termsCategories_5.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectTerm(term)}
                  >
                    <span className="text-base font-medium text-gray-800">{term.title}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400"/>
                  </div>
                ))}
              </div>
            )}
          </div>
          {currentView === "list" && (
            <div className="space-y-4 p-2">
              <p className="text-md font-semibold">{t('termsAndConditions.policy_6.title')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_6.title-outSide-1')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_6.title-outSide-2')}</p>
              <p className="text-sm">{t('termsAndConditions.policy_6.title-outSide-3')}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            className="bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white w-full py-3 rounded-md"
            onClick={() => {
              onAgree()
              onClose()
            }}
          >
            {t('termsAndConditions.readAndAgree')}
          </button>
        </div>
        
        {/* Top handle indicator */}
        <div className="flex justify-center py-2 absolute -top-5 w-full">
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditionsModal

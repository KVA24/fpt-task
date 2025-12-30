import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import BottomNavigation from "@/components/BottomNavigation"
import {ChevronLeft, ChevronRight} from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";

interface Guide {
  id: number,
  title: string,
  content: string,
  icon?: string,
}

const Guide: React.FC = () => {
  useScrollToTop()
  const {t} = useTranslation()
  
  const [currentView, setCurrentView] = useState<"list" | "detail">("list")
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [isInstall, setIsInstall] = useState<boolean | null>(false)
  
  const contentTop: Guide[] = [
    {
      id: 1,
      title: t('guide.question-0'),
      content: t('guide.answer-0')
    }
  ]
  
  const contentInstall: Guide[] = [
    {
      id: 1,
      title: "IOS",
      content: t('guide.supportDevice-1'),
      icon: "/assets/icon/install-1.png"
    },
    {
      id: 2,
      title: "Samsung",
      content: t('guide.supportDevice-2'),
      icon: "/assets/icon/install-2.png"
    },
    {
      id: 3,
      title: "Google Pixel",
      content: t('guide.supportDevice-3'),
      icon: "/assets/icon/install-3.png"
    },
    {
      id: 4,
      title: t('common.other'),
      content: t('guide.supportDevice-4'),
      icon: "/assets/icon/install-4.png"
    },
  ]
  
  const content: Guide[] = [
    {
      id: 1,
      title: t('guide.question-1'),
      content: t('guide.answer-1')
    },
    {
      id: 2,
      title: t('guide.question-2'),
      content: t('guide.answer-2')
    },
    {
      id: 3,
      title: t('guide.question-3'),
      content: t('guide.answer-3')
    },
    {
      id: 4,
      title: t('guide.question-4'),
      content: t('guide.answer-4')
    },
  ]
  
  return (
    <div className="mobile-container">
      
      {currentView === "list" ? <>
        <SimpleHeader noClose noCart noSearch title={t('guide.guide')}/>
        <main className="p-4 pb-20 flex-1 overflow-y-auto mt-16">
          <div className="">
            <div className="space-y-2">
              {contentTop.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-gray-100 gap-1"
                  onClick={() => {
                    setSelectedGuide(item)
                    setCurrentView("detail")
                    window.scrollTo(0, 0)
                  }}
                >
                  <span className="text-left text-base font-normal text-gray-600">{item.title}</span>
                  <button className="flex items-center p-1 rounded-full bg-primary-600">
                    <ChevronRight className="w-5 h-5 text-white"/>
                  </button>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="text-base font-semibold mb-4">{t('guide.install')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {contentInstall.map((item) => (
                <button
                  key={item.id}
                  className="flex flex-col justify-center items-center rounded-md bg-gray-100 gap-1 w-full h-24"
                  onClick={() => {
                    setSelectedGuide(item)
                    setCurrentView("detail")
                    setIsInstall(true)
                    window.scrollTo(0, 0)
                  }}
                >
                  <img src={item.icon} className="h-6 rounded-full" alt={item.title + "_icon"}/>
                  <span className="text-center text-base font-normal text-gray-600">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="text-base font-semibold mb-4">{t('guide.questions')}</h2>
            <div className="space-y-2">
              {content.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-lg bg-gray-100 gap-1"
                  onClick={() => {
                    setSelectedGuide(item)
                    setCurrentView("detail")
                    window.scrollTo(0, 0)
                  }}
                >
                  <span className="text-left text-base font-normal text-gray-600">{item.title}</span>
                  <button className="flex items-center p-1 rounded-full bg-primary-600">
                    <ChevronRight className="w-5 h-5 text-white"/>
                  </button>
                </button>
              ))}
            </div>
          </div>
        </main>
      </> : <>
        <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button onClick={() => {
              setCurrentView("list")
              setSelectedGuide(null)
              setIsInstall(false)
            }}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors gap-2">
              <ChevronLeft size={24} className="mr-1"/>
            </button>
            <h1
              className="text-left text-lg font-semibold text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis w-[80vw]">{isInstall && t('deviceList.title')} {selectedGuide?.title}</h1>
          </div>
          <div></div>
        </header>
        <main className="p-4 pb-20 flex-1 overflow-y-auto mt-16">
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {selectedGuide && <div dangerouslySetInnerHTML={{__html: selectedGuide.content}}/>}
          </div>
        </main>
      </>}
      
      <BottomNavigation/>
    </div>
  )
}

export default Guide

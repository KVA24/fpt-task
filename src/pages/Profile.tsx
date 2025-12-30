import React from "react"
import {useTranslation} from "react-i18next"
import BottomNavigation from "@/components/BottomNavigation"
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {ChevronRight, UserIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {stores} from "@/stores";
import {observer} from "mobx-react-lite";

const Profile: React.FC = observer(() => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {appStore} = stores
  
  const handleGuide = () => {
    navigate('/guide')
  }
  
  const handleContact = () => {
    navigate('/contact')
  }
  
  const handleButton = () => {
    window.location.href = "lotusmiles://pushlogin"
  }
  
  return (
    <div className="mobile-container">
      <SimpleHeader noBack noSearch noClose title={t('navigation.profile')}/>
      
      <main className="p-4 pb-20 min-h-screen mt-16"
            style={{
              backgroundImage: "url('/assets/images/bg-profile.png')",
              backgroundSize: "auto",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
              backgroundBlendMode: "multiply",
              backgroundAttachment: "fixed",
              transform: "scale(1)",
            }}
      >
        <div className="relative flex w-full flex-col items-center justify-center space-y-4 py-6">
          {appStore.profile ?
            <>
              {appStore.profile.avatar ?
                <img src={appStore.profile.avatar} className="rounded-full w-14 h-14"/>
                :
                <UserIcon className="w-14 h-14 bg-gray-200 rounded-full p-2" color="#0A8AAE" fill="#0A8AAE"/>
              }
              <h5 className="text-xl font-bold text-black">{appStore.profile.displayName}</h5>
            </>
            :
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <span className="px-10 text-sm text-gray-800">{t('auth.guide')}</span>
              <button
                onClick={handleButton}
                className="bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white px-6 py-2 rounded-md font-semibold shadow-md transition-colors"
              >
                {t('auth.login')}/{t('auth.register')}
              </button>
            </div>
          }
        </div>
        
        <div className="space-y-4 p-3 mt-10">
          <button onClick={handleGuide}
                  className="flex items-center justify-between cursor-pointer w-full">
            <div className="flex items-center space-x-2">
              <img src="/assets/icon/guide.png" alt="Search" className="w-5 h-5"/>
              <span className="text-sm font-semibold">{t('guide.guide')}</span>
            </div>
            <ChevronRight/>
          </button>
          
          <button onClick={handleContact}
                  className="flex items-center justify-between cursor-pointer w-full">
            <div className="flex items-center space-x-2">
              <img src="/assets/icon/contact.png" alt="Search" className="w-5 h-5"/>
              <span className="text-sm font-semibold">{t('guide.contactHotline')}</span>
            </div>
            <ChevronRight/>
          </button>
        </div>
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default Profile

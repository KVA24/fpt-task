import React from "react"
import {useTranslation} from "react-i18next"
import BottomNavigation from "@/components/BottomNavigation"
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {UserIcon} from "lucide-react";
import {stores} from "@/stores";
import {observer} from "mobx-react-lite";

const Profile: React.FC = observer(() => {
  const {t} = useTranslation()
  const {taskStore} = stores
  
  const handleButton = () => {
    window.location.href = "lotusmiles://pushlogin"
  }
  
  return (
    <div className="mobile-container">
      <SimpleHeader noBack noClose title={t('navigation.profile')}/>
      
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
          {taskStore.profile ?
            <>
              {taskStore.profile.avatar ?
                <img src={taskStore.profile.avatar} className="rounded-full w-14 h-14"/>
                :
                <UserIcon className="w-14 h-14 bg-gray-200 rounded-full p-2" color="#0A8AAE" fill="#0A8AAE"/>
              }
              <h5 className="text-xl font-bold text-black">{taskStore.profile.displayName}</h5>
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
      
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default Profile

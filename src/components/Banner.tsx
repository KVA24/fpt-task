import type React from "react"
import {useTranslation} from "react-i18next"
import {appStore} from "@/stores/AppStore.ts";

const Banner: React.FC = () => {
  const {t} = useTranslation()
  
  return (
    <div className="mx-4 rounded-2xl p-4 text-white shadow-lg"
         style={{
           backgroundImage: "url('/assets/images/banner-home_new.png')",
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundRepeat: "no-repeat",
           backgroundBlendMode: "multiply",
           backgroundAttachment: "fixed",
           transform: "scale(1)",
         }}
    >
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-3">{t("home.greeting")}</h2>
        <h2 className="text-2xl font-bold mb-3">{t("home.subtitle")}</h2>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {/*<button onClick={() => {*/}
          {/*  appStore.isLocal = null*/}
          {/*}}*/}
          {/*        className={`${appStore.isLocal === null ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 bg-opacity-50 border border-white'} backdrop-blur-sm px-5 py-2*/}
          {/*  rounded-full text-sm font-semibold transition-all duration-200 shadow-sm*/}
          {/*  cursor-pointer`}>*/}
          {/*  {t("home.commonEsim")}*/}
          {/*</button>*/}
          <button onClick={() => {
            appStore.isLocal = false
          }}
                  className={`${!Boolean(appStore.isLocal) && appStore.isLocal !== null ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 bg-opacity-50 border border-white'} backdrop-blur-sm px-5 py-2
            rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
            cursor-pointer`}>
            {t("home.localEsim")}
          </button>
          <button onClick={() => {
            appStore.isLocal = true
          }}
                  className={`${Boolean(appStore.isLocal) ? 'bg-primary-600  text-white' : 'bg-white text-gray-800 bg-opacity-50 border border-white'} backdrop-blur-sm px-5 py-2
            rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
            cursor-pointer`}>
            {t("home.globalEsim")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner

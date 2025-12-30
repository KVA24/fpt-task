import React, {Fragment} from "react"
import {observer} from "mobx-react-lite"
import Header from "@/components/Header"
import Banner from "@/components/Banner"
import CountrySection from "@/components/CountrySection"
import BottomNavigation from "@/components/BottomNavigation"
import {appStore} from "@/stores/AppStore.ts";
import NoContent from "@/components/NoContent.tsx";
import Loading from "@/components/Loading.tsx";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const Home: React.FC = observer(() => {
  useScrollToTop()
  const {t} = useTranslation()
  const navigate = useNavigate()
  
  const handleSearchClick = () => {
    navigate("/search") // Navigate to search page
  }
  
  return (
    <div className="mobile-container min-h-screen">
      <Header/>
      
      <main className="pb-24 mt-16">
        <div className="p-4 pt-6">
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 bg-gray-100 rounded-xl focus:outline-none text-base text-gray-500"
          >
            <img src="/assets/icon/search.png" alt="Search"/>
            {t("search.titleHome")}
          </button>
        </div>
        
        <Banner/>
        
        <div className="bg-white rounded-t-3xl pt-6">
          {appStore.isLoading ? <Loading size={"lg"} containerClassName={"h-64"}/> :
            (appStore.isLocal === null ?
                <Fragment>
                  {appStore.listPopular && appStore.listPopular.length > 0 ?
                    <CountrySection title={""} productGroups={appStore.listPopular}/>
                    :
                    <NoContent/>
                  }
                </Fragment>
                :
                <Fragment>
                  {(appStore.listCategory && appStore.listCategory.length > 0) ? appStore.listCategory.map((category) => (
                    <CountrySection key={category.id} id={category.id} title={category.name}
                                    productGroups={category.productGroups}/>
                  )) : <NoContent/>}
                </Fragment>
            )
          }
        </div>
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default Home

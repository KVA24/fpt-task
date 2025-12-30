"use client"

import React, {Fragment, useEffect} from "react"
import {observer} from "mobx-react-lite"
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {X} from "lucide-react"
import {stores} from "@/stores"
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {ProductGroupList} from "@/stores/AppStore.ts";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import {formatCurrency} from "@/utils/utils"
import Loading from "@/components/Loading.tsx";

const Search: React.FC = observer(() => {
  useScrollToTop()
  const navigate = useNavigate()
  const {t} = useTranslation()
  const {appStore} = stores
  // const [searchQuery, setSearchQuery] = useState("")
  
  const handleCountryClick = (countryId: string) => {
    navigate(`/esim/${countryId}`)
  }
  
  useEffect(() => {
    appStore.keySearch = ""
  }, [])
  
  useEffect(() => {
    const handler = setTimeout(() => {
      appStore.searchProduct().then()
    }, 300)
    
    return () => clearTimeout(handler)
  }, [appStore.keySearch])
  
  // Filter countries based on search query
  // const filteredProductGroups = useMemo(() => {
  //   const query = searchQuery.toLowerCase().trim();
  //
  //   return appStore.listCategory
  //     .map((group) => {
  //       const filteredGroups = query
  //         ? group.productGroups.filter((pg) =>
  //           pg.title.toLowerCase().includes(query)
  //         )
  //         : group.productGroups; // nếu searchQuery rỗng → giữ nguyên
  //
  //       if (!filteredGroups.length) return null;
  //
  //       return {
  //         ...group,
  //         productGroups: filteredGroups,
  //       };
  //     })
  //     .filter(Boolean); // loại bỏ group không có productGroups nào khớp
  // }, [searchQuery, appStore.listCategory]);
  //
  // const hasResult = filteredProductGroups.some((group: any) => group.productGroups.length > 0);
  
  return (
    <div className="mobile-container bg-white">
      {/* Header */}
      <SimpleHeader noClose noSearch title={""}/>
      
      {/* Search Input */}
      <div className="p-4 pb-2 bg-white border-b border-gray-100 mt-16">
        <div className="relative">
          <input
            type="text"
            value={appStore.keySearch}
            onChange={(e) => {
              appStore.keySearch = e.currentTarget.value
            }}
            placeholder={t("search.placeholder")}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            autoFocus={false}
            maxLength={30}
          />
          {appStore.keySearch && (
            <button
              onClick={() => appStore.keySearch = ""}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-400"/>
            </button>
          )}
        </div>
      </div>
      
      {/* Search Results */}
      <main className="flex-1 bg-white">
        {appStore.isLoading ? <Loading size={"lg"} containerClassName={"h-64"}/>
          :
          <Fragment>
            {appStore.listCategorySearch.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("search.noResults")}</h3>
                <p className="text-gray-600 text-sm">{t("search.noResultsDescription", {query: appStore.keySearch})}</p>
              </div>
            ) : (
              <div className="pb-6">
                {appStore.listCategorySearch.map((category: any) => (
                  <div key={category.id} className="px-4 py-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{category.name}</h3>
                    <div className="">
                      {category.productGroups.map((country: ProductGroupList) => (
                        <button
                          key={country.id}
                          onClick={() => handleCountryClick(country.id)}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center">
                            <div
                              className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center bg-gray-100 mr-3">
                              <img
                                src={`${country.imageUrl}`}
                                alt={`${country.title} flag`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                  const fallback = target.nextElementSibling as HTMLElement
                                  if (fallback) fallback.style.display = "block"
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-900">{country.title}</span>
                          </div>
                          <div className="flex items-center">
                        <span className="text-xs">
                          {t('common.from')}: {formatCurrency(country.minPrice)}
                        </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              
              </div>
            )}
          </Fragment>
        }
      </main>
    </div>
  )
})

export default Search

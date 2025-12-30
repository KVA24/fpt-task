"use client"

import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import {useNavigate, useParams} from "react-router-dom"
import {stores} from "@/stores"
import BottomNavigation from "@/components/BottomNavigation"
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import {formatCurrency} from "@/utils/utils.ts";
import {useTranslation} from "react-i18next"

const AllCountries: React.FC = observer(() => {
  useScrollToTop()
  const {id} = useParams<{ id: string | undefined }>()
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {appStore} = stores
  
  useEffect(() => {
    appStore.getAllGroupByCategory(id).then()
  }, [])
  
  const countries = appStore.listProductGroupByCategory.productGroups
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));
  
  const handleCountryClick = (countryId: string) => {
    navigate(`/esim/${countryId}`)
  }
  
  return (
    <div className="mobile-container min-h-screen bg-white">
      <SimpleHeader noClose title={appStore.listProductGroupByCategory.name}/>
      <main className="p-4 mt-16 pb-24">
        <div className="grid grid-cols-2 gap-3">
          {countries.map((country) => (
            <div
              key={country.id}
              className="country-card relative flex flex-col justify-between items-start px-1 py-2 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer h-20 overflow-hidden"
              onClick={() => handleCountryClick(country.id)}
            >
              <span className="text-sm text-gray-800 font-medium leading-tight px-1 text-left w-full">
                {country.title}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 px-1 text-left w-full">
                {t('common.from')}:
                </span>
                <span className="text-sm text-gray-800 font-medium leading-tight px-1 text-left w-full">
                   {formatCurrency(country.minPrice)}
                </span>
              </div>
              <div
                className="absolute bottom-[-12px] right-[-12px] w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-white flex items-center justify-center bg-gray-100">
                <img
                  src={country.imageUrl}
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
            </div>
          ))}
        </div>
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default AllCountries

"use client"

import type React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import {ChevronRight} from "lucide-react"
import {appStore, ProductGroupList} from "@/stores/AppStore"
import {useNavigate} from "react-router-dom";
import NoContent from "@/components/NoContent.tsx";
import {formatCurrency} from "@/utils/utils.ts";

interface CountrySectionProps {
  id?: string
  title: string
  productGroups: ProductGroupList[]
}

const CountrySection: React.FC<CountrySectionProps> = observer(({id, title, productGroups}) => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  
  const groupList: ProductGroupList[] = productGroups
  const displayedGroups = groupList?.slice(0, appStore.isLocal === null ? 12 : 8) || null
  
  const handleCountryClick = (id: string) => {
    navigate(`/esim/${id}`)
  }
  
  const handleViewAllClick = () => {
    navigate(`/countries/${id}`)
  }
  
  return (
    <div className="px-4 mb-8">
      {title &&
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-md font-bold text-gray-900">{title}</h3>
          <button
            onClick={handleViewAllClick}
            className="flex items-center text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors">
            {t("common.viewAll")}
            <ChevronRight size={16} className="ml-1"/>
          </button>
        </div>
      }
      {displayedGroups ?
        <div className="grid grid-cols-2 gap-2">
          {displayedGroups.map((product) => (
            <div
              key={product.id}
              className="country-card relative flex flex-col justify-between items-start px-1 py-2 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer h-20 overflow-hidden"
              onClick={() => handleCountryClick(product.id)}
            >
              <span className="text-sm text-gray-800 font-medium leading-tight px-1 text-left w-full">
                {product.title}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 px-1 text-left w-full">
                {t('common.from')}:
                </span>
                <span className="text-sm text-gray-800 font-medium leading-tight px-1 text-left w-full">
                   {formatCurrency(product.minPrice)}
                </span>
              </div>
              <div
                className="absolute bottom-[-12px] right-[-12px] w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-white flex items-center justify-center bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={`${product.title} flag`}
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
        </div> : <NoContent/>
      }
    </div>
  )
})

export default CountrySection

"use client"

import React, {useMemo, useState} from "react"
import {ChevronLeft, ChevronRight, X} from "lucide-react"
import {useTranslation} from "react-i18next"
import {CarrierList, ProductGroupList} from "@/stores/AppStore.ts";

interface DeviceListModalProps {
  isOpen: boolean
  onClose: () => void
  info: ProductGroupList
  isInternational: boolean
}

const InfoProductModal: React.FC<DeviceListModalProps> = ({isOpen, onClose, info, isInternational}) => {
  const {t} = useTranslation()
  
  const [view, setView] = useState<"list" | "detail">("list")
  const [carrier, setCarrier] = useState<CarrierList[] | null>(null)
  
  function filterCarrierNames(
    carriersData: CarrierList[] | null,
    query: string
  ): CarrierList[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!carriersData) return [];
    
    if (!lowerQuery) return carriersData;
    
    return carriersData.filter(c =>
        (c.name?.toLowerCase().includes(lowerQuery) ?? false) ||
        (c.regionName?.toLowerCase().includes(lowerQuery) ?? false)
      // (c.types?.toLowerCase().includes(lowerQuery) ?? false) ||
      // (c.regionCode?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCarrier: CarrierList[] = useMemo(() => {
    return filterCarrierNames(carrier, searchQuery);
  }, [searchQuery, carrier]);
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center top-0 bottom-0 left-0 right-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
        setView("list")
        setCarrier(null)
        setSearchQuery("")
        onClose()
      }}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl shadow-lg animate-slide-up max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={
              view === "list" ? () => {
                onClose()
              } : () => {
                setView("list")
                setSearchQuery("")
              }
            }
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t("common.close")}
          >
            <ChevronLeft size={20} className="text-gray-600"/>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {view === "list" ? t("esimDetail.detailInfo") : t("esimDetail.carrier")}
          </h2>
          <div></div>
        </div>
        
        <div className="h-auto overflow-y-auto p-4">
          {view === "list" && (
            <ul className="text-gray-600 text-sm space-y-3">
              <li className="flex justify-between items-center">
              <span
                className="font-semibold min-w-40">{isInternational ? t("esimDetail.regions") : t("esimDetail.carrier")}: </span>
                <button onClick={() => {
                  setView("detail")
                  setCarrier(info?.carriers)
                }} className="flex items-center gap-1">
                  {isInternational ?
                    [...new Set(info?.carriers?.slice(0, 2).map((carrier) => carrier.regionName))].join(", ")
                    :
                    info?.carriers?.slice(0, 2).map((carrier) => carrier.name).join(", ")
                  }
                  <div className="flex items-center gap-2">
                    {info?.carriers?.length > 2 &&
                      <span
                        className="text-xs text-gray-400 items-center flex">({isInternational ? new Set(info?.carriers?.map(item => item.regionName)).size : new Set(info?.carriers?.map(item => item.name)).size})
                        <ChevronRight size={14}/>
                      </span>
                    }
                  </div>
                </button>
              </li>
              {/*<li className="flex justify-between items-center">*/}
              {/*  <span className="font-semibold min-w-40">{t("esimDetail.productType")}: </span>*/}
              {/*  {info?.packageType}*/}
              {/*</li>*/}
              <li className="flex justify-between items-center">
              <span
                className="font-semibold min-w-40">{t("esimDetail.days")}: </span>
                {info?.dayToCapacities && info?.dayToCapacities.length > 1 ?
                  <>
                    {info?.dayToCapacities[0]?.day} - {info?.dayToCapacities[info?.dayToCapacities?.length - 1]?.day}
                  </>
                  :
                  <>
                    {info?.dayToCapacities[0]?.day}
                  </>
                }
              </li>
            </ul>
          )}
          {view === "detail" && (
            <div className="h-[50vh]">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                  }}
                  placeholder={t("search.placeholder")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  autoFocus={false}
                  maxLength={30}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} className="text-gray-400"/>
                  </button>
                )}
              </div>
              <ul className="text-gray-600 text-sm space-y-3 py-3">
                {filteredCarrier && filteredCarrier.map((carrier, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="flex items-center font-normal text-gray-800 gap-2">
                      <img src={carrier.regionFlag} alt={carrier.regionFlag} className="w-5 h-5 rounded-full"/>
                      {carrier.regionName}
                    </span>
                    <span className="font-normal text-gray-800">
                        {carrier.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Top handle indicator */}
        <div className="flex justify-center py-2 absolute -top-5 w-full">
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default InfoProductModal

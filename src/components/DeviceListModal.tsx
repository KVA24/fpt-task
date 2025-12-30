"use client"

import React, {useEffect, useMemo, useState} from "react"
import {X} from "lucide-react"
import {useTranslation} from "react-i18next"
import {appStore, Deviceslist} from "@/stores/AppStore.ts";

interface DeviceListModalProps {
  isOpen: boolean
  onClose: () => void
}

const DeviceListModal: React.FC<DeviceListModalProps> = ({isOpen, onClose}) => {
  const {t} = useTranslation()
  
  useEffect(() => {
    appStore.getDevicesList().then()
  }, []);
  
  function filterDeviceNames(
    deviceData: Deviceslist[] | null,
    query: string
  ): Deviceslist[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!deviceData) return [];
    
    if (!lowerQuery) return deviceData;
    
    return deviceData
      .filter(c =>
        (c.name?.toLowerCase().includes(lowerQuery) ?? false) ||
        (c.brand?.toLowerCase().includes(lowerQuery) ?? false) ||
        (c.model?.toLowerCase().includes(lowerQuery) ?? false)
      )
  }
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredDevice: Deviceslist[] = useMemo(() => {
    return filterDeviceNames(appStore.devicesList, searchQuery);
  }, [searchQuery, appStore.devicesList]);
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center top-0 bottom-0 left-0 right-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl shadow-lg animate-slide-up max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t("common.close")}
          >
            <X size={20} className="text-gray-600"/>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{t("deviceList.title")}</h2>
          <div></div>
        </div>
        
        <div className="relative p-4">
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
        
        {/* Device List */}
        <div className="h-[65vh] overflow-y-auto p-4 pt-0">
          <div className="space-y-3">
            {filteredDevice.map((device, index) => (
              <div key={index} className="text-sm text-gray-800 py-2 border-b border-gray-100 last:border-b-0">
                {device.brand} {device.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Top handle indicator */}
        <div className="flex justify-center py-2 absolute -top-5 w-full">
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default DeviceListModal

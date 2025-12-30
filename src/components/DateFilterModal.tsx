"use client"

import React, {useState} from "react"
import {X} from "lucide-react"
import {useTranslation} from "react-i18next"
import {format, subDays} from 'date-fns';
import {cn} from '@/utils/utils.ts';
import {DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {orderStore} from "@/stores/OrderStore.ts";
import {enUS, vi} from 'date-fns/locale';

const presets = [
  {label: 'date.today', value: 1, endDate: new Date(), startDate: new Date()},
  {label: 'date.last30Days', value: 30, endDate: new Date(), startDate: subDays(new Date(), 30)},
  {label: 'date.last60Days', value: 60, endDate: new Date(), startDate: subDays(new Date(), 60)},
  {label: 'date.last90Days', value: 90, endDate: new Date(), startDate: subDays(new Date(), 90)},
];

interface StatusFilterModalProps {
  isOpen: boolean
  onClose: () => void
}

const DateFilterModal: React.FC<StatusFilterModalProps> = ({isOpen, onClose}) => {
  const {t} = useTranslation()
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  
  const handlePresetSelect = (daysAgo: number | null, startDate: any, endDate: any) => {
    setSelectedPreset(daysAgo);
    setMode('preset');
    setCustomStartDate(undefined)
    setCustomEndDate(undefined)
    orderStore.startDate = startDate
    orderStore.endDate = endDate
  };
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center top-0 bottom-0 left-0 right-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
        handlePresetSelect(null, null, null)
        onClose()
      }}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-t-2xl shadow-lg animate-slide-up max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => {
              handlePresetSelect(null, null, null)
              onClose()
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t("common.close")}
          >
            <X size={20} className="text-gray-600"/>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{t("history.filterTime")}</h2>
          <div className="w-8"></div>
          {/* Placeholder for alignment */}
        </div>
        
        {/* Status Options */}
        <div className="max-h-96 overflow-y-auto p-4">
          <div className="space-y-1">
            {presets.map((p, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-between px-4 py-2 rounded cursor-pointer',
                  selectedPreset === p.value && mode === 'preset' ? '' : 'hover:bg-gray-100'
                )}
                onClick={() => handlePresetSelect(p.value, p.startDate, p.endDate)}
              >
                {t(`${p.label}`)}
                <input type="radio"
                       name="date" className="custom-radio"
                       checked={selectedPreset === p.value && mode === 'preset'}
                       onChange={() => handlePresetSelect(p.value, p.startDate, p.endDate)}
                       value={p.value}/>
              </div>
            ))}
            
            <div
              className={cn(
                'flex items-center justify-between px-4 py-2 rounded cursor-pointer',
                mode === 'custom' ? '' : 'hover:bg-gray-100'
              )}
              onClick={() => {
                setMode('custom');
                setSelectedPreset(null);
              }}
            >
              {t('date.custom')}
              <div className="flex items-center gap-2">
                {customStartDate && customEndDate && (
                  <span className="ml-2 text-sm">
                {format(customStartDate, 'dd/MM/yyyy')} - {format(customEndDate, 'dd/MM/yyyy')}
                </span>
                )}
                <input type="radio"
                       name="date" className="custom-radio"
                       onChange={() => setMode('custom')}
                       checked={mode === 'custom'}/>
              </div>
            </div>
            
            {mode === 'custom' && (
              <DateRange locale={localStorage.getItem('i18nextLng') === 'vi' ? vi : enUS}
                         ranges={[
                           {
                             startDate: customStartDate || new Date(),
                             endDate: customEndDate || new Date(),
                             key: 'selection'
                           },
                         ]}
                         onChange={(item: any) => {
                           setCustomStartDate(item.selection.startDate);
                           setCustomEndDate(item.selection.endDate);
                           orderStore.startDate = item.selection.startDate
                           orderStore.endDate = item.selection.endDate
                         }}
                         rangeColors={['#006885']}
                         showDateDisplay={false}/>
            )}
          
          </div>
        </div>
        
        <div className="flex justify-center py-2 px-4 gap-3">
          <button className="bg-white text-primary-600 border border-primary-600 w-full py-3 rounded-md"
                  onClick={() => {
                    handlePresetSelect(null, null, null)
                    setCustomStartDate(undefined)
                    setCustomEndDate(undefined)
                  }}>
            {t('common.reChoose')}
          </button>
          <button className="bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white w-full py-3 rounded-md"
                  disabled={!selectedPreset && !customStartDate && !customEndDate}
                  onClick={() => {
                    orderStore.getOrders().then(() => onClose())
                  }}>
            {t('common.confirm')}
          </button>
        </div>
        
        {/* Top handle indicator */}
        <div className="flex justify-center py-2 absolute -top-5 w-full">
          <div className="w-12 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default DateFilterModal

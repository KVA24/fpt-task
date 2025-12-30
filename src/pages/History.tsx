"use client"

import React, {useEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import {CalendarDays, ChevronDown, X} from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"
import StatusFilterModal from "@/components/StatusFilterModal"
import SimpleHeader from "@/components/SimpleHeader.tsx";
import DateFilterModal from "@/components/DateFilterModal.tsx";
import {stores} from "@/stores";
import {Transaction} from "@/stores/OrderStore.ts"
import {differenceInDays, format} from "date-fns";
import Loading from "@/components/Loading.tsx";
import NoContent from "@/components/NoContent.tsx";
import {useNavigate} from "react-router-dom";
import {formatCurrency} from "@/utils/utils.ts";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import Spinner from "@/components/Spinner.tsx";

const History: React.FC = observer(() => {
  useScrollToTop()
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {orderStore} = stores
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"ALL" | "COMPLETED" | "PROCESSING" | "CANCEL" | "PAID">("ALL")
  
  useEffect(() => {
    orderStore.getOrders().then()
  }, [selectedStatusFilter]);
  
  const handleOpenDateModal = () => {
    setIsDateModalOpen(true)
  }
  
  const handleOpenStatusModal = () => {
    setIsStatusModalOpen(true)
  }
  
  const handleSelectStatus = (status: "ALL" | "COMPLETED" | "PROCESSING" | "CANCEL" | "PAID") => {
    setSelectedStatusFilter(status)
    if (status === "ALL") {
      orderStore.paymentState = ""
    } else {
      orderStore.paymentState = status
    }
  }
  
  const divRef = useRef(null)
  const [isBottom, setIsBottom] = useState(false)
  
  const handleScroll = (event: any) => {
    const {scrollTop, scrollHeight, clientHeight} = event.target
    if (scrollTop + clientHeight >= scrollHeight - 5 && !isBottom) {
      setIsBottom(true)
    }
  }
  
  useEffect(() => {
    if (!isBottom || orderStore.page === orderStore.totalPages - 1) {
      setIsBottom(false)
      return
    }
    orderStore.page++
    orderStore.getOrdersMore().then(() => setIsBottom(false))
  }, [isBottom])
  
  const getStatusClasses = (status: Transaction["paymentState"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-gradient-to-l from-[#41AB58] to-[#45D966] text-white"
      case "PAID":
        return "bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white"
      case "PROCESSING":
        return "bg-gradient-to-l from-[#F0C34D] to-[#D88E37] text-white"
      case "CANCEL":
        return "bg-gradient-to-l from-[#F02C2C] to-[#FF6480] text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }
  
  const renderTime = (startDate: Date, endDate: Date) => {
    switch (differenceInDays(endDate, startDate)) {
      case 0:
        return t('date.today')
      case 30:
        return t('date.last30Days')
      case 60:
        return t('date.last60Days')
      case 90:
        return t('date.last90Days')
      default:
        return <>
          {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
        </>
    }
  }
  
  const handleHistory = (id: string | undefined) => {
    orderStore.getOrderDetail(id).then(() => {
      navigate(`/history/${id}`)
    })
  }
  
  return (
    <div className="mobile-container bg-white">
      {/* Main Header */}
      <SimpleHeader noBack noClose title={t('navigation.history')}/>
      
      {/* Filter Buttons */}
      <div className="flex gap-2 p-4 pb-2 bg-white border-b border-gray-100 mt-16">
        <button
          className="flex items-center px-4 py-2 bg-white rounded-full border border-gray-400  text-gray-700 text-sm font-medium transition-colors">
          <CalendarDays size={16} className="mr-2"/>
          
          {(orderStore.startDate && orderStore.endDate) ?
            <div className="flex items-center">
              <span onClick={handleOpenDateModal}>
                {renderTime(orderStore.startDate, orderStore.endDate)}
              </span>
              <X size={16} className="ml-2" onClick={() => {
                orderStore.startDate = null
                orderStore.endDate = null
                orderStore.getOrders().then()
              }}/>
            </div>
            :
            <div className="flex items-center" onClick={handleOpenDateModal}>
              {t("history.filterTime")}
              <ChevronDown size={16} className="ml-2"/>
            </div>
          }
        </button>
        <button
          className="flex items-center px-4 py-2 bg-white rounded-full border border-gray-400 text-gray-700 text-sm font-medium transition-colors">
          {orderStore.paymentState ?
            <div className="flex items-center">
              <span onClick={handleOpenStatusModal}>
                {t(`history.status.${orderStore.paymentState}`)}
              </span>
              <X size={16} className="ml-2" onClick={() => {
                setSelectedStatusFilter('ALL')
                orderStore.paymentState = ""
              }}/>
            </div>
            :
            <div className="flex items-center" onClick={handleOpenStatusModal}>
              {t("history.filterStatus")}
              <ChevronDown size={16} className="ml-2"/>
            </div>
          }
        </button>
      </div>
      {orderStore.isLoading ? <Loading size={"lg"} containerClassName={"h-64"}/>
        :
        <main className="p-4 pb-20 h-[calc(100vh-5rem)] overflow-scroll" ref={divRef} onScroll={handleScroll}>
          {orderStore.orderList?.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              {(orderStore.paymentState || (orderStore.startDate && orderStore.endDate)) ? (
                  <NoContent/>
                )
                : (
                  <NoContent title={t('noContent.noOrder')} description={t('noContent.orderDescription')}/>
                )
              }
            </div>
          ) : (
            <div className="space-y-2">
              {orderStore.orderList?.map((transaction) => {
                return (
                  <div key={transaction.id} onClick={() => handleHistory(transaction.id)}
                       className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-sm text-xs font-semibold ${getStatusClasses(transaction.paymentState)}`}
                    >
                      {t(`history.status.${transaction.paymentState}`)}
                    </span>
                      <div className="flex items-center gap-1">
                        {transaction.productGroupImageUrls?.slice(0, 5).map((image, index) => {
                          return <img key={index} src={image} alt="Search" className="w-6 h-6 rounded-full"/>
                        })}
                        {transaction.productGroupImageUrls?.length > 5 &&
                          <span
                            className="text-xs text-gray-500">+{transaction.productGroupImageUrls?.length - 5}</span>
                        }
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{transaction.code}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {transaction.createdAt ? format(transaction.createdAt, "dd/MM/yyyy, HH:mm:ss ") : ""}
                      </p>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(transaction.totalPrice)}</span>
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-center py-4">
                {orderStore.isLoadingMore && <Spinner size={"sm"}/>}
              </div>
            </div>
          )}
        </main>
      }
      
      <BottomNavigation/> {/* BottomNavigation component is now imported and used */}
      
      {/* Date Filter Modal */}
      <DateFilterModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
      />
      
      {/* Status Filter Modal */}
      <StatusFilterModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSelectStatus={handleSelectStatus}
        selectedStatus={selectedStatusFilter}
      />
    </div>
  )
})

export default History

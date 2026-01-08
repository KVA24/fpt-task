"use client"

import React, {useEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import BottomNavigation from "@/components/BottomNavigation"
import StatusFilterModal from "@/components/StatusFilterModal"
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {stores} from "@/stores";
import Loading from "@/components/Loading.tsx";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import {TaskItem} from "@/stores/appStore.ts";

const History: React.FC = observer(() => {
  useScrollToTop()
  const {t} = useTranslation()
  const {appStore} = stores
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"ALL" | "COMPLETED" | "PROCESSING" | "CANCEL" | "PAID">("ALL")
  
  useEffect(() => {
    appStore.getAllCategory().then(() => {
      appStore.getAllTask().then()
    })
  }, [])
  
  useEffect(() => {
    if (selectedCategoryId !== null) {
      setFilteredTasks(appStore.filterTasks(selectedCategoryId))
    } else if (appStore.listCategory.length > 0) {
      const firstCategory = appStore.listCategory[0]
      setSelectedCategoryId(firstCategory.id as unknown as number)
      setFilteredTasks(appStore.filterTasks(firstCategory.id as unknown as number))
    }
  }, [appStore.listTask, selectedCategoryId, appStore.listCategory])
  
  const handleCategoryClick = (categoryId: string) => {
    const numId = Number(categoryId)
    setSelectedCategoryId(numId)
  }
  
  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }
  
  const handleMouseLeave = () => {
    setIsDragging(false)
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Multiply by 2 for faster scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }
  
  const getStatusButtonText = (task: TaskItem) => {
    if (task.isCompleted) {
      return "Đã thực hiện"
    }
    return "Thực hiện"
  }
  
  const getStatusButtonClass = (task: TaskItem) => {
    if (task.isCompleted) {
      return "bg-green-300 text-green-600"
    }
    return "bg-[#E07B5A] text-white"
  }
  
  const handleSelectStatus = (status: "ALL" | "COMPLETED" | "PROCESSING" | "CANCEL" | "PAID") => {
    setSelectedStatusFilter(status)
    if (status === "ALL") {
    
    } else {
    
    }
  }
  
  return (
    <div className="mobile-container flex flex-col h-screen overflow-hidden">
      {/* Main Header */}
      <SimpleHeader noBack title={t('navigation.history')} onClickFilter={() => setIsStatusModalOpen(true)}/>
      
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Category Tabs - Sticky within scrollable area */}
        <div className="sticky top-0 bg-white z-10 shadow-sm">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-2 no-scrollbar p-4 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {appStore.listCategory.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`whitespace-nowrap pb-2 border-b-2 transition-colors text-sm font-medium flex-shrink-0 ${
                  selectedCategoryId === Number(category.id)
                    ? "border-[#E07B5A] text-[#E07B5A]"
                    : "border-transparent text-gray-700 hover:text-gray-900"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tasks Content */}
        {appStore.isLoading ?
          <Loading size={"lg"} containerClassName={"h-64"}/>
          :
          <div className="px-4 py-4 bg-gray-100 min-h-full">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-body1 font-medium text-gray-900">Nhiệm vụ tích điểm</h2>
              <img src="/assets/icon/target.svg" alt="Zap" className="h-6"/>
            </div>
            
            <div className="space-y-4 pb-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <img src="/assets/icon/badge.svg" alt="Zap" className="w-6 h-6"/>
                      <h3 className="text-body2 font-medium text-gray-900 flex-1 pt-1">{task.name}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-3">
                        <img src="/assets/icon/rankBadge.svg" alt="Zap" className="w-6 h-6"/>
                        <div className="flex flex-col gap-1">
                          <p className="text-body3 font-regular text-primary-600">+{task.rewardAmount} FPoint</p>
                          <p className="text-body4 font-regular text-secondary-400">+{task.rewardAmount} FPoint
                            Bonus</p>
                        </div>
                      </div>
                      
                      <button
                        className={`px-2 py-2 rounded-xl text-body3 font-medium transition-colors ${getStatusButtonClass(task)}`}
                      >
                        {getStatusButtonText(task)}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không có nhiệm vụ nào</p>
                </div>
              )}
            </div>
          </div>
        }
      </main>
      
      <BottomNavigation/>
      
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

import React, {Fragment, useEffect, useRef, useState} from "react"
import {observer} from "mobx-react-lite"
import Header from "@/components/Header"
import BottomNavigation from "@/components/BottomNavigation"
import {useScrollToTop} from "@/hooks/useScrollToTop.ts"
import {stores} from "@/stores"
import type {TaskItem} from "@/stores/appStore.ts"
import Loading from "@/components/Loading.tsx";
import NoContent from "@/components/NoContent.tsx";

const Home: React.FC = observer(() => {
  useScrollToTop()
  
  const {appStore} = stores
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  
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
  
  const getStatusButtonClass = (task: TaskItem) => {
    if (task.isCompleted) {
      return "bg-green-300 text-green-600 shadow-md"
    }
    return "bg-[#E07B5A] text-white"
  }
  
  const getStatusButtonText = (task: TaskItem) => {
    if (task.isCompleted) {
      return "Đã thực hiện"
    }
    return "Thực hiện"
  }
  
  return (
    <div className="mobile-container flex flex-col h-screen overflow-hidden">
      {/* Header - Fixed at top */}
      <Header/>
      
      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Category Tabs - Sticky within scrollable area */}
        {!appStore.isAuthentication ?
          <NoContent icon={"/assets/icon/cloud_large.svg"}
                     title="Đã có lỗi xảy ra"
                     description="Không có dữ liệu"
          />
          :
          <Fragment>
            <div className="sticky top-0 bg-white z-10 shadow-sm">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto no-scrollbar p-4 cursor-grab active:cursor-grabbing select-none"
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
              <Loading size={40}/>
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
                        <div className="flex items-center gap-3 border-b-2 pb-4 border-dashed">
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
                            className={`px-2 py-2 rounded-xl text-body3 font-medium transition-colors button-bg ${getStatusButtonClass(task)}`}
                          >
                            {getStatusButtonText(task)}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoContent icon={"/assets/icon/mission_large.svg"}
                               title="Bạn đã hoàn thành tất cả nhiệm vụ"
                               description="Nhiệm vụ mới sẽ được cập nhật sớm thôi"
                    />
                  )}
                </div>
              </div>
            }
          </Fragment>
        }
      </main>
      
      {/* Bottom Navigation - Fixed at bottom */}
      <BottomNavigation/>
    </div>
  )
})

export default Home
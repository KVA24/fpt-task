"use client"

import React, {Fragment, useRef} from "react"
import {observer} from "mobx-react-lite"
import BottomNavigation from "@/components/BottomNavigation"
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import RankHeader from "@/components/RankHeader.tsx";
import {appStore} from "@/stores/appStore.ts";
import {getRandomAvatar} from "@/utils/utils.ts";
import NoContent from "@/components/NoContent.tsx";
import Loading from "@/components/Loading.tsx";
import {ChevronsDown} from "lucide-react";

const Rank: React.FC = observer(() => {
  useScrollToTop()
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const userRank = appStore.leaderBoardMe?.rank || null
  
  const handleFloatingButtonClick = () => {
    if (!scrollContainerRef.current) return
    
    if (userRank && userRank <= appStore.rankLimit) {
      const userRankElement = scrollContainerRef.current.querySelector('[data-rank-id="user-rank"]')
      if (userRankElement) {
        userRankElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    } else {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }
  
  return (
    <div className="mobile-container flex flex-col h-screen overflow-hidden">
      <RankHeader/>
      
      <main className="flex-1 overflow-y-auto no-scrollbar" ref={scrollContainerRef}>
        {!appStore.isAuthentication ?
          <NoContent icon={"/assets/icon/cloud_large.svg"}
                     title="Đã có lỗi xảy ra"
                     description="Không có dữ liệu"
          />
          :
          <Fragment>
            {appStore.isLoading ?
              <Loading size={40}/>
              :
              <>
                {(appStore.leaderBoard && appStore.leaderBoard.length > 0) ? (
                    <div className="p-4 space-y-4">
                      {appStore.leaderBoard.slice(3).map((rank, index) => (
                        <div key={index}
                             data-rank-id={rank.rank === userRank ? "user-rank" : undefined}
                             className="px-4 py-2 border-b bg-gray-100 rounded-md flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-primary-600 font-rankNumber text-lg">
                              {rank.rank}
                            </p>
                            <img
                              src={rank.avatarUrl || getRandomAvatar()}
                              alt="avatar"
                              className="w-8 h-8 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = getRandomAvatar()
                              }}
                            />
                            <p className="text-body2 font-medium">
                              {rank.displayName}
                            </p>
                          </div>
                          <p className="text-body2 text-primary-600">
                            {rank.score}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                  :
                  <div
                    className="flex flex-col items-center justify-center py-12 px-4 text-center w-full bg-white space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Bảng xếp hạng đang chờ bạn
                    </h3>
                    <p className="text-gray-600 text-sm max-w-xs">
                      Hoàn thành nhiệm vụ để trở thành người mở màn bảng xếp hạng
                    </p>
                    <button className="rounded-lg text-white text-body3 font-medium p-2 button-bg">
                      Bắt đầu nhiệm vụ
                    </button>
                  </div>
                }
              </>
            }
          </Fragment>
        }
      </main>
      
      {userRank && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleFloatingButtonClick}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md shadow-lg hover:shadow-xl transition-shadow duration-200 pl-2"
          >
            <span className="text-primary-600 font-rankNumber text-lg">
              {userRank}
            </span>
            <div className="flex items-center gap-2 bg-primary-100 p-2">
              <span className="text-body3 font-medium">Bạn • {appStore.leaderBoardMe?.score || 0}</span>
              <ChevronsDown size={16} className={"text-gray-400"}/>
            </div>
          </button>
        </div>
      )}
      
      <BottomNavigation/>
    </div>
  )
})

export default Rank

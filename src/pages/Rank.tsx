"use client"

import React, {Fragment} from "react"
import {observer} from "mobx-react-lite"
import BottomNavigation from "@/components/BottomNavigation"
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import RankHeader from "@/components/RankHeader.tsx";
import {appStore} from "@/stores/appStore.ts";
import {getRandomAvatar} from "@/utils/utils.ts";
import NoContent from "@/components/NoContent.tsx";

const Rank: React.FC = observer(() => {
  useScrollToTop()
  
  return (
    <div className="mobile-container flex flex-col h-screen overflow-hidden">
      <RankHeader/>
      
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {!appStore.isAuthentication ?
          <NoContent icon={"/assets/icon/cloud_large.svg"}
                     title="Đã có lỗi xảy ra"
                     description="Không có dữ liệu"
          />
          :
          <Fragment>
            {appStore.leaderBoard && appStore.leaderBoard.length > 0 && (
              <div className="p-4 space-y-4">
                {appStore.leaderBoard.slice(3).map((rank, index) => (
                  <div key={index} className="px-4 py-2 border-b bg-gray-100 rounded-md flex items-center justify-between">
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
            )}
          </Fragment>
        }
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default Rank

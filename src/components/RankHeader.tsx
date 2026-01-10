import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {observer} from "mobx-react-lite"
import {appStore, RankType} from "@/stores/appStore.ts";
import RankFilter from "@/components/RankingFilter.tsx";
import {getRandomAvatar} from "@/utils/utils.ts";
import {Tooltip} from 'react-tooltip'

const RankHeader: React.FC = observer(() => {
  const {t} = useTranslation()
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const handleClick = () => {
    setIsStatusModalOpen(true)
  }
  
  useEffect(() => {
    appStore.getLeaderBoard().then()
  }, [appStore.rankType])
  
  const handleBackApp = () => {
    window.location.href = "lotusmiles://backScreen"
  }
  
  const [activeTab, setActiveTab] = useState('fpoint');
  
  const handleSelectStatus = (status: RankType) => {
    appStore.rankType = status;
  }
  
  
  return (
    <div
      className={`w-full z-50 max-w-[428px] h-[auto] flex-shrink-0 bg-gradient-to-b
        ${!appStore.leaderBoard ? "from-[#FE592A] to-[#FFE0D7]" : `${appStore.rankType === RankType.WEEKLY ? 'from-[#FF815E] to-[#202939]' : 'from-[#FF6167] to-[#131821]'}`}
      `}>
      {/* Main Header */}
      <header className="flex items-center justify-between px-4 bg-transparent h-[70px]">
        <div className="flex items-center gap-2">
          <img src="/assets/icon/fpt_logo.svg" alt="Logo" className="w-[141px] h-[44px]"/>
        </div>
        
        <div className="flex items-center">
          <button className="pr-2 rounded-full transition-colors relative text-body2 text-white"
                  aria-label={t("common.cart")}
                  onClick={handleClick}>
            {appStore.rankType === RankType.WEEKLY && "Theo tuần"}
            {appStore.rankType === RankType.MONTHLY && "Theo tháng"}
          </button>
          
          <button onClick={handleBackApp}
                  className="pl-2 transition-colors border-l border-white"
                  aria-label={t("common.close")}>
            <img src="/assets/icon/close.svg" alt="Close"/>
          </button>
        </div>
      
      
      </header>
      <div className="w-full">
        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-12">
          <button
            onClick={() => setActiveTab('fpoint')}
            className={`text-white pb-2 transition-all ${
              activeTab === 'fpoint'
                ? 'font-semibold border-b-2 border-white'
                : 'opacity-70'
            }`}
          >
            FPoint
          </button>
          <button
            onClick={() => setActiveTab('kimcuong')}
            className={`text-white pb-2 transition-all ${
              activeTab === 'kimcuong'
                ? 'font-semibold border-b-2 border-white'
                : 'opacity-70'
            }`}
          >
            Kim cương
          </button>
        </div>
        
        {/* Podium */}
        {(appStore.leaderBoard && appStore.leaderBoard.length > 0) ?
          <div className="relative flex items-end justify-center px-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl mb-3 shadow-lg`}>
                <img
                  src={appStore.leaderBoard[1].avatarUrl || getRandomAvatar()}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getRandomAvatar()
                  }}
                />
              </div>
              <div data-tooltip-id="rank-2" data-tooltip-content={appStore.leaderBoard[1].displayName}
                   className="text-white text-body2 font-semibold mb-1 text-center overflow-hidden text-ellipsis whitespace-nowrap w-[100px]">{appStore.leaderBoard[0].displayName}</div>
              <Tooltip id={"rank-2"}/>
              <div
                className="text-white text-body3 border border-white/20 bg-black/20 px-2 py-1 rounded-md mb-6">{appStore.leaderBoard[1].score.toLocaleString()}</div>
              <div className="flex flex-col items-center">
                <div className="perspective" style={{perspective: "1000px"}}>
                  <div
                    className="w-[100px] h-[108px] flex items-center justify-center bg-[url('/assets/images/bg-rank.png')] bg-cover bg-center bg-no-repeat shadow-[inset_32px_rgba(0,0,0,0.25)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-rankNumber">2</span>
                    </div>
                    <div
                      className="absolute bottom-full left-0 w-32 h-4 bg-white/80"
                      style={{
                        clipPath: "polygon(0 100%, 15% 0%, 78% 0%, 78% 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg`}>
                <img
                  src={appStore.leaderBoard[0].avatarUrl || getRandomAvatar()}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getRandomAvatar()
                  }}
                />
              </div>
              <div data-tooltip-id="rank-1" data-tooltip-content={appStore.leaderBoard[0].displayName}
                   className="text-white text-body2 font-semibold mb-1 text-center overflow-hidden text-ellipsis whitespace-nowrap w-[100px] z-50">{appStore.leaderBoard[0].displayName}</div>
              <Tooltip id={"rank-1"} className="z-50"/>
              <div
                className="text-white text-body3 border border-white/20 bg-black/20 px-2 py-1 rounded-md mb-6">{appStore.leaderBoard[0].score.toLocaleString()}</div>
              <div className="flex flex-col items-center">
                <div className="perspective" style={{perspective: "1000px"}}>
                  <div
                    className="w-[100px] h-[128px] flex items-center justify-center bg-[url('/assets/images/bg-rank.png')] bg-cover bg-center bg-no-repeat shadow-[inset_32px_rgba(0,0,0,0.25)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-rankNumber">1</span>
                    </div>
                    <div
                      className="absolute bottom-full left-0 w-32 h-32 bg-gradient-to-b from-[transparent] to-[#ffffff4d] mb-4"
                      style={{
                        clipPath: "polygon(15% 100%, 0% 0%, 80% 0%, 65% 100%)",
                      }}
                    />
                    <div
                      className="absolute bottom-full left-0 w-32 h-4 bg-white/80"
                      style={{
                        clipPath: "polygon(0 100%, 15% 0%, 65% 0%, 78% 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl mb-3 shadow-lg`}>
                <img
                  src={appStore.leaderBoard[2].avatarUrl || getRandomAvatar()}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = getRandomAvatar()
                  }}
                />
              </div>
              <div data-tooltip-id="rank-3" data-tooltip-content={appStore.leaderBoard[2].displayName}
                   className="text-white text-body2 font-semibold mb-1 text-center overflow-hidden text-ellipsis whitespace-nowrap w-[100px]">{appStore.leaderBoard[2].displayName}</div>
              <Tooltip id={"rank-3"}/>
              <div
                className="text-white text-body3 border border-white/20 bg-black/20 px-2 py-1 rounded-md mb-6">{appStore.leaderBoard[2].score.toLocaleString()}</div>
              <div className="flex flex-col items-center">
                <div className="perspective" style={{perspective: "1000px"}}>
                  <div
                    className="w-[100px] h-[88px] flex items-center justify-center bg-[url('/assets/images/bg-rank.png')] bg-cover bg-center bg-no-repeat shadow-[inset_32px_rgba(0,0,0,0.25)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-rankNumber">3</span>
                    </div>
                    <div
                      className="absolute bottom-full left-0 w-32 h-4 bg-white/80"
                      style={{
                        clipPath: "polygon(0 100%, 0% 0%, 65% 0%, 78% 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="relative flex items-end justify-center px-4 mt-20">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                <div className="perspective" style={{perspective: "1000px"}}>
                  <div
                    className="w-[100px] h-[108px] flex items-center justify-center bg-[url('/assets/images/bg-rank.png')] bg-cover bg-center bg-no-repeat shadow-[inset_32px_rgba(0,0,0,0.25)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-rankNumber">2</span>
                    </div>
                    <div
                      className="absolute bottom-full left-0 w-32 h-4 bg-white/80"
                      style={{
                        clipPath: "polygon(0 100%, 15% 0%, 78% 0%, 78% 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <div
                className={`w-[100px] rounded-full flex items-center justify-center text-3xl mb-8 shadow-lg bg-transparent`}>
                <img
                  src={"assets/images/crown.svg"}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="perspective" style={{perspective: "1000px"}}>
                  <div
                    className="w-[100px] h-[128px] flex items-center justify-center bg-[url('/assets/images/bg-rank.png')] bg-cover bg-center bg-no-repeat shadow-[inset_32px_rgba(0,0,0,0.25)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-rankNumber">1</span>
                    </div>
                    <div
                      className="absolute bottom-full left-0 w-32 h-4 bg-white/80"
                      style={{
                        clipPath: "polygon(0 100%, 15% 0%, 65% 0%, 78% 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                <div className="perspective" style={{perspective: "1000px"}}>
                  <div
                    className="w-[100px] h-[88px] flex items-center justify-center bg-[url('/assets/images/bg-rank.png')] bg-cover bg-center bg-no-repeat shadow-[inset_32px_rgba(0,0,0,0.25)]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-6xl font-rankNumber">3</span>
                    </div>
                    <div
                      className="absolute bottom-full left-0 w-32 h-4 bg-white/80"
                      style={{
                        clipPath: "polygon(0 100%, 0% 0%, 65% 0%, 78% 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      
      </div>
      
      <RankFilter
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSelectStatus={handleSelectStatus}
        selectedStatus={appStore.rankType}
      />
    </div>
  )
})

export default RankHeader
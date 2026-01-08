import React from "react"
import BottomNavigation from "@/components/BottomNavigation"
import {observer} from "mobx-react-lite";
import Header from "@/components/Header.tsx";

const Profile: React.FC = observer(() => {
  
  return (
    <div className="mobile-container flex flex-col h-screen overflow-hidden">
      <Header noFilter/>
      
      <main className="flex-1 overflow-y-auto no-scrollbar">
      
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default Profile

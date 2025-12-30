import React from "react"
import {observer} from "mobx-react-lite"
import Header from "@/components/Header"
import BottomNavigation from "@/components/BottomNavigation"
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";

const Home: React.FC = observer(() => {
  useScrollToTop()
  // const handleSearchClick = () => {
  //   navigate("/search") // Navigate to search page
  // }
  
  return (
    <div className="mobile-container min-h-screen">
      <Header/>
      
      <main className="pb-24 mt-16">
      
      </main>
      
      <BottomNavigation/>
    </div>
  )
})

export default Home

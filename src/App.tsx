import React, {useEffect} from "react"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {observer} from "mobx-react-lite"
import Home from "@/pages/Home"
import History from "@/pages/History"
import ProtectedRoute from "@/components/ProtectedRoute"
import {ToastContainer} from "react-toastify";
import {stores} from "@/stores"
import i18n from "i18next";
import Profile from "@/pages/Profile.tsx";
import {setAuthorization} from "@/api/apiCore.ts";
import {useDisableZoom} from "@/hooks/useDisableZoom.ts";
import Rank from "@/pages/Rank.tsx";
import {usePullToRefresh} from "@/hooks/pullToRefresh.ts";
import {PullToRefreshIndicator} from "@/components/PullToRefresgIndicator.tsx";

const useLanguageListener = () => {
  useDisableZoom()
  
  useEffect(() => {
    const handler = (lng: string) => {
      console.log(`Language changed to: ${lng}`);
      if (localStorage.getItem('wii-token')) {
        window.location.href = `/?token=${localStorage.getItem('wii-token')}`;
      } else {
        window.location.reload()
      }
    };
    
    i18n.on('languageChanged', handler);
    
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);
}

const App: React.FC = observer(() => {
  useLanguageListener()
  const pullToRefresh = usePullToRefresh(200);
  const {appStore} = stores
  
  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenOnParam = params.get("token");
      if (tokenOnParam) {
        localStorage.setItem('wii-token', tokenOnParam || '');
        setAuthorization(tokenOnParam)
      }
    };
    init().then();
  }, [])
  
  useEffect(() => {
    if (localStorage.getItem("wii-token")) {
      appStore.getProfile().then(() => {
      })
    }
  }, []);
  
  return (
    <Router basename="/" future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <div className="App">
        <PullToRefreshIndicator {...pullToRefresh} />
        <Routes>
          <Route
            path="/"
            index
            element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            index
            element={
              <ProtectedRoute>
                <History/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rank"
            element={
              <ProtectedRoute>
                <Rank/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <ToastContainer limit={1} style={{marginTop: 70}}/>
    </Router>
  )
})

export default App

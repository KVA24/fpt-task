import React, {useEffect} from "react"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {observer} from "mobx-react-lite"
import Home from "@/pages/Home"
import History from "@/pages/History"
import ProtectedRoute from "@/components/ProtectedRoute"
import {ToastContainer} from "react-toastify";
import {stores} from "@/stores"
import sha256 from 'crypto-js/sha256';
import i18n from "i18next";
import Profile from "@/pages/Profile.tsx";
import {setAuthorization} from "@/api/apiCore.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import {useDisableZoom} from "@/hooks/useDisableZoom.ts";
import {v4 as uuidv4} from "uuid";

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
  const {appStore, cartStore} = stores
  const {executeRecaptcha} = useGoogleReCaptcha()
  
  const handleMergeCart = async () => {
    if (!executeRecaptcha) {
      console.error("Failed to load reCAPTCHA provider!")
      cartStore.mergeCart().then()
      return
    }
    const sign = await executeRecaptcha()
    cartStore.mergeCart(sign).then()
  }
  
  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem("wii-guestId")) {
        const generatedToken = await generateTokenFromIPAndUserAgent();
        localStorage.setItem("wii-guestId", generatedToken);
      }
      
      const params = new URLSearchParams(window.location.search);
      const tokenOnParam = params.get("token");
      if (tokenOnParam) {
        localStorage.setItem('wii-token', tokenOnParam || '');
        setAuthorization(tokenOnParam)
      } else {
        if (window.location.pathname === "/") {
          localStorage.removeItem('wii-token')
        }
        // const wiiToken = localStorage.getItem("wii-token");
        // if (wiiToken) {
        //   setAuthorization(wiiToken)
        // }
      }
      
      if (localStorage.getItem('wii-token')) {
        appStore.getProfile().then(() => {
          handleMergeCart().then(() => {
            setTimeout(() => {
              cartStore.getCart().then()
            }, 500)
          })
        })
      } else {
        cartStore.getCart().then()
      }
      
    };
    init().then();
  }, [])
  
  useEffect(() => {
    appStore.getAllCategory().then()
  }, [appStore.isLocal]);
  
  async function generateTokenFromIPAndUserAgent(): Promise<string> {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const {ip} = await ipResponse.json();
    
    localStorage.setItem("wii-ip", ip);
    
    const userAgent = navigator.userAgent;
    const rawString = `${ip}|${userAgent}|${uuidv4()}`;
    
    return sha256(rawString).toString();
  }
  
  return (
    <Router basename="/" future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <div className="App">
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
            path="/rank"
            element={
              <ProtectedRoute>
                <History/>
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

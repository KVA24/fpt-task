import React, {useEffect} from "react"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {observer} from "mobx-react-lite"
import Home from "@/pages/Home"
import History from "@/pages/History"
import Guide from "@/pages/Guide"
import ESimDetail from "@/pages/ESimDetail.tsx";
import Cart from "@/pages/Cart"
import ProtectedRoute from "@/components/ProtectedRoute"
import {ToastContainer} from "react-toastify";
import Payment from "@/pages/Payment.tsx";
import PaymentSuccess from "@/pages/PaymentSuccess.tsx";
import PaymentFailure from "@/pages/PaymentFailure.tsx";
import Search from "@/pages/Search.tsx";
import {stores} from "@/stores"
import AllCountries from "@/pages/AllCountries.tsx";
import sha256 from 'crypto-js/sha256';
import i18n from "i18next";
import Profile from "@/pages/Profile.tsx";
import {setAuthorization} from "@/api/apiCore.ts";
import HistoryDetail from "@/pages/HistoryDetail.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3"
import PaymentRush from "@/pages/PaymentRush.tsx";
import Contact from "@/pages/Contact.tsx";
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
            path="/history"
            element={
              <ProtectedRoute>
                <History/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history/:id"
            element={
              <ProtectedRoute>
                <HistoryDetail/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide"
            element={
              <ProtectedRoute>
                <Guide/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact/>
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
          <Route
            path="/esim/:id"
            element={
              <ProtectedRoute>
                <ESimDetail/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/rush"
            element={
              <ProtectedRoute>
                <PaymentRush/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/:lang/payment/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/:lang/payment/fail"
            element={
              <ProtectedRoute>
                <PaymentFailure/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/countries/:id"
            element={
              <ProtectedRoute>
                <AllCountries/>
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

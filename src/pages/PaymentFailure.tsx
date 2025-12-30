"use client"

import React, {useEffect} from "react"
import {useParams} from "react-router-dom"
import {useTranslation} from "react-i18next"
import i18n from "i18next";

interface PaymentFailureProps {
  errorMessage?: string
  orderId?: string
  fullName?: string
  phoneNumber?: string
  email?: string
  description?: string
}

// const params = new URLSearchParams(window.location.search);

const PaymentFailure: React.FC<PaymentFailureProps> = ({
                                                         // errorMessage = params.get('errorMessage'),
                                                         // orderId = params.get("orderCode") || "",
                                                         // fullName = params.get("name") || "",
                                                         // phoneNumber = params.get("phone") || "",
                                                         // email = params.get("email") || "",
                                                       }) => {
  // const navigate = useNavigate()
  const {t} = useTranslation()
  const {lang} = useParams()
  
  useEffect(() => {
    i18n.changeLanguage(lang).then()
  }, [])
  
  const handleBack = () => {
    if (localStorage.getItem('wii-token')) {
      window.location.href = `/?token=${localStorage.getItem('wii-token')}`;
    } else {
      window.location.href = "/"
    }
  }
  
  return (
    <div className="mobile-container bg-white min-h-screen p-4 flex flex-col justify-between">
      <main className="flex flex-col items-center text-center mt-20 flex-grow h-full justify-between">
        <div className={"flex flex-col items-center"}>
          <div className="relative w-36 h-32 mb-6 flex items-center justify-center">
            <img src="/assets/icon/fail.png" alt="Check" className="w-full h-auto"/>
          </div>
          
          <h1 className="text-xl font-bold text-gray-900 mb-4">{t("paymentStatus.failureTitle")}</h1>
          
          {/*<p className="text-base text-gray-700 px-4 mb-8">{errorMessage}</p>*/}
        </div>
      </main>
      <div className="w-full max-w-sm p-4 bg-white border-gray-100">
        <button
          onClick={handleBack}
          className="w-full bg-white text-[#006885] border-2 border-[#006885] rounded-sm py-3 font-semibold shadow-sm hover:bg-gray-300 transition-colors"
        >
          {t("paymentStatus.back")}
        </button>
      </div>
    </div>
  )
}

export default PaymentFailure

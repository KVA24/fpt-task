"use client"

import React, {useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useTranslation} from "react-i18next"
import i18n from "i18next";
import {orderStore} from "@/stores/OrderStore.ts";

interface PaymentSuccessProps {
  orderId?: string
  orderCode?: string
  fullName?: string
  phoneNumber?: string
  email?: string
}

const params = new URLSearchParams(window.location.search);

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
                                                         orderId = params.get("orderId") || "",
                                                         orderCode = params.get("orderCode") || "",
                                                         fullName = params.get("name") || "",
                                                         phoneNumber = params.get("phone") || "",
                                                         email = params.get("email") || "",
                                                       }) => {
  const navigate = useNavigate()
  const {t} = useTranslation()
  const {lang} = useParams()
  
  useEffect(() => {
    i18n.changeLanguage(lang).then()
  }, [])
  
  const handleHistory = () => {
    orderStore.getOrderDetail(orderId).then(() => {
      navigate(`/history/${orderId}?token=${localStorage.getItem('wii-token')}`)
    })
  }
  
  const handleComplete = () => {
    if (localStorage.getItem('wii-token')) {
      window.location.href = `/?token=${localStorage.getItem('wii-token')}`;
    } else {
      window.location.href = "/"
    }
  }
  
  return (
    <div className="mobile-container bg-white min-h-screen p-4 flex flex-col justify-between">
      <main className="flex flex-col items-center text-center flex-grow">
        <div className="relative flex items-center justify-center"
             style={{
               width: "230px",
               height: "300px",
               backgroundImage: "url('/assets/icon/bg_success.png')",
               backgroundSize: "contain",
               backgroundPosition: "center",
               backgroundRepeat: "repeat",
               backgroundBlendMode: "multiply",
               backgroundAttachment: "fixed",
               transform: "scale(1)",
             }}
        >
          <img src="/assets/icon/success.png" alt="Check" className="w-auto h-auto"/>
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 mb-4">{t("paymentStatus.successTitle")}</h1>
        
        <div className="p-4 rounded-xl w-full text-left shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("paymentStatus.transactionDetails")}</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">{t("paymentStatus.orderId")}</span>
              <span>{orderCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("paymentStatus.fullName")}</span>
              <span>{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("paymentStatus.phoneNumber")}</span>
              <span>{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email</span>
              <span>{email}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          {t("paymentStatus.eSimSent", {email})}
          <br/>
          {t("paymentStatus.guideLink")}
          <a href="/guide" className="text-blue-500 hover:underline ml-1">
            {t("paymentStatus.here")}
          </a>
          .
        </p>
      </main>
      
      {/* Bottom Button */}
      <div className="w-full max-w-sm p-4 bg-white border-gray-100">
        <button
          onClick={handleHistory}
          className="w-full bg-[#06718F] text-white py-3 rounded-md font-semibold shadow-md hover:bg-teal-700 transition-colors"
        >
          {t("paymentStatus.seeOrder")}
        </button>
        <button
          onClick={handleComplete}
          className="w-full bg-white text-[#006885] border-2 border-[#006885] rounded-md py-3 font-semibold shadow-sm hover:bg-gray-300 transition-colors mt-4"
        >
          {t("paymentStatus.complete")}
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccess

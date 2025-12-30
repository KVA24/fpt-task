"use client"

import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import {useNavigate} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {Minus, Plus} from "lucide-react"
import {stores} from "@/stores"
import {formatCurrency} from "@/utils/utils.ts";
import SimpleHeader from "@/components/SimpleHeader.tsx";
import NoContent from "@/components/NoContent.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";

const Cart: React.FC = observer(() => {
  useScrollToTop()
  const navigate = useNavigate()
  const {t} = useTranslation()
  const {cartStore} = stores
  
  useEffect(() => {
    cartStore.getCart().then()
  }, [])
  
  const {executeRecaptcha} = useGoogleReCaptcha()
  
  const handleEditItem = async () => {
    if (!executeRecaptcha) {
      console.error("Failed to load reCAPTCHA provider!")
      return
    }
    const sign = await executeRecaptcha()
    cartStore.updateItem(sign).then()
    
  }
  
  const handleRemoveItem = (index: number) => {
    cartStore.items.splice(index, 1)
    handleEditItem().then()
  }
  
  const handlePlaceOrder = () => {
    if (cartStore.items.length === 0) {
      alert("Error")
      return
    }
    navigate("/payment")
  }
  
  return (
    <div className="mobile-container bg-white">
      {/* Main Header */}
      <SimpleHeader noCart noClose noSearch title={t("common.cart")}/>
      
      <main className="p-4 pb-24 mt-16">
        {cartStore.items?.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <NoContent title={t('cart.emptyCart')} description={t('cart.emptyCartDescription')}/>
            <button className="bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white w-full py-3 rounded-md"
                    onClick={() => {
                      navigate("/")
                    }}>
              {t('cart.exploreNow')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartStore.items?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center"
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-white flex items-center justify-center bg-gray-100">
                    <img
                      src={`${item.productGroupImageUrl}`}
                      alt={`${item.productGroupTitle} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{item.productGroupTitle}</h3>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <img src="/assets/icon/close.png" alt="Search" className="w-4 h-4"/>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.data} • {item.validityDays} {t('common.day')} {item.sms > 0 && ` • ${item.sms} sms`} {item.voice > 0 && ` • ${item.voice} voice`}
                      {/*<button className="text-blue-500 text-sm">{t("common.edit")}</button>*/}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className="text-blue-600 font-bold">{formatCurrency((item.sellingPrice ?? 0) * (item.quantity ?? 0))}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          disabled={item.quantity === 1 || cartStore.isLoadingButton}
                          onClick={async () => {
                            item.quantity = (item.quantity ?? 0) - 1
                            await handleEditItem()
                          }}
                          className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <Minus size={16}/>
                        </button>
                        <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          disabled={item.quantity === 999 || cartStore.isLoadingButton}
                          onClick={async () => {
                            item.quantity = (item.quantity ?? 0) + 1
                            await handleEditItem()
                          }}
                          className="w-7 h-7 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                          <Plus size={16}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      
      {/* Bottom Order Bar */}
      <div
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white p-4 shadow-lg flex items-center justify-between border-t border-gray-100 rounded-t-2xl">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500">{t("cart.total")}</span>
          <span
            className="text-xl font-bold text-gray-900">{cartStore.totalPrice ? formatCurrency(cartStore.totalPrice) : "---"}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={cartStore.items.length === 0}
          className="bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white px-6 py-3 rounded-full font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {t("cart.order")}
        </button>
      </div>
    </div>
  )
})

export default Cart

"use client"

import React, {Fragment, useEffect, useMemo, useState} from "react"
import {observer} from "mobx-react-lite"
import {useNavigate, useParams} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {ChevronDown, Download, Info, Mail, Minus, Plus, RefreshCcw,} from "lucide-react"
import {stores} from "@/stores"
import {Capacity, EsimProductVariant} from "@/stores/AppStore"
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3'
import {formatCurrency} from "@/utils/utils.ts";
import i18n from "i18next";
import InfoProductModal from "@/components/InfoProductModal.tsx";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import DeviceListModal from "@/components/DeviceListModal.tsx";
import Spinner from "@/components/Spinner.tsx";
import Loading from "@/components/Loading.tsx";
import NoContent from "@/components/NoContent.tsx";

// Helper function to format data amount from MB to GB
// const formatDataAmount = (dataAmount: string) => {
//   const mb = Number.parseInt(dataAmount, 10)
//   if (mb >= 1024 && mb % 1024 === 0) {
//     return `${mb / 1024}GB`
//   }
//   return `${mb}MB`
// }

const EsimDetail: React.FC = observer(() => {
  useScrollToTop()
  const {id} = useParams<{ id: string }>()
  const {t} = useTranslation()
  const navigate = useNavigate()
  const {appStore, cartStore} = stores
  
  const [selectedCapacity, setSelectedCapacity] = useState<Capacity | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<EsimProductVariant | null>(null)
  const [variantId, setVariantId] = useState<number | undefined>(undefined)
  const [isSeeMoreOpen, setIsSeeMoreOpen] = useState(false)
  const [isDeviceListModalOpen, setIsDeviceListModalOpen] = useState(false)
  const [info, setInfo] = useState<any>(null)
  
  const howToUse: any = [
    {
      title: i18n.t('installGuide.title-1'),
      description: i18n.t('installGuide.des-1')
    },
    {
      title: i18n.t('installGuide.title-2'),
      description: i18n.t('installGuide.des-2')
    },
    {
      title: i18n.t('installGuide.title-3'),
      description: i18n.t('installGuide.des-3')
    },
    {
      title: i18n.t('installGuide.title-4'),
      description: i18n.t('installGuide.des-4')
    },
    {
      title: i18n.t('installGuide.title-5'),
      description: i18n.t('installGuide.des-5')
    },
  ]
  
  useEffect(() => {
    appStore.getProductGroupDetail(id).then(
      () => {
        appStore.activeEsimProductId = appStore.productGroupDetail?.product[0].id || null
        appStore.infoProduct = appStore.productGroupDetail?.product.find(p => p.id === appStore.activeEsimProductId)
      }
    )
  }, [id])
  
  // Helper function to compare two capacity objects
  const areCapacitiesEqual = (cap1: Capacity, cap2: Capacity) => {
    return cap1.dataAmount === cap2.dataAmount && cap1.sms === cap2.sms && cap1.voice === cap2.voice && cap1.isUnlimited === cap2.isUnlimited && cap1.data === cap2.data
  }
  
  // Get all unique capacities available for this product
  const allUniqueCapacities = useMemo(() => {
    const capacities: Capacity[] = []
    const seen = new Set<string>()
    appStore.infoProduct?.capacityToDays.forEach((item: any) => {
      const key = JSON.stringify(item.capacity)
      if (!seen.has(key)) {
        capacities.push(item.capacity)
        seen.add(key)
      }
    })
    return capacities
  }, [appStore.infoProduct?.capacityToDays])
  
  // Get all unique durations available for this product
  const allUniqueDurations = useMemo(() => {
    const durations: number[] = []
    const seen = new Set<number>()
    appStore.infoProduct?.dayToCapacities.forEach((item) => {
      if (!seen.has(item.day)) {
        durations.push(item.day)
        seen.add(item.day)
      }
    })
    return durations.sort((a, b) => a - b) // Sort for consistent order
  }, [appStore.infoProduct?.dayToCapacities])
  
  // Check if a specific capacity is available for the currently selected duration
  const isCapacityAvailableForSelectedDuration = (capacity: Capacity) => {
    // If no duration is selected, all capacities are potentially available
    if (selectedDuration === null) return true
    
    const dayEntry = appStore.infoProduct?.dayToCapacities.find((d) => d.day === selectedDuration)
    if (!dayEntry) return false // Should not happen if selectedDuration is valid
    
    return dayEntry.capacities.some((c) => areCapacitiesEqual(c, capacity))
  }
  
  // Check if a specific duration is available for the currently selected capacity
  const isDurationAvailableForSelectedCapacity = (duration: number) => {
    // If no capacity is selected, all durations are potentially available
    if (selectedCapacity === null) return true
    
    const capacityEntry = appStore.infoProduct?.capacityToDays.find(
      (c) => selectedCapacity && areCapacitiesEqual(c.capacity, selectedCapacity),
    )
    if (!capacityEntry) return false // Should not happen if selectedCapacity is valid
    
    return capacityEntry.days.includes(duration)
  }
  
  // Handle capacity selection
  const handleCapacitySelect = (capacity: Capacity, isDisabled: boolean) => {
    if (selectedCapacity && areCapacitiesEqual(selectedCapacity, capacity)) {
      // If the clicked capacity is already selected, deselect it
      setSelectedCapacity(null)
      console.log("Deselecting capacity.")
    } else {
      if (selectedCapacity && selectedDuration) {
        if (isDisabled) {
          setSelectedCapacity(null)
          setSelectedDuration(null)
          setSelectedCapacity(capacity)
        } else {
          setSelectedCapacity(capacity)
        }
      } else {
        if (isDisabled) {
          setSelectedCapacity(null)
          setSelectedDuration(null)
          setSelectedCapacity(capacity)
        } else {
          setSelectedCapacity(capacity)
        }
      }
    }
  }
  
  // Handle duration selection
  const handleDurationSelect = (duration: number, isDisabled: boolean) => {
    if (selectedDuration === duration) {
      // If the clicked duration is already selected, deselect it
      setSelectedDuration(null)
      console.log("Deselecting duration.")
    } else {
      if (selectedCapacity && selectedDuration) {
        if (isDisabled) {
          setSelectedCapacity(null)
          setSelectedDuration(null)
          setSelectedDuration(duration)
        } else {
          setSelectedDuration(duration)
        }
      } else {
        if (isDisabled) {
          setSelectedCapacity(null)
          setSelectedDuration(null)
          setSelectedDuration(duration)
        } else {
          setSelectedDuration(duration)
        }
      }
    }
  }
  
  const {executeRecaptcha} = useGoogleReCaptcha()
  
  const handleAddToCart = async () => {
    if (!executeRecaptcha) {
      console.error("Failed to load reCAPTCHA provider!")
      return
    }
    if (selectedCapacity && selectedDuration) {
      const sign = await executeRecaptcha()
      cartStore.addItem(variantId, appStore.infoProduct?.id, currentPrice, quantity, sign).then()
    }
  }
  
  const handleBuyNow = async () => {
    if (!executeRecaptcha) {
      console.error("Failed to load reCAPTCHA provider!")
      return
    }
    if (selectedCapacity && selectedDuration) {
      cartStore.itemRush = null
      cartStore.itemRush = {
        productVariantId: variantId,
        productId: appStore.infoProduct?.id,
        sellingPrice: currentPrice,
        quantity: quantity,
        dataAmount: selectedVariant?.dataAmount || 0,
        data: selectedVariant?.data || "",
        validityDays: selectedVariant?.validityDays || 0,
        sms: selectedVariant?.sms || 0,
        voice: selectedVariant?.voice || 0,
        productImageUrl: appStore.infoProduct?.imageUrl || "",
        productTitle: appStore.infoProduct?.title || "",
        productGroupImageUrl: appStore.productGroupDetail?.productGroup?.imageUrl || "",
        productGroupTitle: appStore.productGroupDetail?.productGroup?.title || "",
      }
      navigate("/payment/rush")
    }
  }
  
  useEffect(() => {
    if (selectedCapacity && selectedDuration && appStore.productGroupDetail) {
      const foundVariant = appStore.infoProduct?.variants.find(
        (variant) =>
          variant.dataAmount === Number.parseInt(selectedCapacity.dataAmount) &&
          variant.sms == selectedCapacity.sms &&
          variant.voice == selectedCapacity.voice &&
          variant.validityDays === selectedDuration &&
          variant.isUnlimited === selectedCapacity.isUnlimited &&
          variant.data === selectedCapacity.data,
      )
      // console.log("Found variant:", foundVariant)
      if (foundVariant) {
        setSelectedVariant(foundVariant)
        setCurrentPrice(foundVariant.sellingPrice)
        setVariantId(foundVariant.id)
      } else {
        setCurrentPrice(null) // No matching variant found
      }
    } else {
      setCurrentPrice(null) // Reset price if capacity or duration is not selected
    }
  }, [selectedCapacity, selectedDuration, appStore.productGroupDetail])
  
  // const isInternational = appStore.productGroupDetail.productGroup.isInternational
  
  return (
    <div className="mobile-container bg-white">
      {/* Main Header */}
      <SimpleHeader noClose title={appStore.productGroupDetail?.productGroup.title}/>
      
      {appStore.productGroupDetail?.product && appStore.productGroupDetail?.product.length > 1 &&
        <>
          {/* Provider Tabs */}
          <div className="flex gap-2 bg-white p-3 pb-1 mt-16 overflow-x-auto no-scrollbar">
            {appStore.productGroupDetail?.product.map((product) => (
              <button
                key={product.id}
                disabled={appStore.activeEsimProductId === product.id}
                onClick={() => {
                  appStore.activeEsimProductId = product.id
                  appStore.infoProduct = appStore.productGroupDetail?.product.find(p => p.id === appStore.activeEsimProductId)
                  setSelectedCapacity(null)
                  setSelectedDuration(null)
                }}
                className={`p-2 font-semibold transition-colors whitespace-nowrap ${
                  appStore.activeEsimProductId === product.id
                    ? "text-primary-600 after:content-[''] after:block after:w-1/5 after:border-b-2 after:border-[#006885] after:mx-auto after:mt-1.5"
                    : "text-gray-500 after:content-[''] after:block after:w-1/5 after:border-b-2 after:border-[#FFFFFF] after:mx-auto after:mt-1.5"
                }`}
              >
                {product.title}
              </button>
            ))}
          </div>
          <div className="border-b border-dashed border-gray-300 mx-4"></div>
        </>
      }
      
      <main className={`pb-36 ${appStore.productGroupDetail?.product.length === 1 && 'pt-2 mt-16'}`}>
        
        {appStore.productGroupDetail ?
          <Fragment>
            {/* Product Card */}
            <div
              className="mx-4 mt-4 p-4 rounded-lg relative overflow-hidden"
              style={{
                backgroundImage: "url('/assets/images/banner-sim.png')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "repeat",
                backgroundBlendMode: "multiply",
                backgroundAttachment: "fixed",
                transform: "scale(1)",
              }}
            >
              {appStore.isLoading ? <Loading size={'lg'} containerClassName="h-44"/>
                :
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-white flex items-center justify-center bg-gray-100 flex-shrink-0">
                      <img
                        src={appStore.productGroupDetail?.productGroup?.imageUrl}
                        alt={` flag`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button onClick={() => setIsDeviceListModalOpen(true)} className="">
                  <span
                    className="text-xs text-gray-800 bg-white opacity-50 rounded-lg flex item-center gap-1 py-1 px-2">
                    {t('esimDetail.checkDevice')} <Info size={16} className=""/>
                  </span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {allUniqueDurations.length === 1 && allUniqueCapacities.length === 1 ?
                      formatCurrency(appStore.infoProduct?.lowestPrice ?? 0)
                      :
                      `${t('common.from')} ${formatCurrency(appStore.infoProduct?.lowestPrice ?? 0)}`
                    }
                  </h2>
                  <ul className="text-gray-600 text-sm space-y-2">
                    {/*<li className={"line-clamp-2"}>*/}
                    {/*  <span*/}
                    {/*    className="font-semibold">{t("esimDetail.carrier")}: </span>{appStore.infoProduct?.carriers?.map((carrier) => carrier.name).join(", ")}*/}
                    {/*</li>*/}
                    {/*<li className={"line-clamp-2"}>*/}
                    {/*  <span*/}
                    {/*    className="font-semibold">{t("esimDetail.productType")}: </span>*/}
                    {/*  {appStore.infoProduct?.packageType}*/}
                    {/*</li>*/}
                    <li className="flex justify-end items-center">
                      {/*<div className="flex items-center gap-1">*/}
                      {/*  <span*/}
                      {/*    className="font-semibold">{t("esimDetail.days")}: </span>*/}
                      {/*  {appStore.infoProduct?.dayToCapacities && appStore.infoProduct?.dayToCapacities.length > 1 ?*/}
                      {/*    <>*/}
                      {/*      {appStore.infoProduct?.dayToCapacities[0]?.day} - {appStore.infoProduct?.dayToCapacities[appStore.infoProduct?.dayToCapacities?.length - 1]?.day}*/}
                      {/*    </>*/}
                      {/*    :*/}
                      {/*    <>*/}
                      {/*      {appStore.infoProduct?.dayToCapacities[0]?.day}*/}
                      {/*    </>*/}
                      {/*  }*/}
                      {/*</div>*/}
                      {/*<div className="flex items-center gap-1">*/}
                      {/*<span*/}
                      {/*  className="font-semibold">{t("esimDetail.productType")}: </span>*/}
                      {/*  {appStore.infoProduct?.packageType}*/}
                      {/*</div>*/}
                      <button className="flex items-center justify-center bg-white h-6 w-6 rounded-full"
                              onClick={() => {
                                setInfo(appStore.infoProduct)
                                setIsSeeMoreOpen(true)
                              }}>
                        <ChevronDown size={18} className="text-gray-600"/>
                      </button>
                    </li>
                  </ul>
                </>
              }
            
            </div>
            
            <div className="flex items-center justify-center my-4 text-gray-500 text-xs">
              <Mail size={16} className="mr-1"/>
              <span>{t("esimDetail.deliveryInfo")}</span>
            </div>
            
            {/* Duration Selection */}
            <div className="bg-white mx-4 mt-4 p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <RefreshCcw size={20} className="mr-2 text-yellow-500"/>
                {t("esimDetail.chooseDay")}
              </h3>
              {appStore.isLoading ? <Loading size={'lg'} containerClassName={""}/>
                :
                <div className="grid grid-cols-4 gap-3">
                  {allUniqueDurations.map((duration) => {
                    const isDisabled = !isDurationAvailableForSelectedCapacity(duration)
                    return (
                      <button
                        key={duration}
                        onClick={() => {
                          handleDurationSelect(duration, isDisabled)
                        }}
                        // disabled={isDisabled}
                        className={`min-h-16 flex items-center justify-center text-sm font-semibold rounded-md transition-all duration-200
                    ${
                          selectedDuration === duration
                            ? "border-2 border-[#006885] text-[#006885] bg-blue-50 shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                      >
                        <span className="relative text-normal">{duration}</span>
                      </button>
                    )
                  })}
                </div>
              }
            </div>
            
            {/* Capacity Selection */}
            <div className="bg-white mx-4 mt-4 p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Download size={20} className="mr-2 text-blue-500"/>
                {t("esimDetail.capacity")}
              </h3>
              {appStore.isLoading ? <Loading size={'lg'} containerClassName={""}/>
                :
                <div className="grid grid-cols-3 gap-3">
                  {allUniqueCapacities.map((capacity) => {
                    const isDisabled = !isCapacityAvailableForSelectedDuration(capacity)
                    return (
                      <button
                        key={JSON.stringify(capacity)}
                        onClick={() => {
                          handleCapacitySelect(capacity, isDisabled)
                        }}
                        // disabled={isDisabled}
                        className={`flex flex-col items-center justify-center text-sm font-semibold rounded-md transition-all duration-200 text-center py-2 px-4
                    ${
                          selectedCapacity && areCapacitiesEqual(selectedCapacity, capacity)
                            ? "border-2 border-[#006885] text-[#006885] bg-blue-50 shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                      >
                  <span className="relative text-md">
                    {capacity.data}
                  </span>
                        {capacity.sms > 0 && (
                          <span className="relative text-xs text-gray-500 mt-1">{capacity.sms} SMS</span>
                        )}
                        {capacity.voice > 0 && (
                          <span className="relative text-xs text-gray-500">{capacity.voice} Voice</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              }
            </div>
          </Fragment>
          :
          <div className="mt-16 p-4">
            <NoContent title={t('common.notFound')}/>
          </div>
        }
        
        {/* How to Use eSIM */}
        <div className="text-white mx-4 mt-4 p-5 rounded-2xl shadow-sm"
             style={{
               backgroundImage: "url('/assets/images/bg-howtouse.png')",
               backgroundSize: "cover",
               backgroundPosition: "center",
               backgroundRepeat: "no-repeat",
               backgroundBlendMode: "multiply",
               backgroundAttachment: "fixed",
               transform: "scale(1)",
             }}
        >
          <h3 className="text-lg font-bold mb-4 text-center">{t("esimDetail.howToUseEsim")}</h3>
          <div className="space-y-4 relative">
            {howToUse.map((step: any, index: number) => (
              <div key={index} className="flex items-center relative gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 bg-[#006885] text-[#FFDD82] rounded-full flex items-center justify-center font-bold text-sm mr-3 z-10 border-0 outline-none">
                  {index + 1}
                </div>
                <div className="flex-grow border-white/50 pl-4 -ml-7 py-1">
                  <h4 className="font-semibold text-white">{step.title}</h4>
                  <p className="text-white text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/*<div className="mx-4 mt-4 p-5 rounded-2xl shadow-sm">*/}
        {/*  <h3 className="text-md font-bold mb-4 text-center">{t("esimDetail.howToUseEsim")}</h3>*/}
        {/*  <div className="space-y-4 relative">*/}
        {/*    {howToUse.map((step: any, index: number) => (*/}
        {/*      <div key={index} className="flex-grow pl-4 -ml-7">*/}
        {/*        <span className="text-sm">{step.title}</span>*/}
        {/*        <p className="text-xs text-gray-500 mt-2">{step.description}</p>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </main>
      
      {/* Bottom Add to Cart Bar with rounded corners */}
      {selectedCapacity && selectedDuration && (
        <div
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white p-4 shadow-lg flex flex-col space-y-2 border-t border-gray-100 rounded-t-2xl">
          <div className="flex gap-2 items-center justify-end">
            <span className="text-md text-gray-500">{t("cart.total")}:</span>
            <span className="text-xl font-bold text-primary-600">
            {currentPrice !== null ? formatCurrency(currentPrice * quantity) : "---"}
            </span>
          </div>
          <div className="flex gap-1 items-center justify-end">
            <img
              src="/assets/icon/logo_text.svg" alt="mile" className="w-auto h-full"/>
            <span className="text-md text-gray-500">{t("cart.earn")}</span>
            <span className="text-xl font-bold text-primary-600 flex gap-1 items-center">
            <img
              src="/assets/icon/ico_mile.svg" alt="mile" className="w-5 h-5 rounded-full"/>{currentPrice !== null ? (
              localStorage.getItem("i18nextLng") === "vi" ? Math.ceil((currentPrice * quantity) / 2500) : Math.ceil((currentPrice * quantity) * 10)
            ) : "---"} {t('cart.miles')}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Minus size={20}/>
              </button>
              <span className="text-lg font-semibold text-gray-900">{quantity}</span>
              <button
                disabled={quantity === 999}
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Plus size={20}/>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {(!selectedCapacity || !selectedDuration || currentPrice === null) ?
                <button
                  className="bg-white border border-gray-200 text-white px-4 py-3 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src={"/assets/icon/add-cart.png"} alt={"add to cart"}/>
                </button>
                :
                <button
                  disabled={cartStore.isLoadingButton}
                  onClick={handleAddToCart}
                  className="bg-white border-2 border-primary-600 text-white px-4 py-3 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartStore.isLoadingButton ? <Spinner size={"md"}/> :
                    <img src={"/assets/icon/add-cart-active.png"} alt={"add to cart"}/>
                  }
                </button>
              }
              
              {(!selectedCapacity || !selectedDuration || currentPrice === null) ?
                <button
                  className=" bg-gray-200 text-gray-400 px-6 py-3 rounded-md font-semibold shadow-md transition-colors"
                >
                  {t("esimDetail.buyNow")}
                </button>
                :
                <button
                  onClick={handleBuyNow}
                  className="bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white px-6 py-3 rounded-md font-semibold shadow-md transition-colors"
                >
                  {cartStore.isLoadingButton ? <Spinner size={"md"}/> : t("esimDetail.buyNow")}
                </button>
              }
            </div>
          </div>
        </div>
      )}
      <DeviceListModal isOpen={isDeviceListModalOpen} onClose={() => setIsDeviceListModalOpen(false)}/>
      
      <InfoProductModal isOpen={isSeeMoreOpen} onClose={() => setIsSeeMoreOpen(false)} info={info}
                        isInternational={appStore.productGroupDetail?.productGroup?.isInternational}/>
    </div>
  )
})

export default EsimDetail

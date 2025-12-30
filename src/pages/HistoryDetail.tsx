import React, {Fragment, useEffect, useRef, useState} from "react"
import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom";
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {orderItems, orderStore, Transaction} from "@/stores/OrderStore.ts";
import {ChevronLeft, ChevronRight, EyeIcon, EyeOffIcon, Search, X} from "lucide-react";
import Loading from "@/components/Loading.tsx";
import {formatCurrency} from "@/utils/utils.ts";
import {cartStore} from "@/stores/CartStore.ts";
import {format} from "date-fns";
import i18n from "i18next";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import Spinner from "@/components/Spinner.tsx";
import DataChart from "@/components/DataChart.tsx";
import QRCode from "react-qr-code";

const HistoryDetail: React.FC = () => {
  useScrollToTop()
  const {t} = useTranslation()
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<"detail" | "qr">("detail")
  const [currentTab, setCurrentTab] = useState<"info" | "data">("info")
  const [selectedProduct, setSelectedProduct] = useState<orderItems | null>(null)
  const [showQrModal, setShowQrModal] = useState<boolean>(false)
  const [showQr, setShowQr] = useState<boolean>(false)
  const [isCopy, setIsCopy] = useState<boolean>(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      setCopiedText(text)
      
      timeoutRef.current = setTimeout(() => {
        setCopiedText(null)
        timeoutRef.current = null
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }
  
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
  
  const getStatusClasses = (status: Transaction["paymentState"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-gradient-to-l from-[#41AB58] to-[#45D966] text-white"
      case "PAID":
        return "bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white"
      case "PROCESSING":
        return "bg-gradient-to-l from-[#F0C34D] to-[#D88E37] text-white"
      case "CANCEL":
        return "bg-gradient-to-l from-[#F02C2C] to-[#FF6480] text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }
  
  const getStatusItemClasses = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-500"
      case "NOT_ACTIVE":
        return "text-warning-500"
      case "FINISHED":
        return "text-secondary-500"
      case "UNKNOWN":
        return "text-gray-600"
      case "EXPIRED":
        return "text-gray-600"
      default:
        return null
    }
  }
  
  const handleCartClick = () => {
    navigate("/cart")
  }
  
  const handleSearchClick = () => {
    navigate("/search")
  }
  
  const cartItemCount = cartStore.totalItems
  
  const [simStatuses, setSimStatuses] = useState<Record<string, string>>({})
  const [simExpires, setSimExpires] = useState<Record<string, number>>({})
  // const [simUsages, setSimUsages] = useState<Record<string, number>>({})
  const [simRemaining, setSimRemaining] = useState<Record<string, number>>({})
  const [simTotal, setSimTotal] = useState<Record<string, number>>({})
  
  useEffect(() => {
    const fetchStatuses = async () => {
      const allIccids = orderStore.orderDetail.groups.flatMap(order =>
        order.items?.map(item => item.iccid) || []
      )
      
      const statusMap: Record<string, string> = {}
      const expiredMap: Record<string, number> = {}
      // const usageMap: Record<string, number> = {}
      const remainingMap: Record<string, number> = {}
      const totalMap: Record<string, number> = {}
      
      await Promise.all(
        allIccids.map(async (iccid) => {
          const result = await orderStore.getSimStatus(iccid)
          statusMap[iccid] = result.status
          expiredMap[iccid] = result.expiredAt
          // usageMap[iccid] = result.dataUsage
          remainingMap[iccid] = result.remaining
          totalMap[iccid] = result.total
        })
      )
      
      setSimStatuses(statusMap)
      setSimExpires(expiredMap)
      // setSimUsages(usageMap)
      setSimRemaining(remainingMap)
      setSimTotal(totalMap)
    }
    
    fetchStatuses().then()
  }, [orderStore.orderDetail.groups])
  
  return (
    <div className="mobile-container">
      {currentView === 'detail' ?
        <SimpleHeader noClose noSearch title={t('order.detailOrder')}/>
        :
        <header
          className="fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button onClick={() => {
              setCurrentView("detail")
              setSelectedProduct(null)
            }}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors gap-2">
              <ChevronLeft size={24} className="mr-1"/>
            </button>
            <h1
              className="text-lg font-semibold text-gray-900 max-w-[220px] flex-grow text-center whitespace-nowrap overflow-hidden text-ellipsis">{selectedProduct?.title}</h1>
          </div>
          <div className="flex items-center">
            
            <button
              onClick={handleSearchClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t("common.search")}
            >
              <Search size={22} className="text-gray-700"/>
            </button>
            
            <button
              onClick={handleCartClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label={t("common.cart")}
            >
              <img src="/assets/icon/cart.png" alt="Search" className="w-5 h-5"/>
              {cartItemCount > 0 && (
                <span
                  className="absolute top-[2px] right-[6px] bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </header>
      }
      
      {currentView === 'detail' &&
        <>
          {orderStore.isLoadingDetail ? <Loading size={"lg"} containerClassName={"h-64"}/>
            :
            <main className="p-4 pb-20 mt-16">
              {/* Order Status Card */}
              <div
                className="flex items-center justify-between p-2 shadow-sm rounded-lg bg-gradient-to-b from-[#EDFBFF] to-[#FFF9EE]">
                <div className="flex items-center space-x-2">
                  <img src="/assets/icon/cart_2.png" alt="Search" className="w-10 h-10"/>
                  <p className="text-sm font-medium text-gray-800 break-all">{orderStore.orderDetail.code}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-sm text-xs font-semibold whitespace-nowrap ${getStatusClasses(orderStore.orderDetail.paymentState)}`}>
                    {t(`history.status.${orderStore.orderDetail.paymentState}`)}
                  </span>
              </div>
              
              <div className="flex gap-2 bg-white">
                <button
                  onClick={() => {
                    setCurrentTab("info")
                  }}
                  className={`p-2 font-semibold transition-colors ${
                    currentTab === "info"
                      ? "text-primary-600 after:content-[''] after:block after:w-1/5 after:border-b-2 after:border-[#006885] after:mx-auto after:mt-1.5"
                      : "text-gray-500 after:content-[''] after:block after:w-1/5 after:border-b-2 after:border-[#FFFFFF] after:mx-auto after:mt-1.5"
                  }`}
                >
                  {t('order.info')}
                </button>
                <button
                  onClick={() => {
                    setCurrentTab("data")
                  }}
                  className={`p-2 font-semibold transition-colors ${
                    currentTab === "data"
                      ? "text-primary-600 after:content-[''] after:block after:w-1/5 after:border-b-2 after:border-[#006885] after:mx-auto after:mt-1.5"
                      : "text-gray-500 after:content-[''] after:block after:w-1/5 after:border-b-2 after:border-[#FFFFFF] after:mx-auto after:mt-1.5"
                  }`}
                >
                  {t('order.data')}
                </button>
              </div>
              
              <div className="border-b border-dashed border-gray-300 mx-4 my-1"></div>
              
              {currentTab === "info" && (
                <>
                  {/* Customer Information */}
                  <div className="p-4 mb-4 shadow-sm">
                    <div className="p-0 text-sm space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('payment.fullName')}</span>
                        <span className="font-medium text-gray-800">{orderStore.orderDetail.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('payment.phoneNumber')}</span>
                        <span className="font-medium text-gray-800">{orderStore.orderDetail.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('payment.email')}</span>
                        <span className="font-medium text-gray-800">{orderStore.orderDetail.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('payment.paymentMethod')}</span>
                        <span className="font-medium text-gray-800">{orderStore.orderDetail.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* orderStore.orderDetail Information */}
                  <div className="space-y-3">
                    <h2 className="text-base font-semibold text-gray-800">{t('order.orderInfo')}</h2>
                    {orderStore.orderDetail?.groups?.map((productGroup) => (
                      <div key={productGroup.id} className="p-4 shadow-sm">
                        <div className="flex flex-row items-center gap-2 p-0 pb-3">
                          <img src={productGroup.imageUrl} alt="Search" className="w-6 h-6 rounded-full"/>
                          <h5 className="text-base font-semibold">{productGroup.productGroupTitle}</h5>
                          <button className="h-auto w-auto" onClick={() => {
                            navigate(`/esim/${productGroup.productGroupId}`)
                          }}>
                            <ChevronRight size={20}/>
                          </button>
                        </div>
                        {productGroup.items?.map((product, index) => {
                          return <div key={index} className="p-3 text-sm space-y-2 border border-gray-100 rounded-lg">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`flex items-center gap-1 ${getStatusItemClasses(simStatuses[product.iccid])}`}>
                                 {simStatuses[product.iccid] ? `• ${t(`history.status.${simStatuses[product.iccid]}`)}` :
                                   (
                                     simStatuses[product.iccid] === null ? "" : <Spinner size={"sm"}/>
                                   )}
                              </span>
                              <div className="flex items-center justify-end space-x-4 pt-2">
                                <button onClick={() => {
                                  setShowQrModal(true)
                                  setSelectedProduct(product)
                                }}
                                        className="text-primary-600 p-0 h-auto flex gap-2">
                                  <EyeIcon size={18}/> {t('order.qrCode')}
                                </button>
                              </div>
                            </div>
                            <button onClick={() => {
                              setCurrentView('qr')
                              setSelectedProduct(product)
                              window.scrollTo(0, 0)
                            }}
                                    className="flex items-center gap-2 max-w-full">
                              <span
                                className="text-gray-600 font-semibold max-w-full whitespace-nowrap overflow-hidden text-ellipsis">{product.title}</span>
                              <button className="h-auto w-auto">
                                <ChevronRight size={20}/>
                              </button>
                            </button>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 font-semibold">SIM {index + 1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {simStatuses[product.iccid] === "ACTIVE" ?
                                  <>
                                    {simExpires[product.iccid] ?
                                      `${t('order.outDate')}: ${format(simExpires[product.iccid], "dd/MM/yyyy")}`
                                      :
                                      (
                                        simExpires[product.iccid] === null ? "" : <Spinner size={"sm"}/>
                                      )
                                    }
                                  </>
                                  :
                                  <>
                                    {simExpires[product.iccid] ?
                                      `${t('order.validity').replace("{x}", `${product.validity}`)}`
                                      :
                                      (
                                        simExpires[product.iccid] === null ? "" : <Spinner size={"sm"}/>
                                      )
                                    }
                                  </>
                                }
                              </span>
                              <span className="font-medium text-gray-800">{formatCurrency(product.price)}</span>
                            </div>
                          </div>
                        })}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {currentTab === "data" && (
                <>
                  {/* orderStore.orderDetail Information */}
                  <div className="space-y-3">
                    {orderStore.orderDetail?.groups?.map((productGroup) => (
                      <div key={productGroup.id} className="p-4 shadow-sm">
                        <div className="flex flex-row items-center gap-2 p-0 pb-3">
                          <img src={productGroup.imageUrl} alt="Search" className="w-6 h- rounded-full"/>
                          <h5 className="text-base font-semibold">{productGroup.productGroupTitle}</h5>
                        </div>
                        {productGroup.items?.map((product, index) => {
                          return <div key={index}
                                      style={{
                                        backgroundImage: new Date().getTime() > new Date(simExpires[product.iccid]).getTime() ? `url("/assets/images/bg_none.png")` : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        backgroundBlendMode: "multiply",
                                        backgroundAttachment: "fixed",
                                        transform: "scale(1)",
                                      }}
                                      className="p-3 text-sm border border-gray-100 rounded-lg flex items-center justify-between">
                            <div className="space-y-2 flex flex-col ">
                              <span
                                className="text-gray-600 font-semibold max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis">{product.title}</span>
                              <span className="text-gray-600 font-semibold">SIM {index + 1}</span>
                              <span className="text-gray-600">
                                {simStatuses[product.iccid] === "ACTIVE" ?
                                  <>
                                    {simExpires[product.iccid] ?
                                      (
                                        new Date().getTime() < new Date(simExpires[product.iccid]).getTime() ?
                                          `${t('order.outDate')}: ${format(simExpires[product.iccid], "dd/MM/yyyy")}` : t('order.eSimExpired')
                                      )
                                      :
                                      (
                                        simExpires[product.iccid] === null ? "" : <Spinner size={"sm"}/>
                                      )
                                    }
                                  </>
                                  :
                                  <>
                                    {simExpires[product.iccid] ?
                                      `${t('order.validity').replace("{x}", `${product.validity}`)}`
                                      :
                                      (
                                        simExpires[product.iccid] === null ? "" : <Spinner size={"sm"}/>
                                      )
                                    }
                                  </>
                                }
                              </span>
                            </div>
                            {simRemaining[product.iccid] ?
                              <DataChart remaining={simRemaining[product.iccid]} max={simTotal[product.iccid]}/>
                              :
                              (
                                simRemaining[product.iccid] === null ? "" :
                                  <Spinner size={"md"} containerClassName={"w-24 h-32"}/>
                              )
                            }
                          </div>
                        })}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </main>
          }
        </>
      }
      
      {currentView === 'qr' && selectedProduct &&
        <main className="pb-20 mt-16">
          {/*<div className="p-4">*/}
          {/*  <div style={{*/}
          {/*    backgroundImage: new Date().getTime() > new Date(simExpires[selectedProduct.iccid]).getTime() ? `url("/assets/images/bg_none.png")` : "none",*/}
          {/*    backgroundSize: "cover",*/}
          {/*    backgroundPosition: "center",*/}
          {/*    backgroundRepeat: "no-repeat",*/}
          {/*    backgroundBlendMode: "multiply",*/}
          {/*    backgroundAttachment: "fixed",*/}
          {/*    transform: "scale(1)",*/}
          {/*  }}*/}
          {/*       className="p-3 text-sm border border-gray-100 rounded-lg flex items-center justify-between">*/}
          {/*    <div className="space-y-2 flex flex-col">*/}
          {/*      <span*/}
          {/*        className="text-gray-600 font-semibold max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis">{selectedProduct.title}</span>*/}
          {/*      <span className="text-gray-600">*/}
          {/*        {simStatuses[selectedProduct.iccid] === "ACTIVE" ?*/}
          {/*          <>*/}
          {/*            {simExpires[selectedProduct.iccid] ?*/}
          {/*              (*/}
          {/*                new Date().getTime() < new Date(simExpires[selectedProduct.iccid]).getTime() ?*/}
          {/*                  `${t('order.outDate')}: ${format(simExpires[selectedProduct.iccid], "dd/MM/yyyy")}` : t('order.eSimExpired')*/}
          {/*              )*/}
          {/*              :*/}
          {/*              (*/}
          {/*                simExpires[selectedProduct.iccid] === null ? "" : <Spinner size={"sm"}/>*/}
          {/*              )*/}
          {/*            }*/}
          {/*          </>*/}
          {/*          :*/}
          {/*          <>*/}
          {/*            {simExpires[selectedProduct.iccid] ?*/}
          {/*              `${t('order.validity').replace("{x}", `${selectedProduct.validity}`)}`*/}
          {/*              :*/}
          {/*              (*/}
          {/*                simExpires[selectedProduct.iccid] === null ? "" : <Spinner size={"sm"}/>*/}
          {/*              )*/}
          {/*            }*/}
          {/*          </>*/}
          {/*        }*/}
          {/*      </span>*/}
          {/*    </div>*/}
          {/*    {simRemaining[selectedProduct.iccid] ?*/}
          {/*      <DataChart remaining={simRemaining[selectedProduct.iccid]} max={simTotal[selectedProduct.iccid]}/>*/}
          {/*      :*/}
          {/*      (*/}
          {/*        simRemaining[selectedProduct.iccid] === null ? "" :*/}
          {/*          <Spinner size={"md"} containerClassName={"w-24 h-32"}/>*/}
          {/*      )*/}
          {/*    }*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="flex flex-col justify-center p-4 bg-gradient-to-b from-[#D1E8EF] to-[#EAF4D0]">
            <div className="relative">
              {/* Main voucher container with notched bottom */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                <div className="bg-white p-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-base font-semibold text-gray-900 flex-grow">{t('order.scanQr')}</h1>
                    <button onClick={() => {
                      setShowQr(!showQr)
                    }}
                            className="text-primary-600 text-base p-0 flex items-center gap-2">
                      {showQr ?
                        <>
                          <EyeOffIcon size={20} className=""/> {t('order.hideQr')}
                        </>
                        :
                        <>
                          <EyeIcon size={20} className=""/> {t('order.showQr')}
                        </>
                      }
                    
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center px-5 gap-2 h-64 mt-4">
                    {showQr ?
                      <>
                        <QRCode value={selectedProduct?.qrcode || ""} size={256} level={"H"}/>
                        <button onClick={() => {
                          window.navigator.clipboard.writeText(selectedProduct.iccid).then(() => {
                            setIsCopy(true)
                            setTimeout(() => {
                              setIsCopy(false)
                            }, 2000)
                          })
                        }}
                                className="text-primary-600 iccid-box mt-2 flex items-center gap-2">
                          {selectedProduct.iccid} {isCopy ?
                          <img src="/assets/icon/copy-success.svg" alt="copy" className="w-4 h-4"/> :
                          <img src="/assets/icon/copy.png" alt="copy" className="w-4 h-4"/>}
                        </button>
                      </>
                      :
                      <>
                        <img src="/assets/icon/qr.png" alt="qrCode" className="w-6 h-6"/>
                        <span>
                          {t('order.qrHidden')}
                        </span>
                        <span>
                          {t('order.pressShowQr')}
                        </span>
                      </>
                    }
                  </div>
                </div>
                
                {showQr &&
                  <Fragment>
                    <div className="relative">
                      <div className="border-t border-dashed border-gray-300 mx-6"></div>
                      <div
                        className="absolute -left-3 top-0 w-6 h-6 bg-gradient-to-r from-[#D1E8EF] to-[#EAF4D0] rounded-full transform -translate-y-3"></div>
                      <div
                        className="absolute -right-3 top-0 w-6 h-6 bg-gradient-to-l from-[#D1E8EF] to-[#EAF4D0] rounded-full transform -translate-y-3"></div>
                    </div>
                    
                    <div className="p-4 rounded-xl">
                      <h3 className="text-gray-800 font-medium mb-3">{t('order.manualInstall')}</h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{t('order.forIPhone')}</span>
                        </div>
                        <div className="ml-2">
                          • {t('order.address')}
                          <button
                            className="relative text-left"
                            onClick={() => {
                              copyToClipboard(selectedProduct?.smdpPlus).then()
                            }}
                          >
                            <span
                              className={`${copiedText === selectedProduct?.smdpPlus ? 'bg-primary-500 text-white' : 'bg-primary-100 text-gray-800'} rounded-sm px-2 break-all`}>
                              {selectedProduct.smdpPlus}
                            </span>
                            {copiedText === selectedProduct?.smdpPlus && (
                              <span
                                className="absolute -top-7 left-2/3 transform -translate-x-1/2 bg-gray-800 text-white whitespace-nowrap text-xs px-2 py-1 rounded">
                                {t('order.copy')}
                              </span>
                            )}
                          </button>
                        </div>
                        <div className="ml-2">
                          • {t('order.activateCode')}
                          <button
                            className="relative text-left"
                            onClick={() => {
                              copyToClipboard(selectedProduct?.activationCode).then()
                            }}
                          >
                            <span
                              className={`${copiedText === selectedProduct?.activationCode ? 'bg-primary-500 text-white' : 'bg-primary-100 text-gray-800'} rounded-sm px-2 break-all`}>
                              {selectedProduct.activationCode}
                            </span>
                            {copiedText === selectedProduct?.activationCode && (
                              <span
                                className="absolute -top-7 left-2/3 transform -translate-x-1/2 bg-gray-800 text-white whitespace-nowrap text-xs px-2 py-1 rounded">
                                {t('order.copy')}
                              </span>
                            )}
                          </button>
                        </div>
                        <div className="ml-2">• {t('order.confirmationCode')}</div>
                        <div className="">
                          {t('order.forAndroid')}
                          <button
                            className="relative text-left"
                            onClick={() => {
                              copyToClipboard(selectedProduct.qrcode).then()
                            }}
                          >
                            <span
                              className={`${copiedText === selectedProduct.qrcode ? 'bg-primary-500 text-white' : 'bg-primary-100 text-gray-800'} rounded-sm px-2 break-all`}>
                              {selectedProduct.qrcode}
                            </span>
                            {copiedText === selectedProduct.qrcode && (
                              <span
                                className="absolute -top-7 left-2/3 transform -translate-x-1/2 bg-gray-800 text-white whitespace-nowrap text-xs px-2 py-1 rounded">
                                {t('order.copy')}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                }
              </div>
            </div>
          </div>
          
          {/* How to Use eSIM */}
          <div className="text-white mx-4 mt-4 p-4 rounded-2xl shadow-sm"
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
          {/*  <h3 className="text-xl font-bold mb-4 text-center">{t("esimDetail.howToUseEsim")}</h3>*/}
          {/*  <div className="space-y-4 relative">*/}
          {/*    {howToUse.map((step: any, index: number) => (*/}
          {/*      <div key={index} className="flex-grow pl-4 -ml-7">*/}
          {/*        <span className="text-md">{step.title}</span>*/}
          {/*        <p className="text-sm text-gray-500 mt-2">{step.description}</p>*/}
          {/*      </div>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </main>
      }
      
      {currentView === "detail" &&
        <div
          className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white p-4 shadow-lg flex flex-col border-t border-gray-100 rounded-t-2xl">
          <div className="bg-white shadow-sm mb-2">
            <span className="text-sm font-semibold text-gray-500">
              {t('payment.orderSummary')}
            </span>
            <div className="flex flex-col border-b border-gray-100 py-2 mb-2 gap-2">
              <div className="flex items-center justify-between">
                 <span className="text-sm text-gray-500">
                   {t('payment.subtotal')}
                 </span>
                <span className="text-sm text-gray-500">
                  {orderStore.orderDetail?.originalPrice && formatCurrency(orderStore.orderDetail?.originalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {t('payment.discount')}
                </span>
                <span className="text-sm text-green-500">
                  -{orderStore.orderDetail?.minusPrice && formatCurrency(orderStore.orderDetail?.minusPrice)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{t("cart.total")}</span>
            <span
              className="text-xl font-bold text-primary-600">{formatCurrency(orderStore.orderDetail.totalPrice)}</span>
          </div>
        
        </div>
      }
      
      
      {showQrModal &&
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80`}>
          <div className="flex flex-col items-center justify-center px-5 gap-2 h-64 my-6">
            <QRCode value={selectedProduct?.qrcode || ""} size={256} level={"H"}/>
            <button onClick={() => {
              window.navigator.clipboard.writeText(selectedProduct?.iccid || "").then(() => {
                setIsCopy(true)
                setTimeout(() => {
                  setIsCopy(false)
                }, 2000)
              })
            }}
                    className="text-primary-600 iccid-box mt-2 flex items-center gap-2">
              {selectedProduct?.iccid} {isCopy ?
              <img src="/assets/icon/copy-success.svg" alt="copy" className="w-4 h-4"/> :
              <img src="/assets/icon/copy.png" alt="copy" className="w-4 h-4"/>}
            </button>
            <button className="bg-primary-600 p-2 rounded-full text-white" onClick={() => {
              setShowQrModal(false)
              setSelectedProduct(null)
            }}>
              <X size={24}/>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default HistoryDetail

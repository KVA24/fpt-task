"use client"

import React, {useEffect, useState} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import {Banknote, Info} from "lucide-react"
import {stores} from "@/stores"
import DeviceListModal from "@/components/DeviceListModal.tsx";
import {cn, formatCurrency} from "@/utils/utils.ts";
import TermsAndConditionsModal from "@/components/TermsAndConditionsModal.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import SimpleHeader from "@/components/SimpleHeader.tsx";
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import Spinner from "@/components/Spinner.tsx";

const PaymentRush: React.FC = observer(() => {
  useScrollToTop()
  const {t} = useTranslation()
  const {cartStore, appStore} = stores
  
  const {executeRecaptcha} = useGoogleReCaptcha()
  
  const handleCheckout = async (voucher?: string, email?: string) => {
    if (!executeRecaptcha) {
      console.error("Failed to load reCAPTCHA provider!")
      return
    }
    const sign = await executeRecaptcha()
    cartStore.getCheckout(sign, voucher ?? cartStore.voucherCode, email ?? form.email).then()
  }
  
  useEffect(() => {
    cartStore.voucherCode = null
  }, []);
  
  
  useEffect(() => {
    handleCheckout().then()
  }, [])
  
  const [isDeviceListModalOpen, setIsDeviceListModalOpen] = useState(false)
  const [isTermsAndConditionsModalOpen, setIsTermsAndConditionsModalOpen] = useState(false)
  
  const [form, setForm] = useState({
    name: appStore.profile?.displayName ?? "",
    phone: appStore.profile?.phoneNumber ?? "",
    email: appStore.profile?.username ?? "",
    confirmEmail: appStore.profile?.username ?? "",
    eSimSupported: false,
    agreeTerms: false,
    voucherCode: cartStore.voucherCheckout?.code || "",
  });
  
  const [errors, setErrors] = useState<any>({});
  
  const validate = () => {
    const newErrors: any = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{9,}$/.test(form.phone) && form.phone) newErrors.phone = 'Phone must be at least 9 digits';
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.confirmEmail)) newErrors.confirmEmail = 'Invalid email format';
    if (!form.eSimSupported) newErrors.eSimSupported = 'Require';
    if (!form.agreeTerms) newErrors.agreeTerms = 'Require';
    if (form.email !== form.confirmEmail) newErrors.confirmEmail = t('auth.confirmEmailNotMatch')
    
    return newErrors;
  };
  
  const handleChange = (e: any) => {
    const {name, value, type, checked} = e.target;
    if (name === "voucherCode") {
      cartStore.isCheckoutWithVoucher = false
    }
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSubmit = async () => {
    if (!executeRecaptcha) {
      console.error("Failed to load reCAPTCHA provider!")
      return
    }
    const sign = await executeRecaptcha()
    cartStore.createOrder(form.name, form.phone, form.email, cartStore.voucherCode, sign, true).then()
  }
  
  const handlePlaceOrder = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return
    } else {
      handleSubmit().then()
    }
  }
  
  const handleInfoClick = () => {
    setIsDeviceListModalOpen(true)
  }
  
  const handleTermClick = () => {
    setIsTermsAndConditionsModalOpen(true)
  }
  
  const paymentMethods = [
    // {id: "dam", label: t("payment.methods.mile"), icon: Wallet},
    // {id: "qrcode", label: t("payment.methods.qrCode"), icon: QrCode},
    // {id: "atm", label: t("payment.methods.atmCard"), icon: CreditCard},
    // {id: "international", label: t("payment.methods.internationalCard"), icon: Globe},
    // {id: "eWallet", label: t("payment.methods.eWallet"), icon: Smartphone},
    // {id: "mobileMoney", label: t("payment.methods.mobileMoney"), icon: Banknote},
    {id: "onePay", label: t("payment.methods.online"), icon: Banknote}
  ]
  
  const group = cartStore.itemsCheckout[0]
  const product = cartStore.itemsCheckout[0]?.items[0]
  
  return (
    <div className="mobile-container bg-gray-50">
      {/* Main Header */}
      <SimpleHeader noClose noCart noSearch title={t("payment.title")}/>
      
      {/* Progress Indicator */}
      {/*<div className="relative w-full h-1 bg-gray-200">*/}
      {/*  <div className="absolute h-full bg-yellow-500" style={{width: "50%"}}></div>*/}
      {/*  <div className="absolute -translate-x-1/2 -top-1 w-3 h-3 bg-yellow-500 rounded-full shadow-md"></div>*/}
      {/*</div>*/}
      
      <main className="pb-36 mt-20">
        {/* Buyer Information */}
        <div className="bg-white p-4 shadow-sm border border-gray-100 mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("payment.buyerInfo")}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("payment.fullName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name={"name"}
                value={form.name}
                onChange={handleChange}
                disabled={appStore.profile !== null && appStore.profile?.displayName !== "" && appStore.profile?.displayName !== undefined}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name && `border-red-500`}`}
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                {t("payment.phoneNumber")}
              </label>
              <div className="flex">
                <select
                  className="flex-shrink-0 px-1 py-2 border border-gray-200 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="84">+84</option>
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name={"phone"}
                  value={form.phone}
                  onChange={handleChange}
                  disabled={appStore.profile !== null && appStore.profile?.phoneNumber !== "" && appStore.profile?.phoneNumber !== undefined}
                  className={`w-full px-3 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone && `border-red-500`}`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name={"email"}
                id="email"
                value={form.email}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCheckout(cartStore.voucherCode, form.email).then()
                  }
                }}
                onBlur={() => {
                  handleCheckout(cartStore.voucherCode, form.email).then()
                }}
                disabled={appStore.profile !== null && appStore.profile?.username !== "" && appStore.profile?.username !== undefined}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email && `border-red-500`}`}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmEmail')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name={"confirmEmail"}
                id="confirmEmail"
                value={form.confirmEmail}
                onChange={handleChange}
                disabled={appStore.profile !== null && appStore.profile?.username !== "" && appStore.profile?.username !== undefined}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmEmail && `border-red-500`}`}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              {errors.eSimSupported && <Info size={16} className="text-red-500"/>}
              <input
                type="checkbox"
                id="eSimSupported"
                name={"eSimSupported"}
                checked={form.eSimSupported}
                onChange={handleChange}
                className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500`}
              />
              <label htmlFor="eSimSupported" className="text-sm text-gray-700 flex items-center">
                {t("payment.eSimSupported")}
                <button
                  onClick={handleInfoClick}
                  className="ml-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  <Info size={16} className="text-blue-500"/>
                </button>
              </label>
            </div>
          </div>
        </div>
        
        {/* Order Information */}
        <div className="bg-white p-4 shadow-sm border border-gray-100 mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("payment.orderInfo")}</h2>
          <div className="space-y-3">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <img
                    src={`${group?.productGroupImageUrl}`}
                    alt={`${group?.productGroupTitle} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h5 className="">{group?.productGroupTitle}</h5>
              </div>
              <div className="flex items-center justify-between w-full pl-8">
                <p className="text-xs text-gray-600">
                  {product?.data} - {product?.validityDays} {t('common.day')} {product?.sms > 0 && ` • ${product?.sms} sms`} {product?.voice > 0 && ` • ${product?.voice} voice`} •
                  x{product?.quantity}
                </p>
                <p
                  className="text-xs text-gray-600">{formatCurrency((product?.sellingPrice ?? 0) * (product?.quantity ?? 0))}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="bg-white p-4 shadow-sm border border-gray-100 mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("payment.paymentMethod")}</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <label key={method.id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    // checked={selectedPaymentMethod === method.id}
                    defaultChecked={true}
                    // onChange={() => setSelectedPaymentMethod(method.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Icon size={20} className="ml-3 mr-2 text-gray-700"/>
                  <span className="text-sm text-gray-800">{method.label}</span>
                </label>
              )
            })}
          </div>
        </div>
        
        {/*Discount Code */}
        <div className="py-1 px-4 mb-2 flex items-center w-full gap-2">
          <div className="flex items-center">
            <img
              src="/assets/icon/icon_tag.svg" alt="tag" className="w-8 h-8"/>
            {/*<span className="text-sm font-semibold text-gray-500">*/}
            {/*  {t('payment.voucher')}*/}
            {/*</span>*/}
          </div>
          <div className="flex items-center w-full">
            <div className="relative w-full">
              <input
                id="voucherCode"
                name="voucherCode"
                type="text"
                placeholder={t("payment.enterDiscountCode")}
                value={cartStore.voucherCode}
                onChange={(e) => {
                  cartStore.isCheckoutWithVoucher = false
                  cartStore.voucherCode = e.target.value
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCheckout(cartStore.voucherCode, form.email).then()
                  }
                }}
                onBlur={() => {
                  handleCheckout(cartStore.voucherCode, form.email).then()
                }}
                className={cn(
                  "w-full flex-grow text-xs px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent placeholder-[#E9B11A]",
                  "text-primary-500",
                  cartStore.isCheckoutWithVoucher && (
                    cartStore.voucherSuccess ? "text-green-500 border-green-500" : "text-red-500 border-red-500"
                  ),
                )}
              />
            </div>
          </div>
          {cartStore.isCheckoutWithVoucher ? (
              <span className="">
                {cartStore.voucherSuccess ? (
                  <img
                    src="/assets/icon/ico_success.svg" alt="tag" className="w-8 h-8"/>
                ) : (
                  <img
                    src="/assets/icon/ico_fail.svg" alt="tag" className="w-8 h-8"/>
                )}
              </span>
            ) :
            <button
              onClick={() => handleCheckout(cartStore.voucherCode, form.email).then()}
              className="text-xs text-primary-500 border border-primary-500 py-2 px-4 rounded-full shadow-md transition-colors whitespace-nowrap">
              {t('payment.apply')}
            </button>
          }
        </div>
        {cartStore.voucherCheckout &&
          <div className="bg-white p-4 shadow-sm border border-gray-100 mb-2">
            <span className="text-sm font-semibold text-gray-500">
              {t('payment.orderSummary')}
            </span>
            <div className="flex flex-col border-b border-gray-100 py-2 mb-2 gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {t('payment.subtotal')}
                </span>
                <span className="text-sm text-gray-500">
                  {cartStore.dataCheckout?.originalPrice && formatCurrency(cartStore.dataCheckout?.originalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {t('payment.discount')}
                </span>
                <span className="text-sm text-green-500">
                  -{cartStore.dataCheckout?.minusPrice && formatCurrency(cartStore.dataCheckout?.minusPrice)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {t('payment.total')}
              </span>
              <span className="text-sm text-gray-500">
                {cartStore.dataCheckout?.totalPrice && formatCurrency(cartStore.dataCheckout?.totalPrice)}
              </span>
            </div>
          </div>
        }
      </main>
      
      {/* Bottom Order Bar */}
      <div
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white p-4 shadow-lg flex flex-col border-t border-gray-100 rounded-t-2xl">
        {/* Terms and Conditions */}
        <div className="flex items-center gap-2 mb-2 ">
          {errors.agreeTerms && <Info size={16} className="text-red-500"/>}
          <input
            type="checkbox"
            id="agreeTerms"
            name={"agreeTerms"}
            checked={form.agreeTerms}
            onChange={handleChange}
            className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500`}
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-700">
            {t("payment.agreeTerms")}{" "}
            <a href="#" className="text-blue-500 hover:underline" onClick={handleTermClick}>
              {t("payment.termsAndConditions")}
            </a>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-500">{t("cart.total")} ({product?.quantity}):</span>
              <span
                className="text-xl font-bold text-primary-600">
                {cartStore.voucherCheckout ?
                  formatCurrency(cartStore.dataCheckout?.totalPrice ?? 0)
                  :
                  formatCurrency((product?.sellingPrice ?? 0) * (product?.quantity ?? 0))
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">{t("cart.earn")}</span>
              <span
                className="text-xl font-bold text-primary-600 flex items-center gap-1">
               <img
                 src="/assets/icon/ico_mile.svg" alt="mile" className="w-5 h-5 rounded-full"/>
                {cartStore.dataCheckout?.milesEarned} {t('cart.miles')}
            </span>
            </div>
          </div>
          <button
            disabled={cartStore.isLoadingButton}
            onClick={handlePlaceOrder}
            className="bg-gradient-to-l from-[#0A8AAE] to-[#06718F] text-white px-6 py-3 rounded-full font-semibold shadow-md transition-colors"
          >
            {cartStore.isLoadingButton ? <Spinner/> : t("payment.pay")}
          </button>
        </div>
      </div>
      
      {/* Device List Modal */}
      <DeviceListModal isOpen={isDeviceListModalOpen} onClose={() => setIsDeviceListModalOpen(false)}/>
      {/* Terms and conditions Modal */}
      <TermsAndConditionsModal isOpen={isTermsAndConditionsModalOpen}
                               onClose={() => setIsTermsAndConditionsModalOpen(false)}
                               onAgree={() => form.agreeTerms = true}
      />
    </div>
  )
})

export default PaymentRush

import React from "react"
import {useTranslation} from "react-i18next"
import BottomNavigation from "@/components/BottomNavigation"
import {useScrollToTop} from "@/hooks/useScrollToTop.ts";
import {Mail, Smartphone} from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader.tsx";

const Contact: React.FC = () => {
  useScrollToTop()
  const {t} = useTranslation()
  
  return (
    <div className="mobile-container">
      <SimpleHeader noClose noCart noSearch title={t('guide.contactHotline')}/>
      
      <main className="p-4 pb-20 mt-16">
        <div className="flex flex-col items-center">
          <div
            className="">
            <img src="/assets/icon/contact_b.png" alt="Guide" className="w-64 h-auto"/>
          </div>
          <h2 className="text-lg font-semibold mb-4">{t('guide.contact')}</h2>
          <div className="w-full space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <Smartphone className="w-4 h-4"/>
                <span>Hotline 24/7</span>
              </div>
              <a href="tel:19009272" className="text-primary-600">
                19009272 / +84989145663
              </a>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4"/>
                <span>{t('guide.email')}</span>
              </div>
              <a href="mailto:info@infigate.global" className="text-primary-600">
                info@infigate.global
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation/>
    </div>
  )
}

export default Contact

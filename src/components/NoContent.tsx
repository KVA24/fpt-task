"use client"

import type React from "react"
import { useTranslation } from "react-i18next"

interface NoContentProps {
  title?: string
  description?: string
}

const NoContent: React.FC<NoContentProps> = ({ title, description }) => {
  const { t } = useTranslation()
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center w-full">
      <div className="mb-6">
        {/* Placeholder for the sad cloud icon */}
        <img src="/assets/icon/noContent.png" alt="No content icon" className="mx-auto" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title || t("noContent.defaultTitle")}</h3>
      {description && <p className="text-gray-600 text-sm max-w-xs">{description}</p>}
    </div>
  )
}

export default NoContent

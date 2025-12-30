import type React from "react"
import {cn} from "@/utils/utils.ts"
import Lottie from "lottie-react";
import loadingAnimation from "@/components/icon/loading.json";

interface LoadingProps {
  /**
   * Size of the spinner. Can be 'sm', 'md', 'lg', or a custom Tailwind size (e.g., 'w-5 h-5').
   * Defaults to 'md'.
   */
  size?: "sm" | "md" | "lg" | string
  /**
   * Color of the spinner. Can be a Tailwind color class (e.g., 'text-blue-500').
   * Defaults to 'text-blue-500'.
   */
  color?: string
  /**
   * Additional CSS classes for the spinner container.
   */
  className?: string
  containerClassName?: string
}

const Loading: React.FC<LoadingProps> = ({size = "md", color = "text-red-500", className, containerClassName}) => {
  const spinnerSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    xl: "w-6 h-6",
    lg: "w-8 h-8",
  }
  
  const selectedSizeClass = spinnerSizeClasses[size as keyof typeof spinnerSizeClasses] || size
  
  return (
    <div className={cn("w-full flex items-center justify-center", containerClassName)}>
      <div
        className={cn(
          selectedSizeClass,
          color,
          className,
        )}
        role="status"
        aria-label="Loading"
      >
        <Lottie animationData={loadingAnimation} loop={true}/>
      </div>
    </div>
  )
}

export default Loading

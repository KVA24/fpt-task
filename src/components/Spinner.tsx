import type React from "react"
import {cn} from "@/utils/utils.ts" // Assuming cn utility is available

interface LoadingProps {
  /**
   * Size of the spinner. Can be 'sm', 'md', 'lg', or a custom Tailwind size (e.g., 'w-5 h-5').
   * Defaults to 'md'.
   */
  size?: "sm" | "md" | "lg" | string
  /**
   * Color of the spinner. Can be a Tailwind color class (e.g., 'text-primary-600').
   * Defaults to 'text-primary-600'.
   */
  color?: string
  /**
   * Additional CSS classes for the spinner container.
   */
  className?: string
  containerClassName?: string
}

const Spinner: React.FC<LoadingProps> = ({size = "md", color = "text-primary-600", className, containerClassName}) => {
  const spinnerSizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    xl: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-4",
  }
  
  const selectedSizeClass = spinnerSizeClasses[size as keyof typeof spinnerSizeClasses] || size
  
  return (
    <div className={cn("w-full flex items-center justify-center", containerClassName)}>
      <div
        className={cn(
          "inline-block rounded-full animate-spin",
          selectedSizeClass,
          color,
          "border-t-transparent", // Makes the top border transparent for the spinning effect
          className,
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner


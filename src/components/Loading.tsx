import type React from "react"

interface LoadingProps {
  size?: number
  text?: string
}

const Loading: React.FC<LoadingProps> = ({size = 32, text}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full">
      <div
        className="relative"
        style={{width: size, height: size}}
      >
        <div className="absolute inset-0 animate-spin">
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="1"/>
                <stop offset="50%" stopColor="#f87171" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path
              d="M 50,10 A 40,40 0 0,1 90,50"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
      
      {text ? (
        <p className="text-sm text-gray-700 font-medium">{text}</p>
      ) : (
        <p className="text-sm text-gray-700 font-medium">Đang tải...</p>
      )
      }
    </div>
  )
}

export default Loading

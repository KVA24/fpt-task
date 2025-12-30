import type React from "react"
import {observer} from "mobx-react-lite"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({children}) => {
  
  // if (!authStore.isAuthenticated) {
  //   return <Navigate to="/" replace/>
  // }
  
  return <>{children}</>
})

export default ProtectedRoute

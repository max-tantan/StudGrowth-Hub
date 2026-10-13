import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginScreen } from '../screens/auth/LoginScreen'

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/masuk" element={<LoginScreen />} />
      <Route path="*" element={<Navigate to="/masuk" replace />} />
    </Routes>
  )
}

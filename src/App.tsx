import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './store/AppProvider'
import { MotionProvider } from './components/motion/MotionProvider'
import { TourProvider } from './components/tour/TourProvider'
import { useApp } from './store/AppContext'
import { Splash } from './components/layout/Splash'
import { AuthRoutes } from './routes/AuthRoutes'
import { StudentRoutes } from './routes/StudentRoutes'
import { TeacherRoutes } from './routes/TeacherRoutes'

function AppRoutes() {
  const { state } = useApp()

  if (!state.hydrated) return <Splash />
  if (!state.role) return <AuthRoutes />
  if (state.role === 'teacher') return <TeacherRoutes />
  return <StudentRoutes />
}

export default function App() {
  return (
    <AppProvider>
      <MotionProvider>
        <BrowserRouter>
          <TourProvider>
            <AppRoutes />
          </TourProvider>
        </BrowserRouter>
      </MotionProvider>
    </AppProvider>
  )
}

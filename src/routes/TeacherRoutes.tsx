import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { TeacherShell } from '../components/layout/TeacherShell'

const TeacherDashboard = lazy(() =>
  import('../screens/teacher/Dashboard/TeacherDashboard').then((m) => ({
    default: m.TeacherDashboard,
  })),
)
const ReviewResumeScreen = lazy(() =>
  import('../screens/teacher/ReviewResume/ReviewResumeScreen').then((m) => ({
    default: m.ReviewResumeScreen,
  })),
)
const RiskAlertsScreen = lazy(() =>
  import('../screens/teacher/RiskAlerts/RiskAlertsScreen').then((m) => ({
    default: m.RiskAlertsScreen,
  })),
)
const StudentsScreen = lazy(() =>
  import('../screens/teacher/Students/StudentsScreen').then((m) => ({
    default: m.StudentsScreen,
  })),
)
const PklMonitoringScreen = lazy(() =>
  import('../screens/teacher/Pkl/PklMonitoringScreen').then((m) => ({
    default: m.PklMonitoringScreen,
  })),
)

export function TeacherRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<TeacherShell />}>
          <Route path="/guru" element={<TeacherDashboard />} />
          <Route path="/guru/review" element={<ReviewResumeScreen />} />
          <Route path="/guru/alert" element={<RiskAlertsScreen />} />
          <Route path="/guru/murid" element={<StudentsScreen />} />
          <Route path="/guru/pkl" element={<PklMonitoringScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/guru" replace />} />
      </Routes>
    </Suspense>
  )
}

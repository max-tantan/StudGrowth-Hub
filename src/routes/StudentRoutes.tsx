import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Splash } from '../components/layout/Splash'
import { useApp } from '../store/AppContext'
import { OnboardingScreen } from '../screens/student/Onboarding/OnboardingScreen'
import { ConsultLayout } from '../screens/student/Consult/ConsultLayout'
import { JournalLayout } from '../screens/student/Journal/JournalLayout'

const HomeScreen = lazy(() =>
  import('../screens/student/Home/HomeScreen').then((m) => ({
    default: m.HomeScreen,
  })),
)
const JournalScreen = lazy(() =>
  import('../screens/student/Journal/JournalScreen').then((m) => ({
    default: m.JournalScreen,
  })),
)
const JournalEditorScreen = lazy(() =>
  import('../screens/student/Journal/JournalEditorScreen').then((m) => ({
    default: m.JournalEditorScreen,
  })),
)
const JournalDetailScreen = lazy(() =>
  import('../screens/student/Journal/JournalDetailScreen').then((m) => ({
    default: m.JournalDetailScreen,
  })),
)
const ConsultScreen = lazy(() =>
  import('../screens/student/Consult/ConsultScreen').then((m) => ({
    default: m.ConsultScreen,
  })),
)
const ChatThreadScreen = lazy(() =>
  import('../screens/student/Consult/ChatThreadScreen').then((m) => ({
    default: m.ChatThreadScreen,
  })),
)
const ProgressScreen = lazy(() =>
  import('../screens/student/Progress/ProgressScreen').then((m) => ({
    default: m.ProgressScreen,
  })),
)
const ResumeScreen = lazy(() =>
  import('../screens/student/Resume/ResumeScreen').then((m) => ({
    default: m.ResumeScreen,
  })),
)
const PklScreen = lazy(() =>
  import('../screens/student/Pkl/PklScreen').then((m) => ({
    default: m.PklScreen,
  })),
)
const ProfileScreen = lazy(() =>
  import('../screens/student/Profile/ProfileScreen').then((m) => ({
    default: m.ProfileScreen,
  })),
)

export function StudentRoutes() {
  const { state } = useApp()

  if (!state.onboarded) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <Suspense fallback={<Splash />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/beranda" element={<HomeScreen />} />
          <Route path="/jurnal" element={<JournalLayout />}>
            <Route index element={<JournalScreen />} />
            <Route path="baru" element={<JournalEditorScreen />} />
            <Route path=":id" element={<JournalDetailScreen />} />
          </Route>
          <Route path="/konsultasi" element={<ConsultLayout />}>
            <Route index element={<ConsultScreen />} />
            <Route path=":sessionId" element={<ChatThreadScreen />} />
          </Route>
          <Route path="/perkembangan" element={<ProgressScreen />} />
          <Route path="/resume" element={<ResumeScreen />} />
          <Route path="/pkl" element={<PklScreen />} />
          <Route path="/profil" element={<ProfileScreen />} />
        </Route>
        <Route path="*" element={<Navigate to="/beranda" replace />} />
      </Routes>
    </Suspense>
  )
}

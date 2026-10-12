import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './store/AppProvider'
import { useApp } from './store/AppContext'
import { AppShell } from './components/layout/AppShell'
import { Icon } from './components/ui/Icon'
import { OnboardingScreen } from './screens/Onboarding/OnboardingScreen'

const HomeScreen = lazy(() =>
  import('./screens/Home/HomeScreen').then((m) => ({ default: m.HomeScreen })),
)
const JournalScreen = lazy(() =>
  import('./screens/Journal/JournalScreen').then((m) => ({
    default: m.JournalScreen,
  })),
)
const JournalEditorScreen = lazy(() =>
  import('./screens/Journal/JournalEditorScreen').then((m) => ({
    default: m.JournalEditorScreen,
  })),
)
const JournalDetailScreen = lazy(() =>
  import('./screens/Journal/JournalDetailScreen').then((m) => ({
    default: m.JournalDetailScreen,
  })),
)
const ConsultScreen = lazy(() =>
  import('./screens/Consult/ConsultScreen').then((m) => ({
    default: m.ConsultScreen,
  })),
)
const ChatThreadScreen = lazy(() =>
  import('./screens/Consult/ChatThreadScreen').then((m) => ({
    default: m.ChatThreadScreen,
  })),
)
const ProgressScreen = lazy(() =>
  import('./screens/Progress/ProgressScreen').then((m) => ({
    default: m.ProgressScreen,
  })),
)
const ResumeScreen = lazy(() =>
  import('./screens/Resume/ResumeScreen').then((m) => ({
    default: m.ResumeScreen,
  })),
)
const PklScreen = lazy(() =>
  import('./screens/Pkl/PklScreen').then((m) => ({ default: m.PklScreen })),
)
const ProfileScreen = lazy(() =>
  import('./screens/Profile/ProfileScreen').then((m) => ({
    default: m.ProfileScreen,
  })),
)

function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-16 w-16 animate-soft-pulse items-center justify-center rounded-full bg-accent-tint text-accent">
          <Icon name="sparkle" size={30} weight="fill" />
        </span>
        <p className="text-sm font-semibold text-fg-muted">Ruang Tumbuh</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { state } = useApp()

  if (!state.hydrated) return <Splash />

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
          <Route path="/jurnal" element={<JournalScreen />} />
          <Route path="/jurnal/baru" element={<JournalEditorScreen />} />
          <Route path="/jurnal/:id" element={<JournalDetailScreen />} />
          <Route path="/konsultasi" element={<ConsultScreen />} />
          <Route path="/konsultasi/:sessionId" element={<ChatThreadScreen />} />
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

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
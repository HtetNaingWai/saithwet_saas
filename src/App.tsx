import { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import PublicStorefrontPage from './pages/PublicStorefrontPage'

function AppContent() {
  // The demo session exists only until the page is refreshed.
  const [demoUser, setDemoUser] = useState<string | null>(null)
  if (window.location.pathname.startsWith('/store')) return <PublicStorefrontPage />
  return demoUser ? <DashboardPage user={demoUser} onExit={() => setDemoUser(null)} /> : <LandingPage onEnterDemo={setDemoUser} />
}

export default function App() {
  return <ThemeProvider><LanguageProvider><AppContent /></LanguageProvider></ThemeProvider>
}

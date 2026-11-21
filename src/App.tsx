import { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'

function AppContent() {
  // The demo session exists only until the page is refreshed.
  const [demoUser, setDemoUser] = useState<string | null>(null)
  return demoUser ? <DashboardPage user={demoUser} onExit={() => setDemoUser(null)} /> : <LandingPage onEnterDemo={setDemoUser} />
}

export default function App() {
  return <ThemeProvider><LanguageProvider><AppContent /></LanguageProvider></ThemeProvider>
}

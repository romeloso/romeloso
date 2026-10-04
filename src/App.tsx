import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { AdminPanelPage } from '@/pages/AdminPanelPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { GameHubPage } from '@/pages/GameHubPage'
import { LessonPage } from '@/pages/LessonPage'
import { ProfileSelectPage } from '@/pages/ProfileSelectPage'
import { ProgressMapPage } from '@/pages/ProgressMapPage'
import { ResultPage } from '@/pages/ResultPage'
import { WordSearchPage } from '@/pages/WordSearchPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProfileSelectPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/progress" element={<ProgressMapPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/games/:gameSlug" element={<GameHubPage />} />
          <Route path="/games/:gameSlug/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/games/sopa-de-letras/play/:puzzleId" element={<WordSearchPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/panel" element={<AdminPanelPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

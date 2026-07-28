import DashboardPage from './pages/dashboard-page'
import { FilterProvider } from './context/filter-context'
import { ProjectSelector } from './components/project-selector'
import { FilterPanel } from './components/filter-panel'
import { UserSelector } from './components/user-selector'
import './styles/dashboard.css'

export default function App() {
  return (
    <FilterProvider>
      <div className="dashboard-app">
        <header className="dashboard-header">
          <div className="header-top">
            <UserSelector />
            <div className="header-spacer"></div>
            <div className="header-project">
              <ProjectSelector />
            </div>
            <div className="header-date">
              <FilterPanel />
            </div>
          </div>
        </header>
        <main className="dashboard-main">
          <DashboardPage />
        </main>
      </div>
    </FilterProvider>
  )
}

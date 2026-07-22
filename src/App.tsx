import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { InventoryProvider } from './context/InventoryContext'
import { useInventory } from './hooks/useInventory'
import { HomePage } from './pages/HomePage'
import { NikkeDetailPage } from './pages/NikkeDetailPage'
import { ProgressPage } from './pages/ProgressPage'
import { RosterPage } from './pages/RosterPage'
import { StagesPage } from './pages/StagesPage'
import { TeamsPage } from './pages/TeamsPage'
import { UnionRaidPage } from './pages/UnionRaidPage'

export default function App() {
  const inv = useInventory()

  return (
    <InventoryProvider inventory={inv.inventory}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage inventory={inv.inventory} ownedCount={inv.ownedCount} />} />
            <Route
              path="roster"
              element={
                <RosterPage
                  inventory={inv.inventory}
                  toggleNikke={inv.toggleNikke}
                  setNikkesOwned={inv.setNikkesOwned}
                  reset={inv.reset}
                  replaceInventory={inv.replaceInventory}
                  download={inv.download}
                  upload={inv.upload}
                  ownedCount={inv.ownedCount}
                />
              }
            />
            <Route
              path="nikkes/:id"
              element={
                <NikkeDetailPage
                  inventory={inv.inventory}
                  toggleNikke={inv.toggleNikke}
                  patchNikke={inv.patchNikke}
                />
              }
            />
            <Route path="teams" element={<TeamsPage inventory={inv.inventory} />} />
            <Route path="stages" element={<StagesPage inventory={inv.inventory} />} />
            <Route path="union-raid" element={<UnionRaidPage />} />
            <Route path="progress" element={<ProgressPage inventory={inv.inventory} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </InventoryProvider>
  )
}

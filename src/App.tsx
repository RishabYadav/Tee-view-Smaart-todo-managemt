import { useState } from 'react'
import HomePage from './components/HomePage'
import TreeView from './components/TreeView/TreeView'
import KanbanBoard from './components/KanbanBoard/KanbanBoard'

type View = 'home' | 'tree' | 'kanban'

function App() {
  const [currentView, setCurrentView] = useState<View>('home')

  const renderView = () => {
    switch (currentView) {
      case 'tree':
        return <TreeView onBack={() => setCurrentView('home')} />
      case 'kanban':
        return <KanbanBoard onBack={() => setCurrentView('home')} />
      default:
        return <HomePage onSelectView={setCurrentView} />
    }
  }

  return <div className="app">{renderView()}</div>
}

export default App

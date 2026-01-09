import './HomePage.css'

interface HomePageProps {
  onSelectView: (view: 'tree' | 'kanban') => void
}

function HomePage({ onSelectView }: HomePageProps) {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">Smart Todo Management</h1>
        <p className="home-subtitle">Choose a component to explore</p>
        
        <div className="card-container">
          <div className="selection-card" onClick={() => onSelectView('tree')}>
            <div className="card-icon tree-icon">🌳</div>
            <h2 className="card-title">Tree View Component</h2>
            <p className="card-description">
              Hierarchical tree structure with expand/collapse, drag & drop, 
              lazy loading, and inline editing capabilities.
            </p>
            <button className="card-button">Explore Tree View</button>
          </div>

          <div className="selection-card" onClick={() => onSelectView('kanban')}>
            <div className="card-icon kanban-icon">📋</div>
            <h2 className="card-title">Kanban Board</h2>
            <p className="card-description">
              Project management board with drag & drop cards, 
              multiple columns, and inline editing features.
            </p>
            <button className="card-button">Explore Kanban Board</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

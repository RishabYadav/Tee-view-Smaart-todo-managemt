import { useState } from 'react'
import { Column, Card } from './types'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
  column: Column
  onAddCard: (columnId: string) => void
  onDeleteCard: (columnId: string, cardId: string) => void
  onEditCard: (columnId: string, cardId: string, newTitle: string) => void
  onDragStart: (card: Card, sourceColumnId: string) => void
  onDragEnd: () => void
  onDrop: (targetColumnId: string, targetIndex?: number) => void
}

function KanbanColumn({
  column,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onDragStart,
  onDragEnd,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(column.id)
  }

  const getColumnColor = () => {
    switch (column.id) {
      case 'todo':
        return 'column-blue'
      case 'in-progress':
        return 'column-orange'
      case 'done':
        return 'column-green'
      default:
        return 'column-blue'
    }
  }

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`column-header ${getColumnColor()}`}>
        <h2 className="column-title">
          {column.title} <span className="card-count">{column.cards.length}</span>
        </h2>
        <button className="add-column-button" onClick={() => onAddCard(column.id)} title="Add card">
          +
        </button>
      </div>

      <div className="column-content">
        <button className="add-card-button" onClick={() => onAddCard(column.id)}>
          + Add Card
        </button>

        <div className="cards-list">
          {column.cards.map((card, index) => (
            <KanbanCard
              key={card.id}
              card={card}
              columnId={column.id}
              index={index}
              onDelete={onDeleteCard}
              onEdit={onEditCard}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default KanbanColumn

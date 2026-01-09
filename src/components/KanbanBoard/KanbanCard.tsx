import { useState, useRef } from 'react'
import { Card } from './types'

interface KanbanCardProps {
  card: Card
  columnId: string
  index: number
  onDelete: (columnId: string, cardId: string) => void
  onEdit: (columnId: string, cardId: string, newTitle: string) => void
  onDragStart: (card: Card, sourceColumnId: string) => void
  onDragEnd: () => void
  onDrop: (targetColumnId: string, targetIndex: number) => void
}

function KanbanCard({
  card,
  columnId,
  index,
  onDelete,
  onEdit,
  onDragStart,
  onDragEnd,
  onDrop,
}: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(card.title)
  const [dragOver, setDragOver] = useState<'top' | 'bottom' | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onEdit(columnId, card.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit()
    } else if (e.key === 'Escape') {
      setEditValue(card.title)
      setIsEditing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const height = rect.height

    if (y < height / 2) {
      setDragOver('top')
    } else {
      setDragOver('bottom')
    }
  }

  const handleDragLeave = () => {
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const targetIndex = dragOver === 'top' ? index : index + 1
    onDrop(columnId, targetIndex)
    setDragOver(null)
  }

  return (
    <div
      ref={cardRef}
      className={`kanban-card ${dragOver ? `drag-over-${dragOver}` : ''}`}
      draggable={!isEditing}
      onDragStart={() => onDragStart(card, columnId)}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isEditing ? (
        <textarea
          className="card-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={3}
        />
      ) : (
        <>
          <div className="card-content" onDoubleClick={() => setIsEditing(true)}>
            <p className="card-title">{card.title}</p>
          </div>
          <button
            className="card-delete-button"
            onClick={() => onDelete(columnId, card.id)}
            title="Delete card"
          >
            ×
          </button>
        </>
      )}
    </div>
  )
}

export default KanbanCard

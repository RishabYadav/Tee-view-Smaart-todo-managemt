import { useState } from 'react'
import { Column, initialKanbanData, Card } from './types'
import KanbanColumn from './KanbanColumn'
import './KanbanBoard.css'

interface KanbanBoardProps {
  onBack: () => void
}

function KanbanBoard({ onBack }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialKanbanData)
  const [draggedCard, setDraggedCard] = useState<{ card: Card; sourceColumnId: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [targetColumnId, setTargetColumnId] = useState<string>('')

  const handleAddCard = (columnId: string) => {
    setTargetColumnId(columnId)
    setShowModal(true)
  }

  const handleModalSubmit = () => {
    if (newCardTitle.trim()) {
      const newCard: Card = {
        id: `card-${Date.now()}`,
        title: newCardTitle.trim(),
      }

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === targetColumnId ? { ...col, cards: [...col.cards, newCard] } : col
        )
      )
      
      setNewCardTitle('')
      setShowModal(false)
    }
  }

  const handleModalClose = () => {
    setNewCardTitle('')
    setShowModal(false)
  }

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col
      )
    )
  }

  const handleEditCard = (columnId: string, cardId: string, newTitle: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, title: newTitle } : card
              ),
            }
          : col
      )
    )
  }

  const handleDragStart = (card: Card, sourceColumnId: string) => {
    setDraggedCard({ card, sourceColumnId })
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
  }

  const handleDrop = (targetColumnId: string, targetIndex?: number) => {
    if (!draggedCard) return

    const { card, sourceColumnId } = draggedCard

    if (sourceColumnId === targetColumnId) {
      // Reorder within same column
      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === targetColumnId) {
            const newCards = col.cards.filter((c) => c.id !== card.id)
            const insertIndex = targetIndex !== undefined ? targetIndex : newCards.length
            newCards.splice(insertIndex, 0, card)
            return { ...col, cards: newCards }
          }
          return col
        })
      )
    } else {
      // Move to different column
      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === sourceColumnId) {
            return { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
          }
          if (col.id === targetColumnId) {
            const newCards = [...col.cards]
            const insertIndex = targetIndex !== undefined ? targetIndex : newCards.length
            newCards.splice(insertIndex, 0, card)
            return { ...col, cards: newCards }
          }
          return col
        })
      )
    }

    setDraggedCard(null)
  }

  return (
    <div className="kanban-board-container">
      <div className="kanban-board-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>Kanban Board</h1>
      </div>

      <div className="kanban-board">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onEditCard={handleEditCard}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Card</h2>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleModalSubmit()
                if (e.key === 'Escape') handleModalClose()
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button className="modal-button cancel-button" onClick={handleModalClose}>
                Cancel
              </button>
              <button className="modal-button submit-button" onClick={handleModalSubmit}>
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KanbanBoard

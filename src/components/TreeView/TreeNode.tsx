import { useState, useRef } from 'react'
import { TreeNode } from './types'

interface TreeNodeProps {
  node: TreeNode
  onToggle: (nodeId: string) => void
  onAdd: (parentId: string) => void
  onDelete: (nodeId: string) => void
  onEdit: (nodeId: string, newLabel: string) => void
  onDragStart: (node: TreeNode, parentId: string | null) => void
  onDrop: (targetNodeId: string, position: 'before' | 'after' | 'inside') => void
  parentId: string | null
  level?: number
}

function TreeNodeComponent({
  node,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
  onDragStart,
  onDrop,
  parentId,
  level = 0,
}: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(node.label)
  const [dragOver, setDragOver] = useState<'before' | 'after' | 'inside' | null>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  const hasChildren = node.children && node.children.length > 0
  const canExpand = hasChildren || node.hasUnloadedChildren

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onEdit(node.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit()
    } else if (e.key === 'Escape') {
      setEditValue(node.label)
      setIsEditing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!nodeRef.current) return

    const rect = nodeRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const height = rect.height

    if (y < height * 0.25) {
      setDragOver('before')
    } else if (y > height * 0.75) {
      setDragOver('after')
    } else {
      setDragOver('inside')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (dragOver) {
      onDrop(node.id, dragOver)
    }
    setDragOver(null)
  }

  const getNodeIcon = () => {
    if (node.id.split('-').length === 1) {
      return 'A'
    }
    return node.id.split('-').length > 2 ? 'C' : 'B'
  }

  const getNodeColor = () => {
    const depth = node.id.split('-').length
    if (depth === 1) return 'node-icon-blue'
    if (depth === 2) return 'node-icon-green'
    return 'node-icon-green'
  }

  return (
    <div className="tree-node-wrapper">
      <div
        ref={nodeRef}
        className={`tree-node ${dragOver ? `drag-over-${dragOver}` : ''}`}
        draggable
        onDragStart={() => onDragStart(node, parentId)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ marginLeft: `${level * 40}px` }}
      >
        <div className="tree-node-content">
          <div className="tree-node-left">
            {canExpand ? (
              <button className="expand-button" onClick={() => onToggle(node.id)}>
                {node.isExpanded ? '▼' : '▶'}
              </button>
            ) : (
              <span className="expand-placeholder"></span>
            )}

            <div className={`node-icon ${getNodeColor()}`}>{getNodeIcon()}</div>

            {isEditing ? (
              <input
                type="text"
                className="node-edit-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <span className="node-label" onDoubleClick={() => setIsEditing(true)}>
                {node.label}
              </span>
            )}
          </div>

          <div className="tree-node-actions">
            <button 
              className="action-button edit-button" 
              onClick={() => setIsEditing(true)} 
              title="Edit node"
            >
              ✎
            </button>
            <button className="action-button add-button" onClick={() => onAdd(node.id)} title="Add child node">
              +
            </button>
            <button className="action-button delete-button" onClick={() => onDelete(node.id)} title="Delete node">
              ×
            </button>
          </div>
        </div>
      </div>

      {node.isExpanded && hasChildren && (
        <div className="tree-node-children">
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              onToggle={onToggle}
              onAdd={onAdd}
              onDelete={onDelete}
              onEdit={onEdit}
              onDragStart={onDragStart}
              onDrop={onDrop}
              parentId={node.id}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TreeNodeComponent

import { useState } from 'react'
import { TreeNode, mockTreeData, loadChildrenForNode } from './types'
import TreeNodeComponent from './TreeNode'
import './TreeView.css'

interface TreeViewProps {
  onBack: () => void
}

function TreeView({ onBack }: TreeViewProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>(mockTreeData)
  const [draggedNode, setDraggedNode] = useState<{ node: TreeNode; parentId: string | null } | null>(null)

  const findNodeAndParent = (
    nodes: TreeNode[],
    nodeId: string,
    parentId: string | null = null
  ): { node: TreeNode; parent: TreeNode | null; nodes: TreeNode[] } | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return { node, parent: parentId ? findNodeById(treeData, parentId) : null, nodes }
      }
      if (node.children) {
        const result = findNodeAndParent(node.children, nodeId, node.id)
        if (result) return result
      }
    }
    return null
  }

  const findNodeById = (nodes: TreeNode[], nodeId: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node
      if (node.children) {
        const found = findNodeById(node.children, nodeId)
        if (found) return found
      }
    }
    return null
  }

  const updateNode = (nodes: TreeNode[], nodeId: string, updater: (node: TreeNode) => TreeNode): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return updater(node)
      }
      if (node.children) {
        return { ...node, children: updateNode(node.children, nodeId, updater) }
      }
      return node
    })
  }

  const removeNode = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.filter((node) => {
      if (node.id === nodeId) return false
      if (node.children) {
        node.children = removeNode(node.children, nodeId)
      }
      return true
    })
  }

  const addNodeToParent = (nodes: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] => {
    return updateNode(nodes, parentId, (parent) => ({
      ...parent,
      children: [...(parent.children || []), newNode],
      hasUnloadedChildren: false,
    }))
  }

  const handleToggle = async (nodeId: string) => {
    const nodeInfo = findNodeAndParent(treeData, nodeId)
    if (!nodeInfo) return

    const { node } = nodeInfo

    if (!node.isExpanded && node.hasUnloadedChildren && !node.children) {
      // Load children
      const children = await loadChildrenForNode(nodeId)
      setTreeData((prevData) =>
        updateNode(prevData, nodeId, (n) => ({
          ...n,
          children,
          isExpanded: true,
          hasUnloadedChildren: false,
        }))
      )
    } else {
      // Just toggle
      setTreeData((prevData) =>
        updateNode(prevData, nodeId, (n) => ({
          ...n,
          isExpanded: !n.isExpanded,
        }))
      )
    }
  }

  const handleAddNode = (parentId: string) => {
    const newNode: TreeNode = {
      id: `${parentId}-${Date.now()}`,
      label: 'Level A',
      isExpanded: false,
      hasUnloadedChildren: false,
    }

    setTreeData((prevData) => addNodeToParent(prevData, parentId, newNode))
  }

  const handleDeleteNode = (nodeId: string) => {
    if (window.confirm('Are you sure you want to delete this node and all its children?')) {
      setTreeData((prevData) => removeNode(prevData, nodeId))
    }
  }

  const handleEditNode = (nodeId: string, newLabel: string) => {
    setTreeData((prevData) =>
      updateNode(prevData, nodeId, (n) => ({
        ...n,
        label: newLabel,
      }))
    )
  }

  const handleDragStart = (node: TreeNode, parentId: string | null) => {
    setDraggedNode({ node, parentId })
  }

  const handleDrop = (targetNodeId: string, position: 'before' | 'after' | 'inside') => {
    if (!draggedNode) return

    const { node: draggedNodeData } = draggedNode

    // Prevent dropping on itself or its descendants
    if (targetNodeId === draggedNodeData.id || targetNodeId.startsWith(draggedNodeData.id + '-')) {
      setDraggedNode(null)
      return
    }

    // Remove from old position
    let newTreeData = removeNode(treeData, draggedNodeData.id)

    // Add to new position
    if (position === 'inside') {
      newTreeData = addNodeToParent(newTreeData, targetNodeId, draggedNodeData)
    } else {
      const targetInfo = findNodeAndParent(newTreeData, targetNodeId)
      if (!targetInfo) return

      const { nodes } = targetInfo
      const targetIndex = nodes.findIndex((n) => n.id === targetNodeId)

      if (targetIndex === -1) return

      const insertIndex = position === 'before' ? targetIndex : targetIndex + 1
      nodes.splice(insertIndex, 0, draggedNodeData)
    }

    setTreeData(newTreeData)
    setDraggedNode(null)
  }

  return (
    <div className="tree-view-container">
      <div className="tree-view-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>Tree View Component</h1>
      </div>

      <div className="tree-view-content">
        {treeData.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            onToggle={handleToggle}
            onAdd={handleAddNode}
            onDelete={handleDeleteNode}
            onEdit={handleEditNode}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            parentId={null}
          />
        ))}
      </div>
    </div>
  )
}

export default TreeView

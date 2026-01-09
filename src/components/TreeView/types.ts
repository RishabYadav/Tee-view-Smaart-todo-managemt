export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  isExpanded?: boolean
  hasUnloadedChildren?: boolean
  level?: number
}

export const mockTreeData: TreeNode[] = [
  {
    id: '1',
    label: 'Level A',
    isExpanded: false,
    hasUnloadedChildren: true,
    level: 0,
  },
]

// Simulate API call for lazy loading
export const loadChildrenForNode = (nodeId: string): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const children: TreeNode[] = []
      const numChildren = Math.floor(Math.random() * 4) + 2 // 2-5 children

      for (let i = 0; i < numChildren; i++) {
        children.push({
          id: `${nodeId}-${i + 1}`,
          label: `Level A`,
          isExpanded: false,
          hasUnloadedChildren: Math.random() > 0.3, // 70% chance of having children
        })
      }

      resolve(children)
    }, 500) // Simulate network delay
  })
}

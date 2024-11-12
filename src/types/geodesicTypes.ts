type NodeType = {
  id: string
  X: number,
  Y: number,
  color: string,
  size: string,
  edgeConections: string[]
}

type EdgeType = {
  id: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  size: string,
  nodeConnections: string[]
}

export type { NodeType, EdgeType }
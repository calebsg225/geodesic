import GeoNode from "../scripts/geodesic/node";

type NodeConnections = {
  edges: string[],
  faces: string[],
  baseEdges?: string[],
  baseFaces?: string[]
}

type DrawSetting = '' | 'front' | 'back' | 'both';

type DrawOptions = {
  edges: DrawSetting,
  nodes: DrawSetting,
  faces: DrawSetting,
  baseEdges: DrawSetting,
  baseNodes: DrawSetting,
  baseFaces: DrawSetting,
}

type DrawStyles = {
  nodeColor: string,
  backNodeColor: string,
  nodeSize: number,

  edgeColor: string,
  backEdgeColor: string,
  edgeWidth: number,

  faceColor: string,
  backFaceColor: string,

  baseNodeColor: string,
  backBaseNodeColor: string,
  baseNodeSize: number,

  baseEdgeColor: string,
  backBaseEdgeColor: string,
  baseEdgeWidth: number,

  baseFaceColor: string,
  backBaseFaceColor: string
}

type Geo = Map<string, GeoNode>;

type BaseType = 'cube' | 'icosahedron' | 'tetrahedron';

export type { NodeConnections, Geo, BaseType, DrawOptions, DrawStyles }
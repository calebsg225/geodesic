import GeoNode from "../scripts/geodesic/node";

type NodeConnections = {
  edges: string[],
  faces: string[],
  baseEdges?: string[],
  baseFaces?: string[]
}

type DrawSetting = 0 | 1 | 2 | 3;

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
  faceEdgeColor: string,
  backFaceColor: string,
  backFaceEdgeColor: string,

  baseNodeColor: string,
  backBaseNodeColor: string,
  baseNodeSize: number,

  baseEdgeColor: string,
  backBaseEdgeColor: string,
  baseEdgeWidth: number,

  baseFaceColor: string,
  baseFaceEdgeColor: string,
  backBaseFaceColor: string,
  backBaseFaceEdgeColor: string
}

type Geo = Map<string, GeoNode>;

type BaseType = 'cube' | 'icosahedron' | 'tetrahedron';

export type { NodeConnections, Geo, BaseType, DrawOptions, DrawStyles }
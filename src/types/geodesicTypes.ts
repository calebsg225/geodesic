import GeoNode from "../scripts/geodesic/node";

type NodeConnections = {
  edges: string[],
  faces: string[],
  baseEdges?: string[],
  baseFaces?: string[]
}

type DrawOptions = {
  edges?: boolean,
  nodes?: boolean,
  faces?: boolean,
  baseEdges?: boolean,
  baseNodes?: boolean,
  baseFaces?: boolean,
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
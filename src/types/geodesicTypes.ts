import GeoNode from "../scripts/geodesic/node";

type NodeConnections = {
  edges: string[],
  faces: string[]
}

type Geo = Map<string, GeoNode>;

type BaseType = 'cube' | 'icosahedron' | 'tetrahedron';

export type { NodeConnections, Geo, BaseType }
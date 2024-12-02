import { NodeConnections } from "../../types/geodesicTypes";

class GeoNode {
  x: number;
  y: number;
  z: number;
  connections: NodeConnections;
  constructor(x: number, y: number, z: number, connections: {edges: string[], faces: string[]} = {edges: [], faces: []}) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.connections = connections;
  }
}

export default GeoNode;
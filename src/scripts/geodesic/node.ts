class GeoNode {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  connections: {
    edges: string[],
    faces: string[]
  };
  constructor(x: number, y: number, z: number, connections: {edges: string[], faces: string[]} = {edges: [], faces: []}) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = 'blue';
    this.size = 8;
    this.connections = connections;
  }
}

export default GeoNode;
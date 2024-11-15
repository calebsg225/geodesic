class GeoNode {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  connections: string[];
  constructor(x: number, y: number, z: number, connections: string[] = []) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = 'blue';
    this.size = 8;
    this.connections = connections;
  }
}

export default GeoNode;
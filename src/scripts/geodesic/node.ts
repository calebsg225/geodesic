class GeoNode {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  edgeConnections: string[]
  constructor(x: number, y: number, z: number) {
    this.id = '';
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = 'red';
    this.size = 5;
    this.edgeConnections = []
  }
}

export default GeoNode;
class GeoEdge {
  id: string;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  color: string;
  size: string;
  nodeConnections: string[]
  constructor(x: number, y: number, z: number, dx: number, dy: number, dz: number) {
    this.id = '';
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.color = '';
    this.size = '';
    this.nodeConnections = [];
  }
}

export default GeoEdge;
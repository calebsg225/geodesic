import GeoNode from "./geodesic/node";

class DrawCanvas {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  constructor(element: HTMLCanvasElement, width: number, height: number) {
    this.ctx = element.getContext('2d');
    this.width = width;
    this.height = height;
    this.centerX = width/2;
    this.centerY = height/2;
  }

  // temp algo for general edge sorting
  private averageZ = (z: number, dz: number): number => {
    return (z + dz) / 2;
  }

  clearCanvas = () => {
    if (!this.ctx) return;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawNode = (x: number, y: number, size: number, color: string) => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2*Math.PI);
    this.ctx.strokeStyle = 'black'
    this.ctx.lineWidth = 2
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
  }

  private drawEdge = (x: number, y: number, dx: number, dy: number) => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(dx, dy);
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = 'red';
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  drawNodes = (nodes: GeoNode[]) => {
    // TODO: sort by z, draw in z order from least to most
    const inFront: GeoNode[] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].z >= 0) {
        inFront.push(nodes[i]);
        continue;
      }
      const x = this.centerX + nodes[i].x;
      const y = this.centerY + nodes[i].y;
      this.drawNode(x, y, nodes[i].size, nodes[i].color);
    }
    for (let i = 0; i < inFront.length; i++) {
      const x = this.centerX + inFront[i].x;
      const y = this.centerY + inFront[i].y;
      this.drawNode(x, y, inFront[i].size, inFront[i].color);
    }
  }

  drawEdges = (nodes: GeoNode[]) => {
    // TODO: sort by z intersection?, draw in z order from least to most
    const inFront: number[][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].connections.length; j++) {
        if (nodes[i].connections[j] < i) continue;
        const x = nodes[i].x + this.centerX;
        const y = nodes[i].y + this.centerY;
        const z = nodes[i].z;
        const dx = nodes[nodes[i].connections[j]].x + this.centerX;
        const dy = nodes[nodes[i].connections[j]].y + this.centerY;
        const dz = nodes[nodes[i].connections[j]].z;
        if (this.averageZ(z, dz) > 0) {
          inFront.push([x, y, dx, dy]);
        } else {
          this.drawEdge(x, y, dx, dy);
        }
      }
    }
    for (let i = 0; i < inFront.length; i++) {
      const [x, y, dx, dy] = inFront[i];
      this.drawEdge(x, y, dx, dy);
    }
  }
}

export default DrawCanvas;
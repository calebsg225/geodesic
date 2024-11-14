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

  drawNodes = (nodes: Map<string, GeoNode>) => {
    // TODO: render nodes and edges in tandum?
    // keys of nodes to generate after
    const inFront: string[] = [];
    nodes.forEach((node, key) => {
      if (node.z >= 0) {
        inFront.push(key);
        return;
      }
      const x = this.centerX + node.x;
      const y = this.centerY + node.y;
      this.drawNode(x, y, node.size, node.color);
    });
    for (let i = 0; i < inFront.length; i++) {
      const node = nodes.get(inFront[i])!;
      const x = this.centerX + node.x;
      const y = this.centerY + node.y;
      this.drawNode(x, y, node.size, node.color);
    }
  }

  // may not be required any more due to the new structure of nodes as a Map
  drawEdges = (nodes: GeoNode[]) => {
    // TODO: sort by z intersection?, draw in z order from least to most
    // maybe I don't need to do /\ this due to the nature of the render?
    const inFront: number[][] = [];
    const inMiddle: number[][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].connections.length; j++) {
        if (nodes[i].connections[j] < i) continue;
        const x = nodes[i].x + this.centerX;
        const y = nodes[i].y + this.centerY;
        const z = nodes[i].z;
        const dx = nodes[nodes[i].connections[j]].x + this.centerX;
        const dy = nodes[nodes[i].connections[j]].y + this.centerY;
        const dz = nodes[nodes[i].connections[j]].z;
        const aZ = this.averageZ(z, dz);
        if (aZ > 0) {
          inFront.push([x, y, dx, dy]);
        } else if (aZ === 0) {
          inMiddle.push([x, y, dx, dy]);
        } else {
          // render back first
          this.drawEdge(x, y, dx, dy);
        }
      }
    }
    // render middle second
    for (let i = 0; i < inMiddle.length; i++) {
      const [x, y, dx, dy] = inMiddle[i];
      this.drawEdge(x, y, dx, dy);
    }
    // render fron third
    for (let i = 0; i < inFront.length; i++) {
      const [x, y, dx, dy] = inFront[i];
      this.drawEdge(x, y, dx, dy);
    }
  }
}

export default DrawCanvas;
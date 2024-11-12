import GeoNode from "./geodesic/node";

class DrawCanvas {
  ctx: CanvasRenderingContext2D | null;
  element: HTMLCanvasElement | null;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  constructor() {
    this.element = null;
    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.ctx = null;
  }

  init = (element: HTMLCanvasElement, width: number, height: number) => {
    element.width = width;
    element.height = height;
    this.element = element;
    this.ctx = element.getContext('2d');
    this.updateCanvasSize(width, height);
  }
  updateCanvasSize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    this.centerX = width/2;
    this.centerY = width/2;
  }

  drawNodes = (nodes: GeoNode[]) => {
    const behind: GeoNode[] = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].z >= 0) {
        behind.push(nodes[i]);
        continue;
      }
      const x = this.centerX + nodes[i].x;
      const y = this.centerY + nodes[i].y;
      this.drawCircle(x, y, nodes[i].size, nodes[i].color);
    }
  }

  private drawCircle = (x: number, y: number, size: number, color: string) => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2*Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
  }
}

export default new DrawCanvas;
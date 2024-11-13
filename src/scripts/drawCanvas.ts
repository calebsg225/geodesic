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
    for (let i = 0; i < behind.length; i++) {
      const x = this.centerX + behind[i].x;
      const y = this.centerY + behind[i].y;
      this.drawCircle(x, y, behind[i].size, behind[i].color);
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

export default DrawCanvas;
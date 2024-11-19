import { Geo } from "../types/geodesicTypes";
import Utils from "./helpers/Utils";

class DrawCanvas {
  private utils: Utils;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  constructor(element: HTMLCanvasElement, width: number, height: number) {
    this.utils = new Utils();
    this.ctx = element.getContext('2d');
    this.width = width;
    this.height = height;
    this.centerX = width/2;
    this.centerY = height/2;
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

  private drawEdge = (x: number, y: number, dx: number, dy: number, color: string) => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(dx, dy);
    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = color;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  drawNodes = (nodes: Geo) => {
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

  drawEdges = (nodes: Geo): void => {
    const inFront: number[][] = [];
    const inMiddle: number[][] = [];
    for (const k of nodes.keys()) {
      const node = nodes.get(k)!;
      const edges = node.connections.edges;
      for (let j = 0; j < edges.length; j++) {
        if (this.utils.numFromChar(edges[j]) < this.utils.numFromChar(k)) continue;
        const x = node.x + this.centerX;
        const y = node.y + this.centerY;
        const z = node.z;
        const dx = nodes.get(edges[j])!.x + this.centerX;
        const dy = nodes.get(edges[j])!.y + this.centerY;
        const dz = nodes.get(edges[j])!.z;
        const aZ = this.utils.averageZ(z, dz);
        if (aZ > 0) {
          inFront.push([x, y, dx, dy]);
        } else if (aZ === 0) {
          inMiddle.push([x, y, dx, dy]);
        } else {
          // render back first
          this.drawEdge(x, y, dx, dy, '#FF877E');
        }
      }
    }
    inMiddle.push(...inFront);
    // render middle second, render front third
    for (let i = 0; i < inMiddle.length; i++) {
      const [x, y, dx, dy] = inMiddle[i];
      this.drawEdge(x, y, dx, dy, 'red');
    }
  }
}

export default DrawCanvas;
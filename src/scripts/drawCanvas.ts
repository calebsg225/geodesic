import { DrawOptions, DrawStyles, Geo } from "../types/geodesicTypes";
import Utils from "./helpers/Utils";

class DrawCanvas {
  private utils: Utils;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  constructor(element: HTMLCanvasElement, width: number, height: number) {
    element.width = width;
    element.height = height;
    this.utils = new Utils();
    this.ctx = element.getContext('2d');
    this.width = width;
    this.height = height;
    this.centerX = width/2;
    this.centerY = height/2;
  }

  private clearCanvas = () => {
    if (!this.ctx) return;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // draws all selected aspects of the nodes inputed
  // all in one function so everything can be drawn in order from back to front based on z value
  draw = (nodes: Geo, options: DrawOptions, styles: DrawStyles) =>  {
    this.clearCanvas();
    // back base nodes
    // back nodes
    // back faces
    // back edges
    // back base faces
    // back base edges
    // front base edges
    // front base faces
    // front edges
    // front faces
    // front nodes
    // front base nodes
  }

  private drawNode = (x: number, y: number, size: number, color: string): void => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2*Math.PI);
    this.ctx.strokeStyle = 'black'
    this.ctx.lineWidth = 1
    this.ctx.fillStyle = color;
    this.ctx.fill();
    //this.ctx.stroke();
  }

  private drawEdge = (x: number, y: number, dx: number, dy: number, color: string): void => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(dx, dy);
    /* this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke(); */
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  private drawFace = (pairs: number[][], color: string): void => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(pairs[0][0], pairs[0][1]);
    for (let i = 1; i < pairs.length; i++) {
      this.ctx.lineTo(pairs[i][0], pairs[i][1]);
    }
    this.ctx.lineTo(pairs[0][0], pairs[0][1]);
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawNodes = (nodes: Geo): void => {
    // TODO: render nodes, edges, and faces in tandum?
    // keys of nodes to generate after
    const inFront: string[] = [];
    nodes.forEach((node, key) => {
      if (node.z >= 0) {
        inFront.push(key);
        return;
      }
      /* const x = this.centerX + node.x;
      const y = this.centerY + node.y;
      this.drawNode(x, y, 2, '#FFC7C7'); */
    });
    for (let i = 0; i < inFront.length; i++) {
      const node = nodes.get(inFront[i])!;
      const x = this.centerX + node.x;
      const y = this.centerY + node.y;
      this.drawNode(x, y, 2, 'blue');
    }
  }

  drawEdges = (nodes: Geo, color: string, drawBaseEdges: boolean = false): void => {
    const inFront: number[][] = [];
    const inMiddle: number[][] = [];
    for (const k of nodes.keys()) {
      const node = nodes.get(k)!;
      // draw either base edges or main edges
      const edges = drawBaseEdges ? node.connections.baseEdges : node.connections.edges;
      if (!edges) continue;
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
          this.drawEdge(x, y, dx, dy, '#DDE0FF');
        }
      }
    }

    const drawLevelEdges = (arr: number[][]) => {
      for (let i = 0; i < arr.length; i++) {
        const [x, y, dx, dy] = arr[i];
        this.drawEdge(x, y, dx, dy, color);
      }
    }
    // render middle second, render front third
    drawLevelEdges(inMiddle);
    drawLevelEdges(inFront);
  }

  drawFaces = (nodes: Geo): void => {
    const drawn = new Set();
    for (const k of nodes.keys()) {
      const node = nodes.get(k)!;
      const faces = node.connections.faces;
      for (let j = 0; j < faces.length; j++) {
        // if this particular face has been drawn, skip it
        if (drawn.has(faces[j].split('').sort().join(''))) continue;
        const pairs: number[][] = [];
        // used to calculate if z is behind
        let z = 0;
        // draw each face
        for (const p of faces[j]) {
          const x = nodes.get(p)!.x + this.centerX;
          const y = nodes.get(p)!.y + this.centerY;
          z += nodes.get(p)!.z;
          pairs.push([x, y]);
        }
        if (z/3 >= 0) {
          this.drawFace(pairs, 'red');
        }
        drawn.add(faces[j]);
      }
    }
  }
}

export default DrawCanvas;
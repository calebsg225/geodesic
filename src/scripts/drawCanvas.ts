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

    const { frontNodes, backNodes } = options.nodes.length ? this.separateNodes(nodes) : {frontNodes: [], backNodes: []};
    const { frontNodes: frontBaseNodes, backNodes: backBaseNodes } = options.baseNodes.length ? this.separateNodes(nodes, true) : {frontNodes: [], backNodes: []};

    const { frontEdges: frontBaseEdges, backEdges: backBaseEdges } = options.baseEdges.length ? this.seperateEdges(nodes, true) : {frontEdges: [], backEdges: []};
    // back base nodes
    if (options.baseNodes !== 'front') {
      this.drawNodes(backBaseNodes, styles.baseNodeSize, styles.backBaseNodeColor);
    }
    // back nodes
    if (options.nodes !== 'front') {
      this.drawNodes(backNodes, styles.nodeSize, styles.backNodeColor);
    }
    // back faces
    // back edges
    // back base faces
    // back base edges
    if (options.baseEdges !== 'front') {
      this.drawEdges(backBaseEdges, styles.baseEdgeWidth, styles.backBaseEdgeColor);
    }
    // front base edges
    if (options.baseEdges !== 'back') {
      this.drawEdges(frontBaseEdges, styles.baseEdgeWidth, styles.baseEdgeColor);
    }
    // front base faces
    // front edges
    // front faces
    // front nodes
    if (options.nodes !== 'back') {
      this.drawNodes(frontNodes, styles.nodeSize, styles.nodeColor);
    }
    // front base nodes
    if (options.baseNodes !== 'back') {
      this.drawNodes(frontBaseNodes, styles.baseNodeSize, styles.baseNodeColor);
    }
    //this.drawFaces(nodes);
    /* this.drawEdges(nodes, 'black');
    this.drawEdges(nodes, 'red', true); */
  }

  private drawNode = (x: number, y: number, size: number, color: string): void => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2*Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  private drawEdge = (x: number, y: number, dx: number, dy: number, width: number, color: string): void => {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(dx, dy);
    this.ctx.lineWidth = width;
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

  /**
   * separates front and back nodes based on z value
   * @param nodes nodes to separate
   * @param baseNodes if true, calculate only base nodes
   * @returns two arrays, one for front nodes and one for back nodes
   */
  private separateNodes = (nodes: Geo, baseNodes: boolean = false) => {
    const frontNodes: number[][] = [];
    const backNodes: number[][] = [];
    nodes.forEach((node, key) => {
      const isBaseNode = key.length === 1;
      if (baseNodes && !isBaseNode) return;
      const x = this.centerX + node.x;
      const y = this.centerY + node.y;
      if (node.z >= 0) {
        frontNodes.push([x, y]);
      } else {
        backNodes.push([x, y]);
      }
    });
    return {frontNodes: frontNodes, backNodes: backNodes}
  }

  private seperateEdges = (nodes: Geo, baseEdges: boolean = false) => {
    const frontEdges: number[][] = [];
    const backEdges: number[][] = [];
    for (const k of nodes.keys()) {
      const node = nodes.get(k)!;
      // draw either base edges or main edges
      const edges = baseEdges ? node.connections.baseEdges : node.connections.edges;
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
        if (aZ >= 0) {
          frontEdges.push([x, y, dx, dy]);
        } else {
          backEdges.push([x, y, dx, dy]);
        }
      }
    }
    return {frontEdges: frontEdges, backEdges: backEdges}
  }

  private drawNodes = (nodeCoords: number[][], size: number, color: string): void => {
    for (const [x, y] of nodeCoords) {
      this.drawNode(x, y, size, color);
    }
  }

  private drawEdges = (edges: number[][], width: number, color: string) => {
    for (let i = 0; i < edges.length; i++) {
      const [x, y, dx, dy] = edges[i];
      this.drawEdge(x, y, dx, dy, width, color);
    }
  }

  private drawFaces = (nodes: Geo) => {
    const drawn = new Set();
    const backFaces: number[][][] = [];
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
        if (z/3 < 0) {
          this.drawFace(pairs, '#ff0101aa');
        } else {
          backFaces.push(pairs);
        }
        drawn.add(faces[j].split('').sort().join(''));
      }
    }
    for (const face of backFaces) {
      this.drawFace(face, '#ff0101aa');
    }
  }
}

export default DrawCanvas;
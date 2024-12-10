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

    const {
      frontNodes,
      backNodes,
      frontBaseNodes,
      backBaseNodes,
      frontEdges,
      backEdges,
      frontBaseEdges,
      backBaseEdges,
      frontFaces,
      backFaces,

      labelNodes
    } = this.separate(nodes);

    // back base nodes
    if (options.baseNodes.length && options.baseNodes !== 'front') {
      this.drawNodes(backBaseNodes, styles.baseNodeSize, styles.backBaseNodeColor);
    }
    // back nodes
    if (options.nodes.length && options.nodes !== 'front') {
      this.drawNodes(backNodes, styles.nodeSize, styles.backNodeColor);
    }
    // back faces
    if (options.faces.length && options.faces !== 'front') {
      this.drawFaces(backFaces, styles.backFaceColor);
    }
    // back edges
    if (options.edges.length && options.edges !== 'front') {
      this.drawEdges(backEdges, styles.edgeWidth, styles.backEdgeColor);
    }
    // back base faces
    // back base edges
    if (options.baseEdges.length && options.baseEdges !== 'front') {
      this.drawEdges(backBaseEdges, styles.baseEdgeWidth, styles.backBaseEdgeColor);
    }
    // front base edges
    if (options.baseEdges.length && options.baseEdges !== 'back') {
      this.drawEdges(frontBaseEdges, styles.baseEdgeWidth, styles.baseEdgeColor);
    }
    // front base faces
    // front edges
    if (options.edges.length && options.edges !== 'back') {
      this.drawEdges(frontEdges, styles.edgeWidth, styles.edgeColor);
    }
    // front faces
    if (options.faces.length && options.faces !== 'back') {
      this.drawFaces(frontFaces, styles.faceColor);
    }
    // front nodes
    if (options.nodes.length && options.nodes !== 'back') {
      this.drawNodes(frontNodes, styles.nodeSize, styles.nodeColor);
    }
    // front base nodes
    if (options.baseNodes.length && options.baseNodes !== 'back') {
      this.drawNodes(frontBaseNodes, styles.baseNodeSize, styles.baseNodeColor);
    }
    //this.drawFaces(nodes);
    //this.labelNodes(labelNodes);
    /* this.drawEdges(nodes, 'black');
    this.drawEdges(nodes, 'red', true); */
  }

  private labelNode = (x: number, y: number, text: string) => {
    if (!this.ctx) return;
    const s = 12;
    this.ctx.font = `Bold ${4*s}px Arial`;
    this.ctx.fillStyle = "red";
    this.ctx.fillText(text.toUpperCase(), x-s, y+s);
  }

  private labelNodes = (toLabel: any[][]) => {
    for (const t of toLabel) {
      const [x, y, k] = t;
      this.labelNode(x, y, k);
    }
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

  private drawFaces = (faces: number[][][], color: string): void => {
    for (let i = 0; i < faces.length; i++) {
      this.drawFace(faces[i], color);
    }
  }

  /**
   * separates geodesic structure into groups based on type and z value
   * @param nodes nodes of geodesic structure to separate
   * @returns 
   */
  private separate = (nodes: Geo) => {
    const frontNodes: number[][] = [];
    const backNodes: number[][] = [];
    const frontBaseNodes: number[][] = [];
    const backBaseNodes: number[][] = [];

    const frontEdges: number[][] = [];
    const backEdges: number[][] = [];
    const frontBaseEdges: number[][] = [];
    const backBaseEdges: number[][] = [];

    const frontFaces: number[][][] = [];
    const backFaces: number[][][] = [];
    const frontBaseFaces: number[][][] = [];
    const backBaseFaces: number[][][] = [];

    const labelNodes: any[][] = [];

    const separatedEdges = new Set<string>();
    const separatedBaseEdges = new Set<string>();

    const separatedFaces = new Set<string>();
    const separatedBaseFaces = new Set<string>();

    for (const k of nodes.keys()) {
      const isBaseNode = k.length === 1;

      const node = nodes.get(k)!;
      const { edges, baseEdges, faces, baseFaces } = node.connections;

      const x = this.centerX + node.x;
      const y = this.centerY + node.y;

      // handle node separation
      if (node.z >= 0) {
        frontNodes.push([x,y]);
        if (isBaseNode) frontBaseNodes.push([x,y]);
      } else {
        backNodes.push([x,y]);
        if (isBaseNode) backBaseNodes.push([x,y]);
      }

      if (isBaseNode) labelNodes.push([x, y, k]);

      if (baseEdges) { // is a base node
        // bfs through base edges
        for (let i = 0; i < baseEdges.length; i++) {
          // if already separated, continue
          if (separatedBaseEdges.has( [baseEdges[i], k].sort().join('') )) continue;
          const dx = nodes.get(baseEdges[i])!.x + this.centerX;
          const dy = nodes.get(baseEdges[i])!.y + this.centerY;
          const aZ = this.utils.averageZ(node.z, nodes.get(baseEdges[i])!.z);
          if (aZ >= 0) {
            frontBaseEdges.push([x, y, dx, dy]);
          } else {
            backBaseEdges.push([x, y, dx, dy]);
          }
          separatedBaseEdges.add( [baseEdges[i], k].sort().join('') );
        }
      }

      // bfs through edges
      for (let i = 0; i < edges.length; i++) {
        // if already separated, continue
        if (separatedEdges.has( [edges[i], k].sort().join('') )) continue;
        const dx = nodes.get(edges[i])!.x + this.centerX;
        const dy = nodes.get(edges[i])!.y + this.centerY;
        const aZ = this.utils.averageZ(node.z, nodes.get(edges[i])!.z);
        if (aZ >= 0) {
          frontEdges.push([x, y, dx, dy]);
        } else {
          backEdges.push([x, y, dx, dy]);
        }
        separatedEdges.add( [edges[i], k].sort().join('') );
      }

      // bfs through faces
      for (let i = 0; i < faces.length; i++) {
        // if already separated, continue
        if (separatedFaces.has( faces[i].split('-').sort().join('') )) continue;
        const pairs: number[][] = [];
        // used to calculate if z is behind
        let z = 0;
        // draw each face
        for (const p of faces[i].split('-')) {
          const x = nodes.get(p)!.x + this.centerX;
          const y = nodes.get(p)!.y + this.centerY;
          z += nodes.get(p)!.z;
          pairs.push([x, y]);
        }
        if (z/3 >= 0) {
          frontFaces.push(pairs);
        } else {
          backFaces.push(pairs);
        }
        separatedFaces.add( faces[i].split('-').sort().join('') );
      }

    }

    return {
      frontNodes,
      backNodes,
      frontBaseNodes,
      backBaseNodes,

      frontEdges,
      backEdges,
      frontBaseEdges,
      backBaseEdges,

      frontFaces,
      backFaces,
      frontBaseFaces,
      backBaseFaces,

      labelNodes
    }
  }

  separateFaces = (nodes: Geo, baseFaces: boolean = false) => {
    const drawn = new Set();
    const frontFaces: number[][][] = [];
    const backFaces: number[][][] = [];
    for (const k of nodes.keys()) {
      const faces = baseFaces ? nodes.get(k)!.connections.baseFaces! : nodes.get(k)!.connections.faces;
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
          frontFaces.push(pairs);
        } else {
          backFaces.push(pairs);
        }
        drawn.add(faces[j].split('').sort().join(''));
      }
    }
    return {frontFaces: frontFaces, backFaces: backFaces}
  }
}

export default DrawCanvas;
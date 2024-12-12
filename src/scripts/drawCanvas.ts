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

  /**
   * 
   * @param n axis value to adjust
   * @param z z axis value
   * @param isXAxis set true if n is x
   * @returns adjusted coordinate for perspective
   */
  private d = (n: number, z: number, isXAxis: boolean = false): number => {
    return n*(1+z/4000) + (isXAxis ? this.centerX : this.centerY);
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
      frontBaseFaces,
      backBaseFaces,

      //labelNodes
    } = this.separate(nodes);

    // back base nodes
    if (options.baseNodes%3) {
      this.drawNodes(backBaseNodes, styles.baseNodeSize, styles.backBaseNodeColor);
    }
    // back nodes
    if (options.nodes%3) {
      this.drawNodes(backNodes, styles.nodeSize, styles.backNodeColor);
    }
    // back faces
    if (options.faces%3) {
      this.drawFaces(backFaces, styles.backFaceColor);
    }
    // back edges
    if (options.edges%3) {
      this.drawEdges(backEdges, styles.edgeWidth, styles.backEdgeColor);
    }
    // back base faces
    if (options.baseFaces%3) {
      this.drawFaces(backBaseFaces, styles.backBaseFaceColor);
    }
    // back base edges
    if (options.baseEdges%3) {
      this.drawEdges(backBaseEdges, styles.baseEdgeWidth, styles.backBaseEdgeColor);
    }
    // front base edges
    if (options.baseEdges > 1) {
      this.drawEdges(frontBaseEdges, styles.baseEdgeWidth, styles.baseEdgeColor);
    }
    // front base faces
    if (options.baseFaces > 1) {
      this.drawFaces(frontBaseFaces, styles.baseFaceColor);
    }
    // front edges
    if (options.edges > 1) {
      this.drawEdges(frontEdges, styles.edgeWidth, styles.edgeColor);
    }
    // front faces
    if (options.faces > 1) {
      this.drawFaces(frontFaces, styles.faceColor);
    }
    // front nodes
    if (options.nodes > 1) {
      this.drawNodes(frontNodes, styles.nodeSize, styles.nodeColor);
    }
    // front base nodes
    if (options.baseNodes > 1) {
      this.drawNodes(frontBaseNodes, styles.baseNodeSize, styles.baseNodeColor);
    }
    //this.labelNodes(labelNodes);
  }

  private labelNode = (x: number, y: number, text: string) => {
    if (!this.ctx) return;
    const s = 20;
    this.ctx.font = `Bold ${4*s}px Arial`;
    this.ctx.fillStyle = "#FF00A6";
    this.ctx.fillText(text.toUpperCase(), x-s, y+s);
  }

  labelNodes = (toLabel: any[][]) => {
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
    //this.ctx.stroke();
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

      const x = this.d(node.x, node.z, true);
      const y = this.d(node.y, node.z);

      // handle node separation
      if (node.z >= 0) {
        frontNodes.push([x,y]);
        if (isBaseNode) frontBaseNodes.push([x,y]);
      } else {
        backNodes.push([x,y]);
        if (isBaseNode) backBaseNodes.push([x,y]);
      }

      if (isBaseNode && node.z >= 0) labelNodes.push([x, y, k]);

      if (baseEdges) { // is a base node
        // bfs through base edges
        for (let i = 0; i < baseEdges.length; i++) {
          // if already separated base edge, continue
          if (separatedBaseEdges.has( [baseEdges[i], k].sort().join('') )) continue;
          const dz = nodes.get(baseEdges[i])!.z;
          const dx = this.d(nodes.get(baseEdges[i])!.x, dz, true);
          const dy = this.d(nodes.get(baseEdges[i])!.y, dz);
          const aZ = this.utils.averageZ(node.z, dz);
          if (aZ >= 0) {
            frontBaseEdges.push([x, y, dx, dy]);
          } else {
            backBaseEdges.push([x, y, dx, dy]);
          }
          separatedBaseEdges.add( [baseEdges[i], k].sort().join('') );
        }
      }

      if (baseFaces) { // is a base node
        // bfs through base faces
        for (let i = 0; i < baseFaces.length; i++) {
          // if already separated base face, continue
          if (separatedBaseFaces.has( baseFaces[i].split('-').sort().join('') )) continue;
          const pairs: number[][] = [];
          // used to calculate if average z is positive
          let aZ = 0;
          for (const p of baseFaces[i].split('-')) {
            const {x: dx, y: dy, z: dz} = nodes.get(p)!;
            aZ += dz;
            pairs.push([this.d(dx, dz, true), this.d(dy, dz)]);
          }
          if (aZ/3 >= 0) {
            frontBaseFaces.push(pairs);
          } else {
            backBaseFaces.push(pairs);
          }
          separatedBaseFaces.add( baseFaces[i].split('-').sort().join('') );
        }
      }

      // bfs through edges
      for (let i = 0; i < edges.length; i++) {
        // if already separated, continue
        if (separatedEdges.has( [edges[i], k].sort().join('') )) continue;
        if (!nodes.get(edges[i])) continue; // TEMP
        const dz = nodes.get(edges[i])!.z;
        const dx = this.d(nodes.get(edges[i])!.x, dz, true);
        const dy = this.d(nodes.get(edges[i])!.y, dz);
        const aZ = this.utils.averageZ(node.z, dz);
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
        // used to calculate if average z is positive
        let aZ = 0;
        for (const p of faces[i].split('-')) {
          const {x: dx, y: dy, z: dz} = nodes.get(p)!;
          aZ += dz;
          pairs.push([this.d(dx, dz, true), this.d(dy, dz)]);
        }
        if (aZ/3 >= 0) {
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
}

export default DrawCanvas;
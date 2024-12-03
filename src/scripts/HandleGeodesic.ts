import DrawCanvas from './DrawCanvas';
import GeodesicInterface from './GeodesicInterface';
import GeoNode from "./geodesic/node";
import Utils from './helpers/Utils';
import { NodeConnections, Geo, BaseType, DrawStyles, DrawOptions } from '../types/geodesicTypes';

class HandleGeodesic {
  private geodesicInterface: GeodesicInterface;
  private drawCanvas: DrawCanvas;
  private utils: Utils;
  private bases: Map<BaseType, Geo>;
  private baseType: BaseType;
  private nodes: Geo;
  private zoom: number;
  private zoomMin: number;
  private zoomStep: number;
  private zoomMax: number;
  private frequency: number;
  private rotationRads: number;
  private drawOptions: DrawOptions;
  private drawStyles: DrawStyles;
  constructor(canvasParentElement: HTMLElement, panelParentElement: HTMLElement) {
    this.drawOptions = {}
    this.drawStyles = {
      nodeColor: 'blue',
      backNodeColor: '#FFC7C7',
      nodeSize: 2,

      edgeColor: 'red',
      backEdgeColor: '#DDE0FF',
      edgeWidth: 1,

      faceColor: 'blue',
      backFaceColor: 'grey',

      baseNodeColor: 'blue',
      backBaseNodeColor: '#FFC7C7',
      baseNodeSize: 4,

      baseEdgeColor: 'blue',
      backBaseEdgeColor: '#DDE0FF',
      baseEdgeWidth: 1,

      baseFaceColor: 'blue',
      backBaseFaceColor: 'grey'
    }

    this.baseType = 'icosahedron';
    this.nodes = new Map();
    this.zoom = 470;
    this.zoomMin = 50;
    this.zoomStep = 20;
    this.zoomMax = 5000;
    this.bases = new Map();
    this.frequency = 1;
    this.rotationRads = 0.008;

    this.utils = new Utils();
    this.geodesicInterface = new GeodesicInterface(canvasParentElement, panelParentElement);
    this.drawCanvas = new DrawCanvas(this.geodesicInterface.getCanvasElement(), 950, 950);

    this.geodesicInterface.generateEventListeners(this.rotate, this.updateZoom);

    this.generateBases();
    this.generateGeo();
    this.render();
  }

  private generateBases = (): void => {
    this.bases.set('cube', this.generateCubeBase());
    this.bases.set('icosahedron', this.generateIcosahedronBase());
  }

  private generateIcosahedronBase = (): Geo => {
    const icosahedronBase: Geo = new Map();
    const g = (1+Math.sqrt(5))/4; // HALF golden ratio
    const n = .5;
    const r = this.utils.distanceF(0, .5, g, 0, 0, 0);
    const setNode = (x: number, y: number, z: number, v: number) => {
      icosahedronBase.set(
        this.utils.mapChar(v), 
        new GeoNode(
          x* this.zoom, y* this.zoom, z* this.zoom, 
          this.getIcosahedronConnections(v)
        )
      );
    }
    // calculate values on x plane
    for (let i = 0; i <= 3; i++) {
      const y = g*(2*Math.floor(i/2) - 1);
      const z = n*(2*(i%2) - 1);
      setNode(0, y/r, z/r, i);
    }
    // calculate values on z plane
    for (let i = 4; i <= 7; i++) {
      const x = g*(2*Math.floor((i%4)/2) - 1);
      const y = n*(2*(i%2) - 1);
      setNode(x/r, y/r, 0, i);
    }
    // calculate values on y plane
    for (let i = 8; i <= 11; i++) {
      const x = n*(2*(i%2) - 1);
      const z = g*(2*Math.floor((i%4)/2) - 1);
      setNode(x/r, 0, z/r, i);
    }
    return icosahedronBase;
  }

  private generateCubeBase = (): Geo => {
    const cubeBase: Geo = new Map();
    const r = Math.sqrt(3); // use r to make each coord 1 from the center
    for (let i = -1; i < 2; i+=2) {
      for (let j = -1; j < 2; j+=2) {
        for (let k = -1; k < 2; k+=2) {
          cubeBase.set(
            this.utils.mapChar(cubeBase.size), 
            new GeoNode(
              i/r * this.zoom, j/r * this.zoom, k/r * this.zoom, 
              this.getCubeConnections(cubeBase.size)
            )
          );
        }
      }
    }
    return cubeBase;
  }
  
  // given an integer 0-11 inclusive, returns connected icosahedron edges and faces
  private getIcosahedronConnections = (v: number): NodeConnections => {
    const gT = (n: number) => (n^1)%12;
    const gM = (n: number) => 4*((Math.floor(n/4) + 1)%3) + Math.floor(n/2)%2;
    const gB = (n: number) => 4*((Math.floor(n/4) + 2)%3) + 2*(n%2);
    this.utils.mapToChars([v, gT(v), gM(v)]).sort().join('');
    const edges = this.utils.mapToChars([gT(v), gM(v), gM(v) + 2, gB(v), gB(v)+1]);
    const faces = [
      [gT(v), gM(v)],
      [gM(v), gB(v)],
      [gB(v), gB(v) + 1],
      [gB(v) + 1, gM(v) + 2],
      [gM(v) + 2, gT(v)]
    ].map(val => this.utils.mapToChars([v, ...val]).join(''));
    return {
      edges: edges,
      baseEdges: edges,
      faces: faces,
      baseFaces: faces
    };
  }

  // given an integer 0-7 inclusive, returns connected cube edges and faces
  private getCubeConnections = (bin: number): NodeConnections => {
    return {
      edges: this.utils.mapToChars([bin ^ 0b001, bin ^ 0b010, bin ^ 0b100]),
      // TODO: calculate cube faces
      // faces are in adjacent order. This matters when drawing non-triangle faces for the drawFace function.
      faces: []
    }
  }

  setBase = (baseType: BaseType) => {
    this.baseType = baseType;
    this.generateGeo();
  }

  /**
   * generate all nodes in the geodesic structure at the given frequency
   * @param v frequency of geodesic structure
   */
  private generateGeo = () => {
    if (this.frequency === 1) {
      this.nodes = this.bases.get(this.baseType)!;
      return;
    }
    switch(this.baseType) {
      case('icosahedron'):
        this.generateIcosahedronAtFrequency();
        break;
      case('cube'):
        break;
      default:
        break;
    }
  }

  private generateIcosahedronAtFrequency = (): void => {
    this.nodes = new Map();
    const nodes = this.bases.get(this.baseType)!;
    const v = this.frequency;
    const visited = new Set<string>();

    // map of string keys and edge connections to add to nodes at string key
    const addEdgeConnections: {[key: string]: string[]} = {};

    for (const k of nodes.keys()) {
      const node = nodes.get(k)!;
      const faces = node.connections.faces;
      for (let f = 0; f < faces.length; f++) {
        // if face has been drawn, skip
        const face = faces[f].split('').sort();
        if (visited.has(face.join(''))) continue;

        // generate all intermediate nodes
        for (let i = v; i >= 0; i--) {
          for (let j = v-i; j >= 0; j--) {
            const connections: NodeConnections = { edges: [], faces: [] }
            const k = v-i-j;
            const key = `${i ? `${face[0]}${i}` : ''}${j ? `${face[1]}${j}` : ''}${k ? `${face[2]}${k}` : ''}`;

            // add base connections to base vertices
            const baseKey = `${i ? `${face[0]}` : ''}${j ? `${face[1]}` : ''}${k ? `${face[2]}` : ''}`;
            if (nodes.has(baseKey)) {
              connections.baseEdges = nodes.get(`${baseKey}`)!.connections.baseEdges?.map(val => val + `${v}`);
              connections.baseFaces = nodes.get(`${baseKey}`)!.connections.baseFaces;
            }

            if (i && j && k) { // base face node
              for (let o = 0; o < 3; o++) {
                for (let p = 0; p < 2; p++) {
                  const i2 = i+(o-1);
                  const j2 = j+((o+1+p)%3 - 1);
                  const k2 = v-i2-j2;
                  const edgeKey = `${i2 ? `${face[0]}${i2}` : ''}${j2 ? `${face[1]}${j2}` : ''}${k2 ? `${face[2]}${k2}` : ''}`;
                  connections.edges.push(edgeKey);
                  if (i2 && j2 && k2) continue; // face node
                  // edge node
                  if (addEdgeConnections[edgeKey]) addEdgeConnections[edgeKey].push(key);
                  else (addEdgeConnections[edgeKey] = [key]);
                }
              }
            } else if ((i && j) || (j && k) || (k && i)) { // base edge node
              for (let o = 0; o < 2; o++) {
                const p = o*2-1;
                const i2 = i ? i+p : 0;
                const j2 = j ? j+(i ? -p : p) : 0;
                const k2 = k ? k-p : 0;
                const edgeKey = `${i2 ? `${face[0]}${i2}` : ''}${j2 ? `${face[1]}${j2}` : ''}${k2 ? `${face[2]}${k2}` : ''}`;
                connections.edges.push(edgeKey);

                if (i2 === v || j2 === v || k2 === v) {
                  // vertex node
                  if (addEdgeConnections[edgeKey]) addEdgeConnections[edgeKey].push(key);
                  else (addEdgeConnections[edgeKey] = [key]);
                }
              }
            }

            // if this node has been generated, skip
            if (this.nodes.has(key)) continue;
            const {x:x0, y:y0, z:z0} = nodes.get(face[0])!;
            const {x:x1, y:y1, z:z1} = nodes.get(face[1])!;
            const {x:x2, y:y2, z:z2} = nodes.get(face[2])!;
            const {x, y, z} = this.utils.icosahedronIntermediateNode(i, j, k, x0, y0, z0, x1, y1, z1, x2, y2, z2);
            this.nodes.set(key, new GeoNode(x*this.zoom, y*this.zoom, z*this.zoom, connections));
          }
        }

        // draw face-specific edges
        for (let i = 0; i < 3; i++) {
          const e1key = [`${face[i]}${v-1}`, `${face[(i+1)%3]}${1}`].sort().join('');
          const e2key = [`${face[i]}${v-1}`, `${face[(i+2)%3]}${1}`].sort().join('');
          if (addEdgeConnections[e1key]) addEdgeConnections[e1key].push(e2key);
          else (addEdgeConnections[e1key] = [e2key]);
          if (addEdgeConnections[e2key]) addEdgeConnections[e2key].push(e1key);
          else (addEdgeConnections[e2key] = [e1key]);
        }

        visited.add(face.join(''));
      }
    }

    // add edge connections to base vertices and edges
    // doing it this way to be certain every node that needs edge connections has already been generated
    for (const key of Object.keys(addEdgeConnections)) {
      this.nodes.get(key)!.connections.edges.push(...addEdgeConnections[key]);
    }

  }

  private render = () => {
    this.drawCanvas.draw(this.nodes, this.drawOptions, this.drawStyles);
  }

  /**
   * sets new zoom value
   * re-renders with new zoom value
   */
  private updateZoom = (isPositive: boolean) => {
    let newZoom = 0;
    if (!isPositive && this.zoom > this.zoomMin) {
      newZoom = this.zoom - this.zoomStep;
    }
    if (isPositive && this.zoom < this.zoomMax) {
      newZoom = this.zoom + this.zoomStep;
    }
    if (!newZoom) return;
    const deltaZoom = this.zoom / newZoom;
    this.nodes.forEach((node, key) => {
      this.nodes.set(key,
        new GeoNode(node.x / deltaZoom, node.y / deltaZoom, node.z / deltaZoom, node.connections)
      )
    });
    this.zoom = newZoom;
    this.render();
  }

  // TODO: make zoom change the amount of rotation
  private rotate = (x: number, y: number) => {
    this.nodes.forEach((node, key) => {
      const { x: newX, y: newY, z: newZ } = this.utils.calculateRotatedCoordinates(node.x, node.y, node.z, x, y, 0, this.rotationRads);
      this.nodes.set(key, 
        new GeoNode(newX, newY, newZ, node.connections)
      );
    });
    this.render();
  }
}

export default HandleGeodesic;
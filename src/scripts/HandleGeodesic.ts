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
    this.drawOptions = {
      nodes: 'both',
      edges: 'both',
      faces: 'both',
      baseNodes: 'both',
      baseEdges: 'both',
      baseFaces: 'both'
    }
    this.drawStyles = {
      nodeColor: 'blue',
      backNodeColor: '#FFC7C7',
      nodeSize: 3,

      edgeColor: 'black',
      backEdgeColor: '#D8D8D8',
      edgeWidth: 1,

      faceColor: '#0800FFba',
      backFaceColor: '#C6C6C6',

      baseNodeColor: 'blue',
      backBaseNodeColor: 'blue',
      baseNodeSize: 6,

      baseEdgeColor: 'red',
      backBaseEdgeColor: '#FF000030',
      baseEdgeWidth: 4,

      baseFaceColor: '#0800FF7a',
      backBaseFaceColor: '#c6c6c6'
    }

    this.baseType = 'icosahedron';
    this.nodes = new Map();
    this.zoom = 495;
    this.zoomMin = 50;
    this.zoomStep = 20;
    this.zoomMax = 5000;
    this.bases = new Map();
    this.frequency = 3;
    this.rotationRads = 0.002;

    this.utils = new Utils();
    this.geodesicInterface = new GeodesicInterface(canvasParentElement, panelParentElement);
    this.drawCanvas = new DrawCanvas(this.geodesicInterface.getCanvasElement(), 1000, 1000);

    this.geodesicInterface.generateEventListeners(this.rotate, this.updateZoom);

    this.generateBases();
    this.generateGeo();
    const randx = Math.random() * 1000 + 100;
    const randy = Math.random() * 1000 + 100;
    this.rotate(randx,randy); // rotate randomly from default coords before rendering for the first time ( because i want to :D )
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
    const edges = this.utils.mapToChars([gT(v), gM(v), gB(v), gB(v) + 1, gM(v) + 2]);
    const faces = this.utils.calculateConnectedFaces(this.utils.mapChar(v), edges, 3);
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
    const baseNodes = this.bases.get(this.baseType)!;
    const v = this.frequency;
    const visited = new Set<string>();

    // edge connections to add after all nodes have been generated
    const addEdgeConnections: {[key: string]: Set<string>} = {};

    for (const k of baseNodes.keys()) {
      const node = baseNodes.get(k)!;
      const faces = node.connections.faces;
      // bfs through all base faces
      for (let f = 0; f < faces.length; f++) {
        const face = faces[f].split('-').sort();
        if (visited.has(face.join('-'))) continue; // if face has been drawn, skip

        // generate all intermediate nodes (nodes not on the edges or vertices of the base shape)
        for (let i = v; i >= 0; i--) {
          for (let j = v-i; j >= 0; j--) {
            const connections: NodeConnections = { edges: [], faces: [] }
            const k = v-i-j;
            const key = this.utils.generateKeyName(face, i, j, k, v);

            // add base connections to base vertices 
            if (baseNodes.has(key)) {
              connections.baseEdges = baseNodes.get(key)!.connections.baseEdges!;
              connections.baseFaces = baseNodes.get(key)!.connections.baseFaces!;
            }

            if (i && j && k) { // parent node is a face node
              for (let o = 0; o < 3; o++) {
                for (let p = 0; p < 2; p++) {
                  const i2 = i+(o-1);
                  const j2 = j+((o+1+p)%3 - 1);
                  const k2 = v-i2-j2;
                  const edgeKey = this.utils.generateKeyName(face, i2, j2, k2, v); // node connected by an edge to parent node
                  connections.edges.push(edgeKey);
                  if (i2 && j2 && k2) continue; // calculated node is face node
                  // calculated is edge node (vertex nodes are not reachable by one edge from face nodes)

                  // add edge to connections to be added after all nodes have been generated
                  if (addEdgeConnections[edgeKey]) addEdgeConnections[edgeKey].add(key);
                  else (addEdgeConnections[edgeKey] = new Set([key]));
                }
              }

              // swap nodes 3 and 5 so that edges are in order for face generation
              // not clean but it works for now (and probably wont be changed) :)
              [connections.edges[3], connections.edges[5]] = [connections.edges[5], connections.edges[3]];

              // calculate connected faces of face nodes
              connections.faces = this.utils.calculateConnectedFaces(key, connections.edges, 3);

            } else if ((i && j) || (j && k) || (k && i)) { // parent node is an edge node
              for (let o = 0; o < 2; o++) {
                const p = o*2-1; // 1 or -1
                const i2 = i ? i+p : 0;
                const j2 = j ? j+(i ? -p : p) : 0;
                const k2 = k ? k-p : 0;
                const edgeKey = this.utils.generateKeyName(face, i2, j2, k2, v);
                connections.edges.push(edgeKey);
                
                if (i2 === v || j2 === v || k2 === v) { // parent node connected to a vertex node
                  if (addEdgeConnections[edgeKey]) addEdgeConnections[edgeKey].add(key);
                  else (addEdgeConnections[edgeKey] = new Set([key]));
                }
              }
            }

            // if this node has been generated, skip
            if (this.nodes.has(key)) continue;
            const {x:x0, y:y0, z:z0} = baseNodes.get(face[0])!;
            const {x:x1, y:y1, z:z1} = baseNodes.get(face[1])!;
            const {x:x2, y:y2, z:z2} = baseNodes.get(face[2])!;
            const {x, y, z} = this.utils.icosahedronIntermediateNode(i, j, k, x0, y0, z0, x1, y1, z1, x2, y2, z2);
            this.nodes.set(key, new GeoNode(x*this.zoom, y*this.zoom, z*this.zoom, connections));
          }
        }

        // draw face-specific edges
        for (let i = 0; i < 3; i++) {
          const e1key = [`${face[i]}${v-1}`, `${face[(i+1)%3]}${1}`].sort().join('');
          const e2key = [`${face[i]}${v-1}`, `${face[(i+2)%3]}${1}`].sort().join('');
          if (addEdgeConnections[e1key]) addEdgeConnections[e1key].add(e2key);
          else (addEdgeConnections[e1key] = new Set([e2key]));
          if (addEdgeConnections[e2key]) addEdgeConnections[e2key].add(e1key);
          else (addEdgeConnections[e2key] = new Set([e1key]));
        }

        visited.add(face.join('-'));
      }
    }

    // add edge connections to base vertices and edges
    // doing it this way to be certain every node that needs edge connections has already been generated
    for (const key of Object.keys(addEdgeConnections)) {
      const cons = this.nodes.get(key)!.connections;
      cons.edges.push(...addEdgeConnections[key]);
      // calculate faces now that all edges are connected
      //cons.faces = this.utils.calculateConnectedFaces(key, cons.edges, 3);
    }
    console.log(this.nodes);

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
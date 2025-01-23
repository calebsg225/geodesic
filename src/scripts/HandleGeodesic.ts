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
      nodes: 2,
      edges: 2,
      faces: 0,
      baseNodes: 2,
      baseEdges: 2,
      baseFaces: 0
    }
    this.drawStyles = {
      nodeColor: 'blue',
      backNodeColor: '#FFC7C7',
      nodeSize: 2,

      edgeColor: 'black',
      backEdgeColor: '#D8D8D8',
      edgeWidth: 1,

      faceColor: '#0800FF7a',
      faceEdgeColor: 'black',
      backFaceColor: '#C6C6C6',
      backFaceEdgeColor: '#C6C6C6',

      baseNodeColor: 'red',
      backBaseNodeColor: '#C6C6C6',
      baseNodeSize: 6,

      baseEdgeColor: 'red',
      backBaseEdgeColor: '#FF000030',
      baseEdgeWidth: 3,

      baseFaceColor: '#0800FF7a',
      baseFaceEdgeColor: 'black',
      backBaseFaceColor: '#868686',
      backBaseFaceEdgeColor: '#868686'
    }

    this.baseType = 'icosahedron';
    this.nodes = new Map();
    this.zoom = 475;
    this.zoomMin = 50;
    this.zoomStep = 20;
    this.zoomMax = 1000;
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
          x * this.zoom, y * this.zoom, z * this.zoom, 
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

  // remake icosahedron tesselation function?
  private generateIcosahedronAtFrequency = (): void => {
    this.nodes = new Map();
    const baseNodes = this.bases.get(this.baseType)!;
    const v = this.frequency;

    // 1) transfer base nodes
    for (const baseNodeKey of baseNodes.keys()) {
      const {x, y, z, connections: baseCons} = baseNodes.get(baseNodeKey)!;
      const newCons: NodeConnections = {edges: [], faces: []}
      newCons.baseEdges = baseCons.baseEdges;
      newCons.baseFaces = baseCons.baseFaces;

      for (const baseEdge of baseCons.baseEdges!) {
        newCons.edges.push([baseNodeKey + (v-1), baseEdge + 1].sort().join(''));
      }

      newCons.faces = this.utils.calculateConnectedFaces(baseNodeKey, newCons.edges, 3);
      this.nodes.set(baseNodeKey, new GeoNode(x, y, z, newCons));
    }

    // 2) calculate edge node edges
    const visitedEdges = new Set<string>();
    for (const baseNodeParent of baseNodes.keys()) {
      const {connections: {baseEdges}} = baseNodes.get(baseNodeParent)!;
      // bfs through base edges
      for (const baseNodeChild of baseEdges!) {
        const edge = [baseNodeParent, baseNodeChild].sort();
        if (visitedEdges.has(edge.join(''))) continue; // already visited this edge

        for (let i = 1; i < v; i++) {
          const j = v-i;
          const edgeNodeKey = edge[0] + i + edge[1] + j;

          const connections: NodeConnections = {edges: new Array(6), faces: []}
          // placed in order for face generation later
          connections.edges[0] = this.utils.generateEdgeKey(edge, i+1, j-1, v);
          connections.edges[3] = this.utils.generateEdgeKey(edge, i-1, j+1, v);

          const {x:x0, y:y0, z:z0} = baseNodes.get(edge[0])!;
          const {x:x1, y:y1, z:z1} = baseNodes.get(edge[1])!;
          const {x, y, z} = this.utils.icosahedronIntermediateNode(i, j, 0, x0, y0, z0, x1, y1, z1, 0, 0, 0);
          // add new edge node
          this.nodes.set(edgeNodeKey, new GeoNode(x*this.zoom, y*this.zoom, z*this.zoom, connections));
        }
        visitedEdges.add(edge.join(''));
      }
    }

    // 3) calculate face node edges
    const visitedFaces = new Set<string>();
    for (const baseNode of baseNodes.keys()) {
      const {connections: {baseFaces}} = baseNodes.get(baseNode)!;
      // bfs through base faces
      for (const baseFace of baseFaces!) {
        const face = baseFace.split('-').sort();
        if (visitedFaces.has(face.join('-'))) continue; // face nodes on this base face have been calculated

        for (let i = 1; i < v; i++) {
          for (let j = 1; j < v-i; j++) {
            const k = v-i-j;
            const connections: NodeConnections = {edges: [], faces: []}
            const faceNodeKey = this.utils.generateKeyName(face, i, j, k, v);
            for (let o = 0; o < 3; o++) {
              for (let p = 0; p < 2; p++) {
                const i2 = i+(o-1);
                const j2 = j+((o+1+p)%3 - 1);
                const k2 = v-i2-j2;
                const edgeNodeKey = this.utils.generateKeyName(face, i2, j2, k2, v); // node connected by an edge to parent node
                connections.edges.push(edgeNodeKey);
                if (i2 && j2 && k2) continue; // calculated node is on a base face
                // calculated is edge node (vertex nodes are not reachable by one edge from face nodes)
                  
                const index = (i2 ? i2 : j2) === (i2 ? i : j) ? 1 : 2;
                
                const curEdgeEdges = this.nodes.get(edgeNodeKey)!.connections.edges;
                const adjustedIndex = !curEdgeEdges[index] ? index : 6-index;
                curEdgeEdges[adjustedIndex] = faceNodeKey;
                
                if ((i2 ? i2 : j2) === 1 || (i2 ? i2 : j2) === v-1) { // node is on a pentagon
                  const i3 = (i2 ? (i2 > 1 ? i2 : 0 ) : 1);
                  const j3 = (j2 ? (j2 > 1 ? j2 : 0 ) : 1);
                  const k3 = (k2 ? (k2 > 1 ? k2 : 0 ) : 1);
                  const otherEdgeNodeKey = this.utils.generateKeyName(face, i3, j3, k3, v);
                  const pentaAdjustedIndex = adjustedIndex === index ? 3-index : 9-adjustedIndex;
                  curEdgeEdges[pentaAdjustedIndex] = otherEdgeNodeKey;
                }
                
                // add edge connections to base edges
                //this.nodes.get(edgeNodeKey)!.connections.edges.push(faceNodeKey);
              }
            }

            // swap nodes 3 and 5 so that edges are in order for face generation
            // not clean but it works for now (and probably wont be changed) :)
            [connections.edges[3], connections.edges[5]] = [connections.edges[5], connections.edges[3]];

            
            // calculate connected faces of face nodes
            connections.faces = this.utils.calculateConnectedFaces(faceNodeKey, connections.edges, 3);

            const {x:x0, y:y0, z:z0} = baseNodes.get(face[0])!;
            const {x:x1, y:y1, z:z1} = baseNodes.get(face[1])!;
            const {x:x2, y:y2, z:z2} = baseNodes.get(face[2])!;
            const {x, y, z} = this.utils.icosahedronIntermediateNode(i, j, k, x0, y0, z0, x1, y1, z1, x2, y2, z2);
            this.nodes.set(faceNodeKey, new GeoNode(x*this.zoom, y*this.zoom, z*this.zoom, connections));

          }
        }

        // calculate face-specific edges (edges that form the pentagons)
        for (let i = 0; i < 3; i++) {
          const e1key = [`${face[i]}${v-1}`, `${face[(i+1)%3]}${1}`].sort().join('');
          const e2key = [`${face[i]}${v-1}`, `${face[(i+2)%3]}${1}`].sort().join('');
          this.nodes.get(e1key)!.connections.edges.push(e2key);
          this.nodes.get(e2key)!.connections.edges.push(e1key);
        }

        visitedFaces.add(face.join('-'));
      }
    }

    // 4) calculate faces

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
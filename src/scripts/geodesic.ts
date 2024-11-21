import DrawCanvas from './DrawCanvas';
import UserInterface from './userInterface/UserInterface';
import GeoNode from "./geodesic/node";
import Utils from './helpers/Utils';
import { NodeConnections, Geo, BaseType } from '../types/geodesicTypes';

class Geodesic {
  private userInterface: UserInterface;
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
  constructor(canvasParentElement: HTMLElement, panelParentElement: HTMLElement) {
    this.baseType = 'icosahedron';
    this.nodes = new Map();
    this.zoom = 300;
    this.zoomMin = 50;
    this.zoomStep = 20;
    this.zoomMax = 5000;
    this.bases = new Map();
    this.frequency = 1;
    this.rotationRads = 0.008;

    this.utils = new Utils();
    this.userInterface = new UserInterface(canvasParentElement, panelParentElement);
    this.drawCanvas = new DrawCanvas(this.userInterface.getCanvasElement(), 800, 800);

    this.userInterface.generateEventListeners(this.rotate, this.updateZoom);

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

  // given an integer 0-7 inclusive, returns connected cube edges and faces
  private getCubeConnections = (bin: number): NodeConnections => {
    return {
      edges: this.utils.mapToChars([bin ^ 0b001, bin ^ 0b010, bin ^ 0b100]),
      // TODO: calculate cube faces
      // faces are in adjacent order. This matters when drawing non-triangle faces for the drawFace function.
      faces: []
    }
  }

  // given an integer 0-11 inclusive, returns connected icosahedron edges and faces
  private getIcosahedronConnections = (v: number): NodeConnections => {
    const gT = (n: number) => (n^1)%12;
    const gM = (n: number) => 4*((Math.floor(n/4) + 1)%3) + Math.floor(n/2)%2;
    const gB = (n: number) => 4*((Math.floor(n/4) + 2)%3) + 2*(n%2);
    this.utils.mapToChars([v, gT(v), gM(v)]).sort().join('')
    return {
      edges: this.utils.mapToChars([gT(v), gM(v), gM(v) + 2, gB(v), gB(v)+1]),
      faces: [
        [gT(v), gM(v)],
        [gM(v), gB(v)],
        [gB(v), gB(v) + 1],
        [gB(v) + 1, gM(v) + 2],
        [gM(v) + 2, gT(v)]
      ].map(val => this.utils.mapToChars([v, ...val]).join(''))
    };
  }

  private setBase = (baseType: BaseType) => {
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
    }
  }

  private render = () => {
    this.drawCanvas.clearCanvas();
    this.drawCanvas.drawFaces(this.nodes);
    //this.drawCanvas.drawEdges(this.nodes);
    //this.drawCanvas.drawNodes(this.nodes);
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

export default Geodesic;
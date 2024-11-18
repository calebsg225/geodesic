import DrawCanvas from './DrawCanvas';
import GeoNode from "./geodesic/node";

type Geo = Map<string, GeoNode>;
type BaseType = 'cube' | 'icosahedron' | 'tetrahedron';

class Geodesic {
  drawCanvas: DrawCanvas;
  element: HTMLCanvasElement;
  private bases: Map<BaseType, Geo>;
  private baseType: BaseType;
  private nodes: Geo;
  private rotX: number;
  private rotY: number;
  private rotZ: number;
  private zoom: number;
  private step: number;
  private frequency: number;
  constructor(element: HTMLCanvasElement, width: number, height: number, zoom: number) {
    this.drawCanvas = new DrawCanvas(element, width, height);
    element.width = width;
    element.height = height;
    this.element = element;
    this.baseType = 'cube';
    this.nodes = new Map();
    this.step = Math.PI/12;
    this.rotX = 0;
    this.rotY = 2*this.step;
    this.rotZ = 2*this.step;
    this.zoom = zoom;
    this.bases = new Map();
    this.frequency = 1;
    this.init();
  }

  private init = () => {
    // create all bases
    this.generateBases();
    // generate default nodes
    this.generateGeo();
  }

  private generateBases = (): void => {
    this.bases.set('cube', this.generateCubeBase());
    this.bases.set('icosahedron', this.generateIcosahedronBase());
  }

  /**
   * distance formula (3d)
   * @param x 
   * @param y 
   * @param z 
   * @param dx 
   * @param dy 
   * @param dz 
   * @returns 
   */
  private distanceF = (x: number, y: number, z: number, dx: number, dy: number, dz: number): number => {
    return Math.sqrt((dx - x)**2 + (dy - y)**2 + (dz - z)**2);
  }

  generateIcosahedronBase = (): Geo => {
    const icosahedronBase: Geo = new Map();
    const g = (1+Math.sqrt(5))/4; // HALF golden ratio
    const n = .5;
    const r = this.distanceF(0, .5, g, 0, 0, 0);
    const setNode = (x: number, y: number, z: number, v: number) => {
      icosahedronBase.set(this.mapToChars([v]).join(''), new GeoNode(x, y, z, this.mapToChars(this.getIcosahedronConnections(v))));
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

  generateCubeBase = (): Geo => {
    const cubeBase: Geo = new Map();
    const r = Math.sqrt(3); // use r to make each coord 
    for (let i = -1; i < 2; i+=2) {
      for (let j = -1; j < 2; j+=2) {
        for (let k = -1; k < 2; k+=2) {
          cubeBase.set(cubeBase.size + '', new GeoNode(i/r, j/r, k/r, this.mapToChars(this.getCubeConnections(cubeBase.size))));
        }
      }
    }
    return cubeBase;
  }

  /**
   * sets new zoom value
   * rerenders with new zoom value
   * @param zoom 
   */
  setZoom = (zoom: number) => {
    this.zoom = zoom;
    this.render();
  };

  updateCanvasSize = (width: number, height: number) => {
    this.element.width = width;
    this.element.height = height;
  }

  private mapToChars = (nums: number[]): string[] => {
    return nums.map(num => String.fromCharCode(num + 'a'.charCodeAt(0)));
  }

  // given an integer 0-7 inclusive, returns connected cube vertices
  private getCubeConnections = (bin: number): number[] => {
    return [bin ^ 0b001, bin ^ 0b010, bin ^ 0b100];
  }

  // given an integer 0-11 inclusive, returns connected icosahedron vertices
  private getIcosahedronConnections = (v: number): number[] => {
    const gT = (n: number) => (n^1)%12;
    const gM = (n: number) => 4*((Math.floor(n/4) + 1)%3) + Math.floor(n/2)%2;
    const gB = (n: number) => 4*((Math.floor(n/4) + 2)%3) + 2*(n%2);
    return [gT(v), gM(v), gM(v) + 2, gB(v), gB(v)+1];
  }

  // takes x,y,z coords of a node and calculates its new position in 3d space projected 
  // onto a 2d plane based on rotation values in each x,y,z direction
  private calculateRotation = (x: number, y: number, z: number, connections: string[]): GeoNode => {
    const sX = Math.sin(this.rotX*this.step);
    const cX = Math.cos(this.rotX*this.step);
    const sY = Math.sin(this.rotY*this.step);
    const cY = Math.cos(this.rotY*this.step);
    const sZ = Math.sin(this.rotZ*this.step);
    const cZ = Math.cos(this.rotZ*this.step);
    const nX = x*cX*cY + y*cX*sY*sZ - y*sX*cZ + z*cX*sY*cZ + z*sX*sZ;
    const nY = x*sX*cY + y*sX*sY*sZ + y*cX*cZ + z*sX*sY*cZ - z*cX*sZ;
    const nZ = -x*sY + y*cY*sZ + z*cY*cZ;
    const node = new GeoNode(nX, nY, nZ, connections);
    return node;
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
    }
  }

  render = () => {
    this.drawCanvas.clearCanvas();
    const newNodes: Geo = new Map();
    this.nodes.forEach((node, key) => {
      newNodes.set(key, this.calculateRotation(node.x* this.zoom, node.y * this.zoom, node.z * this.zoom, node.connections));
    });
    this.drawCanvas.drawNodes(newNodes);
  }

  rotate = (axis: string, isPositive: boolean) => {
    if (axis === "x") this.rotX += isPositive ? this.step : -this.step;
    if (axis === "y") this.rotY += isPositive ? this.step : -this.step;
    if (axis === "z") this.rotZ += isPositive ? this.step : -this.step;
    this.render();
  }
}

export default Geodesic;
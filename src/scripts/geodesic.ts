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
    const icoData = [
      {id: 'a', x: 0  , y: -n , z: -g , cons: 'bcdef'},
      {id: 'b', x: -g , y: 0  , z: -n , cons: 'acfgh'},
      {id: 'c', x: -n , y: -g , z: 0  , cons: 'abdhi'},
      {id: 'd', x: 0  , y: -n , z: g  , cons: 'aceij'},
      {id: 'e', x: g  , y: 0  , z: -n , cons: 'adfjk'},
      {id: 'f', x: -n , y: g  , z: 0  , cons: 'abegk'},
      {id: 'g', x: 0  , y: n  , z: -g , cons: 'bfhkl'},
      {id: 'h', x: -g , y: 0  , z: n  , cons: 'bcgil'},
      {id: 'i', x: n  , y: -g , z: 0  , cons: 'cdhjl'},
      {id: 'j', x: 0  , y: n  , z: g  , cons: 'deikl'},
      {id: 'k', x: g  , y: 0  , z: n  , cons: 'efgjl'},
      {id: 'l', x: n  , y: g  , z: 0  , cons: 'ghijk'},
    ]
    for (const icoVert of icoData) {
      const {id, x, y, z, cons} = icoVert;
      icosahedronBase.set(id, new GeoNode(x/r * this.zoom, y/r * this.zoom, z/r * this.zoom, cons.split('')));
    }
    return icosahedronBase;
  }

  generateCubeBase = (): Geo => {
    const cubeBase: Geo = new Map();
    const r = Math.sqrt(3); // use r to make each coord 
    for (let i = -1; i < 2; i+=2) {
      for (let j = -1; j < 2; j+=2) {
        for (let k = -1; k < 2; k+=2) {
          cubeBase.set(cubeBase.size + '', new GeoNode(i/r*this.zoom, j/r*this.zoom, k/r*this.zoom, this.findBinDif(cubeBase.size)));
        }
      }
    }
    return cubeBase;
  }

  setZoom = (zoom: number) => {
    this.zoom = zoom;
  };

  updateCanvasSize = (width: number, height: number) => {
    this.element.width = width;
    this.element.height = height;
  }

  // uses xor to find the correct edge connections for each node
  private findBinDif = (bin: number): string[] => {
    return [bin ^ 0b001, bin ^ 0b010, bin ^ 0b100].join('-').split('-');
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
      newNodes.set(key, this.calculateRotation(node.x, node.y, node.z, node.connections));
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
import DrawCanvas from './DrawCanvas';
import GeoNode from "./geodesic/node";

type BaseType = 'cube' | 'icosahedron' | 'tetrahedron';

class Geodesic {
  drawCanvas: DrawCanvas;
  element: HTMLCanvasElement;
  private baseType: BaseType;
  private nodes: Map<string, GeoNode>;
  private rotX: number;
  private rotY: number;
  private rotZ: number;
  private zoom: number;
  private step: number;
  private cubeBase: Map<string, GeoNode>;
  private icosahedronBase: Map<string, GeoNode>;
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
    this.cubeBase = new Map();
    this.icosahedronBase = new Map();
    this.generateCubeBase();
    this.generateIcosahedronBase();
    this.setBaseNodes();
  }

  generateIcosahedronBase = () => {
    // TODO: rethink this algo... Not good for long term...
    //    x: 0     0      0      0
    // X: y: 1/2   1/2   -1/2   -1/2
    //    z: gr   -gr    -gr     gr

    //    x: gr   -gr    -gr     gr
    // Y: y: 0     0      0      0
    //    z: 1/2   1/2   -1/2   -1/2

    //    x: 1/2   1/2   -1/2   -1/2 
    // Z: y: gr   -gr    -gr     gr
    //    z: 0     0      0      0
    const gr = (1+Math.sqrt(5))/4; // HALF golden ratio
    for (let i = -.5; i <= .5; i++) {
      for (let j = -gr; j <= gr; j+=gr*2) {
        //const v = i*this.zoom;
        //const w = j*this.zoom;
        //this.nodes.set(new GeoNode(0, v, w)); // x
        //this.nodes.set(new GeoNode(w, 0, v)); // y
        //this.nodes.set(new GeoNode(v, w, 0)); // z
      }
    }
  }

  generateCubeBase = () => {
    for (let i = -1; i < 2; i+=2) {
      for (let j = -1; j < 2; j+=2) {
        for (let k = -1; k < 2; k+=2) {
          this.cubeBase.set(this.cubeBase.size + '', new GeoNode(i*this.zoom, j*this.zoom, k*this.zoom, this.findBinDif(this.cubeBase.size)));
        }
      }
    }
  }

  setZoom = (zoom: number) => this.zoom = zoom;

  updateCanvasSize = (width: number, height: number) => {
    this.element.width = width;
    this.element.height = height;
  }

  // uses xor to find the correct edge connections for each node
  private findBinDif = (bin: number): number[] => {
    return [bin ^ 0b001, bin ^ 0b010, bin ^ 0b100];
  }

  // takes x,y,z coords of a node and calculates its new position in 3d space projected 
  // onto a 2d plane based on rotation values in each x,y,z direction
  private calculateRotation = (x: number, y: number, z: number, connections: number[]): GeoNode => {
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

  setBaseNodes = () => {
    if (this.baseType === 'cube') {
      this.nodes = this.cubeBase;
    }
    switch (this.baseType) {
      case ('cube'):
        this.nodes = this.cubeBase;
        break;
      case ('icosahedron'):
        this.nodes = this.icosahedronBase;
        break;
      case ('tetrahedron'):
        this.nodes = new Map<string, GeoNode>()
    }
  }

  setBaseType = (baseType: BaseType) => {
    this.baseType = baseType;
    this.setBaseNodes();
  }

  render = () => {
    this.drawCanvas.clearCanvas();
    const newNodes = new Map<string, GeoNode>();
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
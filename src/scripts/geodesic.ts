import DrawCanvas from './DrawCanvas';
import GeoEdge from "./geodesic/edge";
import GeoNode from "./geodesic/node";

class Geodesic {
  drawCanvas: DrawCanvas;
  element: HTMLCanvasElement;
  nodes: GeoNode[];
  edges: GeoEdge[];
  rotX: number;
  rotY: number;
  rotZ: number;
  zoom: number;
  step: number;
  constructor(element: HTMLCanvasElement, width: number, height: number) {
    this.drawCanvas = new DrawCanvas(element, width, height);
    element.width = width;
    element.height = height;
    this.element = element;
    this.nodes = [];
    this.edges = [];
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.step = Math.PI/12;
    this.zoom = 1;
  }

  updateCanvasSize = (width: number, height: number) => {
    this.element.width = width;
    this.element.height = height;
  }

  generateCube = (size: number) => {
    for (let i = -1; i < 2; i+=2) {
      for (let j = -1; j < 2; j+=2) {
        for (let k = -1; k < 2; k+=2) {
          this.nodes.push(new GeoNode(i*size, j*size, k*size));
        }
      }
    }
  }

  private calculateRotation = (x: number, y: number, z: number): GeoNode => {
    const sX = Math.sin(this.rotX*this.step);
    const cX = Math.cos(this.rotX*this.step);
    const sY = Math.sin(this.rotY*this.step);
    const cY = Math.cos(this.rotY*this.step);
    const sZ = Math.sin(this.rotZ*this.step);
    const cZ = Math.cos(this.rotZ*this.step);
    const nX = x*cX*cY + y*cX*sY*sZ - y*sX*cZ + z*cX*sY*cZ + z*sX*sZ;
    const nY = x*sX*cY + y*sX*sY*sZ + y*cX*cZ + z*sX*sY*cZ - z*cX*sZ;
    const nZ = -x*sY + y*cY*sZ + z*cY*cZ;
    const node = new GeoNode(nX, nY, nZ);
    return node;
  }

  render = () => {
    this.drawCanvas.clearCanvas();
    this.drawCanvas.drawNodes(this.nodes.map(node => this.calculateRotation(node.x, node.y, node.z)));
  }

  rotate = (axis: string, isPositive: boolean) => {
    if (axis === "x") this.rotX += isPositive ? this.step : -this.step;
    if (axis === "y") this.rotY += isPositive ? this.step : -this.step;
    if (axis === "z") this.rotZ += isPositive ? this.step : -this.step;
    this.render();
  }
}

export default Geodesic;
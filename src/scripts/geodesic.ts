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
    this.step = 15;
    this.zoom = 1;
  }

  updateCanvasSize = (width: number, height: number) => {
    this.element.width = width;
    this.element.height = height;
  }

  render = () => {}

  rotate = (axis: string, positive: boolean) => {
    console.log(`Rotated in the ${positive ? "+" : "-"} ${axis} direction...`);
  }
}

export default Geodesic;
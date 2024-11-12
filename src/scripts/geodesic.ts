import GeoEdge from "./geodesic/edge"
import GeoNode from "./geodesic/node"

class Geodesic {
  nodes: GeoNode[]
  edges: GeoEdge[]
  constructor() {
    this.nodes = []
    this.edges = []
  }

  //generate = (frequency: number) => {}

  generateCube = () =>  {
    this.nodes.push(new GeoNode(10, 10, 10));
    this.nodes.push(new GeoNode(10, -10, 10));
    this.nodes.push(new GeoNode(-10, -10, 10));
    this.nodes.push(new GeoNode(-10, 10, 10));
    this.nodes.push(new GeoNode(10, 10, -10));
    this.nodes.push(new GeoNode(10, -10, -10));
    this.nodes.push(new GeoNode(-10, -10, -10));
    this.nodes.push(new GeoNode(-10, 10, -10));
  }
}

export default new Geodesic;
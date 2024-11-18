import GeoNode from "../geodesic/node";

class Utils {
  constructor() {}

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
  distanceF = (x: number, y: number, z: number, dx: number, dy: number, dz: number): number => {
    return Math.sqrt((dx - x)**2 + (dy - y)**2 + (dz - z)**2);
  }

  numFromChar = (str: string): number => {
    return str.charCodeAt(0) - 'a'.charCodeAt(0);
  }

  mapChar = (num: number): string => {
    return String.fromCharCode(num + 'a'.charCodeAt(0));
  }

  // temp algo for general edge sorting
  averageZ = (z: number, dz: number): number => {
    return (z + dz) / 2;
  }

  mapToChars = (nums: number[]): string[] => {
    return nums.map(num => this.mapChar(num));
  }

  calculateRotation = (
    x: number, 
    y: number, 
    z: number, 
    connections: string[],
    rotX: number,
    rotY: number,
    rotZ: number,
    step: number
  ): GeoNode => {
    const sX = Math.sin(rotX*step);
    const cX = Math.cos(rotX*step);
    const sY = Math.sin(rotY*step);
    const cY = Math.cos(rotY*step);
    const sZ = Math.sin(rotZ*step);
    const cZ = Math.cos(rotZ*step);
    const nX = x*cX*cY + y*cX*sY*sZ - y*sX*cZ + z*cX*sY*cZ + z*sX*sZ;
    const nY = x*sX*cY + y*sX*sY*sZ + y*cX*cZ + z*sX*sY*cZ - z*cX*sZ;
    const nZ = -x*sY + y*cY*sZ + z*cY*cZ;
    const node = new GeoNode(nX, nY, nZ, connections);
    return node;
  }
}

export default Utils;
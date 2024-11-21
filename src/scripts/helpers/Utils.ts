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

  calculateRotatedCoordinates = (
    x: number,
    y: number,
    z: number,
    multiX: number,
    multiY: number,
    multiZ: number,
    deg: number
  ) => {
    // values are mislabeled to compensate for misaligned axes
    const sY = Math.sin(deg*multiX);
    const cY = Math.cos(deg*multiX);
    const sZ = -Math.sin(deg*multiY);
    const cZ = Math.cos(deg*multiY);
    const sX = Math.sin(deg*multiZ);
    const cX = Math.cos(deg*multiZ);
    const nX = x*cX*cY + y*cX*sY*sZ - y*sX*cZ + z*cX*sY*cZ + z*sX*sZ;
    const nY = x*sX*cY + y*sX*sY*sZ + y*cX*cZ + z*sX*sY*cZ - z*cX*sZ;
    const nZ = -x*sY + y*cY*sZ + z*cY*cZ;
    return {x: nX, y: nY, z: nZ}
  }
}

export default Utils;
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

  // TODO: create function to calculate edge order for face generation for n nodes where n >= 4
  // possible solution: 
  // 1) given range of x,y,z pairs, calculate Xcom, Ycom, and Zcom
  // 2) calculate angle between each node and a calculated axis
  // 3) order by angle size


  generateEdgeKey = (edge: string[], i: number, j: number, v: number): string => {
    return (i ? (edge[0] + (i%v ? i : '')) : '') + (j ? (edge[1] + (j%v ? j : '')) : '');
  }

  generateKeyName = (face: string[], i: number, j: number, k: number, v: number): string => {
    return `${i ? `${face[0]}${i%v ? i : ''}` : ''}${j ? `${face[1]}${j%v ? j : ''}` : ''}${k ? `${face[2]}${k%v ? k : ''}` : ''}`;
  }

  calculateConnectedFaces = (node: string, edges: string[], vertices: number): string[] => {
    const faces: string[] = [];
    if (vertices < 3) throw(new Error);
    const len = edges.length;
    for (let i = 0; i < len; i++) {
      const temp = [];
      temp.push(node);
      for (let k = i; k < i+vertices-1; k++) {
        temp.push(edges[k%len]);
      }
      faces.push(temp.join('-'));
    }
    return faces;
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

  icosahedronIntermediateNode = (
    i: number, j: number, k: number, 
    x0: number, y0: number, z0: number,
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number
  ) => {
    const v = i+j+k;
    const x = x0*(i/v) + x1*(j/v) + x2*(k/v);
    const y = y0*(i/v) + y1*(j/v) + y2*(k/v);
    const z = z0*(i/v) + z1*(j/v) + z2*(k/v);
    const r = this.distanceF(x, y, z, 0, 0, 0);
    return {x: x/r, y: y/r, z: z/r}
  }
}

export default Utils;
class UserInterface {
  private canvasParent: HTMLElement;
  private panelParent: HTMLElement;
  private panelId: string;
  private canvasId: string;

  private mouseIsDown: boolean;
  constructor(canvasParent: HTMLElement, interfaceParent: HTMLElement) {
    this.canvasParent = canvasParent;
    this.panelParent = interfaceParent;
    this.canvasId = 'geodesic-canvas';
    this.panelId = 'geodesic-panel';

    this.mouseIsDown = false;

    this.generateInterface();
  }
  /**
   * lets the user decide where on the DOM to place the display canvas (where the visuals will be rendered) 
   * and the control panel (where the user controls what is rendered)
   * @param canvasParent html element to place the canvas on
   * @param interfaceParent html element to place the control panel on
   */
  private generateInterface = () => {
    this.generateCanvas();
    this.generatePanel();
  }
  
  /**
   * generates canvas element on this.canvasParent
   */
  private generateCanvas = () => {
    this.canvasParent.innerHTML = `
      ${this.canvasParent.innerHTML}
      <canvas id="${this.canvasId}" class="border-4 border-black cursor-grab"></canvas>
    `;
  }

  /**
   * generates panel elements on this.panelParent
   */
  private generatePanel = () => {
    this.panelParent.innerHTML = `
      ${this.panelParent.innerHTML}
      <section id="${this.panelId}" class="flex"></section>
    `;
  }

  generateEventListeners = (
    onRotate: (x: number, y: number) => void,
    onZoom: (isPositive: boolean) => void
  ) => {
    const canvas = document.querySelector<HTMLCanvasElement>(`#${this.canvasId}`)!;
    document.addEventListener('mouseup', () => {
      this.mouseIsDown = false;
    });
    canvas.addEventListener('mousedown', () => {
      this.mouseIsDown = true;
    });
    canvas.addEventListener('mousemove', (e) => {
      if (!this.mouseIsDown) return;
      onRotate(e.movementX, e.movementY);
    });
    canvas.addEventListener('wheel', (e) => {
      onZoom(e.deltaY < 0);
    });
  }

  getCanvasElement = (): HTMLCanvasElement => {
    return document.querySelector<HTMLCanvasElement>(`#${this.canvasId}`)!
  }
}

export default UserInterface;
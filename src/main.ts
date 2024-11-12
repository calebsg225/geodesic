import './output.css';
import geo from './scripts/geodesic';
import drawCanvas from './scripts/drawCanvas';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="geodesic-canvas" class="border-4 border-black"></canvas>
  <section id="geodesic-interface" class="border-4"></section>
`

drawCanvas.init(document.querySelector<HTMLCanvasElement>('#geodesic-canvas')!, 800, 800);

geo.generateCube();

drawCanvas.drawNodes(geo.nodes);
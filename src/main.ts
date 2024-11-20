import './output.css';
import Geodesic from './scripts/Geodesic';

// main
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="geodesic-canvas" class="border-4 border-black"></canvas>
  <section id="geodesic-interface" class="flex">
  </section>
`;

const defaultZoom = 300;

const geoCanvas = document.querySelector<HTMLCanvasElement>('#geodesic-canvas')!;
const geo = new Geodesic(geoCanvas, 800, 800, 300);

const canvas = document.querySelector<HTMLCanvasElement>('#geodesic-canvas')!;
let mouseIsDown = false;
let zoom = defaultZoom;
const minZoom = 50;
const maxZoom = 5000;
document.addEventListener('mouseup', () => {
  // stop rotating graphic when mouse is no longer pressed
  mouseIsDown = false;
});
canvas.addEventListener('mousedown', () => {
  // starts dragging graphic ONLY if mouse is over canvas
  mouseIsDown = true;
});
canvas.addEventListener('mousemove', (e) => {
  // if mouse was not pressed on canvas, do nothing
  if (!mouseIsDown) return;
  geo.rotateMouse(e.movementX, e.movementY);
});
canvas.addEventListener('wheel', (e) => {
  const vert = e.deltaY;
  if (vert > 0 && zoom > minZoom) {
    zoom -= 20;
  }
  if (vert < 0 && zoom < maxZoom) {
    zoom += 20;
  }
  geo.updateZoom(zoom);
})

geo.setBase('icosahedron');
geo.render();
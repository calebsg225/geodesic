import './output.css';
import Geodesic from './scripts/Geodesic';

// nav buttons
const createNavSection = (navD: string) => {
  const buttonStyles = "bg-green-100 p-2 font-bold text-2xl text-green-700 w-16 border-4 border-black";
  return `
    <div id="${navD}-nav" class="p-2">
      <button id="${navD}-down" data-nav="${navD}-down" class="${buttonStyles} rounded-l-2xl">-${navD.toUpperCase()}</button>
      <button id="${navD}-up" data-nav="${navD}-up" class="${buttonStyles} rounded-r-2xl">+${navD.toUpperCase()}</button>
    </div>
  `
}

// main
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="geodesic-canvas" class="border-4 border-black"></canvas>
  <section id="geodesic-interface" class="flex">
    ${['x','y','z'].map(v => createNavSection(v)).join("")}
  </section>
`;

const geoCanvas = document.querySelector<HTMLCanvasElement>('#geodesic-canvas')!;
const geo = new Geodesic(geoCanvas, 800, 800, 300);

// add click events for each nav button
const navElements = document.querySelectorAll<HTMLButtonElement>('[data-nav]');
for (let i = 0; i < navElements.length; i++) {
  navElements[i].addEventListener('click', () => {
  });
}

const canvas = document.querySelector<HTMLCanvasElement>('#geodesic-canvas')!;
let mouseIsDown = false;
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

geo.setBase('icosahedron');
geo.render();
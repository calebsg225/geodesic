import './output.css';
import Geodesic from './scripts/Geodesic';

// nav buttons
const createNavSection = (navD: string) => {
  return `
    <div id="${navD}-nav" class="p-2">
      <button id="${navD}-down" data-nav="${navD}-down" class="bg-yellow-300">-${navD}</button>
      <button id="${navD}-up" data-nav="${navD}-up" class="bg-yellow-300">+${navD}</button>
    </div>
  `
}

// main
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="geodesic-canvas" class="border-4 border-black"></canvas>
  <section id="geodesic-interface" class="border-4 flex">
    ${['x','y','z'].map(v => createNavSection(v)).join("")}
  </section>
`;

const geoCanvas = document.querySelector<HTMLCanvasElement>('#geodesic-canvas')!;
const geo = new Geodesic(geoCanvas, 800, 800);

// add click events for each nav button
const navElements = document.querySelectorAll<HTMLButtonElement>('[data-nav]');
for (let i = 0; i < navElements.length; i++) {
  navElements[i].addEventListener('click', () => {
    const [ axis, positive ] = navElements[i].dataset.nav!.split('-');
    geo.rotate(axis, positive === 'up');
  });
}
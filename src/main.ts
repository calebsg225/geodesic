import './output.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1 class="text-3xl font-bold underline">Hello World</h1>
  <canvas id="geodesic-canvas"></canvas>
  <section id="geodesic-interface"></section>
`
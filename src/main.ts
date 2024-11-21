import './output.css';
import Geodesic from './scripts/Geodesic';

// main

const parent = document.querySelector<HTMLDivElement>('#app')!
new Geodesic(parent, parent);

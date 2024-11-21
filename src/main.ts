import './output.css';
import Geodesic from './scripts/Geodesic';

// main

const parent = document.querySelector<HTMLDivElement>('#app')!
const geo = new Geodesic(parent, parent, 800, 800, 300);

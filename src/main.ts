import './output.css';
import HandleGeodesic from './scripts/HandleGeodesic';

// main

const parent = document.querySelector<HTMLDivElement>('#app')!
new HandleGeodesic(parent, parent);

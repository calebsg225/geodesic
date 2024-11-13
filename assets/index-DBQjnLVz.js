var y=Object.defineProperty;var m=(n,t,s)=>t in n?y(n,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[t]=s;var o=(n,t,s)=>m(n,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))e(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&e(c)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function e(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();class v{constructor(t,s,e){o(this,"ctx");o(this,"width");o(this,"height");o(this,"centerX");o(this,"centerY");o(this,"averageZ",(t,s)=>(t+s)/2);o(this,"clearCanvas",()=>{this.ctx&&(this.ctx.fillStyle="white",this.ctx.fillRect(0,0,this.width,this.height))});o(this,"drawNode",(t,s,e,i)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.arc(t,s,e,0,2*Math.PI),this.ctx.strokeStyle="black",this.ctx.lineWidth=2,this.ctx.fillStyle=i,this.ctx.fill(),this.ctx.stroke())});o(this,"drawEdge",(t,s,e,i)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.moveTo(t,s),this.ctx.lineTo(e,i),this.ctx.lineWidth=8,this.ctx.strokeStyle="black",this.ctx.stroke(),this.ctx.lineWidth=6,this.ctx.strokeStyle="red",this.ctx.lineTo(t,s),this.ctx.stroke())});o(this,"drawNodes",t=>{const s=[];for(let e=0;e<t.length;e++){if(t[e].z>=0){s.push(t[e]);continue}const i=this.centerX+t[e].x,r=this.centerY+t[e].y;this.drawNode(i,r,t[e].size,t[e].color)}for(let e=0;e<s.length;e++){const i=this.centerX+s[e].x,r=this.centerY+s[e].y;this.drawNode(i,r,s[e].size,s[e].color)}});o(this,"drawEdges",t=>{const s=[];for(let e=0;e<t.length;e++)for(let i=0;i<t[e].connections.length;i++){if(t[e].connections[i]<e)continue;const r=t[e].x+this.centerX,c=t[e].y+this.centerY,h=t[e].z,l=t[t[e].connections[i]].x+this.centerX,a=t[t[e].connections[i]].y+this.centerY,d=t[t[e].connections[i]].z;this.averageZ(h,d)>0?s.push([r,c,l,a]):this.drawEdge(r,c,l,a)}for(let e=0;e<s.length;e++){const[i,r,c,h]=s[e];this.drawEdge(i,r,c,h)}});this.ctx=t.getContext("2d"),this.width=s,this.height=e,this.centerX=s/2,this.centerY=e/2}}class p{constructor(t,s,e,i=[]){o(this,"x");o(this,"y");o(this,"z");o(this,"color");o(this,"size");o(this,"connections");this.x=t,this.y=s,this.z=e,this.color="blue",this.size=8,this.connections=i}}class b{constructor(t,s,e){o(this,"drawCanvas");o(this,"element");o(this,"nodes");o(this,"rotX");o(this,"rotY");o(this,"rotZ");o(this,"zoom");o(this,"step");o(this,"updateCanvasSize",(t,s)=>{this.element.width=t,this.element.height=s});o(this,"findBinDif",t=>[t^1,t^2,t^4]);o(this,"generateCube",t=>{for(let s=-1;s<2;s+=2)for(let e=-1;e<2;e+=2)for(let i=-1;i<2;i+=2)this.nodes.push(new p(s*t,e*t,i*t,this.findBinDif(this.nodes.length)))});o(this,"calculateRotation",(t,s,e,i)=>{const r=Math.sin(this.rotX*this.step),c=Math.cos(this.rotX*this.step),h=Math.sin(this.rotY*this.step),l=Math.cos(this.rotY*this.step),a=Math.sin(this.rotZ*this.step),d=Math.cos(this.rotZ*this.step),x=t*c*l+s*c*h*a-s*r*d+e*c*h*d+e*r*a,g=t*r*l+s*r*h*a+s*c*d+e*r*h*d-e*c*a,w=-t*h+s*l*a+e*l*d;return new p(x,g,w,i)});o(this,"render",()=>{this.drawCanvas.clearCanvas();const t=this.nodes.map(s=>this.calculateRotation(s.x,s.y,s.z,s.connections));this.drawCanvas.drawEdges(t),this.drawCanvas.drawNodes(t)});o(this,"rotate",(t,s)=>{t==="x"&&(this.rotX+=s?this.step:-this.step),t==="y"&&(this.rotY+=s?this.step:-this.step),t==="z"&&(this.rotZ+=s?this.step:-this.step),this.render()});this.drawCanvas=new v(t,s,e),t.width=s,t.height=e,this.element=t,this.nodes=[],this.step=Math.PI/12,this.rotX=0,this.rotY=2*this.step,this.rotZ=2*this.step,this.zoom=1}}const C=n=>{const t="bg-green-100 p-2 font-bold text-2xl text-green-700 w-16 border-4 border-black";return`
    <div id="${n}-nav" class="p-2">
      <button id="${n}-down" data-nav="${n}-down" class="${t} rounded-l-2xl">-${n.toUpperCase()}</button>
      <button id="${n}-up" data-nav="${n}-up" class="${t} rounded-r-2xl">+${n.toUpperCase()}</button>
    </div>
  `};document.querySelector("#app").innerHTML=`
  <canvas id="geodesic-canvas" class="border-4 border-black"></canvas>
  <section id="geodesic-interface" class="flex">
    ${["x","y","z"].map(n=>C(n)).join("")}
  </section>
`;const X=document.querySelector("#geodesic-canvas"),f=new b(X,800,800),u=document.querySelectorAll("[data-nav]");for(let n=0;n<u.length;n++)u[n].addEventListener("click",()=>{const[t,s]=u[n].dataset.nav.split("-");f.rotate(t,s==="up")});f.generateCube(200);f.render();

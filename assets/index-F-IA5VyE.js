var F=Object.defineProperty;var T=(h,t,s)=>t in h?F(h,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):h[t]=s;var r=(h,t,s)=>T(h,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))e(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function e(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}})();class z{constructor(){r(this,"distanceF",(t,s,e,o,n,i)=>Math.sqrt((o-t)**2+(n-s)**2+(i-e)**2));r(this,"numFromChar",t=>t.charCodeAt(0)-97);r(this,"mapChar",t=>String.fromCharCode(t+97));r(this,"averageZ",(t,s)=>(t+s)/2);r(this,"mapToChars",t=>t.map(s=>this.mapChar(s)));r(this,"calculateRotatedCoordinates",(t,s,e,o,n,i,c)=>{const a=Math.sin(c*o),l=Math.cos(c*o),u=-Math.sin(c*n),d=Math.cos(c*n),f=Math.sin(c*i),m=Math.cos(c*i),x=t*m*l+s*m*a*u-s*f*d+e*m*a*d+e*f*u,b=t*f*l+s*f*a*u+s*m*d+e*f*a*d-e*m*u,M=-t*a+s*l*u+e*l*d;return{x,y:b,z:M}})}}class S{constructor(t,s,e){r(this,"utils");r(this,"ctx");r(this,"width");r(this,"height");r(this,"centerX");r(this,"centerY");r(this,"clearCanvas",()=>{this.ctx&&(this.ctx.fillStyle="white",this.ctx.fillRect(0,0,this.width,this.height))});r(this,"drawNode",(t,s,e,o)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.arc(t,s,e,0,2*Math.PI),this.ctx.strokeStyle="black",this.ctx.lineWidth=2,this.ctx.fillStyle=o,this.ctx.fill(),this.ctx.stroke())});r(this,"drawEdge",(t,s,e,o,n)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.moveTo(t,s),this.ctx.lineTo(e,o),this.ctx.lineWidth=8,this.ctx.strokeStyle="black",this.ctx.stroke(),this.ctx.lineWidth=6,this.ctx.strokeStyle=n,this.ctx.lineTo(t,s),this.ctx.stroke())});r(this,"drawFace",(t,s)=>{if(this.ctx){this.ctx.beginPath(),this.ctx.strokeStyle="black",this.ctx.fillStyle=s,this.ctx.lineWidth=2,this.ctx.moveTo(t[0][0],t[0][1]);for(let e=1;e<t.length;e++)this.ctx.lineTo(t[e][0],t[e][1]);this.ctx.lineTo(t[0][0],t[0][1]),this.ctx.fill(),this.ctx.stroke()}});r(this,"drawNodes",t=>{const s=[];t.forEach((e,o)=>{if(e.z>=0){s.push(o);return}const n=this.centerX+e.x,i=this.centerY+e.y;this.drawNode(n,i,e.size,e.color)});for(let e=0;e<s.length;e++){const o=t.get(s[e]),n=this.centerX+o.x,i=this.centerY+o.y;this.drawNode(n,i,o.size,o.color)}});r(this,"drawEdges",t=>{const s=[],e=[];for(const o of t.keys()){const n=t.get(o),i=n.connections.edges;for(let c=0;c<i.length;c++){if(this.utils.numFromChar(i[c])<this.utils.numFromChar(o))continue;const a=n.x+this.centerX,l=n.y+this.centerY,u=n.z,d=t.get(i[c]).x+this.centerX,f=t.get(i[c]).y+this.centerY,m=t.get(i[c]).z,x=this.utils.averageZ(u,m);x>0?s.push([a,l,d,f]):x===0?e.push([a,l,d,f]):this.drawEdge(a,l,d,f,"#FFFFFF")}}e.push(...s);for(let o=0;o<e.length;o++){const[n,i,c,a]=e[o];this.drawEdge(n,i,c,a,"red")}});r(this,"drawFaces",t=>{const s=new Set;for(const e of t.keys()){const n=t.get(e).connections.faces;for(let i=0;i<n.length;i++){if(s.has(n[i]))continue;const c=[];let a=0;for(const l of n[i]){const u=t.get(l).x+this.centerX,d=t.get(l).y+this.centerY;a+=t.get(l).z,c.push([u,d])}a/3>=0&&this.drawFace(c,"red"),s.add(n[i])}}});this.utils=new z,this.ctx=t.getContext("2d"),this.width=s,this.height=e,this.centerX=s/2,this.centerY=e/2}}class y{constructor(t,s,e,o={edges:[],faces:[]}){r(this,"x");r(this,"y");r(this,"z");r(this,"color");r(this,"size");r(this,"connections");this.x=t,this.y=s,this.z=e,this.color="blue",this.size=8,this.connections=o}}class k{constructor(t,s,e,o){r(this,"drawCanvas");r(this,"utils");r(this,"element");r(this,"bases");r(this,"baseType");r(this,"nodes");r(this,"zoom");r(this,"frequency");r(this,"rotationRads");r(this,"init",()=>{this.generateBases(),this.generateGeo()});r(this,"generateBases",()=>{this.bases.set("cube",this.generateCubeBase()),this.bases.set("icosahedron",this.generateIcosahedronBase())});r(this,"generateIcosahedronBase",()=>{const t=new Map,s=(1+Math.sqrt(5))/4,e=.5,o=this.utils.distanceF(0,.5,s,0,0,0),n=(i,c,a,l)=>{t.set(this.utils.mapChar(l),new y(i*this.zoom,c*this.zoom,a*this.zoom,this.getIcosahedronConnections(l)))};for(let i=0;i<=3;i++){const c=s*(2*Math.floor(i/2)-1),a=e*(2*(i%2)-1);n(0,c/o,a/o,i)}for(let i=4;i<=7;i++){const c=s*(2*Math.floor(i%4/2)-1),a=e*(2*(i%2)-1);n(c/o,a/o,0,i)}for(let i=8;i<=11;i++){const c=e*(2*(i%2)-1),a=s*(2*Math.floor(i%4/2)-1);n(c/o,0,a/o,i)}return t});r(this,"generateCubeBase",()=>{const t=new Map,s=Math.sqrt(3);for(let e=-1;e<2;e+=2)for(let o=-1;o<2;o+=2)for(let n=-1;n<2;n+=2)t.set(this.utils.mapChar(t.size),new y(e/s*this.zoom,o/s*this.zoom,n/s*this.zoom,this.getCubeConnections(t.size)));return t});r(this,"updateCanvasSize",(t,s)=>{this.element.width=t,this.element.height=s});r(this,"getCubeConnections",t=>({edges:this.utils.mapToChars([t^1,t^2,t^4]),faces:[]}));r(this,"getIcosahedronConnections",t=>{const s=n=>(n^1)%12,e=n=>4*((Math.floor(n/4)+1)%3)+Math.floor(n/2)%2,o=n=>4*((Math.floor(n/4)+2)%3)+2*(n%2);return this.utils.mapToChars([t,s(t),e(t)]).sort().join(""),{edges:this.utils.mapToChars([s(t),e(t),e(t)+2,o(t),o(t)+1]),faces:[[s(t),e(t)],[e(t),o(t)],[o(t),o(t)+1],[o(t)+1,e(t)+2],[e(t)+2,s(t)]].map(n=>this.utils.mapToChars([t,...n]).sort().join(""))}});r(this,"setBase",t=>{this.baseType=t,this.generateGeo()});r(this,"generateGeo",()=>{this.frequency===1&&(this.nodes=this.bases.get(this.baseType))});r(this,"render",()=>{this.drawCanvas.clearCanvas(),this.drawCanvas.drawFaces(this.nodes)});r(this,"updateZoom",t=>{const s=this.zoom/t;this.nodes.forEach((e,o)=>{this.nodes.set(o,new y(e.x/s,e.y/s,e.z/s,e.connections))}),this.zoom=t,this.render()});r(this,"rotateMouse",(t,s)=>{this.nodes.forEach((e,o)=>{const{x:n,y:i,z:c}=this.utils.calculateRotatedCoordinates(e.x,e.y,e.z,t,s,0,this.rotationRads);this.nodes.set(o,new y(n,i,c,e.connections))}),this.render()});this.drawCanvas=new S(t,s,e),this.utils=new z,t.width=s,t.height=e,this.element=t,this.baseType="cube",this.nodes=new Map,this.zoom=o,this.bases=new Map,this.frequency=1,this.rotationRads=.008,this.init()}}document.querySelector("#app").innerHTML=`
  <canvas id="geodesic-canvas" class="border-4 border-black"></canvas>
  <section id="geodesic-interface" class="flex">
  </section>
`;const E=300,Y=document.querySelector("#geodesic-canvas"),w=new k(Y,800,800,300),p=document.querySelector("#geodesic-canvas");let C=!1,g=E;const Z=50,B=5e3;document.addEventListener("mouseup",()=>{C=!1});p.addEventListener("mousedown",()=>{C=!0});p.addEventListener("mousemove",h=>{C&&w.rotateMouse(h.movementX,h.movementY)});p.addEventListener("wheel",h=>{const t=h.deltaY;t>0&&g>Z&&(g-=20),t<0&&g<B&&(g+=20),w.updateZoom(g)});w.setBase("icosahedron");w.render();

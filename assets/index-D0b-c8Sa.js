var K=Object.defineProperty;var D=(F,e,t)=>e in F?K(F,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):F[e]=t;var n=(F,e,t)=>D(F,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();class q{constructor(){n(this,"distanceF",(e,t,s,o,a,i)=>Math.sqrt((o-e)**2+(a-t)**2+(i-s)**2));n(this,"generateEdgeKey",(e,t,s,o)=>(t?e[0]+(t%o?t:""):"")+(s?e[1]+(s%o?s:""):""));n(this,"generateKeyName",(e,t,s,o,a)=>`${t?`${e[0]}${t%a?t:""}`:""}${s?`${e[1]}${s%a?s:""}`:""}${o?`${e[2]}${o%a?o:""}`:""}`);n(this,"calculateConnectedFaces",(e,t,s)=>{const o=[];if(s<3)throw new Error;const a=t.length;for(let i=0;i<a;i++){const r=[];r.push(e);for(let c=i;c<i+s-1;c++)r.push(t[c%a]);o.push(r.join("-"))}return o});n(this,"numFromChar",e=>e.charCodeAt(0)-97);n(this,"mapChar",e=>String.fromCharCode(e+97));n(this,"averageZ",(e,t)=>(e+t)/2);n(this,"mapToChars",e=>e.map(t=>this.mapChar(t)));n(this,"calculateRotatedCoordinates",(e,t,s,o,a,i,r)=>{const c=Math.sin(r*o),d=Math.cos(r*o),h=-Math.sin(r*a),g=Math.cos(r*a),u=Math.sin(r*i),f=Math.cos(r*i),w=e*f*d+t*f*c*h-t*u*g+s*f*c*g+s*u*h,x=e*u*d+t*u*c*h+t*f*g+s*u*c*g-s*f*h,N=-e*c+t*d*h+s*d*g;return{x:w,y:x,z:N}});n(this,"icosahedronIntermediateNode",(e,t,s,o,a,i,r,c,d,h,g,u)=>{const f=e+t+s,w=o*(e/f)+r*(t/f)+h*(s/f),x=a*(e/f)+c*(t/f)+g*(s/f),N=i*(e/f)+d*(t/f)+u*(s/f),v=this.distanceF(w,x,N,0,0,0);return{x:w/v,y:x/v,z:N/v}})}}class A{constructor(e,t,s){n(this,"utils");n(this,"ctx");n(this,"width");n(this,"height");n(this,"centerX");n(this,"centerY");n(this,"clearCanvas",()=>{this.ctx&&(this.ctx.fillStyle="white",this.ctx.fillRect(0,0,this.width,this.height))});n(this,"d",(e,t,s=!1)=>e*(1+t/4e3)+(s?this.centerX:this.centerY));n(this,"draw",(e,t,s)=>{this.clearCanvas();const{frontNodes:o,backNodes:a,frontBaseNodes:i,backBaseNodes:r,frontEdges:c,backEdges:d,frontBaseEdges:h,backBaseEdges:g,frontFaces:u,backFaces:f,frontBaseFaces:w,backBaseFaces:x}=this.separate(e);t.baseNodes%3&&this.drawNodes(r,s.baseNodeSize,s.backBaseNodeColor),t.nodes%3&&this.drawNodes(a,s.nodeSize,s.backNodeColor),t.faces%3&&this.drawFaces(f,s.backFaceColor),t.edges%3&&this.drawEdges(d,s.edgeWidth,s.backEdgeColor),t.baseFaces%3&&this.drawFaces(x,s.backBaseFaceColor),t.baseEdges%3&&this.drawEdges(g,s.baseEdgeWidth,s.backBaseEdgeColor),t.baseEdges>1&&this.drawEdges(h,s.baseEdgeWidth,s.baseEdgeColor),t.baseFaces>1&&this.drawFaces(w,s.baseFaceColor),t.edges>1&&this.drawEdges(c,s.edgeWidth,s.edgeColor),t.faces>1&&this.drawFaces(u,s.faceColor),t.nodes>1&&this.drawNodes(o,s.nodeSize,s.nodeColor),t.baseNodes>1&&this.drawNodes(i,s.baseNodeSize,s.baseNodeColor)});n(this,"labelNode",(e,t,s)=>{if(!this.ctx)return;const o=20;this.ctx.font=`Bold ${4*o}px Arial`,this.ctx.fillStyle="#FF00A6",this.ctx.fillText(s.toUpperCase(),e-o,t+o)});n(this,"labelNodes",e=>{for(const t of e){const[s,o,a]=t;this.labelNode(s,o,a)}});n(this,"drawNode",(e,t,s,o)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.arc(e,t,s,0,2*Math.PI),this.ctx.fillStyle=o,this.ctx.fill())});n(this,"drawEdge",(e,t,s,o,a,i)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.moveTo(e,t),this.ctx.lineTo(s,o),this.ctx.lineWidth=a,this.ctx.strokeStyle=i,this.ctx.stroke())});n(this,"drawFace",(e,t)=>{if(this.ctx){this.ctx.beginPath(),this.ctx.strokeStyle="black",this.ctx.fillStyle=t,this.ctx.lineWidth=2,this.ctx.moveTo(e[0][0],e[0][1]);for(let s=1;s<e.length;s++)this.ctx.lineTo(e[s][0],e[s][1]);this.ctx.lineTo(e[0][0],e[0][1]),this.ctx.fill()}});n(this,"drawNodes",(e,t,s)=>{for(const[o,a]of e)this.drawNode(o,a,t,s)});n(this,"drawEdges",(e,t,s)=>{for(let o=0;o<e.length;o++){const[a,i,r,c]=e[o];this.drawEdge(a,i,r,c,t,s)}});n(this,"drawFaces",(e,t)=>{for(let s=0;s<e.length;s++)this.drawFace(e[s],t)});n(this,"separate",e=>{const t=[],s=[],o=[],a=[],i=[],r=[],c=[],d=[],h=[],g=[],u=[],f=[],w=[],x=new Set,N=new Set,v=new Set,T=new Set;for(const E of e.keys()){const B=E.length===1,y=e.get(E),{edges:M,baseEdges:k,faces:P,baseFaces:I}=y.connections,p=this.d(y.x,y.z,!0),C=this.d(y.y,y.z);if(y.z>=0?(t.push([p,C]),B&&o.push([p,C])):(s.push([p,C]),B&&a.push([p,C])),B&&y.z>=0&&w.push([p,C,E]),k)for(let l=0;l<k.length;l++){if(N.has([k[l],E].sort().join("")))continue;const b=e.get(k[l]).z,m=this.d(e.get(k[l]).x,b,!0),z=this.d(e.get(k[l]).y,b);this.utils.averageZ(y.z,b)>=0?c.push([p,C,m,z]):d.push([p,C,m,z]),N.add([k[l],E].sort().join(""))}if(I)for(let l=0;l<I.length;l++){if(T.has(I[l].split("-").sort().join("")))continue;const b=[];let m=0;for(const z of I[l].split("-")){const{x:Z,y:j,z:S}=e.get(z);m+=S,b.push([this.d(Z,S,!0),this.d(j,S)])}m/3>=0?u.push(b):f.push(b),T.add(I[l].split("-").sort().join(""))}for(let l=0;l<M.length;l++){if(x.has([M[l],E].sort().join(""))||!e.get(M[l]))continue;const b=e.get(M[l]).z,m=this.d(e.get(M[l]).x,b,!0),z=this.d(e.get(M[l]).y,b);this.utils.averageZ(y.z,b)>=0?i.push([p,C,m,z]):r.push([p,C,m,z]),x.add([M[l],E].sort().join(""))}for(let l=0;l<P.length;l++){if(v.has(P[l].split("-").sort().join("")))continue;const b=[];let m=0;for(const z of P[l].split("-")){const{x:Z,y:j,z:S}=e.get(z);m+=S,b.push([this.d(Z,S,!0),this.d(j,S)])}m/3>=0?h.push(b):g.push(b),v.add(P[l].split("-").sort().join(""))}}return{frontNodes:t,backNodes:s,frontBaseNodes:o,backBaseNodes:a,frontEdges:i,backEdges:r,frontBaseEdges:c,backBaseEdges:d,frontFaces:h,backFaces:g,frontBaseFaces:u,backBaseFaces:f,labelNodes:w}});e.width=t,e.height=s,this.utils=new q,this.ctx=e.getContext("2d"),this.width=t,this.height=s,this.centerX=t/2,this.centerY=s/2}}class O{constructor(e,t){n(this,"canvasParent");n(this,"panelParent");n(this,"panelId");n(this,"canvasId");n(this,"mouseIsDown");n(this,"generateInterface",()=>{this.generateCanvas(),this.generatePanel()});n(this,"generateCanvas",()=>{this.canvasParent.innerHTML=`
      ${this.canvasParent.innerHTML}
      <canvas id="${this.canvasId}" class="border-4 border-black cursor-grab"></canvas>
    `});n(this,"generatePanel",()=>{this.panelParent.innerHTML=`
      ${this.panelParent.innerHTML}
      <form id="${this.panelId}" class="w-96">
        <div class="flex justify-between">
          <p>frequency: </p>
          <input type="range" min="1" max="50" value="1">
        </div>
        <div class="flex justify-between">
          <p>Base: </p>
          <select>
            ${["icosahedron","cube","tetrahedron"].map((e,t)=>`<option key=${t} value="${e}">${e}</option>`)}
          </select>
        </div>
        <input class="cursor-pointer" type="submit" value="Generate">
      </form>
    `});n(this,"generateEventListeners",(e,t)=>{const s=document.querySelector(`#${this.canvasId}`);document.addEventListener("mouseup",()=>{this.mouseIsDown=!1}),s.addEventListener("mousedown",()=>{this.mouseIsDown=!0}),s.addEventListener("mousemove",o=>{this.mouseIsDown&&e(o.movementX,o.movementY)}),s.addEventListener("wheel",o=>{o.stopPropagation(),o.preventDefault(),t(o.deltaY<0)})});n(this,"getCanvasElement",()=>document.querySelector(`#${this.canvasId}`));this.canvasParent=e,this.panelParent=t,this.canvasId="geodesic-canvas",this.panelId="geodesic-panel",this.mouseIsDown=!1,this.generateInterface()}}class ${constructor(e,t,s,o={edges:[],faces:[]}){n(this,"x");n(this,"y");n(this,"z");n(this,"connections");this.x=e,this.y=t,this.z=s,this.connections=o}}class W{constructor(e,t){n(this,"geodesicInterface");n(this,"drawCanvas");n(this,"utils");n(this,"bases");n(this,"baseType");n(this,"nodes");n(this,"zoom");n(this,"zoomMin");n(this,"zoomStep");n(this,"zoomMax");n(this,"frequency");n(this,"rotationRads");n(this,"drawOptions");n(this,"drawStyles");n(this,"generateBases",()=>{this.bases.set("cube",this.generateCubeBase()),this.bases.set("icosahedron",this.generateIcosahedronBase())});n(this,"generateIcosahedronBase",()=>{const e=new Map,t=(1+Math.sqrt(5))/4,s=.5,o=this.utils.distanceF(0,.5,t,0,0,0),a=(i,r,c,d)=>{e.set(this.utils.mapChar(d),new $(i*this.zoom,r*this.zoom,c*this.zoom,this.getIcosahedronConnections(d)))};for(let i=0;i<=3;i++){const r=t*(2*Math.floor(i/2)-1),c=s*(2*(i%2)-1);a(0,r/o,c/o,i)}for(let i=4;i<=7;i++){const r=t*(2*Math.floor(i%4/2)-1),c=s*(2*(i%2)-1);a(r/o,c/o,0,i)}for(let i=8;i<=11;i++){const r=s*(2*(i%2)-1),c=t*(2*Math.floor(i%4/2)-1);a(r/o,0,c/o,i)}return e});n(this,"generateCubeBase",()=>{const e=new Map,t=Math.sqrt(3);for(let s=-1;s<2;s+=2)for(let o=-1;o<2;o+=2)for(let a=-1;a<2;a+=2)e.set(this.utils.mapChar(e.size),new $(s/t*this.zoom,o/t*this.zoom,a/t*this.zoom,this.getCubeConnections(e.size)));return e});n(this,"getIcosahedronConnections",e=>{const t=r=>(r^1)%12,s=r=>4*((Math.floor(r/4)+1)%3)+Math.floor(r/2)%2,o=r=>4*((Math.floor(r/4)+2)%3)+2*(r%2);this.utils.mapToChars([e,t(e),s(e)]).sort().join("");const a=this.utils.mapToChars([t(e),s(e),o(e),o(e)+1,s(e)+2]),i=this.utils.calculateConnectedFaces(this.utils.mapChar(e),a,3);return{edges:a,baseEdges:a,faces:i,baseFaces:i}});n(this,"getCubeConnections",e=>({edges:this.utils.mapToChars([e^1,e^2,e^4]),faces:[]}));n(this,"setBase",e=>{this.baseType=e,this.generateGeo()});n(this,"generateGeo",()=>{if(this.frequency===1){this.nodes=this.bases.get(this.baseType);return}switch(this.baseType){case"icosahedron":this.generateIcosahedronAtFrequency();break}});n(this,"generateIcosahedronAtFrequency",()=>{this.nodes=new Map;const e=this.bases.get(this.baseType),t=this.frequency;for(const a of e.keys()){const{x:i,y:r,z:c,connections:d}=e.get(a),h={edges:[],faces:[]};h.baseEdges=d.baseEdges,h.baseFaces=d.baseFaces,this.nodes.set(a,new $(i,r,c,h))}const s=new Set;for(const a of e.keys()){const{connections:{baseEdges:i}}=e.get(a);for(const r of i){const c=[a,r].sort();if(!s.has(c.join("-"))){for(let d=1;d<t;d++){const h=t-d,g=c[0]+d+c[1]+h,u={edges:new Array(2),faces:[]};u.edges[0]=this.utils.generateEdgeKey(c,d-1,h+1,t),u.edges[1]=this.utils.generateEdgeKey(c,d+1,h-1,t);const{x:f,y:w,z:x}=e.get(c[0]),{x:N,y:v,z:T}=e.get(c[1]),{x:E,y:B,z:y}=this.utils.icosahedronIntermediateNode(d,h,0,f,w,x,N,v,T,0,0,0);this.nodes.set(g,new $(E*this.zoom,B*this.zoom,y*this.zoom,u)),d-1||this.nodes.get(c[1]).connections.edges.push(g),h-1||this.nodes.get(c[0]).connections.edges.push(g)}s.add(c.join("-"))}}}const o=new Set;for(const a of e.keys()){const{connections:{baseFaces:i}}=e.get(a);for(const r of i){const c=r.split("-").sort();if(!o.has(c.join("-"))){for(let d=1;d<t;d++)for(let h=1;h<t-d;h++){const g=t-d-h,u={edges:[],faces:[]},f=this.utils.generateKeyName(c,d,h,g,t);for(let p=0;p<3;p++)for(let C=0;C<2;C++){const l=d+(p-1),b=h+((p+1+C)%3-1),m=t-l-b,z=this.utils.generateKeyName(c,l,b,m,t);u.edges.push(z),!(l&&b&&m)&&this.nodes.get(z).connections.edges.push(f)}[u.edges[3],u.edges[5]]=[u.edges[5],u.edges[3]],u.faces=this.utils.calculateConnectedFaces(f,u.edges,3);const{x:w,y:x,z:N}=e.get(c[0]),{x:v,y:T,z:E}=e.get(c[1]),{x:B,y,z:M}=e.get(c[2]),{x:k,y:P,z:I}=this.utils.icosahedronIntermediateNode(d,h,g,w,x,N,v,T,E,B,y,M);this.nodes.set(f,new $(k*this.zoom,P*this.zoom,I*this.zoom,u))}for(let d=0;d<3;d++){const h=[`${c[d]}${t-1}`,`${c[(d+1)%3]}1`].sort().join(""),g=[`${c[d]}${t-1}`,`${c[(d+2)%3]}1`].sort().join("");this.nodes.get(h).connections.edges.push(g),this.nodes.get(g).connections.edges.push(h)}o.add(c.join("-"))}}}console.log(this.nodes)});n(this,"render",()=>{this.drawCanvas.draw(this.nodes,this.drawOptions,this.drawStyles)});n(this,"updateZoom",e=>{let t=0;if(!e&&this.zoom>this.zoomMin&&(t=this.zoom-this.zoomStep),e&&this.zoom<this.zoomMax&&(t=this.zoom+this.zoomStep),!t)return;const s=this.zoom/t;this.nodes.forEach((o,a)=>{this.nodes.set(a,new $(o.x/s,o.y/s,o.z/s,o.connections))}),this.zoom=t,this.render()});n(this,"rotate",(e,t)=>{this.nodes.forEach((s,o)=>{const{x:a,y:i,z:r}=this.utils.calculateRotatedCoordinates(s.x,s.y,s.z,e,t,0,this.rotationRads);this.nodes.set(o,new $(a,i,r,s.connections))}),this.render()});this.drawOptions={nodes:2,edges:2,faces:0,baseNodes:0,baseEdges:2,baseFaces:0},this.drawStyles={nodeColor:"blue",backNodeColor:"#FFC7C7",nodeSize:3,edgeColor:"black",backEdgeColor:"#D8D8D8",edgeWidth:1,faceColor:"#0800FFaa",backFaceColor:"#C6C6C6",baseNodeColor:"blue",backBaseNodeColor:"blue",baseNodeSize:4,baseEdgeColor:"red",backBaseEdgeColor:"#FF000030",baseEdgeWidth:3,baseFaceColor:"#0800FF7a",backBaseFaceColor:"#868686"},this.baseType="icosahedron",this.nodes=new Map,this.zoom=475,this.zoomMin=50,this.zoomStep=20,this.zoomMax=1e3,this.bases=new Map,this.frequency=3,this.rotationRads=.002,this.utils=new q,this.geodesicInterface=new O(e,t),this.drawCanvas=new A(this.geodesicInterface.getCanvasElement(),1e3,1e3),this.geodesicInterface.generateEventListeners(this.rotate,this.updateZoom),this.generateBases(),this.generateGeo();const s=Math.random()*1e3+100,o=Math.random()*1e3+100;this.rotate(s,o)}}const L=document.querySelector("#app");new W(L,L);
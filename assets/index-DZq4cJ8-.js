var Z=Object.defineProperty;var Y=(y,e,t)=>e in y?Z(y,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):y[e]=t;var n=(y,e,t)=>Y(y,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();class q{constructor(){n(this,"distanceF",(e,t,s,o,a,i)=>Math.sqrt((o-e)**2+(a-t)**2+(i-s)**2));n(this,"generateKeyName",(e,t,s,o,a)=>`${t?`${e[0]}${t%a?t:""}`:""}${s?`${e[1]}${s%a?s:""}`:""}${o?`${e[2]}${o%a?o:""}`:""}`);n(this,"calculateConnectedFaces",(e,t,s)=>{const o=[];if(s<3)throw new Error;const a=t.length;for(let i=0;i<a;i++){const c=[];c.push(e);for(let d=i;d<i+s-1;d++)c.push(t[d%a]);o.push(c.join("-"))}return o});n(this,"numFromChar",e=>e.charCodeAt(0)-97);n(this,"mapChar",e=>String.fromCharCode(e+97));n(this,"averageZ",(e,t)=>(e+t)/2);n(this,"mapToChars",e=>e.map(t=>this.mapChar(t)));n(this,"calculateRotatedCoordinates",(e,t,s,o,a,i,c)=>{const d=Math.sin(c*o),g=Math.cos(c*o),h=-Math.sin(c*a),l=Math.cos(c*a),f=Math.sin(c*i),u=Math.cos(c*i),p=e*u*g+t*u*d*h-t*f*l+s*u*d*l+s*f*h,z=e*f*g+t*f*d*h+t*u*l+s*f*d*l-s*u*h,E=-e*d+t*g*h+s*g*l;return{x:p,y:z,z:E}});n(this,"icosahedronIntermediateNode",(e,t,s,o,a,i,c,d,g,h,l,f)=>{const u=e+t+s,p=o*(e/u)+c*(t/u)+h*(s/u),z=a*(e/u)+d*(t/u)+l*(s/u),E=i*(e/u)+g*(t/u)+f*(s/u),v=this.distanceF(p,z,E,0,0,0);return{x:p/v,y:z/v,z:E/v}})}}class X{constructor(e,t,s){n(this,"utils");n(this,"ctx");n(this,"width");n(this,"height");n(this,"centerX");n(this,"centerY");n(this,"clearCanvas",()=>{this.ctx&&(this.ctx.fillStyle="white",this.ctx.fillRect(0,0,this.width,this.height))});n(this,"draw",(e,t,s)=>{this.clearCanvas();const{frontNodes:o,backNodes:a,frontBaseNodes:i,backBaseNodes:c,frontEdges:d,backEdges:g,frontBaseEdges:h,backBaseEdges:l,frontFaces:f,backFaces:u,frontBaseFaces:p,backBaseFaces:z}=this.separate(e);t.baseNodes%3&&this.drawNodes(c,s.baseNodeSize,s.backBaseNodeColor),t.nodes%3&&this.drawNodes(a,s.nodeSize,s.backNodeColor),t.faces%3&&this.drawFaces(u,s.backFaceColor),t.edges%3&&this.drawEdges(g,s.edgeWidth,s.backEdgeColor),t.baseFaces%3&&this.drawFaces(z,s.backBaseFaceColor),t.baseEdges%3&&this.drawEdges(l,s.baseEdgeWidth,s.backBaseEdgeColor),t.baseEdges>1&&this.drawEdges(h,s.baseEdgeWidth,s.baseEdgeColor),t.baseFaces>1&&this.drawFaces(p,s.baseFaceColor),t.edges>1&&this.drawEdges(d,s.edgeWidth,s.edgeColor),t.faces>1&&this.drawFaces(f,s.faceColor),t.nodes>1&&this.drawNodes(o,s.nodeSize,s.nodeColor),t.baseNodes>1&&this.drawNodes(i,s.baseNodeSize,s.baseNodeColor)});n(this,"labelNode",(e,t,s)=>{if(!this.ctx)return;const o=12;this.ctx.font=`Bold ${4*o}px Arial`,this.ctx.fillStyle="red",this.ctx.fillText(s.toUpperCase(),e-o,t+o)});n(this,"labelNodes",e=>{for(const t of e){const[s,o,a]=t;this.labelNode(s,o,a)}});n(this,"drawNode",(e,t,s,o)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.arc(e,t,s,0,2*Math.PI),this.ctx.fillStyle=o,this.ctx.fill())});n(this,"drawEdge",(e,t,s,o,a,i)=>{this.ctx&&(this.ctx.beginPath(),this.ctx.moveTo(e,t),this.ctx.lineTo(s,o),this.ctx.lineWidth=a,this.ctx.strokeStyle=i,this.ctx.lineTo(e,t),this.ctx.stroke())});n(this,"drawFace",(e,t)=>{if(this.ctx){this.ctx.beginPath(),this.ctx.strokeStyle="black",this.ctx.fillStyle=t,this.ctx.lineWidth=2,this.ctx.moveTo(e[0][0],e[0][1]);for(let s=1;s<e.length;s++)this.ctx.lineTo(e[s][0],e[s][1]);this.ctx.lineTo(e[0][0],e[0][1]),this.ctx.fill()}});n(this,"drawNodes",(e,t,s)=>{for(const[o,a]of e)this.drawNode(o,a,t,s)});n(this,"drawEdges",(e,t,s)=>{for(let o=0;o<e.length;o++){const[a,i,c,d]=e[o];this.drawEdge(a,i,c,d,t,s)}});n(this,"drawFaces",(e,t)=>{for(let s=0;s<e.length;s++)this.drawFace(e[s],t)});n(this,"separate",e=>{const t=[],s=[],o=[],a=[],i=[],c=[],d=[],g=[],h=[],l=[],f=[],u=[],p=[],z=new Set,E=new Set,v=new Set,P=new Set;for(const N of e.keys()){const $=N.length===1,M=e.get(N),{edges:B,baseEdges:k,faces:I,baseFaces:S}=M.connections,F=this.centerX+M.x,m=this.centerY+M.y;if(M.z>=0?(t.push([F,m]),$&&o.push([F,m])):(s.push([F,m]),$&&a.push([F,m])),$&&p.push([F,m,N]),k)for(let r=0;r<k.length;r++){if(E.has([k[r],N].sort().join("")))continue;const b=e.get(k[r]).x+this.centerX,w=e.get(k[r]).y+this.centerY;this.utils.averageZ(M.z,e.get(k[r]).z)>=0?d.push([F,m,b,w]):g.push([F,m,b,w]),E.add([k[r],N].sort().join(""))}if(S)for(let r=0;r<S.length;r++){if(P.has(S[r].split("-").sort().join("")))continue;const b=[];let w=0;for(const C of S[r].split("-")){const x=e.get(C).x+this.centerX,j=e.get(C).y+this.centerY;w+=e.get(C).z,b.push([x,j])}w/3>=0?f.push(b):u.push(b),P.add(S[r].split("-").sort().join(""))}for(let r=0;r<B.length;r++){if(z.has([B[r],N].sort().join("")))continue;const b=e.get(B[r]).x+this.centerX,w=e.get(B[r]).y+this.centerY;this.utils.averageZ(M.z,e.get(B[r]).z)>=0?i.push([F,m,b,w]):c.push([F,m,b,w]),z.add([B[r],N].sort().join(""))}for(let r=0;r<I.length;r++){if(v.has(I[r].split("-").sort().join("")))continue;const b=[];let w=0;for(const C of I[r].split("-")){const x=e.get(C).x+this.centerX,j=e.get(C).y+this.centerY;w+=e.get(C).z,b.push([x,j])}w/3>=0?h.push(b):l.push(b),v.add(I[r].split("-").sort().join(""))}}return{frontNodes:t,backNodes:s,frontBaseNodes:o,backBaseNodes:a,frontEdges:i,backEdges:c,frontBaseEdges:d,backBaseEdges:g,frontFaces:h,backFaces:l,frontBaseFaces:f,backBaseFaces:u,labelNodes:p}});e.width=t,e.height=s,this.utils=new q,this.ctx=e.getContext("2d"),this.width=t,this.height=s,this.centerX=t/2,this.centerY=s/2}}class D{constructor(e,t){n(this,"canvasParent");n(this,"panelParent");n(this,"panelId");n(this,"canvasId");n(this,"mouseIsDown");n(this,"generateInterface",()=>{this.generateCanvas(),this.generatePanel()});n(this,"generateCanvas",()=>{this.canvasParent.innerHTML=`
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
    `});n(this,"generateEventListeners",(e,t)=>{const s=document.querySelector(`#${this.canvasId}`);document.addEventListener("mouseup",()=>{this.mouseIsDown=!1}),s.addEventListener("mousedown",()=>{this.mouseIsDown=!0}),s.addEventListener("mousemove",o=>{this.mouseIsDown&&e(o.movementX,o.movementY)}),s.addEventListener("wheel",o=>{o.stopPropagation(),o.preventDefault(),t(o.deltaY<0)})});n(this,"getCanvasElement",()=>document.querySelector(`#${this.canvasId}`));this.canvasParent=e,this.panelParent=t,this.canvasId="geodesic-canvas",this.panelId="geodesic-panel",this.mouseIsDown=!1,this.generateInterface()}}class T{constructor(e,t,s,o={edges:[],faces:[]}){n(this,"x");n(this,"y");n(this,"z");n(this,"connections");this.x=e,this.y=t,this.z=s,this.connections=o}}class O{constructor(e,t){n(this,"geodesicInterface");n(this,"drawCanvas");n(this,"utils");n(this,"bases");n(this,"baseType");n(this,"nodes");n(this,"zoom");n(this,"zoomMin");n(this,"zoomStep");n(this,"zoomMax");n(this,"frequency");n(this,"rotationRads");n(this,"drawOptions");n(this,"drawStyles");n(this,"generateBases",()=>{this.bases.set("cube",this.generateCubeBase()),this.bases.set("icosahedron",this.generateIcosahedronBase())});n(this,"generateIcosahedronBase",()=>{const e=new Map,t=(1+Math.sqrt(5))/4,s=.5,o=this.utils.distanceF(0,.5,t,0,0,0),a=(i,c,d,g)=>{e.set(this.utils.mapChar(g),new T(i*this.zoom,c*this.zoom,d*this.zoom,this.getIcosahedronConnections(g)))};for(let i=0;i<=3;i++){const c=t*(2*Math.floor(i/2)-1),d=s*(2*(i%2)-1);a(0,c/o,d/o,i)}for(let i=4;i<=7;i++){const c=t*(2*Math.floor(i%4/2)-1),d=s*(2*(i%2)-1);a(c/o,d/o,0,i)}for(let i=8;i<=11;i++){const c=s*(2*(i%2)-1),d=t*(2*Math.floor(i%4/2)-1);a(c/o,0,d/o,i)}return e});n(this,"generateCubeBase",()=>{const e=new Map,t=Math.sqrt(3);for(let s=-1;s<2;s+=2)for(let o=-1;o<2;o+=2)for(let a=-1;a<2;a+=2)e.set(this.utils.mapChar(e.size),new T(s/t*this.zoom,o/t*this.zoom,a/t*this.zoom,this.getCubeConnections(e.size)));return e});n(this,"getIcosahedronConnections",e=>{const t=c=>(c^1)%12,s=c=>4*((Math.floor(c/4)+1)%3)+Math.floor(c/2)%2,o=c=>4*((Math.floor(c/4)+2)%3)+2*(c%2);this.utils.mapToChars([e,t(e),s(e)]).sort().join("");const a=this.utils.mapToChars([t(e),s(e),o(e),o(e)+1,s(e)+2]),i=this.utils.calculateConnectedFaces(this.utils.mapChar(e),a,3);return{edges:a,baseEdges:a,faces:i,baseFaces:i}});n(this,"getCubeConnections",e=>({edges:this.utils.mapToChars([e^1,e^2,e^4]),faces:[]}));n(this,"setBase",e=>{this.baseType=e,this.generateGeo()});n(this,"generateGeo",()=>{if(this.frequency===1){this.nodes=this.bases.get(this.baseType);return}switch(this.baseType){case"icosahedron":this.generateIcosahedronAtFrequency();break}});n(this,"generateIcosahedronAtFrequency",()=>{this.nodes=new Map;const e=this.bases.get(this.baseType),t=this.frequency,s=new Set,o={};for(const a of e.keys()){const c=e.get(a).connections.faces;for(let d=0;d<c.length;d++){const g=c[d].split("-").sort();if(!s.has(g.join("-"))){for(let h=t;h>=0;h--)for(let l=t-h;l>=0;l--){const f={edges:[],faces:[]},u=t-h-l,p=this.utils.generateKeyName(g,h,l,u,t);if(e.has(p)&&(f.baseEdges=e.get(p).connections.baseEdges,f.baseFaces=e.get(p).connections.baseFaces),h&&l&&u){for(let m=0;m<3;m++)for(let r=0;r<2;r++){const b=h+(m-1),w=l+((m+1+r)%3-1),C=t-b-w,x=this.utils.generateKeyName(g,b,w,C,t);f.edges.push(x),!(b&&w&&C)&&(o[x]?o[x].add(p):o[x]=new Set([p]))}[f.edges[3],f.edges[5]]=[f.edges[5],f.edges[3]],f.faces=this.utils.calculateConnectedFaces(p,f.edges,3)}else if(h&&l||l&&u||u&&h)for(let m=0;m<2;m++){const r=m*2-1,b=h?h+r:0,w=l?l+(h?-r:r):0,C=u?u-r:0,x=this.utils.generateKeyName(g,b,w,C,t);f.edges.push(x),(b===t||w===t||C===t)&&(o[x]?o[x].add(p):o[x]=new Set([p]))}if(this.nodes.has(p))continue;const{x:z,y:E,z:v}=e.get(g[0]),{x:P,y:N,z:$}=e.get(g[1]),{x:M,y:B,z:k}=e.get(g[2]),{x:I,y:S,z:F}=this.utils.icosahedronIntermediateNode(h,l,u,z,E,v,P,N,$,M,B,k);this.nodes.set(p,new T(I*this.zoom,S*this.zoom,F*this.zoom,f))}for(let h=0;h<3;h++){const l=[`${g[h]}${t-1}`,`${g[(h+1)%3]}1`].sort().join(""),f=[`${g[h]}${t-1}`,`${g[(h+2)%3]}1`].sort().join("");o[l]?o[l].add(f):o[l]=new Set([f]),o[f]?o[f].add(l):o[f]=new Set([l])}s.add(g.join("-"))}}}for(const a of Object.keys(o))this.nodes.get(a).connections.edges.push(...o[a]);console.log(this.nodes)});n(this,"render",()=>{this.drawCanvas.draw(this.nodes,this.drawOptions,this.drawStyles)});n(this,"updateZoom",e=>{let t=0;if(!e&&this.zoom>this.zoomMin&&(t=this.zoom-this.zoomStep),e&&this.zoom<this.zoomMax&&(t=this.zoom+this.zoomStep),!t)return;const s=this.zoom/t;this.nodes.forEach((o,a)=>{this.nodes.set(a,new T(o.x/s,o.y/s,o.z/s,o.connections))}),this.zoom=t,this.render()});n(this,"rotate",(e,t)=>{this.nodes.forEach((s,o)=>{const{x:a,y:i,z:c}=this.utils.calculateRotatedCoordinates(s.x,s.y,s.z,e,t,0,this.rotationRads);this.nodes.set(o,new T(a,i,c,s.connections))}),this.render()});this.drawOptions={nodes:0,edges:2,faces:2,baseNodes:2,baseEdges:2,baseFaces:0},this.drawStyles={nodeColor:"blue",backNodeColor:"#FFC7C7",nodeSize:3,edgeColor:"black",backEdgeColor:"#D8D8D8",edgeWidth:1,faceColor:"#0800FFba",backFaceColor:"#C6C6C6",baseNodeColor:"blue",backBaseNodeColor:"blue",baseNodeSize:6,baseEdgeColor:"red",backBaseEdgeColor:"#FF000030",baseEdgeWidth:4,baseFaceColor:"#0800FF7a",backBaseFaceColor:"#868686"},this.baseType="icosahedron",this.nodes=new Map,this.zoom=495,this.zoomMin=50,this.zoomStep=20,this.zoomMax=5e3,this.bases=new Map,this.frequency=3,this.rotationRads=.002,this.utils=new q,this.geodesicInterface=new D(e,t),this.drawCanvas=new X(this.geodesicInterface.getCanvasElement(),1e3,1e3),this.geodesicInterface.generateEventListeners(this.rotate,this.updateZoom),this.generateBases(),this.generateGeo();const s=Math.random()*1e3+100,o=Math.random()*1e3+100;this.rotate(s,o)}}const L=document.querySelector("#app");new O(L,L);

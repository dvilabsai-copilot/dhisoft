"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { BUILDING_BLOCK, TETRIS_PIECES } from "./building-block-layout";

// Gravity-valid tetrominoes fill the six by eight front. Extending every piece
// through six cubes of depth makes a solid build with the same sequence on both faces.
const columns = 6, rows = 8, layers = 6;
const pieces = TETRIS_PIECES;

export default function CinematicSystem({ progress, still, paused, replayKey }: { progress: MotionValue<number>; still: boolean; paused: boolean; replayKey: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const controls = useRef({ paused, replayKey });
  controls.current = { paused, replayKey };
  useEffect(() => {
    let stop = false;
    let cleanup = () => {};
    void import("three").then(THREE => {
      if (stop || !host.current) return;
      const container = host.current;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      renderer.setClearColor(0x06111c, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 70);
      scene.add(new THREE.HemisphereLight(0xc9edff, 0x092038, 3));
      const key = new THREE.DirectionalLight(0xe2f5ff, 5); key.position.set(3,7,6); scene.add(key);
      const rim = new THREE.PointLight(0x008cff, 45, 18); rim.position.set(-3,2,-2); scene.add(rim);
      const fill = new THREE.PointLight(0x84dfff, 24, 14); fill.position.set(5,-1,5); scene.add(fill);
      const colors = [0x0866b0,0x0c75b8,0x0859a7,0x1284ca,0x0a609e,0x0876b8];
      const materials = colors.map(color=>new THREE.MeshPhysicalMaterial({color,metalness:.5,roughness:.26,clearcoat:1}));
      const baseMaterial = new THREE.MeshStandardMaterial({color:0x12344f,metalness:.6,roughness:.3});
      const { faceSize, spacing, bevel, cornerRadius }=BUILDING_BLOCK;
      const shape = new THREE.Shape(); const s=faceSize, r=cornerRadius, lo=-s/2, hi=s/2;
      shape.moveTo(lo+r,lo); shape.lineTo(hi-r,lo); shape.quadraticCurveTo(hi,lo,hi,lo+r);
      shape.lineTo(hi,hi-r); shape.quadraticCurveTo(hi,hi,hi-r,hi); shape.lineTo(lo+r,hi);
      shape.quadraticCurveTo(lo,hi,lo,hi-r); shape.lineTo(lo,lo+r); shape.quadraticCurveTo(lo,lo,lo+r,lo);
      const geometry = new THREE.ExtrudeGeometry(shape,{depth:faceSize,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:6}); geometry.translate(0,0,-faceSize/2);
      const baseGeometry = new THREE.BoxGeometry(columns*spacing+.3,.12,layers*spacing+.3);
      // The same continuous logo is mapped independently onto front and right.
      // Each ink segment travels with its cube from the first falling frame.
      const logoCanvas=document.createElement("canvas");logoCanvas.width=768;logoCanvas.height=1024;
      const logoTexture=new THREE.CanvasTexture(logoCanvas);logoTexture.colorSpace=THREE.SRGBColorSpace;
      const logoMaterial=new THREE.MeshBasicMaterial({map:logoTexture,transparent:true,depthWrite:false,toneMapped:false});
      const faceGeometries: InstanceType<typeof THREE.PlaneGeometry>[]=[];
      const makeFace=(column: number,row: number)=> {
        const faceGeometry=new THREE.PlaneGeometry(faceSize,faceSize);
        const half=faceSize/spacing/2;
        const u0=(column+.5-half)/columns,u1=(column+.5+half)/columns,v0=(row+.5-half)/rows,v1=(row+.5+half)/rows;
        const uv=faceGeometry.getAttribute("uv");
        uv.setXY(0,u0,v1);uv.setXY(1,u1,v1);uv.setXY(2,u0,v0);uv.setXY(3,u1,v0);
        faceGeometries.push(faceGeometry);
        return new THREE.Mesh(faceGeometry,logoMaterial);
      };
      let width=1,height=1,visible=true,redraw=true,logoLoaded=false;
      const logoImage=new window.Image();
      logoImage.onload=()=> {
        if(stop) return;
        const context=logoCanvas.getContext("2d");if(!context) return;
        const inkWidth=720,inkHeight=inkWidth*325/569;
        context.drawImage(logoImage,0,0,569,325,(768-inkWidth)/2,(1024-inkHeight)/2,inkWidth,inkHeight);
        const ink=context.getImageData(0,0,768,1024);
        for(let i=0;i<ink.data.length;i+=4) {
          const r=ink.data[i],b=ink.data[i+2];
          if(b-r<=18 || b<=38 || r>=165) ink.data[i+3]=0;
          else {ink.data[i]=165;ink.data[i+1]=239;ink.data[i+2]=255;}
        }
        context.putImageData(ink,0,0);logoTexture.needsUpdate=true;logoLoaded=true;redraw=true;
        container.dataset.blockLogoReady="true";
      };
      logoImage.src="/images/dhisoft-logo.png";
      const system = new THREE.Group(); scene.add(system);
      const base = new THREE.Mesh(baseGeometry,baseMaterial); base.position.set(0,-rows*spacing/2-.05,0); system.add(base);
      const assemblies = pieces.map((cells,index)=> {
        const group = new THREE.Group();
        const cx=cells.reduce((sum,c)=>sum+c[0],0)/4, cy=cells.reduce((sum,c)=>sum+c[1],0)/4;
        const body=new THREE.InstancedMesh(geometry,materials[index%materials.length],cells.length*layers);
        body.instanceMatrix.setUsage(THREE.DynamicDrawUsage);body.frustumCulled=false;group.add(body);
        const meshes=cells.flatMap(([x,y])=>Array.from({length:layers},(_,z)=> {
          const block=new THREE.Group();
          if(z===layers-1) {const ink=makeFace(x,y);ink.position.z=faceSize/2+bevel+.002;block.add(ink);}
          if(x===columns-1) {const ink=makeFace(layers-1-z,y);ink.rotation.y=Math.PI/2;ink.position.x=faceSize/2+bevel+.002;block.add(ink);}
          block.position.set((x-cx)*spacing,(y-cy)*spacing,(z-(layers-1)/2)*spacing);
          group.add(block);return {block,row:y};
        }));
        system.add(group);
        return {group,body,meshes,x:(cx-(columns-1)/2)*spacing,y:(cy-(rows-1)/2)*spacing};
      });
      const resize=()=> {width=container.clientWidth;height=container.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();redraw=true;};
      const size=new ResizeObserver(resize); size.observe(container); resize();
      const visibility=new IntersectionObserver(entries=> {visible=entries[0].isIntersecting;}); visibility.observe(container);
      let frame=0, last=0, elapsed=0, p=progress.get(), replay=controls.current.replayKey;
      let lastPhase="";
      const render=(now: number)=> {
        if(stop) return;
        const delta=last ? (now-last)/1000 : 0; last=now;
        if(!visible || document.hidden) {frame=requestAnimationFrame(render); return;}
        if(replay!==controls.current.replayKey) {replay=controls.current.replayKey;elapsed=0;redraw=true;}
        if(!still && !controls.current.paused && logoLoaded) elapsed+=delta;
        const target=still ? 0 : progress.get(); p+=(target-p)*.09;
        if(still && !redraw) {frame=requestAnimationFrame(render);return;}
        const step=.88, build=pieces.length*step, duration=build+6.5;
        const t=still ? build+2.5 : elapsed%duration;
        const clearTime=t-build-4.5;
        const phase=still ? "still" : controls.current.paused ? "paused" : clearTime>0 ? "clearing" : t>=build ? "logo" : "dropping";
        if(phase!==lastPhase) {container.dataset.phase=phase;lastPhase=phase;}
        container.dataset.landed=String(Math.min(pieces.length,Math.floor(t/step)));
        container.dataset.animationTime=elapsed.toFixed(3);
        container.dataset.logoFaces="front right";
        const mobile=width<700,compact=width<1000;
        const compactScale=Math.min(mobile ? .9 : .78,Math.max(.55,(height-360)/600),width/height*1.4);
        system.scale.setScalar(compact ? compactScale : 1);
        const cross=THREE.MathUtils.smoothstep(p,.23,.33)*(1-THREE.MathUtils.smoothstep(p,.57,.7));
        system.position.set(compact ? 0 : 3.05-cross*6.1, compact ? -1.3 : 0, 0);
        // Keep both branded faces in view throughout all three scroll chapters.
        system.rotation.set(.12,compact ? -.76 : -.96+cross*.48,-.015);
        assemblies.forEach((item,i)=> {
          const local=(t-i*step)/step;
          const fall=Math.max(0,Math.min(1,local/.78));
          const eased=fall*fall*fall;
          const bounce=local>.78 && local<1 ? Math.sin((local-.78)/.22*Math.PI)*.055 : 0;
          item.group.visible=still || (local>=0 && local<duration);
          item.group.position.set(item.x+(1-fall)*Math.sin(i*2.1)*.85,item.y+(1-eased)*7+bounce,0);
          item.group.rotation.set((1-fall)*.2,(1-fall)*.5,(1-fall)*(i%2===0 ? .18 : -.18));
          item.meshes.forEach(({block,row},index)=> {
            const clear=clearTime>0 ? Math.max(0,Math.min(1,(clearTime-row*.1)/.3)) : 0;
            block.scale.setScalar(1-clear);
            block.updateMatrix();item.body.setMatrixAt(index,block.matrix);
          });
          item.body.instanceMatrix.needsUpdate=true;
        });
        camera.position.set(0,.45,compact ? 13.2 : 12.8);
        camera.lookAt(0,compact ? .1 : .15,0);
        renderer.render(scene,camera); redraw=false;
        frame=requestAnimationFrame(render);
      };
      frame=requestAnimationFrame(render); setReady(true);
      cleanup=()=> {cancelAnimationFrame(frame);size.disconnect();visibility.disconnect();logoImage.onload=null;assemblies.forEach(item=>item.body.dispose());geometry.dispose();baseGeometry.dispose();faceGeometries.forEach(g=>g.dispose());logoTexture.dispose();logoMaterial.dispose();materials.forEach(m=>m.dispose());baseMaterial.dispose();renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>{});
    return ()=> {stop=true;cleanup();};
  },[progress,still]);
  return <div className={`dhi-film-visual ${ready ? "is-ready" : ""}`} aria-hidden="true">
    <div className="dhi-film-fallback"><div /><div /><div /></div>
    <div ref={host} className="dhi-webgl" />
  </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { BUILDING_BLOCK } from "./building-block-layout";
import { RUBIK_SIZE, rubikSolveStates, sampleRubikSequence } from "@/lib/rubik-sequence";

export default function CinematicRubik({ progress, still, paused, replayKey }: { progress: MotionValue<number>; still: boolean; paused: boolean; replayKey: number }) {
  const host=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false);
  const controls=useRef({paused,replayKey});controls.current={paused,replayKey};
  useEffect(()=> {
    let stopped=false;
    let cleanup=()=>{};
    void import("three").then(THREE=> {
      if(stopped || !host.current) return;
      const container=host.current;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});} catch {return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x06111c,1);
      renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
      container.appendChild(renderer.domElement);
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,70);
      scene.add(new THREE.HemisphereLight(0xd1efff,0x081e35,3));
      const key=new THREE.DirectionalLight(0xdff4ff,5);key.position.set(4,6,7);scene.add(key);
      const rim=new THREE.PointLight(0x168dff,45,18);rim.position.set(-3,3,-3);scene.add(rim);
      const fill=new THREE.PointLight(0x99e4ff,28,14);fill.position.set(6,-1,4);scene.add(fill);
      const palette=[0x075da9,0x0879c9,0x0a6dbb];
      const bodyMaterial=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:.5,roughness:.25,clearcoat:1});
      const {faceSize,spacing,bevel,cornerRadius}=BUILDING_BLOCK;
      const count=RUBIK_SIZE,center=(count-1)/2;
      const shape=new THREE.Shape(),s=faceSize,r=cornerRadius,lo=-s/2,hi=s/2;
      shape.moveTo(lo+r,lo);shape.lineTo(hi-r,lo);shape.quadraticCurveTo(hi,lo,hi,lo+r);
      shape.lineTo(hi,hi-r);shape.quadraticCurveTo(hi,hi,hi-r,hi);shape.lineTo(lo+r,hi);
      shape.quadraticCurveTo(lo,hi,lo,hi-r);shape.lineTo(lo,lo+r);shape.quadraticCurveTo(lo,lo,lo+r,lo);
      const geometry=new THREE.ExtrudeGeometry(shape,{depth:faceSize,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,steps:1,curveSegments:6});geometry.translate(0,0,-faceSize/2);
      let width=1,height=1,visible=true,redraw=true,logoReady=false;
      const inkCanvas=document.createElement("canvas");inkCanvas.width=768;inkCanvas.height=768;
      const texture=new THREE.CanvasTexture(inkCanvas);texture.colorSpace=THREE.SRGBColorSpace;
      const inkMaterial=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false});
      const logoImage=new window.Image();
      logoImage.onload=()=> {
        if(stopped) return;
        const context=inkCanvas.getContext("2d");if(!context) return;
        const w=690,h=w*325/569;
        context.drawImage(logoImage,0,0,569,325,(768-w)/2,(768-h)/2+35,w,h);
        const pixels=context.getImageData(0,0,768,768);
        for(let i=0;i<pixels.data.length;i+=4) {
          const red=pixels.data[i],blue=pixels.data[i+2];
          if(blue-red<=18 || blue<=38 || red>=165) pixels.data[i+3]=0;
          else {pixels.data[i]=165;pixels.data[i+1]=239;pixels.data[i+2]=255;}
        }
        context.putImageData(pixels,0,0);texture.needsUpdate=true;logoReady=true;redraw=true;container.dataset.rubikLogoReady="true";
      };
      logoImage.src="/images/dhisoft-logo.png";
      const faceGeometries: InstanceType<typeof THREE.PlaneGeometry>[]=[];
      const face=(column: number,row: number)=> {
        const g=new THREE.PlaneGeometry(faceSize,faceSize),half=faceSize/spacing/2;
        const u0=(column+.5-half)/count,u1=(column+.5+half)/count,v0=(row+.5-half)/count,v1=(row+.5+half)/count;
        const uv=g.getAttribute("uv");uv.setXY(0,u0,v1);uv.setXY(1,u1,v1);uv.setXY(2,u0,v0);uv.setXY(3,u1,v0);faceGeometries.push(g);
        return new THREE.Mesh(g,inkMaterial);
      };
      const cube=new THREE.Group();scene.add(cube);
      const body=new THREE.InstancedMesh(geometry,bodyMaterial,count**3);body.instanceMatrix.setUsage(THREE.DynamicDrawUsage);body.frustumCulled=false;cube.add(body);
      const cubies: {mesh: InstanceType<typeof THREE.Group>;home: InstanceType<typeof THREE.Vector3>;x: number;y: number;z: number}[]=[];
      for(let x=0;x<count;x++) for(let y=0;y<count;y++) for(let z=0;z<count;z++) {
        const mesh=new THREE.Group();body.setColorAt(cubies.length,new THREE.Color(palette[(x+y+z)%3]));
        if(z===count-1) {const mark=face(x,y);mark.position.z=faceSize/2+bevel+.002;mesh.add(mark);}
        if(x===count-1) {const mark=face(count-1-z,y);mark.rotation.y=Math.PI/2;mark.position.x=faceSize/2+bevel+.002;mesh.add(mark);}
        const home=new THREE.Vector3((x-center)*spacing,(y-center)*spacing,(z-center)*spacing);mesh.position.copy(home);cube.add(mesh);cubies.push({mesh,home,x,y,z});
      }
      const resize=()=> {width=container.clientWidth;height=container.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();redraw=true;};
      const size=new ResizeObserver(resize);size.observe(container);resize();
      const visibility=new IntersectionObserver(entries=> {visible=entries[0].isIntersecting;});visibility.observe(container);
      const discreteStates=rubikSolveStates();
      const states=discreteStates.map(state=>state.map(pose=> {
        const m=pose.orientation;
        const orientation=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().set(m[0],m[1],m[2],0,m[3],m[4],m[5],0,m[6],m[7],m[8],0,0,0,0,1));
        return {position:new THREE.Vector3(...pose.position.map(n=>(n-center)*spacing) as [number,number,number]),orientation};
      }));
      const axes={x:new THREE.Vector3(1,0,0),y:new THREE.Vector3(0,1,0)};
      const turn=new THREE.Quaternion();
      let frame=0,last=0,time=0,p=progress.get(),replay=controls.current.replayKey;
      const render=(now: number)=> {
        if(stopped) return;
        const delta=last ? (now-last)/1000 : 0;last=now;
        if(!visible || document.hidden) {frame=requestAnimationFrame(render);return;}
        if(replay!==controls.current.replayKey) {replay=controls.current.replayKey;time=0;redraw=true;}
        if(!still && !controls.current.paused && logoReady) time+=delta;
        p+=((still ? 0 : progress.get())-p)*.08;
        if(still && !redraw) {frame=requestAnimationFrame(render);return;}
        const pose=sampleRubikSequence(time,still);
        const move=pose.move;
        if(move) turn.setFromAxisAngle(axes[move.axis],move.direction*pose.fraction*Math.PI/2);
        cubies.forEach(({mesh},index)=> {
          const base=states[pose.stateIndex][index];
          const moving=move && discreteStates[pose.stateIndex][index].position[move.axis === "x" ? 0 : 1] === move.layer;
          mesh.position.copy(base.position);mesh.quaternion.copy(base.orientation);
          if(moving) {mesh.position.applyQuaternion(turn);mesh.quaternion.premultiply(turn);}
          mesh.updateMatrix();body.setMatrixAt(index,mesh.matrix);
        });
        body.instanceMatrix.needsUpdate=true;
        const mobile=width<700,cross=THREE.MathUtils.smoothstep(p,.23,.33)*(1-THREE.MathUtils.smoothstep(p,.57,.7));
        cube.position.set(mobile ? 0 : 3.1-cross*6.2,mobile ? -1.3 : .05,0);
        cube.rotation.set(.16,mobile ? -.76 : -.96+cross*.48,-.015);
        cube.scale.setScalar(mobile ? .72 : 1);
        camera.position.set(0,.45,mobile ? 13.2 : 12.2);camera.lookAt(0,mobile ? .1 : .15,0);
        renderer.render(scene,camera);redraw=false;
        container.dataset.phase=still ? "still" : controls.current.paused ? "paused" : pose.phase;
        container.dataset.rotation=String(pose.completed);
        container.dataset.animationTime=time.toFixed(3);
        frame=requestAnimationFrame(render);
      };
      frame=requestAnimationFrame(render);setReady(true);
      cleanup=()=> {cancelAnimationFrame(frame);size.disconnect();visibility.disconnect();logoImage.onload=null;texture.dispose();inkMaterial.dispose();geometry.dispose();faceGeometries.forEach(g=>g.dispose());body.dispose();bodyMaterial.dispose();renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>{});
    return ()=> {stopped=true;cleanup();};
  },[progress,still]);
  return <div className={`dhi-film-visual ${ready ? "is-ready" : ""}`} aria-hidden="true"><div className="dhi-film-fallback"><div /><div /><div /></div><div ref={host} className="dhi-webgl" /></div>;
}

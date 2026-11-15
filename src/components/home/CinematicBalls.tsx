"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

/** The original layered system with metallic orbits and rotating spheres. */
export default function CinematicBalls({ progress, still, paused, replayKey }: { progress: MotionValue<number>; still: boolean; paused: boolean; replayKey: number }) {
  const host=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false);
  const controls=useRef({paused,replayKey}); controls.current={paused,replayKey};
  useEffect(()=> {
    let stopped=false;
    let cleanup=()=>{};
    void import("three").then(THREE=> {
      if(stopped || !host.current) return;
      const container=host.current;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});} catch {return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); renderer.setClearColor(0x06111c,1);
      renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.25;
      container.appendChild(renderer.domElement);
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(35,1,.1,70);
      scene.add(new THREE.HemisphereLight(0xb9eaff,0x071f39,2.8));
      const key=new THREE.DirectionalLight(0xd4f1ff,5);key.position.set(4,8,5);scene.add(key);
      const rim=new THREE.PointLight(0x008cff,65,16);rim.position.set(-3,2,-3);scene.add(rim);
      const edge=new THREE.PointLight(0x9deaff,35,12);edge.position.set(4,-2,3);scene.add(edge);
      const blue=new THREE.MeshPhysicalMaterial({color:0x0878d0,metalness:.75,roughness:.25,clearcoat:1});
      const silver=new THREE.MeshPhysicalMaterial({color:0xb9d6e8,metalness:.92,roughness:.2});
      const dark=new THREE.MeshPhysicalMaterial({color:0x092a45,metalness:.72,roughness:.28});
      const light=new THREE.MeshStandardMaterial({color:0x6fe4ff,emissive:0x1b9ed5,emissiveIntensity:1.4,roughness:.3,metalness:.3});
      const geometries: InstanceType<typeof THREE.BufferGeometry>[]=[];
      const box=(w: number,h: number,d: number,r: number)=> {
        const s=new THREE.Shape(),x=-w/2,y=-h/2;
        s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
        const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r/2,bevelThickness:r/2,curveSegments:8});g.translate(0,0,-d/2);geometries.push(g);return g;
      };
      const plate=box(3.8,2.45,.13,.14),chip=box(.55,.55,.06,.045),core=box(1.02,.85,.1,.06);
      // Use the DHI + SOFT region of the original mark as transparent chip ink.
      // The source logo remains untouched; neither supporting text line enters the texture.
      const logoCanvas=document.createElement("canvas");logoCanvas.width=569;logoCanvas.height=325;
      const logoTexture=new THREE.CanvasTexture(logoCanvas);logoTexture.colorSpace=THREE.SRGBColorSpace;
      const logoMaterial=new THREE.MeshBasicMaterial({map:logoTexture,transparent:true,depthWrite:false,toneMapped:false});
      const logoFace=new THREE.PlaneGeometry(.86,.86*325/569);geometries.push(logoFace);
      const logoImage=new window.Image();
      logoImage.onload=()=> {
        if(stopped) return;
        const context=logoCanvas.getContext("2d");if(!context) return;
        context.drawImage(logoImage,0,0,569,325,0,0,569,325);
        const ink=context.getImageData(0,0,569,325);
        for(let i=0;i<ink.data.length;i+=4) {
          const r=ink.data[i],b=ink.data[i+2];
          if(b-r<=18 || b<=38 || r>=165) ink.data[i+3]=0;
          else {ink.data[i]=157;ink.data[i+1]=224;ink.data[i+2]=255;}
        }
        context.putImageData(ink,0,0);logoTexture.needsUpdate=true;redraw=true;container.dataset.chipLogo="ready";
      };
      logoImage.src="/images/dhisoft-logo.png";
      const sphere=new THREE.SphereGeometry(1,24,16);geometries.push(sphere);
      const system=new THREE.Group();scene.add(system);
      const layers=Array.from({length:4},(_,i)=> {
        const group=new THREE.Group();group.add(new THREE.Mesh(plate,i===0 ? blue : i===3 ? silver : dark));
        const processor=new THREE.Mesh(core,i===0 ? silver : blue);processor.position.z=.21;group.add(processor);
        const brand=new THREE.Mesh(logoFace,logoMaterial);brand.position.z=.302;group.add(brand);
        for(let j=0;j<3;j++) {
          const shift=(j-1)*.19;
          const path=new THREE.CatmullRomCurve3([[-1.5,-.7],[-.7,-.7],[-.7,0],[.6,0],[.6,.7],[1.5,.7]].map(([x,y])=>new THREE.Vector3(x,y+shift,.18)),false,"catmullrom",.02);
          const g=new THREE.TubeGeometry(path,36,.012,5,false);geometries.push(g);group.add(new THREE.Mesh(g,light));
        }
        for(let j=0;j<6;j++) {const item=new THREE.Mesh(chip,j===2 ? light : silver);item.position.set(-1.3+(j%3)*1.3,-.85+Math.floor(j/3)*1.7,.2);item.scale.set(j%3===1 ? .45 : .7,.5,1);group.add(item);}
        system.add(group);return group;
      });
      const orbit=new THREE.Group();system.add(orbit);
      for(let i=0;i<3;i++) {
        const points=Array.from({length:101},(_,j)=> {const t=j/100,a=t*Math.PI*1.65+i*.4;return new THREE.Vector3(Math.cos(a)*3.1,(t-.5)*7,Math.sin(a)*2.1);});
        const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),120,.025,7,false);geometries.push(g);orbit.add(new THREE.Mesh(g,i===0 ? light : silver));
      }
      const balls=Array.from({length:42},(_,i)=> {const ball=new THREE.Mesh(sphere,i%4===0 ? light : silver);system.add(ball);return ball;});
      let width=1,height=1,visible=true,redraw=true;
      const resize=()=> {width=container.clientWidth;height=container.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();redraw=true;};
      const size=new ResizeObserver(resize);size.observe(container);resize();
      const visibility=new IntersectionObserver(entries=> {visible=entries[0].isIntersecting;});visibility.observe(container);
      let frame=0,last=0,time=0,p=still ? .82 : progress.get(),replay=controls.current.replayKey;
      const render=(now: number)=> {
        if(stopped) return;
        const delta=last ? (now-last)/1000 : 0;last=now;
        if(!visible || document.hidden) {frame=requestAnimationFrame(render);return;}
        if(replay!==controls.current.replayKey) {replay=controls.current.replayKey;time=0;redraw=true;}
        if(!still && !controls.current.paused) time+=delta*.22;
        p+=((still ? .82 : progress.get())-p)*.075;
        if(still && !redraw) {frame=requestAnimationFrame(render);return;}
        const mobile=width<700,close=Math.sin(p*Math.PI);
        const cross=THREE.MathUtils.smoothstep(p,.23,.33)*(1-THREE.MathUtils.smoothstep(p,.57,.7));
        system.position.set(mobile ? 0 : 2.6-cross*5.8,mobile ? -1.5 : .1,0);
        system.rotation.set(-.35+p*.22,-.5+p*1.2,-.2+Math.sin(p*Math.PI*2)*.16);
        system.scale.setScalar(mobile ? .85 : 1);
        layers.forEach((layer,i)=> {const spread=1-p;layer.position.set(Math.sin(i*2.4)*spread*.9,Math.cos(i*1.7)*spread*.4,(1.5-i)*(.24+spread*1.2));layer.rotation.set(spread*Math.sin(i)*.2,spread*Math.cos(i)*.35,spread*(i%2===0 ? -.14 : .14));});
        orbit.rotation.y=p*1.4+time*.18;orbit.scale.setScalar(1-close*.35);
        balls.forEach((ball,i)=> {const t=i/balls.length,a=t*Math.PI*7+p*5+time,r=(1-p)*2.8+.5;ball.position.set(Math.cos(a)*r,(t-.5)*(7-p*3),Math.sin(a)*r);ball.scale.setScalar(.04+Math.sin(i*3.4)**2*.055);});
        camera.position.set(Math.sin(p*Math.PI)*.8,1.2-p*.8,mobile ? 16 : 13-close*1.8);camera.lookAt(0,mobile ? .1 : .2,0);
        renderer.render(scene,camera);redraw=false;
        container.dataset.phase=still ? "still" : controls.current.paused ? "paused" : "rotating";
        container.dataset.animationTime=time.toFixed(3);
        frame=requestAnimationFrame(render);
      };
      frame=requestAnimationFrame(render);setReady(true);
      cleanup=()=> {cancelAnimationFrame(frame);size.disconnect();visibility.disconnect();logoImage.onload=null;logoTexture.dispose();logoMaterial.dispose();geometries.forEach(g=>g.dispose());[blue,silver,dark,light].forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>{});
    return ()=> {stopped=true;cleanup();};
  },[progress,still]);
  return <div className={`dhi-film-visual ${ready ? "is-ready" : ""}`} aria-hidden="true"><div className="dhi-film-fallback"><div /><div /><div /></div><div ref={host} className="dhi-webgl" /></div>;
}

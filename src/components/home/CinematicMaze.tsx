"use client";

import { useEffect,useRef,useState } from "react";
import type { MotionValue } from "framer-motion";
import { MAZE_DOT_BOUNDS,MAZE_GATE_HALF,MAZE_LOGO,MAZE_WALLS,createMazeSequence,mazeDestination } from "@/lib/maze-sequence";
import { DHI_D_BOUNDS,DHI_D_CENTRE,DHI_D_OUTLINE } from "@/lib/dhi-d-outline";

export default function CinematicMaze({progress,still,paused,replayKey}: {progress:MotionValue<number>;still:boolean;paused:boolean;replayKey:number}) {
  const host=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false);
  const controls=useRef({paused,replayKey});controls.current={paused,replayKey};
  useEffect(()=> {
    let stopped=false,cleanup=()=>{};
    void import("three").then(THREE=> {
      if(stopped || !host.current) return;
      const container=host.current;
      let choreography=createMazeSequence(Math.floor(Math.random()*4294967296));
      let renderer:InstanceType<typeof THREE.WebGLRenderer>;
      try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});} catch {return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0x06111c,1);
      renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
      container.appendChild(renderer.domElement);
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,60);
      scene.add(new THREE.HemisphereLight(0xd1efff,0x061329,2.6));
      const key=new THREE.DirectionalLight(0xe2f7ff,4);key.position.set(-3,5,8);scene.add(key);
      const fill=new THREE.PointLight(0x69d2ff,32,18);fill.position.set(5,-2,5);scene.add(fill);
      const rim=new THREE.DirectionalLight(0x148eff,2);rim.position.set(2,4,-3);scene.add(rim);

      // Studio reflections keep the rolling marbles legible against the blue tracks.
      const envCanvas=document.createElement("canvas");envCanvas.width=512;envCanvas.height=256;
      const envContext=envCanvas.getContext("2d");
      if(envContext) {
        envContext.fillStyle="#123258";envContext.fillRect(0,0,512,256);
        envContext.fillStyle="#d6edff";envContext.fillRect(20,16,170,80);
        envContext.fillStyle="#789fc0";envContext.fillRect(290,0,90,130);
        envContext.fillStyle="#051426";envContext.fillRect(0,145,512,111);
        envContext.fillStyle="#ffffff";envContext.fillRect(410,50,46,70);
      }
      const envTexture=new THREE.CanvasTexture(envCanvas);envTexture.mapping=THREE.EquirectangularReflectionMapping;
      const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromEquirectangular(envTexture);
      scene.environment=environment.texture;

      const blue=new THREE.MeshPhysicalMaterial({color:0x0874c7,metalness:.48,roughness:.29,clearcoat:1,envMapIntensity:.65});
      const floorMaterial=new THREE.MeshPhysicalMaterial({color:0x063772,metalness:.36,roughness:.35,clearcoat:.8,envMapIntensity:.45});
      const edgeMaterial=new THREE.MeshPhysicalMaterial({color:0x0759ac,metalness:.5,roughness:.27,clearcoat:1});
      const marbleMaterials=MAZE_DOT_BOUNDS.map(()=>new THREE.MeshPhysicalMaterial({color:0xd9ecf4,metalness:.87,roughness:.12,clearcoat:1,envMapIntensity:1.5}));
      const shadowMaterial=new THREE.MeshBasicMaterial({color:0x000b21,transparent:true,opacity:.32,depthWrite:false});
      const geometries:InstanceType<typeof THREE.BufferGeometry>[]=[];
      const display=new THREE.Group(),board=new THREE.Group();scene.add(display);display.add(board);
      display.rotation.x=-.62;

      const baseGeometry=new THREE.CylinderGeometry(2.88,2.85,.20,112);baseGeometry.rotateX(Math.PI/2);baseGeometry.translate(0,0,-.005);geometries.push(baseGeometry);
      board.add(new THREE.Mesh(baseGeometry,floorMaterial));
      const rimProfile=[new THREE.Vector2(2.72,.095),new THREE.Vector2(2.72,.23),new THREE.Vector2(2.74,.25),new THREE.Vector2(2.85,.25),new THREE.Vector2(2.88,.22),new THREE.Vector2(2.88,-.06)];
      const rimGeometry=new THREE.LatheGeometry(rimProfile,112);rimGeometry.rotateX(Math.PI/2);geometries.push(rimGeometry);
      board.add(new THREE.Mesh(rimGeometry,edgeMaterial));
      MAZE_WALLS.forEach(({radius,gates})=> gates.forEach((gate,index)=> {
        const half=.065,start=gate+MAZE_GATE_HALF;
        const end=(gates[index+1] ?? gates[0]+Math.PI*2)-MAZE_GATE_HALF;
        const shape=new THREE.Shape();
        shape.absarc(0,0,radius+half,start,end,false);
        shape.lineTo((radius-half)*Math.cos(end),(radius-half)*Math.sin(end));
        shape.absarc(0,0,radius-half,end,start,true);shape.closePath();
        const geometry=new THREE.ExtrudeGeometry(shape,{depth:.14,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,steps:1,curveSegments:72});
        geometry.translate(0,0,.115);geometries.push(geometry);board.add(new THREE.Mesh(geometry,blue));
      }));

      // The complete brand remains fixed. Marbles roll into the original nine
      // dot positions to the left of the raised D.
      const collector=new THREE.Group();board.add(collector);
      const dShape=new THREE.Shape();
      DHI_D_OUTLINE.forEach(([x,y],index)=> {
        const px=(x-DHI_D_CENTRE[0])*2/569,py=(DHI_D_CENTRE[1]-y)*2/569;
        if(index===0) dShape.moveTo(px,py);else dShape.lineTo(px,py);
      });
      dShape.closePath();
      const dGeometry=new THREE.ExtrudeGeometry(dShape,{depth:.055,bevelEnabled:true,bevelSize:.009,bevelThickness:.009,bevelSegments:3,steps:1});
      dGeometry.translate(0,0,.116);geometries.push(dGeometry);
      const dMaterial=new THREE.MeshPhysicalMaterial({color:0xa5efff,metalness:.28,roughness:.27,clearcoat:1,envMapIntensity:.65});
      collector.add(new THREE.Mesh(dGeometry,dMaterial));
      const trayGeometry=new THREE.CylinderGeometry(.43,.43,.01,64);trayGeometry.rotateX(Math.PI/2);geometries.push(trayGeometry);
      const trayMaterial=new THREE.MeshPhysicalMaterial({color:0x063772,metalness:.25,roughness:.4,transparent:true,opacity:.9,depthWrite:false});
      const tray=new THREE.Mesh(trayGeometry,trayMaterial);tray.position.set(-.10,0,.096);collector.add(tray);

      const socketGeometry=new THREE.CircleGeometry(1,24);geometries.push(socketGeometry);
      const socketMaterial=new THREE.MeshBasicMaterial({color:0x001b3d,transparent:true,opacity:.5,depthWrite:false});
      const sockets=MAZE_DOT_BOUNDS.map((_,index)=> {
        const target=mazeDestination(index),socket=new THREE.Mesh(socketGeometry,socketMaterial);
        socket.position.set(target.x,target.y,.103);socket.scale.setScalar(target.radius*1.24);socket.visible=false;board.add(socket);return socket;
      });
      const impactGeometry=new THREE.RingGeometry(.065,.082,32);geometries.push(impactGeometry);
      const impactMaterials=Array.from({length:3},()=>new THREE.MeshBasicMaterial({color:0xc0f4ff,transparent:true,opacity:0,depthWrite:false,toneMapped:false}));
      const impacts=impactMaterials.map(material=>{const mesh=new THREE.Mesh(impactGeometry,material);mesh.position.z=.105;board.add(mesh);return mesh;});

      const sphereGeometry=new THREE.SphereGeometry(1,24,16);geometries.push(sphereGeometry);
      const shadowGeometry=new THREE.CircleGeometry(1,24);geometries.push(shadowGeometry);
      const marbles=marbleMaterials.map(material=> {
        const mesh=new THREE.Mesh(sphereGeometry,material),shadow=new THREE.Mesh(shadowGeometry,shadowMaterial);
        shadow.position.z=.099;board.add(mesh,shadow);return {mesh,shadow};
      });

      let width=1,height=1,visible=true,redraw=true,logoReady=false;
      const logoCanvas=document.createElement("canvas");logoCanvas.width=569;logoCanvas.height=325;
      const logoTexture=new THREE.CanvasTexture(logoCanvas);logoTexture.colorSpace=THREE.SRGBColorSpace;
      const logoMaterial=new THREE.MeshBasicMaterial({map:logoTexture,transparent:true,depthWrite:false,toneMapped:false,opacity:0});
      const logoGeometry=new THREE.PlaneGeometry(MAZE_LOGO.width,MAZE_LOGO.height);geometries.push(logoGeometry);
      const logo=new THREE.Mesh(logoGeometry,logoMaterial);logo.position.set(0,MAZE_LOGO.y,.105);board.add(logo);
      const logoImage=new window.Image();
      logoImage.onload=()=> {
        if(stopped) return;
        const ctx=logoCanvas.getContext("2d");if(!ctx) return;
        ctx.drawImage(logoImage,0,0,569,325,0,0,569,325);
        const pixels=ctx.getImageData(0,0,569,325);
        for(let i=0;i<pixels.data.length;i+=4) {
          const red=pixels.data[i],blue=pixels.data[i+2];
          if(blue-red<=18 || blue<=38 || red>=165) pixels.data[i+3]=0;
          else {pixels.data[i]=165;pixels.data[i+1]=239;pixels.data[i+2]=255;}
        }
        ctx.putImageData(pixels,0,0);
        // The nine actual spheres replace the nine printed pixels in the original logo.
        MAZE_DOT_BOUNDS.forEach(([x0,y0,x1,y1])=>ctx.clearRect(x0-1,y0-1,x1-x0+2,y1-y0+2));
        const [dLeft,dTop,dRight,dBottom]=DHI_D_BOUNDS;
        ctx.clearRect(dLeft-1,dTop-1,dRight-dLeft+2,dBottom-dTop+2);
        ctx.clearRect(0,250,90,75);ctx.clearRect(490,250,79,75);
        logoTexture.needsUpdate=true;logoReady=true;redraw=true;container.dataset.mazeLogoReady="true";
      };
      logoImage.src="/images/dhisoft-logo.png";
      const resize=()=> {width=container.clientWidth;height=container.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();redraw=true;};
      const size=new ResizeObserver(resize);size.observe(container);resize();
      const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});visibility.observe(container);
      let frame=0,last=0,time=0,p=progress.get(),replay=controls.current.replayKey,previousCycleTime=-1;
      const previousPositions=marbles.map(()=>new THREE.Vector2());
      const previouslyActive=marbles.map(()=>false);
      const rollAxis=new THREE.Vector3(),roll=new THREE.Quaternion();
      const silver=new THREE.Color(0xd9ecf4),cyan=new THREE.Color(0xa5efff);
      const render=(now:number)=> {
        if(stopped) return;
        const delta=last ? Math.min((now-last)/1000,.08) : 0;last=now;
        if(!visible || document.hidden) {frame=requestAnimationFrame(render);return;}
        if(replay!==controls.current.replayKey) {replay=controls.current.replayKey;time=0;previousCycleTime=-1;choreography=createMazeSequence(Math.floor(Math.random()*4294967296));redraw=true;}
        if(!still && !controls.current.paused && logoReady) time+=delta;
        p+=((still ? 0 : progress.get())-p)*.08;
        if(still && !redraw) {frame=requestAnimationFrame(render);return;}
        let cycleTime=time,resetRoll=previousCycleTime<0;
        if(time>=choreography.cycle) {
          time=0;cycleTime=0;resetRoll=true;
          choreography=createMazeSequence(Math.floor(Math.random()*4294967296));
        }
        const pose=choreography.sampleMazeSequence(time,still);
        marbles.forEach(({mesh,shadow},index)=> {
          const marble=pose.marbles[index];
          const previous=previousPositions[index],dx=marble.x-previous.x,dy=marble.y-previous.y;
          const distance=Math.hypot(dx,dy);
          if(resetRoll || !previouslyActive[index]) mesh.quaternion.identity();
          else if(distance>1e-8) {
            rollAxis.set(-dy/distance,dx/distance,0);
            roll.setFromAxisAngle(rollAxis,distance/marble.radius);mesh.quaternion.premultiply(roll);
          }
          previous.set(marble.x,marble.y);
          previouslyActive[index]=marble.active;
          mesh.visible=marble.active&&marble.scale>0;shadow.visible=mesh.visible;
          mesh.position.set(marble.x,marble.y,.099+marble.radius+marble.z);
          const size=marble.radius*marble.scale;
          mesh.scale.set(size*(1+marble.impact*.12),size*(1+marble.impact*.12),size*(1-marble.impact*.20));
          shadow.position.set(marble.x+.018,marble.y-.012,.104+marble.z);shadow.scale.set(size*1.2,size*.9,1);
          marbleMaterials[index].color.copy(silver).lerp(cyan,marble.docked ? 1 : 0);
        });
        previousCycleTime=cycleTime;
        const c=pose.collector;
        collector.position.set(c.x,c.y,c.lift);collector.rotation.z=c.angle;collector.scale.set(c.scale,c.scale,1);
        trayMaterial.opacity=.9*(1-pose.logo);
        sockets.forEach(socket=>{socket.visible=c.progress===1;});
        impacts.forEach((mesh,index)=> {
          const impact=pose.impacts[index];mesh.visible=Boolean(impact);
          if(impact) {mesh.position.set(impact.x,impact.y,.105);mesh.scale.setScalar(1+impact.age*2.3);impactMaterials[index].opacity=.7*(1-impact.age);}
        });
        logoMaterial.opacity=pose.logo;logo.position.z=.105+pose.logo*.016;
        const compact=width<1000,mobile=width<700;
        const cross=THREE.MathUtils.smoothstep(p,.23,.33)*(1-THREE.MathUtils.smoothstep(p,.57,.7));
        const compactScale=Math.min(mobile ? .65 : .8,Math.max(.43,(height-380)/570),width/height*1.28);
        display.scale.setScalar(compact ? compactScale*.9 : .88);
        display.position.set(compact ? 0 : 3.1-cross*6.2,compact ? -1.5 : -.05,0);
        board.rotation.set(pose.pitch,pose.yaw,0);
        camera.position.set(0,.45,compact ? 13.2 : 12.6);camera.lookAt(0,.1,0);
        renderer.domElement.style.opacity=String(pose.fade);
        renderer.render(scene,camera);redraw=false;
        container.dataset.physics="shared-gravity";container.dataset.phase=still ? "still" : controls.current.paused ? "paused" : pose.phase;
        container.dataset.movingMarbles=String(pose.marbles.filter(m=>!m.docked&&Math.hypot(m.vx,m.vy)>.025).length);
        container.dataset.marbleCount=String(pose.marbles.filter(m=>m.active).length);container.dataset.docked=String(pose.marbles.filter(m=>m.docked).length);
        container.dataset.collisionCount=String(pose.collision);container.dataset.collectorProgress=c.progress.toFixed(3);
        container.dataset.animationTime=time.toFixed(3);container.dataset.pitch=pose.pitch.toFixed(3);
        container.dataset.yaw=pose.yaw.toFixed(3);container.dataset.motionStage=pose.stage;
        container.dataset.ringCount=String(MAZE_WALLS.length);container.dataset.openingsPerRing=String(MAZE_WALLS[0].gates.length);container.dataset.relayStep=String(pose.relayStep);container.dataset.activeRing=String(pose.activeRing);container.dataset.tiltDirection=pose.direction;
        container.dataset.downhillX=pose.downhillX.toFixed(3);container.dataset.downhillY=pose.downhillY.toFixed(3);
        frame=requestAnimationFrame(render);
      };
      frame=requestAnimationFrame(render);setReady(true);
      cleanup=()=> {
        cancelAnimationFrame(frame);size.disconnect();visibility.disconnect();logoImage.onload=null;
        geometries.forEach(g=>g.dispose());marbleMaterials.forEach(m=>m.dispose());
        blue.dispose();floorMaterial.dispose();edgeMaterial.dispose();shadowMaterial.dispose();logoMaterial.dispose();logoTexture.dispose();
        dMaterial.dispose();trayMaterial.dispose();socketMaterial.dispose();impactMaterials.forEach(m=>m.dispose());
        environment.dispose();pmrem.dispose();envTexture.dispose();renderer.dispose();renderer.domElement.remove();
      };
    }).catch(()=>{});
    return ()=>{stopped=true;cleanup();};
  },[progress,still]);
  return <div className={`dhi-film-visual ${ready ? "is-ready" : ""}`} aria-hidden="true">
    {/* Static final frame also covers devices without WebGL. */}
    <div className="dhi-maze-fallback"><img src="/media/maze-poster.png" alt="" width="720" height="540" /></div>
    <div ref={host} className="dhi-webgl" />
  </div>;
}

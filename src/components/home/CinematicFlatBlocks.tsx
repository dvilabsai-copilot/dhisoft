"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { BUILDING_BLOCK, TETRIS_PIECES } from "./building-block-layout";

const columns = 6, rows = 8;
const { faceSize, spacing, bevel, cornerRadius } = BUILDING_BLOCK;
const tileSize = faceSize + bevel * 2;
const boardWidth = columns * spacing, boardHeight = rows * spacing;
const projectionX = .82, projectionY = .22;
const projectedWidth = boardWidth * projectionX * 2;
const projectedHeight = boardHeight + boardWidth * projectionY;
const frontPalette = ["#096bb5", "#0877c4", "#0862aa", "#0c80c8", "#0969b2", "#0a75bb"];
const rightPalette = ["#0c83cb", "#0a8ad3", "#0a76bd", "#1196d8", "#0a80c6", "#0b89cc"];
const panels = [
  { side: "front", delay: 0, step: .88, palette: frontPalette },
  { side: "right", delay: .36, step: .94, palette: rightPalette },
] as const;
const buildTime = panels[1].delay + TETRIS_PIECES.length * panels[1].step;
const cycleTime = buildTime + 6.5;

export default function CinematicFlatBlocks({ progress, still, paused, replayKey }: { progress: MotionValue<number>; still: boolean; paused: boolean; replayKey: number }) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef({ paused, replayKey });
  controls.current = { paused, replayKey };
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    container.appendChild(canvas);
    let stopped = false, visible = true, redraw = true, logoReady = false;
    let width = 1, height = 1, ratio = 1;
    const inkCanvas = document.createElement("canvas");
    inkCanvas.width = 768; inkCanvas.height = 1024;
    const logoImage = new window.Image();
    logoImage.onload = () => {
      if (stopped) return;
      const ink = inkCanvas.getContext("2d");
      if (!ink) return;
      const w = 720, h = w * 325 / 569;
      ink.drawImage(logoImage, 0, 0, 569, 325, (768-w)/2, (1024-h)/2, w, h);
      const pixels = ink.getImageData(0, 0, 768, 1024);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i], blue = pixels.data[i+2];
        if (blue-red <= 18 || blue <= 38 || red >= 165) pixels.data[i+3] = 0;
        else { pixels.data[i] = 165; pixels.data[i+1] = 239; pixels.data[i+2] = 255; }
      }
      ink.putImageData(pixels, 0, 0);
      logoReady = true; redraw = true; container.dataset.blockLogoReady = "true";
    };
    logoImage.src = "/images/dhisoft-logo.png";

    const resize = () => {
      width = container.clientWidth; height = container.clientHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      redraw = true;
    };
    const size = new ResizeObserver(resize); size.observe(container); resize();
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    visibility.observe(container);
    let frame = 0, last = 0, elapsed = 0, p = progress.get(), replay = controls.current.replayKey;

    const render = (now: number) => {
      if (stopped) return;
      const delta = last ? Math.min((now-last)/1000, .1) : 0; last = now;
      if (!visible || document.hidden) { frame = requestAnimationFrame(render); return; }
      if (replay !== controls.current.replayKey) { replay = controls.current.replayKey; elapsed = 0; redraw = true; }
      if (!still && !controls.current.paused && logoReady) elapsed += delta;
      const target = still ? 0 : progress.get(); p += (target-p)*.09;
      if (still && !redraw) { frame = requestAnimationFrame(render); return; }
      const t = still ? buildTime+2 : elapsed % cycleTime;
      const clearTime = t-buildTime-4.5;
      container.dataset.phase = still ? "still" : controls.current.paused ? "paused" : clearTime > 0 ? "clearing" : t >= buildTime ? "logo" : "dropping";
      container.dataset.animationTime = elapsed.toFixed(3);
      container.dataset.logoFaces = "front right";
      container.dataset.renderer = "flat-2d";
      const mobile = width < 700, compact = width < 1000;
      const smooth = (a: number, b: number) => { const x = Math.max(0, Math.min(1, (p-a)/(b-a))); return x*x*(3-2*x); };
      const cross = smooth(.23,.33)*(1-smooth(.57,.7));
      const unit = compact
        ? Math.min(width*(mobile ? .88 : .7)/projectedWidth, Math.max(28,(height-(mobile ? 390 : 510))/projectedHeight))
        : Math.min(height/7.4, width*.4/projectedWidth);
      const originX = compact ? width/2 : width*(.75-.5*cross);
      const originY = compact ? height-96-boardHeight/2*unit : height*.53;
      context.setTransform(ratio,0,0,ratio,0,0);
      context.fillStyle = "#06111c"; context.fillRect(0,0,width,height);

      panels.forEach(panel => {
        const right = panel.side === "right";
        context.save();
        context.translate(originX,originY); context.scale(unit,unit);
        // Two affine-projected 2D boards. There are no extruded cubes, roof or interior.
        if (!right) context.translate(-boardWidth*projectionX,-boardWidth*projectionY);
        context.transform(projectionX,right ? -projectionY : projectionY,0,1,0,0);
        const landed = still ? TETRIS_PIECES.length : Math.max(0,Math.min(TETRIS_PIECES.length,Math.floor((t-panel.delay)/panel.step)));
        container.dataset[right ? "landedRight" : "landedFront"] = String(landed);
        TETRIS_PIECES.forEach((piece,index) => {
          const local = (t-panel.delay-index*panel.step)/panel.step;
          if (!still && local < 0) return;
          const fall = still ? 1 : Math.max(0,Math.min(1,local/.78));
          // Mirror the right-hand pieces so the two boards have independent silhouettes.
          const cells = piece.map(([x,y]) => [right ? columns-1-x : x,y] as const);
          const cx = cells.reduce((sum,[x]) => sum+x,0)/cells.length;
          const cy = cells.reduce((sum,[,y]) => sum+y,0)/cells.length;
          context.save();
          context.translate((cx+.5)*spacing, (rows-1-cy+.5)*spacing-boardHeight/2-(1-fall*fall*fall)*7);
          context.rotate((1-fall)*(index%2 ? -.13 : .13));
          cells.forEach(([x,y]) => {
            const clear = clearTime > 0 ? Math.max(0,Math.min(1,(clearTime-y*.1)/.3)) : 0;
            if (clear >= 1) return;
            context.save();
            context.translate((x-cx)*spacing,(cy-y)*spacing); context.scale(1-clear,1-clear);
            context.beginPath(); context.roundRect(-tileSize/2,-tileSize/2,tileSize,tileSize,cornerRadius);
            context.fillStyle = panel.palette[index%panel.palette.length]; context.fill(); context.clip();
            if (logoReady) {
              const half = tileSize/spacing/2;
              context.drawImage(inkCanvas, (x+.5-half)/columns*768, (rows-y-.5-half)/rows*1024,
                tileSize/boardWidth*768,tileSize/boardHeight*1024,-tileSize/2,-tileSize/2,tileSize,tileSize);
            }
            context.restore();
          });
          context.restore();
        });
        context.restore();
      });
      redraw = false;
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render); setReady(true);
    return () => { stopped = true; cancelAnimationFrame(frame); size.disconnect(); visibility.disconnect(); logoImage.onload = null; canvas.remove(); };
  }, [progress,still]);

  return <div className={`dhi-film-visual ${ready ? "is-ready" : ""}`} aria-hidden="true">
    <div className="dhi-film-fallback"><div /><div /><div /></div>
    <div ref={host} className="dhi-webgl" />
  </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import dynamic from "next/dynamic";
import { nextHeroVariant, resolveHeroVariant, type HeroVariant } from "@/lib/hero-variant";
import "./cinematic-hero.css";

const BlocksAnimation = dynamic(() => import("./CinematicSystem"), { ssr: false });
const BallsAnimation = dynamic(() => import("./CinematicBalls"), { ssr: false });
const RubikAnimation = dynamic(() => import("./CinematicRubik"), { ssr: false });
const FlatBlocksAnimation = dynamic(() => import("./CinematicFlatBlocks"), { ssr: false });
const MazeAnimation = dynamic(() => import("./CinematicMaze"), { ssr: false });

const chapters = [
  { title: ["Big ideas.", "Working software."], text: "DHISOFT is a custom software development company in Hyderabad, India. We build SaaS products, booking platforms and workflow software.", name: "The challenge" },
  { title: ["Every part.", "Working together."], text: "People, processes, data and integrations. We design the connections that make the whole system work.", name: "The connection" },
  { title: ["Built to work.", "Ready to evolve."], text: "From your first useful release to the next stage of growth. One engineering partner, from idea to operation.", name: "The product" },
];

function StoryCopy({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, index === 0 ? [0, .21, .31] : index === 1 ? [.23, .33, .57, .67] : [.59, .7, 1], index === 0 ? [1, 1, 0] : index === 1 ? [0, 1, 1, 0] : [0, 1, 1]);
  const y = useTransform(opacity, [0, 1], [70, 0]);
  const chapter = chapters[index];
  return <motion.div className={`dhi-story-copy dhi-story-copy-${index}`} style={{ opacity, y }} aria-hidden={index > 0 ? true : undefined}>
    {index === 0 ? <h1>{chapter.title.map(line => <span key={line}>{line}</span>)}</h1> : <h2>{chapter.title.map(line => <span key={line}>{line}</span>)}</h2>}
    <p>{chapter.text}</p>
  </motion.div>;
}

export default function CinematicHero() {
  const [variant, setVariant] = useState<HeroVariant | null>(null);
  const [paused, setPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const root = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const selectVariant = () => {
      setVariant(resolveHeroVariant(window.location.search));
      setPaused(false);
      setReplayKey(0);
    };
    selectVariant();
    window.addEventListener("popstate", selectVariant);
    return () => window.removeEventListener("popstate", selectVariant);
  }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect();
      const header = document.querySelector(".ed-header")?.getBoundingClientRect().height ?? 80;
      const distance = rect.height - (window.innerHeight - header);
      scrollYProgress.set(reduceMotion || distance <= 0 ? 0 : Math.max(0, Math.min(1, (header - rect.top) / distance)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, [reduceMotion, scrollYProgress]);
  const goToChapter = (index: number) => {
    if (!root.current) return;
    const top = root.current.getBoundingClientRect().top + window.scrollY;
    const header = document.querySelector(".ed-header")?.getBoundingClientRect().height ?? 80;
    window.scrollTo({ top: top - header + (root.current.offsetHeight - window.innerHeight + header) * [0, .45, .95][index], behavior: reduceMotion ? "instant" : "smooth" });
  };
  const nextAnimation = () => {
    if (!variant) return;
    const next = nextHeroVariant(variant);
    setVariant(next);
    setPaused(false);
    setReplayKey(0);
    const url = new URL(window.location.href);
    url.searchParams.set("show", next);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };
  return <section ref={root} className="dhi-cinema" data-hero-variant={variant ?? "loading"} aria-label="From complexity to a connected product">
    <div className="dhi-cinema-sticky">
      {variant === "3dBlocks" && <BlocksAnimation progress={scrollYProgress} still={Boolean(reduceMotion)} paused={paused} replayKey={replayKey} />}
      {variant === "balls" && <BallsAnimation progress={scrollYProgress} still={Boolean(reduceMotion)} paused={paused} replayKey={replayKey} />}
      {variant === "rubik" && <RubikAnimation progress={scrollYProgress} still={Boolean(reduceMotion)} paused={paused} replayKey={replayKey} />}
      {variant === "blocks" && <FlatBlocksAnimation progress={scrollYProgress} still={Boolean(reduceMotion)} paused={paused} replayKey={replayKey} />}
      {variant === "maze" && <MazeAnimation progress={scrollYProgress} still={Boolean(reduceMotion)} paused={paused} replayKey={replayKey} />}
      <div className="dhi-block-controls" aria-label="Hero animation controls">
        <button type="button" disabled={!variant} onClick={() => setPaused(value => !value)} aria-label={paused ? "Play hero animation" : "Pause hero animation"}>{paused ? <Play size={15} /> : <Pause size={15} />}<span>{paused ? "Play" : "Pause"}</span></button>
        <button className="dhi-next-animation" type="button" disabled={!variant} onClick={nextAnimation} aria-label={`Show next animation (${variant ? nextHeroVariant(variant) : "balls"})`}><SkipForward size={15} /><span>Next</span></button>
        <button type="button" disabled={!variant} onClick={() => { setReplayKey(value => value + 1); setPaused(false); }} aria-label="Replay hero animation"><RotateCcw size={15} /><span>Replay</span></button>
        <span className="sr-only" role="status">{variant ? `Showing ${variant} animation` : ""}</span>
      </div>
      <div className="dhi-cinema-body ed-container">
        <div className="dhi-cinema-intro">
          <div className="dhi-copy-stage">{chapters.map((_, index) => <StoryCopy key={index} index={index} progress={scrollYProgress} />)}</div>
          <a className="dhi-cinema-cta" href="#contact">Discuss your project <ArrowUpRight size={18} aria-hidden="true" /></a>
          <button className="dhi-film-scroll" type="button" onClick={() => goToChapter(1)}>Scroll to connect <ArrowDown size={16} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="dhi-cinema-bottom ed-container">
        <div className="dhi-chapter-nav" aria-label="Explore the story">{chapters.map((chapter, index) => <button type="button" key={chapter.name} onClick={() => goToChapter(index)}>{chapter.name}</button>)}</div>
        <a className="dhi-scroll-cue" href="#work">Explore our work <ArrowDown size={16} aria-hidden="true" /></a>
      </div>
      <motion.div className="dhi-cinema-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </div>
    <div className="sr-only"><p>{variant === "maze" ? "Each ring has one staggered opening. Eight loose marbles roll under the same board gravity, with momentum, wall contact and marble collisions. The inner pair follows the same route into D; each marble stays fixed only after rolling into a dot pocket. One dot starts filled, and all nine complete the fixed DHI SOFT logo." : variant === "blocks" ? "Flat Tetris pieces fall separately onto two faces meeting at a corner. DHI SOFT assembles across the squares on each face." : variant === "3dBlocks" ? "Falling building blocks assemble into a solid 3D structure. Each cube carries part of DHI SOFT, building the logo across both the front and right faces as it lands." : variant === "rubik" ? "A Rubik-style cube twists and aligns. DHI SOFT spans the squares of its two visible faces." : "Software layers, connecting orbits and rotating spheres form a connected system."}</p><p>{chapters[1].text}</p><p>{chapters[2].text}</p></div>
  </section>;
}

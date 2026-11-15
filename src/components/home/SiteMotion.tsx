"use client";

import { useEffect, useRef } from "react";

const REVEAL_SELECTOR = [
  ".ed-section-heading > div",
  ".ed-section-heading > p",
  ".ed-index-item",
  ".ed-stage",
  ".ed-info-card",
  ".ed-domain-card",
  ".ed-process-steps > li",
  ".ed-pricing-card",
  ".ed-contact-form",
  ".ed-footer-grid > div",
  ".ed-footer-wordmark",
  ".ed-sub-hero h1",
  ".ed-sub-hero > .ed-container > p",
  ".ed-sub-section h2",
  ".ed-service-link",
  ".ed-service-story > div",
  ".ed-sub-work",
  ".ed-sub-contact-grid > div",
].join(",");

export default function SiteMotion() {
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ed");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    let observer: IntersectionObserver | undefined;

    if (!reduceMotion && revealElements.length && "IntersectionObserver" in window) {
      const siblingIndexes = new Map<Element, number>();
      revealElements.forEach((element) => {
        const parent = element.parentElement;
        const index = parent ? siblingIndexes.get(parent) ?? 0 : 0;
        if (parent) siblingIndexes.set(parent, index + 1);
        element.style.setProperty("--ed-stagger", `${Math.min(index, 7) * 70}ms`);
        element.classList.add("ed-reveal");
      });

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

      revealElements.forEach((element) => observer?.observe(element));
      root.classList.add("ed-motion-ready");
    }

    const glow = glowRef.current;
    const pointerFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const lowPower = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2;
    if (reduceMotion || !pointerFine || lowPower || !glow) {
      return () => {
        observer?.disconnect();
        root.classList.remove("ed-motion-ready");
      };
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    let lastFrameTime = 0;
    let active = false;

    const paint = () => {
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    };

    const animate = (time: number) => {
      const elapsed = lastFrameTime ? time - lastFrameTime : 16;
      const weight = 1 - Math.exp(-elapsed / 32);
      lastFrameTime = time;
      currentX += (targetX - currentX) * weight;
      currentY += (targetY - currentY) * weight;
      paint();

      if (Math.abs(targetX - currentX) > 0.35 || Math.abs(targetY - currentY) > 0.35) {
        frame = window.requestAnimationFrame(animate);
      } else {
        frame = 0;
        lastFrameTime = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) {
        currentX = targetX;
        currentY = targetY;
        paint();
        active = true;
        glow.classList.add("is-active");
        return;
      }
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const onPointerLeave = () => {
      active = false;
      glow.classList.remove("is-active");
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastFrameTime = 0;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") onPointerLeave();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer?.disconnect();
      root.classList.remove("ed-motion-ready");
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <span ref={glowRef} className="ed-pointer-glow" aria-hidden="true" />;
}

"use client";

import React, { useEffect, useRef } from "react";
import { heroContent } from "@/data/content";

export default function SmallRobotSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const srSection = sectionRef.current;
    const canvas = canvasRef.current;
    if (!srSection || !canvas) return;

    const copy = heroContent.smallRobot;
    const style = srSection.style;
    const finePointer = window.matchMedia("(pointer: fine)");

    const SR = {
      scene: "/assets/robot.splinecode",
      turn: 0.44,
      tilt: 0.07,
      tau: 0.32,
    };

    let app: any = null,
      head: any = null,
      loading = false,
      running = false;
    let raf: number | null = null,
      active = false,
      entry = 0,
      entryT = 0,
      lastT = 0;
    let mx = 0,
      mxTarget = 0;

    const step = (now: number) => {
      const dt = lastT ? Math.min((now - lastT) / 1000, 0.25) : 0.016;
      lastT = now;

      entry += (entryT - entry) * (1 - Math.exp(-dt / 0.5));
      if (Math.abs(entryT - entry) < 0.002) entry = entryT;
      style.setProperty("--srIn", entry.toFixed(4));

      mx += (mxTarget - mx) * (1 - Math.exp(-dt / SR.tau));
      if (Math.abs(mxTarget - mx) < 0.0008) mx = mxTarget;
      if (head) {
        head.rotation.y = -mx * SR.turn;
        head.rotation.z = mx * SR.turn * SR.tilt;
      }

      if (!active || (entry === entryT && mx === mxTarget)) {
        lastT = 0;
        raf = null;
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (raf === null) raf = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      const r = srSection.getBoundingClientRect();
      mxTarget = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      kick();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const mountRobot = async () => {
      if (loading || app || !canvas) return;
      loading = true;
      try {
        const importCdn = new Function("url", "return import(url)");
        const { Application } = await importCdn(
          "https://cdn.spline.design/@splinetool/runtime@2.0.13/build/runtime.js"
        );
        app = new Application(canvas);
        await app.load(SR.scene);
        if (app.setGlobalEvents) app.setGlobalEvents(false);
        head = app.findObjectByName ? app.findObjectByName("Cabeza") : null;
        if (head) head.rotation.y = 0;
        running = true;
        srSection.classList.add("is-robot-ready");
        (window as any).__rbSmall = { app, head };
        kick();
      } catch {
        loading = false;
        kick();
      }
    };

    const nearSr = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          mountRobot();
          nearSr.disconnect();
        }
      },
      { rootMargin: "120% 0px" }
    );
    nearSr.observe(srSection);

    const visSr = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          active = en.isIntersecting && en.intersectionRatio > 0.02;
          if (active) {
            entryT = 1;
            if (app && !running) {
              app.play();
              running = true;
            }
          } else if (app && running) {
            app.stop();
            running = false;
          }
          kick();
        });
      },
      { threshold: [0, 0.15] }
    );
    visSr.observe(srSection);


    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      nearSr.disconnect();
      visSr.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
      if (app) {
        try {
          app.dispose?.();
        } catch {}
      }
    };
  }, []);

  const copy = heroContent.smallRobot;

  return (
    <section
      ref={sectionRef}
      className="sr"
      id="curious"
      aria-label="Still curious"
    >
      <div className="sr-env" aria-hidden="true">
        <span className="sr-glow"></span>
        <span className="sr-vignette"></span>
      </div>

      <div className="sr-inner">
        <div className="sr-copy">
          <p className="sr-eyebrow" data-slot="sr-eyebrow">
            {copy.eyebrow}
          </p>
          <h2 className="sr-title">
            <span data-slot="sr-title-1">{copy.titleLines[0]}</span>
            <span data-slot="sr-title-2">{copy.titleLines[1]}</span>
          </h2>
          <p className="sr-sub" data-slot="sr-sub">
            {copy.description}
          </p>
          <p className="sr-note">
            <span data-slot="sr-note">{copy.note}</span>
          </p>
        </div>

        <div className="sr-stage">
          <canvas
            ref={canvasRef}
            className="sr-canvas"
            aria-hidden="true"
          ></canvas>
        </div>
      </div>
    </section>
  );
}

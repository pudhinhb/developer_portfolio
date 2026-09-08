"use client";

import React, { useEffect, useRef } from "react";
import { heroContent, TechIdea } from "@/data/content";

export default function BigRobotSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rbSection = sectionRef.current;
    const canvas = canvasRef.current;
    const panelBox = panelsRef.current;
    if (!rbSection || !canvas || !panelBox) return;

    const copy = heroContent.bigRobot;
    const style = rbSection.style;
    const finePointer = window.matchMedia("(pointer: fine)");

    const RB = {
      scene: "/assets/big-robot.splinecode",
      zFar: -1500,
      zPast: 760,
      lateral: 23,
      span: 0.62,
      settle: 0.86,
      look: 0.4,
      lookX: 0.07,
      tau: 0.34,
    };

    const panelElements = [
      ...panelBox.querySelectorAll<HTMLElement>(".rb-panel"),
    ];
    const panels = panelElements.map((el, i) => ({
      el,
      side: i % 2 === 0 ? -1 : 1,
    }));

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const band = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
    const isMob = () => window.innerWidth <= 720;

    let pinTop = 0,
      pinRange = 1;
    let jp = 0,
      jpTarget = 0,
      lastJourney: string | null = null;

    const measureRb = () => {
      const pinEl = rbSection.querySelector<HTMLElement>(".rb-pin");
      const r = (pinEl || rbSection).getBoundingClientRect();
      pinTop = r.top + window.scrollY;
      pinRange = Math.max(1, (pinEl || rbSection).offsetHeight - window.innerHeight);
    };

    const renderJourney = (raw: number) => {
      const key = raw.toFixed(4);
      if (key === lastJourney) return;
      lastJourney = key;

      const p = clamp01(raw / RB.settle);
      const n = panels.length || 1;
      const step = n > 1 ? (1 - RB.span) / (n - 1) : 0;
      let intro = 1;

      panels.forEach((panel, i) => {
        const u = band(p, i * step, i * step + RB.span);
        const z = RB.zFar + (RB.zPast - RB.zFar) * u;
        const x = panel.side * RB.lateral * (0.52 + 0.48 * u) * (isMob() ? 0.42 : 1);
        const rotY = panel.side * -11 * (0.4 + 0.6 * u);
        const inFade = band(u, 0.04, 0.24);
        const outFade = 1 - band(u, 0.76, 0.97);

        panel.el.style.transform =
          `translate3d(calc(-50% + ${x.toFixed(2)}vw), -50%, ${z.toFixed(1)}px) ` +
          `rotateY(${rotY.toFixed(2)}deg)`;
        panel.el.style.opacity = (inFade * outFade).toFixed(3);
        panel.el.style.setProperty("--haze", (0.62 * (1 - inFade)).toFixed(3));
        panel.el.style.zIndex = String(10 + Math.round(u * 10));

        intro = Math.min(intro, 1 - inFade);
      });

      style.setProperty("--rbP", p.toFixed(4));
      style.setProperty("--rbC", intro.toFixed(3));
    };

    let app: any = null,
      loading = false,
      running = false,
      rig: any = null;
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

      const before = mx;
      mx += (mxTarget - mx) * (1 - Math.exp(-dt / RB.tau));
      if (Math.abs(mxTarget - mx) < 0.0008) mx = mxTarget;
      if (rig && mx !== before) {
        const hy = -mx * RB.look;
        if (rig.head) {
          rig.head.rotation.y = hy;
          rig.head.rotation.x = Math.abs(mx) * RB.lookX;
        }
        if (rig.head2) rig.head2.rotation.y = hy * 0.18;
        if (rig.neck) rig.neck.rotation.y = hy * 0.3;
      }

      jp += (jpTarget - jp) * (1 - Math.exp(-dt / 0.11));
      if (Math.abs(jpTarget - jp) < 0.0004) jp = jpTarget;
      entry += (entryT - entry) * (1 - Math.exp(-dt / 0.5));
      if (Math.abs(entryT - entry) < 0.002) entry = entryT;
      style.setProperty("--rbIn", entry.toFixed(4));
      renderJourney(jp);

      const settled = jp === jpTarget && entry === entryT && mx === mxTarget;
      if (settled) {
        lastT = 0;
        raf = null;
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (raf === null) raf = requestAnimationFrame(step);
    };

    const onScroll = () => {
      jpTarget = clamp01((window.scrollY - pinTop) / pinRange);
      kick();
    };

    const onResize = () => {
      measureRb();
      onScroll();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      const r = rbSection.getBoundingClientRect();
      mxTarget = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      kick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
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
        await app.load(RB.scene);
        if (app.setGlobalEvents) app.setGlobalEvents(false);
        const find = (n: string) => (app.findObjectByName ? app.findObjectByName(n) : null);
        rig = { head: find("Head"), head2: find("Head 2"), neck: find("Neck") };
        running = true;
        rbSection.classList.add("is-robot-ready");
        (window as any).__rbBig = { app, rig, panels };
        kick();
      } catch (err) {
        console.error("Big robot mount error:", err);
        loading = false;
        kick();
      }
    };

    const near = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          mountRobot();
          near.disconnect();
        }
      },
      { rootMargin: "120% 0px" }
    );
    near.observe(rbSection);

    const vis = new IntersectionObserver(
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
      { threshold: [0, 0.12] }
    );
    vis.observe(rbSection);

    measureRb();
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      near.disconnect();
      vis.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
      if (app) {
        try {
          app.dispose?.();
        } catch {}
      }
    };
  }, []);

  const copy = heroContent.bigRobot;

  return (
    <section
      ref={sectionRef}
      className="rb"
      id="think"
      aria-label="How I think about technology"
    >
      <div className="rb-pin">
        <div className="rb-stage-wrap">
          <div className="rb-env" aria-hidden="true">
            <span className="rb-glow"></span>
            <span className="rb-grid"></span>
            <span className="rb-vignette"></span>
          </div>

          <p className="rb-tag rb-tag--l" data-slot="rb-label-l">
            {copy.labels.left}
          </p>
          <p className="rb-tag rb-tag--r" data-slot="rb-label-r">
            {copy.labels.right}
          </p>

          <div className="rb-space">
            <div className="rb-stage">
              <canvas
                ref={canvasRef}
                className="rb-canvas"
                aria-hidden="true"
              ></canvas>
            </div>
            <div ref={panelsRef} className="rb-panels">
              {copy.techIdeas.map((idea: TechIdea, i: number) => (
                <article key={idea.no} className="rb-panel">
                  <p className="rb-panel-no">{idea.no || String(i + 1).padStart(2, "0")}</p>
                  <h3 className="rb-panel-title">{idea.title}</h3>
                  <p className="rb-panel-text">{idea.description}</p>
                  <ul className="rb-tags">
                    {idea.tags.map((t: string) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div className="rb-center">
            <p className="rb-eyebrow" data-slot="rb-eyebrow">
              {copy.eyebrow}
            </p>
            <h2 className="rb-title">
              <span data-slot="rb-title-1">{copy.titleLines[0]}</span>
              <span data-slot="rb-title-2">{copy.titleLines[1]}</span>
            </h2>
            <p className="rb-sub" data-slot="rb-sub">
              {copy.description}
            </p>
            <p className="rb-hint">
              <span data-slot="rb-hint">{copy.hint}</span>
              <span className="rb-hint-arrow" aria-hidden="true">
                &darr;
              </span>
            </p>
          </div>

          <span className="rb-depth" aria-hidden="true"></span>
        </div>
      </div>
    </section>
  );
}

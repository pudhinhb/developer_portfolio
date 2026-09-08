"use client";

import React, { useEffect, useRef } from "react";
import { heroContent, SkillGroup } from "@/data/content";

export default function EditorialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const reelInRef = useRef<HTMLDivElement>(null);
  const reelBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const edSection = sectionRef.current;
    const pinEl = pinRef.current;
    const reelIn = reelInRef.current;
    const reelBox = reelBoxRef.current;
    if (!edSection || !pinEl || !reelIn || !reelBox) return;

    const copy = heroContent.editorial;
    const style = edSection.style;
    const lines = [...edSection.querySelectorAll<HTMLElement>(".ed-line")];
    const note = edSection.querySelector<HTMLElement>(".ed-note");
    const skillsTitle = edSection.querySelector<HTMLElement>(".ed-skills-title");

    const items = [...reelIn.querySelectorAll<HTMLElement>(".ed-item")];

    const ED = {
      line1: [0.06, 0.24],
      line2: [0.2, 0.38],
      note: [0.32, 0.46],
      title: [0.4, 0.52],
      reel: [0.48, 0.94],
      enter: 120,
    };

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const band = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    let pinTop = 0,
      pinRange = 1;
    let p = 0,
      pTarget = 0,
      raf: number | null = null,
      lastT = 0;
    let offsets: number[] = [],
      centre = 0,
      lastKey: string | null = null;

    const measureEd = () => {
      const r = pinEl.getBoundingClientRect();
      pinTop = r.top + window.scrollY;
      pinRange = Math.max(1, pinEl.offsetHeight - window.innerHeight);
      offsets = items.map((el) => el.offsetTop + el.offsetHeight / 2);
      centre = reelBox ? reelBox.clientHeight * 0.5 : 0;
    };

    const render = (v: number) => {
      const key = v.toFixed(4);
      if (key === lastKey) return;
      lastKey = v.toFixed(4);

      lines.forEach((line, i) => {
        const win = i === 0 ? ED.line1 : ED.line2;
        const e = easeOut(band(v, win[0], win[1]));
        line.style.transform = `translate3d(${((e - 1) * 106).toFixed(2)}%, 0, 0)`;
      });

      if (note) {
        const e = easeOut(band(v, ED.note[0], ED.note[1]));
        note.style.transform = `translate3d(${((1 - e) * -40).toFixed(1)}px, 0, 0)`;
        note.style.opacity = e.toFixed(3);
      }

      if (skillsTitle) {
        const e = easeOut(band(v, ED.title[0], ED.title[1]));
        skillsTitle.style.transform = `translate3d(${((1 - e) * ED.enter).toFixed(1)}px, 0, 0)`;
        skillsTitle.style.opacity = e.toFixed(3);
      }

      const n = items.length;
      const cur = band(v, ED.reel[0], ED.reel[1]) * (n - 1);
      if (offsets.length === n && n) {
        const i0 = Math.max(0, Math.min(n - 1, Math.floor(cur)));
        const i1 = Math.min(n - 1, i0 + 1);
        const y = offsets[i0] + (offsets[i1] - offsets[i0]) * (cur - i0);
        reelIn.style.transform = `translate3d(0, ${(centre - y).toFixed(1)}px, 0)`;
      }

      items.forEach((el, i) => {
        const d = cur - i;
        const arrive = easeOut(clamp01(d + 1));
        const past = clamp01((d - 1.1) / 2.4);
        el.style.transform =
          `translate3d(${((1 - arrive) * ED.enter).toFixed(1)}px, 0, 0) ` +
          `scale(${(0.965 + 0.035 * arrive).toFixed(3)})`;
        el.style.opacity = (arrive * (1 - past * 0.72)).toFixed(3);
      });

      style.setProperty("--edP", clamp01(v).toFixed(4));
    };

    const step = (now: number) => {
      const dt = lastT ? Math.min((now - lastT) / 1000, 0.25) : 0.016;
      lastT = now;
      p += (pTarget - p) * (1 - Math.exp(-dt / 0.11));
      if (Math.abs(pTarget - p) < 0.0004) p = pTarget;
      render(p);
      if (p === pTarget) {
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
      pTarget = clamp01((window.scrollY - pinTop) / pinRange);
      kick();
    };

    const onResize = () => {
      measureEd();
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onResize);
    }
    measureEd();
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const copy = heroContent.editorial;

  return (
    <section
      ref={sectionRef}
      className="ed"
      id="method"
      aria-label="Code is my medium"
    >
      <div ref={pinRef} className="ed-pin">
        <div className="ed-stage">
          <div className="ed-env" aria-hidden="true">
            <span className="ed-glow"></span>
          </div>

          <div className="ed-grid">
            <div className="ed-left">
              <p className="ed-eyebrow" data-slot="ed-eyebrow">
                {copy.eyebrow}
              </p>
              <h2 className="ed-statement">
                <span className="ed-mask">
                  <span className="ed-line" data-slot="ed-line-1">
                    {copy.statement[0]}
                  </span>
                </span>
                <span className="ed-mask">
                  <span className="ed-line" data-slot="ed-line-2">
                    {copy.statement[1]}
                  </span>
                </span>
              </h2>
              <p className="ed-note" data-slot="ed-note">
                {copy.note}
              </p>
            </div>

            <div className="ed-right">
              <p className="ed-skills-title" data-slot="ed-skills-title">
                {copy.skills.title}
              </p>
              <div ref={reelBoxRef} className="ed-reel">
                <div ref={reelInRef} className="ed-reel-in" data-slot="ed-reel">
                  {copy.skills.groups.map((g: SkillGroup) => (
                    <React.Fragment key={g.name}>
                      <p className="ed-item ed-item--group">{g.name}</p>
                      {g.items.map((item: string) => (
                        <p key={item} className="ed-item ed-item--skill">
                          {item}
                        </p>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <span className="ed-progress" aria-hidden="true"></span>
        </div>
      </div>

      {/* Calm ending once choreography finishes */}
      <div className="ed-tail">
        <div className="ed-tail-in">
          <div className="ed-mindset">
            <p className="ed-mindset-title" data-slot="ed-mindset-title">
              {copy.mindset.title}
            </p>
            <ul className="ed-mindset-lines" data-slot="ed-mindset-lines">
              {copy.mindset.lines.map((l: string) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>

          <div className="ed-exploring">
            <p className="ed-block-title" data-slot="ed-exploring-title">
              {copy.exploring.title}
            </p>
            <ul className="ed-explore-list" data-slot="ed-exploring-items">
              {copy.exploring.items.map((it: string) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>

          <div className="ed-end">
            <h3 className="ed-end-title" data-slot="ed-end-lines">
              {copy.ending.lines.map((l: string) => (
                <span key={l}>{l}</span>
              ))}
            </h3>
            <p className="ed-end-note" data-slot="ed-end-note">
              {copy.ending.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

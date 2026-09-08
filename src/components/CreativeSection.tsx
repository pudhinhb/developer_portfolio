"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { heroContent } from "@/data/content";

interface CreativeSectionProps {
  onOpenWorks?: () => void;
}

export default function CreativeSection({ onOpenWorks }: CreativeSectionProps) {
  const pinRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);
  const aboutRootRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const s2pin = pinRef.current;
    const stage = stageRef.current;
    const comp = compRef.current;
    const aboutRoot = aboutRootRef.current;
    const detail = detailRef.current;
    const closeBtn = closeBtnRef.current;
    if (!s2pin || !stage || !comp) return;

    const docEl = document.documentElement;

    const rails = [...stage.querySelectorAll<HTMLElement>(".s2-rail")];
    const lines = [1, 2, 3].map((n) =>
      stage.querySelector<HTMLElement>(`.s2-line-${n}`)
    );
    const metas = [...stage.querySelectorAll<HTMLElement>(".s2-meta")];
    const labelWraps = [...stage.querySelectorAll<HTMLElement>(".s2-label-pos")];
    const labels = labelWraps.map((w) => w.querySelector<HTMLElement>(".s2-label"));
    const finalRot = [-6, -3, -4, 3, -2];
    const extraRot = [10, -8, 9, -10, 7];

    const LINE_RANGES = [
      [0.08, 0.36],
      [0.2, 0.5],
      [0.32, 0.64],
    ];
    const META_RANGE = [0.02, 0.22];
    const LABEL_START = 0.66,
      LABEL_STEP = 0.045,
      LABEL_SPAN = 0.16;

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const sub = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
    const isMobileLayout = () => window.innerWidth <= 720;

    const trAtmo = stage.querySelector<HTMLElement>(".s3-atmo");
    const trWindow = stage.querySelector<HTMLElement>(".s3-window");
    const trGhost = stage.querySelector<HTMLElement>(".s3-ghost");
    const trFragsBox = stage.querySelector<HTMLElement>(".s3-frags");
    const trCluster = stage.querySelector<HTMLElement>(".s3-cluster");
    const trFrame = stage.querySelector<HTMLElement>(".s3-window-frame");
    const p3Dim = stage.querySelector<HTMLElement>(".p3-dim");
    const p3Corners = [...stage.querySelectorAll<HTMLElement>(".p3-corner")];
    const atmoCredits = [...stage.querySelectorAll<HTMLElement>(".s3-credit")];
    const abTitle = stage.querySelector<HTMLElement>(".ab-title");
    const abBoxes = [...stage.querySelectorAll<HTMLElement>(".ab-box")];
    const abFoot = stage.querySelector<HTMLElement>(".ab-foot");
    const hasTr = !!(trWindow && trFragsBox && trAtmo);

    const TR_SPAN = 0.34;
    const TILES_DESKTOP = [
      { r: [0, 0, 0.34, 0.21], d: [-0.5, -0.15], rot: -2.5, s: 0.3, inv: 0 },
      { r: [0.34, 0, 0.32, 0.21], d: [0.04, -0.5], rot: 0.5, s: 0.36, inv: 1 },
      { r: [0.66, 0, 0.34, 0.21], d: [0.55, -0.2], rot: 2, s: 0.33, inv: 0 },
      { r: [0, 0.21, 0.26, 0.26], d: [-0.6, 0.05], rot: -2, s: 0.4, inv: 0 },
      { r: [0.26, 0.21, 0.24, 0.26], d: [-0.22, 0.45], rot: -1.5, s: 0.52, inv: 1 },
      { r: [0.5, 0.21, 0.22, 0.26], d: [0.24, -0.4], rot: 1.5, s: 0.5, inv: 0 },
      { r: [0.72, 0.21, 0.28, 0.26], d: [0.62, -0.08], rot: 2.5, s: 0.37, inv: 0 },
      { r: [0, 0.47, 0.3, 0.29], d: [-0.55, 0.28], rot: -2, s: 0.44, inv: 0 },
      { r: [0.3, 0.47, 0.33, 0.29], d: [0.05, 0.55], rot: 1, s: 0.58, inv: 0 },
      { r: [0.63, 0.47, 0.37, 0.29], d: [0.6, 0.22], rot: 2, s: 0.42, inv: 1 },
      { r: [0, 0.76, 0.55, 0.24], d: [-0.32, 0.5], rot: -1, s: 0.47, inv: 0 },
      { r: [0.55, 0.76, 0.45, 0.24], d: [0.38, 0.5], rot: 1.5, s: 0.49, inv: 0 },
    ];
    const TILES_MOBILE = [
      { r: [0, 0, 0.5, 0.33], d: [-0.34, -0.2], rot: -1.5, s: 0.3, inv: 0 },
      { r: [0.5, 0, 0.5, 0.33], d: [0.34, -0.25], rot: 1, s: 0.36, inv: 1 },
      { r: [0, 0.33, 0.55, 0.35], d: [-0.36, 0.15], rot: -1, s: 0.42, inv: 0 },
      { r: [0.55, 0.33, 0.45, 0.35], d: [0.36, 0.1], rot: 1.5, s: 0.5, inv: 0 },
      { r: [0, 0.68, 0.5, 0.32], d: [-0.3, 0.35], rot: -1, s: 0.46, inv: 1 },
      { r: [0.5, 0.68, 0.5, 0.32], d: [0.3, 0.4], rot: 1, s: 0.56, inv: 0 },
    ];

    interface TileItem {
      el: HTMLElement;
      content: HTMLElement;
      seam: HTMLElement;
      cfg: { r: number[]; d: number[]; rot: number; s: number; inv: number };
    }

    let tiles: TileItem[] = [];
    let clusterInner: HTMLElement | null = null;
    let stageW = 0,
      stageH = 0;
    let builtMobile: boolean | null = null;

    const layoutFragments = () => {
      if (!hasTr || !tiles.length || !stage || !comp) return;
      const s = stage.getBoundingClientRect();
      const c = comp.getBoundingClientRect();
      stageW = s.width;
      stageH = s.height;
      const compRect = {
        left: c.left - s.left,
        top: c.top - s.top,
        w: c.width,
        h: c.height,
      };

      tiles.forEach(({ el, content, cfg }) => {
        const [rx, ry, rw, rh] = cfg.r;
        const x0 = Math.round(compRect.left + rx * compRect.w);
        const y0 = Math.round(compRect.top + ry * compRect.h);
        const x1 = Math.round(compRect.left + (rx + rw) * compRect.w);
        const y1 = Math.round(compRect.top + (ry + rh) * compRect.h);
        el.style.left = x0 + "px";
        el.style.top = y0 + "px";
        el.style.width = x1 - x0 + "px";
        el.style.height = y1 - y0 + "px";
        content.style.left = (compRect.left - x0).toFixed(2) + "px";
        content.style.top = (compRect.top - y0).toFixed(2) + "px";
        content.style.width = compRect.w.toFixed(2) + "px";
        content.style.height = compRect.h.toFixed(2) + "px";
      });

      if (clusterInner) {
        clusterInner.style.left = compRect.left.toFixed(1) + "px";
        clusterInner.style.top = compRect.top.toFixed(1) + "px";
        clusterInner.style.width = compRect.w.toFixed(1) + "px";
        clusterInner.style.height = compRect.h.toFixed(1) + "px";
      }
    };

    const buildFragments = () => {
      if (!hasTr || !comp || !trFragsBox || !trCluster) return;
      builtMobile = isMobileLayout();
      trFragsBox.replaceChildren();
      trCluster.replaceChildren();
      tiles = [];

      (builtMobile ? TILES_MOBILE : TILES_DESKTOP).forEach((cfg) => {
        const el = document.createElement("div");
        el.className = "s3-frag";
        const content = comp.cloneNode(true) as HTMLElement;
        content.classList.remove("s2-comp");
        content.classList.add("s3-frag-content");
        const lbl = content.querySelector(".s2-labels");
        if (lbl) lbl.remove();
        content.querySelectorAll("[style]").forEach((n) => n.removeAttribute("style"));
        const seam = document.createElement("div");
        seam.className = "s3-frag-seam";
        el.append(content, seam);
        trFragsBox.append(el);
        tiles.push({ el, content, seam, cfg });
      });

      const srcLabels = stage.querySelector(".s2-labels");
      if (srcLabels) {
        clusterInner = document.createElement("div");
        clusterInner.className = "s3-cluster-inner";
        const clone = srcLabels.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("[style]").forEach((n) => n.removeAttribute("style"));
        clusterInner.append(clone);
        trCluster.append(clusterInner);
      }
      layoutFragments();
    };

    let pinTop = 0,
      range = 1,
      s2Range = 1,
      trRange = 1;
    let centers: { x: number; y: number }[] = [];
    let centroid = { x: 0, y: 0 };
    let target = 0,
      cur = -1,
      rafS2: number | null = null;

    const measure = () => {
      const r = s2pin.getBoundingClientRect();
      pinTop = r.top + window.scrollY;
      range = Math.max(1, s2pin.offsetHeight - window.innerHeight);
      s2Range = window.innerHeight * (isMobileLayout() ? 1.8 : 2.4);
      trRange = window.innerHeight * (isMobileLayout() ? 2.8 : 3.4);
      centers = labelWraps.map((w) => {
        const r = w.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      const n = centers.length || 1;
      centroid = centers.reduce(
        (acc, c) => ({ x: acc.x + c.x / n, y: acc.y + c.y / n }),
        { x: 0, y: 0 }
      );
      layoutFragments();
    };

    const applyS2 = (p: number) => {
      lines.forEach((line, i) => {
        if (!line) return;
        const e = easeOut(sub(p, LINE_RANGES[i][0], LINE_RANGES[i][1]));
        line.style.transform = `translate3d(0, ${((1 - e) * 112).toFixed(3)}%, 0)`;
      });

      const m = easeOut(sub(p, META_RANGE[0], META_RANGE[1]));
      metas.forEach((el) => {
        el.style.opacity = m.toFixed(3);
        el.style.transform =
          m < 0.999 ? `translate3d(0, ${((1 - m) * 14).toFixed(2)}px, 0)` : "";
      });

      labels.forEach((label, i) => {
        if (!label || !centers[i]) return;
        const a = LABEL_START + i * LABEL_STEP;
        const s = sub(p, a, a + LABEL_SPAN);
        const e = easeOut(s);
        const dx = (centroid.x - centers[i].x) * (1 - e);
        const dy = (centroid.y - centers[i].y) * (1 - e);
        const rot = finalRot[i] + extraRot[i] * (1 - e);
        const scale = 0.32 + 0.68 * e;
        label.style.opacity = Math.min(1, s * 3.2).toFixed(3);
        label.style.transform =
          `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) ` +
          `rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        label.style.filter = e < 0.985 ? `blur(${((1 - e) * 5).toFixed(2)}px)` : "";
      });
    };

    let trActive = false;
    const siteHeader = document.querySelector<HTMLElement>(".site-header");

    const applyTr = (pt: number) => {
      if (!hasTr) return;
      const active = pt > 0.0005;
      if (active !== trActive) {
        trActive = active;
        stage.classList.toggle("is-transitioning", active);
        if (!active) {
          rails.forEach((r) => {
            r.style.opacity = "";
            r.style.transform = "";
          });
          stage.classList.remove("is-s3-locked");
          if (siteHeader) {
            siteHeader.style.opacity = "";
            siteHeader.style.pointerEvents = "";
          }
        }
      }
      if (!active) return;

      if (siteHeader) {
        const hOut = easeOut(sub(pt, 0, 0.14));
        siteHeader.style.opacity = (1 - hOut).toFixed(3);
        siteHeader.style.pointerEvents = hOut > 0.5 ? "none" : "";
      }

      const railOut = easeOut(sub(pt, 0, 0.12));
      rails.forEach((r, i) => {
        r.style.opacity = (1 - railOut).toFixed(3);
        r.style.transform = `translate3d(${((i === 0 ? -1 : 1) * railOut * 24).toFixed(1)}px, 0, 0)`;
      });

      if (trAtmo) trAtmo.style.opacity = easeOut(sub(pt, 0.02, 0.16)).toFixed(3);
      if (p3Dim) p3Dim.style.opacity = (0.55 * easeOut(sub(pt, 0.06, 0.2))).toFixed(3);

      const creditsOut = easeOut(sub(pt, 0.8, 0.9));
      atmoCredits.forEach((c) => {
        c.style.opacity = (1 - creditsOut).toFixed(3);
      });
      const cornersIn = easeOut(sub(pt, 0.86, 0.97));
      p3Corners.forEach((c) => {
        c.style.opacity = cornersIn.toFixed(3);
      });

      const locked = pt > 0.985;
      if (!locked) {
        if (abTitle) {
          const te = easeInOut(sub(pt, 0.55, 0.8));
          abTitle.style.transform = `translate3d(0, ${((1 - te) * 108).toFixed(2)}%, 0)`;
        }
        abBoxes.forEach((box, i) => {
          const a = 0.6 + i * 0.06;
          const e = easeInOut(sub(pt, a, a + 0.25));
          box.style.transform = `translate3d(0, ${((1 - e) * 0.14 * stageH).toFixed(1)}px, 0)`;
          box.style.opacity = easeOut(sub(pt, a, a + 0.16)).toFixed(3);
        });
        if (abFoot) abFoot.style.opacity = easeOut(sub(pt, 0.85, 0.97)).toFixed(3);
      }

      if (locked !== stage.classList.contains("is-s3-locked")) {
        stage.classList.toggle("is-s3-locked", locked);
        if (locked) {
          if (abTitle) abTitle.style.transform = "";
          abBoxes.forEach((b) => {
            b.style.transform = "";
            b.style.opacity = "";
          });
          if (abFoot) abFoot.style.opacity = "";
        }
      }

      const framed = easeInOut(sub(pt, 0.02, 0.17));
      const windowFade = easeOut(sub(pt, 0.92, 1));
      const wScale = 1 - (isMobileLayout() ? 0.1 : 0.2) * framed;
      if (trWindow) {
        trWindow.style.transform = `scale(${wScale.toFixed(4)})`;
        trWindow.style.setProperty("--s3r", (framed * 20).toFixed(1) + "px");
        trWindow.style.opacity = (1 - windowFade).toFixed(3);
      }
      if (trFrame) trFrame.style.opacity = (framed * (1 - windowFade)).toFixed(3);
      if (trGhost)
        trGhost.style.opacity = (1 - easeInOut(sub(pt, 0.5, 0.85))).toFixed(3);

      const seamGlobal = easeOut(sub(pt, 0.05, 0.18));
      tiles.forEach(({ el, seam, cfg }) => {
        const e = easeInOut(sub(pt, cfg.s, cfg.s + TR_SPAN));
        const dx = cfg.d[0] * stageW * e;
        const dy = cfg.d[1] * stageH * e;
        const sc = 1 + (cfg.d[0] < 0 ? -0.035 : 0.03) * e;
        el.style.transform =
          `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) ` +
          `rotate(${(cfg.rot * e).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.opacity = (1 - easeOut(sub(e, 0.62, 1))).toFixed(3);
        if (cfg.inv) {
          const k = sub(pt, cfg.s * 0.7, cfg.s * 0.95);
          el.style.filter =
            k > 0.002 ? `grayscale(${k.toFixed(2)}) invert(${k.toFixed(2)})` : "";
        }
        seam.style.opacity = (seamGlobal * (1 - e)).toFixed(3);
      });

      if (trCluster) {
        const drift = easeInOut(sub(pt, 0.3, 0.85));
        const cfade = easeOut(sub(pt, 0.8, 0.92));
        trCluster.style.transform =
          `translate3d(0, ${(-0.16 * stageH * drift).toFixed(1)}px, 0) ` +
          `scale(${(1 - 0.06 * drift).toFixed(3)})`;
        trCluster.style.opacity = (1 - cfade).toFixed(3);
      }
    };

    let lastP2 = -1,
      lastPt = -1;
    const apply = (p: number) => {
      const scrolled = p * range;
      const p2 = clamp01(scrolled / s2Range);
      const pt = clamp01((scrolled - s2Range) / trRange);
      if (p2 !== lastP2) {
        lastP2 = p2;
        applyS2(p2);
      }
      if (pt !== lastPt) {
        lastPt = pt;
        applyTr(pt);
      }
    };

    const step = () => {
      cur += (target - cur) * 0.16;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      apply(cur);
      rafS2 = cur === target ? null : requestAnimationFrame(step);
    };

    const onS2Scroll = () => {
      target = clamp01((window.scrollY - pinTop) / range);
      docEl.classList.toggle("beyond-hero", window.scrollY > window.innerHeight * 0.85);
      if (rafS2 === null) rafS2 = requestAnimationFrame(step);
    };

    const refresh = () => {
      if (builtMobile !== null && builtMobile !== isMobileLayout()) buildFragments();
      measure();
      target = clamp01((window.scrollY - pinTop) / range);
      cur = target;
      lastP2 = -1;
      lastPt = -1;
      apply(cur);
    };

    window.addEventListener("scroll", onS2Scroll, { passive: true });
    window.addEventListener("resize", refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    buildFragments();
    refresh();

    /* ---- About Me interactive doors ---- */
    let openBtn: HTMLElement | null = null;

    const openAbout = (btn: HTMLElement) => {
      if (!detail || openBtn || !aboutRoot) return;
      openBtn = btn;
      const key = btn.dataset.ab;

      const dRect = detail.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();
      detail.style.transformOrigin =
        `${Math.round(bRect.left + bRect.width / 2 - dRect.left)}px ` +
        `${Math.round(bRect.top + bRect.height / 2 - dRect.top)}px`;

      detail.classList.remove(
        "ab-detail--who",
        "ab-detail--what",
        "ab-detail--think"
      );
      if (key) detail.classList.add(`ab-detail--${key}`);
      const views = [...aboutRoot.querySelectorAll<HTMLElement>(".ab-view")];
      views.forEach((v) => v.classList.toggle("is-active", v.dataset.ab === key));
      btn.classList.add("is-active");
      btn.setAttribute("aria-expanded", "true");
      aboutRoot.classList.add("is-expanded");
      requestAnimationFrame(() => detail.classList.add("is-open"));
      if (closeBtn) window.setTimeout(() => closeBtn.focus({ preventScroll: true }), 400);
    };

    const closeAbout = () => {
      if (!detail || !openBtn || !aboutRoot) return;
      const btn = openBtn;
      openBtn = null;
      detail.classList.remove("is-open");
      aboutRoot.classList.remove("is-expanded");
      btn.classList.remove("is-active");
      btn.setAttribute("aria-expanded", "false");
      btn.focus({ preventScroll: true });
    };

    const handleDoorClick = (e: MouseEvent) => {
      const btn = (e.currentTarget as HTMLElement);
      if (btn.dataset.ab === "what") {
        if (onOpenWorks) onOpenWorks();
        return;
      }
      openAbout(btn);
    };

    const doorButtons = [...stage.querySelectorAll<HTMLElement>(".ab-box")];
    doorButtons.forEach((b) => b.addEventListener("click", handleDoorClick));

    if (closeBtn) closeBtn.addEventListener("click", closeAbout);
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAbout();
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("scroll", onS2Scroll);
      window.removeEventListener("resize", refresh);
      if (rafS2 !== null) cancelAnimationFrame(rafS2);
      doorButtons.forEach((b) => b.removeEventListener("click", handleDoorClick));
      if (closeBtn) closeBtn.removeEventListener("click", closeAbout);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onOpenWorks]);

  return (
    <section
      ref={pinRef}
      className="s2-pin"
      id="work"
      aria-label="Where code meets creative thinking"
    >
      <div ref={stageRef} className="s2-stage">
        <div ref={compRef} className="s2-comp">
          <p className="s2-brand s2-meta">
            <span className="s2-brand-my">My</span>
            <span className="s2-brand-creative">Creative</span>
            <span className="s2-brand-hunch">Hunch</span>
          </p>

          <div className="s2-side s2-side--left s2-meta">
            <p>
              <span>Design by</span>{" "}
              <strong data-slot="s2-side-l1">
                {heroContent.section2.sideLeft[0]}
              </strong>
            </p>
            <p>
              <span>Code into</span>{" "}
              <strong>
                <em data-slot="s2-side-l2">
                  {heroContent.section2.sideLeft[1]}
                </em>
              </strong>
            </p>
          </div>

          <div className="s2-side s2-side--right s2-meta">
            <p>
              <span>Built with</span>{" "}
              <strong data-slot="s2-side-r1">
                {heroContent.section2.sideRight[0]}
              </strong>
            </p>
            <p>
              <span>Driven by</span>{" "}
              <strong data-slot="s2-side-r2">
                {heroContent.section2.sideRight[1]}
              </strong>
            </p>
          </div>

          <h2 className="s2-title">
            <span className="s2-mask s2-mask-1">
              <span className="s2-line s2-line-1">
                <span className="s2-where">Where</span>
              </span>
            </span>
            <span className="s2-mask s2-mask-2">
              <span className="s2-line s2-line-2">
                <span className="s2-code">Code</span>
                <span className="s2-meets">Meets</span>
              </span>
            </span>
            <span className="s2-mask s2-mask-3">
              <span className="s2-line s2-line-3">
                <span className="s2-creative">Creative</span>
                <span className="s2-thinking">Thinking</span>
              </span>
            </span>
          </h2>

          <ul className="s2-labels" aria-label="Focus areas">
            <li className="s2-label-pos s2-pos-ai">
              <span className="s2-label s2-label--ai">AI.</span>
            </li>
            <li className="s2-label-pos s2-pos-sys">
              <span className="s2-label s2-label--sys">SYSTEMS.</span>
            </li>
            <li className="s2-label-pos s2-pos-web">
              <span className="s2-label s2-label--web">WEB.</span>
            </li>
            <li className="s2-label-pos s2-pos-api">
              <span className="s2-label s2-label--api">APIs.</span>
            </li>
            <li className="s2-label-pos s2-pos-auto">
              <span className="s2-label s2-label--auto">AUTOMATION.</span>
            </li>
          </ul>
        </div>

        <div className="s2-rail s2-rail--left s2-meta" aria-hidden="true">
          <span className="s2-rail-dot"></span>
          <ul className="s2-rail-list">
            <li>Idea</li>
            <li>Design</li>
            <li>Develop</li>
            <li>Deploy</li>
            <li>Impact</li>
          </ul>
          <span className="s2-rail-line s2-rail-line--a"></span>
          <span className="s2-rail-line s2-rail-line--b"></span>
        </div>

        <div className="s2-rail s2-rail--right s2-meta" aria-hidden="true">
          <span className="s2-rail-dot"></span>
          <ul className="s2-rail-list">
            <li>Idea</li>
            <li>Design</li>
            <li>Develop</li>
            <li>Deploy</li>
            <li>Impact</li>
          </ul>
          <span className="s2-rail-line s2-rail-line--a"></span>
          <span className="s2-rail-line s2-rail-line--b"></span>
        </div>

        {/* Section 02 -> 03 Puzzle transition layers */}
        <div className="s3-atmo" aria-hidden="true">
          <p className="s3-credit s3-credit--l">MyCreativeHunch Studio</p>
          <p className="s3-credit s3-credit--r">&copy; 2026 MyCreativeHunch</p>
        </div>

        {/* Section 03: About Me */}
        <div ref={aboutRootRef} className="p3" id="section-03">
          <div className="p3-dim" aria-hidden="true">
            <span>Functional &amp; Beautiful</span>
            <span>Designs for Startups</span>
            <span className="p3-dim-3">Ready to Scale</span>
          </div>

          <p className="p3-corner p3-corner--l">
            Transforming <b>Visions</b> to Reality
          </p>
          <p className="p3-corner p3-corner--r">www.mycreativehunch.com</p>

          <div className="ab-comp">
            <span className="ab-title-mask">
              <h2 className="ab-title">
                <span className="ab-title-main">About</span>
                <span className="ab-title-script">Me</span>
              </h2>
            </span>

            <div className="ab-boxes">
              <div className="ab-box-pos">
                <button
                  className="ab-box ab-box--who"
                  type="button"
                  data-ab="who"
                  aria-expanded="false"
                >
                  <span className="ab-box-in">
                    <span className="ab-num">01</span>
                    <span className="ab-kicker">( Identity )</span>
                    <Image
                      className="ab-img"
                      src="/assets/hero-portrait.jpg"
                      alt=""
                      width={400}
                      height={500}
                      loading="lazy"
                    />
                    <span className="ab-box-title" data-slot="ab-who-title">
                      Who<br />I Am
                    </span>
                    <span className="ab-line"></span>
                    <span className="ab-sub" data-slot="ab-who-sub">
                      {heroContent.about.boxes.who.sub}
                    </span>
                    <span className="ab-arrow">
                      <svg
                        viewBox="0 0 18 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M1 6h15M11 1l5 5-5 5" />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>

              <div className="ab-box-pos">
                <button
                  className="ab-box ab-box--what"
                  type="button"
                  data-ab="what"
                  aria-expanded="false"
                >
                  <span className="ab-box-in">
                    <span className="ab-num">02</span>
                    <span className="ab-kicker">( Craft )</span>
                    <Image
                      className="ab-img ab-img--air"
                      src="/assets/aircraft.jpg"
                      alt=""
                      width={400}
                      height={500}
                      loading="lazy"
                    />
                    <span className="ab-box-title" data-slot="ab-what-title">
                      What<br />I Do
                    </span>
                    <span className="ab-line"></span>
                    <span className="ab-sub" data-slot="ab-what-sub">
                      {heroContent.about.boxes.what.sub}
                    </span>
                    <span className="ab-arrow">
                      <svg
                        viewBox="0 0 18 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M1 6h15M11 1l5 5-5 5" />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>

              <div className="ab-box-pos">
                <button
                  className="ab-box ab-box--think"
                  type="button"
                  data-ab="think"
                  aria-expanded="false"
                >
                  <span className="ab-box-in">
                    <span className="ab-num">03</span>
                    <span className="ab-kicker">( Approach )</span>
                    <Image
                      className="ab-img"
                      src="/assets/portrait.jpg"
                      alt=""
                      width={400}
                      height={500}
                      loading="lazy"
                    />
                    <span className="ab-box-title" data-slot="ab-think-title">
                      How<br />I Think
                    </span>
                    <span className="ab-line"></span>
                    <span className="ab-sub" data-slot="ab-think-sub">
                      {heroContent.about.boxes.think.sub}
                    </span>
                    <span className="ab-arrow">
                      <svg
                        viewBox="0 0 18 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M1 6h15M11 1l5 5-5 5" />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div className="ab-foot">
              <span>( 03 &middot; About )</span>
              <span>Web &middot; App &middot; Code</span>
            </div>
          </div>

          {/* Expanded detail modal layer */}
          <div ref={detailRef} className="ab-detail" role="region" aria-label="About details">
            <button
              ref={closeBtnRef}
              className="ab-close"
              type="button"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
              </svg>
            </button>

            <div className="ab-view" data-ab="who">
              <div className="ab-view-copy">
                <p className="ab-eyebrow" data-slot="ab-who-eyebrow">
                  {heroContent.about.views.who.eyebrow}
                </p>
                <h3 className="ab-head" data-slot="ab-who-head">
                  {heroContent.about.views.who.head}
                </h3>
                <p className="ab-text" data-slot="ab-who-text">
                  {heroContent.about.views.who.text}
                </p>
                <ul className="ab-tags">
                  <li>Web</li>
                  <li>App</li>
                  <li>Code</li>
                </ul>
              </div>
              <div className="ab-view-media">
                <Image
                  src="/assets/hero-portrait.jpg"
                  alt={`Portrait of ${heroContent.headline}`}
                  width={600}
                  height={750}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="ab-view" data-ab="think">
              <div className="ab-view-copy">
                <p className="ab-eyebrow" data-slot="ab-think-eyebrow">
                  {heroContent.about.views.think.eyebrow}
                </p>
                <h3 className="ab-head ab-head--quote">
                  &ldquo;The grid system is an aid, not a guarantee.&rdquo;
                </h3>
                <p className="ab-attr">&mdash; Josef M&uuml;ller-Brockmann</p>
                <p className="ab-text" data-slot="ab-think-text">
                  {heroContent.about.views.think.text}
                </p>
              </div>
              <div className="ab-view-media">
                <Image
                  src="/assets/portrait.jpg"
                  alt="Josef Müller-Brockmann"
                  width={600}
                  height={750}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Puzzle transition window and fragments */}
        <div className="s3-window" aria-hidden="true">
          <div className="s3-ghost"></div>
          <div className="s3-frags"></div>
          <div className="s3-cluster"></div>
          <div className="s3-window-frame"></div>
        </div>
      </div>
    </section>
  );
}

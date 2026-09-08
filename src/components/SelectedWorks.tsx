"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import { heroContent, Project } from "@/data/content";

export interface SelectedWorksHandle {
  enter: () => void;
  exit: () => void;
}

const SelectedWorks = forwardRef<SelectedWorksHandle, {}>((props, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);
  const idxRef = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const detailCloseRef = useRef<HTMLButtonElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const projects = (heroContent.works.projects || []).filter((p) => !p.teaser);
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const N = projects.length + 2; // intro + projects + outro

  const flashTo = (midFn: () => void, done?: () => void) => {
    const flashEl = flashRef.current;
    if (!flashEl) {
      midFn();
      if (done) done();
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    flashEl.classList.add("is-on");
    window.setTimeout(
      () => {
        midFn();
        window.setTimeout(
          () => {
            flashEl.classList.remove("is-on");
            if (done) window.setTimeout(done, reduceMotion ? 20 : 240);
          },
          reduceMotion ? 40 : 170
        );
      },
      reduceMotion ? 50 : 270
    );
  };

  const enter = () => {
    const docEl = document.documentElement;
    const wk = rootRef.current;
    const scroller = scrollerRef.current;
    const backBtn = backBtnRef.current;
    if (!wk || !scroller || docEl.classList.contains("works-open")) return;

    flashTo(
      () => {
        docEl.classList.add("works-open");
        wk.setAttribute("aria-hidden", "false");
        const mainEl = document.querySelector("main");
        if (mainEl) mainEl.setAttribute("aria-hidden", "true");
        scroller.scrollTop = 0;
        requestAnimationFrame(() => wk.classList.add("is-in"));
      },
      () => {
        if (backBtn) backBtn.focus({ preventScroll: true });
      }
    );
  };

  const exit = () => {
    const docEl = document.documentElement;
    const wk = rootRef.current;
    if (!wk || !docEl.classList.contains("works-open")) return;

    flashTo(
      () => {
        if (detailRef.current) detailRef.current.classList.remove("is-open");
        wk.classList.remove("is-in");
        docEl.classList.remove("works-open");
        wk.setAttribute("aria-hidden", "true");
        const mainEl = document.querySelector("main");
        if (mainEl) mainEl.removeAttribute("aria-hidden");
      },
      () => {
        const target = document.querySelector<HTMLElement>(".ab-box--what");
        if (target && target.focus) target.focus({ preventScroll: true });
      }
    );
  };

  useImperativeHandle(ref, () => ({
    enter,
    exit,
  }));

  const openDetail = (data: Project) => {
    setActiveProject(data);
    flashTo(
      () => {
        if (detailRef.current) detailRef.current.classList.add("is-open");
      },
      () => {
        if (detailCloseRef.current)
          detailCloseRef.current.focus({ preventScroll: true });
      }
    );
  };

  const closeDetail = (instant?: boolean) => {
    const detail = detailRef.current;
    if (!detail || !detail.classList.contains("is-open")) return;
    if (instant) {
      detail.classList.remove("is-open");
      return;
    }
    flashTo(() => detail.classList.remove("is-open"));
  };

  useEffect(() => {
    const wk = rootRef.current;
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    const idxEl = idxRef.current;
    if (!wk || !scroller || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clampW = (v: number) => Math.min(1, Math.max(0, v));
    let wp = 0,
      wpTarget = 0,
      wkRaf: number | null = null,
      wkRange = 1;
    let lastIdxShown = "";

    const isMobileWk = () => window.innerWidth <= 720;

    const measureWk = () => {
      wkRange = Math.max(1, track.offsetHeight - scroller.clientHeight);
    };

    const screenElements = [
      ...wk.querySelectorAll<HTMLElement>(".wk-space > .wk-scr"),
    ];
    const screens = screenElements.map((el, i) => {
      let side = 0;
      if (i > 0 && i <= projects.length) {
        side = (i - 1) % 2 === 0 ? -1 : 1;
      }
      return { el, side };
    });

    const applyWk = (p: number) => {
      const a = p * (N - 1);
      const depth = isMobileWk() ? 520 : 820;
      const lat = isMobileWk() ? 2.4 : 5.4;
      const mobile = isMobileWk();

      screens.forEach((s, i) => {
        const off = i - a;
        if (off < -0.85 || off > 1.85) {
          s.el.style.visibility = "hidden";
          return;
        }
        s.el.style.visibility = "visible";
        const x = s.side * lat * off;
        const y = off < 0 ? off * -5 : 0;
        const z = -off * depth;
        const rotY = Math.max(-4, Math.min(4, s.side * -2.2 * off));
        const rotX = Math.max(-2.4, Math.min(2.4, off * 1.1));
        s.el.style.transform =
          `translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}svh, ${z.toFixed(1)}px) ` +
          `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
        s.el.style.opacity = (
          off >= 0 ? Math.max(0, 1 - off * 0.82) : Math.max(0, 1 + off * 1.6)
        ).toFixed(3);
        s.el.style.zIndex = String(100 - Math.round(off * 10));
        s.el.style.setProperty("--o", off.toFixed(3));
        if (!mobile) {
          const blur = off < 0 ? Math.min(-off * 7, 9) : Math.min(off * 4.2, 8);
          s.el.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : "";
        }
      });

      const shown = pad2(Math.min(N, Math.max(1, Math.round(a) + 1)));
      if (idxEl && shown !== lastIdxShown) {
        lastIdxShown = shown;
        idxEl.textContent = shown;
      }
    };

    const wkStep = () => {
      wp += (wpTarget - wp) * 0.16;
      if (Math.abs(wpTarget - wp) < 0.0006) wp = wpTarget;
      applyWk(wp);
      wkRaf = wp === wpTarget ? null : requestAnimationFrame(wkStep);
    };

    const onWkScroll = () => {
      wpTarget = clampW(scroller.scrollTop / wkRange);
      if (wkRaf === null) wkRaf = requestAnimationFrame(wkStep);
    };

    scroller.addEventListener("scroll", onWkScroll, { passive: true });
    const handleResize = () => {
      if (document.documentElement.classList.contains("works-open")) {
        measureWk();
        applyWk(wp);
      }
    };
    window.addEventListener("resize", handleResize);

    const handleKeydown = (e: KeyboardEvent) => {
      if (
        e.key !== "Escape" ||
        !document.documentElement.classList.contains("works-open")
      )
        return;
      if (detailRef.current && detailRef.current.classList.contains("is-open")) {
        closeDetail(false);
      } else {
        exit();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      scroller.removeEventListener("scroll", onWkScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeydown);
      if (wkRaf !== null) cancelAnimationFrame(wkRaf);
    };
  }, [projects.length, N]);

  return (
    <>
      <div ref={rootRef} className="wk" id="works" aria-hidden="true">
        <div className="wk-void" aria-hidden="true">
          <div className="wk-dim">
            <span>Functional &amp; Beautiful</span>
            <span>Designs for Startups</span>
            <span className="wk-dim-3">Ready to Scale</span>
          </div>
          <p className="wk-corner wk-corner--l">
            Transforming <b>Visions</b> to Reality
          </p>
          <p className="wk-corner wk-corner--r">www.mycreativehunch.com</p>
        </div>

        <div ref={scrollerRef} className="wk-scroll">
          <div
            ref={trackRef}
            className="wk-track"
            style={{ height: `${100 + (N - 1) * 120}vh` }}
          >
            <div className="wk-stage">
              <div className="wk-head" data-enter style={{ ["--d" as string]: ".08s" }}>
                <span className="wk-brand">
                  <svg
                    className="wk-brand-mark"
                    viewBox="0 0 44 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 4.5 4.5 12l7.5 7.5" />
                    <path d="M32 4.5 39.5 12 32 19.5" />
                    <path d="M25.5 3.5 18.5 20.5" />
                  </svg>
                  <b>MyCreativeHunch</b>&nbsp;Studio
                </span>
                <button
                  ref={backBtnRef}
                  className="wk-back"
                  type="button"
                  aria-label="Back to About"
                  onClick={exit}
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
              </div>

              {/* The 3D World */}
              <div className="wk-space">
                {/* Intro Screen */}
                <div className="wk-scr">
                  <div className="wk-intro">
                    <h2 className="wk-title">
                      My <i>Selected</i> <b>Works</b>
                      <sup>&reg;</sup>
                    </h2>
                    <p className="wk-sub">
                      {pad2(projects.length)} Projects &middot; Scroll to travel
                    </p>
                    <span className="wk-hint">
                      <svg
                        viewBox="0 0 12 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M6 1v11M1.5 8 6 12.5 10.5 8" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Project Screens */}
                {projects.map((p, i) => (
                  <div key={p.key} className="wk-scr">
                    <span className="wk-ghost">{pad2(i + 1)}</span>
                    <article
                      className="wk-glass"
                      style={p.accent ? ({ ["--wa" as string]: p.accent } as React.CSSProperties) : undefined}
                    >
                      <div className="wk-copy">
                        <p className="wk-num">
                          {pad2(i + 1)} / {pad2(projects.length)}
                        </p>
                        <h3 className="wk-name">{p.name || p.key}</h3>
                        <p className="wk-titleline">{p.title || ""}</p>
                        <p className="wk-meta">
                          <i></i>
                          {p.cat || ""} &middot; {p.year || ""}
                        </p>
                        <button
                          className="wk-view"
                          type="button"
                          onClick={() => openDetail(p)}
                        >
                          View Project{" "}
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
                        </button>
                      </div>
                      <figure className="wk-media">
                        <Image
                          src={p.img}
                          alt={p.name || ""}
                          width={p.w}
                          height={p.h}
                          loading="lazy"
                        />
                      </figure>
                    </article>
                  </div>
                ))}

                {/* Outro Screen */}
                <div className="wk-scr">
                  <div className="wk-outro">
                    <p className="wk-outro-line">
                      Built with <b>Passion.</b>
                      <br />
                      Driven by <b>Creativity.</b>
                    </p>
                    <button className="wk-return" type="button" onClick={exit}>
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
                      </svg>{" "}
                      Back to About
                    </button>
                  </div>
                </div>
              </div>

              <p
                className="wk-counter"
                data-enter
                style={{ ["--d" as string]: ".2s" }}
              >
                <b ref={idxRef} data-wk-idx>
                  01
                </b>{" "}
                /{" "}
                <span ref={totalRef} data-wk-total>
                  {pad2(N)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Project detail shell */}
        <div
          ref={detailRef}
          className="wk-detail"
          role="region"
          aria-label="Project detail"
        >
          <button
            ref={detailCloseRef}
            className="wk-detail-close"
            type="button"
            aria-label="Back to works"
            onClick={() => closeDetail(false)}
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
          <figure className="wk-detail-media">
            {activeProject && (
              <Image
                src={activeProject.img}
                alt={activeProject.name || ""}
                width={activeProject.w}
                height={activeProject.h}
              />
            )}
          </figure>
          <p className="wk-detail-title">
            {activeProject ? activeProject.title || activeProject.name : ""}
          </p>
        </div>
      </div>

      {/* Cinematic black flash between chapters */}
      <div ref={flashRef} className="flash" aria-hidden="true"></div>
    </>
  );
});

SelectedWorks.displayName = "SelectedWorks";
export default SelectedWorks;

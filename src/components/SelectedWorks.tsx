"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
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

  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const projects = (heroContent.works.projects || []).filter((p) => !p.teaser);
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const N = projects.length + 2; // 0: intro, 1..projects.length: projects, N-1: outro

  const activeProject =
    activeProjectIndex !== null && projects[activeProjectIndex]
      ? projects[activeProjectIndex]
      : null;

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

  // Measures track range and updates slide positioning
  const measureWkRef = useRef<() => number>(() => 1);
  const applyWkRef = useRef<(p: number) => void>(() => {});
  const scrollToSlideRef = useRef<(idx: number) => void>(() => {});

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
        wpRef.current = 0;
        wpTargetRef.current = 0;
        activeSlideRef.current = 0;
        setActiveSlide(0);
        requestAnimationFrame(() => {
          wk.classList.add("is-in");
          if (measureWkRef.current) measureWkRef.current();
          if (applyWkRef.current) applyWkRef.current(0);
        });
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

  const openDetail = (projectIndex: number) => {
    setActiveProjectIndex(projectIndex);
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

  const activeSlideRef = useRef<number>(0);
  const wpRef = useRef<number>(0);
  const wpTargetRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const animRafRef = useRef<number | null>(null);
  const wkRafRef = useRef<number | null>(null);

  const prevDetail = () => {
    if (activeProjectIndex === null) return;
    const nextIdx = (activeProjectIndex - 1 + projects.length) % projects.length;
    setActiveProjectIndex(nextIdx);
  };

  const nextDetail = () => {
    if (activeProjectIndex === null) return;
    const nextIdx = (activeProjectIndex + 1) % projects.length;
    setActiveProjectIndex(nextIdx);
  };

  const goToSlide = (slideIndex: number) => {
    if (scrollToSlideRef.current) {
      scrollToSlideRef.current(slideIndex);
    }
  };

  useEffect(() => {
    const wk = rootRef.current;
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    const idxEl = idxRef.current;
    if (!wk || !scroller || !track) return;

    const clampW = (v: number) => Math.min(1, Math.max(0, v));
    let wkRange = 1;
    let lastIdxShown = "";

    const isMobileWk = () => window.innerWidth <= 720;

    const measureWk = () => {
      wkRange = Math.max(1, track.offsetHeight - scroller.clientHeight);
      return wkRange;
    };
    measureWkRef.current = measureWk;

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
      const depth = isMobileWk() ? 480 : 820;
      const lat = isMobileWk() ? 2.2 : 5.4;
      const mobile = isMobileWk();

      const currentIdx = Math.min(N - 1, Math.max(0, Math.round(a)));
      if (currentIdx !== activeSlideRef.current) {
        activeSlideRef.current = currentIdx;
        setActiveSlide(currentIdx);
      }

      screens.forEach((s, i) => {
        const off = i - a;

        // Smooth visibility cutoff with full fade-to-zero (no pop-in/pop-out)
        if (off < -0.85 || off > 1.55) {
          s.el.style.visibility = "hidden";
          s.el.style.opacity = "0";
          s.el.style.pointerEvents = "none";
          return;
        }

        s.el.style.visibility = "visible";
        s.el.style.pointerEvents = Math.abs(off) <= 0.32 ? "auto" : "none";

        // Fluid spatial geometry: departing card floats gently out and away
        const x = off < 0 ? (s.side || -1) * (lat + 14) * -off : s.side * lat * off;
        const y = off < 0 ? off * -6 : 0;
        const z = -off * depth;
        const rotY = Math.max(-6, Math.min(6, (s.side || 1) * -3.2 * off));
        const rotX = Math.max(-2.2, Math.min(2.2, off * 1.0));
        const scale =
          off < 0
            ? Math.max(0.82, 1 + off * 0.24)
            : Math.max(0.86, 1 - off * 0.12);

        s.el.style.transform =
          `translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}svh, ${z.toFixed(1)}px) ` +
          `scale(${scale.toFixed(3)}) ` +
          `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;

        // Pure smooth opacity that reaches 0 smoothly before visibility cutoff
        const opacity =
          off < 0 ? Math.max(0, 1 + off * 1.6) : Math.max(0, 1 - off * 0.85);
        s.el.style.opacity = opacity.toFixed(3);

        s.el.style.zIndex = String(100 - Math.round(off * 10));
        s.el.style.setProperty("--o", off.toFixed(3));

        if (!mobile) {
          const blur = Math.abs(off) > 0.2 ? Math.min(Math.abs(off) * 4, 7) : 0;
          s.el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "";
        }
      });

      // Update counter to reflect current meaningful project index
      let shown = "01";
      if (currentIdx === 0) {
        shown = "01";
      } else if (currentIdx <= projects.length) {
        shown = pad2(currentIdx);
      } else {
        shown = pad2(projects.length);
      }

      if (idxEl && shown !== lastIdxShown) {
        lastIdxShown = shown;
        idxEl.textContent = shown;
      }
    };
    applyWkRef.current = applyWk;

    // Smooth cubic bezier easing animation for slide transitions
    const easeCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateToSlide = (targetIdx: number) => {
      const startWp = wpRef.current;
      const targetWp = clampW(targetIdx / (N - 1));
      if (Math.abs(targetWp - startWp) < 0.0003) {
        activeSlideRef.current = targetIdx;
        setActiveSlide(targetIdx);
        return;
      }

      if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current);
      if (wkRafRef.current !== null) cancelAnimationFrame(wkRafRef.current);

      isAnimatingRef.current = true;
      const duration = 480; // 480ms snappy cinematic glide
      const startTime = performance.now();

      const loop = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const val = startWp + (targetWp - startWp) * easeCubic(progress);

        wpRef.current = val;
        wpTargetRef.current = val;
        applyWk(val);

        if (scroller) {
          scroller.scrollTop = val * wkRange;
        }

        if (progress < 1) {
          animRafRef.current = requestAnimationFrame(loop);
        } else {
          wpRef.current = targetWp;
          wpTargetRef.current = targetWp;
          applyWk(targetWp);
          animRafRef.current = null;
          isAnimatingRef.current = false;
          activeSlideRef.current = targetIdx;
          setActiveSlide(targetIdx);
        }
      };
      animRafRef.current = requestAnimationFrame(loop);
    };
    scrollToSlideRef.current = animateToSlide;

    // Wheel event handler with smart debounce for effortless 1-gesture slide advance
    let wheelAccum = 0;
    let lastWheelTime = 0;
    const onWkWheel = (e: WheelEvent) => {
      if (detailRef.current && detailRef.current.classList.contains("is-open")) return;
      e.preventDefault();

      if (isAnimatingRef.current) return;

      const now = performance.now();
      if (now - lastWheelTime > 280) {
        wheelAccum = 0;
      }
      lastWheelTime = now;

      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) >= 28) {
        const dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        const cur = activeSlideRef.current;
        const target = Math.min(N - 1, Math.max(0, cur + dir));
        if (target !== cur) {
          animateToSlide(target);
        }
      }
    };
    wk.addEventListener("wheel", onWkWheel, { passive: false });

    // Touch swipe support for smooth mobile swiping
    let touchStartY = 0;
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (detailRef.current && detailRef.current.classList.contains("is-open")) return;
      if (isAnimatingRef.current) return;
      if (e.changedTouches.length === 1) {
        const dy = touchStartY - e.changedTouches[0].clientY;
        const dx = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(dy) > 36 || Math.abs(dx) > 36) {
          const delta = Math.abs(dy) > Math.abs(dx) ? dy : dx;
          const cur = activeSlideRef.current;
          if (delta > 0) {
            animateToSlide(Math.min(N - 1, cur + 1));
          } else {
            animateToSlide(Math.max(0, cur - 1));
          }
        }
      }
    };
    wk.addEventListener("touchstart", onTouchStart, { passive: true });
    wk.addEventListener("touchend", onTouchEnd, { passive: true });

    // Fallback scroll listener (if user drags scrollbar directly)
    let scrollSnapTimer: NodeJS.Timeout | null = null;
    const onWkScroll = () => {
      if (isAnimatingRef.current || animRafRef.current !== null) return;
      wpTargetRef.current = clampW(scroller.scrollTop / wkRange);
      wpRef.current += (wpTargetRef.current - wpRef.current) * 0.28;
      applyWk(wpRef.current);

      if (scrollSnapTimer) clearTimeout(scrollSnapTimer);
      scrollSnapTimer = setTimeout(() => {
        if (!isAnimatingRef.current) {
          const nearestSlide = Math.min(N - 1, Math.max(0, Math.round(wpRef.current * (N - 1))));
          animateToSlide(nearestSlide);
        }
      }, 160);
    };
    scroller.addEventListener("scroll", onWkScroll, { passive: true });

    const handleResize = () => {
      if (document.documentElement.classList.contains("works-open")) {
        measureWk();
        applyWk(wpRef.current);
      }
    };
    window.addEventListener("resize", handleResize);

    const handleKeydown = (e: KeyboardEvent) => {
      if (!document.documentElement.classList.contains("works-open")) return;

      if (e.key === "Escape") {
        if (detailRef.current && detailRef.current.classList.contains("is-open")) {
          closeDetail(false);
        } else {
          exit();
        }
        return;
      }

      // If detail modal is open, navigate between projects inside modal
      if (detailRef.current && detailRef.current.classList.contains("is-open")) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevDetail();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nextDetail();
        }
        return;
      }

      // If viewing carousel, allow arrow keys to smoothly glide between slides
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = Math.min(N - 1, activeSlideRef.current + 1);
        animateToSlide(next);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const prev = Math.max(0, activeSlideRef.current - 1);
        animateToSlide(prev);
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => {
      wk.removeEventListener("wheel", onWkWheel);
      wk.removeEventListener("touchstart", onTouchStart);
      wk.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("scroll", onWkScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeydown);
      if (wkRafRef.current !== null) cancelAnimationFrame(wkRafRef.current);
      if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current);
      if (scrollSnapTimer) clearTimeout(scrollSnapTimer);
    };
  }, [projects.length, N]);

  return (
    <>
      <div ref={rootRef} className="wk" id="works" aria-hidden="true">
        <div className="wk-void" aria-hidden="true">
          <div className="wk-dim">
            <span>Intelligent &amp; Scalable</span>
            <span>Mobile Apps for Startups</span>
            <span className="wk-dim-3">Ready to Scale</span>
          </div>
          <p className="wk-corner wk-corner--l">
            Engineering <b>Visions</b> to Reality
          </p>
          <p className="wk-corner wk-corner--r">github.com/pudhinhb</p>
        </div>

        <div ref={scrollerRef} className="wk-scroll">
          <div
            ref={trackRef}
            className="wk-track"
            style={{ height: `${100 + (N - 1) * 125}vh` }}
          >
            <div className="wk-stage">
              <div
                className="wk-head"
                data-enter
                style={{ ["--d" as string]: ".08s" }}
              >
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
                  <b>Pudhinraj H B</b>&nbsp;Works
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
                      Selected <i>Engineering</i> <b>Works</b>
                      <sup>&reg;</sup>
                    </h2>
                    <p className="wk-sub">
                      {pad2(projects.length)} Production Apps &middot; Scroll or Use
                      Controls Below
                    </p>
                    <button
                      className="wk-return"
                      type="button"
                      onClick={() => goToSlide(1)}
                      style={{ marginTop: "3.5svh" }}
                    >
                      Explore First Project &rarr;
                    </button>
                  </div>
                </div>

                {/* Project Screens */}
                {projects.map((p, i) => (
                  <div key={p.key} className="wk-scr">
                    <span className="wk-ghost">{pad2(i + 1)}</span>
                    <article
                      className="wk-glass"
                      style={
                        p.accent
                          ? ({ ["--wa" as string]: p.accent } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <div className="wk-copy">
                        <p className="wk-num">
                          {pad2(i + 1)} / {pad2(projects.length)}
                        </p>
                        <h3 className="wk-name">{p.name || p.key}</h3>
                        <p className="wk-titleline">{p.title || ""}</p>

                        {/* Tech stack badges on the card */}
                        {p.techStack && p.techStack.length > 0 && (
                          <div className="wk-tags">
                            {p.techStack.slice(0, 4).map((tag) => (
                              <span key={tag} className="wk-tag">
                                {tag}
                              </span>
                            ))}
                            {p.techStack.length > 4 && (
                              <span className="wk-tag">+{p.techStack.length - 4}</span>
                            )}
                          </div>
                        )}

                        <p className="wk-meta">
                          <i></i>
                          {p.cat || ""} &middot; {p.year || ""}
                        </p>
                        <button
                          className="wk-view"
                          type="button"
                          onClick={() => openDetail(i)}
                        >
                          View Case Study &amp; Specs{" "}
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
                          width={p.w || 1200}
                          height={p.h || 675}
                          loading="lazy"
                        />
                      </figure>
                    </article>
                  </div>
                ))}

                {/* Outro Screen in its own solid opaque frosted glass card */}
                <div className="wk-scr">
                  <div className="wk-outro-card">
                    <p className="wk-outro-line">
                      Built with <b>Passion.</b>
                      <br />
                      Driven by <b>Creativity.</b>
                    </p>
                    <p
                      style={{
                        margin: "2svh 0 0",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      Ready to architect intelligent, high-performance mobile systems for
                      your team.
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "3.5svh" }}>
                      <a
                        href="#contact"
                        className="wk-return"
                        style={{
                          textDecoration: "none",
                          background: "#e8281e",
                          borderColor: "#e8281e",
                          color: "#fff",
                          boxShadow: "0 6px 20px rgba(232, 40, 30, 0.4)",
                        }}
                        onClick={() => exit()}
                      >
                        Get In Touch &rarr;
                      </a>
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
              </div>

              {/* Floating Bottom Navigation Dock */}
              <nav className="wk-nav-dock" aria-label="Selected works navigation">
                <button
                  className="wk-nav-btn"
                  type="button"
                  aria-label="Previous slide"
                  disabled={activeSlide === 0}
                  onClick={() => goToSlide(Math.max(0, activeSlide - 1))}
                >
                  <svg
                    viewBox="0 0 18 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: 14, height: 10, transform: "scaleX(-1)" }}
                  >
                    <path d="M1 6h15M11 1l5 5-5 5" />
                  </svg>
                </button>

                <div className="wk-nav-dots">
                  <button
                    className={`wk-nav-dot ${activeSlide === 0 ? "is-active" : ""}`}
                    type="button"
                    onClick={() => goToSlide(0)}
                  >
                    Intro
                  </button>
                  {projects.map((p, idx) => {
                    const slideIdx = idx + 1;
                    const isActive = activeSlide === slideIdx;
                    return (
                      <button
                        key={p.key}
                        className={`wk-nav-dot ${isActive ? "is-active" : ""}`}
                        style={
                          isActive && p.accent
                            ? ({ ["--wa" as string]: p.accent } as React.CSSProperties)
                            : undefined
                        }
                        type="button"
                        onClick={() => goToSlide(slideIdx)}
                      >
                        {pad2(idx + 1)}
                      </button>
                    );
                  })}
                  <button
                    className={`wk-nav-dot ${activeSlide === N - 1 ? "is-active" : ""}`}
                    type="button"
                    onClick={() => goToSlide(N - 1)}
                  >
                    End
                  </button>
                </div>

                <button
                  className="wk-nav-btn"
                  type="button"
                  aria-label="Next slide"
                  disabled={activeSlide === N - 1}
                  onClick={() => goToSlide(Math.min(N - 1, activeSlide + 1))}
                >
                  <svg
                    viewBox="0 0 18 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: 14, height: 10 }}
                  >
                    <path d="M1 6h15M11 1l5 5-5 5" />
                  </svg>
                </button>
              </nav>

              {/* Bottom Left Counter */}
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
                  {pad2(projects.length)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Comprehensive Project Detail Case Study Modal */}
        <div
          ref={detailRef}
          className="wk-detail"
          role="dialog"
          aria-modal="true"
          aria-label="Project Case Study Detail"
          style={
            activeProject && activeProject.accent
              ? ({
                  ["--modal-accent" as string]: activeProject.accent,
                } as React.CSSProperties)
              : undefined
          }
          onClick={(e) => {
            if (e.target === detailRef.current) closeDetail(false);
          }}
        >
          {activeProject && (
            <div className="wk-detail-dialog" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="wk-detail-header">
                <div className="wk-detail-badges">
                  <span className="wk-detail-cat">
                    <span className="wk-detail-cat-dot"></span>
                    {activeProject.cat}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {activeProject.year}
                  </span>
                  {activeProject.role && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.7)",
                        borderLeft: "1px solid rgba(255,255,255,0.15)",
                        paddingLeft: "12px",
                      }}
                    >
                      {activeProject.role}
                    </span>
                  )}
                </div>
                <button
                  ref={detailCloseRef}
                  className="wk-detail-close"
                  type="button"
                  aria-label="Close project modal (Esc)"
                  onClick={() => closeDetail(false)}
                >
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="wk-detail-content">
                {/* Left column: Overview, Highlights, Specs, Actions */}
                <div className="wk-detail-body">
                  <h2>{activeProject.name}</h2>
                  {activeProject.tagline && (
                    <p className="wk-detail-tagline">{activeProject.tagline}</p>
                  )}
                  <p className="wk-detail-desc">
                    {activeProject.description || activeProject.title}
                  </p>

                  {/* Highlights */}
                  {activeProject.highlights && activeProject.highlights.length > 0 && (
                    <>
                      <h4 className="wk-detail-section-title">
                        Key Engineering Highlights &amp; Innovations
                      </h4>
                      <ul className="wk-detail-bullets">
                        {activeProject.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="wk-detail-bullet">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Tech stack tags */}
                  {activeProject.techStack && (
                    <>
                      <h4 className="wk-detail-section-title">Technologies &amp; Architecture</h4>
                      <div className="wk-tags" style={{ marginBottom: "20px" }}>
                        {activeProject.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="wk-tag"
                            style={{
                              borderColor: "rgba(255,255,255,0.15)",
                              background: "rgba(255,255,255,0.06)",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Action Links */}
                  {activeProject.links && activeProject.links.length > 0 && (
                    <div className="wk-detail-actions">
                      {activeProject.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className={
                            link.primary
                              ? "wk-detail-btn-primary"
                              : "wk-detail-btn-secondary"
                          }
                        >
                          {link.label}
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: 12, height: 12 }}
                          >
                            <path d="M2.5 11.5l9-9M4 2.5h7.5V10" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right column: Image preview & Stat card */}
                <div className="wk-detail-visual">
                  <div className="wk-detail-media-wrap">
                    <Image
                      src={activeProject.img}
                      alt={activeProject.name || ""}
                      width={activeProject.w || 1200}
                      height={activeProject.h || 675}
                      priority
                    />
                  </div>

                  {activeProject.stats && (
                    <div className="wk-detail-stat-card">
                      <span className="wk-detail-stat-label">
                        {activeProject.stats.label}
                      </span>
                      <span className="wk-detail-stat-value">
                        {activeProject.stats.value}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with Prev / Next Project Buttons */}
              <div className="wk-detail-footer">
                <button
                  className="wk-detail-nav-btn"
                  type="button"
                  onClick={prevDetail}
                >
                  &larr; Previous Project
                </button>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {pad2((activeProjectIndex ?? 0) + 1)} / {pad2(projects.length)}
                </span>
                <button
                  className="wk-detail-nav-btn"
                  type="button"
                  onClick={nextDetail}
                >
                  Next Project &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cinematic black flash between chapters */}
      <div ref={flashRef} className="flash" aria-hidden="true"></div>
    </>
  );
});

SelectedWorks.displayName = "SelectedWorks";
export default SelectedWorks;

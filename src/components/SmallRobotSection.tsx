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
      turnX: 0.44, // head yaw left/right
      turnY: 0.22, // head pitch up/down
      tilt: 0.05,  // subtle inquisitive roll
      tau: 0.24,   // damping for natural following
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
      mxTarget = 0,
      my = 0,
      myTarget = 0;

    // The robot's natural forward-facing resting pose in the isometric scene
    const baseRot = {
      x: -0.45949,
      y: -0.80998,
      z: -0.34412,
    };

    const step = (now: number) => {
      const dt = lastT ? Math.min((now - lastT) / 1000, 0.25) : 0.016;
      lastT = now;

      entry += (entryT - entry) * (1 - Math.exp(-dt / 0.5));
      if (Math.abs(entryT - entry) < 0.002) entry = entryT;
      style.setProperty("--srIn", entry.toFixed(4));

      mx += (mxTarget - mx) * (1 - Math.exp(-dt / SR.tau));
      my += (myTarget - my) * (1 - Math.exp(-dt / SR.tau));
      if (Math.abs(mxTarget - mx) < 0.0008) mx = mxTarget;
      if (Math.abs(myTarget - my) < 0.0008) my = myTarget;

      if (head) {
        // Yaw (left/right): cursor left -> look left (higher y), cursor right -> look right (lower y)
        head.rotation.y = baseRot.y - mx * SR.turnX;
        // Pitch (up/down): cursor up -> look up (lower x), cursor down -> look down (higher x)
        head.rotation.x = baseRot.x + my * SR.turnY;
        // Subtle natural roll
        head.rotation.z = baseRot.z + mx * SR.tilt;
      }

      if (!active || (entry === entryT && mx === mxTarget && my === myTarget)) {
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
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.4;
      // Calculate normalized direction vector from robot to cursor
      mxTarget = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.45)));
      myTarget = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.45)));
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

        // Strip watermark from WebGL rendering pipeline
        const origCreateRenderer = Application.prototype._createRenderer;
        if (origCreateRenderer) {
          Application.prototype._createRenderer = async function (...args: any[]) {
            if (this._data?.shared?.images) {
              for (const k of Object.keys(this._data.shared.images)) {
                if (/watermark|spline/i.test(k)) {
                  delete this._data.shared.images[k];
                }
              }
            }
            const renderer = await origCreateRenderer.apply(this, args);
            if (renderer?.pipeline) {
              renderer.pipeline.setWatermark = function () {
                this.watermarkTexture = null;
                this._effectChainDirty = true;
              };
              renderer.pipeline.watermarkTexture = null;
              renderer.pipeline._chainWatermark = null;
              renderer.pipeline._effectChainDirty = true;
              if (renderer.pipeline.disableUIOverlay) {
                renderer.pipeline.disableUIOverlay();
              }
            }
            return renderer;
          };
        }

        app = new Application(canvas);

        let splineData: any = undefined;
        Object.defineProperty(app, "_data", {
          get() {
            return splineData;
          },
          set(val) {
            if (val?.shared?.images) {
              for (const k of Object.keys(val.shared.images)) {
                if (/watermark|spline/i.test(k)) {
                  delete val.shared.images[k];
                }
              }
            }
            splineData = val;
          },
          configurable: true,
          enumerable: true,
        });

        await app.load(SR.scene);
        if (app.setGlobalEvents) app.setGlobalEvents(false);

        // Ensure pipeline watermark texture is stripped and not drawn
        if (app._renderer?.pipeline) {
          app._renderer.pipeline.setWatermark = function () {};
          app._renderer.pipeline.watermarkTexture = null;
          app._renderer.pipeline._chainWatermark = null;
          app._renderer.pipeline._effectChainDirty = true;
          if (app._renderer.pipeline.disableUIOverlay) {
            app._renderer.pipeline.disableUIOverlay();
          }
        }
        if (app._scene?.traverse) {
          app._scene.traverse((obj: any) => {
            if (obj.name && /watermark|spline/i.test(obj.name)) {
              obj.visible = false;
              if (obj.parent) obj.parent.remove(obj);
            }
          });
        }
        if (app.requestRender) app.requestRender();

        // Immediately purge any injected Spline logo / watermark badge
        const purgeSplineBadge = () => {
          document
            .querySelectorAll(
              '[data-spline-html-content], iframe[title*="Spline" i], #spline-watermark, .spline-watermark, a[href*="spline.design"], a[href*="spline"]'
            )
            .forEach((el) => el.remove());
        };
        purgeSplineBadge();
        if (canvas.parentElement) {
          const obs = new MutationObserver(() => purgeSplineBadge());
          obs.observe(canvas.parentElement, { childList: true, subtree: true });
        }

        head = app.findObjectByName ? app.findObjectByName("Cabeza") : null;
        if (head) {
          // Initialize at true natural resting orientation
          head.rotation.x = baseRot.x;
          head.rotation.y = baseRot.y;
          head.rotation.z = baseRot.z;
        }
        if (active && app.play) {
          app.play();
        }
        running = true;
        srSection.classList.add("is-robot-ready");
        (window as any).__rbSmall = { app, head, baseRot };
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

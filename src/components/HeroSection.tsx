"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { heroContent } from "@/data/content";
import Header from "./Header";

interface HeroSectionProps {
  onOpenWorks?: () => void;
}

export default function HeroSection({ onOpenWorks }: HeroSectionProps) {
  const [dismissed, setDismissed] = useState(false);
  const notificationRef = useRef<HTMLElement>(null);
  const portraitLayerRef = useRef<HTMLDivElement>(null);
  const atmoLayerRef = useRef<HTMLDivElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const docEl = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    const portraitLayer = portraitLayerRef.current;
    const atmoLayer = atmoLayerRef.current;
    const cursorLight = cursorLightRef.current;

    let targetX = 0,
      targetY = 0,
      curX = 0,
      curY = 0;
    let lightTX = window.innerWidth / 2,
      lightTY = window.innerHeight * 0.42;
    let lightX = lightTX,
      lightY = lightTY;
    let rafId: number | null = null;
    let interactionsOn = false;

    if (cursorLight) {
      cursorLight.style.transform = `translate3d(${lightX}px, ${lightY}px, 0)`;
    }

    const tick = () => {
      curX += (targetX - curX) * 0.055;
      curY += (targetY - curY) * 0.055;
      lightX += (lightTX - lightX) * 0.045;
      lightY += (lightTY - lightY) * 0.045;

      if (portraitLayer) {
        portraitLayer.style.transform = `translate3d(${(curX * 10).toFixed(2)}px, ${(curY * 6).toFixed(2)}px, 0)`;
      }
      if (atmoLayer) {
        atmoLayer.style.transform = `translate3d(${(curX * -16).toFixed(2)}px, ${(curY * -9).toFixed(2)}px, 0)`;
      }
      if (cursorLight) {
        cursorLight.style.transform = `translate3d(${lightX.toFixed(1)}px, ${lightY.toFixed(1)}px, 0)`;
      }

      const still =
        Math.abs(targetX - curX) < 0.001 &&
        Math.abs(targetY - curY) < 0.001 &&
        Math.abs(lightTX - lightX) < 0.1 &&
        Math.abs(lightTY - lightY) < 0.1;

      rafId = still ? null : requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (docEl.classList.contains("beyond-hero")) return;
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
      lightTX = e.clientX;
      lightTY = e.clientY;
      if (interactionsOn && rafId === null) rafId = requestAnimationFrame(tick);
    };

    const enableInteractions = () => {
      interactionsOn = true;
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    };

    const disableInteractions = () => {
      interactionsOn = false;
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (portraitLayer) portraitLayer.style.transform = "";
      if (atmoLayer) atmoLayer.style.transform = "";
    };

    enableInteractions();

    const SETTLE_AT_MS = 5000;
    docEl.classList.add("is-ready");
    const timer = window.setTimeout(() => {
      docEl.classList.add("is-settled");
    }, SETTLE_AT_MS);

    return () => {
      window.clearTimeout(timer);
      disableInteractions();
    };
  }, []);

  const handleDismiss = () => {
    const el = notificationRef.current;
    if (!el) {
      setDismissed(true);
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDismissed(true);
      return;
    }
    el.classList.add("is-dismissed");
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "notif-out") {
        setDismissed(true);
        el.removeEventListener("animationend", onEnd);
      }
    };
    el.addEventListener("animationend", onEnd);
  };

  return (
    <section className="hero" id="top">
      {/* L02/03 · Atmosphere */}
      <div ref={atmoLayerRef} className="atmo-parallax" aria-hidden="true">
        <div className="layer-atmosphere fx fx-atmo">
          <div className="atmo-wash"></div>
          <div className="atmo-core"></div>
          <div className="atmo-floor"></div>
          <div className="atmo-vignette"></div>
        </div>
      </div>

      {/* L04/05 · Portrait */}
      <div ref={portraitLayerRef} className="portrait-parallax">
        <div className="portrait-frame">
          <div className="portrait-stage fx fx-portrait">
            <Image
              className="portrait-img"
              src="/assets/hero-portrait.png"
              width={1407}
              height={1118}
              priority
              alt={`Portrait of ${heroContent.headline}, software developer, lit by warm red cinematic light`}
            />
            <div className="portrait-veil fx-veil" aria-hidden="true"></div>
            <div className="portrait-sweep fx-sweep" aria-hidden="true"></div>
            <div className="eye-flash eye-flash--right fx-flash" aria-hidden="true"></div>
            <div className="eye-flash fx-flash" aria-hidden="true"></div>
          </div>
        </div>
      </div>

      {/* Film grain */}
      <div className="layer-grain" aria-hidden="true"></div>

      {/* Legibility scrim behind notification zone */}
      <div className="scrim-bottom" aria-hidden="true"></div>

      {/* L07 · Hero typography */}
      <div className="hero-copy">
        <h1 className="headline fx fx-headline" data-slot="headline">
          {heroContent.headline}
        </h1>
        <div className="role-block">
          <p className="role">
            <span className="role-line fx fx-role-1" data-slot="role-1">
              {heroContent.role[0]}
            </span>
            <span className="role-line fx fx-role-2" data-slot="role-2">
              {heroContent.role[1]}
            </span>
          </p>
          <ul className="hero-meta fx fx-meta" data-slot="meta">
            {heroContent.meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* L08 · Notification */}
      {!dismissed && (
        <aside
          ref={notificationRef}
          className="notification fx fx-notif"
          aria-label="Notification"
        >
          <button
            className="notif-close"
            type="button"
            aria-label="Dismiss notification"
            onClick={handleDismiss}
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
          <div className="notif-card">
            <span className="notif-avatar" aria-hidden="true">
              <span className="notif-badge">
                <svg
                  viewBox="0 0 12 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3.4 1 1 4l2.4 3M8.6 1 11 4 8.6 7" />
                </svg>
              </span>
            </span>
            <div className="notif-body">
              <div className="notif-top">
                <span className="notif-name" data-slot="notif-name">
                  {heroContent.notification.name}
                </span>
                <span className="notif-time" data-slot="notif-time">
                  {heroContent.notification.time}
                </span>
              </div>
              <p className="notif-msg">
                <strong data-slot="notif-lead">{heroContent.notification.lead}</strong>{" "}
                <span data-slot="notif-message">
                  {heroContent.notification.message}
                </span>
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* L06 · Header */}
      <Header onOpenWorks={onOpenWorks} />

      {/* L09 · Interactive cursor light */}
      <div ref={cursorLightRef} className="cursor-light" aria-hidden="true"></div>
    </section>
  );
}

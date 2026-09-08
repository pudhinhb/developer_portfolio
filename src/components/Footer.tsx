"use client";

import React, { useEffect, useRef } from "react";
import { heroContent, FooterColumn } from "@/data/content";

interface FooterProps {
  onOpenWorks?: () => void;
}

export default function Footer({ onOpenWorks }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ftSection = footerRef.current;
    if (!ftSection) return;

    const style = ftSection.style;
    const lines = [...ftSection.querySelectorAll<HTMLElement>(".ft-line")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    let p = 0,
      pTarget = 0,
      raf: number | null = null,
      lastT = 0,
      lastKey: string | null = null;

    const render = (v: number) => {
      const key = v.toFixed(4);
      if (key === lastKey) return;
      lastKey = key;
      lines.forEach((line, i) => {
        const e = easeOut(clamp01((v - i * 0.12) / 0.62));
        line.style.transform = `translate3d(0, ${((1 - e) * 108).toFixed(2)}%, 0)`;
      });
      style.setProperty("--ftP", v.toFixed(4));
    };

    const step = (now: number) => {
      const dt = lastT ? Math.min((now - lastT) / 1000, 0.25) : 0.016;
      lastT = now;
      p += (pTarget - p) * (1 - Math.exp(-dt / 0.13));
      if (Math.abs(pTarget - p) < 0.0006) p = pTarget;
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
      const r = ftSection.getBoundingClientRect();
      pTarget = clamp01((window.innerHeight - r.top) / (window.innerHeight * 0.72));
      kick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const handleBackToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const copy = heroContent.footer;
  const groups: FooterColumn[] = [...(copy.columns || [])];
  if (Array.isArray(copy.social) && copy.social.length) {
    groups.push({ title: "Elsewhere", items: copy.social });
  }

  return (
    <footer ref={footerRef} className="ft" id="contact">
      <div className="ft-env" aria-hidden="true">
        <span className="ft-glow"></span>
      </div>

      <div className="ft-in">
        <p className="ft-eyebrow" data-slot="ft-eyebrow">
          {copy.eyebrow}
        </p>

        <h2 className="ft-headline">
          <span className="ft-mask">
            <span className="ft-line" data-slot="ft-head-1">
              {copy.headline[0]}
            </span>
          </span>
          <span className="ft-mask">
            <span className="ft-line" data-slot="ft-head-2">
              {copy.headline[1]}
            </span>
          </span>
        </h2>

        <p className="ft-line-note" data-slot="ft-line">
          {copy.line}
        </p>

        {copy.email && (
          <a
            className="ft-mail"
            data-slot-href="ft-mail"
            href={`mailto:${copy.email}`}
          >
            <span className="ft-mail-label" data-slot="ft-mail-label">
              {copy.emailLabel}
            </span>
            <span className="ft-mail-address" data-slot="ft-mail-address">
              {copy.email}
            </span>
            <svg
              className="ft-mail-arrow"
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
          </a>
        )}

        <nav className="ft-cols" data-slot="ft-cols" aria-label="Footer">
          {groups.map((g, i) => (
            <div
              key={g.title}
              className="ft-col"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <p className="ft-col-title">{g.title}</p>
              <ul>
                {g.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      target={it.href && /^https?:/.test(it.href) ? "_blank" : undefined}
                      rel={
                        it.href && /^https?:/.test(it.href)
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={(e) => {
                        if (it.href === "#projects" && onOpenWorks) {
                          e.preventDefault();
                          onOpenWorks();
                        }
                      }}
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="ft-base">
          <span className="ft-brand">
            <svg
              className="ft-mark"
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
            <b data-slot="ft-legal">{copy.legal}</b>
            <i data-slot="ft-note">{copy.note}</i>
          </span>

          <button className="ft-top" type="button" onClick={handleBackToTop}>
            <span data-slot="ft-top">{copy.backToTop}</span>
            <svg
              viewBox="0 0 12 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 13V2M1.5 6.5 6 2l4.5 4.5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

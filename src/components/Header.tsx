"use client";

import React, { useEffect, useRef } from "react";
import { heroContent } from "@/data/content";

interface HeaderProps {
  onOpenWorks?: () => void;
}

export default function Header({ onOpenWorks }: HeaderProps) {
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = themeBtnRef.current;
    if (!btn) return;

    const handleThemeClick = () => {
      btn.classList.remove("is-pulse");
      void btn.offsetWidth; // restart pulse animation
      btn.classList.add("is-pulse");
    };

    btn.addEventListener("click", handleThemeClick);
    return () => btn.removeEventListener("click", handleThemeClick);
  }, []);

  return (
    <header className="site-header">
      <div className="header-pill fx fx-header">
        <a className="brand" href="#top" aria-label={`${heroContent.headline} — home`}>
          <svg
            className="brand-mark"
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
          <span className="brand-dot" aria-hidden="true"></span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {heroContent.nav.map((item, i) => (
              <li key={item.label}>
                <a
                  className={`nav-link ${item.active ? "is-active" : ""}`}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  data-slot={`nav-${i}`}
                  onClick={(e) => {
                    if (item.href === "#projects" && onOpenWorks) {
                      e.preventDefault();
                      onOpenWorks();
                    }
                  }}
                >
                  {item.active && <span className="nav-dot" aria-hidden="true"></span>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a className="cta" href={heroContent.cta.href}>
            <span data-slot="cta">{heroContent.cta.label}</span>
            <svg
              className="cta-arrow"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.2 10.8 10.8 3.2M5 3.2h5.8V9" />
            </svg>
          </a>
          <button
            ref={themeBtnRef}
            className="theme-btn"
            type="button"
            aria-label="Switch theme"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="3.3" />
              <path d="M10 1.6v2.1M10 16.3v2.1M1.6 10h2.1M16.3 10h2.1M4.1 4.1l1.5 1.5M14.4 14.4l1.5 1.5M15.9 4.1l-1.5 1.5M5.6 14.4l-1.5 1.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

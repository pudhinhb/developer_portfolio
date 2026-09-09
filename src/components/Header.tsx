"use client";

import React, { useState } from "react";
import { heroContent } from "@/data/content";
import ResumeModal from "./ResumeModal";

interface HeaderProps {
  onOpenWorks?: () => void;
}

export default function Header({ onOpenWorks }: HeaderProps) {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <>
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
              className="resume-btn"
              type="button"
              onClick={() => setIsResumeOpen(true)}
              aria-label="View and download Resume"
              title="View & Download Resume"
            >
              <svg
                className="resume-btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span className="resume-btn-text">Resume</span>
            </button>
          </div>
        </div>
      </header>

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </>
  );
}

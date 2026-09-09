"use client";

import React, { useEffect, useRef } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      className="resume-modal-backdrop"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div className="resume-modal-dialog">
        {/* Modal Top Bar */}
        <div className="resume-modal-header">
          <div className="resume-modal-meta">
            <div className="resume-modal-icon-badge" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h2 id="resume-modal-title" className="resume-modal-title">
                Pudhinraj H B <span className="resume-modal-title-dim">— Resume</span>
              </h2>
              <p className="resume-modal-subtitle">
                AI & Flutter Software Engineer • iOS & Android
              </p>
            </div>
          </div>

          <div className="resume-modal-actions">
            <a
              href="/HB_Pudhinraj_Resume.pdf"
              download="HB_Pudhinraj_Resume.pdf"
              className="resume-download-cta"
              title="Download Resume PDF"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 3v10M6 9l4 4 4-4M3 15v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
              </svg>
              <span>Download PDF</span>
            </a>

            <a
              href="/HB_Pudhinraj_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-ext-btn"
              title="Open Resume in New Tab"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 10.5V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4.5M12 3h5v5M9.5 10.5 17 3" />
              </svg>
              <span className="resume-ext-btn-text">Open Tab</span>
            </a>

            <button
              type="button"
              className="resume-modal-close"
              onClick={onClose}
              aria-label="Close resume viewer"
              title="Close (Esc)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Frame */}
        <div className="resume-modal-body">
          <iframe
            src="/HB_Pudhinraj_Resume.pdf#view=FitH&toolbar=1&navpanes=0"
            className="resume-pdf-frame"
            title="Pudhinraj H B Resume PDF Viewer"
          />

          <noscript>
            <div className="resume-fallback">
              <p>Your browser does not support inline PDF viewing.</p>
              <a
                href="/HB_Pudhinraj_Resume.pdf"
                download="HB_Pudhinraj_Resume.pdf"
                className="resume-download-cta"
              >
                Download Resume PDF
              </a>
            </div>
          </noscript>
        </div>
      </div>
    </div>
  );
}

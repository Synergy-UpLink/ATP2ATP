/**
 * allthepowertoallthepeople.world
 * Theme system + UI interactions
 */

(function () {
  'use strict';

  // ── Theme ─────────────────────────────────────────────────────────────────

  const STORAGE_KEY = 'atpatp-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply immediately to avoid flash
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {

    // Toggle button
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Respect OS preference changes in real-time
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    // ── Mobile nav ──────────────────────────────────────────────────────────

    const navToggle = document.getElementById('nav-toggle');
    const navLinks  = document.getElementById('nav-links');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close nav when a link is clicked
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // ── Scroll reveal ───────────────────────────────────────────────────────

    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: just show everything
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // ── Manifesto ticker duplicate ───────────────────────────────────────────

    const track = document.querySelector('.manifesto-strip__track');
    if (track) {
      // Clone for seamless loop
      track.innerHTML += track.innerHTML;
    }

  });

})();

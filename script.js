(() => {
  'use strict';

  const start = () => {
    const root = document.documentElement;
    const scenes = Array.from(document.querySelectorAll('.scene'));
    const chapterLinks = Array.from(document.querySelectorAll('[data-chapter-link]'));
    const progressBar = document.querySelector('.scroll-progress');
    const navigation = document.querySelector('.site-nav');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    const previousValues = new WeakMap();
    let frame = 0;
    let revealObserver;

    const clamp = (value) => Math.min(1, Math.max(0, value));
    const ease = (value) => {
      const progress = clamp(value);
      return progress * progress * (3 - 2 * progress);
    };

    const setScene = (scene, values) => {
      const previous = previousValues.get(scene) || {};
      Object.entries(values).forEach(([property, value]) => {
        if (previous[property] !== value) scene.style.setProperty(property, value);
      });
      previousValues.set(scene, values);
    };

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || root.clientHeight;
      const scrollTop = window.scrollY || 0;
      const scrollableHeight = Math.max(0, root.scrollHeight - viewportHeight);
      const overallProgress = scrollableHeight ? clamp(scrollTop / scrollableHeight) : 0;

      // Read all positions before writing animation styles to avoid layout thrashing.
      const positions = scenes.map((scene) => {
        const stage = scene.querySelector('.scene-stage');
        return {
          scene,
          bounds: scene.getBoundingClientRect(),
          stageHeight: stage ? stage.getBoundingClientRect().height : 0,
          isPinned: !!stage && window.getComputedStyle(stage).position === 'sticky',
        };
      });
      if (progressBar) progressBar.style.transform = `scaleX(${overallProgress.toFixed(4)})`;
      if (navigation) navigation.classList.toggle('is-scrolled', scrollTop > 20);

      let activeId = '';
      positions.forEach(({ scene, bounds }) => {
        if (bounds.top <= viewportHeight * 0.45 && bounds.bottom > viewportHeight * 0.45) {
          activeId = scene.id;
        }
      });

      positions.forEach(({ scene, bounds, stageHeight, isPinned }) => {
        if (reducedMotion.matches || !isPinned) {
          setScene(scene, {
            '--scene-scale': '1',
            '--scene-blur': '0px',
            '--scene-opacity': '1',
            '--copy-opacity': '1',
            '--copy-y': '0px',
          });
          return;
        }

        // A native scroll event can jump several chapters at once. Evaluate any
        // newly visible scene immediately, but leave distant scenes untouched.
        const focused = scene.contains(document.activeElement);
        if (!focused && (bounds.bottom < -viewportHeight || bounds.top > viewportHeight * 2)) return;

        const isHero = scene.hasAttribute('data-hero');
        const travel = Math.max(1, bounds.height - stageHeight);
        const pinnedProgress = clamp(-bounds.top / travel);
        const entrance = isHero ? 1 : ease((viewportHeight - bounds.top) / (viewportHeight * 0.85));
        const approach = ease(pinnedProgress / 0.72);
        const departure = ease((pinnedProgress - 0.72) / 0.28);
        const copyEntrance = isHero ? 1 : ease((viewportHeight * 0.6 - bounds.top) / (viewportHeight * 0.5));
        const copyDeparture = ease((pinnedProgress - 0.53) / 0.37);

        // The opening is crisp at rest. Later frames ease out of their incoming
        // crop, then gently push in as their chapter remains pinned.
        const scale = isHero
          ? 1 + 0.08 * approach - 0.025 * departure
          : 1 + 0.1 * (1 - entrance) + 0.065 * approach + 0.02 * departure;

        setScene(scene, {
          '--scene-scale': scale.toFixed(4),
          '--scene-blur': `${(6 * (1 - entrance) + 2.4 * departure).toFixed(2)}px`,
          '--scene-opacity': (0.64 + 0.36 * entrance - 0.4 * departure).toFixed(4),
          '--copy-opacity': focused ? '1' : (copyEntrance * (1 - 0.95 * copyDeparture)).toFixed(4),
          '--copy-y': focused ? '0px' : `${(22 * (1 - copyEntrance) - 18 * copyDeparture).toFixed(2)}px`,
        });
      });

      chapterLinks.forEach((link) => {
        const isActive = activeId && link.hash === `#${activeId}`;
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const setUpReveals = () => {
      if (revealObserver) revealObserver.disconnect();
      if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        reveals.forEach((element) => element.classList.add('is-visible'));
        return;
      }
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
      reveals.forEach((element) => {
        if (!element.classList.contains('is-visible')) revealObserver.observe(element);
      });
    };

    const handleMotionPreference = () => {
      setUpReveals();
      scheduleUpdate();
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('hashchange', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate, { once: true });
    document.addEventListener('focusin', (event) => {
      const reveal = event.target.closest ? event.target.closest('.reveal') : null;
      if (reveal) reveal.classList.add('is-visible');
      scheduleUpdate();
    });
    document.addEventListener('focusout', scheduleUpdate);
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', handleMotionPreference);
    else reducedMotion.addListener(handleMotionPreference);

    setUpReveals();
    update();
    root.classList.add('motion-ready');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();

/* ============================================================
   PORTFOLIO VALERIA — app (vanilla JS, hash routing)
   ============================================================ */
(function() {
  'use strict';

  // Suppress benign ResizeObserver loop warning (browser quirk, not from our code)
  const ROProto = window.ResizeObserver && window.ResizeObserver.prototype;
  if (ROProto && !ROProto.__patched) {
    const orig = ROProto.observe;
    ROProto.observe = function(...args) {
      try { return orig.apply(this, args); } catch (e) {}
    };
    ROProto.__patched = true;
  }
  window.addEventListener('error', e => {
    if (e.message && /ResizeObserver/.test(e.message)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return false;
    }
  }, true);
  const origErr = window.console.error;
  window.console.error = function(...args) {
    if (args.length && typeof args[0] === 'string' && /ResizeObserver/.test(args[0])) return;
    return origErr.apply(this, args);
  };

  // ---------- State ----------
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroLayout": "split"
  }/*EDITMODE-END*/;

  const state = {
    lang: localStorage.getItem('pv_lang') || 'it',
    route: (location.hash.replace('#/', '') || 'home'),
    heroLayout: TWEAK_DEFAULTS.heroLayout,
    tweaksOpen: false,
    lightbox: null,
    diffPos: 50,
    diffActiveStep: null
  };

  const t = () => window.PV_I18N[state.lang];
  const $app = () => document.getElementById('app');

  // ---------- Icons (small SVG) ----------
  const icons = {
    arrow: '<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
    ig: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    li: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.119 1 2.5 1s2.48 1.119 2.48 2.5zM.22 8h4.56v14H.22V8zm7.32 0h4.37v1.916h.063c.609-1.155 2.096-2.371 4.315-2.371 4.617 0 5.471 3.039 5.471 6.991V22h-4.554v-6.484c0-1.547-.029-3.539-2.156-3.539-2.16 0-2.49 1.687-2.49 3.428V22H7.54V8z"/></svg>',
    gh: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.67-.31-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.31 1.23.96-.27 1.99-.4 3.01-.41 1.02.01 2.05.14 3.01.41 2.3-1.55 3.31-1.23 3.31-1.23.65 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.83.58A12 12 0 0024 12.5C24 5.87 18.63.5 12 .5z"/></svg>'
  };

  // ---------- Nav ----------
  function renderNav() {
    const T = t();
    return `
      <nav class="nav" id="nav">
        <a class="nav-mark" href="#/home" data-link>
          <span class="dot"></span>
          <span style="white-space: nowrap;"><span class="mark-name">Valeria</span> Funaro</span>
        </a>
        <ul class="nav-links">
          <li><button class="nav-link ${state.route==='home'?'active':''}" data-route="home"><span class="num">01</span>${T.nav.home}</button></li>
          <li><button class="nav-link ${state.route==='portfolio'?'active':''}" data-route="portfolio"><span class="num">02</span>${T.nav.portfolio}</button></li>
          <li><button class="nav-link ${state.route==='contatti'?'active':''}" data-route="contatti"><span class="num">03</span>${T.nav.contatti}</button></li>
          <li>
            <div class="lang-toggle" role="group" aria-label="Language">
              <button class="${state.lang==='it'?'on':''}" data-lang="it">IT</button>
              <button class="${state.lang==='en'?'on':''}" data-lang="en">EN</button>
            </div>
          </li>
        </ul>
      </nav>
    `;
  }

  // ---------- Footer ----------
  function renderFooter() {
    const T = t();
    return `
      <footer class="footer">
        <div class="container">
          <p class="eyebrow no-dash" style="color: var(--coral-soft)">${T.footer.h}</p>
          <h2 class="display">Valeria <i>Funaro.</i></h2>
          <hr class="footer-rule" />
          <div class="footer-bottom">
            <div>${T.footer.copy}</div>
            <div class="footer-socials">
              <a href="https://www.instagram.com/myhobby_lab" target="_blank" rel="noopener" aria-label="Instagram">${icons.ig}</a>
              <a href="https://www.linkedin.com/in/valeriafunaro" target="_blank" rel="noopener" aria-label="LinkedIn">${icons.li}</a>
              <a href="https://github.com/ValeriaFunaro" target="_blank" rel="noopener" aria-label="GitHub">${icons.gh}</a>
            </div>
            <div>${T.footer.colophon}</div>
          </div>
        </div>
      </footer>
    `;
  }

  // ---------- HOME ----------
  function renderHome() {
    const T = t();
    return `
      ${renderHero()}
      ${renderTicker()}
      ${renderAbout()}
      ${renderPrinciples()}
      ${renderDiff()}
      ${renderCTAStrip()}
    `;
  }

  function renderHero() {
    const T = t();
    const stats = T.stats.map(s => `
      <div class="stat">
        <span class="label-mono">${s.label}</span>
        <span class="num">${s.num}</span>
      </div>
    `).join('');

    return `
      <section class="hero" data-layout="${state.heroLayout}">
        <div class="hero-grid-bg"></div>
        <div class="container">
          <div class="hero-inner">
            <div class="hero-meta-row">
              <span class="label-mono">${T.meta.year}</span>
              <span class="label-mono">${T.meta.based}</span>
              <span class="label-mono" style="color: var(--coral-deep)">● ${T.meta.status}</span>
            </div>
            <div class="hero-body">
              <div class="hero-headline">
                <span class="eyebrow">${T.hero.eyebrow}</span>
                <h1 class="display">
                  ${T.hero.h1_a}<br>
                  <em>${T.hero.h1_b}</em><br>
                  <span class="accent">${T.hero.h1_c}</span><br>
                  ${T.hero.h1_d}
                </h1>
                <p class="lead">${T.hero.lead}</p>
                <div class="hero-stats">${stats}</div>
              </div>
              <div class="hero-portrait-wrap">
                <div class="hero-portrait">
                  <img src="assets/image/immagine-profilo.webp" alt="Valeria Funaro" />
                </div>
                <div class="hero-portrait-frame"></div>
                <div class="hero-portrait-tag">${T.hero.portrait_tag}</div>
                <div class="hero-portrait-dot">${T.hero.portrait_dot}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderTicker() {
    const T = t();
    const items = [...T.ticker, ...T.ticker].map(w => `<span><span class="star">✦</span>${w}</span>`).join('');
    return `
      <div class="now-bar">
        <div class="now-bar-track">${items}</div>
      </div>
    `;
  }

  function renderAbout() {
    const T = t();
    const ps = T.about.paragraphs.map(p => `<p>${p}</p>`).join('');
    const meta = T.about.meta.map(([k, v]) => `
      <li><span class="k">${k}</span><span class="v">${v}</span></li>
    `).join('');
    return `
      <section class="about section">
        <div class="container">
          <div class="about-grid">
            <div>
              <span class="eyebrow">${T.about.eyebrow}</span>
              <h2 class="section-title" style="margin-top: 16px;">${T.about.h2}</h2>
              <ul class="about-meta-list" style="margin-top: 32px;">${meta}</ul>
            </div>
            <div class="about-text">${ps}</div>
          </div>
        </div>
      </section>
    `;
  }

  function renderPrinciples() {
    const T = t();
    const items = T.principles.items.map(p => `
      <div class="principle reveal">
        <span class="num">${p.num}</span>
        <h3>${p.t}</h3>
        <p>${p.d}</p>
      </div>
    `).join('');
    return `
      <section class="principles">
        <div class="container">
          <div class="principles-intro">
            <div>
              <span class="eyebrow">${T.principles.eyebrow}</span>
              <h2 class="section-title" style="margin-top: 16px;">${T.principles.h2}</h2>
            </div>
            <p class="lead">${T.principles.lead}</p>
          </div>
          <div class="principles-grid">${items}</div>
        </div>
      </section>
    `;
  }

  // ---------- DIFF section (v1 ↔ v2 audit) ----------
  // Componente interattivo: slider di confronto fra le due screenshot,
  // più una timeline di step cliccabili che muovono lo slider e aprono
  // un'annotazione con tre voci (metodo / AI / mano).
  function renderDiff() {
    const T = t();
    const active = state.diffActiveStep;
    const activeStep = (active != null) ? T.ai.steps[active] : null;
    const steps = T.ai.steps.map((s, i) => `
      <button class="diff-step ${active === i ? 'on' : ''}"
              data-step="${i}" data-pos="${s.pos}"
              aria-pressed="${active === i}" aria-controls="diff-annotation">
        <span class="step-num">${String(i+1).padStart(2, '0')}</span>
        ${s.t}
      </button>
    `).join('');

    const annotation = activeStep ? `
      <h4>${activeStep.t}</h4>
      <div class="diff-row metodo">
        <span class="diff-badge">${T.ai.origins.metodo}</span>
        <span>${activeStep.observed}</span>
      </div>
      <div class="diff-row ai">
        <span class="diff-badge">${T.ai.origins.ai}</span>
        <span>${activeStep.ai_did}</span>
      </div>
      <div class="diff-row mano">
        <span class="diff-badge">${T.ai.origins.mano}</span>
        <span>${activeStep.hand_did}</span>
      </div>
      <details>
        <summary>${T.ai.prompt_summary}</summary>
        <div>${activeStep.prompt}</div>
      </details>
    ` : '';

    return `
      <section class="diff reveal">
        <div class="container">
          <div class="diff-intro">
            <div>
              <span class="eyebrow">${T.ai.eyebrow}</span>
              <h2 class="section-title" style="margin-top: 16px;">${T.ai.h2}</h2>
            </div>
            <p class="lead">${T.ai.lead}</p>
          </div>

          <div class="diff-stage" id="diff-stage" style="--diff-pos: ${state.diffPos};">
            <img class="diff-after" src="assets/image/progetti/portfolio-v2-2026.png" alt="${T.ai.after.label}" />
            <div class="diff-clip">
              <img class="diff-before" src="assets/image/progetti/mio-sito-personale.png" alt="${T.ai.before.label}" />
            </div>
            <span class="diff-label left">${T.ai.before.label}</span>
            <span class="diff-label right">${T.ai.after.label}</span>
            <input type="range" class="vh diff-range" id="diff-range"
                   min="0" max="100" step="1" value="${state.diffPos}"
                   aria-label="${T.ai.handle_aria}" />
            <div class="diff-handle" id="diff-handle" aria-hidden="true">
              <span class="diff-grip"></span>
            </div>
          </div>

          <div class="diff-annotation ${activeStep ? 'open' : ''}"
               id="diff-annotation" role="region" aria-live="polite">
            ${annotation}
          </div>

          <div class="diff-steps" role="tablist">${steps}</div>
        </div>
      </section>
    `;
  }

  function renderCTAStrip() {
    const T = t();
    return `
      <section class="cta-strip">
        <div class="container">
          <div class="cta-strip-inner">
            <div>
              <span class="eyebrow">${T.featured.eyebrow}</span>
              <h2>${T.featured.h2}</h2>
            </div>
            <button class="btn" data-route="portfolio">${T.featured.cta} ${icons.arrow}</button>
          </div>
        </div>
      </section>
    `;
  }

  // ---------- PORTFOLIO ----------
  function renderPortfolio() {
    const T = t();
    return `
      <section class="page-header">
        <div class="container">
          <div class="hero-meta-row" style="border:0; margin-bottom: 16px;">
            <span class="label-mono">${T.meta.year}</span>
            <span class="label-mono">02 · ${T.nav.portfolio}</span>
          </div>
          <h1 class="display">${T.portfolio.pageTitle_a} <em>${T.portfolio.pageTitle_b}</em></h1>
          <p class="lead" style="margin-top: 24px; max-width: 60ch;">${T.portfolio.lead}</p>
        </div>
      </section>
      ${renderTimeline()}
      ${renderSkillsFull()}
      ${renderProjects()}
      ${renderGallery()}
    `;
  }

  function renderTimeline() {
    const T = t();
    const items = T.portfolio.timeline_items.map(it => `
      <div class="timeline-item ${it.now ? 'now' : ''} reveal">
        <span class="date">${it.date}</span>
        <div>
          <h3 class="title">${it.title}</h3>
          <p>${it.subtitle}</p>
        </div>
      </div>
    `).join('');
    return `
      <section class="section">
        <div class="container">
          <div class="timeline">
            <div>
              <span class="eyebrow">${T.portfolio.timeline_eyebrow}</span>
              <h2 class="section-title" style="margin-top: 16px;">${T.portfolio.timeline_h2}</h2>
            </div>
            <div class="timeline-list">${items}</div>
          </div>
        </div>
      </section>
    `;
  }

  function renderSkillsFull() {
    const T = t();
    const clusters = T.skills.clusters.map(c => {
      const lis = c.items.map(([n, lv, l]) => `
        <li>
          <span>${n} <span class="bar" style="--lv: ${lv}%"></span></span>
          <span class="level">${l}</span>
        </li>
      `).join('');
      return `
        <div class="skills-col reveal">
          <h3>${c.title}</h3>
          <ul class="skill-list">${lis}</ul>
        </div>
      `;
    }).join('');
    return `
      <section class="skills-section" style="background: var(--bg-deep);">
        <div class="container">
          <div class="skills-grid">
            <div>
              <span class="eyebrow">${T.portfolio.skills_eyebrow}</span>
              <h2 class="section-title" style="margin-top: 16px;">${T.portfolio.skills_h2}</h2>
              <p class="lead" style="margin-top: 24px;">${T.skills.lead}</p>
            </div>
            <div class="skill-cluster-grid">${clusters}</div>
          </div>
        </div>
      </section>
    `;
  }

  function renderProjects() {
    const T = t();
    const filter = state.projectFilter || T.portfolio.filters[0];
    const filters = T.portfolio.filters.map((f, i) => `
      <button class="${f === filter ? 'on' : ''}" data-filter="${f}">${f}</button>
    `).join('');
    const all = T.portfolio.projects_list;
    const visible = (filter === T.portfolio.filters[0]) ? all : all.filter(p => p.cat.includes(filter));
    const cards = visible.map(p => `
      <article class="project-card ${p.wide ? 'wide' : ''} reveal">
        <div class="project-thumb">
          <img src="${p.img}" alt="${p.title}" loading="lazy" />
        </div>
        <div class="project-info">
          <span class="label-mono">${p.cat.join(' · ')}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <div class="project-actions">
            <a class="primary" href="${p.primary.h}" target="_blank" rel="noopener">${p.primary.l} →</a>
            <a href="${p.secondary.h}" target="_blank" rel="noopener">${p.secondary.l}</a>
          </div>
        </div>
      </article>
    `).join('') + `
      <article class="project-card coming-soon">
        <h3><em>Coming soon</em></h3>
        <p style="color: var(--ink-mute); font-size: 14px;">${state.lang === 'it' ? 'Un nuovo progetto in arrivo.' : 'A new project is on its way.'}</p>
      </article>
    `;
    return `
      <section class="projects-section">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 24px; margin-bottom: 32px;">
            <div>
              <span class="eyebrow">${T.portfolio.projects_eyebrow}</span>
              <h2 class="section-title" style="margin-top: 16px;">${T.portfolio.projects_h2}</h2>
            </div>
            <div class="projects-filter">${filters}</div>
          </div>
          <div class="projects-grid">${cards}</div>
        </div>
      </section>
    `;
  }

  function renderGallery() {
    const T = t();
    const items = T.portfolio.gallery.map(g => `
      <figure class="gallery-item" data-lightbox="${g.img}">
        <span class="gallery-meta">${g.meta}</span>
        <img src="${g.img}" alt="${g.t}" loading="lazy" />
        <figcaption class="gallery-caption">${g.t}</figcaption>
      </figure>
    `).join('');
    return `
      <section class="gallery-section">
        <div class="container">
          <div class="gallery-intro">
            <div>
              <span class="eyebrow">${T.portfolio.gallery_eyebrow}</span>
              <h2 class="section-title" style="margin-top: 16px;">${T.portfolio.gallery_h2}</h2>
            </div>
            <p>${T.portfolio.gallery_lead}</p>
          </div>
          <div class="gallery-grid">${items}</div>
          <div style="text-align: center; margin-top: 48px;">
            <a class="btn btn-ghost" href="https://www.instagram.com/myhobby_lab" target="_blank" rel="noopener" style="color: var(--bg); border-color: var(--bg);">
              ${icons.ig} ${T.portfolio.gallery_cta}
            </a>
          </div>
        </div>
      </section>
    `;
  }

  // ---------- CONTATTI ----------
  function renderContatti() {
    const T = t();
    const rows = T.contatti.info.map(([k, v]) => `
      <div class="row">
        <span class="k">${k}</span>
        <span class="v">${v}</span>
      </div>
    `).join('');
    const topics = T.contatti.form.topics.map((tp, i) => `
      <button type="button" class="chip ${i===0?'on':''}" data-topic="${tp}">${tp}</button>
    `).join('');
    return `
      <section class="page-header">
        <div class="container">
          <div class="hero-meta-row" style="border:0; margin-bottom: 16px;">
            <span class="label-mono">${T.meta.year}</span>
            <span class="label-mono">03 · ${T.nav.contatti}</span>
          </div>
        </div>
      </section>
      <section class="contact-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-aside">
              <span class="eyebrow">${T.contatti.pageTitle_a}</span>
              <h1 class="display"><em>${T.contatti.pageTitle_b}</em></h1>
              <p class="lead" style="margin-top: 32px;">${T.contatti.lead}</p>
              <div class="contact-info">${rows}</div>
            </div>
            <form class="contact-form" id="contact-form" novalidate>
              <h2 class="section-title" style="font-size: 36px; margin-bottom: 8px;">${T.contatti.form.h2}</h2>
              <p style="color: var(--ink-soft); margin-bottom: 24px;">${T.contatti.form.sub}</p>
              <div class="field">
                <label for="name">${T.contatti.form.name} *</label>
                <input type="text" id="name" required />
              </div>
              <div class="field">
                <label for="email">${T.contatti.form.email} *</label>
                <input type="email" id="email" required />
              </div>
              <div class="field">
                <label for="company">${T.contatti.form.company}</label>
                <input type="text" id="company" />
              </div>
              <div class="field">
                <label>${T.contatti.form.topic} *</label>
                <div class="chips">${topics}</div>
              </div>
              <div class="field">
                <label for="message">${T.contatti.form.message} *</label>
                <textarea id="message" placeholder="${T.contatti.form.message_ph}" required></textarea>
              </div>
              <button type="submit" class="btn">${T.contatti.form.submit} ${icons.arrow}</button>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  // ---------- Tweaks panel ----------
  function renderTweaksPanel() {
    if (!state.tweaksOpen) return '';
    const T = t();
    const opts = ['centered', 'split', 'asymmetric'].map(o => `
      <button class="${state.heroLayout===o?'on':''}" data-layout="${o}">
        <span class="layout-icon"></span>
        ${T.tweaks.options[o]}
      </button>
    `).join('');
    return `
      <div class="tweak-panel" id="tweak-panel">
        <header>
          <span>${T.tweaks.title}</span>
          <button class="close-btn" id="close-tweaks" aria-label="Close">×</button>
        </header>
        <div style="color: var(--ink-mute); font-size: 11px; margin-bottom: 12px; text-transform: none; letter-spacing: 0;">${T.tweaks.sub}</div>
        <div class="opt">${opts}</div>
      </div>
    `;
  }

  // ---------- Lightbox ----------
  function renderLightbox() {
    if (!state.lightbox) return '';
    return `
      <div class="lightbox" id="lightbox">
        <button class="lightbox-close" id="lightbox-close" aria-label="Close">×</button>
        <img src="${state.lightbox}" alt="" />
      </div>
    `;
  }

  // ---------- Render ----------
  function render() {
    const T = t();
    document.documentElement.lang = state.lang;
    document.title = state.route === 'home' ? 'Valeria Funaro · UX/UI Designer' :
                     state.route === 'portfolio' ? `${T.nav.portfolio} · Valeria Funaro` :
                     `${T.nav.contatti} · Valeria Funaro`;
    const main =
      state.route === 'portfolio' ? renderPortfolio() :
      state.route === 'contatti'  ? renderContatti() :
      renderHome();
    $app().innerHTML = renderNav() + `<main>${main}</main>` + renderFooter() + renderTweaksPanel() + renderLightbox();
    bind();
    runReveals();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function rerenderWithoutScroll() {
    const main =
      state.route === 'portfolio' ? renderPortfolio() :
      state.route === 'contatti'  ? renderContatti() :
      renderHome();
    $app().innerHTML = renderNav() + `<main>${main}</main>` + renderFooter() + renderTweaksPanel() + renderLightbox();
    bind();
    runReveals();
  }

  // ---------- Bind ----------
  function bind() {
    // Routing
    $app().querySelectorAll('[data-route]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        navigate(el.dataset.route);
      });
    });
    $app().querySelectorAll('[data-link]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const route = el.getAttribute('href').replace('#/', '');
        navigate(route);
      });
    });
    // Language
    $app().querySelectorAll('[data-lang]').forEach(el => {
      el.addEventListener('click', () => {
        state.lang = el.dataset.lang;
        localStorage.setItem('pv_lang', state.lang);
        render();
      });
    });
    // Filter
    $app().querySelectorAll('[data-filter]').forEach(el => {
      el.addEventListener('click', () => {
        state.projectFilter = el.dataset.filter;
        rerenderWithoutScroll();
      });
    });
    // Topic chips
    $app().querySelectorAll('[data-topic]').forEach(el => {
      el.addEventListener('click', () => {
        $app().querySelectorAll('[data-topic]').forEach(b => b.classList.remove('on'));
        el.classList.add('on');
      });
    });
    // Form
    const form = $app().querySelector('#contact-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const ok = form.checkValidity();
        if (!ok) { form.reportValidity(); return; }
        showToast(t().contatti.form.sent);
        form.reset();
        $app().querySelectorAll('[data-topic]').forEach((b, i) => b.classList.toggle('on', i===0));
      });
    }
    // Lightbox open
    $app().querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        state.lightbox = el.dataset.lightbox;
        rerenderWithoutScroll();
      });
    });
    // Lightbox close
    const lb = $app().querySelector('#lightbox');
    if (lb) {
      lb.addEventListener('click', e => {
        if (e.target.id === 'lightbox' || e.target.id === 'lightbox-close') {
          state.lightbox = null;
          rerenderWithoutScroll();
        }
      });
    }
    // Tweaks
    $app().querySelectorAll('[data-layout]').forEach(el => {
      el.addEventListener('click', () => {
        state.heroLayout = el.dataset.layout;
        try {
          window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { heroLayout: state.heroLayout } }, '*');
        } catch (e) {}
        rerenderWithoutScroll();
      });
    });
    const close = $app().querySelector('#close-tweaks');
    if (close) {
      close.addEventListener('click', () => {
        state.tweaksOpen = false;
        try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(e){}
        rerenderWithoutScroll();
      });
    }
    // Diff slider (componente interattivo v1↔v2)
    bindDiff();
    // Nav scroll
    onScrollNav();
  }

  // ---------- Diff slider helpers ----------
  // Aggiorna la posizione dello slider (clip-path via CSS custom property)
  function setDiffPos(pos) {
    pos = Math.max(0, Math.min(100, pos));
    state.diffPos = pos;
    const stage = $app().querySelector('#diff-stage');
    if (stage) stage.style.setProperty('--diff-pos', pos);
    const range = $app().querySelector('#diff-range');
    if (range && Math.round(range.valueAsNumber) !== Math.round(pos)) {
      range.value = String(Math.round(pos));
    }
  }

  // Anima lo slider da una posizione all'altra (rispetta reduced motion)
  function animateDiff(from, to) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setDiffPos(to); return; }
    const dur = 450;
    const start = performance.now();
    const tick = (now) => {
      const tt = Math.min(1, (now - start) / dur);
      const eased = tt < 0.5 ? 2*tt*tt : 1 - Math.pow(-2*tt + 2, 2) / 2;
      setDiffPos(from + (to - from) * eased);
      if (tt < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Riscrive il contenuto dell'annotazione in base allo step attivo
  function updateDiffAnnotation() {
    const T = t();
    const node = $app().querySelector('#diff-annotation');
    if (!node) return;
    const active = state.diffActiveStep;
    if (active == null) {
      node.classList.remove('open');
      node.innerHTML = '';
      return;
    }
    const s = T.ai.steps[active];
    node.innerHTML = `
      <h4>${s.t}</h4>
      <div class="diff-row metodo">
        <span class="diff-badge">${T.ai.origins.metodo}</span>
        <span>${s.observed}</span>
      </div>
      <div class="diff-row ai">
        <span class="diff-badge">${T.ai.origins.ai}</span>
        <span>${s.ai_did}</span>
      </div>
      <div class="diff-row mano">
        <span class="diff-badge">${T.ai.origins.mano}</span>
        <span>${s.hand_did}</span>
      </div>
      <details>
        <summary>${T.ai.prompt_summary}</summary>
        <div>${s.prompt}</div>
      </details>
    `;
    node.classList.add('open');
  }

  // Bind eventi del componente diff
  function bindDiff() {
    const stage = $app().querySelector('#diff-stage');
    if (!stage) return; // non siamo in home

    const range = stage.querySelector('#diff-range');
    const handle = stage.querySelector('#diff-handle');

    // Input del range nascosto → guida il clip via CSS var
    range.addEventListener('input', () => setDiffPos(parseInt(range.value, 10)));

    // Drag dell'handle (pointer events, mouse + touch)
    let dragging = false;
    const updateFromX = (clientX) => {
      const rect = stage.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setDiffPos(pct);
    };
    handle.addEventListener('pointerdown', (e) => {
      dragging = true;
      try { handle.setPointerCapture(e.pointerId); } catch(_) {}
      updateFromX(e.clientX);
    });
    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      updateFromX(e.clientX);
    });
    const endDrag = (e) => {
      if (!dragging) return;
      dragging = false;
      try { handle.releasePointerCapture(e.pointerId); } catch(_) {}
    };
    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);

    // Click step → muove lo slider e apre/chiude l'annotazione (toggle)
    $app().querySelectorAll('.diff-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.step, 10);
        const pos = parseInt(btn.dataset.pos, 10);
        state.diffActiveStep = (state.diffActiveStep === i) ? null : i;
        if (state.diffActiveStep != null) {
          animateDiff(parseInt(range.value, 10), pos);
        }
        $app().querySelectorAll('.diff-step').forEach((b, idx) => {
          const on = (idx === state.diffActiveStep);
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        updateDiffAnnotation();
      });
    });

    // ESC chiude l'annotazione (listener globale, ri-registrato a ogni bind)
    window.removeEventListener('keydown', window.__pvDiffEsc || (() => {}));
    window.__pvDiffEsc = (e) => {
      if (e.key !== 'Escape') return;
      if (state.diffActiveStep == null) return;
      state.diffActiveStep = null;
      $app().querySelectorAll('.diff-step').forEach(b => {
        b.classList.remove('on');
        b.setAttribute('aria-pressed', 'false');
      });
      updateDiffAnnotation();
    };
    window.addEventListener('keydown', window.__pvDiffEsc);
  }

  function navigate(route) {
    state.route = route;
    location.hash = '#/' + route;
    render();
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  function onScrollNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const handler = () => {
      if (window.scrollY > 8) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.removeEventListener('scroll', window.__pvScroll || (()=>{}));
    window.__pvScroll = handler;
    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }

  // ---------- Reveal animation ----------
  function runReveals() {
    const els = $app().querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(e => e.classList.add('in'));
      return;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    els.forEach(e => obs.observe(e));
  }

  // ---------- Edit Mode protocol ----------
  window.addEventListener('message', e => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') {
      state.tweaksOpen = true;
      rerenderWithoutScroll();
    } else if (d.type === '__deactivate_edit_mode') {
      state.tweaksOpen = false;
      rerenderWithoutScroll();
    }
  });

  window.addEventListener('hashchange', () => {
    const newRoute = location.hash.replace('#/', '') || 'home';
    if (newRoute !== state.route) {
      state.route = newRoute;
      render();
    }
  });

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    render();
    // Announce tweaks availability AFTER listener is set
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e){}
  });
})();

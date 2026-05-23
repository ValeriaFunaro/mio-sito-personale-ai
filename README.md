# Portfolio Valeria Funaro — Rebrand 2026

Portfolio personale di **Valeria Funaro**, Junior UX/UI Designer.
Sito statico in vanilla HTML/CSS/JS, bilingue IT/EN, deploy automatico su **GitHub Pages**.

---

## Tech stack

- **HTML5** + **CSS3** (niente preprocessor, niente Tailwind, niente build)
- **JavaScript vanilla** — SPA con hash routing, render basato su template strings
- **Google Fonts**: Instrument Serif (display), Geist (body), JetBrains Mono (meta)
- **Asset statici** in `assets/image/`
- **Niente dipendenze npm** — il sito gira così com'è da qualsiasi server HTTP

---

## Avviare il sito in locale

Serve un server HTTP locale: i Google Fonts e gli asset relativi non funzionano da `file://`.

### Opzione A — Python (già installato su macOS/Linux)

Dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

Poi apri il browser su **http://localhost:8000**.

### Opzione B — Node (se hai Node installato)

```bash
npx serve .
```

### Opzione C — VS Code Live Server

Installa l'estensione **Live Server**, click destro su `index.html` → *Open with Live Server*.

---

## Struttura del progetto

```
.
├── index.html              shell minimale (un solo <div id="app">)
├── styles.css              design system: token, tipografia, layout, componenti
├── app.js                  SPA: state, render, routing, binding eventi
├── i18n.js                 contenuti IT / EN per ogni sezione
├── assets/
│   └── image/
│       ├── immagine-profilo.webp
│       ├── disegni/        gallery di disegni a mano
│       └── progetti/       screenshot dei progetti
├── README.md               (questo file)
└── .github/
    └── workflows/
        └── deploy.yml      pipeline GitHub Actions
```

---

## Come funziona il codice (mappa rapida)

- **`app.js`** ha un oggetto `state` centrale (`lang`, `route`, `diffPos`, `diffActiveStep`, ecc.). Ogni cambio di stato passa per `render()` o `rerenderWithoutScroll()`, che riscrivono `#app` concatenando `nav + main + footer + tweaks + lightbox`.
- Le viste sono funzioni che restituiscono stringhe HTML (`renderHero`, `renderAbout`, `renderDiff`, …). Niente JSX, niente framework.
- **`i18n.js`** espone `window.PV_I18N.it` e `window.PV_I18N.en`. `state.lang` decide quale ramo viene usato; la preferenza è salvata in `localStorage`.
- Il **componente `.diff`** (slider v1↔v2 nella home) è l'unica parte interattiva non triviale: `renderDiff()` genera l'HTML, `bindDiff()` aggancia drag, tastiera, click sugli step.

Per cambiare un testo: apri **`i18n.js`** e modifica la chiave corrispondente nei due rami `it:` e `en:`.

Per cambiare un colore o uno spacing: apri **`styles.css`**, le variabili sono in `:root` all'inizio del file.

---

## Deploy automatico su GitHub Pages

Ogni push sul branch `main` triggera la pipeline `.github/workflows/deploy.yml`, che pubblica l'intero contenuto del repo su GitHub Pages.

### Setup iniziale (una volta sola)

1. Crea il repository su GitHub e fai il primo push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tuo-username>/<nome-repo>.git
   git push -u origin main
   ```

2. Vai sul repo → **Settings → Pages**.

3. Sotto **Build and deployment → Source**, seleziona **GitHub Actions**.

4. Torna nella tab **Actions** del repo: vedrai partire il primo deploy.

L'URL pubblico sarà `https://<tuo-username>.github.io/<nome-repo>/`.

### Deploy manuale

Da GitHub: **Actions → Deploy to GitHub Pages → Run workflow → Run**.

### Cosa fa la pipeline

- Checkout del codice
- Configurazione di GitHub Pages
- Upload dell'intera cartella come artifact
- Deploy su Pages

Non c'è build step: il sito è già "compilato" così com'è.

---

## Modificare e ri-deployare

```bash
# Modifica i file (es. i18n.js per cambiare un testo)
git add .
git commit -m "Aggiorno copy hero"
git push
```

In 30-60 secondi il sito è online aggiornato.

---

## Browser supportati

Chrome, Edge, Safari, Firefox — versioni degli ultimi 2 anni.
Il sito usa `clip-path`, CSS custom properties, `color-mix()`, `aspect-ratio` — tutto supportato dal 2022 in poi.

---

## Licenza e contenuti

- **Codice**: rilasciato per uso personale e didattico.
- **Foto, disegni, testi**: © 2026 Valeria Funaro. Tutti i diritti riservati.
- **Font**: Instrument Serif, Geist, JetBrains Mono (licenze OFL/SIL via Google Fonts).

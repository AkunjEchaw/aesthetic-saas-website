# ✨ Aura — Aesthetic Modern SaaS Website

A high-conversion, hyper-polished SaaS landing page engineered with the modern Linear/Vercel/Raycast aesthetic. Built with pure modern web technologies (Tailwind CSS, Lucide Icons, Vanilla JavaScript), offering zero-build-step simplicity and lightning-fast load times.

---

## 🌟 Key Features

1. **Aesthetic Design System**:
   - Deep obsidian dark-mode foundation with subtle aurora radial glow orbs.
   - Glassmorphism (`backdrop-blur`) cards with glowing micro-borders.
   - Fluid responsive layout (desktop, tablet, mobile).
   - Light / Dark mode toggle with `localStorage` state persistence.

2. **Interactive Platform Demonstration**:
   - Realistic SaaS application mock dashboard window with macOS-style controls.
   - Dynamic tabbed switcher:
     - **Agent Pipelines**: Visual multi-node graph with active execution states.
     - **Live Telemetry & Logs**: Real-time event stream simulation and edge ping tracker.
     - **SDK Synthesis**: Code snippets with language switcher (TypeScript, Python, cURL) and 1-click clipboard copy.
     - **Security Vault**: SOC2 Type II, Zero-Knowledge KMS, and Deterministic Guardrails showcase.

3. **Interactive ROI / Value Calculator**:
   - Real-time dynamic sliders for Team Size (1–100 engineers) and Hourly Rate (\$30–\$200/hr).
   - Instant calculation of Monthly Hours Saved, Net Annual Financial Value, and ROI Multiple.

4. **Dynamic Pricing Matrix**:
   - Monthly vs Annual billing toggle with **"Save 25% + 2 Months Free"** highlight.
   - Animated price transitions.
   - Tiered packages: Starter (\$0), Pro (\$29/mo, Featured with glowing gradient border), and Enterprise (\$99/mo).

5. **Curated Social Proof & Wall of Love**:
   - Infinite logo marquee ticker featuring top dev-tool logos.
   - Real-time testimonial category filtering (Founders & CTOs, Principal Engineers, Product Designers).

6. **Interactive FAQ & Micro-Interactions**:
   - Smooth accordion collapse/expand.
   - Interactive "Schedule Demo" / "Book Walkthrough" modal dialog with validation.
   - Toast notification engine with self-dismissing alerts.
   - Newsletter waitlist input with regex validation.

---

## 🚀 Quick Start / How to Run

Because this project is built with zero runtime dependencies:

### Option A: Open directly in your browser
Double-click `index.html` in Windows Explorer, or run in PowerShell:
```powershell
Start-Process "C:\Users\Plug237\.gemini\antigravity\scratch\aesthetic-saas-website\index.html"
```

### Option B: Deploy for Free (1-Click)
- **Vercel**: Run `npx vercel` or drag-and-drop the `aesthetic-saas-website` folder onto [vercel.com](https://vercel.com).
- **Netlify**: Drag-and-drop the folder directly onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages**: Push this directory to a GitHub repository and turn on GitHub Pages under repository settings.

---

## 📁 File Structure

```
aesthetic-saas-website/
├── index.html     # Semantic, accessible HTML5 structure & layout
├── style.css      # Aurora mesh gradients, keyframe animations, glass cards
├── app.js         # Interactive calculators, tabs, theme toggle, modals, toasts
└── README.md      # Documentation and deployment guide
```

---

## 🎨 Customizing the Design

- **Colors & Glows**: Edit the CSS variables in `style.css` under `:root` (`--accent-purple`, `--accent-cyan`, `--glow-primary`).
- **Brand Name**: Search and replace `Aura` in `index.html` with your SaaS product's name.
- **Copy & Pricing**: Adjust the pricing values and slider formulas inside `app.js` (`calculateROI()` and `animateValue()`).

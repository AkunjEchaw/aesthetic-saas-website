/**
 * AURA SAAS - Interactive Core Logic
 * Handles micro-interactions, ROI calculator, tabs, pricing switch, modals, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 1. Theme Management (Dark / Light)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Default to dark mode if not specified
  const savedTheme = localStorage.getItem('aura-theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    document.documentElement.classList.remove('light');
    if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
  }
  if (window.lucide) lucide.createIcons();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      const newTheme = isLight ? 'light' : 'dark';
      localStorage.setItem('aura-theme', newTheme);
      
      if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        if (window.lucide) lucide.createIcons();
      }
      showToast('Theme Changed', `Switched to ${isLight ? 'Light' : 'Dark'} aesthetic mode.`);
    });
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenu.classList.toggle('hidden');
      const icon = mobileMenuBtn.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', isExpanded ? 'menu' : 'x');
        if (window.lucide) lucide.createIcons();
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) lucide.createIcons();
        }
      });
    });
  }

  // 3. Interactive Showcase Tabs
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const showcasePanels = document.querySelectorAll('.showcase-panel');

  showcaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      // Update Tab Buttons
      showcaseTabs.forEach(t => {
        t.classList.remove('bg-purple-600/20', 'border-purple-500/50', 'text-white', 'text-purple-300');
        t.classList.add('text-slate-400', 'border-transparent');
      });
      tab.classList.remove('text-slate-400', 'border-transparent');
      tab.classList.add('bg-purple-600/20', 'border-purple-500/50', 'text-purple-300');

      // Switch Panels
      showcasePanels.forEach(panel => {
        if (panel.id === target) {
          panel.classList.remove('hidden');
          panel.classList.add('flex');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('flex');
        }
      });
      if (window.lucide) lucide.createIcons();
    });
  });

  // 4. Code Language Switcher in Bento Grid
  const codeBtns = document.querySelectorAll('.code-lang-btn');
  const codeSnippet = document.getElementById('code-snippet-text');
  
  const codeSnippets = {
    ts: `import { Aura } from "@aura/sdk";

// Initialize autonomous agent workflow
const agent = new Aura.Agent({
  model: "aura-reasoning-v3",
  memory: "adaptive-vector",
  telemetry: true,
});

const result = await agent.orchestrate({
  task: "Optimize distributed PostgreSQL latency",
  autoDeploy: true,
  safeguards: "strict",
});

console.log("Optimized pipeline latency:", result.metrics.latencyMs);`,
    python: `from aura_sdk import AuraClient

client = AuraClient(api_key="aur_live_99482")

# Spawn an autonomous operations worker
workflow = client.pipelines.create(
    goal="Analyze telemetry & heal anomalous pods",
    concurrency=16,
    approval_policy="auto-scale",
)

summary = workflow.execute_sync()
print(f"Autonomous health score: {summary.health_percent}%")`,
    curl: `curl -X POST https://api.aura.dev/v1/orchestrations \\
  -H "Authorization: Bearer aur_live_99482" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "aura-3.2-flash",
    "prompt": "Synthesize microservices architecture diagram",
    "streaming": true
  }'`
  };

  codeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      codeBtns.forEach(b => b.classList.remove('text-purple-400', 'border-b-2', 'border-purple-500'));
      btn.classList.add('text-purple-400', 'border-b-2', 'border-purple-500');

      if (codeSnippet && codeSnippets[lang]) {
        codeSnippet.textContent = codeSnippets[lang];
      }
    });
  });

  // Copy Code Button
  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn && codeSnippet) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeSnippet.textContent).then(() => {
        const originalText = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-400 inline"></i> <span class="text-xs text-emerald-400">Copied!</span>`;
        if (window.lucide) lucide.createIcons();
        showToast('Code Copied', 'SDK snippet copied to your clipboard!');
        setTimeout(() => {
          copyCodeBtn.innerHTML = originalText;
          if (window.lucide) lucide.createIcons();
        }, 2200);
      });
    });
  }

  // 5. Interactive ROI / Savings Calculator
  const teamSizeSlider = document.getElementById('slider-team-size');
  const hourlyRateSlider = document.getElementById('slider-hourly-rate');
  const teamSizeVal = document.getElementById('val-team-size');
  const hourlyRateVal = document.getElementById('val-hourly-rate');

  const metricHoursSaved = document.getElementById('calc-hours-saved');
  const metricDollarSaved = document.getElementById('calc-dollar-saved');
  const metricRoiMultiplier = document.getElementById('calc-roi-multiplier');

  function calculateROI() {
    if (!teamSizeSlider || !hourlyRateSlider) return;

    const teamSize = parseInt(teamSizeSlider.value, 10);
    const hourlyRate = parseInt(hourlyRateSlider.value, 10);

    if (teamSizeVal) teamSizeVal.textContent = teamSize;
    if (hourlyRateVal) hourlyRateVal.textContent = `$${hourlyRate}`;

    // Calculation formulas
    // Aura saves ~7.5 hours per engineer each week on manual DevOps & plumbing
    const weeklyHoursSaved = teamSize * 7.5;
    const monthlyHoursSaved = weeklyHoursSaved * 4.33;
    const annualHoursSaved = weeklyHoursSaved * 50; // 50 work weeks
    const annualGrossSavings = annualHoursSaved * hourlyRate;

    // Estimated annual subscription for team
    const estimatedAuraCost = (teamSize * 29) * 12;
    const netAnnualSavings = Math.max(0, annualGrossSavings - estimatedAuraCost);
    const roiMultiplier = Math.round((annualGrossSavings / Math.max(estimatedAuraCost, 1)));

    if (metricHoursSaved) {
      metricHoursSaved.textContent = `${Math.round(monthlyHoursSaved).toLocaleString()} hrs`;
    }
    if (metricDollarSaved) {
      metricDollarSaved.textContent = `$${Math.round(netAnnualSavings).toLocaleString()}`;
    }
    if (metricRoiMultiplier) {
      metricRoiMultiplier.textContent = `${Math.min(roiMultiplier, 48)}x`;
    }
  }

  if (teamSizeSlider && hourlyRateSlider) {
    teamSizeSlider.addEventListener('input', calculateROI);
    hourlyRateSlider.addEventListener('input', calculateROI);
    calculateROI();
  }

  // 6. Interactive Pricing Switcher (Monthly vs Annual)
  const billingToggle = document.getElementById('billing-toggle');
  const pricePro = document.getElementById('price-pro');
  const priceScale = document.getElementById('price-scale');
  const billingCycleLabels = document.querySelectorAll('.billing-cycle-label');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;

      billingCycleLabels.forEach(label => {
        label.textContent = isAnnual ? '/month, billed annually' : '/month, billed monthly';
      });

      if (pricePro) {
        animateValue(pricePro, isAnnual ? 39 : 29, isAnnual ? 29 : 39, 300);
      }
      if (priceScale) {
        animateValue(priceScale, isAnnual ? 129 : 99, isAnnual ? 99 : 129, 300);
      }
    });
  }

  function animateValue(elem, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      elem.textContent = `$${current}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // 7. Interactive Testimonials Filter
  const filterBtns = document.querySelectorAll('.testimonial-filter-btn');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      filterBtns.forEach(b => {
        b.classList.remove('bg-purple-600', 'text-white', 'shadow-lg', 'shadow-purple-600/30');
        b.classList.add('bg-white/5', 'text-slate-400');
      });
      btn.classList.add('bg-purple-600', 'text-white', 'shadow-lg', 'shadow-purple-600/30');
      btn.classList.remove('bg-white/5', 'text-slate-400');

      testimonialCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
          card.classList.add('block');
        } else {
          card.classList.add('hidden');
          card.classList.remove('block');
        }
      });
    });
  });

  // 8. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const chevron = item.querySelector('.faq-chevron');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close all items
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherChevron = otherItem.querySelector('.faq-chevron');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherChevron) otherChevron.classList.remove('rotate-180');
        });

        // Toggle current
        if (!isOpen) {
          content.classList.remove('hidden');
          if (chevron) chevron.classList.add('rotate-180');
        }
      });
    }
  });

  // 9. Early Access Newsletter Subscription
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');

  if (newsletterForm && newsletterEmail) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      if (!email || !email.includes('@')) {
        showToast('Invalid Email', 'Please enter a valid work email address.', 'error');
        return;
      }

      newsletterEmail.value = '';
      showToast('Welcome to Aura Beta! 🎉', `We reserved access for ${email}. Check your inbox soon!`, 'success');
    });
  }

  // 10. Demo Modal Handler
  const modal = document.getElementById('demo-modal');
  const modalTriggers = document.querySelectorAll('.open-demo-modal');
  const modalCloseBtn = document.getElementById('close-demo-modal');
  const demoForm = document.getElementById('demo-form');

  function openModal() {
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      if (window.lucide) lucide.createIcons();
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  modalTriggers.forEach(btn => btn.addEventListener('click', openModal));
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mx-auto"></div>`;

      setTimeout(() => {
        closeModal();
        demoForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
        showToast('Demo Reserved! 🚀', 'Our product engineering team will contact you within 2 business hours.');
      }, 1000);
    });
  }

  // 11. Toast Notification Utility
  function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `glass-card p-4 rounded-xl border flex items-start gap-3 shadow-2xl transition-all duration-300 transform translate-y-3 opacity-0 w-80 max-w-[90vw] ${
      type === 'error' ? 'border-rose-500/40 bg-rose-950/80' : 'border-purple-500/40 bg-slate-900/90'
    }`;

    const iconName = type === 'error' ? 'alert-triangle' : 'sparkles';
    const iconColor = type === 'error' ? 'text-rose-400' : 'text-purple-400';

    toast.innerHTML = `
      <div class="mt-0.5 ${iconColor}">
        <i data-lucide="${iconName}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-white">${title}</h4>
        <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-white transition-colors" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Real-time telemetry simulation in Dashboard Panel
  const latencyBadge = document.getElementById('live-latency-ping');
  if (latencyBadge) {
    setInterval(() => {
      const ping = Math.floor(Math.random() * 8) + 12; // 12-19ms
      latencyBadge.textContent = `${ping}ms`;
    }, 3000);
  }
});

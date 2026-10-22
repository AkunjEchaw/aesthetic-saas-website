/**
 * LUMEN 3D - Interactive Engine & Three.js Spatial Renderer
 * High-End White Aesthetic, Real-Time 3D Geometry, Mouse Tracking & Spatial Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // =========================================================================
  // 1. THREE.JS INTERACTIVE 3D HERO CANVAS
  // =========================================================================
  const canvasContainer = document.getElementById('hero-3d-stage');
  const canvas = document.getElementById('webgl-hero-canvas');

  if (canvas && window.THREE) {
    initThreeDScene(canvas, canvasContainer);
  }

  function initThreeDScene(canvasElement, container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.2;

    // Renderer with Anti-Aliasing and Alpha Transparency
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // 3D Objects Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Primary Central 3D Sculpture: Geodesic Torus Knot
    const knotGeometry = new THREE.TorusKnotGeometry(1.4, 0.42, 160, 32);
    
    // Materials Presets (Liquid Titanium default)
    const materials = {
      titanium: new THREE.MeshPhysicalMaterial({
        color: 0xf4f4f6,
        metalness: 0.9,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
      }),
      crystal: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.7,
        ior: 1.5,
        reflectivity: 0.95,
        clearcoat: 1.0,
      }),
      wireframe: new THREE.MeshStandardMaterial({
        color: 0x09090b,
        wireframe: true,
        roughness: 0.5,
      })
    };

    let currentMaterial = materials.titanium;
    const knotMesh = new THREE.Mesh(knotGeometry, currentMaterial);
    mainGroup.add(knotMesh);

    // 2. Orbital Outer Ring
    const ringGeometry = new THREE.TorusGeometry(2.35, 0.035, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.8,
      roughness: 0.2
    });
    const orbitalRing = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitalRing.rotation.x = Math.PI / 3;
    mainGroup.add(orbitalRing);

    // 3. Orbital Secondary Slanted Ring
    const ring2Geometry = new THREE.TorusGeometry(2.6, 0.02, 16, 100);
    const ring2Material = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      metalness: 0.9,
      roughness: 0.15
    });
    const orbitalRing2 = new THREE.Mesh(ring2Geometry, ring2Material);
    orbitalRing2.rotation.y = Math.PI / 4;
    orbitalRing2.rotation.x = Math.PI / 6;
    mainGroup.add(orbitalRing2);

    // 4. Floating Micro-Particle Swarm
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x71717a,
      size: 0.04,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Lighting (White Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xebf4ff, 1.2);
    fillLight.position.set(-6, -4, -3);
    scene.add(fillLight);

    // Dynamic Cursor-Tracking Point Light
    const cursorLight = new THREE.PointLight(0xffffff, 2.5, 12);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // Mouse & Inertia Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Update Cursor Light Position
      cursorLight.position.x = mouseX * 4;
      cursorLight.position.y = mouseY * 3;

      if (!isDragging) {
        targetRotationY = mouseX * 0.8;
        targetRotationX = -mouseY * 0.8;
      }
    });

    // Drag Interaction on Canvas
    canvasElement.addEventListener('pointerdown', (e) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      const deltaY = e.clientY - previousPointerY;

      mainGroup.rotation.y += deltaX * 0.008;
      mainGroup.rotation.x += deltaY * 0.008;

      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    // Material Switcher Buttons
    const materialBtns = document.querySelectorAll('.mode-switch-btn');
    materialBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (materials[mode]) {
          knotMesh.material = materials[mode];

          materialBtns.forEach(b => {
            b.classList.remove('bg-black', 'text-white', 'shadow-md');
            b.classList.add('bg-white/80', 'text-zinc-700');
          });
          btn.classList.add('bg-black', 'text-white', 'shadow-md');
          btn.classList.remove('bg-white/80', 'text-zinc-700');
          showToast('3D Shader Applied', `Switched viewport rendering to ${btn.textContent.trim()}.`);
        }
      });
    });

    // Render Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Inertia Damping
      if (!isDragging) {
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;
      }

      // Continuous Idle Float & Rotation
      knotMesh.rotation.y = elapsedTime * 0.25;
      knotMesh.rotation.z = elapsedTime * 0.15;

      orbitalRing.rotation.z = -elapsedTime * 0.3;
      orbitalRing2.rotation.z = elapsedTime * 0.2;

      particleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    }
    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 650;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
  }

  // =========================================================================
  // 2. 3D CARD TILT ON MOUSE HOVER
  // =========================================================================
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // =========================================================================
  // 3. CODE SNIPPET TABS & CLIPBOARD COPY
  // =========================================================================
  const codeTabs = document.querySelectorAll('.code-tab-btn');
  const codeDisplay = document.getElementById('code-display-block');

  const snippets = {
    ts: `import { Lumen3D } from "@lumen/spatial";

// Initialize hardware-accelerated 3D neural kernel
const kernel = new Lumen3D.Kernel({
  accelerator: "webgpu",
  renderQuality: "ultra-precision",
  antiAlias: true,
});

// Stream real-time spatial predictions
const session = await kernel.spawnSimulation({
  geometry: "parametric-manifold",
  concurrency: 64,
  precision: "fp16",
});

console.log("Kernel FPS:", session.metrics.fps); // 120 FPS`,
    python: `from lumen_spatial import SpatialKernel

kernel = SpatialKernel(api_key="lum_live_94821")

# Synthesize real-time 3D coordinate meshes
mesh = kernel.geometry.synthesize(
    prompt="Crystalline parametric torus with high-specular glass",
    subdivisions=64,
    export_format="gltf-binary"
)

mesh.deploy_edge(region="auto")
print(f"Mesh rendered in {mesh.latency_ms}ms")`,
    curl: `curl -X POST https://api.lumen3d.io/v1/spatial/synthesize \\
  -H "Authorization: Bearer lum_live_94821" \\
  -H "Content-Type: application/json" \\
  -d '{
    "engine": "lumen-3.0-spatial",
    "topology": "geodesic-icosahedron",
    "material": "liquid-titanium",
    "samples": 128
  }'`
  };

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const lang = tab.getAttribute('data-lang');
      codeTabs.forEach(t => {
        t.classList.remove('bg-black', 'text-white');
        t.classList.add('text-zinc-600', 'hover:text-black');
      });
      tab.classList.add('bg-black', 'text-white');
      tab.classList.remove('text-zinc-600', 'hover:text-black');

      if (codeDisplay && snippets[lang]) {
        codeDisplay.textContent = snippets[lang];
      }
    });
  });

  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn && codeDisplay) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeDisplay.textContent).then(() => {
        const orig = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 inline"></i> <span class="text-xs text-emerald-600">Copied!</span>`;
        if (window.lucide) lucide.createIcons();
        showToast('Copied', 'Spatial code snippet copied to your clipboard!');
        setTimeout(() => {
          copyCodeBtn.innerHTML = orig;
          if (window.lucide) lucide.createIcons();
        }, 2200);
      });
    });
  }

  // =========================================================================
  // 4. INTERACTIVE VALUE / COMPUTE CALCULATOR
  // =========================================================================
  const sliderScale = document.getElementById('calc-slider-scale');
  const sliderThroughput = document.getElementById('calc-slider-throughput');
  const valScale = document.getElementById('calc-val-scale');
  const valThroughput = document.getElementById('calc-val-throughput');

  const outFps = document.getElementById('calc-out-fps');
  const outHours = document.getElementById('calc-out-hours');
  const outSaved = document.getElementById('calc-out-saved');

  function updateCalculator() {
    if (!sliderScale || !sliderThroughput) return;

    const scale = parseInt(sliderScale.value, 10);
    const throughput = parseInt(sliderThroughput.value, 10);

    if (valScale) valScale.textContent = `${scale} Devs`;
    if (valThroughput) valThroughput.textContent = `${throughput}k Meshes`;

    const hoursSaved = Math.round(scale * 18.5);
    const annualSaved = Math.round(scale * 24000 + throughput * 80);
    const fps = Math.min(120, Math.round(60 + (scale * 0.4)));

    if (outFps) outFps.textContent = `${fps} FPS`;
    if (outHours) outHours.textContent = `${hoursSaved.toLocaleString()} hrs/mo`;
    if (outSaved) outSaved.textContent = `$${annualSaved.toLocaleString()}`;
  }

  if (sliderScale && sliderThroughput) {
    sliderScale.addEventListener('input', updateCalculator);
    sliderThroughput.addEventListener('input', updateCalculator);
    updateCalculator();
  }

  // =========================================================================
  // 5. PRICING MONTHLY / ANNUAL SWITCHER
  // =========================================================================
  const billingToggle = document.getElementById('billing-toggle');
  const pricePro = document.getElementById('price-pro');
  const priceEnterprise = document.getElementById('price-enterprise');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;
      if (pricePro) pricePro.textContent = isAnnual ? '$39' : '$49';
      if (priceEnterprise) priceEnterprise.textContent = isAnnual ? '$149' : '$189';
    });
  }

  // =========================================================================
  // 6. FAQ ACCORDION
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const chevron = item.querySelector('.faq-chevron');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        faqItems.forEach(other => {
          const otherContent = other.querySelector('.faq-content');
          const otherChevron = other.querySelector('.faq-chevron');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherChevron) otherChevron.classList.remove('rotate-180');
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (chevron) chevron.classList.add('rotate-180');
        }
      });
    }
  });

  // =========================================================================
  // 7. DEMO MODAL
  // =========================================================================
  const modal = document.getElementById('demo-modal');
  const openModalBtns = document.querySelectorAll('.open-demo-modal');
  const closeModalBtn = document.getElementById('close-demo-modal');
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

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

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
      const btn = demoForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mx-auto"></div>`;

      setTimeout(() => {
        closeModal();
        demoForm.reset();
        btn.disabled = false;
        btn.innerHTML = orig;
        showToast('Session Reserved', 'Our graphics engineering team will contact you shortly.');
      }, 900);
    });
  }

  // =========================================================================
  // 8. TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `glass-card-white p-4 rounded-xl border border-black/10 flex items-start gap-3 shadow-xl transition-all duration-300 transform translate-y-3 opacity-0 w-80 max-w-[90vw] bg-white`;

    toast.innerHTML = `
      <div class="mt-0.5 text-black">
        <i data-lucide="check-circle" class="w-4 h-4"></i>
      </div>
      <div class="flex-1">
        <h4 class="text-xs font-semibold text-zinc-900">${title}</h4>
        <p class="text-xs text-zinc-500 mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button class="text-zinc-400 hover:text-black transition-colors" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
});

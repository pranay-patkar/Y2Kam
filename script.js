const fileInput = document.getElementById('fileInput');
const openBtn = document.getElementById('openBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const emptyState = document.getElementById('emptyState');
const saveBtn = document.getElementById('saveBtn');
const statusLeft = document.getElementById('statusLeft');

const themeBlueBtn = document.getElementById('themeBlueBtn');
const themePinkBtn = document.getElementById('themePinkBtn');
const themeOrangeBtn = document.getElementById('themeOrangeBtn');
const themeMintBtn = document.getElementById('themeMintBtn');
const themePlumBtn = document.getElementById('themePlumBtn');
const themeForestBtn = document.getElementById('themeForestBtn');
const themeCharcoalBtn = document.getElementById('themeCharcoalBtn');
const themeHotredBtn = document.getElementById('themeHotredBtn');
const themeButtons = { blue: themeBlueBtn, pink: themePinkBtn, orange: themeOrangeBtn, mint: themeMintBtn, plum: themePlumBtn, forest: themeForestBtn, charcoal: themeCharcoalBtn, hotred: themeHotredBtn };

function setTheme(name) {
  document.body.className = name === 'blue' ? '' : 'theme-' + name;
  Object.keys(themeButtons).forEach(key => {
    themeButtons[key].classList.toggle('active', key === name);
  });
}
themeBlueBtn.addEventListener('click', () => setTheme('blue'));
themePinkBtn.addEventListener('click', () => setTheme('pink'));
themeOrangeBtn.addEventListener('click', () => setTheme('orange'));
themeMintBtn.addEventListener('click', () => setTheme('mint'));
themePlumBtn.addEventListener('click', () => setTheme('plum'));
themeForestBtn.addEventListener('click', () => setTheme('forest'));
themeCharcoalBtn.addEventListener('click', () => setTheme('charcoal'));
themeHotredBtn.addEventListener('click', () => setTheme('hotred'));

// --- Menu bar (File / Edit / Effects / Help) ---
const menubar = document.getElementById('menubar');
const menuTriggers = menubar.querySelectorAll('.menu-trigger');

function closeAllMenus() {
  menubar.querySelectorAll('.menu-dropdown.open').forEach(d => d.classList.remove('open'));
  menuTriggers.forEach(t => t.classList.remove('menu-open'));
}

menuTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const menuId = trigger.dataset.menu;
    const dropdown = document.getElementById(menuId);
    const isOpen = dropdown.classList.contains('open');
    closeAllMenus();
    if (!isOpen) {
      dropdown.classList.add('open');
      trigger.classList.add('menu-open');
    }
  });
});

document.addEventListener('click', closeAllMenus);
menubar.querySelectorAll('.menu-dropdown').forEach(d => {
  d.addEventListener('click', (e) => e.stopPropagation());
});

// File menu
document.getElementById('menuOpen').addEventListener('click', () => {
  closeAllMenus();
  openBtn.click();
});
const menuSaveBtn = document.getElementById('menuSave');
menuSaveBtn.addEventListener('click', () => {
  closeAllMenus();
  if (!menuSaveBtn.disabled) saveBtn.click();
});

// Edit menu
const menuResetBtn = document.getElementById('menuReset');
const menuRandomizeBtn = document.getElementById('menuRandomize');
menuResetBtn.addEventListener('click', () => {
  closeAllMenus();
  if (menuResetBtn.disabled) return;
  presetEl.value = 'clean';
  grainEl.value = 0; flashEl.value = 0; saturEl.value = 100; pixelEl.value = 0;
  fadeEl.value = 0; chromaEl.value = 0; leakEl.value = 0; scanlinesEl.value = 0;
  sharpenEl.value = 0; vibranceEl.value = 0; tvcurveEl.value = 0;
  borderSelect.value = 'none';
  winFrameEl.checked = false;
  overlaySelect.value = 'none';
  overlayOpacityEl.value = 70;
  pixelEffectSelect.value = 'none';
  pixelEffectStrengthEl.value = 70;
  playStampEl.checked = false;
  batteryStampEl.checked = false;
  exifStampEl.checked = false;
  customStampTextEl.value = '';
  polaroidCaptionText.value = '';
  polaroidInkColor = '#2b2b2b';
  inkSwatches.forEach(s => s.classList.toggle('active', s.dataset.color === '#2b2b2b'));
  polaroidCaptionNudge.value = 50;
  polaroidCaptionControls.style.display = 'none';
  winFrameColorEl.value = '#1084d0';
  winFrameColorHexEl.value = '#1084d0';
  winFrameColorControls.style.display = 'none';
  redBalanceEl.value = 0;
  greenBalanceEl.value = 0;
  blueBalanceEl.value = 0;
  timestampEl.checked = false; vignetteEl.checked = false;
  syncLabels();
  render();
  statusLeft.textContent = 'Filters reset';
});
menuRandomizeBtn.addEventListener('click', () => {
  closeAllMenus();
  if (menuRandomizeBtn.disabled) return;
  grainEl.value = Math.round(Math.random()*60);
  flashEl.value = Math.round(Math.random()*50);
  saturEl.value = Math.round(80 + Math.random()*80);
  fadeEl.value = Math.round(Math.random()*50);
  chromaEl.value = Math.round(Math.random()*40);
  leakEl.value = Math.round(Math.random()*70);
  scanlinesEl.value = Math.round(Math.random()*30);
  randomizeLeakSeed();
  presetEl.value = 'clean';
  syncLabels();
  render();
  statusLeft.textContent = 'Filters randomized';
});

const menuShuffleLookBtn = document.getElementById('menuShuffleLook');
menuShuffleLookBtn.addEventListener('click', () => {
  closeAllMenus();
  if (menuShuffleLookBtn.disabled) return;

  // pick a random LUT, skipping 'none' so shuffle always shows a real look
  const lutChoices = LUT_ORDER.filter(k => k !== 'none');
  activeLut = lutChoices[Math.floor(Math.random() * lutChoices.length)];
  updateLutStripActive();

  // pick a random option from each select, including its own 'none'/'no X' entry
  // so shuffle occasionally clears a category too — feels more like a real shuffle
  function randomSelectValue(selectEl) {
    const opts = Array.from(selectEl.options).map(o => o.value);
    return opts[Math.floor(Math.random() * opts.length)];
  }
  overlaySelect.value = randomSelectValue(overlaySelect);
  borderSelect.value = randomSelectValue(borderSelect);
  pixelEffectSelect.value = randomSelectValue(pixelEffectSelect);

  render();
  statusLeft.textContent = 'Look shuffled — LUT, overlay, frame & effect';
});

// Effects menu — same presets as the dropdown selector
menubar.querySelectorAll('#effectsMenu button[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    closeAllMenus();
    presetEl.value = btn.dataset.preset;
    applyPreset(btn.dataset.preset);
  });
});

// Help menu — About dialog
const aboutOverlay = document.getElementById('aboutOverlay');
document.getElementById('menuAbout').addEventListener('click', () => {
  closeAllMenus();
  aboutOverlay.classList.add('open');
});
document.getElementById('aboutCloseBtn').addEventListener('click', () => aboutOverlay.classList.remove('open'));
document.getElementById('aboutCloseX').addEventListener('click', () => aboutOverlay.classList.remove('open'));
aboutOverlay.addEventListener('click', (e) => {
  if (e.target === aboutOverlay) aboutOverlay.classList.remove('open');
});

openBtn.addEventListener('click', () => {
  if (editingCollageSlotIndex !== null) {
    statusLeft.textContent = 'Finish editing this collage photo first (tap "Done Editing")';
    return;
  }
  try {
    fileInput.value = '';
    fileInput.click();
  } catch (err) {
    statusLeft.textContent = 'Error opening file picker: ' + err.message;
  }
});

const PLACEHOLDER_IMG_B64 = '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';

let sourceImg = null;
let isPlaceholderImage = true;
let workCanvas = document.createElement('canvas');
let workCtx = workCanvas.getContext('2d');

const grainEl = document.getElementById('grain');
const flashEl = document.getElementById('flash');
const saturEl = document.getElementById('satur');
const pixelEl = document.getElementById('pixel');
const fadeEl = document.getElementById('fade');
const chromaEl = document.getElementById('chroma');
const leakEl = document.getElementById('leak');
const scanlinesEl = document.getElementById('scanlines');
const sharpenEl = document.getElementById('sharpen');
const vibranceEl = document.getElementById('vibrance');
const tvcurveEl = document.getElementById('tvcurve');
const redBalanceEl = document.getElementById('redBalance');
const greenBalanceEl = document.getElementById('greenBalance');
const blueBalanceEl = document.getElementById('blueBalance');
const redBalanceVal = document.getElementById('redBalanceVal');
const greenBalanceVal = document.getElementById('greenBalanceVal');
const blueBalanceVal = document.getElementById('blueBalanceVal');
const rgbResetBtn = document.getElementById('rgbResetBtn');
const borderSelect = document.getElementById('borderSelect');
const winFrameEl = document.getElementById('winFrame');
const polaroidCaptionControls = document.getElementById('polaroidCaptionControls');
const polaroidCaptionText = document.getElementById('polaroidCaptionText');
const inkSwatches = document.querySelectorAll('.ink-swatch');
let polaroidInkColor = '#2b2b2b';
const polaroidCaptionNudge = document.getElementById('polaroidCaptionNudge');
const polaroidCaptionNudgeVal = document.getElementById('polaroidCaptionNudgeVal');
const winFrameColorControls = document.getElementById('winFrameColorControls');
const winFrameColorEl = document.getElementById('winFrameColor');
const winFrameColorHexEl = document.getElementById('winFrameColorHex');
const overlaySelect = document.getElementById('overlaySelect');
const pixelEffectSelect = document.getElementById('pixelEffectSelect');
const pixelEffectStrengthEl = document.getElementById('pixelEffectStrength');
const pixelEffectStrengthVal = document.getElementById('pixelEffectStrengthVal');
const overlayOpacityEl = document.getElementById('overlayOpacity');
const overlayOpacityVal = document.getElementById('overlayOpacityVal');
const playStampEl = document.getElementById('playStamp');
const batteryStampEl = document.getElementById('batteryStamp');
const customStampTextEl = document.getElementById('customStampText');
const exifStampEl = document.getElementById('exifStamp');
const qualityEl = document.getElementById('quality');
const qualityVal = document.getElementById('qualityVal');
const sizeEstimateEl = document.getElementById('sizeEstimate');
const timestampEl = document.getElementById('timestamp');
const vignetteEl = document.getElementById('vignette');
const presetEl = document.getElementById('presetSelect');

const grainVal = document.getElementById('grainVal');
const flashVal = document.getElementById('flashVal');
const saturVal = document.getElementById('saturVal');
const pixelVal = document.getElementById('pixelVal');
const fadeVal = document.getElementById('fadeVal');
const chromaVal = document.getElementById('chromaVal');
const leakVal = document.getElementById('leakVal');
const scanlinesVal = document.getElementById('scanlinesVal');
const sharpenVal = document.getElementById('sharpenVal');
const vibranceVal = document.getElementById('vibranceVal');
const tvcurveVal = document.getElementById('tvcurveVal');

// Fixed random seed per image for light leak position/angle, so it doesn't
// jump around every render while dragging other sliders
let leakSeed = { x: 0.3, y: 0.2, angle: 25 };
function randomizeLeakSeed() {
  leakSeed = {
    x: 0.15 + Math.random() * 0.5,
    y: Math.random() * 0.4,
    angle: 15 + Math.random() * 40
  };
}

const presets = {
  digicam2003: { grain: 35, flash: 20, satur: 115, pixel: 1, fade: 15, chroma: 10, leak: 0, scanlines: 0, border: 'none', timestamp: true, vignette: true, lut: 'none' },
  flashnight:  { grain: 55, flash: 65, satur: 95,  pixel: 1, fade: 5,  chroma: 20, leak: 0, scanlines: 0, border: 'none', timestamp: true, vignette: true, lut: 'none' },
  lofi:        { grain: 20, flash: 5,  satur: 100, pixel: 6, fade: 0,  chroma: 0,  leak: 0, scanlines: 30, border: 'none', timestamp: false, vignette: false, lut: 'none' },
  filmleak:    { grain: 25, flash: 10, satur: 105, pixel: 0, fade: 30, chroma: 15, leak: 55, scanlines: 0, border: 'polaroid', timestamp: true, vignette: true, lut: 'harborteal' },
  dreamtape:   { grain: 30, flash: 15, satur: 90,  pixel: 0, fade: 20, chroma: 25, leak: 20, scanlines: 15, border: 'none', timestamp: false, vignette: true, lut: 'coldsteel' },
  desertcam:   { grain: 15, flash: 35, satur: 120, pixel: 0, fade: 10, chroma: 5,  leak: 40, scanlines: 0, border: 'polaroid', timestamp: true, vignette: true, lut: 'duststorm' },
  nightglam:   { grain: 40, flash: 45, satur: 85,  pixel: 0, fade: 8,  chroma: 15, leak: 0, scanlines: 0, border: 'none', timestamp: false, vignette: true, lut: 'nightglam' },
  crtarcade:   { grain: 10, flash: 0,  satur: 130, pixel: 3, fade: 0,  chroma: 30, leak: 0, scanlines: 60, border: 'crtbezel', timestamp: false, vignette: true, lut: 'none' },
  pinkpolaroid:{ grain: 20, flash: 20, satur: 110, pixel: 0, fade: 25, chroma: 5,  leak: 15, scanlines: 0, border: 'polaroid', timestamp: true, vignette: false, lut: 'pinkinverted' },
  lavenderdusk:{ grain: 25, flash: 10, satur: 95,  pixel: 0, fade: 20, chroma: 10, leak: 30, scanlines: 0, border: 'tapecorners', timestamp: false, vignette: true, lut: 'lavender' },
  clean:       null
};

// --- LUTs: each is a function(r,g,b) -> [r,g,b], applied per-pixel after the base
// adjustments (saturation/grain/fade) but before flash/leak/vignette overlays.
// Built as lightweight channel-mix + curve functions rather than true 3D LUT tables,
// which keeps this fast enough for live preview in plain JS.
function clamp255(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

function lightenHex(hex, amount) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const lr = Math.round(clamp255(r + (255 - r) * amount));
  const lg = Math.round(clamp255(g + (255 - g) * amount));
  const lb = Math.round(clamp255(b + (255 - b) * amount));
  return `rgb(${lr}, ${lg}, ${lb})`;
}

const LUTS = {
  none: {
    label: 'Original',
    apply: (r, g, b) => [r, g, b]
  },
  harborteal: {
    label: 'Harbor Teal',
    apply: (r, g, b) => [
      clamp255(r * 0.85),
      clamp255(g * 1.05 + 8),
      clamp255(b * 1.1 + 20)
    ]
  },
  duststorm: {
    label: 'Dust Storm',
    apply: (r, g, b) => [
      clamp255(r * 1.08 + 12),
      clamp255(g * 0.98 + 6),
      clamp255(b * 0.82)
    ]
  },
  coldsteel: {
    label: 'Cold Steel',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 0.55 + gray * 0.35),
        clamp255(g * 0.65 + gray * 0.35 + 4),
        clamp255(b * 1.15 + gray * 0.15 + 15)
      ];
    }
  },
  sunfade: {
    label: 'Sun Fade',
    apply: (r, g, b) => [
      clamp255(r * 1.12 + 10),
      clamp255(g * 1.02 + 4),
      clamp255(b * 0.75 - 5)
    ]
  },
  nightglam: {
    label: 'Night Glam',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 0.7 + gray * 0.15),
        clamp255(gray * 0.9 + g * 0.3),
        clamp255(gray * 0.6 + b * 0.15)
      ];
    }
  },
  pinkinverted: {
    label: 'Pink Inverted',
    apply: (r, g, b) => {
      const ir = 255 - r, ig = 255 - g, ib = 255 - b;
      return [
        clamp255(ir * 0.9 + 60),
        clamp255(ig * 0.5),
        clamp255(ib * 0.85 + 70)
      ];
    }
  },
  lavender: {
    label: 'Lavender',
    apply: (r, g, b) => [
      clamp255(r * 0.9 + 25),
      clamp255(g * 0.85 + 10),
      clamp255(b * 1.05 + 35)
    ]
  },
  y1997: {
    label: '1997',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 1.15 + gray * 0.05 + 8),
        clamp255(g * 1.05 + 4),
        clamp255(b * 0.7 + gray * 0.05)
      ];
    }
  },
  aden: {
    label: 'Aden',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 0.9 + gray * 0.1 + 15),
        clamp255(g * 0.95 + gray * 0.1 + 10),
        clamp255(b * 1.05 + gray * 0.1 + 20)
      ];
    }
  },
  amaro: {
    label: 'Amaro',
    apply: (r, g, b) => [
      clamp255(r * 1.1 + 14),
      clamp255(g * 1.06 + 8),
      clamp255(b * 0.92 + 4)
    ]
  },
  mononoir: {
    label: 'Mono Noir',
    apply: (r, g, b) => {
      const gray = clamp255(0.3*r + 0.59*g + 0.11*b);
      const contrasted = clamp255((gray - 128) * 1.25 + 128);
      return [contrasted, contrasted, contrasted];
    }
  },
  sepiaclassic: {
    label: 'Sepia Classic',
    apply: (r, g, b) => {
      const gray = 0.3*r + 0.59*g + 0.11*b;
      return [
        clamp255(gray * 1.07 + 25),
        clamp255(gray * 0.88 + 12),
        clamp255(gray * 0.6)
      ];
    }
  },
  goldenhour: {
    label: 'Golden Hour',
    apply: (r, g, b) => [
      clamp255(r * 1.18 + 18),
      clamp255(g * 1.05 + 6),
      clamp255(b * 0.65 - 8)
    ]
  },
  mintchip: {
    label: 'Mint Chip',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 0.82),
        clamp255(g * 1.12 + gray * 0.05 + 6),
        clamp255(b * 0.98 + 10)
      ];
    }
  },
  blushfilm: {
    label: 'Blush Film',
    apply: (r, g, b) => [
      clamp255(r * 1.08 + 20),
      clamp255(g * 0.95 + 8),
      clamp255(b * 0.98 + 14)
    ]
  },
  deepindigo: {
    label: 'Deep Indigo',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 0.6 + gray * 0.1),
        clamp255(g * 0.55 + gray * 0.1),
        clamp255(b * 1.25 + gray * 0.1 + 18)
      ];
    }
  },
  tealorange: {
    label: 'Teal & Orange',
    apply: (r, g, b) => {
      const lum = (r + g + b) / 3;
      // push shadows toward teal, highlights toward orange — classic cinematic grade
      const shadowPull = clamp255(255 - lum) / 255;
      const highlightPull = lum / 255;
      return [
        clamp255(r + highlightPull * 22 - shadowPull * 10),
        clamp255(g + shadowPull * 8),
        clamp255(b + shadowPull * 24 - highlightPull * 18)
      ];
    }
  },
  bleachbypass: {
    label: 'Bleach Bypass',
    apply: (r, g, b) => {
      const gray = 0.3*r + 0.59*g + 0.11*b;
      const contrasted = (gray - 128) * 1.4 + 128;
      // partially desaturate and blend with a high-contrast luminance pass
      return [
        clamp255(r * 0.55 + contrasted * 0.45),
        clamp255(g * 0.55 + contrasted * 0.45),
        clamp255(b * 0.55 + contrasted * 0.45)
      ];
    }
  },
  kodachrome: {
    label: 'Kodachrome',
    apply: (r, g, b) => [
      clamp255(r * 1.14 + 6),
      clamp255(g * 0.98 + 2),
      clamp255(b * 0.88 + 8)
    ]
  },
  cyberpunkneon: {
    label: 'Cyberpunk Neon',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 0.75 + gray * 0.1 + 20),
        clamp255(g * 0.65 + gray * 0.05),
        clamp255(b * 1.3 + gray * 0.15 + 25)
      ];
    }
  },
  arcticblue: {
    label: 'Arctic Blue',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      return [
        clamp255(r * 0.88 + gray * 0.05),
        clamp255(g * 0.98 + gray * 0.05 + 6),
        clamp255(b * 1.18 + gray * 0.05 + 22)
      ];
    }
  },
  highkeybright: {
    label: 'High-Key Bright',
    apply: (r, g, b) => [
      clamp255(r * 1.15 + 30),
      clamp255(g * 1.15 + 30),
      clamp255(b * 1.12 + 28)
    ]
  },
  fujivelvia: {
    label: 'Fuji Velvia',
    apply: (r, g, b) => {
      // Velvia: punchy saturated color slide film — deep greens, rich reds, boosted contrast
      const gray = 0.3*r + 0.59*g + 0.11*b;
      const contrasted = (gray - 128) * 1.15 + 128;
      const mix = 0.35;
      return [
        clamp255((r * (1 - mix) + contrasted * mix) * 1.12 + 4),
        clamp255((g * (1 - mix) + contrasted * mix) * 1.1 + 6),
        clamp255((b * (1 - mix) + contrasted * mix) * 1.02)
      ];
    }
  },
  autumnwarmth: {
    label: 'Autumn Warmth',
    apply: (r, g, b) => [
      clamp255(r * 1.16 + 16),
      clamp255(g * 1.02 + 6),
      clamp255(b * 0.72 - 6)
    ]
  },
  moodyforest: {
    label: 'Moody Forest',
    apply: (r, g, b) => {
      const gray = (r + g + b) / 3;
      const contrasted = (gray - 128) * 1.1 + 128;
      return [
        clamp255(r * 0.68 + contrasted * 0.1),
        clamp255(g * 0.95 + contrasted * 0.08 + 4),
        clamp255(b * 0.7 + contrasted * 0.05)
      ];
    }
  },
  retropolaroidfade: {
    label: 'Retro Polaroid Fade',
    apply: (r, g, b) => {
      // classic instant-film fade: lifted blacks, warm yellow cast, crushed blue
      const liftR = 32, liftG = 26, liftB = 14;
      return [
        clamp255(liftR + r * 0.82 + 6),
        clamp255(liftG + g * 0.8 + 4),
        clamp255(liftB + b * 0.68)
      ];
    }
  }
};

const LUT_ORDER = [
  'none', 'harborteal', 'duststorm', 'coldsteel', 'sunfade', 'nightglam', 'pinkinverted', 'lavender',
  'y1997', 'aden', 'amaro', 'mononoir', 'sepiaclassic', 'goldenhour', 'mintchip', 'blushfilm', 'deepindigo',
  'tealorange', 'bleachbypass', 'kodachrome', 'cyberpunkneon', 'arcticblue', 'highkeybright',
  'fujivelvia', 'autumnwarmth', 'moodyforest', 'retropolaroidfade'
];
let activeLut = 'none';

const lutStripEl = document.getElementById('lutStrip');

function buildLutStrip() {
  lutStripEl.innerHTML = '';
  LUT_ORDER.forEach(key => {
    const lut = LUTS[key];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lut-swatch' + (key === activeLut ? ' active' : '');
    btn.dataset.lut = key;
    btn.innerHTML = `<div class="lut-swatch-thumb" id="lutThumb-${key}"></div><span class="lut-swatch-label">${lut.label}</span>`;
    btn.addEventListener('click', () => {
      activeLut = key;
      updateLutStripActive();
      render();
    });
    lutStripEl.appendChild(btn);
  });
}

function updateLutStripActive() {
  lutStripEl.querySelectorAll('.lut-swatch').forEach(el => {
    el.classList.toggle('active', el.dataset.lut === activeLut);
  });
}

function generateLutThumbnails() {
  if (!sourceImg) return;
  const thumbSize = 52;
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = thumbSize;
  srcCanvas.height = thumbSize;
  const srcCtx = srcCanvas.getContext('2d');

  // cover-crop the source image into a square thumbnail source
  const iw = sourceImg.naturalWidth, ih = sourceImg.naturalHeight;
  const side = Math.min(iw, ih);
  const sx = (iw - side) / 2, sy = (ih - side) / 2;
  srcCtx.drawImage(sourceImg, sx, sy, side, side, 0, 0, thumbSize, thumbSize);
  const baseData = srcCtx.getImageData(0, 0, thumbSize, thumbSize);

  LUT_ORDER.forEach(key => {
    const thumbEl = document.getElementById(`lutThumb-${key}`);
    if (!thumbEl) return;
    const outCanvas = document.createElement('canvas');
    outCanvas.width = thumbSize;
    outCanvas.height = thumbSize;
    const outCtx = outCanvas.getContext('2d');
    const outData = outCtx.createImageData(thumbSize, thumbSize);
    const src = baseData.data, dst = outData.data;
    const lutFn = LUTS[key].apply;
    for (let i = 0; i < src.length; i += 4) {
      const [r, g, b] = lutFn(src[i], src[i+1], src[i+2]);
      dst[i] = r; dst[i+1] = g; dst[i+2] = b; dst[i+3] = 255;
    }
    outCtx.putImageData(outData, 0, 0);
    thumbEl.style.backgroundImage = `url(${outCanvas.toDataURL('image/jpeg', 0.7)})`;
  });
}

buildLutStrip();

function applyPreset(name) {
  const p = presets[name];
  if (!p) return;
  grainEl.value = p.grain;
  flashEl.value = p.flash;
  saturEl.value = p.satur;
  pixelEl.value = p.pixel;
  fadeEl.value = p.fade;
  chromaEl.value = p.chroma;
  leakEl.value = p.leak;
  scanlinesEl.value = p.scanlines;
  borderSelect.value = p.border;
  timestampEl.checked = p.timestamp;
  vignetteEl.checked = p.vignette;
  activeLut = p.lut || 'none';
  updateLutStripActive();
  if (p.leak > 0) randomizeLeakSeed();
  syncLabels();
  render();
}

function syncLabels() {
  grainVal.textContent = grainEl.value;
  flashVal.textContent = flashEl.value;
  saturVal.textContent = saturEl.value;
  pixelVal.textContent = pixelEl.value;
  fadeVal.textContent = fadeEl.value;
  chromaVal.textContent = chromaEl.value;
  leakVal.textContent = leakEl.value;
  scanlinesVal.textContent = scanlinesEl.value;
  sharpenVal.textContent = sharpenEl.value;
  vibranceVal.textContent = vibranceEl.value;
  tvcurveVal.textContent = tvcurveEl.value;
  pixelEffectStrengthVal.textContent = pixelEffectStrengthEl.value;
  qualityVal.textContent = qualityEl.value;
  overlayOpacityVal.textContent = overlayOpacityEl.value;
  polaroidCaptionNudgeVal.textContent = polaroidCaptionNudge.value;
  redBalanceVal.textContent = redBalanceEl.value;
  greenBalanceVal.textContent = greenBalanceEl.value;
  blueBalanceVal.textContent = blueBalanceEl.value;
}

function randomTimestamp() {
  // fake a 2003-2006 date, digicam LCD style
  const year = 2000 + Math.floor(Math.random() * 7);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2,'0');
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2,'0');
  const hour = String(Math.floor(Math.random()*24)).padStart(2,'0');
  const min = String(Math.floor(Math.random()*60)).padStart(2,'0');
  return `${month}/${day}/${year}  ${hour}:${min}`;
}
let fixedTimestamp = randomTimestamp();

// Fake EXIF info block — a fixed-per-photo set of made-up camera stats,
// styled like the tiny info burn early-2000s digicams stamped on prints.
const FAKE_CAMERA_MODELS = [
  'Y2KAM DC-200Z', 'PixelShot X1', 'ClickMaster 3.2MP', 'FotoBurst SC-90',
  'SnapCam Zoom', 'MegaLens 400', 'RetroShot CX'
];
function randomExifData() {
  const model = FAKE_CAMERA_MODELS[Math.floor(Math.random() * FAKE_CAMERA_MODELS.length)];
  const iso = [100, 200, 400, 800][Math.floor(Math.random() * 4)];
  const fstops = ['F2.8', 'F3.5', 'F4.0', 'F5.6'];
  const fstop = fstops[Math.floor(Math.random() * fstops.length)];
  return { model, iso, fstop };
}
let fixedExifData = randomExifData();


function loadImageFile(file, sourceLabel) {
  if (editingCollageSlotIndex !== null) {
    statusLeft.textContent = 'Finish editing this collage photo first (tap "Done Editing")';
    return;
  }
  if (!file) {
    statusLeft.textContent = 'No file selected';
    return;
  }
  statusLeft.textContent = 'Loading image...';
  const reader = new FileReader();

  reader.onerror = () => {
    statusLeft.textContent = 'Error reading file';
  };

  reader.onload = (ev) => {
    const img = new Image();
    img.onerror = () => {
      statusLeft.textContent = 'Error: not a valid image';
    };
    img.onload = () => {
      sourceImg = img;
      isPlaceholderImage = false;
      emptyState.style.display = 'none';
      canvas.style.display = 'block';
      saveBtn.disabled = false;
      menuSaveBtn.disabled = false;
      menuResetBtn.disabled = false;
      menuRandomizeBtn.disabled = false;
      menuShuffleLookBtn.disabled = false;
      fixedTimestamp = randomTimestamp();
      fixedExifData = randomExifData();
      randomizeLeakSeed();
      render();
      generateLutThumbnails();
      statusLeft.textContent = sourceLabel || file.name;
      // fresh photo = fresh undo history, so old edits don't bleed across images
      historyStack.length = 0;
      historyIndex = -1;
      pushHistory();
      updateUndoRedoButtons();
    };
    img.src = ev.target.result;
  };

  reader.readAsDataURL(file);
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  loadImageFile(file);
});

const cameraInput = document.getElementById('cameraInput');
const takePhotoBtn = document.getElementById('takePhotoBtn');
takePhotoBtn.addEventListener('click', () => {
  if (editingCollageSlotIndex !== null) {
    statusLeft.textContent = 'Finish editing this collage photo first (tap "Done Editing")';
    return;
  }
  cameraInput.value = '';
  cameraInput.click();
});
cameraInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  loadImageFile(file, 'Captured photo');
});

// Drag & drop support (desktop)
const canvasWrap = document.getElementById('canvasWrap');
canvasWrap.addEventListener('dragover', (e) => e.preventDefault());
canvasWrap.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change'));
  }
});

[grainEl, flashEl, saturEl, pixelEl, fadeEl, chromaEl, scanlinesEl, sharpenEl, vibranceEl, tvcurveEl, redBalanceEl, greenBalanceEl, blueBalanceEl].forEach(el => {
  el.addEventListener('input', () => { syncLabels(); render(); });
});
rgbResetBtn.addEventListener('click', () => {
  redBalanceEl.value = 0;
  greenBalanceEl.value = 0;
  blueBalanceEl.value = 0;
  syncLabels();
  render();
});
const adjustmentsResetBtn = document.getElementById('adjustmentsResetBtn');
adjustmentsResetBtn.addEventListener('click', () => {
  grainEl.value = 35;
  flashEl.value = 20;
  saturEl.value = 115;
  pixelEl.value = 1;
  fadeEl.value = 15;
  chromaEl.value = 0;
  leakEl.value = 0;
  scanlinesEl.value = 0;
  sharpenEl.value = 0;
  vibranceEl.value = 0;
  tvcurveEl.value = 0;
  presetEl.value = 'clean';
  syncLabels();
  render();
  statusLeft.textContent = 'Adjustments reset';
});
leakEl.addEventListener('input', () => {
  syncLabels();
  render();
});
leakEl.addEventListener('pointerdown', () => {
  if (parseInt(leakEl.value, 10) === 0) randomizeLeakSeed();
});
borderSelect.addEventListener('change', () => {
  polaroidCaptionControls.style.display = borderSelect.value === 'polaroid' ? 'block' : 'none';
  render();
});
winFrameEl.addEventListener('change', () => {
  winFrameColorControls.style.display = winFrameEl.checked ? 'block' : 'none';
  render();
});
polaroidCaptionText.addEventListener('input', render);
inkSwatches.forEach(swatch => {
  swatch.addEventListener('click', () => {
    polaroidInkColor = swatch.dataset.color;
    inkSwatches.forEach(s => s.classList.toggle('active', s === swatch));
    render();
  });
});
polaroidCaptionNudge.addEventListener('input', () => {
  polaroidCaptionNudgeVal.textContent = polaroidCaptionNudge.value;
  render();
});
winFrameColorEl.addEventListener('input', () => {
  winFrameColorHexEl.value = winFrameColorEl.value;
  render();
});
winFrameColorHexEl.addEventListener('input', () => {
  const val = winFrameColorHexEl.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    winFrameColorEl.value = val;
    render();
  }
});
overlaySelect.addEventListener('change', render);
pixelEffectSelect.addEventListener('change', render);
pixelEffectStrengthEl.addEventListener('input', () => {
  syncLabels();
  render();
});
overlayOpacityEl.addEventListener('input', () => {
  overlayOpacityVal.textContent = overlayOpacityEl.value;
  render();
});
playStampEl.addEventListener('change', render);
batteryStampEl.addEventListener('change', render);
customStampTextEl.addEventListener('input', render);
exifStampEl.addEventListener('change', render);
qualityEl.addEventListener('input', () => { syncLabels(); updateSizeEstimate(); });
timestampEl.addEventListener('change', render);
vignetteEl.addEventListener('change', render);
presetEl.addEventListener('change', () => applyPreset(presetEl.value));

function drawEffects(targetCanvas, w, h) {
  const tctx = targetCanvas.getContext('2d');
  targetCanvas.width = w;
  targetCanvas.height = h;

  const pixelSteps = parseInt(pixelEl.value, 10);

  // 1. Draw source, optionally pixelated (downscale/upscale trick)
  if (pixelSteps > 0) {
    const factor = 1 + pixelSteps * 2;
    const smallW = Math.max(1, Math.round(w / factor));
    const smallH = Math.max(1, Math.round(h / factor));
    workCanvas.width = w;
    workCanvas.height = h;
    workCtx.imageSmoothingEnabled = true;
    workCtx.clearRect(0,0,w,h);
    workCtx.drawImage(sourceImg, 0, 0, smallW, smallH);
    tctx.imageSmoothingEnabled = false;
    tctx.drawImage(workCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
  } else {
    tctx.imageSmoothingEnabled = true;
    tctx.drawImage(sourceImg, 0, 0, w, h);
  }

  // 1b. Chromatic aberration: draw R and B channels offset from center, additively.
  // Done via three separate offset draws combined with 'screen'-like blending is expensive
  // per-pixel in JS, so we approximate with two extra offset composites of the whole image
  // using canvas globalCompositeOperation, which is fast and gives a convincing fringe.
  const chromaAmt = parseInt(chromaEl.value, 10) / 100;
  if (chromaAmt > 0) {
    const base = tctx.getImageData(0, 0, w, h);
    const maxOffset = Math.max(1, Math.round(Math.min(w, h) * 0.015 * chromaAmt));
    const out = tctx.createImageData(w, h);
    const src = base.data;
    const dst = out.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const di = (y * w + x) * 4;
        const rx = Math.min(w - 1, Math.max(0, x + maxOffset));
        const bx = Math.min(w - 1, Math.max(0, x - maxOffset));
        const ri = (y * w + rx) * 4;
        const bi = (y * w + bx) * 4;
        dst[di]   = src[ri];       // red channel from shifted-right sample
        dst[di+1] = src[di+1];     // green stays put
        dst[di+2] = src[bi+2];     // blue channel from shifted-left sample
        dst[di+3] = 255;
      }
    }
    tctx.putImageData(out, 0, 0);
  }

  // 1c. Old TV Curvature: barrel-distorts the image outward from center,
  // mimicking a curved CRT screen. Pixel-remap via inverse mapping so every
  // output pixel samples from a warped source coordinate — no gaps.
  const tvcurveAmt = parseInt(tvcurveEl.value, 10) / 100;
  if (tvcurveAmt > 0) {
    const srcData = tctx.getImageData(0, 0, w, h);
    const src = srcData.data;
    const outData = tctx.createImageData(w, h);
    const dst = outData.data;
    const cx = w / 2, cy = h / 2;
    const maxR = Math.sqrt(cx*cx + cy*cy);
    const strength = tvcurveAmt * 0.35;
    for (let y = 0; y < h; y++) {
      const ny = (y - cy) / cy;
      for (let x = 0; x < w; x++) {
        const nx = (x - cx) / cx;
        const r2 = nx*nx + ny*ny;
        const factor = 1 + strength * r2;
        const sx = Math.round(cx + nx * cx * factor);
        const sy = Math.round(cy + ny * cy * factor);
        const di = (y * w + x) * 4;
        if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
          const si = (sy * w + sx) * 4;
          dst[di] = src[si]; dst[di+1] = src[si+1]; dst[di+2] = src[si+2]; dst[di+3] = 255;
        } else {
          // outside the warped bounds — fill black, like the unlit edge of a CRT tube
          dst[di] = 0; dst[di+1] = 0; dst[di+2] = 0; dst[di+3] = 255;
        }
      }
    }
    tctx.putImageData(outData, 0, 0);
  }

  // 2. Pixel manipulation: saturation + grain + fade/contrast
  const imgData = tctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const satAmt = parseInt(saturEl.value, 10) / 100;
  const grainAmt = parseInt(grainEl.value, 10) / 100;
  const fadeAmt = parseInt(fadeEl.value, 10) / 100;
  const vibranceAmt = parseInt(vibranceEl.value, 10) / 100;
  const redOffset = parseInt(redBalanceEl.value, 10) * 1.2;
  const greenOffset = parseInt(greenBalanceEl.value, 10) * 1.2;
  const blueOffset = parseInt(blueBalanceEl.value, 10) * 1.2;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i], g = data[i+1], b = data[i+2];

    // saturation
    const gray = 0.3*r + 0.59*g + 0.11*b;
    r = gray + (r - gray) * satAmt;
    g = gray + (g - gray) * satAmt;
    b = gray + (b - gray) * satAmt;

    // vibrance: smart saturation boost — pushes muted colors harder than
    // already-vivid ones, so skin tones don't blow out the way flat saturation does
    if (vibranceAmt > 0) {
      const vmax = Math.max(r, g, b);
      const vmin = Math.min(r, g, b);
      const currentSat = (vmax - vmin) / 255;
      const boost = vibranceAmt * (1 - currentSat) * 0.9;
      const vgray = 0.3*r + 0.59*g + 0.11*b;
      r = vgray + (r - vgray) * (1 + boost);
      g = vgray + (g - vgray) * (1 + boost);
      b = vgray + (b - vgray) * (1 + boost);
    }

    // slight blue/cyan cast typical of cheap CCD sensors
    b = b * 1.03;
    r = r * 0.99;

    if (grainAmt > 0) {
      const noise = (Math.random() - 0.5) * 255 * grainAmt * 0.5;
      r += noise; g += noise; b += noise;
    }

    // fade: lifts blacks and pulls down whites toward a mid-gray, disposable-camera style
    if (fadeAmt > 0) {
      const liftFloor = 25 * fadeAmt;
      const compressTop = 20 * fadeAmt;
      r = liftFloor + r * (1 - (liftFloor + compressTop) / 255);
      g = liftFloor + g * (1 - (liftFloor + compressTop) / 255);
      b = liftFloor + b * (1 - (liftFloor + compressTop) / 255);
    }

    // LUT color grade
    if (activeLut !== 'none') {
      const lutResult = LUTS[activeLut].apply(clamp255(r), clamp255(g), clamp255(b));
      r = lutResult[0]; g = lutResult[1]; b = lutResult[2];
    }

    // RGB channel balance — simple per-channel offset, applied last so it fine-tunes
    // whatever look the LUT/adjustments produced rather than fighting them
    if (redOffset !== 0) r += redOffset;
    if (greenOffset !== 0) g += greenOffset;
    if (blueOffset !== 0) b += blueOffset;

    data[i]   = Math.max(0, Math.min(255, r));
    data[i+1] = Math.max(0, Math.min(255, g));
    data[i+2] = Math.max(0, Math.min(255, b));
  }
  tctx.putImageData(imgData, 0, 0);

  // 2b. Sharpen: classic 3x3 unsharp-style convolution kernel, blended in by amount.
  // Runs after color grading so it sharpens the final graded look, not the raw source.
  const sharpenAmt = parseInt(sharpenEl.value, 10) / 100;
  if (sharpenAmt > 0) {
    const baseData = tctx.getImageData(0, 0, w, h);
    const base = baseData.data;
    const sharpData = tctx.createImageData(w, h);
    const out2 = sharpData.data;
    const amount = sharpenAmt * 1.0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const di = (y * w + x) * 4;
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
          out2[di] = base[di]; out2[di+1] = base[di+1]; out2[di+2] = base[di+2]; out2[di+3] = 255;
          continue;
        }
        for (let c = 0; c < 3; c++) {
          const center = base[di + c];
          const up = base[((y-1)*w + x)*4 + c];
          const down = base[((y+1)*w + x)*4 + c];
          const left = base[(y*w + (x-1))*4 + c];
          const right = base[(y*w + (x+1))*4 + c];
          const laplacian = center * 4 - up - down - left - right;
          out2[di + c] = Math.max(0, Math.min(255, center + laplacian * amount * 0.5));
        }
        out2[di+3] = 255;
      }
    }
    tctx.putImageData(sharpData, 0, 0);
  }

  // 2c. Pixel Effects: one-of-many creative transforms, applied at adjustable strength
  const pixelEffectName = pixelEffectSelect.value;
  const effectStrength = parseInt(pixelEffectStrengthEl.value, 10) / 100;
  if (pixelEffectName !== 'none') {
    if (pixelEffectName === 'glitchwave') {
      // horizontal row-slice displacement using a sine wave, classic digital glitch
      const rowData = tctx.getImageData(0, 0, w, h);
      const rowSrc = rowData.data;
      const rowOut = tctx.createImageData(w, h);
      const rowDst = rowOut.data;
      const waveAmp = w * 0.06 * effectStrength;
      const waveFreq = 0.06 + effectStrength * 0.05;
      for (let y = 0; y < h; y++) {
        const shift = Math.round(Math.sin(y * waveFreq) * waveAmp + (Math.random() - 0.5) * waveAmp * 0.3);
        for (let x = 0; x < w; x++) {
          const sx3 = ((x - shift) % w + w) % w;
          const di2 = (y * w + x) * 4;
          const si2 = (y * w + sx3) * 4;
          rowDst[di2] = rowSrc[si2]; rowDst[di2+1] = rowSrc[si2+1]; rowDst[di2+2] = rowSrc[si2+2]; rowDst[di2+3] = 255;
        }
      }
      tctx.putImageData(rowOut, 0, 0);
      // occasional RGB channel split bands for extra digital-glitch bite
      const glitchBands = Math.max(2, Math.round(4 * effectStrength));
      for (let i = 0; i < glitchBands; i++) {
        const by4 = Math.random() * h;
        const bh4 = 4 + Math.random() * h * 0.05;
        const bandCanvas = document.createElement('canvas');
        bandCanvas.width = w; bandCanvas.height = bh4;
        bandCanvas.getContext('2d').drawImage(targetCanvas, 0, by4, w, bh4, 0, 0, w, bh4);
        tctx.globalCompositeOperation = 'screen';
        tctx.drawImage(bandCanvas, (Math.random()-0.5) * w * 0.03 * effectStrength, by4);
        tctx.globalCompositeOperation = 'source-over';
      }
    } else if (pixelEffectName === 'doubleexposure') {
      // ghost a mirrored, offset, dimmed copy of the image over itself
      tctx.save();
      tctx.globalAlpha = 0.35 * effectStrength;
      tctx.globalCompositeOperation = 'lighten';
      tctx.translate(w, 0);
      tctx.scale(-1, 1);
      const offsetX = w * 0.08 * effectStrength;
      tctx.drawImage(targetCanvas, -offsetX, h * 0.04 * effectStrength, w, h);
      tctx.restore();
    } else if (pixelEffectName === 'emboss') {
      const embData = tctx.getImageData(0, 0, w, h);
      const embSrc = embData.data;
      const embOut = tctx.createImageData(w, h);
      const embDst = embOut.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const di3 = (y * w + x) * 4;
          if (x === 0 || y === 0) {
            embDst[di3] = 128; embDst[di3+1] = 128; embDst[di3+2] = 128; embDst[di3+3] = 255;
            continue;
          }
          const curLum = 0.3*embSrc[di3] + 0.59*embSrc[di3+1] + 0.11*embSrc[di3+2];
          const diagIdx = ((y-1) * w + (x-1)) * 4;
          const diagLum = 0.3*embSrc[diagIdx] + 0.59*embSrc[diagIdx+1] + 0.11*embSrc[diagIdx+2];
          const diff = (curLum - diagLum) * effectStrength * 1.8;
          const v2 = Math.max(0, Math.min(255, 128 + diff));
          embDst[di3] = v2; embDst[di3+1] = v2; embDst[di3+2] = v2; embDst[di3+3] = 255;
        }
      }
      tctx.putImageData(embOut, 0, 0);
    } else if (pixelEffectName === 'solarize') {
      const solData = tctx.getImageData(0, 0, w, h);
      const solD = solData.data;
      const threshold = 255 - effectStrength * 160;
      for (let i = 0; i < solD.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          const v3 = solD[i + c];
          solD[i + c] = v3 > threshold ? 255 - v3 : v3;
        }
      }
      tctx.putImageData(solData, 0, 0);
    } else if (pixelEffectName === 'pixelsort') {
      // sort pixel brightness within randomly-sized horizontal runs, per row
      const sortData = tctx.getImageData(0, 0, w, h);
      const sortD = sortData.data;
      const runLen = Math.max(6, Math.round(w * 0.06 * effectStrength));
      for (let y = 0; y < h; y++) {
        let x2 = 0;
        while (x2 < w) {
          const runW = Math.min(w - x2, runLen + Math.floor(Math.random() * runLen));
          const run = [];
          for (let i = 0; i < runW; i++) {
            const idx = (y * w + x2 + i) * 4;
            run.push([sortD[idx], sortD[idx+1], sortD[idx+2]]);
          }
          run.sort((a, b) => (a[0]+a[1]+a[2]) - (b[0]+b[1]+b[2]));
          for (let i = 0; i < runW; i++) {
            const idx = (y * w + x2 + i) * 4;
            sortD[idx] = run[i][0]; sortD[idx+1] = run[i][1]; sortD[idx+2] = run[i][2];
          }
          x2 += runW;
        }
      }
      tctx.putImageData(sortData, 0, 0);
    } else if (pixelEffectName === 'halftone') {
      // sample luminance on a coarse grid, draw a dot sized to darkness at each cell
      const htData = tctx.getImageData(0, 0, w, h);
      const htD = htData.data;
      const cellSize = Math.max(3, Math.round(14 - effectStrength * 10));
      tctx.fillStyle = '#f5f0e6';
      tctx.fillRect(0, 0, w, h);
      tctx.fillStyle = '#1a1a1a';
      for (let gy = 0; gy < h; gy += cellSize) {
        for (let gx = 0; gx < w; gx += cellSize) {
          const idx2 = (Math.min(h-1, gy) * w + Math.min(w-1, gx)) * 4;
          const lum = 0.3*htD[idx2] + 0.59*htD[idx2+1] + 0.11*htD[idx2+2];
          const dotR2 = (1 - lum / 255) * cellSize * 0.55;
          if (dotR2 > 0.3) {
            tctx.beginPath();
            tctx.arc(gx + cellSize/2, gy + cellSize/2, dotR2, 0, Math.PI*2);
            tctx.fill();
          }
        }
      }
    }
  }

  // 3. Flash glare
  const flashAmt = parseInt(flashEl.value, 10) / 100;
  if (flashAmt > 0) {
    const grad = tctx.createRadialGradient(
      w*0.42, h*0.38, 0,
      w*0.42, h*0.38, Math.max(w,h)*0.65
    );
    grad.addColorStop(0, `rgba(255,255,255,${0.55*flashAmt})`);
    grad.addColorStop(0.35, `rgba(255,255,255,${0.18*flashAmt})`);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    tctx.fillStyle = grad;
    tctx.fillRect(0,0,w,h);
  }

  // 3b. Light leak: warm streak using an elongated radial gradient rotated across the frame
  const leakAmt = parseInt(leakEl.value, 10) / 100;
  if (leakAmt > 0) {
    tctx.save();
    const lx = w * leakSeed.x;
    const ly = h * leakSeed.y;
    tctx.translate(lx, ly);
    tctx.rotate(leakSeed.angle * Math.PI / 180);
    const leakLen = Math.max(w, h) * 1.3;
    const grad2 = tctx.createLinearGradient(-leakLen*0.3, 0, leakLen*0.7, 0);
    grad2.addColorStop(0, 'rgba(255,180,60,0)');
    grad2.addColorStop(0.35, `rgba(255,140,40,${0.5*leakAmt})`);
    grad2.addColorStop(0.5, `rgba(255,210,120,${0.65*leakAmt})`);
    grad2.addColorStop(0.65, `rgba(255,80,90,${0.4*leakAmt})`);
    grad2.addColorStop(1, 'rgba(255,80,90,0)');
    tctx.fillStyle = grad2;
    tctx.globalCompositeOperation = 'screen';
    tctx.fillRect(-leakLen*0.3, -Math.max(w,h)*0.4, leakLen, Math.max(w,h)*0.8);
    tctx.restore();
    tctx.globalCompositeOperation = 'source-over';
  }

  // 4. Vignette
  if (vignetteEl.checked) {
    const vgrad = tctx.createRadialGradient(
      w/2, h/2, Math.max(w,h)*0.35,
      w/2, h/2, Math.max(w,h)*0.72
    );
    vgrad.addColorStop(0, 'rgba(0,0,0,0)');
    vgrad.addColorStop(1, 'rgba(0,0,0,0.45)');
    tctx.fillStyle = vgrad;
    tctx.fillRect(0,0,w,h);
  }

  // 4b. Scan lines / CRT overlay
  const scanAmt = parseInt(scanlinesEl.value, 10) / 100;
  if (scanAmt > 0) {
    const lineSpacing = Math.max(2, Math.round(h / 180));
    tctx.fillStyle = `rgba(0,0,0,${0.5 * scanAmt})`;
    for (let y = 0; y < h; y += lineSpacing) {
      tctx.fillRect(0, y, w, Math.max(1, Math.round(lineSpacing * 0.4)));
    }
  }

  // 5. Timestamp overlay
  if (timestampEl.checked) {
    const fontSize = Math.max(12, Math.round(h * 0.045));
    tctx.font = `bold ${fontSize}px 'Courier New', monospace`;
    tctx.textBaseline = 'bottom';
    const text = fixedTimestamp;
    const pad = fontSize * 0.5;
    const tw = tctx.measureText(text).width;

    tctx.fillStyle = 'rgba(255,140,0,0.35)';
    tctx.fillText(text, w - tw - pad + 1, h - pad + 1);

    tctx.fillStyle = '#ff9900';
    tctx.fillText(text, w - tw - pad, h - pad);
  }

  // 5b. Stamps: Play button, battery icon, custom caption text — small corner decorations
  if (playStampEl.checked) {
    const size = Math.max(20, Math.round(h * 0.07));
    const px = w * 0.05;
    const py = h * 0.05;
    tctx.fillStyle = 'rgba(0,0,0,0.35)';
    tctx.beginPath();
    tctx.moveTo(px, py);
    tctx.lineTo(px, py + size);
    tctx.lineTo(px + size * 0.9, py + size / 2);
    tctx.closePath();
    tctx.fill();
    tctx.fillStyle = 'rgba(255,255,255,0.9)';
    tctx.beginPath();
    tctx.moveTo(px + 2, py + 2);
    tctx.lineTo(px + 2, py + size - 2);
    tctx.lineTo(px + size * 0.9 - 2, py + size / 2);
    tctx.closePath();
    tctx.fill();
  }

  if (batteryStampEl.checked) {
    const bw = Math.max(28, Math.round(w * 0.09));
    const bh = Math.round(bw * 0.5);
    const bx = w - bw - w * 0.05 - Math.round(bw * 0.12);
    const by = h * 0.05;
    tctx.fillStyle = 'rgba(0,0,0,0.55)';
    if (typeof tctx.roundRect === 'function') {
      tctx.beginPath();
      tctx.roundRect(bx, by, bw, bh, 3);
      tctx.fill();
    } else {
      tctx.fillRect(bx, by, bw, bh);
    }
    tctx.fillStyle = 'rgba(255,255,255,0.4)';
    tctx.fillRect(bx + bw, by + bh*0.28, Math.round(bw*0.1), bh*0.44);
    tctx.fillStyle = '#fff';
    const pad2 = Math.max(2, bw * 0.08);
    tctx.fillRect(bx + pad2, by + pad2, (bw - pad2*2) * 0.7, bh - pad2*2);
  }

  if (customStampTextEl.value.trim()) {
    const text2 = customStampTextEl.value.trim();
    const fontSize2 = Math.max(11, Math.round(h * 0.035));
    tctx.font = `bold ${fontSize2}px 'Courier New', monospace`;
    tctx.textBaseline = 'bottom';
    const pad3 = fontSize2 * 0.5;
    tctx.fillStyle = 'rgba(0,0,0,0.4)';
    tctx.fillText(text2, w * 0.05 + 1, h - pad3 + 1);
    tctx.fillStyle = '#ffffff';
    tctx.fillText(text2, w * 0.05, h - pad3);
  }

  if (exifStampEl.checked) {
    // small monospace info block, bottom-right — camera model, date, ISO, f-stop
    const exifFont = Math.max(9, Math.round(h * 0.024));
    const lineGap = exifFont * 1.35;
    const lines = [
      fixedExifData.model,
      fixedTimestamp,
      `ISO ${fixedExifData.iso}  ${fixedExifData.fstop}`
    ];
    tctx.font = `${exifFont}px 'Courier New', monospace`;
    tctx.textBaseline = 'bottom';
    tctx.textAlign = 'right';
    const rightX = w - w * 0.04;
    let exifY = h - h * 0.04;
    // draw bottom-to-top so the array order reads top-to-bottom
    for (let i = lines.length - 1; i >= 0; i--) {
      tctx.fillStyle = 'rgba(0,0,0,0.45)';
      tctx.fillText(lines[i], rightX + 1, exifY + 1);
      tctx.fillStyle = 'rgba(255,255,255,0.92)';
      tctx.fillText(lines[i], rightX, exifY);
      exifY -= lineGap;
    }
    tctx.textAlign = 'left';
  }

  // 5c. Full-frame overlays: novelty full-screen layers, applied at adjustable opacity
  const overlayName = overlaySelect.value;
  const overlayOpacity = parseInt(overlayOpacityEl.value, 10) / 100;
  if (overlayName !== 'none') {
    tctx.save();
    tctx.globalAlpha = overlayOpacity;

    if (overlayName === 'bsod') {
      tctx.fillStyle = 'rgba(0,0,128,0.88)';
      tctx.fillRect(0, 0, w, h);
      const baseFont = Math.max(10, Math.round(w * 0.032));
      tctx.fillStyle = '#f0f0f0';
      tctx.font = `bold ${baseFont * 1.3}px 'Courier New', monospace`;
      tctx.textBaseline = 'top';
      let ty = h * 0.28;
      tctx.fillText('FATAL ERROR', w * 0.08, ty);
      ty += baseFont * 2.2;
      tctx.font = `${baseFont}px 'Courier New', monospace`;
      const lines = [
        'A problem has been detected and',
        'system has been shut down to',
        'prevent damage.',
        '',
        'TECHNICAL INFORMATION:',
        '*** STOP: 0x0000095A (0xY2KAM)',
        '',
        'Press any key to continue_'
      ];
      lines.forEach(line => {
        tctx.fillText(line, w * 0.08, ty);
        ty += baseFont * 1.5;
      });
    } else if (overlayName === 'vhs') {
      // horizontal tracking noise bands + scan glitch offsets
      const bandCount = Math.max(3, Math.round(h * 0.012));
      for (let i = 0; i < bandCount; i++) {
        const by2 = Math.random() * h;
        const bh2 = 2 + Math.random() * 14;
        tctx.fillStyle = `rgba(255,255,255,${0.15 + Math.random()*0.25})`;
        tctx.fillRect(0, by2, w, bh2);
        if (Math.random() > 0.5) {
          // putImageData ignores globalAlpha, so blend the shifted slice back in manually
          // by drawing it onto a temp canvas at the current alpha via drawImage instead.
          const sliceH = Math.max(1, Math.round(bh2));
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = w;
          sliceCanvas.height = sliceH;
          sliceCanvas.getContext('2d').drawImage(targetCanvas, 0, by2, w, sliceH, 0, 0, w, sliceH);
          const shift = (Math.random() - 0.5) * w * 0.04;
          tctx.drawImage(sliceCanvas, shift, by2);
        }
      }
      tctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let y = 0; y < h; y += 3) {
        tctx.fillRect(0, y, w, 1);
      }
      // top tracking bar text
      tctx.fillStyle = '#fff';
      tctx.font = `${Math.max(10, Math.round(w*0.03))}px 'Courier New', monospace`;
      tctx.textBaseline = 'top';
      tctx.fillText('▶ PLAY', w * 0.05, h * 0.04);
    } else if (overlayName === 'rec') {
      const dotR = Math.max(5, Math.round(w * 0.018));
      const dx = w * 0.08;
      const dy = h * 0.06;
      tctx.fillStyle = '#ff2020';
      tctx.beginPath();
      tctx.arc(dx, dy, dotR, 0, Math.PI * 2);
      tctx.fill();
      tctx.fillStyle = '#fff';
      const fontSize3 = Math.max(12, Math.round(w * 0.035));
      tctx.font = `bold ${fontSize3}px 'Courier New', monospace`;
      tctx.textBaseline = 'middle';
      tctx.fillText('REC', dx + dotR * 1.8, dy + 1);

      const now2 = new Date();
      const tc = `${String(now2.getHours()).padStart(2,'0')}:${String(now2.getMinutes()).padStart(2,'0')}:${String(now2.getSeconds()).padStart(2,'0')}`;
      tctx.font = `${Math.round(fontSize3*0.85)}px 'Courier New', monospace`;
      tctx.textBaseline = 'bottom';
      tctx.fillText(tc, w * 0.05, h - h * 0.04);

      // corner viewfinder brackets
      const bl = Math.round(w * 0.06);
      const bt = Math.max(2, Math.round(w * 0.006));
      tctx.fillStyle = 'rgba(255,255,255,0.85)';
      const corners = [[w*0.03,h*0.15],[w-w*0.03-bl,h*0.15],[w*0.03,h-h*0.15-bl],[w-w*0.03-bl,h-h*0.15-bl]];
      corners.forEach(([cx, cy]) => {
        tctx.fillRect(cx, cy, bl, bt);
        tctx.fillRect(cx, cy, bt, bl);
      });
    } else if (overlayName === 'lowbattery') {
      tctx.fillStyle = 'rgba(0,0,0,0.5)';
      tctx.fillRect(0, 0, w, h * 0.08);
      const bw2 = Math.max(30, Math.round(w * 0.1));
      const bh2 = Math.round(bw2 * 0.48);
      const bx2 = w - bw2 - w * 0.04;
      const by2 = h * 0.02;
      tctx.strokeStyle = '#ff3b30';
      tctx.lineWidth = Math.max(1.5, bw2 * 0.05);
      tctx.strokeRect(bx2, by2, bw2, bh2);
      tctx.fillStyle = 'rgba(255,255,255,0.5)';
      tctx.fillRect(bx2 + bw2, by2 + bh2*0.28, bw2*0.1, bh2*0.44);
      tctx.fillStyle = '#ff3b30';
      tctx.fillRect(bx2 + 2, by2 + 2, (bw2-4) * 0.15, bh2 - 4);
      tctx.fillStyle = '#fff';
      tctx.font = `${Math.round(bh2*0.7)}px 'Courier New', monospace`;
      tctx.textBaseline = 'middle';
      tctx.textAlign = 'right';
      tctx.fillText('9%', bx2 - 6, by2 + bh2/2);
      tctx.textAlign = 'left';
    } else if (overlayName === 'starfield') {
      const starCount = Math.max(15, Math.round((w * h) / 12000));
      for (let i = 0; i < starCount; i++) {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        const r = 0.5 + Math.random() * 2.5;
        tctx.fillStyle = `rgba(255,255,255,${0.4 + Math.random()*0.6})`;
        tctx.beginPath();
        tctx.arc(sx, sy, r, 0, Math.PI * 2);
        tctx.fill();
        if (Math.random() > 0.85) {
          tctx.strokeStyle = `rgba(255,255,255,${0.3 + Math.random()*0.3})`;
          tctx.lineWidth = 0.8;
          tctx.beginPath();
          tctx.moveTo(sx - r*3, sy);
          tctx.lineTo(sx + r*3, sy);
          tctx.moveTo(sx, sy - r*3);
          tctx.lineTo(sx, sy + r*3);
          tctx.stroke();
        }
      }
    } else if (overlayName === 'tvstatic') {
      // dense random noise field, redrawn fresh each render for a flickering static look
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = w; noiseCanvas.height = h;
      const nctx = noiseCanvas.getContext('2d');
      const nData = nctx.createImageData(w, h);
      const nd = nData.data;
      for (let i = 0; i < nd.length; i += 4) {
        const v = Math.random() * 255;
        nd[i] = v; nd[i+1] = v; nd[i+2] = v; nd[i+3] = 255;
      }
      nctx.putImageData(nData, 0, 0);
      tctx.globalCompositeOperation = 'overlay';
      tctx.drawImage(noiseCanvas, 0, 0);
      tctx.globalCompositeOperation = 'source-over';
      // a few horizontal desync bands on top, like a signal drop
      const bandCount2 = Math.max(2, Math.round(h * 0.006));
      for (let i = 0; i < bandCount2; i++) {
        const by3 = Math.random() * h;
        const bh3 = 3 + Math.random() * 10;
        tctx.fillStyle = 'rgba(255,255,255,0.3)';
        tctx.fillRect(0, by3, w, bh3);
      }
    } else if (overlayName === 'rainglass') {
      // vertical streaks with teardrop highlights, simulating rain running down glass
      const dropCount = Math.max(20, Math.round((w * h) / 9000));
      for (let i = 0; i < dropCount; i++) {
        const dx2 = Math.random() * w;
        const dy2 = Math.random() * h * 0.7;
        const len = h * (0.08 + Math.random() * 0.22);
        const wobble = (Math.random() - 0.5) * w * 0.02;
        const grad3 = tctx.createLinearGradient(dx2, dy2, dx2 + wobble, dy2 + len);
        grad3.addColorStop(0, 'rgba(255,255,255,0)');
        grad3.addColorStop(0.5, `rgba(200,220,255,${0.25 + Math.random()*0.2})`);
        grad3.addColorStop(1, 'rgba(255,255,255,0)');
        tctx.strokeStyle = grad3;
        tctx.lineWidth = 1 + Math.random() * 2;
        tctx.beginPath();
        tctx.moveTo(dx2, dy2);
        tctx.lineTo(dx2 + wobble, dy2 + len);
        tctx.stroke();
        // small bead of light at the drop's leading edge
        tctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random()*0.3})`;
        tctx.beginPath();
        tctx.arc(dx2 + wobble, dy2 + len, 1.5 + Math.random()*1.5, 0, Math.PI*2);
        tctx.fill();
      }
      // faint overall blue-gray haze
      tctx.fillStyle = 'rgba(180,200,220,0.06)';
      tctx.fillRect(0, 0, w, h);
    } else if (overlayName === 'dustscratches') {
      // random fine scratches + dust speckles, classic damaged-film look
      const scratchCount = Math.max(4, Math.round(w * 0.012));
      for (let i = 0; i < scratchCount; i++) {
        const sx2 = Math.random() * w;
        tctx.strokeStyle = `rgba(255,255,255,${0.15 + Math.random()*0.25})`;
        tctx.lineWidth = 0.5 + Math.random() * 1;
        tctx.beginPath();
        tctx.moveTo(sx2, 0);
        tctx.lineTo(sx2 + (Math.random()-0.5) * w * 0.05, h);
        tctx.stroke();
      }
      const speckCount = Math.max(30, Math.round((w * h) / 4000));
      for (let i = 0; i < speckCount; i++) {
        const px2 = Math.random() * w;
        const py2 = Math.random() * h;
        const r2b = 0.5 + Math.random() * 1.5;
        tctx.fillStyle = Math.random() > 0.5 ? `rgba(0,0,0,${0.2 + Math.random()*0.3})` : `rgba(255,255,255,${0.2 + Math.random()*0.3})`;
        tctx.beginPath();
        tctx.arc(px2, py2, r2b, 0, Math.PI*2);
        tctx.fill();
      }
    } else if (overlayName === 'confetti') {
      const pieceCount = Math.max(25, Math.round((w * h) / 8000));
      const confettiColors = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585', '#ffffff'];
      for (let i = 0; i < pieceCount; i++) {
        const cx2 = Math.random() * w;
        const cy2 = Math.random() * h;
        const size = 3 + Math.random() * 5;
        tctx.save();
        tctx.translate(cx2, cy2);
        tctx.rotate(Math.random() * Math.PI * 2);
        tctx.fillStyle = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        if (Math.random() > 0.5) {
          tctx.fillRect(-size/2, -size/3, size, size*0.6);
        } else {
          tctx.beginPath();
          tctx.arc(0, 0, size/2, 0, Math.PI*2);
          tctx.fill();
        }
        tctx.restore();
      }
    } else if (overlayName === 'snowfall') {
      const flakeCount = Math.max(30, Math.round((w * h) / 7000));
      for (let i = 0; i < flakeCount; i++) {
        const fx = Math.random() * w;
        const fy = Math.random() * h;
        const r3 = 1 + Math.random() * 3;
        tctx.fillStyle = `rgba(255,255,255,${0.5 + Math.random()*0.5})`;
        tctx.beginPath();
        tctx.arc(fx, fy, r3, 0, Math.PI*2);
        tctx.fill();
      }
      // soft cold-blue vignette to sell the wintry mood
      const wgrad = tctx.createRadialGradient(w/2, h/2, Math.max(w,h)*0.3, w/2, h/2, Math.max(w,h)*0.7);
      wgrad.addColorStop(0, 'rgba(200,220,255,0)');
      wgrad.addColorStop(1, 'rgba(200,220,255,0.15)');
      tctx.fillStyle = wgrad;
      tctx.fillRect(0, 0, w, h);
    } else if (overlayName === 'matrixrain') {
      const chars = '01アイウエオカキクケコサシスセソ';
      const fontSize4 = Math.max(10, Math.round(w * 0.035));
      const colCount = Math.max(4, Math.round(w / fontSize4));
      const colSpacing = w / colCount;
      tctx.font = `${fontSize4}px 'Courier New', monospace`;
      tctx.textBaseline = 'top';
      for (let c = 0; c < colCount; c++) {
        const streamLen = 4 + Math.floor(Math.random() * 10);
        const startY = Math.random() * h;
        for (let i = 0; i < streamLen; i++) {
          const cy3 = (startY + i * fontSize4) % h;
          const ch = chars[Math.floor(Math.random() * chars.length)];
          const alpha = i === 0 ? 1 : Math.max(0.05, 1 - i / streamLen);
          tctx.fillStyle = i === 0 ? 'rgba(220,255,220,0.95)' : `rgba(0,255,90,${alpha * 0.75})`;
          tctx.fillText(ch, c * colSpacing, cy3);
        }
      }
    }

    tctx.restore();
  }

  // 6. Border/frame — drawn by wrapping the content into a larger canvas
  const borderStyle = borderSelect.value;
  if (borderStyle !== 'none') {
    const srcSnapshot = document.createElement('canvas');
    srcSnapshot.width = w;
    srcSnapshot.height = h;
    srcSnapshot.getContext('2d').drawImage(targetCanvas, 0, 0);

    let padTop, padSide, padBottom;
    if (borderStyle === 'polaroid') {
      padSide = Math.round(w * 0.045);
      padTop = padSide;
      padBottom = Math.round(h * 0.14);
    } else if (borderStyle === 'crtbezel') {
      padSide = Math.round(w * 0.08);
      padTop = Math.round(w * 0.06);
      padBottom = Math.round(w * 0.1);
    } else if (borderStyle === 'tapecorners' || borderStyle === 'sticker') {
      padSide = Math.round(w * 0.04);
      padTop = padSide;
      padBottom = padSide;
    } else if (borderStyle === 'thinmat') {
      padSide = Math.round(w * 0.06);
      padTop = padSide;
      padBottom = padSide;
    } else if (borderStyle === 'stickynote') {
      padSide = Math.round(w * 0.05);
      padTop = Math.round(w * 0.05);
      padBottom = Math.round(w * 0.05);
    } else if (borderStyle === 'ticketstub') {
      padSide = Math.round(w * 0.035);
      padTop = padSide;
      padBottom = Math.round(h * 0.1);
    } else {
      // filmstrip
      padSide = Math.round(w * 0.03);
      padTop = padSide;
      padBottom = padSide;
    }

    const fullW = w + padSide * 2;
    const fullH = h + padTop + padBottom;
    targetCanvas.width = fullW;
    targetCanvas.height = fullH;

    const fillRoundRect = (x, y, rw, rh, r) => {
      if (typeof tctx.roundRect === 'function') {
        tctx.beginPath();
        tctx.roundRect(x, y, rw, rh, r);
        tctx.fill();
      } else {
        tctx.fillRect(x, y, rw, rh);
      }
    };

    if (borderStyle === 'polaroid') {
      tctx.fillStyle = '#f5f2ea';
      tctx.fillRect(0, 0, fullW, fullH);
      tctx.drawImage(srcSnapshot, padSide, padTop);

      const captionText = polaroidCaptionText.value.trim();
      if (captionText) {
        const stripTop = padTop + h;
        const stripH = padBottom;
        const fontSize = Math.max(16, Math.round(stripH * 0.42));
        tctx.font = `${fontSize}px 'Caveat', 'Segoe Script', 'Bradley Hand', cursive`;
        tctx.fillStyle = polaroidInkColor;
        tctx.textBaseline = 'middle';

        const textW = tctx.measureText(captionText).width;
        const nudgeFrac = parseInt(polaroidCaptionNudge.value, 10) / 100;
        const minX = padSide * 0.3;
        const maxX = fullW - padSide * 0.3 - textW;
        const textX = Math.max(minX, Math.min(maxX, minX + (maxX - minX) * nudgeFrac));
        const textY = stripTop + stripH * 0.48;

        tctx.save();
        tctx.translate(textX, textY);
        tctx.rotate(-0.02);
        tctx.fillText(captionText, 0, 0);
        tctx.restore();
      }
    } else if (borderStyle === 'filmstrip') {
      tctx.fillStyle = '#0a0a0a';
      tctx.fillRect(0, 0, fullW, fullH);
      tctx.drawImage(srcSnapshot, padSide, padTop);
      const holeSize = Math.max(4, Math.round(padSide * 0.5));
      const holeGap = holeSize * 2.2;
      for (let x = holeGap; x < fullW - holeGap; x += holeGap) {
        tctx.fillStyle = '#2a2a2a';
        const r = holeSize / 2;
        fillRoundRect(x - r, padTop/2 - r, holeSize, holeSize, 2);
        fillRoundRect(x - r, fullH - padBottom/2 - r, holeSize, holeSize, 2);
      }
    } else if (borderStyle === 'crtbezel') {
      // dark plastic monitor bezel with a subtle highlight edge and rounded corners
      tctx.fillStyle = '#1c1c22';
      fillRoundRect(0, 0, fullW, fullH, Math.round(padSide * 0.35));
      tctx.save();
      tctx.beginPath();
      if (typeof tctx.roundRect === 'function') {
        tctx.roundRect(padSide, padTop, w, h, Math.round(padSide * 0.15));
      } else {
        tctx.rect(padSide, padTop, w, h);
      }
      tctx.clip();
      tctx.drawImage(srcSnapshot, padSide, padTop);
      tctx.restore();
      // inner screen shadow
      tctx.strokeStyle = 'rgba(0,0,0,0.5)';
      tctx.lineWidth = Math.max(2, padSide * 0.08);
      tctx.strokeRect(padSide, padTop, w, h);
      // brand dot + label like a monitor bezel
      tctx.fillStyle = '#3a3a44';
      tctx.beginPath();
      tctx.arc(fullW/2, fullH - padBottom * 0.45, Math.max(3, padSide*0.12), 0, Math.PI*2);
      tctx.fill();
    } else if (borderStyle === 'tapecorners') {
      tctx.fillStyle = '#f0ece2';
      tctx.fillRect(0, 0, fullW, fullH);
      tctx.drawImage(srcSnapshot, padSide, padTop);
      // washi-tape style corner strips, semi-transparent, slightly rotated
      const tapeW = Math.round(w * 0.16);
      const tapeH = Math.round(tapeW * 0.42);
      const drawTape = (cx, cy, angle) => {
        tctx.save();
        tctx.translate(cx, cy);
        tctx.rotate(angle);
        tctx.fillStyle = 'rgba(255, 214, 120, 0.75)';
        tctx.fillRect(-tapeW/2, -tapeH/2, tapeW, tapeH);
        tctx.fillStyle = 'rgba(255,255,255,0.18)';
        for (let i = -tapeW/2; i < tapeW/2; i += 6) {
          tctx.fillRect(i, -tapeH/2, 1.5, tapeH);
        }
        tctx.restore();
      };
      drawTape(padSide + 6, padTop + 6, -0.55);
      drawTape(fullW - padSide - 6, padTop + 6, 0.55);
      drawTape(padSide + 6, fullH - padBottom - 6, 0.55);
      drawTape(fullW - padSide - 6, fullH - padBottom - 6, -0.55);
    } else if (borderStyle === 'sticker') {
      // thick colorful dashed border using the current theme accent
      const accentColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#ff66aa';
      tctx.fillStyle = '#ffffff';
      tctx.fillRect(0, 0, fullW, fullH);
      tctx.drawImage(srcSnapshot, padSide, padTop);
      tctx.strokeStyle = accentColor;
      tctx.lineWidth = Math.max(3, padSide * 0.35);
      tctx.setLineDash([Math.max(6, padSide*0.4), Math.max(4, padSide*0.25)]);
      const inset = tctx.lineWidth / 2;
      tctx.strokeRect(inset, inset, fullW - inset*2, fullH - inset*2);
      tctx.setLineDash([]);
    } else if (borderStyle === 'thinmat') {
      // simple museum-print style: thin dark inner line, generous flat white/off-white mat
      tctx.fillStyle = '#faf9f6';
      tctx.fillRect(0, 0, fullW, fullH);
      tctx.drawImage(srcSnapshot, padSide, padTop);
      tctx.strokeStyle = 'rgba(0,0,0,0.55)';
      tctx.lineWidth = Math.max(1, padSide * 0.05);
      tctx.strokeRect(padSide, padTop, w, h);
    } else if (borderStyle === 'stickynote') {
      // pastel yellow sticky-note look with a folded corner
      tctx.fillStyle = '#fff4a3';
      tctx.fillRect(0, 0, fullW, fullH);
      tctx.drawImage(srcSnapshot, padSide, padTop);
      // subtle drop shadow along the bottom/right to feel like a paper note
      tctx.strokeStyle = 'rgba(0,0,0,0.12)';
      tctx.lineWidth = 1;
      tctx.strokeRect(padSide, padTop, w, h);
      // folded corner (top-right)
      const foldSize = Math.max(14, Math.round(padSide * 1.4));
      tctx.save();
      tctx.beginPath();
      tctx.moveTo(fullW - foldSize, 0);
      tctx.lineTo(fullW, 0);
      tctx.lineTo(fullW, foldSize);
      tctx.closePath();
      tctx.fillStyle = 'rgba(0,0,0,0.15)';
      tctx.fill();
      tctx.beginPath();
      tctx.moveTo(fullW - foldSize, 0);
      tctx.lineTo(fullW - foldSize, foldSize * 0.15);
      tctx.lineTo(fullW - foldSize * 0.15, foldSize);
      tctx.lineTo(0 + fullW - foldSize, foldSize);
      tctx.closePath();
      tctx.restore();
    } else if (borderStyle === 'ticketstub') {
      // event-ticket style: perforated edge with a torn/notched left side and small end caps
      tctx.fillStyle = '#f0ead8';
      tctx.fillRect(0, 0, fullW, fullH);
      tctx.drawImage(srcSnapshot, padSide, padTop);
      // perforation notches along the bottom strip divider
      const dividerY = padTop + h;
      const notchR = Math.max(3, Math.round(padSide * 0.4));
      for (let x = notchR; x < fullW; x += notchR * 2.4) {
        tctx.beginPath();
        tctx.arc(x, dividerY, notchR, 0, Math.PI * 2);
        tctx.fillStyle = 'rgba(0,0,0,0.08)';
        tctx.fill();
      }
      tctx.strokeStyle = 'rgba(0,0,0,0.3)';
      tctx.setLineDash([4, 4]);
      tctx.lineWidth = 1.5;
      tctx.beginPath();
      tctx.moveTo(0, dividerY);
      tctx.lineTo(fullW, dividerY);
      tctx.stroke();
      tctx.setLineDash([]);
      // small stub text
      const stubFont = Math.max(11, Math.round(padBottom * 0.3));
      tctx.fillStyle = '#5a5040';
      tctx.font = `bold ${stubFont}px 'Courier New', monospace`;
      tctx.textBaseline = 'middle';
      tctx.textAlign = 'center';
      tctx.fillText('ADMIT ONE', fullW / 2, dividerY + padBottom / 2);
      tctx.textAlign = 'left';
    }
  }

  // 6b. Wrap the (possibly already-framed) canvas in a full fake Win95 window —
  // titlebar with app name + window buttons, body border, and a taskbar strip.
  if (winFrameEl.checked) {
    const srcSnapshot2 = document.createElement('canvas');
    srcSnapshot2.width = targetCanvas.width;
    srcSnapshot2.height = targetCanvas.height;
    srcSnapshot2.getContext('2d').drawImage(targetCanvas, 0, 0);
    const cw = srcSnapshot2.width;
    const ch = srcSnapshot2.height;

    const theme = getComputedStyle(document.body);
    const customColor = winFrameColorEl.value;
    const titleStart = customColor;
    const titleEnd = lightenHex(customColor, 0.35);
    const winBody = theme.getPropertyValue('--win-body').trim() || '#c0c0c0';
    const borderLight = theme.getPropertyValue('--win-border-light').trim() || '#ffffff';
    const borderDark = theme.getPropertyValue('--win-border-dark').trim() || '#000000';

    const chromeMargin = Math.max(10, Math.round(cw * 0.02));
    const titlebarH = Math.max(28, Math.round(cw * 0.06));
    const taskbarH = Math.max(26, Math.round(cw * 0.055));
    const frameBorder = Math.max(3, Math.round(cw * 0.006));

    const fullW = cw + chromeMargin * 2;
    const fullH = ch + titlebarH + taskbarH + chromeMargin * 2;

    targetCanvas.width = fullW;
    targetCanvas.height = fullH;

    // desktop backdrop behind the window
    tctx.fillStyle = '#008080';
    tctx.fillRect(0, 0, fullW, fullH);

    // window body
    tctx.fillStyle = winBody;
    tctx.fillRect(0, 0, fullW, fullH - taskbarH);

    // window outer bevel
    tctx.fillStyle = borderLight;
    tctx.fillRect(0, 0, fullW, frameBorder);
    tctx.fillRect(0, 0, frameBorder, fullH - taskbarH);
    tctx.fillStyle = borderDark;
    tctx.fillRect(0, fullH - taskbarH - frameBorder, fullW, frameBorder);
    tctx.fillRect(fullW - frameBorder, 0, frameBorder, fullH - taskbarH);

    // titlebar
    const grad = tctx.createLinearGradient(0, 0, fullW, 0);
    grad.addColorStop(0, titleStart);
    grad.addColorStop(1, titleEnd);
    tctx.fillStyle = grad;
    tctx.fillRect(frameBorder, frameBorder, fullW - frameBorder*2, titlebarH);

    const titleFontSize = Math.max(12, Math.round(titlebarH * 0.45));
    tctx.fillStyle = '#ffffff';
    tctx.font = `bold ${titleFontSize}px 'Tahoma', sans-serif`;
    tctx.textBaseline = 'middle';
    tctx.fillText('Y2Kam', frameBorder + titlebarH*0.3, frameBorder + titlebarH/2 + 1);

    // window control buttons (_, □, ×)
    const btnSize = Math.round(titlebarH * 0.55);
    const btnY = frameBorder + (titlebarH - btnSize) / 2;
    const btnLabels = ['_', '\u25a1', '\u00d7'];
    let btnX = fullW - frameBorder - (btnSize + 4) * 3 - 6;
    btnLabels.forEach(label => {
      tctx.fillStyle = winBody;
      tctx.fillRect(btnX, btnY, btnSize, btnSize);
      tctx.fillStyle = borderLight;
      tctx.fillRect(btnX, btnY, btnSize, 1);
      tctx.fillRect(btnX, btnY, 1, btnSize);
      tctx.fillStyle = borderDark;
      tctx.fillRect(btnX, btnY + btnSize - 1, btnSize, 1);
      tctx.fillRect(btnX + btnSize - 1, btnY, 1, btnSize);
      tctx.fillStyle = '#000000';
      tctx.font = `bold ${Math.round(btnSize*0.65)}px monospace`;
      tctx.textAlign = 'center';
      tctx.fillText(label, btnX + btnSize/2, btnY + btnSize/2 + 1);
      tctx.textAlign = 'left';
      btnX += btnSize + 4;
    });

    // photo content
    tctx.drawImage(srcSnapshot2, chromeMargin, titlebarH + frameBorder + chromeMargin);

    // bottom padding fill (already win-body colored from the big fillRect above)

    // taskbar
    tctx.fillStyle = winBody;
    tctx.fillRect(0, fullH - taskbarH, fullW, taskbarH);
    tctx.fillStyle = borderLight;
    tctx.fillRect(0, fullH - taskbarH, fullW, 1);

    // Start button
    const startW = Math.round(taskbarH * 2.4);
    const startH = Math.round(taskbarH * 0.72);
    const startX = 4;
    const startY = fullH - taskbarH + (taskbarH - startH) / 2;
    tctx.fillStyle = winBody;
    tctx.fillRect(startX, startY, startW, startH);
    tctx.fillStyle = borderLight;
    tctx.fillRect(startX, startY, startW, 1);
    tctx.fillRect(startX, startY, 1, startH);
    tctx.fillStyle = borderDark;
    tctx.fillRect(startX, startY + startH - 1, startW, 1);
    tctx.fillRect(startX + startW - 1, startY, 1, startH);
    tctx.fillStyle = '#000000';
    tctx.font = `bold ${Math.round(startH*0.5)}px 'Tahoma', sans-serif`;
    tctx.textBaseline = 'middle';
    tctx.fillText('Start', startX + startH*0.6, startY + startH/2 + 1);

    // clock on the right
    const now = new Date();
    const hh = now.getHours() % 12 || 12;
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const clockText = `${hh}:${mm} ${ampm}`;
    tctx.font = `${Math.round(taskbarH*0.4)}px 'Tahoma', sans-serif`;
    const clockW = tctx.measureText(clockText).width;
    const clockPadX = 10;
    const clockX = fullW - clockW - clockPadX * 2 - 4;
    const clockY = fullH - taskbarH + (taskbarH - startH*0.85) / 2;
    tctx.fillStyle = winBody;
    tctx.fillRect(clockX, clockY, clockW + clockPadX*2, startH*0.85);
    tctx.fillStyle = borderDark;
    tctx.fillRect(clockX, clockY, clockW + clockPadX*2, 1);
    tctx.fillRect(clockX, clockY, 1, startH*0.85);
    tctx.fillStyle = borderLight;
    tctx.fillRect(clockX, clockY + startH*0.85 - 1, clockW + clockPadX*2, 1);
    tctx.fillRect(clockX + clockW + clockPadX*2 - 1, clockY, 1, startH*0.85);
    tctx.fillStyle = '#000000';
    tctx.textBaseline = 'middle';
    tctx.fillText(clockText, clockX + clockPadX, clockY + startH*0.85/2 + 1);
  }
}

function render() {
  if (!sourceImg) return;

  const maxDim = 500; // preview only — kept small for speed, export uses full res separately
  let w = sourceImg.naturalWidth;
  let h = sourceImg.naturalHeight;
  const scale = Math.min(1, maxDim / Math.max(w, h));
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  drawEffects(canvas, w, h);
  updateSizeEstimate();
}

function getExportCanvas() {
  // Full resolution, capped at 1600px on the long edge — plenty sharp, keeps files small
  const exportMaxDim = 1600;
  let w = sourceImg.naturalWidth;
  let h = sourceImg.naturalHeight;
  const scale = Math.min(1, exportMaxDim / Math.max(w, h));
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const exportCanvas = document.createElement('canvas');
  drawEffects(exportCanvas, w, h);
  return exportCanvas;
}

function updateSizeEstimate() {
  const quality = parseInt(qualityEl.value, 10) / 100;
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  // rough estimate: preview is smaller than export, so scale up by area ratio
  const previewBytes = Math.round(dataUrl.length * 0.75);
  const previewArea = canvas.width * canvas.height;
  const exportMaxDim = 1600;
  let ew = sourceImg.naturalWidth, eh = sourceImg.naturalHeight;
  const escale = Math.min(1, exportMaxDim / Math.max(ew, eh));
  ew = Math.round(ew * escale); eh = Math.round(eh * escale);
  const exportArea = ew * eh;
  const estBytes = previewBytes * (exportArea / previewArea);
  sizeEstimateEl.textContent = formatBytes(estBytes);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(0) + ' KB';
  return (bytes/(1024*1024)).toFixed(2) + ' MB';
}

const processingOverlay = document.getElementById('processingOverlay');
const processingBarFill = document.getElementById('processingBarFill');
const processingLabel = document.getElementById('processingLabel');

function runProcessingAnimation(onComplete) {
  processingOverlay.classList.add('open');
  processingLabel.textContent = 'Developing photo...';
  processingBarFill.style.width = '0%';
  const totalMs = 900 + Math.random() * 500;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const pct = Math.min(100, (elapsed / totalMs) * 100);
    processingBarFill.style.width = pct + '%';
    if (pct < 100) {
      requestAnimationFrame(tick);
    } else {
      processingLabel.textContent = 'Done!';
      setTimeout(() => {
        processingOverlay.classList.remove('open');
        onComplete();
      }, 200);
    }
  }
  requestAnimationFrame(tick);
}

saveBtn.addEventListener('click', () => {
  statusLeft.textContent = 'Exporting...';
  runProcessingAnimation(() => {
    const quality = parseInt(qualityEl.value, 10) / 100;
    const exportCanvas = getExportCanvas();
    const dataUrl = exportCanvas.toDataURL('image/jpeg', quality);
    const link = document.createElement('a');
    link.download = 'y2kam-export.jpg';
    link.href = dataUrl;
    link.click();
    const bytes = Math.round(dataUrl.length * 0.75);
    statusLeft.textContent = `Saved (${formatBytes(bytes)})`;
  });
});

// Load the built-in placeholder photo so LUTs, filters, and the canvas
// preview show a live example before the person uploads their own image.
(function loadPlaceholder() {
  const img = new Image();
  img.onload = () => {
    sourceImg = img;
    isPlaceholderImage = true;
    emptyState.style.display = 'none';
    canvas.style.display = 'block';
    render();
    buildLutStrip();
    generateLutThumbnails();
    statusLeft.textContent = 'Preview photo — tap Open Photo to use your own';
    pushHistory();
    updateUndoRedoButtons();
  };
  img.src = 'data:image/jpeg;base64,' + PLACEHOLDER_IMG_B64;
})();

// ============================================================
// Workflow features: Undo/Redo, Save Presets, Before/After hold,
// Compare slider. Built on top of the existing controls without
// touching the render pipeline — it just snapshots/restores every
// control's value plus the few JS-only state vars (theme, LUT,
// ink color, leak seed).
// ============================================================

function getState() {
  return {
    theme: document.body.className || '',
    activeLut: activeLut,
    polaroidInkColor: polaroidInkColor,
    leakSeed: { ...leakSeed },
    preset: presetEl.value,
    grain: grainEl.value, flash: flashEl.value, satur: saturEl.value, pixel: pixelEl.value,
    fade: fadeEl.value, chroma: chromaEl.value, leak: leakEl.value, scanlines: scanlinesEl.value,
    sharpen: sharpenEl.value, vibrance: vibranceEl.value, tvcurve: tvcurveEl.value,
    redBalance: redBalanceEl.value, greenBalance: greenBalanceEl.value, blueBalance: blueBalanceEl.value,
    border: borderSelect.value,
    winFrame: winFrameEl.checked,
    winFrameColor: winFrameColorEl.value,
    overlay: overlaySelect.value,
    overlayOpacity: overlayOpacityEl.value,
    pixelEffect: pixelEffectSelect.value,
    pixelEffectStrength: pixelEffectStrengthEl.value,
    playStamp: playStampEl.checked,
    batteryStamp: batteryStampEl.checked,
    exifStamp: exifStampEl.checked,
    customStampText: customStampTextEl.value,
    polaroidCaptionText: polaroidCaptionText.value,
    polaroidCaptionNudge: polaroidCaptionNudge.value,
    quality: qualityEl.value,
    timestamp: timestampEl.checked,
    vignette: vignetteEl.checked
  };
}

function applyState(s) {
  if (!s) return;
  document.body.className = s.theme;
  Object.keys(themeButtons).forEach(key => {
    const name = s.theme === '' ? 'blue' : s.theme.replace('theme-', '');
    themeButtons[key].classList.toggle('active', key === name);
  });
  activeLut = s.activeLut;
  updateLutStripActive();
  polaroidInkColor = s.polaroidInkColor;
  inkSwatches.forEach(el => el.classList.toggle('active', el.dataset.color === s.polaroidInkColor));
  leakSeed = { ...s.leakSeed };
  presetEl.value = s.preset;
  grainEl.value = s.grain; flashEl.value = s.flash; saturEl.value = s.satur; pixelEl.value = s.pixel;
  fadeEl.value = s.fade; chromaEl.value = s.chroma; leakEl.value = s.leak; scanlinesEl.value = s.scanlines;
  sharpenEl.value = s.sharpen; vibranceEl.value = s.vibrance; tvcurveEl.value = s.tvcurve;
  redBalanceEl.value = s.redBalance; greenBalanceEl.value = s.greenBalance; blueBalanceEl.value = s.blueBalance;
  borderSelect.value = s.border;
  winFrameEl.checked = s.winFrame;
  winFrameColorEl.value = s.winFrameColor;
  winFrameColorHexEl.value = s.winFrameColor;
  winFrameColorControls.style.display = s.winFrame ? 'flex' : 'none';
  overlaySelect.value = s.overlay;
  overlayOpacityEl.value = s.overlayOpacity;
  pixelEffectSelect.value = s.pixelEffect;
  pixelEffectStrengthEl.value = s.pixelEffectStrength;
  playStampEl.checked = s.playStamp;
  batteryStampEl.checked = s.batteryStamp;
  exifStampEl.checked = !!s.exifStamp;
  customStampTextEl.value = s.customStampText;
  polaroidCaptionText.value = s.polaroidCaptionText;
  polaroidCaptionNudge.value = s.polaroidCaptionNudge;
  polaroidCaptionControls.style.display = s.border === 'polaroid' ? 'block' : 'none';
  qualityEl.value = s.quality;
  timestampEl.checked = s.timestamp;
  vignetteEl.checked = s.vignette;
  syncLabels();
  render();
}

// --- Undo/Redo history stack ---
let historyStack = [];
let historyIndex = -1;
let isRestoringHistory = false;
const HISTORY_LIMIT = 60;

function pushHistory() {
  if (isRestoringHistory || !sourceImg) return;
  const snapshot = JSON.stringify(getState());
  // skip if nothing actually changed since the last snapshot
  if (historyIndex >= 0 && historyStack[historyIndex] === snapshot) return;
  // if we'd undone some steps and now make a new edit, drop the redo branch
  historyStack.splice(historyIndex + 1);
  historyStack.push(snapshot);
  if (historyStack.length > HISTORY_LIMIT) historyStack.shift();
  historyIndex = historyStack.length - 1;
  updateUndoRedoButtons();
}

function undo() {
  if (historyIndex <= 0) return;
  historyIndex--;
  isRestoringHistory = true;
  applyState(JSON.parse(historyStack[historyIndex]));
  isRestoringHistory = false;
  updateUndoRedoButtons();
  statusLeft.textContent = 'Undo';
}

function redo() {
  if (historyIndex >= historyStack.length - 1) return;
  historyIndex++;
  isRestoringHistory = true;
  applyState(JSON.parse(historyStack[historyIndex]));
  isRestoringHistory = false;
  updateUndoRedoButtons();
  statusLeft.textContent = 'Redo';
}

function updateUndoRedoButtons() {
  const undoBtn = document.getElementById('menuUndo');
  const redoBtn = document.getElementById('menuRedo');
  if (undoBtn) undoBtn.disabled = historyIndex <= 0 || !sourceImg;
  if (redoBtn) redoBtn.disabled = historyIndex >= historyStack.length - 1 || !sourceImg;
}

document.getElementById('menuUndo').addEventListener('click', () => { closeAllMenus(); undo(); });
document.getElementById('menuRedo').addEventListener('click', () => { closeAllMenus(); redo(); });

// keyboard shortcuts: Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl+Y redo
document.addEventListener('keydown', (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return;
  if (e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
  else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
});

// Debounced snapshot on any interaction within the controls panel, LUT strip,
// menu, or theme swatches — covers all 46+ existing listeners without
// having to thread history calls through each one individually.
let historyDebounceTimer = null;
function scheduleHistorySnapshot() {
  if (isRestoringHistory) return;
  clearTimeout(historyDebounceTimer);
  historyDebounceTimer = setTimeout(pushHistory, 350);
}
['input', 'change', 'click'].forEach(evt => {
  document.querySelector('.controls-panel').addEventListener(evt, scheduleHistorySnapshot);
  lutStripEl.addEventListener(evt, scheduleHistorySnapshot);
  document.querySelector('.theme-swatches').addEventListener(evt, scheduleHistorySnapshot);
});
document.getElementById('editMenu').addEventListener('click', scheduleHistorySnapshot);
document.getElementById('effectsMenu').addEventListener('click', scheduleHistorySnapshot);

// --- Save My Presets (localStorage) ---
const PRESETS_KEY = 'y2kam_user_presets';

function loadUserPresets() {
  try {
    return JSON.parse(localStorage.getItem(PRESETS_KEY) || '[]');
  } catch (err) {
    return [];
  }
}

function saveUserPresets(list) {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(list));
  } catch (err) {
    statusLeft.textContent = 'Could not save preset (storage full?)';
  }
}

const myPresetsListEl = document.getElementById('myPresetsList');
const savePresetBtn = document.getElementById('savePresetBtn');
const savePresetNameEl = document.getElementById('savePresetName');

function renderMyPresets() {
  const presets = loadUserPresets();
  myPresetsListEl.innerHTML = '';
  if (presets.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'my-presets-empty';
    empty.textContent = 'No saved presets yet — dial in a look, name it, and tap Save.';
    myPresetsListEl.appendChild(empty);
    return;
  }
  presets.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'my-preset-row';

    const nameBtn = document.createElement('button');
    nameBtn.type = 'button';
    nameBtn.className = 'win95-btn my-preset-load';
    nameBtn.textContent = p.name;
    nameBtn.addEventListener('click', () => {
      applyState(p.state);
      pushHistory();
      statusLeft.textContent = `Loaded preset "${p.name}"`;
    });

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'win95-btn my-preset-delete';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', `Delete preset ${p.name}`);
    delBtn.addEventListener('click', () => {
      const all = loadUserPresets();
      all.splice(idx, 1);
      saveUserPresets(all);
      renderMyPresets();
      statusLeft.textContent = `Deleted preset "${p.name}"`;
    });

    row.appendChild(nameBtn);
    row.appendChild(delBtn);
    myPresetsListEl.appendChild(row);
  });
}

savePresetBtn.addEventListener('click', () => {
  if (!sourceImg) return;
  const name = (savePresetNameEl.value || '').trim().slice(0, 24) || `Preset ${loadUserPresets().length + 1}`;
  const presets = loadUserPresets();
  presets.push({ name, state: getState() });
  saveUserPresets(presets);
  savePresetNameEl.value = '';
  renderMyPresets();
  statusLeft.textContent = `Saved preset "${name}"`;
});

renderMyPresets();

// --- Before/After hold button ---
const beforeAfterBtn = document.getElementById('beforeAfterBtn');
let preHoldSnapshot = null;

function showOriginal() {
  if (!sourceImg) return;
  preHoldSnapshot = getState();
  isRestoringHistory = true; // suppress history pushes while previewing
  presetEl.value = 'clean';
  grainEl.value = 0; flashEl.value = 0; saturEl.value = 100; pixelEl.value = 0;
  fadeEl.value = 0; chromaEl.value = 0; leakEl.value = 0; scanlinesEl.value = 0;
  sharpenEl.value = 0; vibranceEl.value = 0; tvcurveEl.value = 0;
  redBalanceEl.value = 0; greenBalanceEl.value = 0; blueBalanceEl.value = 0;
  overlaySelect.value = 'none';
  pixelEffectSelect.value = 'none';
  const savedLut = activeLut;
  activeLut = 'none';
  render();
  activeLut = savedLut; // restore variable so UI/state stay correct once we release
  isRestoringHistory = false;
}

function restoreAfterHold() {
  if (!preHoldSnapshot) return;
  isRestoringHistory = true;
  applyState(preHoldSnapshot);
  isRestoringHistory = false;
  preHoldSnapshot = null;
}

beforeAfterBtn.addEventListener('mousedown', showOriginal);
beforeAfterBtn.addEventListener('touchstart', (e) => { e.preventDefault(); showOriginal(); }, { passive: false });
beforeAfterBtn.addEventListener('mouseup', restoreAfterHold);
beforeAfterBtn.addEventListener('mouseleave', restoreAfterHold);
beforeAfterBtn.addEventListener('touchend', restoreAfterHold);
beforeAfterBtn.addEventListener('touchcancel', restoreAfterHold);

// --- Compare slider (drag to reveal original vs edited) ---
const compareToggleBtn = document.getElementById('compareToggleBtn');
const compareOverlay = document.getElementById('compareOverlay');
const compareHandle = document.getElementById('compareHandle');
const compareOriginalCanvas = document.getElementById('compareOriginalCanvas');
let compareActive = false;
let compareDragging = false;

function buildCompareOriginal() {
  if (!sourceImg) return;
  const w = canvas.width, h = canvas.height;
  compareOriginalCanvas.width = w;
  compareOriginalCanvas.height = h;
  const octx = compareOriginalCanvas.getContext('2d');
  octx.clearRect(0, 0, w, h);
  octx.drawImage(sourceImg, 0, 0, w, h);
  setComparePosition(50);
}

function setComparePosition(percent) {
  const clamped = Math.max(0, Math.min(100, percent));
  compareOriginalCanvas.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
  compareHandle.style.left = clamped + '%';
}

compareToggleBtn.addEventListener('click', () => {
  if (!sourceImg) return;
  compareActive = !compareActive;
  compareToggleBtn.classList.toggle('active', compareActive);
  if (compareActive) {
    buildCompareOriginal();
    compareOverlay.style.display = 'block';
  } else {
    compareOverlay.style.display = 'none';
  }
});

function handleCompareDrag(clientX) {
  const rect = canvasWrap.getBoundingClientRect();
  const percent = ((clientX - rect.left) / rect.width) * 100;
  setComparePosition(percent);
}

compareHandle.addEventListener('mousedown', (e) => { compareDragging = true; e.preventDefault(); });
compareHandle.addEventListener('touchstart', (e) => { compareDragging = true; e.preventDefault(); }, { passive: false });
document.addEventListener('mousemove', (e) => { if (compareDragging) handleCompareDrag(e.clientX); });
document.addEventListener('touchmove', (e) => { if (compareDragging && e.touches[0]) handleCompareDrag(e.touches[0].clientX); }, { passive: true });
document.addEventListener('mouseup', () => { compareDragging = false; });
document.addEventListener('touchend', () => { compareDragging = false; });

// Keep the compare overlay's original-image canvas in sync whenever a new
// render happens while compare mode is on (e.g. after loading a new photo).
const originalRenderFn = render;
render = function() {
  originalRenderFn();
  if (compareActive) buildCompareOriginal();
};

syncLabels();

// --- Pinch-to-zoom on the canvas preview ---
// Purely a view-level zoom (CSS transform on zoomTarget) so pinching stays
// smooth — it never re-renders the actual image at a different resolution.
const zoomTarget = document.getElementById('zoomTarget');
let zoomScale = 1;
let zoomPanX = 0;
let zoomPanY = 0;
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

function applyZoomTransform() {
  zoomTarget.style.transform = `translate(${zoomPanX}px, ${zoomPanY}px) scale(${zoomScale})`;
}

function clampPan() {
  // keep panning bounded roughly to how far the zoomed image can drift
  // before its edge would show empty space in the wrap
  const maxPan = (zoomScale - 1) * 140;
  zoomPanX = Math.max(-maxPan, Math.min(maxPan, zoomPanX));
  zoomPanY = Math.max(-maxPan, Math.min(maxPan, zoomPanY));
}

function resetZoom() {
  zoomScale = 1;
  zoomPanX = 0;
  zoomPanY = 0;
  applyZoomTransform();
}

let pinchStartDist = 0;
let pinchStartScale = 1;
let panStartX = 0, panStartY = 0;
let panPointerStartX = 0, panPointerStartY = 0;
let isPanning = false;

function touchDist(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

canvasWrap.addEventListener('touchstart', (e) => {
  if (compareDragging) return; // don't fight the compare-slider drag
  if (e.touches.length === 2) {
    pinchStartDist = touchDist(e.touches);
    pinchStartScale = zoomScale;
    isPanning = false;
  } else if (e.touches.length === 1 && zoomScale > 1) {
    isPanning = true;
    panPointerStartX = e.touches[0].clientX;
    panPointerStartY = e.touches[0].clientY;
    panStartX = zoomPanX;
    panStartY = zoomPanY;
  }
}, { passive: true });

canvasWrap.addEventListener('touchmove', (e) => {
  if (compareDragging) return;
  if (e.touches.length === 2) {
    e.preventDefault();
    const dist = touchDist(e.touches);
    const rawScale = pinchStartScale * (dist / pinchStartDist);
    zoomScale = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, rawScale));
    clampPan();
    applyZoomTransform();
  } else if (e.touches.length === 1 && isPanning) {
    e.preventDefault();
    zoomPanX = panStartX + (e.touches[0].clientX - panPointerStartX);
    zoomPanY = panStartY + (e.touches[0].clientY - panPointerStartY);
    clampPan();
    applyZoomTransform();
  }
}, { passive: false });

canvasWrap.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) pinchStartDist = 0;
  if (e.touches.length === 0) {
    isPanning = false;
    // snap fully back to 1x if the pinch ends barely zoomed in, so it
    // doesn't get stuck at an awkward near-1x scale
    if (zoomScale < 1.05) resetZoom();
  }
});

// Double-tap to reset zoom — handy since there's no visible zoom-out control
let lastTapTime = 0;
canvasWrap.addEventListener('touchend', (e) => {
  if (e.touches.length > 0) return;
  const now = Date.now();
  if (now - lastTapTime < 300 && zoomScale > 1) {
    resetZoom();
  }
  lastTapTime = now;
});

// Reset zoom whenever a new photo loads, so it doesn't carry over confusingly
const originalLoadImageFile = loadImageFile;
loadImageFile = function(file, sourceLabel) {
  resetZoom();
  originalLoadImageFile(file, sourceLabel);
};

// --- Batch Export ---
// Applies the CURRENT settings (LUT, filters, overlay, frame, stamps, etc.)
// to a list of selected photos, exporting each as its own JPEG download.
// sourceImg is swapped one at a time so this reuses the exact same
// drawEffects() pipeline as the live single-photo preview — no logic duplication.
let batchFiles = [];

const batchFileInput = document.getElementById('batchFileInput');
const batchSelectBtn = document.getElementById('batchSelectBtn');
const batchFileListEl = document.getElementById('batchFileList');
const batchProcessBtn = document.getElementById('batchProcessBtn');
const batchProgressRow = document.getElementById('batchProgressRow');
const batchProgressText = document.getElementById('batchProgressText');

batchSelectBtn.addEventListener('click', () => {
  batchFileInput.value = '';
  batchFileInput.click();
});

batchFileInput.addEventListener('change', (e) => {
  batchFiles = Array.from(e.target.files || []);
  renderBatchFileList();
  batchProcessBtn.disabled = batchFiles.length === 0;
});

function renderBatchFileList() {
  batchFileListEl.innerHTML = '';
  if (batchFiles.length === 0) return;
  batchFiles.forEach((file, i) => {
    const row = document.createElement('div');
    row.className = 'batch-file-row';
    const name = document.createElement('span');
    name.className = 'batch-file-name';
    name.textContent = file.name;
    const status = document.createElement('span');
    status.className = 'batch-file-status';
    status.id = `batchStatus${i}`;
    status.textContent = 'queued';
    row.appendChild(name);
    row.appendChild(status);
    batchFileListEl.appendChild(row);
  });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read error'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('invalid image'));
      img.onload = () => resolve(img);
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function processBatch() {
  if (batchFiles.length === 0 || !sourceImg) return;
  batchProcessBtn.disabled = true;
  batchSelectBtn.disabled = true;
  batchProgressRow.style.display = 'flex';

  // stash the live photo's state so we can restore it once batch finishes —
  // batch export must not disturb what the user is currently looking at
  const savedSourceImg = sourceImg;
  const savedTimestamp = fixedTimestamp;
  const savedExifData = fixedExifData;
  const savedLeakSeed = { ...leakSeed };

  const quality = parseInt(qualityEl.value, 10) / 100;
  const exportMaxDim = 1600;
  let successCount = 0;

  for (let i = 0; i < batchFiles.length; i++) {
    const file = batchFiles[i];
    const statusEl = document.getElementById(`batchStatus${i}`);
    batchProgressText.textContent = `Processing ${i + 1} of ${batchFiles.length}...`;
    if (statusEl) { statusEl.textContent = 'working...'; statusEl.className = 'batch-file-status'; }

    try {
      const img = await loadImageFromFile(file);
      // swap in this photo's own random per-photo state, matching how a
      // normal single upload would look — not the currently-loaded photo's state
      sourceImg = img;
      fixedTimestamp = randomTimestamp();
      fixedExifData = randomExifData();
      randomizeLeakSeed();

      let w = img.naturalWidth, h = img.naturalHeight;
      const scale = Math.min(1, exportMaxDim / Math.max(w, h));
      w = Math.round(w * scale);
      h = Math.round(h * scale);

      const exportCanvas = document.createElement('canvas');
      drawEffects(exportCanvas, w, h);
      const dataUrl = exportCanvas.toDataURL('image/jpeg', quality);

      const baseName = file.name.replace(/\.[^.]+$/, '');
      const link = document.createElement('a');
      link.download = `y2kam-${baseName}.jpg`;
      link.href = dataUrl;
      link.click();

      if (statusEl) { statusEl.textContent = 'done'; statusEl.className = 'batch-file-status done'; }
      successCount++;
    } catch (err) {
      if (statusEl) { statusEl.textContent = 'error'; statusEl.className = 'batch-file-status error'; }
    }

    // small gap between triggered downloads — back-to-back downloads can get
    // silently blocked by the browser's popup/download rate limiting
    await new Promise(r => setTimeout(r, 400));
  }

  // restore the live photo exactly as it was before batch ran
  sourceImg = savedSourceImg;
  fixedTimestamp = savedTimestamp;
  fixedExifData = savedExifData;
  leakSeed = savedLeakSeed;
  render();

  batchProgressText.textContent = `Done — ${successCount} of ${batchFiles.length} exported`;
  batchProcessBtn.disabled = false;
  batchSelectBtn.disabled = false;
}

batchProcessBtn.addEventListener('click', processBatch);

// --- Collage Maker (Stage 1) ---
// A separate mode from single-photo editing: takes 2-6 raw photos, arranges
// them into one canvas using a chosen layout, then draws a collage-level
// frame around the whole thing. Deliberately does NOT touch drawEffects()
// or per-photo state yet — that's Stage 2. Frame drawing is fully separate
// from the single-photo borderSelect logic by design.

let collageSlots = []; // { file, img, state, fixedTimestamp, fixedExifData, leakSeed, edited, editedCanvas }
let collageLayoutId = 'grid2x2';
let collageFrameId = 'thickWhite';
let editingCollageSlotIndex = null; // null when not editing a slot in the main editor

// stashed main-editor state while a collage slot is being edited, so the
// user's own single-photo work is untouched when they return
let stashedMainEditor = null;

const collageEditBanner = document.getElementById('collageEditBanner');
const collageEditBannerText = document.getElementById('collageEditBannerText');
const collageDoneEditingBtn = document.getElementById('collageDoneEditingBtn');

// Deep-clone a slot's saved state bundle (state + fixedTimestamp/exif/leakSeed)
function cloneSlotStateBundle(bundle) {
  return JSON.parse(JSON.stringify(bundle));
}

// Renders a slot's edited look into its own offscreen canvas via drawEffects,
// exactly like the batch export swap trick — but reused live for thumbnails
// and for the final collage composite.
function renderSlotEditedCanvas(slot, maxDim) {
  const savedSourceImg = sourceImg;
  const savedTimestamp = fixedTimestamp;
  const savedExifData = fixedExifData;
  const savedLeakSeed = { ...leakSeed };

  sourceImg = slot.img;
  fixedTimestamp = slot.fixedTimestamp;
  fixedExifData = slot.fixedExifData;
  leakSeed = { ...slot.leakSeed };

  // temporarily apply the slot's control state so drawEffects reads the
  // right values, without going through applyState's DOM side-effects/render
  const restoreControls = silentlyApplyControlsForState(slot.state);

  let w = slot.img.naturalWidth, h = slot.img.naturalHeight;
  const scale = Math.min(1, maxDim / Math.max(w, h));
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const offCanvas = document.createElement('canvas');
  drawEffects(offCanvas, w, h);

  restoreControls();
  sourceImg = savedSourceImg;
  fixedTimestamp = savedTimestamp;
  fixedExifData = savedExifData;
  leakSeed = savedLeakSeed;

  return offCanvas;
}

// Applies a state object's values into the same control elements getState()
// reads from, WITHOUT the DOM-visible side effects applyState() does (theme
// class swaps, active-button highlighting, render() calls). Used to read
// a slot's look into drawEffects for an off-screen render, then restore
// whatever the visible controls held before. Returns a restore function.
function silentlyApplyControlsForState(s) {
  const controls = [
    [presetEl, 'preset'], [grainEl, 'grain'], [flashEl, 'flash'], [saturEl, 'satur'],
    [pixelEl, 'pixel'], [fadeEl, 'fade'], [chromaEl, 'chroma'], [leakEl, 'leak'],
    [scanlinesEl, 'scanlines'], [sharpenEl, 'sharpen'], [vibranceEl, 'vibrance'],
    [tvcurveEl, 'tvcurve'], [redBalanceEl, 'redBalance'], [greenBalanceEl, 'greenBalance'],
    [blueBalanceEl, 'blueBalance'], [borderSelect, 'border'], [overlaySelect, 'overlay'],
    [overlayOpacityEl, 'overlayOpacity'], [pixelEffectSelect, 'pixelEffect'],
    [pixelEffectStrengthEl, 'pixelEffectStrength'], [customStampTextEl, 'customStampText'],
    [polaroidCaptionText, 'polaroidCaptionText'], [polaroidCaptionNudge, 'polaroidCaptionNudge'],
    [qualityEl, 'quality']
  ];
  const checkboxes = [
    [winFrameEl, 'winFrame'], [playStampEl, 'playStamp'], [batteryStampEl, 'batteryStamp'],
    [exifStampEl, 'exifStamp'], [timestampEl, 'timestamp'], [vignetteEl, 'vignette']
  ];
  const colors = [[winFrameColorEl, 'winFrameColor']];

  const prevValues = controls.map(([el]) => el.value);
  const prevChecked = checkboxes.map(([el]) => el.checked);
  const prevColors = colors.map(([el]) => el.value);
  const prevActiveLut = activeLut;
  const prevInkColor = polaroidInkColor;

  controls.forEach(([el, key]) => { if (key in s) el.value = s[key]; });
  checkboxes.forEach(([el, key]) => { if (key in s) el.checked = s[key]; });
  colors.forEach(([el, key]) => { if (key in s) el.value = s[key]; });
  // Note: theme (document.body.className) is intentionally NOT swapped here —
  // it only affects UI chrome styling, not drawEffects' pixel output, and
  // swapping it would cause a visible flash across the whole app during
  // every offscreen thumbnail/collage render.
  activeLut = s.activeLut;
  polaroidInkColor = s.polaroidInkColor;

  return function restore() {
    controls.forEach(([el], i) => { el.value = prevValues[i]; });
    checkboxes.forEach(([el], i) => { el.checked = prevChecked[i]; });
    colors.forEach(([el], i) => { el.value = prevColors[i]; });
    activeLut = prevActiveLut;
    polaroidInkColor = prevInkColor;
  };
}

const collageOverlay = document.getElementById('collageOverlay');
const collageOpenBtn = document.getElementById('collageOpenBtn');
const collageCloseX = document.getElementById('collageCloseX');
const collageSelectBtn = document.getElementById('collageSelectBtn');
const collageFileInput = document.getElementById('collageFileInput');
const collageSlotListEl = document.getElementById('collageSlotList');
const collageLayoutGrid = document.getElementById('collageLayoutGrid');
const collageFrameGrid = document.getElementById('collageFrameGrid');
const collageGutterEl = document.getElementById('collageGutter');
const collageGutterVal = document.getElementById('collageGutterVal');
const collageBgColorEl = document.getElementById('collageBgColor');
const collagePreviewCanvas = document.getElementById('collagePreviewCanvas');
const collagePreviewEmpty = document.getElementById('collagePreviewEmpty');
const collageGenerateBtn = document.getElementById('collageGenerateBtn');
const collageDownloadBtn = document.getElementById('collageDownloadBtn');

// ---- Layout definitions ----
// Each layout returns an array of cell rects { x, y, w, h } as FRACTIONS of
// the total canvas (0-1), given a photo count. minPhotos/maxPhotos gate
// which layouts are offered for the current slot count.
const COLLAGE_LAYOUTS = {
  grid2x2: {
    label: 'Grid 2×2',
    minPhotos: 2, maxPhotos: 4,
    aspect: 1,
    cells(n) {
      const positions = [
        [0, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5],
        [0, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]
      ];
      return positions.slice(0, n);
    }
  },
  grid3x3: {
    label: 'Grid 3×3',
    minPhotos: 5, maxPhotos: 6,
    aspect: 1,
    cells(n) {
      // 6 slots: use a 3x2 grid (3 across, 2 down) which reads better than
      // a sparse 3x3 for up to 6 photos
      const cols = 3, rows = 2;
      const cells = [];
      for (let i = 0; i < n; i++) {
        const c = i % cols, r = Math.floor(i / cols);
        cells.push([c / cols, r / rows, 1 / cols, 1 / rows]);
      }
      return cells;
    }
  },
  vStrip: {
    label: 'Vertical Strip',
    minPhotos: 2, maxPhotos: 6,
    aspect: 0.6,
    cells(n) {
      const cells = [];
      for (let i = 0; i < n; i++) cells.push([0, i / n, 1, 1 / n]);
      return cells;
    }
  },
  hStrip: {
    label: 'Horizontal Strip',
    minPhotos: 2, maxPhotos: 6,
    aspect: 1.8,
    cells(n) {
      const cells = [];
      for (let i = 0; i < n; i++) cells.push([i / n, 0, 1 / n, 1]);
      return cells;
    }
  },
  bigTwoSmall: {
    label: 'Big + Small',
    minPhotos: 3, maxPhotos: 3,
    aspect: 1,
    cells() {
      return [
        [0, 0, 0.62, 1],
        [0.62, 0, 0.38, 0.5],
        [0.62, 0.5, 0.38, 0.5]
      ];
    }
  },
  scattered: {
    label: 'Scattered',
    minPhotos: 2, maxPhotos: 6,
    aspect: 1,
    // Scattered layout overlaps cells and adds rotation — handled specially
    // in renderCollage() rather than a plain grid, but we still provide
    // base rects (roughly centered, overlapping) for consistent framing math.
    cells(n) {
      const base = [
        [0.06, 0.08, 0.46, 0.46], [0.42, 0.02, 0.46, 0.46],
        [0.06, 0.46, 0.46, 0.46], [0.42, 0.46, 0.46, 0.46],
        [0.24, 0.24, 0.46, 0.46], [0.18, 0.16, 0.4, 0.4]
      ];
      return base.slice(0, n);
    },
    rotations: [-6, 5, -4, 7, -8, 4]
  }
};

function layoutsForCount(n) {
  return Object.entries(COLLAGE_LAYOUTS).filter(
    ([, def]) => n >= def.minPhotos && n <= def.maxPhotos
  );
}

// ---- Frame definitions ----
// Each frame is a function(ctx, w, h, gutter, bgColor) that draws the
// overall background/frame BEFORE cells are drawn, and optionally a
// function(ctx, w, h) drawn AFTER cells (e.g. taped corners on top).
// Deliberately independent from the single-photo drawBorder logic.
const COLLAGE_FRAMES = {
  thickWhite: {
    label: 'Thick White',
    margin: 26,
    before(ctx, w, h) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
  },
  filmstrip: {
    label: 'Filmstrip',
    margin: 20,
    before(ctx, w, h) {
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, w, h);
      // sprocket holes along left & right edges
      ctx.fillStyle = '#f2f2f2';
      const holeR = Math.max(3, w * 0.008);
      const spacing = holeR * 5;
      for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        ctx.arc(10, y, holeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w - 10, y, holeR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  torn: {
    label: 'Torn Paper',
    margin: 24,
    before(ctx, w, h) {
      ctx.fillStyle = '#faf6ee';
      ctx.fillRect(0, 0, w, h);
    },
    after(ctx, w, h) {
      // torn edge: jagged white border drawn inward from each side
      const seedRand = mulberry32(1234);
      ctx.fillStyle = '#faf6ee';
      const jag = Math.max(6, w * 0.012);
      drawTornEdge(ctx, w, h, jag, seedRand);
    }
  },
  tapedCorners: {
    label: 'Taped Corners',
    margin: 22,
    before(ctx, w, h) {
      ctx.fillStyle = '#f0ece2';
      ctx.fillRect(0, 0, w, h);
    },
    perCellAfter(ctx, rect) {
      drawTapeCorner(ctx, rect.px, rect.py, -8);
      drawTapeCorner(ctx, rect.px + rect.pw, rect.py, 8);
    }
  },
  coloredGutter: {
    label: 'Theme Color',
    margin: 18,
    before(ctx, w, h) {
      const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#c23b8f';
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, w, h);
    }
  },
  photoStack: {
    label: 'Photo Stack',
    margin: 30,
    before(ctx, w, h) {
      ctx.fillStyle = '#e8e4da';
      ctx.fillRect(0, 0, w, h);
    },
    perCellShadow: true
  }
};

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawTornEdge(ctx, w, h, jag, rand) {
  ctx.save();
  ctx.fillStyle = ctx.fillStyle; // keep caller's paper color
  const paperColor = ctx.fillStyle;
  ctx.fillStyle = paperColor;
  // draw four jagged strips just inside each edge to fake a torn border
  const step = jag * 2;
  [['top'], ['bottom'], ['left'], ['right']].forEach(([side]) => {
    ctx.beginPath();
    if (side === 'top' || side === 'bottom') {
      const y0 = side === 'top' ? 0 : h;
      const dir = side === 'top' ? 1 : -1;
      ctx.moveTo(0, y0);
      for (let x = 0; x <= w; x += step) {
        ctx.lineTo(x, y0 + dir * (rand() * jag));
      }
      ctx.lineTo(w, y0);
      ctx.closePath();
    } else {
      const x0 = side === 'left' ? 0 : w;
      const dir = side === 'left' ? 1 : -1;
      ctx.moveTo(x0, 0);
      for (let y = 0; y <= h; y += step) {
        ctx.lineTo(x0 + dir * (rand() * jag), y);
      }
      ctx.lineTo(x0, h);
      ctx.closePath();
    }
  });
  ctx.restore();
}

function drawTapeCorner(ctx, x, y, angleDeg) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleDeg * Math.PI / 180);
  ctx.fillStyle = 'rgba(255,255,220,0.55)';
  ctx.fillRect(-22, -10, 44, 20);
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-22, -10, 44, 20);
  ctx.restore();
}

// ---- Slot management ----
function loadImageFromFileCollage(file) {
  return loadImageFromFile(file); // reuse existing helper from batch export
}

collageOpenBtn.addEventListener('click', () => {
  if (editingCollageSlotIndex !== null) return; // finish editing the slot first
  collageOverlay.classList.add('open');
  renderCollageOptionGrids();
  updateCollagePreviewState();
});
collageCloseX.addEventListener('click', () => collageOverlay.classList.remove('open'));
collageOverlay.addEventListener('click', (e) => {
  if (e.target === collageOverlay) collageOverlay.classList.remove('open');
});

collageSelectBtn.addEventListener('click', () => {
  collageFileInput.value = '';
  collageFileInput.click();
});

collageFileInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  const room = 6 - collageSlots.length;
  const toAdd = files.slice(0, Math.max(0, room));
  for (const file of toAdd) {
    try {
      const img = await loadImageFromFileCollage(file);
      // inherit whatever look is currently active in the main editor as
      // this slot's starting state
      const inheritedState = sourceImg ? getState() : defaultCollageState();
      const newSlot = {
        file, img,
        state: inheritedState,
        fixedTimestamp: sourceImg ? fixedTimestamp : randomTimestamp(),
        fixedExifData: sourceImg ? fixedExifData : randomExifData(),
        leakSeed: sourceImg ? { ...leakSeed } : { x: 0.3, y: 0.2, angle: 25 },
        edited: false,
        editedCanvas: null
      };
      // pre-render a thumbnail so an inherited (non-default) look shows
      // immediately, without waiting for the user to open/close the editor
      newSlot.editedCanvas = renderSlotEditedCanvas(newSlot, 200);
      collageSlots.push(newSlot);
    } catch (err) { /* skip unreadable file */ }
  }
  renderCollageSlotList();
  renderCollageOptionGrids();
  updateCollagePreviewState();
});

// Fallback default state (matches app defaults) for the rare case a slot is
// added before any photo has ever been opened in the main editor.
function defaultCollageState() {
  return {
    theme: '', activeLut: 'none', polaroidInkColor: '#1a1a1a',
    leakSeed: { x: 0.3, y: 0.2, angle: 25 }, preset: 'none',
    grain: 0, flash: 0, satur: 0, pixel: 0, fade: 0, chroma: 0, leak: 0,
    scanlines: 0, sharpen: 0, vibrance: 0, tvcurve: 0,
    redBalance: 0, greenBalance: 0, blueBalance: 0,
    border: 'none', winFrame: false, winFrameColor: '#000000',
    overlay: 'none', overlayOpacity: 50, pixelEffect: 'none', pixelEffectStrength: 50,
    playStamp: false, batteryStamp: false, exifStamp: false, customStampText: '',
    polaroidCaptionText: '', polaroidCaptionNudge: 0, quality: 90,
    timestamp: false, vignette: false
  };
}

function renderCollageSlotList() {
  collageSlotListEl.innerHTML = '';
  collageSlots.forEach((slot, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'collage-slot-thumb';

    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = 56;
    thumbCanvas.height = 56;
    const tctx = thumbCanvas.getContext('2d');
    const srcCanvas = slot.editedCanvas || slot.img;
    coverDrawImage(tctx, srcCanvas, 0, 0, 56, 56);

    thumb.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('collage-slot-remove')) return;
      startEditingCollageSlot(i);
    });

    if (slot.edited) {
      const dot = document.createElement('div');
      dot.className = 'collage-slot-edited-dot';
      dot.title = 'Edited';
      thumb.appendChild(dot);
    }

    const remove = document.createElement('div');
    remove.className = 'collage-slot-remove';
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      collageSlots.splice(i, 1);
      renderCollageSlotList();
      renderCollageOptionGrids();
      updateCollagePreviewState();
    });

    const reorder = document.createElement('div');
    reorder.className = 'collage-slot-reorder';

    const moveLeft = document.createElement('div');
    moveLeft.className = 'collage-slot-move collage-slot-move-left';
    moveLeft.textContent = '‹';
    moveLeft.title = 'Move left';
    if (i === 0) moveLeft.classList.add('disabled');
    moveLeft.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (i === 0) return;
      reorderCollageSlot(i, i - 1);
    });

    const moveRight = document.createElement('div');
    moveRight.className = 'collage-slot-move collage-slot-move-right';
    moveRight.textContent = '›';
    moveRight.title = 'Move right';
    if (i === collageSlots.length - 1) moveRight.classList.add('disabled');
    moveRight.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (i === collageSlots.length - 1) return;
      reorderCollageSlot(i, i + 1);
    });

    reorder.appendChild(moveLeft);
    reorder.appendChild(moveRight);

    thumb.appendChild(thumbCanvas);
    thumb.appendChild(remove);
    thumb.appendChild(reorder);
    collageSlotListEl.appendChild(thumb);
  });
}

// Swaps two slots by index (used by the reorder arrow buttons). Cell/layout
// assignment is just array order, so this is a plain array swap + re-render.
function reorderCollageSlot(fromIndex, toIndex) {
  const tmp = collageSlots[fromIndex];
  collageSlots[fromIndex] = collageSlots[toIndex];
  collageSlots[toIndex] = tmp;
  renderCollageSlotList();
  updateCollagePreviewState();
}

// ---- Enter/exit per-slot editing in the main editor ----
function startEditingCollageSlot(index) {
  const slot = collageSlots[index];
  if (!slot) return;

  // stash whatever the main editor currently holds (could be the user's
  // own separate photo, or a previous collage edit session)
  stashedMainEditor = {
    sourceImg: sourceImg,
    state: sourceImg ? getState() : null,
    fixedTimestamp: fixedTimestamp,
    fixedExifData: fixedExifData,
    leakSeed: { ...leakSeed }
  };

  editingCollageSlotIndex = index;

  // isolate undo/redo: stash the main editor's history stack and give this
  // slot-editing session its own, so undo/redo while editing a collage
  // photo can't step into the user's main photo's history and vice versa
  stashedMainEditor.historyStack = historyStack;
  stashedMainEditor.historyIndex = historyIndex;
  historyStack = slot.historyStack ? slot.historyStack.slice() : [];
  historyIndex = slot.historyIndex !== undefined ? slot.historyIndex : -1;
  if (historyStack.length === 0) {
    historyStack = [JSON.stringify(slot.state)];
    historyIndex = 0;
  }

  sourceImg = slot.img;
  isPlaceholderImage = false;
  fixedTimestamp = slot.fixedTimestamp;
  fixedExifData = slot.fixedExifData;
  leakSeed = { ...slot.leakSeed };
  applyState(slot.state); // this also calls render()

  emptyState.style.display = 'none';
  canvas.style.display = 'block';
  saveBtn.disabled = false;
  menuSaveBtn.disabled = false;
  menuResetBtn.disabled = false;
  menuRandomizeBtn.disabled = false;
  menuShuffleLookBtn.disabled = false;

  collageEditBannerText.textContent = `Editing Collage Photo ${index + 1} of ${collageSlots.length}`;
  collageEditBanner.style.display = 'flex';
  collageOverlay.classList.remove('open');
  updateUndoRedoButtons();
}

function finishEditingCollageSlot() {
  if (editingCollageSlotIndex === null) return;
  const slot = collageSlots[editingCollageSlotIndex];

  slot.state = getState();
  slot.fixedTimestamp = fixedTimestamp;
  slot.fixedExifData = fixedExifData;
  slot.leakSeed = { ...leakSeed };
  slot.edited = true;
  slot.editedCanvas = renderSlotEditedCanvas(slot, 200);

  // save this slot's history so it resumes correctly if re-opened, then
  // restore the main editor's own undo/redo stack
  slot.historyStack = historyStack;
  slot.historyIndex = historyIndex;
  historyStack = stashedMainEditor.historyStack || [];
  historyIndex = stashedMainEditor.historyIndex !== undefined ? stashedMainEditor.historyIndex : -1;

  editingCollageSlotIndex = null;
  collageEditBanner.style.display = 'none';

  // restore whatever the main editor held before this edit session
  if (stashedMainEditor && stashedMainEditor.sourceImg) {
    sourceImg = stashedMainEditor.sourceImg;
    fixedTimestamp = stashedMainEditor.fixedTimestamp;
    fixedExifData = stashedMainEditor.fixedExifData;
    leakSeed = stashedMainEditor.leakSeed;
    applyState(stashedMainEditor.state);
  } else {
    sourceImg = null;
    isPlaceholderImage = true;
    canvas.style.display = 'none';
    emptyState.style.display = '';
    saveBtn.disabled = true;
    menuSaveBtn.disabled = true;
    menuResetBtn.disabled = true;
    menuRandomizeBtn.disabled = true;
    menuShuffleLookBtn.disabled = true;
  }
  stashedMainEditor = null;

  renderCollageSlotList();
  collageOverlay.classList.add('open');
  updateUndoRedoButtons();
}

collageDoneEditingBtn.addEventListener('click', finishEditingCollageSlot);

// ---- Option grids (layout + frame pickers) ----
function miniLayoutSVG(def, n) {
  const cells = def.cells(Math.max(n, def.minPhotos));
  const parts = cells.map(([x, y, w, h]) =>
    `<rect x="${x * 100}" y="${y * 100}" width="${w * 100 - 3}" height="${h * 100 - 3}" fill="#9ab" stroke="#456" stroke-width="1.5"/>`
  ).join('');
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${parts}</svg>`;
}

function miniFrameSVG(id) {
  const swatches = {
    thickWhite: '<rect width="100" height="100" fill="#fff" stroke="#ccc"/><rect x="14" y="14" width="72" height="72" fill="#9ab"/>',
    filmstrip: '<rect width="100" height="100" fill="#111"/><rect x="16" y="8" width="68" height="84" fill="#9ab"/><circle cx="7" cy="20" r="3" fill="#eee"/><circle cx="7" cy="50" r="3" fill="#eee"/><circle cx="7" cy="80" r="3" fill="#eee"/><circle cx="93" cy="20" r="3" fill="#eee"/><circle cx="93" cy="50" r="3" fill="#eee"/><circle cx="93" cy="80" r="3" fill="#eee"/>',
    torn: '<rect width="100" height="100" fill="#faf6ee"/><polygon points="12,10 20,14 15,20 25,24 18,30 88,30 88,88 12,88" fill="#9ab"/>',
    tapedCorners: '<rect width="100" height="100" fill="#f0ece2"/><rect x="12" y="12" width="76" height="76" fill="#9ab"/><rect x="4" y="4" width="18" height="9" fill="#fff9c4" opacity="0.8" transform="rotate(-20 13 8)"/><rect x="78" y="4" width="18" height="9" fill="#fff9c4" opacity="0.8" transform="rotate(20 87 8)"/>',
    coloredGutter: '<rect width="100" height="100" fill="#c23b8f"/><rect x="14" y="14" width="72" height="72" fill="#9ab"/>',
    photoStack: '<rect width="100" height="100" fill="#e8e4da"/><rect x="26" y="20" width="55" height="55" fill="#cfd6e0" transform="rotate(-6 53 47)"/><rect x="20" y="26" width="55" height="55" fill="#9ab" transform="rotate(4 47 53)"/>'
  };
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${swatches[id] || ''}</svg>`;
}

function renderCollageOptionGrids() {
  const n = Math.max(collageSlots.length, 2);
  const available = layoutsForCount(n);

  // if current layout no longer valid for slot count, fall back to first available
  if (!available.find(([id]) => id === collageLayoutId) && available.length) {
    collageLayoutId = available[0][0];
  }

  collageLayoutGrid.innerHTML = '';
  available.forEach(([id, def]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'collage-option-btn' + (id === collageLayoutId ? ' selected' : '');
    btn.innerHTML = miniLayoutSVG(def, n) + `<span class="collage-option-label">${def.label}</span>`;
    btn.addEventListener('click', () => {
      collageLayoutId = id;
      renderCollageOptionGrids();
      updateCollagePreviewState();
    });
    collageLayoutGrid.appendChild(btn);
  });

  collageFrameGrid.innerHTML = '';
  Object.entries(COLLAGE_FRAMES).forEach(([id, def]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'collage-option-btn' + (id === collageFrameId ? ' selected' : '');
    btn.innerHTML = miniFrameSVG(id) + `<span class="collage-option-label">${def.label}</span>`;
    btn.addEventListener('click', () => {
      collageFrameId = id;
      renderCollageOptionGrids();
      updateCollagePreviewState();
    });
    collageFrameGrid.appendChild(btn);
  });
}

collageGutterEl.addEventListener('input', () => {
  collageGutterVal.textContent = `${collageGutterEl.value}px`;
  updateCollagePreviewState();
});
collageBgColorEl.addEventListener('input', updateCollagePreviewState);

function updateCollagePreviewState() {
  const ready = collageSlots.length >= 2;
  collageGenerateBtn.disabled = !ready;
  if (!ready) {
    collagePreviewCanvas.style.display = 'none';
    collagePreviewEmpty.style.display = 'block';
    collageDownloadBtn.disabled = true;
  }
}

// ---- Rendering ----
// coverDraw: draws img into the given rect using cover-fit (fills rect,
// cropping overflow) — same visual behavior as object-fit:cover.
function coverDrawImage(ctx, img, x, y, w, h) {
  // works with both <img> and <canvas> sources
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const ir = iw / ih;
  const dr = w / h;
  let sx, sy, sw, sh;
  if (ir > dr) {
    sh = ih;
    sw = sh * dr;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = sw / dr;
    sx = 0;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function renderCollage(targetCanvas, outW) {
  const n = collageSlots.length;
  if (n < 2) return;
  const layout = COLLAGE_LAYOUTS[collageLayoutId];
  const frame = COLLAGE_FRAMES[collageFrameId];
  const gutter = parseInt(collageGutterEl.value, 10);
  const bgColor = collageBgColorEl.value;
  const margin = frame.margin;

  const outH = Math.round(outW / (layout.aspect || 1));
  targetCanvas.width = outW;
  targetCanvas.height = outH;
  const ctx = targetCanvas.getContext('2d');
  ctx.clearRect(0, 0, outW, outH);

  // Render each slot's edited look at a resolution matched to its cell size
  // in this specific output, so exports stay crisp and previews stay fast.
  const cellLongEdge = Math.round(outW / Math.ceil(Math.sqrt(n)));
  const renderedSlots = collageSlots.map(slot =>
    renderSlotEditedCanvas(slot, Math.max(cellLongEdge, 300))
  );

  // frame background
  if (frame.before) {
    frame.before(ctx, outW, outH);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, outW, outH);
  }

  const innerX = margin, innerY = margin;
  const innerW = outW - margin * 2, innerH = outH - margin * 2;
  const cells = layout.cells(n);
  const isScattered = collageLayoutId === 'scattered';

  cells.forEach(([fx, fy, fw, fh], i) => {
    const slot = collageSlots[i];
    const editedImg = renderedSlots[i];
    if (!slot || !editedImg) return;
    const cx = innerX + fx * innerW;
    const cy = innerY + fy * innerH;
    const cw = fw * innerW;
    const ch = fh * innerH;
    const gx = cx + gutter / 2;
    const gy = cy + gutter / 2;
    const gw = Math.max(4, cw - gutter);
    const gh = Math.max(4, ch - gutter);

    ctx.save();
    if (isScattered) {
      const rot = (layout.rotations[i] || 0) * Math.PI / 180;
      const ccx = gx + gw / 2, ccy = gy + gh / 2;
      ctx.translate(ccx, ccy);
      ctx.rotate(rot);
      ctx.translate(-ccx, -ccy);
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#fff';
      ctx.fillRect(gx - 6, gy - 6, gw + 12, gh + 12);
      ctx.shadowColor = 'transparent';
    } else if (frame.perCellShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = '#fff';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.shadowColor = 'transparent';
    } else if (!bgColor) {
      // no-op
    }

    ctx.beginPath();
    ctx.rect(gx, gy, gw, gh);
    ctx.clip();
    coverDrawImage(ctx, editedImg, gx, gy, gw, gh);
    ctx.restore();

    if (frame.perCellAfter) {
      frame.perCellAfter(ctx, { px: gx + gw / 2, py: gy, pw: gw });
    }
  });

  if (frame.after) frame.after(ctx, outW, outH);
}

collageGenerateBtn.addEventListener('click', () => {
  renderCollage(collagePreviewCanvas, 900);
  collagePreviewCanvas.style.display = 'block';
  collagePreviewEmpty.style.display = 'none';
  collageDownloadBtn.disabled = false;
});

collageDownloadBtn.addEventListener('click', () => {
  const exportCanvas = document.createElement('canvas');
  renderCollage(exportCanvas, 2000);
  const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
  const link = document.createElement('a');
  link.download = `y2kam-collage-${Date.now()}.jpg`;
  link.href = dataUrl;
  link.click();
});

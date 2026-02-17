(() => {
  const langEl = document.getElementById("lang");
  const nameEl = document.getElementById("name");
  const canvas = document.getElementById("imageCanvas");
  const downloadBtn = document.getElementById("downloadBtn");
  const downloadLink = document.getElementById("downloadLink");

  // Calibration elements
  const upBtn = document.getElementById("upBtn");
  const downBtn = document.getElementById("downBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const copyBtn = document.getElementById("copyBtn");
  const resetBtn = document.getElementById("resetBtn");
  const xVal = document.getElementById("xVal");
  const yVal = document.getElementById("yVal");

  if (!langEl || !nameEl || !canvas || !downloadBtn || !downloadLink) return;

  // Keep page RTL Arabic always
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";

  // Match your image size exactly
  canvas.width = 2016;
  canvas.height = 3840;

  const ctx = canvas.getContext("2d");

  // ✅ Your exact filenames
  const CARD_BG = {
    ar: "images/card-ar.png",
    en: "images/card-en.png",
    fr: "images/card-fr.png",
    bn: "images/card-bn.png",
    in: "images/card-in.png",
    ur: "images/card-ur.png",
  };

  // ✅ Default position (the red rectangle area)
  const DEFAULT_NAME_X = 1008; // center of 2016
  const DEFAULT_NAME_Y = 3150; // your target zone under the greeting text

  // current position (calibrated)
  let nameX = DEFAULT_NAME_X;
  let nameY = DEFAULT_NAME_Y;

  // Font sizes per language (optional)
  const FONT_SIZE = {
    ar: 95,
    ur: 95,
    en: 85,
    fr: 85,
    bn: 85,
    in: 85,
  };

  const NAME_COLOR = "#AD8252";
  const FONT_FAMILY = "Tajawal, Arial, sans-serif";
  const FONT_WEIGHT = "700";
  const STEP = 10;

  const bgImg = new Image();
  bgImg.crossOrigin = "anonymous";

  function getBgSrc() {
    const lang = langEl.value || "ar";
    return CARD_BG[lang] || CARD_BG.ar;
  }

  function updateXYUI() {
    if (xVal) xVal.textContent = String(nameX);
    if (yVal) yVal.textContent = String(nameY);
  }

  function loadBackground() {
    bgImg.src = getBgSrc();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (bgImg.complete && bgImg.naturalWidth) {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }

    // Name
    const name = (nameEl.value || "").trim();
    if (name) {
      const lang = langEl.value || "ar";
      let size = FONT_SIZE[lang] || 85;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = NAME_COLOR;

      ctx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;

      // Auto-fit for long names
      const maxWidth = canvas.width * 0.75;
      while (ctx.measureText(name).width > maxWidth && size > 55) {
        size -= 2;
        ctx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;
      }

      ctx.fillText(name, nameX, nameY);
    }

    updateXYUI();
  }

  function download() {
    draw();
    const dataUrl = canvas.toDataURL("image/png");

    const safeName = (nameEl.value || "name")
      .trim()
      .replace(/[^\w\u0600-\u06FF\u0980-\u09FF\u00C0-\u017F\s-]/g, "")
      .replace(/\s+/g, "_");

    const lang = langEl.value || "ar";
    downloadLink.href = dataUrl;
    downloadLink.download = `Bushra_${lang}_${safeName}.png`;
    downloadLink.click();
  }

  // Calibration moves
  function move(dx, dy) {
    nameX += dx;
    nameY += dy;
    draw();
  }

  // Button events
  langEl.addEventListener("change", () => {
    loadBackground();
    // keep same position, just change background
    draw();
  });

  nameEl.addEventListener("input", draw);
  downloadBtn.addEventListener("click", download);

  if (upBtn) upBtn.addEventListener("click", () => move(0, -STEP));
  if (downBtn) downBtn.addEventListener("click", () => move(0, STEP));
  if (leftBtn) leftBtn.addEventListener("click", () => move(-STEP, 0));
  if (rightBtn) rightBtn.addEventListener("click", () => move(STEP, 0));

  if (resetBtn) resetBtn.addEventListener("click", () => {
    nameX = DEFAULT_NAME_X;
    nameY = DEFAULT_NAME_Y;
    draw();
  });

  if (copyBtn) copyBtn.addEventListener("click", async () => {
    const lang = langEl.value || "ar";
    const text = `${lang}: { x: ${nameX}, y: ${nameY} }`;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "تم النسخ ✅";
      setTimeout(() => (copyBtn.textContent = "نسخ الإحداثيات"), 1200);
    } catch (e) {
      // fallback
      alert(text);
    }
  });

  // Keyboard arrows (nice bonus)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") move(0, -STEP);
    if (e.key === "ArrowDown") move(0, STEP);
    if (e.key === "ArrowLeft") move(-STEP, 0);
    if (e.key === "ArrowRight") move(STEP, 0);
  });

  bgImg.onload = draw;

  // Init
  updateXYUI();
  loadBackground();
})();

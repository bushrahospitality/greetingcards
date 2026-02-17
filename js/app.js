(() => {
  const langEl = document.getElementById("lang");
  const nameEl = document.getElementById("name");
  const canvas = document.getElementById("imageCanvas");
  const downloadBtn = document.getElementById("downloadBtn");
  const downloadLink = document.getElementById("downloadLink");

  const upBtn = document.getElementById("upBtn");
  const downBtn = document.getElementById("downBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (!langEl || !nameEl || !canvas || !downloadBtn || !downloadLink) return;

  // تثبيت الصفحة عربي RTL
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";

  // مقاس الصور الحقيقي
  canvas.width = 2016;
  canvas.height = 3840;

  const ctx = canvas.getContext("2d");

  // الصور حسب اللغة
  const CARD_BG = {
    ar: "images/card-ar.png",
    en: "images/card-en.png",
    fr: "images/card-fr.png",
    bn: "images/card-bn.png",
    in: "images/card-in.png",
    ur: "images/card-ur.png",
  };

  // مكان الاسم الافتراضي (المستطيل الأحمر)
  const DEFAULT_X = 1008;  // منتصف 2016
  const DEFAULT_Y = 3150;  // تحت عبارة التهنئة

  let nameX = DEFAULT_X;
  let nameY = DEFAULT_Y;

  const STEP = 10;

  // حجم الخط حسب اللغة
  const FONT_SIZE = {
    ar: 95,
    ur: 95,
    en: 85,
    fr: 85,
    bn: 85,
    in: 85,
  };

  const NAME_COLOR = "#154F83";
  const FONT_FAMILY = "Tajawal, Arial, sans-serif";
  const FONT_WEIGHT = "700";

  const bgImg = new Image();
  bgImg.crossOrigin = "anonymous";

  function loadBackground() {
    const lang = langEl.value || "ar";
    bgImg.src = CARD_BG[lang] || CARD_BG.ar;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم الخلفية
    if (bgImg.complete && bgImg.naturalWidth) {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }

    const name = (nameEl.value || "").trim();
    if (!name) return;

    const lang = langEl.value || "ar";
    let size = FONT_SIZE[lang] || 85;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = NAME_COLOR;
    ctx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;

    // تصغير تلقائي لو الاسم طويل
    const maxWidth = canvas.width * 0.75;
    while (ctx.measureText(name).width > maxWidth && size > 55) {
      size -= 2;
      ctx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;
    }

    ctx.fillText(name, nameX, nameY);
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

  function move(dx, dy) {
    nameX += dx;
    nameY += dy;
    draw();
  }

  // Events
  langEl.addEventListener("change", () => {
    loadBackground();
    draw();
  });

  nameEl.addEventListener("input", draw);
  downloadBtn.addEventListener("click", download);

  if (upBtn) upBtn.addEventListener("click", () => move(0, -STEP));
  if (downBtn) downBtn.addEventListener("click", () => move(0, STEP));
  if (leftBtn) leftBtn.addEventListener("click", () => move(-STEP, 0));
  if (rightBtn) rightBtn.addEventListener("click", () => move(STEP, 0));

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      nameX = DEFAULT_X;
      nameY = DEFAULT_Y;
      draw();
    });
  }

  bgImg.onload = draw;

  // تشغيل أولي
  loadBackground();
})();

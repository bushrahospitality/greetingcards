/* Arabic UI ثابت + اختيار بطاقة حسب اللغة + كتابة الاسم */

(() => {
  const langEl = document.getElementById("lang");
  const nameEl = document.getElementById("name");
  const canvas = document.getElementById("imageCanvas");
  const downloadBtn = document.getElementById("downloadBtn");
  const downloadLink = document.getElementById("downloadLink");

  if (!langEl || !nameEl || !canvas || !downloadBtn || !downloadLink) return;

  // ✅ ثبتي لغة/اتجاه الصفحة (ولا نغيّرهم مرة ثانية)
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";

  const ctx = canvas.getContext("2d");

  // ✅ ربط الاختيار بالصور (حسب أسماء ملفاتك بالضبط)
  const CARD_BG = {
    ar: "images/card-ar.png",
    en: "images/card-en.png",
    fr: "images/card-fr.png",
    bn: "images/card-bn.png",
    in: "images/card-in.png",
    ur: "images/card-ur.png",
  };

  // ✅ مكان الاسم تحت عبارة "تقبل الله منا ومنكم"
  const NAME_X_RATIO = 0.5;     // وسط
  const NAME_Y_RATIO = 0.804;   // تحت النص (عدّليها إذا احتجتي)

  // ✅ حجم الخط لكل لغة (اختياري)
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

  const bgImg = new Image();
  bgImg.crossOrigin = "anonymous";

  function loadBackground() {
    const lang = langEl.value || "ar";
    const src = CARD_BG[lang] || CARD_BG.ar;
    bgImg.src = src;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // خلفية البطاقة
    if (bgImg.complete && bgImg.naturalWidth) {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }

    const name = (nameEl.value || "").trim();
    if (!name) return;

    const lang = langEl.value || "ar";
    let size = FONT_SIZE[lang] || 85;

    // الاسم في المنتصف (يناسب RTL/LTR بدون مشاكل)
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = NAME_COLOR;

    const x = canvas.width * NAME_X_RATIO;
    const y = canvas.height * NAME_Y_RATIO;

    // Auto-fit للاسم الطويل
    const maxWidth = canvas.width * 0.78;
    ctx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;
    while (ctx.measureText(name).width > maxWidth && size > 50) {
      size -= 2;
      ctx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`;
    }

    ctx.fillText(name, x, y);
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

  // events
  langEl.addEventListener("change", () => {
    loadBackground(); // draw will happen when image loads
  });
  nameEl.addEventListener("input", draw);
  downloadBtn.addEventListener("click", download);

  bgImg.onload = draw;

  // init
  loadBackground();
})();

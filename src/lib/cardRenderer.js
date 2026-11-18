/**
 * Bộ tạo thiệp 20/11 nguyên bản Full HD (1920x1080)
 * Đồng nhất font chữ, màu chữ, cỡ chữ giữa Người nhận - Lời chúc - Người gửi
 * và căn chỉnh chính xác tọa độ cho cả 6 mẫu frame để không bao giờ bị đè chữ hay vỡ nét.
 */

export const CARD_WIDTH = 1920;
export const CARD_HEIGHT = 1080; // Chuẩn Full HD 16:9 khớp 1:1 với ảnh gốc 1920x1080 (xuất ảnh siêu nét, không vỡ chữ)

export const WISH_TOPICS = [
  {
    id: 'sample_1',
    badge: 'Mẫu tri ân 1',
    text: 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!'
  },
  {
    id: 'sample_2',
    badge: 'Mẫu tri ân 2',
    text: 'Cảm ơn Thầy/Cô đã luôn kiên nhẫn định hướng và tiếp thêm cho chúng em niềm tin. Kính chúc Thầy/Cô ngày 20/11 thật nhiều hạnh phúc!'
  },
  {
    id: 'sample_3',
    badge: 'Mẫu tri ân 3',
    text: 'Ơn dạy dỗ cao dầy hơn núi, nghĩa thầy cô sâu thẳm tựa biển khơi. Em xin gửi lời tri ân sâu sắc và lòng biết ơn chân thành nhất đến Thầy/Cô!'
  }
];

export const FRAME_STYLES = [
  {
    id: 'luxury_cream',
    name: 'Mẫu 1',
    desc: 'Thiệp cô giáo áo vàng trên nền kem, viền xanh trang nhã'
  },
  {
    id: 'collegiate_navy',
    name: 'Mẫu 2',
    desc: 'Thiệp bìa xanh lá đậm, sách mở và bó hoa cúc ấm áp'
  },
  {
    id: 'slate_chalk',
    name: 'Mẫu 3',
    desc: 'Thiệp vòm kem cô giáo áo vàng trên nền xanh nhã nhặn'
  },
  {
    id: 'international_uk_au',
    name: 'Mẫu 4',
    desc: 'Bưu thiếp Quốc tế - Big Ben & Sydney Opera House'
  },
  {
    id: 'airmail_global',
    name: 'Mẫu 5',
    desc: 'Phong thư Hàng không Quốc tế - BTEC & Melbourne'
  },
  {
    id: 'vintage_journey',
    name: 'Mẫu 6',
    desc: 'Lưu bút Hội nhập - UK & Melbourne Polytechnic'
  }
];

// Font chữ thống nhất, sắc nét, hỗ trợ dấu tiếng Việt chuẩn cho cả 3 mục nội dung
export const CARD_CONTENT_FONT_FAMILY = '"Lora", "Playfair Display", "Times New Roman", serif';
export const CARD_CONTENT_FONT_WEIGHT = '600';
export const CARD_LABEL_FONT = `600 40px ${CARD_CONTENT_FONT_FAMILY}`;
export const CARD_LABEL_COLOR = '#053D28';
export const CARD_WISH_FONT = `600 46px ${CARD_CONTENT_FONT_FAMILY}`;

// Cấu hình tọa độ & màu sắc đo chính xác theo pixel trên từng frame gốc 1920x1080
const TEMPLATE_CONFIGS = {
  luxury_cream: {
    color: '#053D28',
    baseFontSize: 46,
    fallbackBg: '#FDF0D6',
    recipient: { x: 406, y: 377, maxW: 920 },
    wish: { x: 99, startY: 556, maxW: 1120, maxBottomY: 856, lineHeightRatio: 1.42 },
    sender: { x: 364, y: 951, maxW: 685 }
  },
  collegiate_navy: {
    color: '#FEFBE4',
    baseFontSize: 46,
    fallbackBg: '#033629',
    recipient: { x: 410, y: 488, maxW: 885 },
    wish: { x: 113, startY: 644, maxW: 980, maxBottomY: 846, lineHeightRatio: 1.38 },
    sender: { x: 378, y: 929, maxW: 605 }
  },
  slate_chalk: {
    color: '#2C3C03',
    baseFontSize: 46,
    fallbackBg: '#FDF1DB',
    recipient: { x: 402, y: 479, maxW: 830 },
    wish: { x: 105, startY: 642, maxW: 920, maxBottomY: 842, lineHeightRatio: 1.38 },
    sender: { x: 368, y: 922, maxW: 520 }
  },
  international_uk_au: {
    color: '#001239',
    baseFontSize: 40,
    fallbackBg: '#FDF4E9',
    recipient: { x: 316, y: 222, maxW: 1160 },
    wish: { x: 52, startY: 368, maxW: 1520, maxBottomY: 612, lineHeightRatio: 1.44 },
    sender: {
      x: 1545,
      y: 728,
      rightBound: 1865,
      shiftable: true,
      origLabelX: 1329,
      origLabelW: 196,
      minLabelX: 600,
      patchY: 684,
      patchH: 76,
      patchSampleX: 1540,
      patchBg: '#FDF3E8',
      labelFont: `700 40px ${CARD_CONTENT_FONT_FAMILY}`
    }
  },
  airmail_global: {
    color: '#000338',
    baseFontSize: 40,
    fallbackBg: '#FDF4E4',
    recipient: { x: 515, y: 398, maxW: 1140 },
    wish: { x: 263, startY: 552, maxW: 1380, maxBottomY: 842, lineHeightRatio: 1.44 },
    sender: {
      x: 1248,
      y: 929,
      rightBound: 1565,
      shiftable: true,
      origLabelX: 1032,
      origLabelW: 196,
      minLabelX: 263,
      patchY: 886,
      patchH: 76,
      patchSampleX: 1245,
      patchBg: '#FDF3E4',
      labelFont: `700 40px ${CARD_CONTENT_FONT_FAMILY}`
    }
  },
  vintage_journey: {
    color: '#00183E',
    baseFontSize: 40,
    fallbackBg: '#FCEAD1',
    recipient: { x: 295, y: 299, maxW: 960 },
    wish: { x: 55, startY: 450, maxW: 1150, maxBottomY: 912, lineHeightRatio: 1.46 },
    sender: { x: 270, y: 1006, maxW: 910 }
  }
};

// Caching ảnh khung thiệp
const cachedFrameImgs = {};
const FRAME_URLS = {
  luxury_cream: '/frames/frame_mau_1.png?v=7',
  collegiate_navy: '/frames/frame_mau_2.png?v=7',
  slate_chalk: '/frames/frame_mau_3.png?v=7',
  international_uk_au: '/frames/frame_mau_4.png?v=7',
  airmail_global: '/frames/frame_mau_5.png?v=7',
  vintage_journey: '/frames/frame_mau_6.png?v=7'
};

function loadFrameImage(styleId) {
  const url = FRAME_URLS[styleId];
  if (!url) return Promise.resolve(null);
  const cached = cachedFrameImgs[styleId];
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedFrameImgs[styleId] = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}

let fontsReadyPromise = null;
function ensureFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) {
    return Promise.resolve();
  }
  if (!fontsReadyPromise) {
    fontsReadyPromise = Promise.all([
      document.fonts.ready,
      document.fonts.load('600 46px "Lora"').catch(() => {}),
      document.fonts.load('700 40px "Lora"').catch(() => {})
    ]).then(() => {});
  }
  return fontsReadyPromise;
}

function buildContentFont(sizePx) {
  return `${CARD_CONTENT_FONT_WEIGHT} ${sizePx}px ${CARD_CONTENT_FONT_FAMILY}`;
}

/**
 * Ngắt dòng văn bản thông minh: giữ nguyên xuống dòng chủ động (\n)
 * và tự động ngắt cả những từ viết liền quá dài (vd: "aaaaaaaa...") để không tràn khung.
 */
function wrapText(ctx, text, maxWidth) {
  const paragraphs = text.split(/\r?\n/);
  const lines = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      if (lines.length > 0) lines.push('');
      continue;
    }

    const words = trimmed.split(/\s+/);
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (ctx.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }

        // Nếu bản thân 1 từ đơn đã dài hơn maxWidth, tách theo ký tự
        if (ctx.measureText(word).width > maxWidth) {
          let chunk = '';
          for (const ch of word) {
            if (ctx.measureText(chunk + ch).width <= maxWidth || !chunk) {
              chunk += ch;
            } else {
              lines.push(chunk);
              chunk = ch;
            }
          }
          currentLine = chunk;
        } else {
          currentLine = word;
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

export function normalizeTeacherPrefix(name) {
  if (!name || typeof name !== 'string') return name;
  let trimmed = name.trim();
  trimmed = trimmed
    .replace(/^thầy\/cô/i, 'thầy/cô')
    .replace(/^thầy\s+/i, 'thầy ')
    .replace(/^cô\s+/i, 'cô ')
    .replace(/^quý\s+thầy\s+cô/i, 'quý thầy cô');
  return trimmed;
}

/**
 * Vẽ đồng nhất 3 mục nội dung (Người nhận, Lời chúc, Người gửi) cho tất cả 6 mẫu thiệp
 * - Cùng font chữ, cùng kiểu chữ (SemiBold sắc nét), cùng cỡ chữ cơ sở, cùng màu chữ tiệp với mẫu thiệp
 * - Không đè lên nhãn in sẵn và không tràn ra hình minh họa / viền thiệp
 */
function drawTemplateContent(ctx, bgImg, data, cfg) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = cfg.color;

  const baseSize = cfg.baseFontSize;
  const minSize = 24;

  // 1. NGƯỜI NHẬN (Nằm gọn sau nhãn "Người nhận:" in sẵn)
  const teacher = data.teacher_name && data.teacher_name.trim()
    ? data.teacher_name.trim()
    : 'thầy/cô kính mến';

  let recipientSize = baseSize;
  ctx.font = buildContentFont(recipientSize);
  while (ctx.measureText(teacher).width > cfg.recipient.maxW && recipientSize > minSize) {
    recipientSize--;
    ctx.font = buildContentFont(recipientSize);
  }
  ctx.fillText(teacher, cfg.recipient.x, cfg.recipient.y);

  // 2. LỜI CHÚC (Nằm ngay dưới nhãn "Lời chúc:", cùng font - cùng màu - cùng cỡ chữ)
  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message && data.message.trim() ? data.message.trim() : defaultMsg;

  let wishSize = baseSize;
  let lineHeight = Math.round(wishSize * cfg.wish.lineHeightRatio);
  ctx.font = buildContentFont(wishSize);
  let lines = wrapText(ctx, rawText, cfg.wish.maxW);

  const availHeight = cfg.wish.maxBottomY - cfg.wish.startY;
  while (
    lines.length > 1 &&
    (lines.length - 1) * lineHeight > availHeight &&
    wishSize > minSize
  ) {
    wishSize--;
    lineHeight = Math.round(wishSize * cfg.wish.lineHeightRatio);
    ctx.font = buildContentFont(wishSize);
    lines = wrapText(ctx, rawText, cfg.wish.maxW);
  }

  const maxVisibleLines = Math.max(1, Math.floor(availHeight / lineHeight) + 1);
  for (let i = 0; i < Math.min(lines.length, maxVisibleLines); i++) {
    ctx.fillText(lines[i], cfg.wish.x, cfg.wish.startY + i * lineHeight);
  }

  // 3. NGƯỜI GỬI (Nằm gọn sau nhãn "Người gửi:", tự động dịch trái trên Mẫu 4 & 5 nếu tên dài)
  const sender = data.is_anonymous
    ? 'Một sinh viên BTEC FPT'
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');

  let senderSize = baseSize;
  ctx.font = buildContentFont(senderSize);
  const senderCfg = cfg.sender;

  if (senderCfg.shiftable) {
    const defaultMaxW = senderCfg.rightBound - senderCfg.x;
    const senderW = ctx.measureText(sender).width;

    if (senderW <= defaultMaxW) {
      // Tên vừa khít khoảng trống bên phải nhãn "Người gửi:" in sẵn
      ctx.fillText(sender, senderCfg.x, senderCfg.y);
    } else {
      // Tên dài: dịch cả cụm "Người gửi: [Tên]" sang trái để không đè và không tràn viền
      const labelText = 'Người gửi:';
      const hasBgLabel = !!(bgImg && bgImg.naturalWidth > 0 && senderCfg.origLabelW);
      let labelW = senderCfg.origLabelW || 196;
      if (!hasBgLabel) {
        ctx.font = senderCfg.labelFont;
        labelW = ctx.measureText(labelText).width;
      }
      const gap = 22;

      ctx.font = buildContentFont(senderSize);
      const curSenderW = ctx.measureText(sender).width;
      let labelX = senderCfg.rightBound - (labelW + gap + curSenderW);

      if (labelX < senderCfg.minLabelX) {
        labelX = senderCfg.minLabelX;
        const maxSenderW = senderCfg.rightBound - (labelX + labelW + gap);
        while (ctx.measureText(sender).width > maxSenderW && senderSize > minSize) {
          senderSize--;
          ctx.font = buildContentFont(senderSize);
        }
      }

      const nameX = labelX + labelW + gap;
      const coverX = Math.min(labelX - 12, senderCfg.origLabelX - 12);
      const coverW = senderCfg.rightBound - coverX + 20;

      // Che phần nhãn "Người gửi:" gốc bằng chính lát nền sạch từ ảnh gốc để không lộ viền
      if (hasBgLabel) {
        ctx.drawImage(
          bgImg,
          senderCfg.patchSampleX,
          senderCfg.patchY,
          80,
          senderCfg.patchH,
          coverX,
          senderCfg.patchY,
          coverW,
          senderCfg.patchH
        );
        // Sao chép nguyên bản chữ "Người gửi:" của ảnh gốc sang vị trí mới để khớp font 100%
        ctx.drawImage(
          bgImg,
          senderCfg.origLabelX - 4,
          senderCfg.patchY,
          labelW + 8,
          senderCfg.patchH,
          labelX - 4,
          senderCfg.patchY,
          labelW + 8,
          senderCfg.patchH
        );
      } else {
        ctx.fillStyle = senderCfg.patchBg;
        ctx.fillRect(coverX, senderCfg.patchY, coverW, senderCfg.patchH);
        ctx.fillStyle = cfg.color;
        ctx.font = senderCfg.labelFont;
        ctx.fillText(labelText, labelX, senderCfg.y);
      }

      // Vẽ tên người gửi đồng nhất font/màu/cỡ chữ
      ctx.fillStyle = cfg.color;
      ctx.font = buildContentFont(senderSize);
      ctx.fillText(sender, nameX, senderCfg.y);
    }
  } else {
    while (ctx.measureText(sender).width > senderCfg.maxW && senderSize > minSize) {
      senderSize--;
      ctx.font = buildContentFont(senderSize);
    }
    ctx.fillText(sender, senderCfg.x, senderCfg.y);
  }

  ctx.restore();
}

/**
 * Render thiệp lên Canvas ở độ phân giải Full HD 1920x1080
 */
export async function renderCardOnCanvas(canvas, rawData) {
  if (!canvas || !rawData) return;

  // Tránh race condition khi người dùng gõ chữ nhanh liên tục
  const renderSeq = (canvas._renderSeq || 0) + 1;
  canvas._renderSeq = renderSeq;

  const data = {
    ...rawData,
    teacher_name: normalizeTeacherPrefix(rawData.teacher_name || '')
  };

  const styleId = data.frame_style || 'luxury_cream';
  const customImg = data.custom_frame_image;

  // Đợi font web Lora tải xong để nét chữ mượt và không bị vỡ
  await ensureFontsReady();

  let bgImg = null;
  if (!(customImg && customImg.complete && customImg.naturalWidth > 0) && TEMPLATE_CONFIGS[styleId]) {
    bgImg = await loadFrameImage(styleId);
  }

  // Nếu có lệnh render mới hơn đã bắt đầu trong lúc chờ ảnh/font, hủy lệnh cũ
  if (canvas._renderSeq !== renderSeq) return;

  const ctx = canvas.getContext('2d');
  if (canvas.width !== CARD_WIDTH || canvas.height !== CARD_HEIGHT) {
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Nếu người dùng tải lên frame ảnh riêng (Custom Upload)
  if (customImg && customImg.complete && customImg.naturalWidth > 0) {
    ctx.drawImage(customImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    drawOverlayContent(ctx, data, false);
    return;
  }

  // 2. Render 1 trong 6 mẫu thiệp chuẩn 1920x1080
  const cfg = TEMPLATE_CONFIGS[styleId];
  if (cfg) {
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      ctx.fillStyle = cfg.fallbackBg;
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }
    drawTemplateContent(ctx, bgImg, data, cfg);
    return;
  }

  // Fallback mặc định
  drawPostcardBase(ctx, styleId);
  drawOverlayContent(ctx, data, false);
}

function drawPostcardBase(ctx, styleId) {
  const w = CARD_WIDTH;
  const h = CARD_HEIGHT;

  if (styleId === 'slate_chalk') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#15241C');
    grad.addColorStop(1, '#1D3428');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 22;
    ctx.strokeStyle = '#3E2718';
    ctx.strokeRect(11, 11, w - 22, h - 22);

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.strokeRect(48, 48, w - 96, h - 96);
    return;
  }

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(1, '#1E293B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = 15;
  ctx.strokeStyle = '#D4AF37';
  ctx.strokeRect(36, 36, w - 72, h - 72);

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.strokeRect(56, 56, w - 112, h - 112);

  drawStamp(ctx, w - 300, 84, true);
}

function drawStamp(ctx, x, y, isDark) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = isDark ? '#1E293B' : '#FEF2F2';
  ctx.strokeStyle = isDark ? '#D4AF37' : '#DC2626';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 8]);
  ctx.fillRect(0, 0, 206, 244);
  ctx.strokeRect(0, 0, 206, 244);
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#F59E0B' : '#DC2626';
  ctx.font = `700 22px ${CARD_CONTENT_FONT_FAMILY}`;
  ctx.fillText('VIỆT NAM', 103, 48);

  ctx.font = '700 52px "Playfair Display", Georgia, serif';
  ctx.fillText('20-11', 103, 116);

  ctx.font = `700 20px ${CARD_CONTENT_FONT_FAMILY}`;
  ctx.fillText('TRI ÂN THẦY CÔ', 103, 165);

  ctx.font = `italic 18px ${CARD_CONTENT_FONT_FAMILY}`;
  ctx.fillStyle = isDark ? '#94A3B8' : '#78716C';
  ctx.fillText('BTEC FPT', 103, 202);

  ctx.restore();
}

function drawOverlayContent(ctx, data, isChalk) {
  const isDarkNavy = data.frame_style === 'collegiate_navy';
  const startX = 140;
  const textColor = isChalk ? '#F3F4F6' : isDarkNavy ? '#F8FAFC' : '#1C1917';

  ctx.textAlign = 'left';
  ctx.fillStyle = textColor;
  ctx.font = buildContentFont(44);
  const labelPrefix = 'Người nhận: ';
  ctx.fillText(labelPrefix, startX, 250);

  const prefixW = ctx.measureText(labelPrefix).width;
  ctx.fillText(data.teacher_name || 'quý thầy cô kính mến', startX + prefixW, 250);

  const defaultMsg = 'Nhân ngày Nhà giáo Việt Nam 20/11, em xin gửi trọn tấm lòng tri ân sâu sắc nhất tới Thầy/Cô. Kính chúc Thầy/Cô luôn dồi dào sức khỏe, tràn đầy niềm vui và giữ mãi ngọn lửa nhiệt huyết!';
  const text = data.message || defaultMsg;
  const maxW = CARD_WIDTH - startX - 160;
  const lines = wrapText(ctx, text, maxW);

  const startY = 380;
  const lineHeight = 68;

  lines.slice(0, 6).forEach((line, index) => {
    ctx.fillText(line, startX, startY + index * lineHeight);
  });

  const footerY = 920;
  const rightX = CARD_WIDTH - 140;
  const senderName = data.is_anonymous ? 'Một sinh viên BTEC FPT' : (data.sender_name || 'Học trò BTEC FPT');

  ctx.textAlign = 'right';
  ctx.fillText(`Người gửi: ${senderName}`, rightX, footerY);
}

export function downloadCardImage(canvas, fileName = 'thiep-tri-an-20-11.png') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

/**
/**
 * Bộ tạo thiệp 20/11 nguyên bản (Original Studio Design)
 * Tích hợp Mẫu 1 (Cô Giáo & Hoa Cúc) chuẩn từ ảnh mẫu người dùng cung cấp
 */

export const CARD_WIDTH = 1024;
export const CARD_HEIGHT = 576; // Chuẩn tỷ lệ 16:9 của cả 3 mẫu thiệp mới

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

// Cấu hình font chữ và cỡ chữ thống nhất cho nhãn và lời chúc trên cả các mẫu thiệp
export const CARD_LABEL_FONT = 'italic 22px "Times New Roman", Georgia, serif';
export const CARD_LABEL_COLOR = '#2A2522';
export const CARD_WISH_FONT = 'italic 22px "Times New Roman", Georgia, serif';

// Caching ảnh khung thiệp
let cachedFrame1Img = null;
let cachedFrame2Img = null;
let cachedFrame3Img = null;
let cachedFrame4Img = null;
let cachedFrame5Img = null;
let cachedFrame6Img = null;

function loadFrame1Image() {
  if (cachedFrame1Img && cachedFrame1Img.complete && cachedFrame1Img.naturalWidth > 0) {
    return Promise.resolve(cachedFrame1Img);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedFrame1Img = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/frames/frame_mau_1.jpg?v=5';
  });
}

function loadFrame2Image() {
  if (cachedFrame2Img && cachedFrame2Img.complete && cachedFrame2Img.naturalWidth > 0) {
    return Promise.resolve(cachedFrame2Img);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedFrame2Img = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/frames/frame_mau_2.jpg?v=5';
  });
}

function loadFrame3Image() {
  if (cachedFrame3Img && cachedFrame3Img.complete && cachedFrame3Img.naturalWidth > 0) {
    return Promise.resolve(cachedFrame3Img);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedFrame3Img = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/frames/frame_mau_3.jpg?v=5';
  });
}

function loadFrame4Image() {
  if (cachedFrame4Img && cachedFrame4Img.complete && cachedFrame4Img.naturalWidth > 0) {
    return Promise.resolve(cachedFrame4Img);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedFrame4Img = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/frames/frame_mau_4.jpg?v=5';
  });
}

function loadFrame5Image() {
  if (cachedFrame5Img && cachedFrame5Img.complete && cachedFrame5Img.naturalWidth > 0) {
    return Promise.resolve(cachedFrame5Img);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedFrame5Img = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/frames/frame_mau_5.jpg?v=5';
  });
}

function loadFrame6Image() {
  if (cachedFrame6Img && cachedFrame6Img.complete && cachedFrame6Img.naturalWidth > 0) {
    return Promise.resolve(cachedFrame6Img);
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedFrame6Img = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/frames/frame_mau_6.jpg?v=5';
  });
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

function drawCardDottedLine(ctx, x1, y, x2, color = '#788896') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
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
 * Render thiệp lên Canvas
 */
export async function renderCardOnCanvas(canvas, rawData) {
  if (!canvas || !rawData) return;
  const data = {
    ...rawData,
    teacher_name: normalizeTeacherPrefix(rawData.teacher_name || '')
  };
  const ctx = canvas.getContext('2d');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const styleId = data.frame_style || 'luxury_cream';
  const customImg = data.custom_frame_image;

  // 1. Nếu người dùng tải lên frame ảnh riêng (Custom Upload)
  if (customImg && customImg.complete && customImg.naturalWidth > 0) {
    ctx.drawImage(customImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    drawOverlayContent(ctx, data, false);
    return;
  }

  // 2. MẪU 1: Khung Thiệp Cô Giáo & Hoa Cúc (Từ ảnh người dùng cung cấp)
  if (styleId === 'luxury_cream') {
    const bgImg = await loadFrame1Image();
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      // Fallback nếu ảnh đang tải
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }
    // Điền chữ khớp hoàn hảo vào các dòng kẻ có sẵn
    drawTemplate1Content(ctx, data);
    return;
  }

  // 3. MẪU 2: Khung Vòm Xanh Tri Ân (Từ ảnh người dùng cung cấp)
  if (styleId === 'collegiate_navy') {
    const bgImg = await loadFrame2Image();
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      // Fallback nếu ảnh đang tải
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }
    // Điền chữ khớp vào các dòng chấm và tự động căn chỉnh lề người gửi
    drawTemplate2Content(ctx, data);
    return;
  }

  // 4. MẪU 3: Khung Lá Thu Tri Ân (Từ ảnh người dùng cung cấp)
  if (styleId === 'slate_chalk') {
    const bgImg = await loadFrame3Image();
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      // Fallback nếu ảnh đang tải
      ctx.fillStyle = '#F5EEDD';
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }
    // Điền chữ khớp vào các dòng kẻ và tự động căn chỉnh lề người gửi
    drawTemplate3Content(ctx, data);
    return;
  }

  // 5. MẪU 4: Bưu thiếp Quốc tế (UK & Australia)
  if (styleId === 'international_uk_au') {
    const bgImg = await loadFrame4Image();
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }
    drawTemplate4Content(ctx, data);
    return;
  }

  // 6. MẪU 5: Phong thư Hàng không Quốc tế (BTEC & Melbourne)
  if (styleId === 'airmail_global') {
    const bgImg = await loadFrame5Image();
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }
    drawTemplate5Content(ctx, data);
    return;
  }

  // 7. MẪU 6: Lưu bút Hội nhập (UK & Melbourne Polytechnic)
  if (styleId === 'vintage_journey') {
    const bgImg = await loadFrame6Image();
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    } else {
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
    }
    drawTemplate6Content(ctx, data);
    return;
  }

  // Fallback mặc định
  drawPostcardBase(ctx, styleId);
  drawOverlayContent(ctx, data, false);
}

/**
 * Vẽ chữ khớp chính xác vào các dòng kẻ của MẪU 1 (Cô giáo áo vàng & Banner xanh)
 * Nhãn Gửi đến:, Lời chúc:, Người gửi: đã có sẵn trên ảnh với font đồng nhất.
 * Cỡ chữ nội dung lời chúc đồng nhất (>= 22px) theo yêu cầu.
 */
function drawTemplate1Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  let teacherFontSize = 22;
  ctx.textAlign = 'left';
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#164329'; // Màu xanh đậm tiệp màu banner tiêu đề
  const teacher = data.teacher_name ? data.teacher_name.trim() : 'thầy/cô kính mến';
  while (ctx.measureText(teacher).width > 440 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 175, 200);

  // 2. Nội dung lời chúc (Đồng nhất cỡ chữ 22px, dàn đều trên các dòng chấm có sẵn)
  ctx.fillStyle = '#231C12';
  let wishFontSize = 22;
  ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  // Dàn trên 5 dòng chấm có sẵn trên ảnh
  const dottedY = [288, 325, 364, 401, 440];
  const maxW = 585;

  let lines = wrapText(ctx, rawText, maxW);
  while (lines.length > dottedY.length && wishFontSize > 15) {
    wishFontSize--;
    ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;
    lines = wrapText(ctx, rawText, maxW);
  }

  for (let i = 0; i < Math.min(lines.length, dottedY.length); i++) {
    ctx.fillText(lines[i], 60, dottedY[i]);
  }

  // 3. Người gửi (Nằm trên dòng chấm sau chữ "Người gửi:")
  let senderFontSize = 22;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#164329';
  const sender = data.is_anonymous 
    ? 'Một sinh viên BTEC FPT' 
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');
  while (ctx.measureText(sender).width > 360 && senderFontSize > 13) {
    senderFontSize--;
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(sender, 196, 504);

  ctx.restore();
}

/**
 * Vẽ chữ khớp chính xác vào các dòng chấm của MẪU 2 (Bìa Xanh Sách & Hoa Cúc)
 * Màu chữ kem sáng nổi bật trang nhã trên nền xanh lá đậm.
 */
function drawTemplate2Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  let teacherFontSize = 22;
  ctx.textAlign = 'left';
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#FFFDF0'; // Màu kem ngà sáng nổi bật trên nền xanh đậm
  const teacher = data.teacher_name && data.teacher_name.trim() ? data.teacher_name.trim() : 'thầy/cô kính mến';
  while (ctx.measureText(teacher).width > 410 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 180, 246);

  // 2. Nội dung lời chúc (Màu kem sáng, dàn trên các dòng chấm)
  ctx.fillStyle = '#FEF7DE';
  let wishFontSize = 22;
  ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  const dottedY = [337, 377, 415];
  const maxW = 580;

  let lines = wrapText(ctx, rawText, maxW);
  if (lines.length > 3) {
    while (lines.length > 4 && wishFontSize > 15) {
      wishFontSize--;
      ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;
      lines = wrapText(ctx, rawText, maxW);
    }
  }

  for (let i = 0; i < Math.min(lines.length, 4); i++) {
    const y = i < 3 ? dottedY[i] : 453;
    if (i === 3) {
      // Vẽ thêm dòng chấm phụ thứ 4 nếu nội dung dài
      ctx.save();
      ctx.strokeStyle = '#DCD3BE';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([1.5, 4.5]);
      ctx.beginPath();
      ctx.moveTo(60, 456);
      ctx.lineTo(60 + maxW, 456);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillText(lines[i], 60, y);
  }

  // 3. Người gửi (Nằm trên dòng chấm sau chữ "Người gửi:")
  let senderFontSize = 22;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#FFFDF0';
  const sender = data.is_anonymous
    ? 'Một sinh viên BTEC FPT'
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');
  while (ctx.measureText(sender).width > 390 && senderFontSize > 13) {
    senderFontSize--;
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(sender, 204, 492);

  ctx.restore();
}

/**
 * Vẽ chữ khớp chính xác vào các dòng kẻ chấm của MẪU 3 (Vòm Kem Cô Giáo Áo Vàng)
 * Đường kẻ solid '_' đã được chuyển hoàn toàn thành dòng chấm '....' đồng nhất.
 */
function drawTemplate3Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  let teacherFontSize = 22;
  ctx.textAlign = 'left';
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#164329';
  const teacher = data.teacher_name && data.teacher_name.trim() ? data.teacher_name.trim() : 'thầy/cô kính mến';
  while (ctx.measureText(teacher).width > 440 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 178, 242);

  // 2. Nội dung lời chúc (Cỡ chữ 22px, dàn đều trên 4 dòng chấm)
  ctx.fillStyle = '#231C12';
  let wishFontSize = 22;
  ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  const dottedY = [329, 367, 405, 443];
  const maxW = 566;

  let lines = wrapText(ctx, rawText, maxW);
  while (lines.length > dottedY.length && wishFontSize > 15) {
    wishFontSize--;
    ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;
    lines = wrapText(ctx, rawText, maxW);
  }

  for (let i = 0; i < Math.min(lines.length, dottedY.length); i++) {
    ctx.fillText(lines[i], 60, dottedY[i]);
  }

  // 3. Người gửi (Nằm trên dòng chấm sau chữ "Người gửi:")
  let senderFontSize = 22;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#164329';
  const sender = data.is_anonymous
    ? 'Một sinh viên BTEC FPT'
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');
  while (ctx.measureText(sender).width > 245 && senderFontSize > 13) {
    senderFontSize--;
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(sender, 196, 489);

  ctx.restore();
}

/**
 * Vẽ chữ khớp chính xác vào các dòng kẻ chấm của MẪU 4 (Bưu thiếp Quốc tế - UK & Australia)
 * Tự động dịch sang trái nếu tên người gửi dài để không đè và không tràn viền.
 */
function drawTemplate4Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  let teacherFontSize = 22;
  ctx.textAlign = 'left';
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#0F2942'; // Xanh navy đậm phong cách bưu chính quốc tế
  const teacher = data.teacher_name ? data.teacher_name.trim() : 'thầy/cô kính mến';
  while (ctx.measureText(teacher).width > 400 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 140, 117);

  // 2. Nội dung lời chúc (Cỡ chữ 22px, dàn đều trên 4 dòng chấm)
  ctx.fillStyle = '#1E293B';
  let wishFontSize = 22;
  ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  const dottedY = [201, 239, 277, 315];
  const maxW = 595;

  let lines = wrapText(ctx, rawText, maxW);
  while (lines.length > dottedY.length && wishFontSize > 15) {
    wishFontSize--;
    ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;
    lines = wrapText(ctx, rawText, maxW);
  }

  for (let i = 0; i < Math.min(lines.length, dottedY.length); i++) {
    ctx.fillText(lines[i], 35, dottedY[i]);
  }

  // 3. Người gửi: Tự động dịch chuyển sang trái nếu tên dài để không bị đè và không tràn viền
  let senderFontSize = 22;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#0F2942';
  const sender = data.is_anonymous 
    ? 'Một sinh viên BTEC FPT' 
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');

  const senderW = ctx.measureText(sender).width;
  const rightBound = 990;

  if (senderW <= 185) {
    // Tên ngắn vừa vặn với dòng chấm có sẵn bên phải
    ctx.fillText(sender, 804, 387);
  } else {
    // Tên dài: dịch cả cụm "Người gửi:" sang trái để có đủ khoảng trống, không tràn viền
    ctx.font = CARD_LABEL_FONT;
    const labelW = ctx.measureText('Người gửi:').width;
    const totalW = labelW + 12 + senderW;
    let labelX = rightBound - totalW;
    if (labelX < 380) {
      labelX = 380;
      // Thu nhỏ cỡ chữ người gửi nếu tên cực dài
      while (ctx.measureText(sender).width > (rightBound - (labelX + labelW + 12)) && senderFontSize > 13) {
        senderFontSize--;
        ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
      }
    }
    const nameX = labelX + labelW + 12;

    // Phủ nền kem che phần Người gửi cũ đã in sẵn
    ctx.fillStyle = '#FDF3E9';
    ctx.fillRect(labelX - 8, 366, 1000 - (labelX - 8), 38);

    // Vẽ lại nhãn Người gửi: tại vị trí đã dịch
    ctx.fillStyle = '#0F2942';
    ctx.font = CARD_LABEL_FONT;
    ctx.fillText('Người gửi:', labelX, 387);

    // Vẽ dòng chấm nối tiếp tới mép phải
    drawCardDottedLine(ctx, nameX - 2, 390, rightBound, '#788896');

    // Vẽ tên người gửi
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
    ctx.fillStyle = '#0F2942';
    ctx.fillText(sender, nameX, 387);
  }

  ctx.restore();
}

/**
 * Vẽ chữ khớp chính xác vào các dòng kẻ chấm của MẪU 5 (Phong thư Hàng không Quốc tế)
 * Tự động dịch sang trái nếu tên người gửi dài để không đè và không tràn viền.
 */
function drawTemplate5Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  let teacherFontSize = 22;
  ctx.textAlign = 'left';
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#0F2942';
  const teacher = data.teacher_name ? data.teacher_name.trim() : 'thầy/cô kính mến';
  while (ctx.measureText(teacher).width > 260 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 240, 212);

  // 2. Nội dung lời chúc (Dàn dòng thông minh: dòng 1 sau chữ "Lời chúc:", các dòng sau từ lề lùi)
  ctx.fillStyle = '#1E293B';
  let wishFontSize = 22;
  ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  const wishConfigs = [
    { startX: 235, maxW: 635, y: 261 }, // Dòng 1 (sau chữ Lời chúc:)
    { startX: 139, maxW: 730, y: 303 }, // Dòng 2
    { startX: 139, maxW: 730, y: 345 }, // Dòng 3
    { startX: 139, maxW: 730, y: 390 }, // Dòng 4
    { startX: 139, maxW: 730, y: 433 }  // Dòng 5
  ];

  const words = rawText.split(/\s+/);
  const lines = [];
  let currentLine = '';
  let lineIdx = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const maxW = wishConfigs[lineIdx] ? wishConfigs[lineIdx].maxW : 730;
    const w = ctx.measureText(testLine).width;

    if (w <= maxW) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      lineIdx++;
      if (lineIdx >= wishConfigs.length) break;
    }
  }
  if (currentLine && lines.length < wishConfigs.length) {
    lines.push(currentLine);
  }

  lines.forEach((line, idx) => {
    const cfg = wishConfigs[idx];
    if (cfg) {
      ctx.fillText(line, cfg.startX, cfg.y);
    }
  });

  // 3. Người gửi: Tự động dịch chuyển sang trái nếu tên dài để không bị đè và không tràn viền
  let senderFontSize = 22;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#0F2942';
  const sender = data.is_anonymous 
    ? 'Một sinh viên BTEC FPT' 
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');

  const senderW = ctx.measureText(sender).width;
  const rightBound = 810;

  if (senderW <= 140) {
    // Tên ngắn vừa vặn với dòng chấm có sẵn bên phải
    ctx.fillText(sender, 668, 497);
  } else {
    // Tên dài: dịch cả cụm "Người gửi:" sang trái để có đủ khoảng trống, không tràn viền
    ctx.font = CARD_LABEL_FONT;
    const labelW = ctx.measureText('Người gửi:').width;
    const totalW = labelW + 12 + senderW;
    let labelX = rightBound - totalW;
    if (labelX < 180) {
      labelX = 180;
      while (ctx.measureText(sender).width > (rightBound - (labelX + labelW + 12)) && senderFontSize > 13) {
        senderFontSize--;
        ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
      }
    }
    const nameX = labelX + labelW + 12;

    // Phủ nền kem che phần Người gửi cũ đã in sẵn
    ctx.fillStyle = '#FEF5E3';
    ctx.fillRect(labelX - 8, 476, 818 - (labelX - 8), 38);

    // Vẽ lại nhãn Người gửi: tại vị trí đã dịch
    ctx.fillStyle = '#0F2942';
    ctx.font = CARD_LABEL_FONT;
    ctx.fillText('Người gửi:', labelX, 497);

    // Vẽ dòng chấm nối tiếp tới mép phải
    drawCardDottedLine(ctx, nameX - 2, 500, rightBound, '#788896');

    // Vẽ tên người gửi
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
    ctx.fillStyle = '#0F2942';
    ctx.fillText(sender, nameX, 497);
  }

  ctx.restore();
}

/**
 * Vẽ chữ khớp chính xác vào các dòng kẻ chấm của MẪU 6 (Lưu bút Hội nhập - UK & Melbourne)
 */
function drawTemplate6Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  let teacherFontSize = 22;
  ctx.textAlign = 'left';
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#0F2942';
  const teacher = data.teacher_name ? data.teacher_name.trim() : 'thầy/cô kính mến';
  while (ctx.measureText(teacher).width > 460 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 170, 165);

  // 2. Nội dung lời chúc (Cỡ chữ 22px, dàn đều trên 5 dòng chấm)
  ctx.fillStyle = '#1E293B';
  let wishFontSize = 22;
  ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  const dottedY = [261, 303, 345, 389, 433];
  const maxW = 595;

  let lines = wrapText(ctx, rawText, maxW);
  while (lines.length > dottedY.length && wishFontSize > 15) {
    wishFontSize--;
    ctx.font = `italic ${wishFontSize}px "Times New Roman", Georgia, serif`;
    lines = wrapText(ctx, rawText, maxW);
  }

  for (let i = 0; i < Math.min(lines.length, dottedY.length); i++) {
    ctx.fillText(lines[i], 35, dottedY[i]);
  }

  // 3. Người gửi (Nằm trên dòng chấm sau chữ "Người gửi:")
  let senderFontSize = 22;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#0F2942';
  const sender = data.is_anonymous 
    ? 'Một sinh viên BTEC FPT' 
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');
  while (ctx.measureText(sender).width > 280 && senderFontSize > 13) {
    senderFontSize--;
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(sender, 194, 538);

  ctx.restore();
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

    ctx.lineWidth = 12;
    ctx.strokeStyle = '#3E2718';
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.strokeRect(26, 26, w - 52, h - 52);
    return;
  }

  // Mẫu 2: Collegiate Navy
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(1, '#1E293B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = 8;
  ctx.strokeStyle = '#D4AF37';
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.strokeRect(30, 30, w - 60, h - 60);

  drawStamp(ctx, w - 160, 45, true);
}

function drawStamp(ctx, x, y, isDark) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = isDark ? '#1E293B' : '#FEF2F2';
  ctx.strokeStyle = isDark ? '#D4AF37' : '#DC2626';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.fillRect(0, 0, 110, 130);
  ctx.strokeRect(0, 0, 110, 130);
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#F59E0B' : '#DC2626';
  ctx.font = 'bold 12px "Times New Roman", serif';
  ctx.fillText('VIỆT NAM', 55, 25);

  ctx.font = 'bold 28px "Playfair Display", Georgia, serif';
  ctx.fillText('20-11', 55, 62);

  ctx.font = 'bold 11px "Times New Roman", serif';
  ctx.fillText('TRI ÂN THẦY CÔ', 55, 88);

  ctx.font = 'italic 10px "Times New Roman", serif';
  ctx.fillStyle = isDark ? '#94A3B8' : '#78716C';
  ctx.fillText('BTEC FPT', 55, 108);

  ctx.restore();
}

function drawOverlayContent(ctx, data, isChalk) {
  const isDarkNavy = data.frame_style === 'collegiate_navy';
  const startX = 75;

  ctx.textAlign = 'left';
  ctx.font = 'normal 22px "Times New Roman", Georgia, serif';
  ctx.fillStyle = isChalk ? '#9CA3AF' : isDarkNavy ? '#94A3B8' : '#78350F';
  ctx.fillText('Kính gửi Thầy/Cô: ', startX, 135);

  const prefixW = ctx.measureText('Kính gửi Thầy/Cô: ').width;
  ctx.font = 'bold 28px "Times New Roman", Georgia, serif';
  ctx.fillStyle = isChalk ? '#FDE68A' : isDarkNavy ? '#FCD34D' : '#991B1B';
  ctx.fillText(data.teacher_name || 'quý thầy cô kính mến', startX + prefixW, 135);

  ctx.fillStyle = isChalk ? '#F3F4F6' : isDarkNavy ? '#F8FAFC' : '#1C1917';
  ctx.font = 'italic 21px "Times New Roman", Georgia, serif';

  const defaultMsg = 'Nhân ngày Nhà giáo Việt Nam 20/11, em xin gửi trọn tấm lòng tri ân sâu sắc nhất tới Thầy/Cô. Kính chúc Thầy/Cô luôn dồi dào sức khỏe, tràn đầy niềm vui và giữ mãi ngọn lửa nhiệt huyết!';
  const text = data.message || defaultMsg;
  const maxW = CARD_WIDTH - startX - 90;
  const lines = wrapText(ctx, `"${text}"`, maxW);

  const startY = 205;
  const lineHeight = 38;

  lines.slice(0, 5).forEach((line, index) => {
    ctx.fillText(line, startX, startY + index * lineHeight);
  });

  const footerY = 490;
  const rightX = CARD_WIDTH - 75;

  ctx.textAlign = 'right';
  ctx.font = 'normal 18px "Times New Roman", Georgia, serif';
  ctx.fillStyle = isChalk ? '#9CA3AF' : isDarkNavy ? '#94A3B8' : '#78716C';
  ctx.fillText('Người gửi:', rightX - 200, footerY);

  ctx.font = 'bold 21px "Times New Roman", Georgia, serif';
  ctx.fillStyle = isChalk ? '#FDE68A' : isDarkNavy ? '#FBBF24' : '#991B1B';
  const senderName = data.is_anonymous ? 'Một sinh viên BTEC FPT' : (data.sender_name || 'Học trò BTEC FPT');
  ctx.fillText(senderName, rightX, footerY);
}

export function downloadCardImage(canvas, fileName = 'thiep-tri-an-20-11.png') {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

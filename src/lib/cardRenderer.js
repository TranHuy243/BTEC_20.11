/**
/**
 * Bộ tạo thiệp 20/11 nguyên bản (Original Studio Design)
 * Tích hợp Mẫu 1 (Cô Giáo & Hoa Cúc) chuẩn từ ảnh mẫu người dùng cung cấp
 */

export const CARD_WIDTH = 1024;
export const CARD_HEIGHT = 571; // Tỷ lệ chuẩn theo ảnh Mẫu 1

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
    desc: 'Thiệp cô giáo áo vàng và hoa cúc mùa thu ấm áp'
  },
  {
    id: 'collegiate_navy',
    name: 'Mẫu 2',
    desc: 'Thiệp vòm xanh trang nhã, hoa cúc ấm áp ngày 20/11'
  },
  {
    id: 'slate_chalk',
    name: 'Mẫu 3',
    desc: 'Khung viền rêu nhã nhặn, họa tiết lá thu tinh tế ngày 20/11'
  }
];

// Caching ảnh khung thiệp
let cachedFrame1Img = null;
let cachedFrame2Img = null;
let cachedFrame3Img = null;

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
    img.src = '/frames/frame_mau_1.jpg?v=2';
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
    img.src = '/frames/frame_mau_2.jpg?v=3';
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
    img.src = '/frames/frame_mau_3.jpg?v=2';
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

/**
 * Render thiệp lên Canvas
 */
export async function renderCardOnCanvas(canvas, data) {
  if (!canvas) return;
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

  // Fallback mặc định
  drawPostcardBase(ctx, styleId);
  drawOverlayContent(ctx, data, false);
}

/**
 * Vẽ chữ khớp chính xác vào các dòng kẻ của MẪU 1 (Cô giáo & Hoa cúc)
 * Tất cả các dòng kẻ đều thống nhất thành dòng chấm bi (........)
 * Cỡ chữ nội dung, tên thầy cô và người gửi đồng nhất 20px.
 */
function drawTemplate1Content(ctx, data) {
  ctx.save();

  // Đảm bảo các dòng đều là chấm bi (........) đồng nhất
  const drawDots = (y, startX, endX) => {
    ctx.save();
    ctx.fillStyle = '#FCF5EB'; // Phủ nền kem che đường thẳng cũ nếu có
    ctx.fillRect(startX - 2, y - 2, (endX - startX) + 4, 4);
    ctx.strokeStyle = '#231C12';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([1.5, 4.5]);
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
    ctx.restore();
  };

  // Thống nhất các dòng 1, 2, 7 thành dòng chấm bi
  drawDots(223, 226, 650);
  drawDots(260, 230, 650);
  drawDots(445, 246, 650);

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  ctx.textAlign = 'left';
  ctx.font = 'bold 20px "Times New Roman", Georgia, serif';
  ctx.fillStyle = '#1A4329'; // Màu xanh đậm tiệp với màu tiêu đề "Nhà Giáo Việt Nam"
  const teacher = data.teacher_name ? data.teacher_name.trim() : 'Thầy/Cô kính mến';
  ctx.fillText(teacher, 232, 218);

  // 2. Nội dung lời chúc (Đồng nhất cỡ chữ 20px)
  ctx.fillStyle = '#2A2522';
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong sự nghiệp trồng người!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  // Dàn dòng thông minh: dòng 1 max 405px (bắt đầu từ x=238), các dòng sau max 510px (bắt đầu từ x=135)
  const words = rawText.split(/\s+/);
  const lines = [];
  let currentLine = '';
  let lineIdx = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const maxW = lineIdx === 0 ? 405 : 510;
    const w = ctx.measureText(testLine).width;

    if (w <= maxW) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      lineIdx++;
      if (lineIdx >= 5) break; // Tối đa 5 dòng lời chúc
    }
  }
  if (currentLine && lines.length < 5) {
    lines.push(currentLine);
  }

  // Dòng 1 (sau chữ "Lời chúc:")
  if (lines[0]) {
    ctx.fillText(lines[0], 238, 255);
  }

  // Các dòng 2, 3, 4, 5 (trên 4 dòng chấm bi)
  const dottedY = [291, 328, 365, 402];
  for (let i = 1; i < lines.length; i++) {
    if (dottedY[i - 1]) {
      ctx.fillText(lines[i], 135, dottedY[i - 1]);
    }
  }

  // 3. Người gửi (Đồng nhất cỡ chữ 20px)
  let senderFontSize = 20;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#1A4329';
  const sender = data.is_anonymous 
    ? 'Một sinh viên BTEC FPT' 
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');
  while (ctx.measureText(sender).width > 390 && senderFontSize > 13) {
    senderFontSize--;
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(sender, 252, 440);

  ctx.restore();
}

/**
 * Vẽ chữ khớp chính xác vào các dòng chấm của MẪU 2 (Vòm Xanh Tri Ân)
 * Căn chỉnh thông minh vị trí nhãn "Người gửi:" và tên người gửi:
 * - Nếu tên ngắn: "Người gửi:" ở vị trí mặc định, tên nằm sát ngay sau nó.
 * - Nếu tên dài: Cả cụm tự động dịch dần sang bên trái để không tụt khỏi lề phải (890px),
 *   đồng thời tên vẫn luôn sát lề với "Người gửi:", không bao giờ bị đè lên nhau.
 */
function drawTemplate2Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng chấm sau chữ "Gửi đến:")
  ctx.textAlign = 'left';
  let teacherFontSize = 20;
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#1A4329';
  const teacher = data.teacher_name && data.teacher_name.trim() ? data.teacher_name.trim() : 'Thầy/Cô kính mến';
  while (ctx.measureText(teacher).width > 280 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 605, 161);

  // 2. Nội dung lời chúc (Đồng nhất cỡ chữ 20px trên các dòng chấm)
  ctx.fillStyle = '#2A2522';
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  // Dàn dòng khớp các dòng chấm: dòng 1 sau chữ "Lời chúc:", các dòng sau theo độ rộng vòm
  const wishLineConfigs = [
    { startX: 605, maxW: 280, y: 203 }, // Dòng 1 (sau chữ Lời chúc:)
    { startX: 445, maxW: 440, y: 246 }, // Dòng 2
    { startX: 415, maxW: 470, y: 292 }, // Dòng 3
    { startX: 415, maxW: 470, y: 334 }, // Dòng 4
    { startX: 415, maxW: 470, y: 376 }, // Dòng 5
    { startX: 415, maxW: 470, y: 420 }, // Dòng 6
    { startX: 415, maxW: 470, y: 462 }  // Dòng 7
  ];

  const words = rawText.split(/\s+/);
  const lines = [];
  let currentLine = '';
  let lineIdx = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const maxW = wishLineConfigs[lineIdx] ? wishLineConfigs[lineIdx].maxW : 470;
    const w = ctx.measureText(testLine).width;

    if (w <= maxW) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      lineIdx++;
      if (lineIdx >= wishLineConfigs.length) break;
    }
  }
  if (currentLine && lines.length < wishLineConfigs.length) {
    lines.push(currentLine);
  }

  lines.forEach((line, idx) => {
    const cfg = wishLineConfigs[idx];
    if (cfg) {
      ctx.fillText(line, cfg.startX, cfg.y);
    }
  });

  // 3. Người gửi
  // Cơ chế tự động căn lề thông minh theo yêu cầu:
  // "nếu người gửi điền tên nó sẽ tự động sát lề với cụm từ người gửi còn nếu tên quá dài thì sẽ đẩy dần qua phía bên trái để nó không tụt khỏi lề hoặc bị đè lên chữ người gửi"
  const RIGHT_BOUND = 890;
  const DEFAULT_LABEL_X = 648;
  const MIN_LABEL_X = 380;
  const labelText = 'Người gửi:';

  const senderRaw = data.is_anonymous
    ? 'Một sinh viên BTEC FPT'
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');

  // Đo chiều rộng nhãn và tên người gửi
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';
  const labelW = ctx.measureText(labelText).width;
  const gap = 8;

  let senderFontSize = 20;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  let nameW = ctx.measureText(senderRaw).width;

  // Giới hạn an toàn chiều rộng tổng
  const maxAllowedW = RIGHT_BOUND - MIN_LABEL_X;
  while ((labelW + gap + nameW) > maxAllowedW && senderFontSize > 13) {
    senderFontSize--;
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
    nameW = ctx.measureText(senderRaw).width;
  }

  const totalW = labelW + gap + nameW;
  const defaultEndX = DEFAULT_LABEL_X + totalW;

  let labelX;
  if (defaultEndX <= RIGHT_BOUND) {
    // Tên ngắn: "Người gửi:" giữ nguyên tại vị trí mặc định 648, tên nằm sát ngay sau nó
    labelX = DEFAULT_LABEL_X;
  } else {
    // Tên dài: Cả cụm dịch dần sang bên trái để điểm kết thúc chạm đúng lề phải (890px),
    // tên vẫn luôn sát ngay sau nhãn "Người gửi:" nên tuyệt đối không bị đè lên nhau
    labelX = Math.max(MIN_LABEL_X, RIGHT_BOUND - totalW);
  }
  const nameX = labelX + labelW + gap;

  // Phủ màu nền kem che phần dòng "Người gửi: ......" có sẵn trên ảnh mẫu
  ctx.save();
  ctx.fillStyle = '#F6F0E2';
  ctx.fillRect(MIN_LABEL_X - 10, 495, (RIGHT_BOUND - MIN_LABEL_X) + 25, 38);

  // Vẽ hàng chấm bi (........) ở dưới chân người gửi kéo dài từ sau "Người gửi:" đến hết lề phải
  ctx.strokeStyle = '#231C12';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([1.5, 4.5]);
  ctx.beginPath();
  ctx.moveTo(labelX + labelW + 4, 522);
  ctx.lineTo(RIGHT_BOUND, 522);
  ctx.stroke();

  // Vẽ nhãn "Người gửi:"
  ctx.fillStyle = '#2A2522';
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(labelText, labelX, 516);

  // Vẽ tên người gửi (sát ngay sau "Người gửi:")
  ctx.fillStyle = '#1A4329';
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillText(senderRaw, nameX, 516);
  ctx.restore();

  ctx.restore();
}

/**
 * Vẽ chữ khớp chính xác vào các dòng kẻ của MẪU 3 (Lá Thu Tri Ân)
 * Căn chỉnh thông minh vị trí nhãn "Người gửi:" và tên người gửi:
 * - Nếu tên ngắn: "Người gửi:" ở vị trí mặc định 398, tên nằm sát ngay sau nó.
 * - Nếu tên dài: Cả cụm tự động dịch dần sang bên trái để không tụt khỏi lề phải (803px),
 *   đồng thời tên vẫn luôn sát lề với "Người gửi:", không bao giờ bị đè lên nhau.
 */
function drawTemplate3Content(ctx, data) {
  ctx.save();

  // 1. Tên Thầy/Cô (Nằm trên dòng kẻ sau chữ "Gửi đến:")
  ctx.textAlign = 'left';
  let teacherFontSize = 20;
  ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillStyle = '#1A4329';
  const teacher = data.teacher_name && data.teacher_name.trim() ? data.teacher_name.trim() : 'Thầy/Cô kính mến';
  while (ctx.measureText(teacher).width > 470 && teacherFontSize > 13) {
    teacherFontSize--;
    ctx.font = `bold ${teacherFontSize}px "Times New Roman", Georgia, serif`;
  }
  ctx.fillText(teacher, 330, 203);

  // 2. Nội dung lời chúc (Đồng nhất cỡ chữ 20px trên các dòng kẻ)
  ctx.fillStyle = '#2A2522';
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';

  const defaultMsg = 'Nhân ngày 20/11, em xin kính chúc Thầy/Cô luôn dồi dào sức khỏe, ngập tràn niềm vui và luôn giữ trọn nhiệt huyết trong từng giờ lên lớp!';
  const rawText = data.message ? data.message.trim() : defaultMsg;

  // Dàn dòng khớp các dòng kẻ
  const wishLineConfigs = [
    { startX: 330, maxW: 470, y: 255 }, // Dòng 1 (sau chữ Lời chúc:)
    { startX: 218, maxW: 585, y: 313 }, // Dòng 2
    { startX: 218, maxW: 585, y: 362 }, // Dòng 3
    { startX: 218, maxW: 585, y: 410 }  // Dòng 4
  ];

  const words = rawText.split(/\s+/);
  const lines = [];
  let currentLine = '';
  let lineIdx = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const maxW = wishLineConfigs[lineIdx] ? wishLineConfigs[lineIdx].maxW : 585;
    const w = ctx.measureText(testLine).width;

    if (w <= maxW) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      lineIdx++;
      if (lineIdx >= wishLineConfigs.length) break;
    }
  }
  if (currentLine && lines.length < wishLineConfigs.length) {
    lines.push(currentLine);
  }

  lines.forEach((line, idx) => {
    const cfg = wishLineConfigs[idx];
    if (cfg) {
      ctx.fillText(line, cfg.startX, cfg.y);
    }
  });

  // 3. Người gửi
  // Cơ chế tự động căn lề thông minh theo yêu cầu:
  // "nếu người gửi điền tên nó sẽ tự động sát lề với cụm từ người gửi còn nếu tên quá dài thì sẽ đẩy dần qua phía bên trái để nó không tụt khỏi lề hoặc bị đè lên chữ người gửi"
  const RIGHT_BOUND = 803;
  const DEFAULT_LABEL_X = 398;
  const MIN_LABEL_X = 218;
  const labelText = 'Người gửi:';

  const senderRaw = data.is_anonymous
    ? 'Một sinh viên BTEC FPT'
    : (data.sender_name && data.sender_name.trim() ? data.sender_name.trim() : 'Học trò BTEC FPT');

  // Đo chiều rộng nhãn và tên người gửi
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';
  const labelW = ctx.measureText(labelText).width;
  const gap = 8;

  let senderFontSize = 20;
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  let nameW = ctx.measureText(senderRaw).width;

  // Giới hạn an toàn chiều rộng tổng
  const maxAllowedW = RIGHT_BOUND - MIN_LABEL_X;
  while ((labelW + gap + nameW) > maxAllowedW && senderFontSize > 13) {
    senderFontSize--;
    ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
    nameW = ctx.measureText(senderRaw).width;
  }

  const totalW = labelW + gap + nameW;
  const defaultEndX = DEFAULT_LABEL_X + totalW;

  let labelX;
  if (defaultEndX <= RIGHT_BOUND) {
    // Tên ngắn: "Người gửi:" giữ nguyên tại vị trí mặc định 398, tên nằm sát ngay sau nó
    labelX = DEFAULT_LABEL_X;
  } else {
    // Tên dài: Cả cụm dịch dần sang bên trái để điểm kết thúc chạm đúng lề phải (803px),
    // tên vẫn luôn sát ngay sau nhãn "Người gửi:" nên tuyệt đối không bị đè lên nhau
    labelX = Math.max(MIN_LABEL_X, RIGHT_BOUND - totalW);
  }
  const nameX = labelX + labelW + gap;

  // Phủ màu nền che phần dòng "Người gửi: -----" có sẵn trên ảnh mẫu
  ctx.save();
  ctx.fillStyle = '#F4ECDC';
  ctx.fillRect(MIN_LABEL_X - 10, 442, (RIGHT_BOUND - MIN_LABEL_X) + 20, 36);

  // Vẽ hàng chấm bi (........) ở dưới chân người gửi đồng nhất từ sau "Người gửi:" đến hết lề phải
  ctx.strokeStyle = '#231C12';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([1.5, 4.5]);
  ctx.beginPath();
  ctx.moveTo(labelX + labelW + 4, 466);
  ctx.lineTo(RIGHT_BOUND, 466);
  ctx.stroke();

  // Vẽ nhãn "Người gửi:"
  ctx.fillStyle = '#2A2522';
  ctx.font = 'italic 20px "Times New Roman", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(labelText, labelX, 460);

  // Vẽ tên người gửi (sát ngay sau "Người gửi:")
  ctx.fillStyle = '#1A4329';
  ctx.font = `bold ${senderFontSize}px "Times New Roman", Georgia, serif`;
  ctx.fillText(senderRaw, nameX, 460);
  ctx.restore();

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
  ctx.fillText(data.teacher_name || 'Quý Thầy Cô kính mến', startX + prefixW, 135);

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

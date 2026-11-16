/**
 * Bộ lọc từ ngữ vi phạm thuần phong mỹ tục (Song ngữ Việt - Anh)
 * Kiểm duyệt các từ ngữ thô tục, xúc phạm, chửi thề để giữ gìn sự trang trọng,
 * tôn sư trọng đạo cho ngày 20/11.
 */

// Danh sách từ cấm tiếng Việt (viết thường, không dấu và có dấu)
const VIETNAMESE_BAD_WORDS = [
  // Tiếng lóng tục tĩu phổ biến
  'địt', 'dit', 'djt', 'đjt', 'đụ', 'du', 'đậu má', 'dau ma', 'đù má', 'du ma',
  'đm', 'dm', 'đmm', 'dmm', 'đcm', 'dcm', 'đkm', 'dkm', 'đclm', 'dclm',
  'vcl', 'vl', 'clgt', 'vkl', 'vcc', 'vlon', 'vloz', 'vai lon', 'vãi lồn', 'vãi lìn',
  'lồn', 'lon', 'lìn', 'lin', 'cặc', 'cac', 'buồi', 'buoi', 'dái', 'dai',
  'chó đẻ', 'cho de', 'đĩ', 'di', 'đĩ mẹ', 'di me', 'con đĩ', 'cave', 'phò', 'pho',
  'mẹ kiếp', 'me kiep', 'chó chết', 'cho chet', 'mẹ mày', 'me may', 'cha mày', 'cha may',
  'đéo', 'deo', 'đéch', 'dech', 'cút', 'cut', 'óc chó', 'oc cho', 'ngu lol', 'ngu lồn',
  'đồ ngu', 'do ngu', 'thằng chó', 'thang cho', 'bố láo', 'bo lao', 'mất dạy', 'mat day'
];

// Danh sách từ cấm tiếng Anh phổ biến
const ENGLISH_BAD_WORDS = [
  'fuck', 'fucking', 'fucker', 'fck', 'fuk',
  'shit', 'bullshit',
  'bitch', 'bitches',
  'ass', 'asshole', 'arse',
  'dick', 'pussy', 'cock', 'bastard',
  'cunt', 'slut', 'whore',
  'idiot', 'stupid', 'retard', 'moron',
  'wtf', 'stfu', 'motherfucker', 'wanker'
];

// Chuẩn hóa chuỗi tiếng Việt để loại bỏ dấu thanh, ký tự ngụy trang (leetspeak: 0 -> o, @ -> a, v.v.)
function normalizeText(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    // Thay thế ký tự ngụy trang phổ biến
    .replace(/[@a]/g, 'a')
    .replace(/[0o]/g, 'o')
    .replace(/[1li]/g, 'i')
    .replace(/[3e]/g, 'e')
    .replace(/[\*\_\-\.\,\!\?]/g, ' ') // Xóa dấu phân tách như đ*m, d.m, v_l
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Hàm kiểm tra từ ngữ có phù hợp với thuần phong mỹ tục không
 * @param {string} text - Văn bản cần kiểm tra
 * @returns {object} { isValid: boolean, violations: string[] }
 */
export function checkProfanity(text) {
  if (!text || typeof text !== 'string') {
    return { isValid: true, violations: [] };
  }

  const rawLower = text.toLowerCase();
  const normalized = normalizeText(text);
  const foundBadWords = new Set();

  const allBadWords = [...VIETNAMESE_BAD_WORDS, ...ENGLISH_BAD_WORDS];

  for (const word of allBadWords) {
    // Regex tìm từ độc lập hoặc được phân tách bằng khoảng trắng / dấu câu
    // Tránh bắt nhầm các từ bình thường như "chúc", "cô", "bác", "hạnh phúc"
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Kiểm tra trên cả bản thô và bản chuẩn hóa
    const regex = new RegExp(`(^|\\s|[.,!?;:/_()#@&-])(${escapedWord})($|\\s|[.,!?;:/_()#@&-])`, 'i');

    if (regex.test(rawLower) || regex.test(normalized)) {
      foundBadWords.add(word);
    }
  }

  const violations = Array.from(foundBadWords);

  return {
    isValid: violations.length === 0,
    violations: violations,
    message: violations.length > 0 
      ? `Lời chúc chứa từ ngữ chưa chuẩn mực: "${violations.join(', ')}". Vui lòng dùng từ ngữ tôn sư trọng đạo để gửi đến thầy cô nhé!` 
      : ''
  };
}

/**
 * Đếm số từ trong đoạn văn bản
 * @param {string} text 
 * @returns {number}
 */
export function countWords(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

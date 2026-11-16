import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Send, Download, Maximize2, AlertTriangle, 
  Check, Sparkles, User, GraduationCap, 
  Palette, ShieldCheck 
} from 'lucide-react';
import { checkProfanity, countWords } from '../lib/profanityFilter';
import { 
  WISH_TOPICS, 
  FRAME_STYLES, 
  renderCardOnCanvas, 
  downloadCardImage 
} from '../lib/cardRenderer';
import { searchTeachers } from '../data/teachers';
import { addWish } from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function WishForm({ onWishSubmitted, onOpenZoomModal }) {
  const [teacherName, setTeacherName] = useState('');
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  
  const [senderName, setSenderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('luxury_cream');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profanityResult, setProfanityResult] = useState({ isValid: true, violations: [] });

  const previewCanvasRef = useRef(null);
  const teacherDropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target)) {
        setIsTeacherDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Chỉ gợi ý khi người dùng gõ chữ và chỉ hiện các tên trùng khớp
  const suggestedTeachers = useMemo(() => {
    if (!teacherName || !teacherName.trim()) {
      return [];
    }
    // Lọc các tên trùng khớp
    const matches = searchTeachers(teacherName);
    // Nếu tên đã gõ khớp hoàn toàn với một gợi ý duy nhất thì không cần hiện nữa
    if (matches.length === 1 && matches[0].toLowerCase() === teacherName.trim().toLowerCase()) {
      return [];
    }
    return matches;
  }, [teacherName]);

  // Đếm ký tự & ràng buộc tối đa 250 ký tự
  const charCount = message.length;
  const isCharCountExceeded = charCount > 250;

  // Kiểm duyệt thuần phong mỹ tục thời gian thực
  useEffect(() => {
    const combinedText = `${teacherName} ${isAnonymous ? '' : senderName} ${message}`;
    const result = checkProfanity(combinedText);
    setProfanityResult(result);
  }, [teacherName, senderName, isAnonymous, message]);

  // Cập nhật Canvas xem trước
  useEffect(() => {
    if (previewCanvasRef.current) {
      renderCardOnCanvas(previewCanvasRef.current, {
        teacher_name: teacherName || 'Quý Thầy Cô kính mến',
        sender_name: isAnonymous ? 'BTEC-er' : (senderName || 'Học trò BTEC FPT'),
        is_anonymous: isAnonymous,
        message: message,
        frame_style: selectedFrame
      });
    }
  }, [teacherName, senderName, isAnonymous, message, selectedFrame]);

  const applyWishTopic = (topic) => {
    setMessage(topic.text);
  };

  const handleDownload = () => {
    if (previewCanvasRef.current) {
      const name = teacherName.trim() ? teacherName.trim().replace(/\s+/g, '-') : 'thay-co';
      downloadCardImage(previewCanvasRef.current, `thiep-20-11-${name}.png`);
    }
  };

  const canSubmit = 
    teacherName.trim().length > 0 &&
    (isAnonymous || senderName.trim().length > 0) &&
    message.trim().length > 0 &&
    !isCharCountExceeded &&
    profanityResult.isValid &&
    !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const wishData = {
        teacher_name: teacherName,
        sender_name: isAnonymous ? 'BTEC-er' : senderName,
        is_anonymous: isAnonymous,
        message: message,
        frame_style: selectedFrame
      };

      const result = await addWish(wishData);

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onWishSubmitted) {
        onWishSubmitted({
          ...(result?.data || wishData),
          id: result?.data?.id || ('new-wish-' + Date.now()),
          created_at: result?.data?.created_at || new Date().toISOString()
        });
      }

      setMessage('');
      if (!isAnonymous) setSenderName('');
    } catch (err) {
      console.error('Lỗi khi gửi lời chúc:', err);
      alert('Có lỗi xảy ra khi lưu lời chúc. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ===================== CỘT TRÁI: FORM SOẠN THIỆP (5/12) ===================== */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-xl shadow-slate-900/5">
          
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. Gửi đến Thầy/Cô (Gợi ý đơn giản, chỉ hiện khi gõ chữ) */}
            <div ref={teacherDropdownRef} className="relative">
              <label className="block text-xs md:text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-rose-600" />
                <span>Gửi đến Thầy/Cô <span className="text-rose-600">*</span></span>
              </label>

              <input
                type="text"
                value={teacherName}
                onChange={(e) => {
                  setTeacherName(e.target.value);
                  setIsTeacherDropdownOpen(true);
                }}
                onFocus={() => {
                  if (teacherName.trim().length > 0) {
                    setIsTeacherDropdownOpen(true);
                  }
                }}
                placeholder="Nhập tên thầy cô"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                required
              />

              {/* Danh sách tên trùng khớp đơn giản (chỉ hiện khi gõ) */}
              {isTeacherDropdownOpen && suggestedTeachers.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                  {suggestedTeachers.map((teacher, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setTeacherName(teacher);
                        setIsTeacherDropdownOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-700 cursor-pointer transition border-b border-slate-50 last:border-none"
                    >
                      {teacher}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Người gửi: Điền tên & Nút chọn Gửi ẩn danh */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-rose-600" />
                  <span>Người gửi</span>
                  {!isAnonymous ? (
                    <span className="text-rose-600 font-bold">*</span>
                  ) : (
                    <span className="text-slate-400 text-xs font-normal italic">(Ẩn danh)</span>
                  )}
                </label>
                <span className="text-[11px] text-slate-400">Tối đa 60 ký tự</span>
              </div>

              <input
                type="text"
                maxLength={60}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={isAnonymous}
                placeholder={isAnonymous ? 'BTEC-er' : 'Nhập tên người gửi'}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none ${
                  isAnonymous
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed italic'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                }`}
              />

              {/* Nút chọn Gửi ẩn danh dạng Pill (bấm vào chữ đổi màu, không cần dấu tích V) */}
              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = !isAnonymous;
                    setIsAnonymous(next);
                    if (next) setSenderName('');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border select-none ${
                    isAnonymous
                      ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Gửi ẩn danh
                </button>
              </div>
            </div>

            {/* 3. Lời chúc 20/11 & Kiểm duyệt thuần phong mỹ tục */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs md:text-sm font-bold text-slate-800">
                  Lời chúc thầy cô <span className="text-rose-600">*</span>
                </label>
              </div>

              {/* Gợi ý mẫu tri ân 1 hàng ngang */}
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                {WISH_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => applyWishTopic(topic)}
                    className="w-full text-center py-1.5 px-1.5 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/70 transition cursor-pointer truncate"
                  >
                    {topic.badge}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition">
                <textarea
                  rows={4}
                  maxLength={250}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết những lời tri ân chân thành gửi tới Thầy/Cô..."
                  className="w-full p-3.5 bg-slate-50/40 focus:bg-white text-slate-900 placeholder-slate-400 text-sm outline-none resize-none leading-relaxed transition"
                  required
                />

                {/* Footer thông tin kiểm duyệt */}
                <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  {!profanityResult.isValid ? (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Nội dung không hợp lệ</span>
                    </div>
                  ) : isCharCountExceeded ? (
                    <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Vượt quá giới hạn 250</span>
                    </div>
                  ) : message.trim().length > 0 ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Nội dung hợp lệ</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <span className={`text-[11px] font-semibold ${isCharCountExceeded ? 'text-rose-600' : 'text-slate-500'}`}>
                    {charCount}/250
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Chọn phong cách bưu thiếp */}
            <div>
              <div className="mb-2">
                <label className="text-xs md:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-rose-600" />
                  Mẫu bưu thiếp
                </label>
              </div>

              {/* Danh sách 3 mẫu bưu thiếp */}
              <div className="grid grid-cols-3 gap-2">
                {FRAME_STYLES.map((frame) => (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setSelectedFrame(frame.id)}
                    className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                      selectedFrame === frame.id
                        ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-200/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs">{frame.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nút gửi */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  canSubmit
                    ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-rose-900/20 active:scale-[0.99]'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang hoàn tất thiệp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Lời Chúc & Tạo Thiệp 20/11</span>
                  </>
                )}
              </button>

              {!canSubmit && (
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  {!teacherName.trim()
                    ? '• Vui lòng nhập tên Thầy/Cô'
                    : !isAnonymous && !senderName.trim()
                    ? '• Vui lòng nhập tên người gửi hoặc chọn "Gửi ẩn danh"'
                    : !message.trim()
                    ? '• Vui lòng nhập lời chúc'
                    : isCharCountExceeded
                    ? '• Lời chúc vượt quá 250 ký tự'
                    : !profanityResult.isValid
                    ? '• Nội dung không hợp lệ, không thể gửi thiệp'
                    : ''}
                </p>
              )}
            </div>

          </form>
        </div>

        {/* ===================== CỘT PHẢI: BÀN XEM TRƯỚC BƯU THIẾP (7/12) ===================== */}
        <div className="lg:col-span-7 sticky top-24">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl shadow-slate-900/5">
            
            {/* Header thanh công cụ bưu thiếp */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm md:text-base text-slate-800">
                Xem Trước Bưu Thiếp
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  title="Tải thiệp về máy"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Tải thiệp</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenZoomModal && onOpenZoomModal({
                    teacher_name: teacherName || 'Quý Thầy Cô kính mến',
                    sender_name: isAnonymous ? 'BTEC-er' : (senderName || 'Học trò BTEC FPT'),
                    is_anonymous: isAnonymous,
                    message: message,
                    frame_style: selectedFrame
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  title="Phóng to xem chi tiết"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Phóng to</span>
                </button>
              </div>
            </div>

            {/* Khung trưng bày bưu thiếp (Postcard Presentation Canvas) */}
            <div className="w-full rounded-2xl overflow-hidden postcard-shadow bg-[#fcfaf7] p-2 border border-amber-900/10 flex items-center justify-center">
              <canvas
                ref={previewCanvasRef}
                className="w-full h-auto rounded-xl object-contain shadow-xs"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

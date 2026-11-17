import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Send, ArrowDown, ArrowUpRight, AlertTriangle,
  PenTool
} from 'lucide-react';
import { checkProfanity } from '../lib/profanityFilter';
import {
  WISH_TOPICS,
  renderCardOnCanvas,
  downloadCardImage
} from '../lib/cardRenderer';
import { searchTeachers } from '../data/teachers';
import { addWish } from '../lib/supabase';
import confetti from 'canvas-confetti';

// 3 mẫu bưu thiếp nguyên bản
const TEMPLATE_CARDS = [
  {
    id: 'luxury_cream',
    name: 'Mẫu 1',
    image: '/frames/frame_mau_1.jpg'
  },
  {
    id: 'collegiate_navy',
    name: 'Mẫu 2',
    image: '/frames/frame_mau_2.jpg'
  },
  {
    id: 'slate_chalk',
    name: 'Mẫu 3',
    image: '/frames/frame_mau_3.jpg'
  }
];

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
    const matches = searchTeachers(teacherName);
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
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-12">
      <form onSubmit={handleSubmit} className="space-y-12">

        {/* ========================================================================= */}
        {/* PHẦN 1: BẮT ĐẦU VÔ CHỌN THIỆP (GIỮ NGUYÊN 3 LOẠI THIỆP)                   */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-orange-600 tracking-wider uppercase mb-1">
                01 — CÂU CHUYỆN BẮT ĐẦU
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Chọn tấm thiệp bạn thích
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium self-start sm:self-auto">
              Chọn một mẫu để tiếp tục ↓
            </p>
          </div>

          {/* 3 Mẫu thiệp hiển thị hàng ngang trực quan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            {TEMPLATE_CARDS.map((frame) => {
              const isSelected = selectedFrame === frame.id;
              return (
                <div
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`group relative rounded-3xl overflow-hidden bg-white border-2 transition-all duration-200 cursor-pointer ${isSelected
                      ? 'border-orange-500 shadow-xl ring-4 ring-orange-100 scale-[1.01]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                >
                  {/* Ảnh thu nhỏ của mẫu thiệp */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#FAF7F2]">
                    <img
                      src={frame.image}
                      alt={frame.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Dấu tích cam khi được chọn */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md font-bold text-xs">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Thanh thông tin dưới chân tấm thiệp */}
                  <div className="py-3 px-4 flex items-center justify-center text-sm bg-white border-t border-slate-100">
                    <span className={`font-bold transition-colors ${isSelected ? 'text-orange-600 font-extrabold' : 'text-slate-800'}`}>
                      {frame.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* ========================================================================= */}
        {/* PHẦN 2: VIẾT TỪ TRÁI TIM                                                  */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-orange-600 tracking-wider uppercase mb-1">
                02 — VIẾT TỪ TRÁI TIM
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Gửi trọn tâm tình đến Thầy Cô
              </h2>

            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">

            {/* Header phần ghi thiệp */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>💌</span>
                  <span>Gửi đến thầy cô</span>
                </h3>
              </div>
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                <PenTool className="w-4 h-4" />
              </div>
            </div>

            {/* Hàng 1: Hai cột Tên thầy/cô & Tên người gửi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Cột 1: Tên thầy/cô nhận thiệp */}
              <div ref={teacherDropdownRef} className="relative">
                <label className="block text-xs md:text-sm font-bold text-slate-800 mb-2">
                  Tên thầy/cô nhận thiệp <span className="text-rose-500">*</span>
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
                  placeholder="Ví dụ: Cô Nguyễn Thị..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  required
                />

                {/* Danh sách tên gợi ý */}
                {isTeacherDropdownOpen && suggestedTeachers.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                    {suggestedTeachers.map((teacher, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setTeacherName(teacher);
                          setIsTeacherDropdownOpen(false);
                        }}
                        className="px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer transition border-b border-slate-50 last:border-none"
                      >
                        {teacher}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cột 2: Tên của bạn */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs md:text-sm font-bold text-slate-800">
                    Tên của bạn {!isAnonymous && <span className="text-rose-500">*</span>}
                  </label>
                  <span className="text-[11px] text-slate-400">Tối đa 60 ký tự</span>
                </div>

                <input
                  type="text"
                  maxLength={60}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  disabled={isAnonymous}
                  placeholder={isAnonymous ? 'BTEC-er (Ẩn danh)' : 'Ví dụ: Nguyễn Văn A'}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none ${isAnonymous
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed italic'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                    }`}
                />

                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Người gửi được hiển thị trên thiệp
                  </span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setIsAnonymous(next);
                        if (next) setSenderName('');
                      }}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">Gửi ẩn danh</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Hàng 2: Văn mẫu điền nhanh */}
            <div className="p-3.5 md:p-4 rounded-2xl bg-[#FFF8F3] border border-orange-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs md:text-sm font-bold text-orange-950 flex items-center gap-1.5">
                <span>✨</span>
                <span>Bí lời rồi? Chọn một văn mẫu để điền nhanh</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {WISH_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => applyWishTopic(topic)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-orange-100/70 text-orange-900 border border-orange-200 shadow-2xs transition cursor-pointer"
                  >
                    {topic.badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Hàng 3: Lời chúc gửi đến thầy cô */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs md:text-sm font-bold text-slate-800">
                  Lời chúc gửi đến thầy cô <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 italic">
                  Chỉnh sửa tự do sau khi chọn mẫu
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition">
                <textarea
                  rows={5}
                  maxLength={250}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Có điều gì bạn luôn muốn nói với thầy cô? Hãy viết tại đây nhé.."
                  className="w-full p-4 bg-slate-50/40 focus:bg-white text-slate-900 placeholder-slate-400 text-sm outline-none resize-none leading-relaxed transition"
                  required
                />

                {/* Footer của Textarea */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
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
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Mỗi lời cảm ơn đều có một câu chuyện riêng ♡
                    </span>
                  )}

                  <span className={`text-[11px] font-semibold ${isCharCountExceeded ? 'text-rose-600' : 'text-slate-500'}`}>
                    {charCount} / 250
                  </span>
                </div>
              </div>
            </div>

            {/* Hàng 4: Hộp lưu ý xanh lá */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
              <span className="font-bold">✓</span>
              <span>Khi nhập nội dung, tấm thiệp bên dưới sẽ cập nhật ngay. Bạn có thể đổi mẫu thiệp mà không mất lời chúc.</span>
            </div>

          </div>
        </section>


        {/* ========================================================================= */}
        {/* PHẦN 3: XEM TRƯỚC MẪU THIỆP & GỬI ĐI (THEO ẢNH 4)                          */}
        {/* ========================================================================= */}
        <section className="space-y-4">

          {/* Header phần xem trước */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-orange-600 tracking-wider uppercase mb-1">
                03 — GÓI GHÉM & GỬI ĐI
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Tấm thiệp của bạn đã sẵn sàng
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Kiểm tra lại một lần trước khi gửi lời tri ân.
              </p>
            </div>
            <p className="text-xs text-slate-400 font-medium self-start sm:self-auto">
              Xem trước thành phẩm
            </p>
          </div>

          {/* Khung trưng bày bưu thiếp xem trước */}
          <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-200/90 shadow-sm max-w-4xl mx-auto space-y-6">

            <div className="w-full rounded-2xl overflow-hidden postcard-shadow bg-[#fcfaf7] p-2 md:p-3 border border-amber-900/10 flex items-center justify-center">
              <canvas
                ref={previewCanvasRef}
                className="w-full h-auto rounded-xl object-contain shadow-xs"
              />
            </div>

            {/* Hàng nút hành động căn giữa */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs md:text-sm font-semibold shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowDown className="w-4 h-4 text-slate-600" />
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
                className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs md:text-sm font-semibold shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4 text-slate-600" />
                <span>Phóng to</span>
              </button>

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`px-7 py-2.5 rounded-full font-bold text-white text-xs md:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${canSubmit
                    ? 'bg-[#f06428] hover:bg-[#d8551c] shadow-orange-900/20 active:scale-[0.99]'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi thiệp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi lời tri ân 20/11</span>
                  </>
                )}
              </button>
            </div>

            {/* Thông báo nhắc nhở khi chưa điền đủ */}
            {!canSubmit && (
              <p className="text-center text-xs text-slate-400">
                {!teacherName.trim()
                  ? '• Vui lòng nhập tên Thầy/Cô để hoàn tất thiệp'
                  : !isAnonymous && !senderName.trim()
                    ? '• Vui lòng nhập tên người gửi hoặc chọn "Gửi ẩn danh"'
                    : !message.trim()
                      ? '• Vui lòng nhập lời chúc thầy cô'
                      : isCharCountExceeded
                        ? '• Lời chúc vượt quá giới hạn 250 ký tự'
                        : !profanityResult.isValid
                          ? '• Nội dung có từ ngữ không phù hợp'
                          : ''}
              </p>
            )}

          </div>

        </section>

      </form>
    </div>
  );
}

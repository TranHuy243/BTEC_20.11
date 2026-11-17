import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Send, ArrowDown, ArrowUpRight, AlertTriangle,
  PenTool, CheckCircle
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

// 6 mẫu bưu thiếp nguyên bản
const TEMPLATE_CARDS = [
  {
    id: 'luxury_cream',
    name: 'Mẫu 1',
    image: '/frames/frame_mau_1.jpg?v=5'
  },
  {
    id: 'collegiate_navy',
    name: 'Mẫu 2',
    image: '/frames/frame_mau_2.jpg?v=5'
  },
  {
    id: 'slate_chalk',
    name: 'Mẫu 3',
    image: '/frames/frame_mau_3.jpg?v=5'
  },
  {
    id: 'international_uk_au',
    name: 'Mẫu 4',
    image: '/frames/frame_mau_4.jpg?v=5'
  },
  {
    id: 'airmail_global',
    name: 'Mẫu 5',
    image: '/frames/frame_mau_5.jpg?v=5'
  },
  {
    id: 'vintage_journey',
    name: 'Mẫu 6',
    image: '/frames/frame_mau_6.jpg?v=5'
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
        sender_name: isAnonymous ? 'Một sinh viên BTEC FPT' : (senderName || 'Học trò BTEC FPT'),
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
        sender_name: isAnonymous ? 'Một sinh viên BTEC FPT' : senderName,
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

          {/* 6 Mẫu thiệp hiển thị lưới trực quan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-1">
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
                  Gửi đến thầy/cô nhận thiệp <span className="text-rose-500">*</span>
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
                  placeholder="Nhập tên Thầy/Cô"
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

                <div className="relative flex items-center">
                  <input
                    type="text"
                    maxLength={60}
                    value={isAnonymous ? 'Một sinh viên BTEC FPT' : senderName}
                    onChange={(e) => {
                      if (!isAnonymous) setSenderName(e.target.value);
                    }}
                    disabled={isAnonymous}
                    placeholder="Nhập tên người gửi"
                    className={`w-full pl-4 pr-32 py-2.5 rounded-xl border text-sm transition focus:outline-none ${isAnonymous
                      ? 'bg-orange-50/70 border-orange-200 text-orange-950 font-medium'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isAnonymous;
                      setIsAnonymous(next);
                      if (next) setSenderName('');
                    }}
                    className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer select-none flex items-center gap-1 ${isAnonymous
                      ? 'bg-orange-500 text-white shadow-xs hover:bg-orange-600'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80'
                      }`}
                  >
                    <span>{isAnonymous ? '✓ Ẩn danh' : 'Gửi ẩn danh'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Hàng 2: Lời chúc gửi đến thầy cô & Dải văn mẫu tri ân 1 2 3 */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="text-xs md:text-sm font-bold text-slate-800">
                  Lời chúc gửi đến thầy cô <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Văn mẫu:</span>
                  {WISH_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => applyWishTopic(topic)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 text-slate-700 border border-slate-200/80 transition cursor-pointer"
                    >
                      {topic.badge}
                    </button>
                  ))}
                </div>
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
                  ) : message.trim().length > 0 ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold animate-in fade-in duration-200">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Nội dung hợp lệ</span>
                    </div>
                  ) : (
                    <span />
                  )}

                  <span className={`text-[11px] font-semibold ${isCharCountExceeded ? 'text-rose-600' : 'text-slate-500'}`}>
                    {charCount} / 250
                  </span>
                </div>
              </div>
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
            </div>
            <p className="text-xs text-slate-400 font-medium self-start sm:self-auto">
              Xem trước thành phẩm
            </p>
          </div>

          {/* Khung trưng bày bưu thiếp xem trước */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">

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
                  sender_name: isAnonymous ? 'Một sinh viên BTEC FPT' : (senderName || 'Học trò BTEC FPT'),
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

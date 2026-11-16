import React, { useEffect, useRef } from 'react';
import { X, Download, Share2, Sparkles, Check } from 'lucide-react';
import { renderCardOnCanvas, downloadCardImage } from '../lib/cardRenderer';

export default function CardModal({ wish, onClose, isNew = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (wish && canvasRef.current) {
      renderCardOnCanvas(canvasRef.current, wish);
    }
  }, [wish]);

  if (!wish) return null;

  const handleDownload = () => {
    if (canvasRef.current) {
      const name = wish.teacher_name ? wish.teacher_name.trim().replace(/\s+/g, '-') : 'thay-co';
      downloadCardImage(canvasRef.current, `thiep-20-11-${name}.png`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bưu Thiếp 20/11 gửi ${wish.teacher_name}`,
          text: `"${wish.message}" - Người gửi: ${wish.is_anonymous ? 'BTEC-er' : wish.sender_name}`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(
        `[Tri Ân 20/11] Gửi ${wish.teacher_name}: "${wish.message}" - ${wish.is_anonymous ? 'BTEC-er' : wish.sender_name}`
      );
      alert('Đã sao chép nội dung lời chúc vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col overflow-hidden text-slate-900">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm md:text-base text-slate-900">
                {isNew ? '🎉 Gửi Lời Chúc Thành Công!' : 'Bưu Thiếp Tri Ân 20/11'}
              </h3>
              <p className="text-xs text-slate-500">
                Kính gửi: <span className="font-semibold text-rose-600">{wish.teacher_name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thân Modal: Canvas hiển thị bưu thiếp chất lượng cao */}
        <div className="p-4 md:p-6 bg-slate-50/60 flex items-center justify-center">
          <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2">
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded-xl object-contain shadow-xs"
            />
          </div>
        </div>

        {/* Chân Modal: Nút Thao tác */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Chia sẻ lời chúc</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-900/15 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Bưu Thiếp Về Máy (PNG)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

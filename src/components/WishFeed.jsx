import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Download, Heart, Eye, Sparkles, GraduationCap, Clock } from 'lucide-react';
import { renderCardOnCanvas, downloadCardImage } from '../lib/cardRenderer';
import { toggleLike } from '../lib/supabase';

function MiniCardCanvas({ wish }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderCardOnCanvas(canvasRef.current, wish);
    }
  }, [wish]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto aspect-[1.6/1] object-contain rounded-t-2xl bg-[#faf7f2]"
    />
  );
}

export default function WishFeed({ wishes, onSelectWish }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [likedMap, setLikedMap] = useState({});

  const filteredWishes = useMemo(() => {
    const seen = new Set();
    return wishes.filter((w) => {
      if (!w || !w.id) return false;
      if (seen.has(w.id)) return false;
      seen.add(w.id);

      const matchSearch =
        (w.teacher_name && w.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (w.sender_name && w.sender_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (w.message && w.message.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });
  }, [wishes, searchTerm]);

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} • ${day}/${month}/${year}`;
  };

  const handleLike = async (e, wish) => {
    e.stopPropagation();
    if (likedMap[wish.id]) return;

    setLikedMap((prev) => ({ ...prev, [wish.id]: true }));
    wish.likes = (wish.likes || 0) + 1;
    await toggleLike(wish.id, wish.likes - 1);
  };

  const handleDownload = (e, wish) => {
    e.stopPropagation();
    const tempCanvas = document.createElement('canvas');
    renderCardOnCanvas(tempCanvas, wish).then(() => {
      const name = wish.teacher_name ? wish.teacher_name.trim().replace(/\s+/g, '-') : 'thay-co';
      downloadCardImage(tempCanvas, `thiep-20-11-${name}.png`);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">

      {/* Thanh Bar Tổng Quan & Tìm Kiếm */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/90 shadow-lg shadow-slate-900/5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
            <Heart className="w-6 h-6 fill-rose-600 text-rose-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
              Lưu Bút Tri Ân
            </h3>
            <p className="text-xs text-slate-500">
              Đang lưu giữ <span className="font-bold text-rose-600">{wishes.length}</span> lời chúc & bưu thiếp ý nghĩa từ sinh viên BTEC FPT
            </p>
          </div>
        </div>

        {/* Ô Tìm kiếm */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên Thầy/Cô, người gửi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs md:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
          />
        </div>
      </div>

      {/* Lưới trưng bày bưu thiếp 2 cột */}
      {filteredWishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <p className="text-slate-500 text-sm">Không tìm thấy bưu thiếp nào phù hợp với từ khóa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredWishes.map((wish) => (
            <div
              key={wish.id}
              onClick={() => onSelectWish(wish)}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-rose-300 shadow-md hover:shadow-2xl hover:shadow-rose-950/5 transition-all duration-300 flex flex-col group cursor-pointer overflow-hidden"
            >
              {/* Phần Canvas bưu thiếp thu nhỏ */}
              <div className="p-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-center">
                <div className="w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200/60 bg-white">
                  <MiniCardCanvas wish={wish} />
                </div>
              </div>

              {/* Phần Chân Card: Thông tin người nhận, người gửi, ngày giờ, like & tải ảnh */}
              <div className="p-4 px-5 flex items-center justify-between gap-3 text-xs bg-white">
                <div className="truncate">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm truncate">
                    <GraduationCap className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="truncate">Kính gửi: {wish.teacher_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] truncate mt-1 ml-5.5">
                    <span className="truncate">
                      Từ: <strong className="font-semibold text-slate-700">{wish.is_anonymous ? 'BTEC-er' : wish.sender_name}</strong>
                    </span>
                    {wish.created_at && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-slate-400 shrink-0">

                          {formatDateTime(wish.created_at)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Thả tim */}
                  <button
                    onClick={(e) => handleLike(e, wish)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${likedMap[wish.id]
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                      }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[wish.id] ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{wish.likes || 0}</span>
                  </button>

                  {/* Nút tải ảnh */}
                  <button
                    onClick={(e) => handleDownload(e, wish)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Tải ảnh bưu thiếp về máy"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

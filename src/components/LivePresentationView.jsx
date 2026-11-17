import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { renderCardOnCanvas } from '../lib/cardRenderer';

const DEFAULT_MARQUEE_SPEED = 60; // 60 giây cho 1 vòng trôi đầy đủ

const getSavedSpeed = () => {
  const val = parseInt(localStorage.getItem('btec_presentation_marquee_speed') || '60', 10);
  return isNaN(val) || val <= 0 ? DEFAULT_MARQUEE_SPEED : val;
};

const getSavedTheme = () => {
  return localStorage.getItem('btec_presentation_theme') || 'forest_kv';
};

export function ProjectorCardCanvas({ wish }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    if (canvasRef.current && wish) {
      renderCardOnCanvas(canvasRef.current, wish);
    }
    return () => {
      isMounted = false;
    };
  }, [wish]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-auto aspect-[1024/571] object-contain rounded-2xl md:rounded-3xl shadow-2xl bg-[#FFFDF7]"
    />
  );
}

export default function LivePresentationView({ wishes = [], onExit }) {
  const [scrollSpeed, setScrollSpeed] = useState(getSavedSpeed);
  const [theme, setTheme] = useState(getSavedTheme);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedWishForDetail, setSelectedWishForDetail] = useState(null);

  const containerRef = useRef(null);

  // Lắng nghe khi cài đặt tốc độ hoặc theme thay đổi từ Admin
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e || e.key === 'btec_presentation_marquee_speed') {
        setScrollSpeed(getSavedSpeed());
      }
      if (!e || e.key === 'btec_presentation_theme') {
        setTheme(getSavedTheme());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Phím tắt điều khiển: F toàn màn hình, Esc đóng phóng to
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (selectedWishForDetail) {
          setSelectedWishForDetail(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWishForDetail]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Tạo chuỗi lặp lại đủ dài để phủ toàn bộ màn hình và loop -50% hoàn hảo không vết khựng
  const marqueeCards = useMemo(() => {
    if (!wishes || wishes.length === 0) return [];

    // Lặp mảng gốc cho đến khi có ít nhất 6 thiệp (đảm bảo track dài hơn 2x màn hình rộng nhất)
    let repeated = [...wishes];
    while (repeated.length < 6) {
      repeated = [...repeated, ...wishes];
    }

    // Nhân đôi danh sách thành 2 nửa A và B giống hệt nhau: loop -50% hoàn toàn mượt mà không khựng
    return [...repeated, ...repeated];
  }, [wishes]);

  // Cấu hình theme phù hợp với visual 20/11 BTEC (hoa cúc, bục tròn, áo dài vàng)
  const isForestKV = theme === 'forest_kv';
  const isSageMint = theme === 'sage_mint';

  return (
    <div
      ref={containerRef}
      onDoubleClick={toggleFullscreen}
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none font-sans transition-colors duration-500 relative ${isForestKV
          ? 'bg-gradient-to-br from-[#091c13] via-[#123824] to-[#07180f] text-white'
          : isSageMint
            ? 'bg-gradient-to-br from-[#cde7d0] via-[#e2f3e5] to-[#c5e2c9] text-slate-800'
            : 'bg-gradient-to-br from-[#382417] via-[#563C2B] to-[#2c1b10] text-white'
        }`}
    >
      {/* ===================== ÁNH SÁNG & HỌA TIẾT NỀN THEO VISUAL 20/11 ===================== */}
      {isForestKV && (
        <>
          {/* Quầng sáng xanh lá & vàng hoa cúc mô phỏng visual 20/11 */}
          <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] rounded-full bg-[#34784b]/20 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full bg-[#f59e0b]/15 blur-[140px] pointer-events-none" />
          <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full bg-[#52a36e]/10 blur-[160px] pointer-events-none" />

          {/* Vòng tròn vòm nghệ thuật mờ mờ ở hậu cảnh lấy cảm hứng từ bục tròn của Visual */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-amber-400/5 pointer-events-none" />
        </>
      )}

      {/* ===================== HEADER ===================== */}
      <header className="relative z-30 px-8 md:px-14 py-6 flex items-center justify-between">

        {/* Góc trái: Logo BTEC FPT từ trang web */}
        <div className="flex items-center gap-3">
          <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center justify-center backdrop-blur-xs">
            <img
              src="/logo-btec.png"
              alt="BTEC FPT"
              className="h-8 md:h-10 w-auto object-contain shrink-0"
            />
          </div>
        </div>

        {/* Giữa: Tiêu đề trang trọng đúng visual 20/11 */}
        <div className="text-center">
          <p className="text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-[#F59E0B]">
            Nhà giáo Việt Nam 20.11          </p>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight mt-0.5 drop-shadow-md">
            Lưu Bút Tri Ân           </h1>
        </div>

        {/* Góc phải: Logo Melbourne Polytechnic đối diện logo BTEC */}
        <div className="flex items-center gap-3">
          <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center justify-center backdrop-blur-xs">
            <img
              src="/logo-melbourne.png"
              alt="Melbourne Polytechnic"
              className="h-8 md:h-10 w-auto object-contain shrink-0"
            />
          </div>
        </div>

      </header>

      {/* ===================== KHU VỰC CHÍNH: CUỘN NGANG LIÊN TỤC VÔ TẬN & PHÓNG TO THIỆP ===================== */}
      <main className="relative z-20 flex-1 flex items-center overflow-hidden w-full py-2">
        {wishes.length === 0 ? (
          <div className="text-center mx-auto py-12 text-white/50 text-base font-medium">
            Chưa có lời chúc nào. Khi sinh viên gửi lời chúc trên trang web, thiệp sẽ tự động trôi vào màn hình tại đây.
          </div>
        ) : (
          <div className="relative w-full overflow-hidden flex items-center py-4 pause-on-hover group">

            {/* Dãy thiệp trôi liên tục không dừng lại */}
            <div
              className="animate-marquee-continuous flex items-center gap-8 md:gap-12 shrink-0 select-none"
              style={{
                animationDuration: `${scrollSpeed}s`,
              }}
            >
              {marqueeCards.map((wish, index) => (
                <div
                  key={`${wish.id}-${index}`}
                  onClick={() => setSelectedWishForDetail(wish)}
                  className="w-[660px] sm:w-[740px] md:w-[820px] lg:w-[900px] xl:w-[960px] aspect-[1024/571] shrink-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/20 cursor-pointer"
                  title="Chạm vào thiệp để đọc đầy đủ"
                >
                  <ProjectorCardCanvas wish={wish} />
                </div>
              ))}
            </div>

          </div>
        )}
      </main>

      {/* ===================== MODAL PHÓNG TO CHI TIẾT KHI CHẠM VÀO THIỆP ===================== */}
      {selectedWishForDetail && (
        <div
          onClick={() => setSelectedWishForDetail(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 md:p-12 cursor-pointer animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-transparent rounded-3xl overflow-hidden relative shadow-2xl cursor-default"
          >
            <button
              onClick={() => setSelectedWishForDetail(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer text-sm font-bold"
              title="Đóng (Phím Esc)"
            >
              ✕
            </button>
            <ProjectorCardCanvas wish={selectedWishForDetail} />
          </div>
        </div>
      )}

    </div>
  );
}

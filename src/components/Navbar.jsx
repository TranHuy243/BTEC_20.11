import React from 'react';
import { PenTool, HeartHandshake } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, wishCount }) {
  return (
    <header className="w-full px-4 md:px-8 max-w-7xl mx-auto pt-4 pb-2 transition-all">
      {/* Khung thanh Navbar dạng một dải Pill tròn nổi (Floating Island Pill) duy nhất */}
      <div className="w-full bg-white/90 backdrop-blur-md rounded-full border border-slate-200/80 shadow-md shadow-slate-900/5 px-3.5 md:px-6 py-2 md:py-2.5 flex items-center justify-between gap-3">

        {/* Khối bên trái: Logo BTEC FPT & Melbourne Polytechnic & Tiêu đề Tri Ân */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <img
            src="/logo-btec.png"
            alt="BTEC FPT Education"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0"
          />
          <div className="h-4 sm:h-5 w-[1px] bg-slate-200" />
          <img
            src="/logo-melbourne.png"
            alt="Melbourne Polytechnic"
            className="h-6 sm:h-7 md:h-8 w-auto object-contain shrink-0"
          />
          <div className="h-5 w-[1px] bg-slate-200 hidden md:block" />
          <div className="hidden md:flex items-center gap-2">
            <span className="font-extrabold text-sm md:text-base text-slate-800 tracking-tight">
              Tri Ân Thầy Cô
            </span>
          </div>
        </div>

        {/* Khối bên phải: Cụm nút chuyển Tab phong cách Pill thanh lịch */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'form'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
          >
            <PenTool className="w-3.5 h-3.5 shrink-0" />
            <span>Soạn Thiệp</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 md:gap-2 px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'feed'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
            <span>Lưu Bút Tri Ân</span>
            {wishCount > 0 && (
              <span
                className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-bold transition-all ${activeTab === 'feed'
                    ? 'bg-white/25 text-white'
                    : 'bg-amber-500 text-white shadow-xs'
                  }`}
              >
                {wishCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}

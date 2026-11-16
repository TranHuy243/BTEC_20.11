import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import WishForm from './components/WishForm';
import WishFeed from './components/WishFeed';
import CardModal from './components/CardModal';
import AdminDashboard from './components/AdminDashboard';
import LivePresentationView from './components/LivePresentationView';
import { getWishes, isSupabaseConfigured, supabase } from './lib/supabase';
import { GraduationCap, Heart } from 'lucide-react';

export default function App() {
  const getRouteView = () => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#present' || hash === '#live' || hash === '#projection') {
      return 'present';
    }
    if (hash === '#admin' || window.location.pathname === '/admin') {
      return 'admin';
    }
    return 'site';
  };

  const [currentView, setCurrentView] = useState(getRouteView);
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'feed'
  const [wishes, setWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWishForModal, setSelectedWishForModal] = useState(null);
  const [isNewlySubmitted, setIsNewlySubmitted] = useState(false);

  // Lắng nghe thay đổi hash URL (ví dụ: #admin, #present, hoặc chuyển trang)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(getRouteView());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Tải danh sách lời chúc
  const loadWishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getWishes();
      setWishes(res.data || []);
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishes();

    // Lắng nghe sự kiện Realtime từ Supabase (khi có bài mới hoặc có bài bị xóa)
    if (isSupabaseConfigured && supabase) {
      const channel = supabase
        .channel('public:wishes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'wishes' },
          (payload) => {
            setWishes((prev) => {
              // Chống trùng lặp: nếu đã tồn tại ID thì không thêm lại
              if (prev.some((item) => item.id === payload.new.id)) {
                return prev;
              }
              return [payload.new, ...prev];
            });
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'wishes' },
          (payload) => {
            setWishes((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'wishes' },
          (payload) => {
            setWishes((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [loadWishes]);

  // Xử lý khi gửi lời chúc thành công
  const handleWishSubmitted = (newWish) => {
    setWishes((prev) => {
      // Chống trùng lặp bài viết
      if (prev.some((item) => item.id === newWish.id)) {
        return prev;
      }
      return [newWish, ...prev];
    });
    setIsNewlySubmitted(true);
    setSelectedWishForModal(newWish);
  };

  // Mở trang Admin bí mật
  const openAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  // Quay lại trang web công khai
  const backToSite = () => {
    window.location.hash = '';
    setCurrentView('site');
  };

  // 1. MÀN HÌNH TRÌNH CHIẾU TV / HỘI TRƯỜNG (URL: /#present)
  if (currentView === 'present') {
    return (
      <LivePresentationView
        wishes={wishes}
        onExit={() => {
          window.location.hash = 'admin';
          setCurrentView('admin');
        }}
      />
    );
  }

  // 2. MÀN HÌNH ADMIN DASHBOARD (URL: /#admin)
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        wishes={wishes}
        onRefreshWishes={loadWishes}
        onBackToSite={backToSite}
        onOpenLivePresentation={(newTab = false) => {
          if (newTab) {
            window.open('/#present', '_blank');
          } else {
            window.location.hash = 'present';
            setCurrentView('present');
          }
        }}
      />
    );
  }

  // GIAO DIỆN CÔNG KHAI DÀNH CHO HỌC SINH & THẦY CÔ
  return (
    <div className="min-h-screen studio-bg text-slate-800 flex flex-col justify-between selection:bg-rose-100 selection:text-rose-900">

      <div>
        {/* Navigation Bar công khai (Hoàn toàn không có nút Admin) */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          wishCount={wishes.length}
        />

        {/* Nội dung chính theo Tab */}
        <main className="pb-12">
          {activeTab === 'form' ? (
            <WishForm
              onWishSubmitted={handleWishSubmitted}
              onOpenZoomModal={(previewData) => {
                setIsNewlySubmitted(false);
                setSelectedWishForModal(previewData);
              }}
            />
          ) : (
            <WishFeed
              wishes={wishes}
              onSelectWish={(wish) => {
                setIsNewlySubmitted(false);
                setSelectedWishForModal(wish);
              }}
            />
          )}
        </main>
      </div>

      {/* Footer ấm áp & trang nhã */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-xs py-7 text-center text-xs text-slate-500 relative">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2 text-rose-700 font-bold text-sm md:text-base">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600 animate-pulse" />
            <span>Kính Chúc Quý Thầy Cô Ngày Nhà Giáo Việt Nam 20/11 Trọn Vẹn Niềm Vui!</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
            <span>BTEC FPT Education</span>
            <span>•</span>
            <span>Tri ân Thầy Cô Ngày Nhà Giáo Việt Nam 20.11</span>
          </div>
        </div>
      </footer>

      {/* Modal phóng to xem chi tiết / tải thiệp */}
      {selectedWishForModal && (
        <CardModal
          wish={selectedWishForModal}
          isNew={isNewlySubmitted}
          onClose={() => setSelectedWishForModal(null)}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import WishForm from './components/WishForm';
import WishFeed from './components/WishFeed';
import CardModal from './components/CardModal';
import AdminDashboard from './components/AdminDashboard';
import LivePresentationView from './components/LivePresentationView';
import { getWishes, isSupabaseConfigured, supabase } from './lib/supabase';

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

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldCheck, ShieldAlert, Trash2, Search, Eye, 
  ArrowLeft, LogOut, Key, UserPlus, Users, 
  Sparkles, CheckCircle2, FileSpreadsheet, Lock, Tv,
  ExternalLink, Play, Sliders, Maximize2,
  Activity, Smartphone, Monitor, RefreshCw, BarChart3, Globe, TrendingUp
} from 'lucide-react';
import {
  deleteWish,
  getModerators,
  addModerator,
  deleteModerator,
  getLocalPresentationSettings,
  getPresentationSettings,
  savePresentationSettings,
  subscribePresentationSettings,
  getVisitorStats
} from '../lib/supabase';
import { checkProfanity } from '../lib/profanityFilter';
import CardModal from './CardModal';
import { ProjectorCardCanvas } from './LivePresentationView';

// Mã PIN quản trị tối cao (Master Admin PIN)
const MASTER_ADMIN_PIN = '20112026';

export default function AdminDashboard({ wishes, onlineCount = 1, onRefreshWishes, onBackToSite, onOpenLivePresentation }) {
  const [currentUser, setCurrentUser] = useState(null); // { role: 'admin' | 'moderator', name: string }
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('wishes'); // 'wishes' | 'presentation' | 'analytics' | 'moderators'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ANONYMOUS' | 'NAMED' | 'SUSPICIOUS'

  // Thống kê lượng khách truy cập (Site Visits & Analytics)
  const [visitorStats, setVisitorStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    mobileVisits: 0,
    desktopVisits: 0,
    recentVisits: []
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const loadVisitorStatsData = async () => {
    setIsLoadingStats(true);
    try {
      const res = await getVisitorStats();
      if (res?.data) {
        setVisitorStats(res.data);
      }
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadVisitorStatsData();
    const interval = setInterval(loadVisitorStatsData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cấu hình tốc độ trôi thiệp & theme trình chiếu TV (đồng bộ Realtime lên Supabase cho TẤT CẢ các TV)
  const initialTvSettings = getLocalPresentationSettings();
  const [marqueeSpeed, setMarqueeSpeed] = useState(initialTvSettings.marqueeSpeed);
  const [presentationTheme, setPresentationTheme] = useState(initialTvSettings.theme);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced'
  const syncTimerRef = useRef(null);
  const statusClearRef = useRef(null);

  const pushPresentationSettings = (nextSpeed, nextTheme, debounceMs = 0) => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    if (statusClearRef.current) clearTimeout(statusClearRef.current);
    setSyncStatus('syncing');

    const run = async () => {
      await savePresentationSettings({
        marqueeSpeed: nextSpeed,
        theme: nextTheme
      });
      setSyncStatus('synced');
      statusClearRef.current = setTimeout(() => {
        setSyncStatus('idle');
      }, 2500);
    };

    if (debounceMs > 0) {
      syncTimerRef.current = setTimeout(run, debounceMs);
    } else {
      run();
    }
  };

  const handleSetMarqueeSpeed = (sec, debounceMs = 0) => {
    const num = Math.max(10, Math.min(180, Number(sec) || 60));
    setMarqueeSpeed(num);
    pushPresentationSettings(num, presentationTheme, debounceMs);
  };

  const handleSetTheme = (themeId) => {
    setPresentationTheme(themeId);
    pushPresentationSettings(marqueeSpeed, themeId, 0);
  };

  // Tải cấu hình trình chiếu TV đang chạy từ Supabase & giữ đồng bộ giữa nhiều máy Admin
  useEffect(() => {
    let isMounted = true;
    getPresentationSettings().then((res) => {
      if (!isMounted || !res?.data) return;
      setMarqueeSpeed(res.data.marqueeSpeed);
      setPresentationTheme(res.data.theme);
    });

    const unsubscribe = subscribePresentationSettings((settings) => {
      if (!isMounted || !settings) return;
      setMarqueeSpeed(settings.marqueeSpeed);
      setPresentationTheme(settings.theme);
    });

    return () => {
      isMounted = false;
      unsubscribe();
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      if (statusClearRef.current) clearTimeout(statusClearRef.current);
    };
  }, []);
  
  const [moderators, setModerators] = useState([]);
  const [newModName, setNewModName] = useState('');
  const [newModPin, setNewModPin] = useState('');
  const [isAddingMod, setIsAddingMod] = useState(false);

  const [selectedWishForModal, setSelectedWishForModal] = useState(null);
  const [wishToDelete, setWishToDelete] = useState(null);

  // Tải danh sách người kiểm duyệt
  const loadMods = async () => {
    const res = await getModerators();
    setModerators(res.data || []);
  };

  useEffect(() => {
    loadMods();
  }, []);

  // Xử lý đăng nhập bằng mã PIN
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const trimmedPin = pinInput.trim();

    // 1. Kiểm tra nếu là Master Admin
    if (trimmedPin === MASTER_ADMIN_PIN) {
      setCurrentUser({
        role: 'admin',
        name: 'Quản Trị Viên Trưởng (Admin)'
      });
      setPinInput('');
      return;
    }

    // 2. Kiểm tra nếu là một trong các Người kiểm duyệt
    const matchedMod = moderators.find((m) => m.pin_code === trimmedPin);
    if (matchedMod) {
      setCurrentUser({
        role: 'moderator',
        name: matchedMod.name || 'Người kiểm duyệt'
      });
      setPinInput('');
      return;
    }

    setLoginError('Mã PIN không chính xác. Vui lòng kiểm tra lại!');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPinInput('');
  };

  // Thêm người kiểm duyệt mới (Chỉ Admin)
  const handleAddModerator = async (e) => {
    e.preventDefault();
    if (!newModName.trim() || !newModPin.trim()) return;

    setIsAddingMod(true);
    try {
      await addModerator(newModName, newModPin, 'moderator');
      setNewModName('');
      setNewModPin('');
      await loadMods();
      alert('Đã thêm người kiểm duyệt thành công!');
    } catch (err) {
      alert('Có lỗi khi thêm người kiểm duyệt.');
    } finally {
      setIsAddingMod(false);
    }
  };

  // Xóa / Thu hồi quyền người kiểm duyệt
  const handleDeleteModerator = async (modId) => {
    if (window.confirm('Bạn có chắc chắn muốn thu hồi quyền của người kiểm duyệt này?')) {
      await deleteModerator(modId);
      await loadMods();
    }
  };

  // Xóa lời chúc vi phạm
  const confirmDeleteWish = async () => {
    if (!wishToDelete) return;
    try {
      await deleteWish(wishToDelete.id);
      setWishToDelete(null);
      if (onRefreshWishes) onRefreshWishes();
      alert('Đã xóa lời chúc thành công khỏi cơ sở dữ liệu!');
    } catch (e) {
      alert('Lỗi khi xóa bài viết.');
    }
  };

  // Xuất danh sách lời chúc ra CSV (Excel)
  const exportToCSV = () => {
    if (wishes.length === 0) {
      alert('Chưa có lời chúc nào để xuất.');
      return;
    }

    const headers = ['ID', 'Thầy/Cô Nhận', 'Người Gửi', 'Loại', 'Nội Dung Lời Chúc', 'Lượt Tim', 'Thời Gian Gửi'];
    const rows = wishes.map((w) => [
      `"${w.id}"`,
      `"${(w.teacher_name || '').replace(/"/g, '""')}"`,
      `"${(w.sender_name || '').replace(/"/g, '""')}"`,
      w.is_anonymous ? '"Ẩn danh"' : '"Có tên"',
      `"${(w.message || '').replace(/"/g, '""')}"`,
      w.likes || 0,
      `"${new Date(w.created_at).toLocaleString('vi-VN')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh-sach-loi-chuc-20-11-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Lọc danh sách lời chúc
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

      let matchType = true;
      if (filterType === 'ANONYMOUS') matchType = w.is_anonymous;
      if (filterType === 'NAMED') matchType = !w.is_anonymous;
      if (filterType === 'SUSPICIOUS') {
        const check = checkProfanity(w.message);
        matchType = !check.isValid;
      }

      return matchSearch && matchType;
    });
  }, [wishes, searchTerm, filterType]);

  // ==================== MÀN HÌNH ĐĂNG NHẬP MÃ PIN ====================
  if (!currentUser) {
    return (
      <div className="min-h-screen studio-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-200 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Khu Vực Quản Trị Bí Mật
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              Đăng Nhập Ban Kiểm Duyệt 20/11
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dành riêng cho Quản trị viên và các bạn trong Ban kiểm duyệt nội dung
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-rose-600" />
                Nhập Mã PIN Bí Mật
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Nhập mã PIN truy cập..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition tracking-widest text-center font-mono font-bold"
                required
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 text-center font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              Mở Khóa Quản Trị
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={onBackToSite}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang web công khai</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==================== GIAO DIỆN ADMIN DASHBOARD CHÍNH ====================
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      
      {/* Top Navbar Admin */}
      <header className="bg-slate-900 text-white px-4 md:px-8 py-3.5 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm md:text-base tracking-tight">
                  Trung Tâm Kiểm Duyệt 20/11
                </h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-amber-400 text-slate-900' : 'bg-emerald-400 text-slate-900'}`}>
                  {isAdmin ? 'Quản Trị Viên (Admin)' : 'Người Kiểm Duyệt'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Đăng nhập: <span className="text-white font-medium">{currentUser.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenLivePresentation ? onOpenLivePresentation() : (window.location.hash = 'present')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-rose-950/20 transition cursor-pointer"
              title="Mở màn hình chiếu hội trường live"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Màn Hình Chiếu 📽️</span>
            </button>

            <button
              onClick={onBackToSite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Về trang web</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>

        </div>
      </header>

      {/* Nội dung Dashboard */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* ===================== KHU VỰC THỐNG KÊ TỔNG QUAN ===================== */}
        <div className="space-y-4">
          
          {/* HÀNG 1: THỐNG KÊ LƯU LƯỢNG TRUY CẬP WEBSITE */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>Lưu Lượng & Người Truy Cập Website</span>
              </span>
              <button
                onClick={loadVisitorStatsData}
                disabled={isLoadingStats}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                title="Làm mới số liệu truy cập"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingStats ? 'animate-spin' : ''}`} />
                <span>{isLoadingStats ? 'Đang cập nhật...' : 'Cập nhật số liệu'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Realtime Online */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-900 font-bold flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Đang Trực Tuyến
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Realtime
                  </span>
                </div>
                <p className="text-2xl font-black text-emerald-700 mt-1.5">
                  {onlineCount} <span className="text-xs font-semibold text-emerald-600">thiết bị</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Đang bật web / TV ngay lúc này</p>
              </div>

              {/* Card 2: Unique Visitors */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    Người Truy Cập (Unique)
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Khách riêng biệt</span>
                </div>
                <p className="text-2xl font-black text-indigo-700 mt-1.5">
                  {visitorStats.uniqueVisitors}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Số thiết bị/trình duyệt đã vào</p>
              </div>

              {/* Card 3: Total Pageviews */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    Tổng Lượt Xem (Views)
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Lượt tải trang</span>
                </div>
                <p className="text-2xl font-black text-teal-700 mt-1.5">
                  {visitorStats.totalVisits}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tổng số lượt mở & xem web</p>
              </div>

              {/* Card 4: Today & Devices */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Hôm Nay / Thiết Bị
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700">
                    Hôm nay: {visitorStats.todayVisits}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{visitorStats.mobileVisits}</span>
                  </p>
                  <span className="text-slate-300">|</span>
                  <p className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{visitorStats.desktopVisits}</span>
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {visitorStats.totalVisits > 0
                    ? `${Math.round((visitorStats.mobileVisits / visitorStats.totalVisits) * 100)}% Di động • ${Math.round((visitorStats.desktopVisits / visitorStats.totalVisits) * 100)}% Máy tính`
                    : '100% Máy tính'}
                </p>
              </div>
            </div>
          </div>

          {/* HÀNG 2: THỐNG KÊ LỜI CHÚC TRI ÂN */}
          <div className="pt-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2 px-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Nội Dung Tri Ân Thầy Cô</span>
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Tổng lời chúc</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{wishes.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Có ghi họ tên</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {wishes.filter((w) => !w.is_anonymous).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Gửi ẩn danh</p>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {wishes.filter((w) => w.is_anonymous).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Tổng lượt tim</p>
                <p className="text-2xl font-black text-rose-600 mt-1">
                  {wishes.reduce((acc, curr) => acc + (curr.likes || 0), 0)}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              activeTab === 'wishes'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Kiểm Duyệt Lời Chúc ({wishes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('presentation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              activeTab === 'presentation'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Tv className="w-4 h-4 text-amber-500" />
            <span>Trình Chiếu TV / Hội Trường 📽️</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-teal-800 to-indigo-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-teal-500" />
            <span>Phân Tích Truy Cập ({visitorStats.totalVisits}) 📊</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('moderators')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition cursor-pointer ${
                activeTab === 'moderators'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Quản Lý Ban Kiểm Duyệt ({moderators.length})</span>
            </button>
          )}
        </div>

        {/* TAB 1: KIỂM DUYỆT LỜI CHÚC */}
        {activeTab === 'wishes' && (
          <div className="space-y-4">
            
            {/* Thanh công cụ tìm kiếm, lọc & xuất file */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo Thầy/Cô, người gửi, nội dung..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs md:text-sm outline-none focus:border-rose-500"
                />
              </div>

              {/* Lọc nhanh */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    filterType === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterType('ANONYMOUS')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    filterType === 'ANONYMOUS' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Chỉ ẩn danh
                </button>
                <button
                  onClick={() => setFilterType('NAMED')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    filterType === 'NAMED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Có ghi họ tên
                </button>

                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold ml-auto cursor-pointer"
                  title="Xuất ra file Excel để làm kỷ yếu hoặc lưu trữ"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Xuất Excel/CSV</span>
                </button>
              </div>
            </div>

            {/* Bảng danh sách bài viết */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-slate-100/80 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 pl-5">Người Nhận (Thầy/Cô)</th>
                      <th className="p-3.5">Người Gửi</th>
                      <th className="p-3.5">Nội Dung Lời Chúc</th>
                      <th className="p-3.5 whitespace-nowrap">Thời Gian</th>
                      <th className="p-3.5 text-center">Lượt Tim</th>
                      <th className="p-3.5 pr-5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWishes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Không tìm thấy lời chúc nào.
                        </td>
                      </tr>
                    ) : (
                      filteredWishes.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3.5 pl-5 font-bold text-slate-900 whitespace-nowrap">
                            {w.teacher_name}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                              w.is_anonymous ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {w.is_anonymous ? 'Một sinh viên BTEC FPT' : w.sender_name}
                            </span>
                          </td>
                          <td className="p-3.5 max-w-md text-slate-600 leading-relaxed italic">
                            "{w.message}"
                          </td>
                          <td className="p-3.5 text-slate-400 text-xs whitespace-nowrap">
                            {new Date(w.created_at).toLocaleString('vi-VN')}
                          </td>
                          <td className="p-3.5 text-center font-bold text-rose-600">
                            {w.likes || 0}
                          </td>
                          <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Xem thiệp */}
                              <button
                                onClick={() => setSelectedWishForModal(w)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="Xem bưu thiếp"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {/* Xóa bài viết */}
                              <button
                                onClick={() => setWishToDelete(w)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Xóa lời chúc không phù hợp"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: QUẢN LÝ NGƯỜI KIỂM DUYỆT (CHỈ ADMIN) */}
        {isAdmin && activeTab === 'moderators' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Form thêm người kiểm duyệt mới */}
            <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <UserPlus className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  Thêm Người Kiểm Duyệt Mới
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Người kiểm duyệt được cấp quyền có thể vào trang bí mật này bằng mã PIN riêng để xem và xóa các nội dung vi phạm thuần phong mỹ tục.
              </p>

              <form onSubmit={handleAddModerator} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên người kiểm duyệt (hoặc ban phụ trách)
                  </label>
                  <input
                    type="text"
                    value={newModName}
                    onChange={(e) => setNewModName(e.target.value)}
                    placeholder="VD: Trần Văn B (Lớp IT02)..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs md:text-sm outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đặt mã PIN đăng nhập cho người này (4-8 ký tự)
                  </label>
                  <input
                    type="text"
                    value={newModPin}
                    onChange={(e) => setNewModPin(e.target.value)}
                    placeholder="VD: 8899 hoặc 123456..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs md:text-sm font-mono outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingMod}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs md:text-sm transition cursor-pointer"
                >
                  {isAddingMod ? 'Đang thêm...' : 'Cấp Quyền Kiểm Duyệt'}
                </button>
              </form>
            </div>

            {/* Danh sách người kiểm duyệt */}
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    Danh Sách Ban Kiểm Duyệt ({moderators.length})
                  </h3>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {moderators.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    Chưa có người kiểm duyệt nào được tạo.
                  </p>
                ) : (
                  moderators.map((mod) => (
                    <div key={mod.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{mod.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          Mã PIN: <span className="font-bold text-slate-700">{mod.pin_code}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `[Tri Ân 20/11] Link kiểm duyệt: ${window.location.origin}/#admin - Mã PIN: ${mod.pin_code}`
                            );
                            alert('Đã sao chép link và mã PIN để gửi cho bạn này!');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                        >
                          Copy thông tin
                        </button>

                        <button
                          onClick={() => handleDeleteModerator(mod.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Xóa quyền kiểm duyệt"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800">
                💡 <b>Mẹo chia sẻ:</b> Bạn chỉ cần gửi đường link kết thúc bằng <code>/#admin</code> kèm mã PIN cho người được cấp quyền để họ có thể đăng nhập từ bất kỳ máy nào!
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: TRÌNH CHIẾU HỘI TRƯỜNG / CHIẾU TV */}
        {activeTab === 'presentation' && (
          <div className="space-y-6">
            
            {/* Banner giới thiệu & Nút kích hoạt */}
            <div className="bg-gradient-to-br from-slate-950 via-stone-900 to-emerald-950 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Màn Hình Chiếu TV & Hội Trường 20/11</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">
                    Trung Tâm Quản Lý Trình Chiếu Thiệp Tri Ân
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                    Trang trình chiếu chuyên dụng tỉ lệ 16:9 cho Tivi & Máy chiếu hội trường.
                    Toàn bộ thiệp sinh viên gửi sẽ được phóng to cỡ lớn và trôi ngang liên tục từ phải sang trái không dừng lại, khi hết danh sách sẽ tự động quay lại từ đầu mượt mà không bị khựng.
                  </p>
                </div>

                {/* Hai nút hành động chính */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => onOpenLivePresentation ? onOpenLivePresentation(true) : window.open('/#present', '_blank')}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-950/40 transition cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở Tab Chiếu TV Mới (Khuyên dùng)</span>
                  </button>

                  <button
                    onClick={() => onOpenLivePresentation ? onOpenLivePresentation(false) : (window.location.hash = 'present')}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs md:text-sm border border-white/20 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Chiếu Ngay Trên Trình Duyệt Này</span>
                  </button>
                </div>
              </div>

              {/* 3 tính năng đặc biệt */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <p className="font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Tự Động Đồng Bộ Realtime
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Bất kỳ sinh viên nào gửi lời chúc trên trang web, thiệp mới sẽ tự động nối vào dòng trôi ngang ngay tức khắc!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-amber-400" />
                    Tốc Độ Cuộn: {marqueeSpeed}s / Vòng
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Trôi ngang êm ái, liên tục không ngừng nghỉ. Khi rê chuột hoặc chạm vào thiệp sẽ dừng lại để đọc kỹ.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                  <p className="font-bold text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    Chuẩn Visual Sân Khấu 20/11
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Nền phối màu xanh thực vật, ánh vàng hoa cúc và bục tròn đồng điệu với visual chính của trường.
                  </p>
                </div>
              </div>

            </div>

            {/* KHU VỰC CÀI ĐẶT TỐC ĐỘ CUỘN NGANG DÀNH CHO ADMIN */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">
                      Cài Đặt Tốc Độ Cuộn Ngang (Số Giây / Vòng)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tùy chỉnh tốc độ trôi thiệp nhanh hay chậm. Số giây càng lớn thì thiệp trôi càng thong thả, người xem ở xa càng dễ đọc rõ từng chữ.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {syncStatus === 'syncing' && (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      Đang đồng bộ tới tất cả TV...
                    </span>
                  )}
                  {syncStatus === 'synced' && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Đã đồng bộ tất cả TV
                    </span>
                  )}
                  <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                    <span>Tốc độ hiện tại:</span>
                    <span className="text-emerald-700 font-extrabold text-sm">{marqueeSpeed} giây</span>
                  </div>
                </div>
              </div>

              {/* Lựa chọn số giây nhanh */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="text-xs font-semibold text-slate-600 mr-1">Mức tốc độ:</span>
                {[
                  { sec: 90, label: '🐌 Rất Thong Thả (90s)' },
                  { sec: 60, label: '🌿 Chậm Rãi (60s - Khuyên dùng)' },
                  { sec: 45, label: '⏱️ Vừa Phải (45s)' },
                  { sec: 30, label: '⚡ Nhanh (30s)' },
                  { sec: 20, label: '🚀 Cực Nhanh (20s)' }
                ].map(({ sec, label }) => (
                  <button
                    key={sec}
                    onClick={() => handleSetMarqueeSpeed(sec, 0)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      marqueeSpeed === sec
                        ? 'bg-emerald-800 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Thanh trượt điều chỉnh mịn */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700 shrink-0">Kéo thanh trượt:</span>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={marqueeSpeed}
                  onChange={(e) => handleSetMarqueeSpeed(e.target.value, 200)}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">Tùy chỉnh:</span>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={marqueeSpeed}
                    onChange={(e) => handleSetMarqueeSpeed(e.target.value, 300)}
                    className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-center focus:border-emerald-600 outline-none bg-white"
                  />
                  <span className="text-xs text-slate-500 font-medium">giây</span>
                </div>
              </div>

              {/* Tùy chọn Nền Background */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-700 mr-1">Tông nền chiếu TV:</span>
                {[
                  { id: 'forest_kv', label: '🌿 Xanh Rừng & Hoa Cúc (Chuẩn Visual 20/11 - Khuyên Dùng)' },
                  { id: 'sage_mint', label: '🍃 Xanh Bạc Hà Dịu Mát (Mint Light)' },
                  { id: 'coffee_warm', label: '☕ Nâu Cà Phê Trầm Ấm (Classic Dark)' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => handleSetTheme(th.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      presentationTheme === th.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2">
                <span>💡</span>
                <span>
                  <b>Đồng bộ đa TV qua đám mây (Realtime):</b> Mọi thay đổi tốc độ hoặc màu nền tại đây sẽ tự động cập nhật ngay lập tức trên <b>TẤT CẢ các TV / màn hình chiếu</b> đang mở (kể cả TV ở thiết bị khác), và TV bật lên sau cũng tự nhận đúng cấu hình này!
                </span>
              </div>
            </div>

            {/* Mô phỏng trực quan Live Preview TV */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                    <Tv className="w-4 h-4 text-emerald-700" />
                    <span>Mô Phỏng Trực Quan Màn Hình TV (Live Preview)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hình ảnh xem trước thực tế với dãy thiệp cỡ lớn trôi ngang vô tận đúng visual 20/11
                  </p>
                </div>

                <button
                  onClick={() => onOpenLivePresentation ? onOpenLivePresentation(true) : window.open('/#present', '_blank')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition cursor-pointer self-start sm:self-auto"
                >
                  <span>Phóng to toàn màn hình chiếu</span>
                  <span>→</span>
                </button>
              </div>

              {/* Khung TV Preview */}
              <div 
                onClick={() => onOpenLivePresentation ? onOpenLivePresentation(false) : (window.location.hash = 'present')}
                className={`w-full aspect-[16/9] max-h-[520px] rounded-2xl overflow-hidden border-4 border-slate-900 shadow-2xl relative cursor-pointer group flex flex-col justify-between p-4 md:p-6 select-none ${
                  presentationTheme === 'forest_kv'
                    ? 'bg-gradient-to-br from-[#091c13] via-[#123824] to-[#07180f] text-white'
                    : presentationTheme === 'sage_mint'
                    ? 'bg-gradient-to-br from-[#cde7d0] via-[#e2f3e5] to-[#c5e2c9] text-slate-800'
                    : 'bg-gradient-to-br from-[#382417] via-[#563C2B] to-[#2c1b10] text-white'
                }`}
                title="Nhấn để mở màn hình chiếu toàn màn hình"
              >
                {/* Header Preview */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="bg-white px-2.5 py-1 rounded-xl shadow-xs flex items-center justify-center">
                      <img
                        src="/logo-btec.png"
                        alt="BTEC FPT"
                        className="h-6 w-auto object-contain shrink-0"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] font-bold text-[#F59E0B] tracking-[0.2em] uppercase">
                      ĐIỀU CHƯA KỊP NÓI • 20/11
                    </p>
                    <p className="text-sm md:text-lg font-extrabold tracking-tight">Những Lời Tri Ân</p>
                  </div>

                  {/* Logo Melbourne Polytechnic góc phải đối diện BTEC */}
                  <div className="flex items-center gap-2">
                    <div className="bg-white px-2.5 py-1 rounded-xl shadow-xs flex items-center justify-center">
                      <img
                        src="/logo-melbourne.png"
                        alt="Melbourne Polytechnic"
                        className="h-6 w-auto object-contain shrink-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Body Preview: Cuộn ngang mô phỏng */}
                <div className="flex-1 flex items-center justify-center py-2 overflow-hidden relative z-10 pause-on-hover">
                  {wishes.length === 0 ? (
                    <p className="text-white/40 text-xs text-center italic">
                      Chưa có lời chúc nào. Khi sinh viên gửi lời chúc trên trang web, thiệp sẽ tự động trôi vào màn hình tại đây.
                    </p>
                  ) : (
                    <div
                      className="animate-marquee-continuous flex items-center gap-4 shrink-0"
                      style={{ animationDuration: `${marqueeSpeed}s` }}
                    >
                      {[...(wishes.length < 4 ? [...wishes, ...wishes, ...wishes] : wishes), ...(wishes.length < 4 ? [...wishes, ...wishes, ...wishes] : wishes)].map((w, idx) => (
                        <div key={`${w.id}-${idx}`} className="w-[320px] aspect-[1024/571] shrink-0 rounded-xl overflow-hidden shadow-xl border border-white/15 pointer-events-none">
                          <ProjectorCardCanvas wish={w} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Preview */}
                <div className="flex items-center justify-end text-[10px] relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold px-2 py-0.5 rounded-lg bg-white/20 border border-white/20 shadow-xs">
                      {wishes.length} lời tri ân
                    </span>
                    <div className="p-1 rounded bg-white/20 text-white/80">
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs z-20">
                  <span className="px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-xl flex items-center gap-2">
                    <Play className="w-4 h-4 fill-slate-900" />
                    <span>Nhấn để Bật Màn Hình Trình Chiếu Này</span>
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PHÂN TÍCH LƯU LƯỢNG TRUY CẬP (ANALYTICS) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Banner giới thiệu phân tích */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-2">
                    <Activity className="w-3.5 h-3.5 text-teal-400" />
                    <span>Thống Kê Truy Cập Thời Gian Thực</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">
                    Trung Tâm Phân Tích Khách & Thiết Bị Truy Cập
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                    Đo lường số lượng sinh viên, thầy cô và khách mở trang web gửi lời chúc 20/11 qua Supabase Realtime Presence & Database Counter.
                  </p>
                </div>

                <button
                  onClick={loadVisitorStatsData}
                  disabled={isLoadingStats}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
                  <span>{isLoadingStats ? 'Đang cập nhật...' : 'Làm mới số liệu'}</span>
                </button>
              </div>

              {/* 3 chỉ số chuyên sâu */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-slate-400">Tần suất xem trang trung bình</p>
                  <p className="text-xl font-black text-teal-300">
                    {visitorStats.uniqueVisitors > 0
                      ? (visitorStats.totalVisits / visitorStats.uniqueVisitors).toFixed(1)
                      : '1.0'}{' '}
                    <span className="text-xs font-normal text-slate-400">lượt / người</span>
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Mỗi khách truy cập trung bình mở và tương tác web hơn 1 lần.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-slate-400">Tỉ lệ chuyển đổi gửi lời chúc</p>
                  <p className="text-xl font-black text-amber-300">
                    {visitorStats.uniqueVisitors > 0
                      ? `${Math.min(100, Math.round((wishes.length / visitorStats.uniqueVisitors) * 100))}%`
                      : '0%'}{' '}
                    <span className="text-xs font-normal text-slate-400">({wishes.length} thiệp)</span>
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tỉ lệ số người truy cập hoàn tất viết và gửi thiệp tri ân.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <p className="text-slate-400">Thiết bị phổ biến nhất</p>
                  <div className="text-xl font-black text-indigo-300 flex items-center gap-1.5">
                    {visitorStats.mobileVisits >= visitorStats.desktopVisits ? (
                      <>
                        <Smartphone className="w-5 h-5 text-emerald-400" />
                        <span>Điện thoại ({visitorStats.totalVisits > 0 ? Math.round((visitorStats.mobileVisits / visitorStats.totalVisits) * 100) : 0}%)</span>
                      </>
                    ) : (
                      <>
                        <Monitor className="w-5 h-5 text-indigo-400" />
                        <span>Máy tính ({visitorStats.totalVisits > 0 ? Math.round((visitorStats.desktopVisits / visitorStats.totalVisits) * 100) : 0}%)</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Thiết bị chính sinh viên dùng để quét QR và gửi lời chúc.
                  </p>
                </div>
              </div>
            </div>

            {/* Phân bổ Thiết bị & Trạng thái Realtime */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Cột trái: Phân bổ thiết bị */}
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <span>Cơ Cấu Thiết Bị Truy Cập</span>
                  </h3>
                  <span className="text-xs text-slate-400">Tổng: {visitorStats.totalVisits} lượt</span>
                </div>

                {/* Thanh tiến trình phân bổ thiết bị */}
                {(() => {
                  const total = Math.max(1, visitorStats.totalVisits);
                  const mobilePct = Math.round((visitorStats.mobileVisits / total) * 100);
                  const desktopPct = 100 - mobilePct;
                  return (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Điện thoại (Mobile): {mobilePct}%</span>
                          </span>
                          <span className="text-indigo-700 flex items-center gap-1">
                            <Monitor className="w-3.5 h-3.5" />
                            <span>Máy tính (Desktop): {desktopPct}%</span>
                          </span>
                        </div>
                        <div className="w-full h-3.5 rounded-full overflow-hidden bg-slate-100 flex p-0.5 border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-l-full transition-all duration-500"
                            style={{ width: `${mobilePct}%` }}
                          />
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-r-full transition-all duration-500"
                            style={{ width: `${desktopPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                          <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-emerald-600" />
                            <span>Lượt từ Điện thoại</span>
                          </p>
                          <p className="text-xl font-black text-emerald-900 mt-1">{visitorStats.mobileVisits}</p>
                          <p className="text-[11px] text-emerald-700/80 mt-0.5">Quét mã QR từ điện thoại di động</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                          <p className="text-xs text-indigo-800 font-semibold flex items-center gap-1.5">
                            <Monitor className="w-4 h-4 text-indigo-600" />
                            <span>Lượt từ Máy tính / TV</span>
                          </p>
                          <p className="text-xl font-black text-indigo-900 mt-1">{visitorStats.desktopVisits}</p>
                          <p className="text-[11px] text-indigo-700/80 mt-0.5">Laptop, PC và màn hình chiếu TV</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Cột phải: Hướng dẫn & mẹo theo dõi */}
              <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2 pb-3 border-b border-slate-100">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>Cách Hoạt Động & Cơ Chế Đếm</span>
                </h3>

                <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>
                      <b>Đang trực tuyến:</b> Đo lường qua kết nối thời gian thực WebSocket (Presence). Khi sinh viên mở tab web thì số đếm tăng, khi đóng tab số đếm tự giảm.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>
                      <b>Người truy cập (Unique):</b> Phân biệt từng thiết bị qua mã ẩn danh riêng biệt trong trình duyệt, giúp BTC nắm chính xác có bao nhiêu người thực tế đã ghé thăm.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>
                      <b>Chống đếm ảo (Anti-spam):</b> Tự động lọc các thao tác F5 liên tục trong thời gian ngắn để số liệu luôn chính xác và trung thực.
                    </span>
                  </li>
                </ul>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  💡 <b>Mẹo sự kiện:</b> Trong giờ cao điểm buổi lễ 20/11, bạn có thể bấm <b>Cập nhật số liệu</b> bất kỳ lúc nào hoặc để nguyên trang web tự động làm mới mỗi 30 giây!
                </div>
              </div>

            </div>

            {/* Bảng lịch sử 15 lượt truy cập gần nhất */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Lịch Sử 15 Lượt Truy Cập Gần Nhất</span>
                </h3>
                <span className="text-xs text-slate-400">Tự động cập nhật</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 pl-5">Thiết Bị</th>
                      <th className="p-3">Phân Loại Khách</th>
                      <th className="p-3">Mục Đang Xem</th>
                      <th className="p-3 pr-5 text-right">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visitorStats.recentVisits.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400 italic">
                          Chưa có lượt truy cập mới nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      visitorStats.recentVisits.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 pl-5 font-semibold text-slate-800 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5">
                              {v.device === 'mobile' ? (
                                <>
                                  <Smartphone className="w-4 h-4 text-emerald-600" />
                                  <span>Điện thoại (Mobile)</span>
                                </>
                              ) : (
                                <>
                                  <Monitor className="w-4 h-4 text-indigo-600" />
                                  <span>Máy tính (Desktop)</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                v.isUnique
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {v.isUnique ? '🌟 Khách mới' : '🔄 Khách quay lại'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-500">
                            {v.path === '#present'
                              ? '📽️ Trình chiếu TV (#present)'
                              : v.path === '#admin'
                              ? '🛡️ Trang quản trị (#admin)'
                              : v.path === '#feed'
                              ? '💌 Danh sách thiệp (#feed)'
                              : '📝 Trang gửi lời chúc (/)'}
                          </td>
                          <td className="p-3 pr-5 text-right text-slate-400 whitespace-nowrap">
                            {new Date(v.createdAt).toLocaleTimeString('vi-VN')} •{' '}
                            {new Date(v.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer nhỏ */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200">
        Hệ thống quản trị & kiểm duyệt nội dung 20/11 • BTEC FPT
      </footer>

      {/* Modal xác nhận xóa bài viết */}
      {wishToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Xác Nhận Xóa Lời Chúc</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn lời chúc gửi tới{' '}
              <b>"{wishToDelete.teacher_name}"</b>? Hành động này sẽ gỡ bài viết khỏi Supabase và người xem trên web sẽ không còn thấy nữa.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs italic text-slate-700 line-clamp-3">
              "{wishToDelete.message}"
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setWishToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDeleteWish}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Xác Nhận Xóa Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem bưu thiếp */}
      {selectedWishForModal && (
        <CardModal
          wish={selectedWishForModal}
          onClose={() => setSelectedWishForModal(null)}
        />
      )}

    </div>
  );
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('YOUR_SUPABASE') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage Fallback Keys
const LOCAL_STORAGE_WISHES_KEY = '20_11_wishes_backup';
const LOCAL_STORAGE_MODERATORS_KEY = '20_11_moderators_backup';

const DEFAULT_SAMPLE_WISHES = [
  {
    id: 'sample-1',
    teacher_name: 'thầy Nguyễn Văn An',
    sender_name: 'Nguyễn Minh Tuấn (Lớp IT01)',
    is_anonymous: false,
    message: 'Nhân ngày 20/11, em xin kính chúc thầy luôn dồi dào sức khỏe, tràn đầy nhiệt huyết để tiếp tục dìu dắt bao thế hệ sinh viên cập bến tri thức. Cảm ơn thầy vì những bài giảng bổ ích và sự tận tụy khôn nguôi!',
    frame_style: 'luxury_cream',
    likes: 12,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'sample-2',
    teacher_name: 'cô Trần Thị Mai Phương',
    sender_name: 'Ẩn danh',
    is_anonymous: true,
    message: 'Kính chúc cô một ngày Nhà giáo Việt Nam thật nhiều niềm vui và hạnh phúc bên gia đình và học trò. Nụ cười và sự ân cần của cô là nguồn động lực rất lớn cho chúng em mỗi khi đến lớp!',
    frame_style: 'collegiate_navy',
    likes: 24,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const DEFAULT_MODERATORS = [
  {
    id: 'mod-1',
    name: 'Ban Kiểm Duyệt IT BTEC',
    pin_code: '8899',
    role: 'moderator',
    created_at: new Date().toISOString()
  }
];

export function normalizeTeacherPrefix(name) {
  if (!name || typeof name !== 'string') return name;
  let trimmed = name.trim();
  trimmed = trimmed
    .replace(/^thầy\/cô/i, 'thầy/cô')
    .replace(/^thầy\s+/i, 'thầy ')
    .replace(/^cô\s+/i, 'cô ')
    .replace(/^quý\s+thầy\s+cô/i, 'quý thầy cô');
  return trimmed;
}

function getLocalWishes() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_WISHES_KEY, JSON.stringify(DEFAULT_SAMPLE_WISHES));
      return DEFAULT_SAMPLE_WISHES;
    }
    const parsed = JSON.parse(data);
    return parsed.map((w) => ({
      ...w,
      teacher_name: normalizeTeacherPrefix(w.teacher_name)
    }));
  } catch (e) {
    return DEFAULT_SAMPLE_WISHES;
  }
}

function saveLocalWishes(wishes) {
  try {
    localStorage.setItem(LOCAL_STORAGE_WISHES_KEY, JSON.stringify(wishes));
  } catch (e) {}
}

function getLocalModerators() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_MODERATORS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_MODERATORS_KEY, JSON.stringify(DEFAULT_MODERATORS));
      return DEFAULT_MODERATORS;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_MODERATORS;
  }
}

function saveLocalModerators(mods) {
  try {
    localStorage.setItem(LOCAL_STORAGE_MODERATORS_KEY, JSON.stringify(mods));
  } catch (e) {}
}

/**
 * Lấy danh sách lời chúc
 */
export async function getWishes() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const normalizedData = (data || []).map((w) => ({
        ...w,
        teacher_name: normalizeTeacherPrefix(w.teacher_name)
      }));
      return { data: normalizedData, source: 'supabase' };
    } catch (err) {
      console.warn('Lỗi kết nối Supabase, chuyển local:', err);
      return { data: getLocalWishes(), source: 'local' };
    }
  }

  return { data: getLocalWishes(), source: 'local' };
}

/**
 * Thêm lời chúc mới
 */
export async function addWish(wishData) {
  const newWish = {
    teacher_name: normalizeTeacherPrefix(wishData.teacher_name ? wishData.teacher_name.trim() : ''),
    sender_name: wishData.is_anonymous ? 'Một sinh viên BTEC FPT' : (wishData.sender_name.trim() || 'Một sinh viên BTEC FPT'),
    is_anonymous: Boolean(wishData.is_anonymous),
    message: wishData.message.trim(),
    frame_style: wishData.frame_style || 'luxury_cream',
    custom_frame_url: wishData.custom_frame_url || null,
    likes: 0,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .insert([newWish])
        .select()
        .single();

      if (error) throw error;
      return { data, success: true, source: 'supabase' };
    } catch (err) {
      console.error('Lỗi khi gửi lên Supabase:', err);
      const local = getLocalWishes();
      const localItem = { ...newWish, id: 'local-' + Date.now() };
      saveLocalWishes([localItem, ...local]);
      return { data: localItem, success: true, source: 'local' };
    }
  }

  const local = getLocalWishes();
  const localItem = { ...newWish, id: 'local-' + Date.now() };
  saveLocalWishes([localItem, ...local]);
  return { data: localItem, success: true, source: 'local' };
}

/**
 * Xóa một lời chúc không phù hợp (Admin & Moderator)
 */
export async function deleteWish(wishId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', wishId);

      if (error) throw error;
    } catch (err) {
      console.warn('Lỗi Supabase khi xóa lời chúc:', err);
    }
  }

  // Luôn cập nhật đồng bộ cả localStorage
  const local = getLocalWishes().filter((item) => item.id !== wishId);
  saveLocalWishes(local);
  return { success: true };
}

/**
 * Thả tim
 */
export async function toggleLike(id, currentLikes = 0) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .update({ likes: currentLikes + 1 })
        .eq('id', id)
        .select()
        .single();

      if (!error) return { data, success: true };
    } catch (err) {}
  }

  const local = getLocalWishes();
  const updated = local.map((item) =>
    item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item
  );
  saveLocalWishes(updated);
  return { success: true };
}

/**
 * QUẢN LÝ NGƯỜI KIỂM DUYỆT (MODERATORS)
 */
export async function getModerators() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('moderators')
        .select('*')
        .eq('role', 'moderator')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { data: data.filter((m) => m.role === 'moderator'), source: 'supabase' };
      }
    } catch (err) {}
  }

  return {
    data: getLocalModerators().filter((m) => m.role === 'moderator'),
    source: 'local'
  };
}

export async function addModerator(name, pin_code, role = 'moderator') {
  const newMod = {
    name: name.trim(),
    pin_code: pin_code.trim(),
    role: role,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('moderators')
        .insert([newMod])
        .select()
        .single();

      if (!error && data) {
        return { data, success: true };
      }
    } catch (err) {}
  }

  const local = getLocalModerators();
  const localItem = { ...newMod, id: 'mod-' + Date.now() };
  saveLocalModerators([localItem, ...local]);
  return { data: localItem, success: true };
}

export async function deleteModerator(modId) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('moderators').delete().eq('id', modId);
    } catch (err) {}
  }

  const local = getLocalModerators().filter((m) => m.id !== modId);
  saveLocalModerators(local);
  return { success: true };
}

/**
 * ĐỒNG BỘ CẤU HÌNH TRÌNH CHIẾU TV (TỐC ĐỘ CUỘN & MÀU NỀN) REALTIME ĐA THIẾT BỊ
 * - Lưu bền vững trên Supabase để mọi TV bật sau hoặc F5 đều tự động nhận đúng cấu hình của Admin
 * - Phát sóng tức thì qua Supabase Realtime Broadcast tới tất cả các TV đang mở (<200ms)
 * - Đồng bộ kèm localStorage cho các tab cùng trình duyệt / ngoại tuyến
 */
const TV_CONFIG_ROLE = 'tv_config';
const TV_CONFIG_NAME = '__tv_presentation_config__';
const TV_BROADCAST_CHANNEL = 'btec_tv_presentation_sync';
const LS_SPEED_KEY = 'btec_presentation_marquee_speed';
const LS_THEME_KEY = 'btec_presentation_theme';
const ALLOWED_THEMES = ['forest_kv', 'sage_mint', 'coffee_warm'];

export const DEFAULT_PRESENTATION_SETTINGS = {
  marqueeSpeed: 60,
  theme: 'forest_kv'
};

export function normalizePresentationSettings(raw = {}) {
  const parsedSpeed = parseInt(raw.marqueeSpeed, 10);
  const marqueeSpeed =
    Number.isFinite(parsedSpeed) && parsedSpeed >= 10 && parsedSpeed <= 180
      ? parsedSpeed
      : DEFAULT_PRESENTATION_SETTINGS.marqueeSpeed;
  const theme = ALLOWED_THEMES.includes(raw.theme)
    ? raw.theme
    : DEFAULT_PRESENTATION_SETTINGS.theme;
  return { marqueeSpeed, theme };
}

export function getLocalPresentationSettings() {
  try {
    return normalizePresentationSettings({
      marqueeSpeed: localStorage.getItem(LS_SPEED_KEY),
      theme: localStorage.getItem(LS_THEME_KEY)
    });
  } catch {
    return { ...DEFAULT_PRESENTATION_SETTINGS };
  }
}

function saveLocalPresentationSettings(settings) {
  try {
    const clean = normalizePresentationSettings(settings);
    localStorage.setItem(LS_SPEED_KEY, String(clean.marqueeSpeed));
    localStorage.setItem(LS_THEME_KEY, clean.theme);
    window.dispatchEvent(new Event('storage'));
  } catch {}
}

let sharedBroadcastChannel = null;
let sharedBroadcastReady = null;
const broadcastListeners = new Set();

function ensureBroadcastChannel() {
  if (!isSupabaseConfigured || !supabase) return Promise.resolve(null);
  if (sharedBroadcastChannel && sharedBroadcastReady) {
    return sharedBroadcastReady;
  }

  sharedBroadcastChannel = supabase
    .channel(TV_BROADCAST_CHANNEL, {
      config: { broadcast: { self: false } }
    })
    .on('broadcast', { event: 'settings_update' }, (msg) => {
      if (msg?.payload) {
        broadcastListeners.forEach((listener) => {
          try {
            listener(msg.payload);
          } catch {}
        });
      }
    });

  sharedBroadcastReady = new Promise((resolve) => {
    let settled = false;
    const finish = (ch) => {
      if (!settled) {
        settled = true;
        resolve(ch);
      }
    };
    sharedBroadcastChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        finish(sharedBroadcastChannel);
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        sharedBroadcastChannel = null;
        sharedBroadcastReady = null;
        finish(null);
      }
    });
    setTimeout(() => finish(sharedBroadcastChannel), 3000);
  });

  return sharedBroadcastReady;
}

/**
 * Lấy cấu hình trình chiếu TV mới nhất từ Supabase (fallback localStorage)
 */
export async function getPresentationSettings() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('moderators')
        .select('id, pin_code, created_at')
        .eq('role', TV_CONFIG_ROLE)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const parsed = JSON.parse(data[0].pin_code || '{}');
        const clean = normalizePresentationSettings(parsed);
        try {
          localStorage.setItem(LS_SPEED_KEY, String(clean.marqueeSpeed));
          localStorage.setItem(LS_THEME_KEY, clean.theme);
        } catch {}
        return { data: clean, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Không đọc được cấu hình TV từ Supabase, dùng local:', err);
    }
  }

  return { data: getLocalPresentationSettings(), source: 'local' };
}

/**
 * Lưu cấu hình trình chiếu TV lên Supabase và phát sóng Realtime tới TẤT CẢ các TV đang bật
 */
export async function savePresentationSettings(nextSettings) {
  const clean = normalizePresentationSettings(nextSettings);
  const payload = {
    ...clean,
    updatedAt: Date.now()
  };

  // 1. Lưu ngay vào localStorage cho các tab cùng máy
  saveLocalPresentationSettings(clean);

  if (!isSupabaseConfigured || !supabase) {
    return { data: clean, success: true, source: 'local' };
  }

  // 2. Phát sóng Realtime Broadcast tức thì tới mọi TV đang bật
  try {
    const ch = await ensureBroadcastChannel();
    if (ch) {
      await ch.send({
        type: 'broadcast',
        event: 'settings_update',
        payload
      });
    }
  } catch (err) {
    console.warn('Lỗi gửi Realtime Broadcast cấu hình TV:', err);
  }

  // 3. Lưu bền vững vào Supabase (INSERT bản mới rồi xóa bản cũ để không bị gián đoạn)
  try {
    const { data: inserted, error: insertError } = await supabase
      .from('moderators')
      .insert([
        {
          name: TV_CONFIG_NAME,
          pin_code: JSON.stringify(payload),
          role: TV_CONFIG_ROLE,
          created_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single();

    if (insertError) throw insertError;

    if (inserted?.id) {
      await supabase
        .from('moderators')
        .delete()
        .eq('role', TV_CONFIG_ROLE)
        .neq('id', inserted.id);
    }

    return { data: clean, success: true, source: 'supabase' };
  } catch (err) {
    console.warn('Lỗi lưu cấu hình TV lên Supabase:', err);
    return { data: clean, success: false, source: 'local' };
  }
}

/**
 * Lắng nghe đồng bộ cấu hình trình chiếu TV theo thời gian thực (Broadcast + Storage + Tự kiểm tra dự phòng)
 */
export function subscribePresentationSettings(onUpdate) {
  let active = true;
  let lastUpdatedAt = 0;

  const emit = (raw, updatedAt = 0) => {
    if (!active) return;
    if (updatedAt && updatedAt < lastUpdatedAt) return;
    if (updatedAt) lastUpdatedAt = updatedAt;
    const clean = normalizePresentationSettings(raw);
    try {
      localStorage.setItem(LS_SPEED_KEY, String(clean.marqueeSpeed));
      localStorage.setItem(LS_THEME_KEY, clean.theme);
    } catch {}
    onUpdate(clean);
  };

  // 1. Nghe thay đổi giữa các tab cùng trình duyệt
  const handleStorage = (e) => {
    if (!e || !e.key || e.key === LS_SPEED_KEY || e.key === LS_THEME_KEY) {
      emit(getLocalPresentationSettings());
    }
  };
  window.addEventListener('storage', handleStorage);

  // 2. Đăng ký nhận Supabase Realtime Broadcast qua kênh dùng chung
  const handleBroadcast = (payload) => {
    emit(payload, payload.updatedAt || Date.now());
  };
  if (isSupabaseConfigured && supabase) {
    broadcastListeners.add(handleBroadcast);
    ensureBroadcastChannel();
  }

  // 3. Tự động kiểm tra lại từ DB mỗi 15 giây (dự phòng trường hợp Smart TV bị ngủ WebSocket)
  const pollTimer = setInterval(async () => {
    if (!active || !isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('moderators')
        .select('pin_code')
        .eq('role', TV_CONFIG_ROLE)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const parsed = JSON.parse(data[0].pin_code || '{}');
        emit(parsed, parsed.updatedAt || 0);
      }
    } catch {}
  }, 15000);

  return () => {
    active = false;
    window.removeEventListener('storage', handleStorage);
    clearInterval(pollTimer);
    broadcastListeners.delete(handleBroadcast);
  };
}

/**
 * ============================================================================
 * THEO DÕI VÀ THỐNG KÊ LƯỢT TRUY CẬP TRANG WEB (SITE VISITS & REALTIME ONLINE)
 * ============================================================================
 */
const SITE_VISIT_ROLE = 'site_visit';

/**
 * Ghi nhận lượt truy cập trang web (hỗ trợ phân biệt Khách mới vs Khách quay lại, Mobile vs Desktop)
 */
export async function recordSiteVisit() {
  if (typeof window === 'undefined') return { success: false };

  try {
    // 1. Sinh hoặc lấy Visitor ID duy nhất từ localStorage
    let visitorId = localStorage.getItem('btec_visitor_id');
    let isNewUnique = false;
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
      localStorage.setItem('btec_visitor_id', visitorId);
      isNewUnique = true;
    }

    // 2. Kiểm tra session để tránh ghi nhận liên tục khi người dùng F5 nhanh trong 30 giây
    const lastVisitTime = parseInt(sessionStorage.getItem('btec_last_session_visit') || '0', 10);
    const now = Date.now();
    if (lastVisitTime && now - lastVisitTime < 30000) {
      return { success: true, throttled: true };
    }
    sessionStorage.setItem('btec_last_session_visit', String(now));

    // 3. Nhận diện thiết bị (Mobile vs Desktop) và đường dẫn truy cập
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    const path = window.location.hash || '/';

    const visitData = {
      device: isMobile ? 'mobile' : 'desktop',
      isUnique: isNewUnique,
      path: path.slice(0, 50)
    };

    // 4. Lưu cục bộ dự phòng vào localStorage
    try {
      const localTotal = parseInt(localStorage.getItem('btec_local_total_visits') || '0', 10) + 1;
      localStorage.setItem('btec_local_total_visits', String(localTotal));
      if (isNewUnique) {
        const localUnique = parseInt(localStorage.getItem('btec_local_unique_visitors') || '0', 10) + 1;
        localStorage.setItem('btec_local_unique_visitors', String(localUnique));
      }
    } catch {}

    // 5. Gửi lên Supabase
    if (isSupabaseConfigured && supabase) {
      await supabase.from('moderators').insert([
        {
          name: visitorId,
          pin_code: JSON.stringify(visitData),
          role: SITE_VISIT_ROLE,
          created_at: new Date().toISOString()
        }
      ]);
    }

    return { success: true };
  } catch (err) {
    console.warn('Lỗi ghi nhận lượt truy cập:', err);
    return { success: false };
  }
}

/**
 * Lấy số liệu thống kê truy cập đầy đủ cho trang Admin:
 * - Tổng lượt truy cập (Total Visits)
 * - Số người truy cập duy nhất (Unique Visitors)
 * - Lượt truy cập hôm nay (Today Visits)
 * - Phân bổ thiết bị: Mobile vs Desktop
 * - Lịch sử các lượt truy cập gần nhất
 */
export async function getVisitorStats() {
  const fallback = {
    totalVisits: parseInt(localStorage.getItem('btec_local_total_visits') || '1', 10),
    uniqueVisitors: parseInt(localStorage.getItem('btec_local_unique_visitors') || '1', 10),
    todayVisits: 1,
    mobileVisits: 0,
    desktopVisits: 1,
    recentVisits: []
  };

  if (!isSupabaseConfigured || !supabase) {
    return { data: fallback, source: 'local' };
  }

  try {
    // 1. Tổng lượt truy cập (chỉ lấy count để tối ưu tốc độ mạng)
    const { count: totalVisits } = await supabase
      .from('moderators')
      .select('id', { count: 'exact', head: true })
      .eq('role', SITE_VISIT_ROLE);

    // 2. Số người truy cập duy nhất
    const { count: uniqueVisitors } = await supabase
      .from('moderators')
      .select('id', { count: 'exact', head: true })
      .eq('role', SITE_VISIT_ROLE)
      .like('pin_code', '%"isUnique":true%');

    // 3. Lượt truy cập trong ngày hôm nay
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const { count: todayVisits } = await supabase
      .from('moderators')
      .select('id', { count: 'exact', head: true })
      .eq('role', SITE_VISIT_ROLE)
      .gte('created_at', startOfToday.toISOString());

    // 4. Lượt truy cập qua Mobile
    const { count: mobileVisits } = await supabase
      .from('moderators')
      .select('id', { count: 'exact', head: true })
      .eq('role', SITE_VISIT_ROLE)
      .like('pin_code', '%"device":"mobile"%');

    // 5. 15 lượt truy cập gần nhất để xem chi tiết
    const { data: recentRows } = await supabase
      .from('moderators')
      .select('id, name, pin_code, created_at')
      .eq('role', SITE_VISIT_ROLE)
      .order('created_at', { ascending: false })
      .limit(15);

    const safeTotal = Math.max(0, totalVisits || 0);
    const safeUnique = Math.max(safeTotal > 0 ? 1 : 0, uniqueVisitors || 0);
    const safeMobile = Math.min(safeTotal, mobileVisits || 0);
    const safeDesktop = Math.max(0, safeTotal - safeMobile);

    const recentVisits = (recentRows || []).map((r) => {
      let meta = {};
      try {
        meta = JSON.parse(r.pin_code || '{}');
      } catch {}
      return {
        id: r.id,
        visitorId: r.name,
        device: meta.device || 'desktop',
        isUnique: Boolean(meta.isUnique),
        path: meta.path || '/',
        createdAt: r.created_at
      };
    });

    return {
      data: {
        totalVisits: safeTotal,
        uniqueVisitors: safeUnique,
        todayVisits: todayVisits || 0,
        mobileVisits: safeMobile,
        desktopVisits: safeDesktop,
        recentVisits
      },
      source: 'supabase'
    };
  } catch (err) {
    console.warn('Lỗi đọc thống kê truy cập Supabase:', err);
    return { data: fallback, source: 'local' };
  }
}

/**
 * Đếm số người đang online thời gian thực qua Supabase Realtime Presence
 */
export function subscribeOnlinePresence(onCountChange) {
  if (typeof window === 'undefined') return () => {};

  if (!isSupabaseConfigured || !supabase) {
    onCountChange(1);
    return () => {};
  }

  const visitorKey =
    localStorage.getItem('btec_visitor_id') ||
    `guest_${Math.random().toString(36).slice(2, 8)}`;

  const channel = supabase.channel('btec_online_presence', {
    config: {
      presence: { key: visitorKey }
    }
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      onCountChange(Math.max(1, count));
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          window.innerWidth < 768;
        try {
          await channel.track({
            device: isMobile ? 'mobile' : 'desktop',
            path: window.location.hash || '/',
            onlineAt: new Date().toISOString()
          });
        } catch {}
      }
    });

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch {}
  };
}

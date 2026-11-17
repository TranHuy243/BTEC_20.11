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
        .order('created_at', { ascending: false });

      if (!error && data) {
        return { data, source: 'supabase' };
      }
    } catch (err) {}
  }

  return { data: getLocalModerators(), source: 'local' };
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

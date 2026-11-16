-- ==============================================================================
-- SCRIPT CẬP NHẬT CƠ SỞ DỮ LIỆU SUPABASE: HỆ THỐNG KIỂM DUYỆT & BẢNG MODERATORS
-- ==============================================================================

-- 1. Bổ sung quyền XÓA cho bảng wishes (Dành cho Admin & Người kiểm duyệt)
drop policy if exists "Cho phép xóa lời chúc" on public.wishes;
create policy "Cho phép xóa lời chúc"
on public.wishes for delete
using (true);

-- 2. Tạo bảng lưu trữ danh sách Người kiểm duyệt (moderators)
create table if not exists public.moderators (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  pin_code text not null,
  role text default 'moderator',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bật Row Level Security (RLS) cho bảng moderators
alter table public.moderators enable row level security;

-- 4. Chính sách SELECT, INSERT, DELETE cho bảng moderators
drop policy if exists "Cho phép đọc danh sách kiểm duyệt viên" on public.moderators;
create policy "Cho phép đọc danh sách kiểm duyệt viên"
on public.moderators for select
using (true);

drop policy if exists "Cho phép thêm kiểm duyệt viên" on public.moderators;
create policy "Cho phép thêm kiểm duyệt viên"
on public.moderators for insert
with check (true);

drop policy if exists "Cho phép xóa kiểm duyệt viên" on public.moderators;
create policy "Cho phép xóa kiểm duyệt viên"
on public.moderators for delete
using (true);

import React, { useState } from 'react';
import { X, Copy, Check, Database, Key, Shield, Terminal, ExternalLink } from 'lucide-react';

const SQL_SCHEMA = `-- 1. Tạo bảng lưu trữ lời chúc 20/11
create table if not exists wishes (
  id uuid default gen_random_uuid() primary key,
  teacher_name text not null,
  sender_name text not null,
  is_anonymous boolean default false,
  message text not null,
  frame_style text default 'lotus',
  custom_frame_url text,
  likes int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bật tính năng Row Level Security (RLS) để bảo vệ bảng
alter table wishes enable row level security;

-- 3. Tạo chính sách: Cho phép tất cả mọi người đọc danh sách lời chúc
create policy "Mọi người đều có thể đọc lời chúc"
on wishes for select
using (true);

-- 4. Tạo chính sách: Cho phép tất cả mọi người gửi lời chúc mới
create policy "Mọi người đều có thể gửi lời chúc"
on wishes for insert
with check (true);

-- 5. Tạo chính sách: Cho phép người dùng thả tim (update cột likes)
create policy "Mọi người đều có thể cập nhật lượt like"
on wishes for update
using (true);
`;

export default function SupabaseGuideModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Hướng Dẫn Cài Đặt Supabase Từ A Đến Z
              </h3>
              <p className="text-xs text-gray-500">
                Lưu trữ lời chúc trực tuyến miễn phí và nhanh chóng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          
          {/* Bước 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Tạo tài khoản và Dự án mới trên Supabase
            </h4>
            <p className="text-xs text-gray-600 pl-8">
              Truy cập trang chủ{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 font-semibold underline inline-flex items-center gap-1"
              >
                supabase.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              và đăng nhập (bằng tài khoản GitHub hoặc Google). Nhấn <b>New Project</b>, đặt tên dự án (VD: <code>20-11-wishes</code>) và chọn khu vực (Region: Singapore).
            </p>
          </div>

          {/* Bước 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                Tạo Bảng dữ liệu trong SQL Editor
              </h4>
              <button
                onClick={copySql}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép SQL!' : 'Sao chép mã SQL'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-600 pl-8">
              Vào mục <b>SQL Editor</b> trong thanh bên trái của Supabase Dashboard, tạo <b>New Query</b>, dán đoạn code sau vào và nhấn <b>RUN</b>:
            </p>
            <div className="pl-8">
              <pre className="bg-gray-900 text-gray-100 p-3.5 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed border border-gray-800">
                {SQL_SCHEMA}
              </pre>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                3
              </span>
              Lấy API URL và Anon Key
            </h4>
            <div className="text-xs text-gray-600 pl-8 space-y-1">
              <p>1. Trong Supabase Dashboard, vào <b>Project Settings</b> (biểu tượng bánh răng ở góc dưới bên trái).</p>
              <p>2. Chọn mục <b>API</b>.</p>
              <p>3. Tìm 2 giá trị: <b>Project URL</b> và <b>Project API keys (anon public)</b>.</p>
            </div>
          </div>

          {/* Bước 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                4
              </span>
              Tạo file .env trong thư mục dự án
            </h4>
            <div className="text-xs text-gray-600 pl-8 space-y-2">
              <p>Tạo một tệp tin tên <code>.env</code> ở thư mục gốc của dự án này và dán nội dung sau vào:</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
              <p className="text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                💡 Sau khi lưu file <code>.env</code>, chỉ cần khởi động lại <code>npm run dev</code> là web sẽ tự động kết nối Supabase và lưu trữ dữ liệu trực tiếp!
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition"
          >
            Đã hiểu, đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}

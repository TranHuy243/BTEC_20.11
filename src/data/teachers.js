/**
 * Danh sách giảng viên & cán bộ BTEC FPT chính thức
 */
export const TEACHERS_LIST = [
  'thầy Nguyễn Sĩ Thìn',
  'thầy Đỗ Trung Anh',
  'thầy Võ Đức Hoàng',
  'thầy Võ Thế Long',
  'cô Phạm Trần Hồng Diễm',
  'cô Đỗ Thuỳ Như',
  'thầy Bùi Thị Minh Trí',
  'cô Lê Hồ Hằng Nguyên',
  'cô Lê Nguyễn Đông Trang',
  'cô Mai Thị Kiều Liên',
  'cô Lê Thị Hoá',
  'cô Trần Đình Nga',
  'thầy Trương Đăng Hiếu',
  'thầy Phan Cường',
  'cô Trần Thị Mỹ Quỳnh',
  'cô Hồ Thị Kim Huệ',
  'thầy Ian Michael Biggar',
  'thầy Joseph Wallace Wisham III',
  'thầy Trần Lê Anh Minh',
  'cô Nguyễn Thị Tỉnh',
  'cô Lê Thị Hồng Hoa',
  'thầy Đoàn Kim Hóa',
  'cô Nguyễn Thị Anh Sen',
  'cô Nguyễn Thị Huỳnh Như',
  'cô Hồ Thị Mỹ Nhung',
  'thầy Hồ Vân Khanh',
  'cô Ngô Thị Huệ',
  'cô Nguyễn Thị Như Thảo',
  'thầy Nguyễn Hoàng Bảo Long',
  'cô Nguyễn Thị Hồng Nhung',
  'cô Lê Thị Hồng Ngọc',
  'cô Phạm Thị Thanh Hằng',
  'thầy Nguyễn Trần Bảo Quân',
  'thầy Trần Đức Hùng',
  'cô Trần Băng Huyền'
];

/**
 * Hàm loại bỏ dấu tiếng Việt để tìm kiếm thông minh không phân biệt có dấu / không dấu
 */
export function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Tìm kiếm gợi ý Thầy/Cô theo từ khóa nhập vào
 */
export function searchTeachers(query) {
  if (!query || !query.trim()) return [];
  const cleanQuery = removeVietnameseTones(query.trim());

  return TEACHERS_LIST.filter((teacher) => {
    const cleanTeacher = removeVietnameseTones(teacher);
    return cleanTeacher.includes(cleanQuery);
  });
}

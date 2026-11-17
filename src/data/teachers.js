/**
 * Danh sách giảng viên & cán bộ BTEC FPT chính thức
 */
export const TEACHERS_LIST = [
  'Thầy Nguyễn Sĩ Thìn',
  'Thầy Đỗ Trung Anh',
  'Thầy Võ Đức Hoàng',
  'Thầy Võ Thế Long',
  'Cô Phạm Trần Hồng Diễm',
  'Cô Đỗ Thuỳ Như',
  'Thầy Bùi Thị Minh Trí',
  'Cô Lê Hồ Hằng Nguyên',
  'Cô Lê Nguyễn Đông Trang',
  'Cô Mai Thị Kiều Liên',
  'Cô Lê Thị Hoá',
  'Cô Trần Đình Nga',
  'Thầy Trương Đăng Hiếu',
  'Thầy Phan Cường',
  'Cô Trần Thị Mỹ Quỳnh',
  'Cô Hồ Thị Kim Huệ',
  'Thầy Ian Michael Biggar',
  'Thầy Joseph Wallace Wisham III',
  'Thầy Trần Lê Anh Minh',
  'Cô Nguyễn Thị Tỉnh',
  'Cô Lê Thị Hồng Hoa',
  'Thầy Đoàn Kim Hóa',
  'Cô Nguyễn Thị Anh Sen',
  'Cô Nguyễn Thị Huỳnh Như',
  'Cô Hồ Thị Mỹ Nhung',
  'Thầy Hồ Vân Khanh',
  'Cô Ngô Thị Huệ',
  'Cô Nguyễn Thị Như Thảo',
  'Thầy Nguyễn Hoàng Bảo Long',
  'Cô Nguyễn Thị Hồng Nhung',
  'Cô Lê Thị Hồng Ngọc',
  'Cô Phạm Thị Thanh Hằng',
  'Thầy Nguyễn Trần Bảo Quân'
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

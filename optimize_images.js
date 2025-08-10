// 이미지 최적화 스크립트
// 실제 운영에서는 ImageMagick, Sharp 등의 도구를 사용하여 최적화를 수행합니다.
// 현재는 가이드라인으로 제공됩니다.

console.log('이미지 최적화 가이드라인:');
console.log('1. person_icon.png (285KB) -> 36x36 크기로 리사이즈 필요');
console.log('2. cck_logo.png (7KB) -> 이미 최적화됨');
console.log('3. WebP 형식 지원을 위한 변환 권장');
console.log('');
console.log('권장 도구:');
console.log(
  '- ImageMagick: magick convert person_icon.png -resize 36x36 person_icon_optimized.png'
);
console.log(
  '- Sharp (Node.js): sharp("person_icon.png").resize(36, 36).png().toFile("person_icon_optimized.png")'
);
console.log('- WebP 변환: magick convert person_icon.png person_icon.webp');

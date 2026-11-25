HtoG — 홈 사진 추가 버전

사진 추가 방법
1. media 폴더에 사진 파일을 넣습니다.
2. gallery.js를 텍스트 편집기로 엽니다.
3. src: "" 를 src: "media/classic-01.jpg"처럼 바꿉니다.
   파일 이름의 대소문자와 확장자를 정확히 맞춰주세요.
4. title은 사진 아래 제목, alt는 사진 내용을 설명하는 문장입니다.
5. 사진을 더 추가하려면 배열 안의 항목 하나를 복사합니다.
   layout: "detail"은 두 열, "opening"은 넓은 왼쪽,
   "closing"은 넓은 오른쪽 배치입니다. 모바일에서는 한 열입니다.

현재 클래식카쇼 사진이 제공되지 않아 네 개의 빈 사진 자리를 표시합니다.
사진을 지정하면 빈 자리는 자동으로 실제 사진으로 바뀝니다.
사진은 자르거나 늘리지 않고 원래 비율로 표시합니다.
사진 클릭 시 확대 뷰어가 열립니다. ESC 또는 바깥 영역 클릭으로 닫습니다.

홈 제목/소개: index.html의 collection-title 및 바로 아래 문장
디자인: style.css 맨 아래의 .car-collection부터
첫 화면 사진: index.html의 media/L.JPG (두 곳)

index.html의 이전 숨김 갤러리 및 프로젝트 주석 블록은 삭제했습니다.
배포 시 이 폴더의 index.html, style.css, gallery.js, viewer.js와
나머지 페이지 및 media 폴더를 함께 올려주세요.

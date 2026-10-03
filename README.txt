HtoG — What Remains

완전히 새로 구성한 차콜 배경의 사진 포트폴리오입니다.

index.html: Selected / 첫 화면과 선별 사진
projects.html: 프로젝트 목록
today-light.html: 오늘의 빛
solitude.html: 고독
notes.html: 기존 10 Questions 원문
about.html: 기존 소개 원문
style.css: 디자인
viewer.js: 전체 화면 확대, 휠/핀치 줌, 드래그
media/: 사진 원본

압축을 풀고 index.html을 브라우저로 열면 됩니다.
Netlify에는 압축을 푼 폴더 전체를 업로드하세요.
사진을 누르면 확대됩니다. ESC 또는 빈 공간 클릭으로 닫습니다.
기존 BetaTest 실험 페이지는 이 새 포트폴리오에 포함하지 않았습니다.

수정하기 쉬운 코드 정리 버전

모든 HTML, CSS, JavaScript 파일에 2칸 들여쓰기와 줄바꿈을 적용했습니다.

사진 / 문구 수정: 각 HTML 파일에서 파일명이나 문구를 검색하세요.
배경과 글자 색상: style.css 맨 위 :root의 --bg, --text, --muted
사진 최대 높이: style.css의 .picture img, .hero-image .picture img
모바일 디자인: style.css 하단 @media (max-width: 720px)
사진 확대 기능: viewer.js

기존 파일명과 폴더 구조를 유지했습니다. 수정한 파일만 같은 위치에 덮어써도 됩니다.

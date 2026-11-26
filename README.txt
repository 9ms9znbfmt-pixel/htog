HtoG 공통 푸터 업데이트

압축 안의 viewer.js, footer.js, footer.css를 사이트의 index.html과 같은 폴더에 넣으세요.
viewer.js는 기존 파일을 교체하고 나머지 두 파일은 추가합니다.
모든 페이지에서 사용하던 viewer.js가 공통 푸터를 자동으로 불러옵니다.
기존 HTML, style.css, gallery.js, 사진 파일을 바꿀 필요가 없습니다.
About에 있던 별도 연락처 영역은 자동으로 제거됩니다.

메일과 인스타그램 설정
footer.js 위쪽의 footerContact 안에 실제 정보를 입력하세요.
email: "실제 이메일 주소",
instagram: "현재 인스타그램 아이디",
인스타그램은 @ 없이 아이디만 적거나 전체 https 주소를 넣으면 됩니다.
블로그는 기존 nine_eighteen 주소로 연결했습니다.
실제 주소가 비어 있으면 Email / Instagram은 문구만 표시됩니다.
이전 About contact.js에 입력한 주소가 있다면 About에서는 그 값도 불러옵니다.
전체 페이지에 적용하려면 footer.js에 주소를 입력하세요.

Safari에 이전 viewer.js가 남아 있다면 HTML 안의
src="viewer.js"를 src="viewer.js?v=20261126-footer"로 바꾸세요.
이미 ?v=...가 붙어 있다면 버전 값만 바꿉니다.

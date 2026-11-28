HtoG — 사진을 본 뒤 나누는 이야기

현재 연결 상태
Project URL과 공개용 키를 comments-config.js에 입력해두었습니다.
프로젝트 API는 응답하지만 htog_comments 테이블이 아직 없어 댓글 저장은 준비되지 않았습니다.
아래 2번 SQL 실행과 4번 관리자 계정/권한 등록 후 배포해주세요.
3번의 예시 값으로 설정 파일을 다시 덮어쓰지 않아도 됩니다.

들어 있는 기능
• 클래식카쇼 / 일본 여행 전체 작업 페이지 끝의 감상·질문 작성란
• 별명 1~30자, 내용 2~1,000자, 로그인 없이 작성
• 확인한 글만 공개, 작가 답글은 최대 2,000자
• 관리자 로그인, 상태/시리즈별 목록, 공개/숨김, 답글 저장, 삭제
• 공개 목록 20개씩, 관리 목록 30개씩 불러오기
• 전송 실패 시 원문 유지, 중복 전송 제한, 기본 자동 입력 방지 칸

1. 사이트 파일 넣기
기존 사이트 폴더에 이 ZIP의 .html / .js / .css 파일을 복사하세요.
classic-cars.html / japan.html은 현재 사이트에서 가져와 댓글 파일 연결만 추가했습니다.
본인이 이후 HTML을 더 수정했다면 덮어쓰는 대신 각 페이지 </head> 바로 위에 아래 네 줄만 넣으세요.

<link rel="stylesheet" href="comments.css?v=20261128-1" />
<script src="comments-config.js?v=20261128-1" defer></script>
<script src="comments-api.js?v=20261128-1" defer></script>
<script src="comments.js?v=20261128-1" defer></script>

gallery.js / series.js / series.css / style.css / viewer.js / 사진은 그대로 둡니다.
메인 사진 네 장 미리보기 및 전체 작업 사진 수에도 영향을 주지 않습니다.
새로 다른 시리즈를 만든다면 DB의 series 허용 목록과 관리 페이지 선택지도 추가해야 합니다.

2. Supabase 테이블 만들기
Supabase 대시보드에서 사용할 프로젝트를 열어 SQL Editor에 comments-setup.sql 전체를 붙여넣고 실행하세요.
htog_comments / htog_comment_admins만 만듭니다. 기존 submissions 등은 건드리지 않습니다.
이 SQL 파일과 README.txt는 웹사이트에 올리지 않아도 됩니다.

3. 연결 정보 입력
comments-config.js를 열고 두 곳만 채워주세요.

window.HTOG_COMMENTS = Object.freeze({
  url: "https://내프로젝트.supabase.co",
  publicKey: "내 프로젝트의 Publishable key 또는 legacy anon key"
});

프로젝트의 Connect 또는 API 설정에서 Project URL과 공개용 키를 확인하세요.
secret / service_role 키와 관리자 비밀번호는 이 파일에 넣지 않습니다.
연결 전에는 작성란이 비활성화되고 준비 중 안내가 나옵니다.
입력 후 comments-config.js의 버전(?v=...)을 올리거나 캐시를 갱신하세요.

4. 관리자 만들기
Authentication > Users에서 본인 관리자 계정을 만드세요.
이메일·비밀번호 로그인을 사용합니다. 본인 비밀번호는 이 대화나 코드에 적을 필요가 없습니다.
계정 이메일 확인이 완료되어야 로그인할 수 있습니다.
새 계정의 UUID를 복사한 뒤 SQL Editor에서 아래를 실행하세요.

insert into public.htog_comment_admins (user_id)
values ('여기에 본인 계정 UUID') on conflict do nothing;

관리 권한은 이 테이블에 등록된 사용자에게만 있습니다.
다른 프로젝트 사용자가 로그인하더라도 대기 글이나 편집 권한은 얻지 못합니다.
관리자 목록은 공개용 키로 추가·수정할 수 없으며 SQL Editor에서만 관리합니다.

5. 사용하기
기존 방식대로 사이트 폴더를 Netlify에 배포하세요.
방문자는 classic-cars.html 또는 japan.html에서 이야기를 남깁니다.
관리자는 https://htog.art/comments-admin.html 에서 로그인합니다.
사이트 메뉴나 푸터에 관리 링크는 넣지 않았습니다.
목록 기본값은 '확인 대기'입니다.
답글 작성 후 '공개하기'를 누르면 이야기와 답글이 함께 공개됩니다.
'답글 저장'은 공개 상태를 바꾸지 않습니다.
'비공개로 전환'하면 글과 답글이 함께 숨겨집니다. 삭제는 확인창 후 실행됩니다.
관리 목록에서 상태를 바꾼 카드는 목록 새로고침까지 유지됩니다.
관리자 로그인은 메모리에만 유지하므로 페이지를 새로 열면 다시 로그인합니다.
세션이 만료되면 입력 중인 답글을 복사한 뒤 다시 로그인하세요.
새로운 댓글 알림 메일이나 작성자에게 보내는 답글 알림은 포함하지 않습니다.

6. 연결 후 확인
• 별명으로 테스트 글을 남겨보세요. 바로 공개되면 안 됩니다.
• 관리자에서 대기 글 확인 → 답글 → 공개하기를 눌러보세요.
• 로그아웃한 다른 창에서 공개 글과 답글만 보이는지 확인하세요.
• 비공개 전환 후 새로고침하면 해당 글이 사라져야 합니다.
• 클래식카쇼 글은 일본 여행 페이지에 나타나지 않아야 합니다.

구현 범위
공개 조회와 관리자 편집 권한은 DB의 RLS로 분리했습니다.
글 등록은 전용 함수만 사용하며 공개 여부·답글·작성일을 방문자가 지정할 수 없습니다.
같은 시리즈·별명의 1분 간격 제한 및 24시간 내 동일 글 중복 제한을 DB에서 검사합니다.
별명을 바꾸는 봇까지 막는 CAPTCHA나 IP 기반 제한은 포함하지 않습니다.
별명은 본인 인증이 아니며, 현재 방문자 직접 수정·삭제 기능은 없습니다.
공개된 별명/내용/답글 외에 방문자 이메일·IP를 이 테이블에 저장하지 않습니다.
기본 개인정보 안내는 작성 칸 아래에 표시했습니다.
실제 프로젝트 연결 정보가 없어 저장·로그인 운영 검증은 연결 후 필요합니다.

참고한 공식 문서
https://supabase.com/docs/guides/database/functions
https://supabase.com/docs/guides/database/postgres/row-level-security

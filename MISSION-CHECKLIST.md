# 포트폴리오 미션 체크리스트

체크 표시는 실제 구현과 확인을 끝냈을 때만 합니다. 보너스는 필수가 아닙니다.
현재 상태: 구현, GitHub 업로드, Pages 배포와 배포 사이트 Chrome 검증 완료. 체크된 구현 항목 중 모든 분기까지 자동 검증한 것은 아니며, 범위는 README에 기록했습니다. 본인의 설명 연습과 최종 제출은 남아 있습니다. 스크린샷은 배포 사이트의 실제 API 화면입니다.

## 1. 개발 환경과 파일 구성
- [x] VS Code와 Live Server 확장 설치, Open with Live Server로 실행
- [x] index.html, css/style.css, js/main.js, images/ 기본 구성 존재
- [x] HTML에 외부 CSS 연결, 외부 JavaScript를 defer로 연결
- [x] 순수 HTML/CSS/JavaScript 사용 (React, Vue, jQuery, Bootstrap, Tailwind 등 금지)
- [x] const/let 사용, var 금지
- [x] addEventListener 사용, HTML onclick 금지
- [x] 인라인 style 속성 금지
- [x] 최신 Chrome에서 확인

## 2. HTML과 접근성
- [x] header, nav, main, section, article, footer 사용
- [x] Hero: 인사말과 CTA(다음 행동을 안내하는 버튼)
- [x] About: 자기소개와 프로필 이미지
- [x] Skills: 기술 스택 목록
- [x] Projects: GitHub API 프로젝트 카드
- [x] Contact: 이름, 이메일, 메시지 문의 폼
- [x] Footer: 저작권과 소셜 링크
- [x] 내비게이션에서 각 콘텐츠 섹션으로 이동하는 앵커 링크
- [x] 모든 이미지에 의미 있는 alt
- [x] 모든 폼 입력 요소에 label 연결 (for와 id 일치)

## 3. CSS
- [x] css/style.css 사용
- [x] :root에 색상, 폰트, 간격 변수 정의
- [x] [data-theme="dark"]에 다크 모드 변수 정의
- [x] 내비게이션에 Flexbox 사용: 로고 왼쪽, 메뉴 오른쪽
- [x] Projects에 Grid와 auto-fit, minmax 사용
- [x] 모바일 기본 스타일부터 작성
- [x] 768px 태블릿, 1024px 데스크톱 브레이크포인트
- [x] 모바일에서 메뉴 숨김, 햄버거 버튼 표시
- [x] 버튼과 카드에 hover, transition
- [x] 카드에 box-shadow
- [x] 모바일·태블릿·데스크톱 레이아웃 확인

## 4. JavaScript와 인터랙션
- [x] querySelector, querySelectorAll 사용
- [x] textContent, innerHTML로 내용 변경
- [x] classList.add, remove, toggle 사용
- [x] click, submit, scroll, input 이벤트 처리
- [x] event.preventDefault() 사용
- [x] 햄버거 클릭으로 메뉴 열고 닫기: classList.toggle('active')
- [x] 내비게이션 클릭 시 부드러운 스크롤
- [x] 스크롤 300px 이상에서 맨 위로 버튼 표시, 클릭 시 맨 위로 이동
- [x] 스크롤 60px 이상에서 내비게이션 배경색 변경
- [x] 다크 모드 버튼으로 테마 전환
- [x] localStorage에 테마 저장, 새로고침 후 유지
- [x] Intersection Observer로 스크롤 애니메이션 (threshold 0.2 이상 권장)
- [x] 위 스크롤 기준값과 threshold를 README에 명시 (변경 시 실제 값 기록)

## 5. 폼
- [x] 이름·이메일·메시지 필수값 검사 (공백만 입력한 경우도 확인)
- [x] 이메일 형식 검사
- [x] 잘못된 필드 근처에 에러 메시지 표시
- [x] input 이벤트로 유효성 상태와 메시지 갱신
- [x] submit에서 preventDefault로 페이지 새로고침 방지
- [x] 유효한 제출에 성공 메시지 표시
- [x] 실제 전송을 구현하지 않았다면 안내 문구에 이를 명확히 표시

## 6. ES6+와 GitHub API
- [x] 본인 GitHub 아이디 설정
- [x] https://api.github.com/users/{본인아이디}/repos 호출
- [x] fetch, async/await, try/catch 사용
- [x] 화살표 함수, 템플릿 리터럴, 구조분해 할당 사용
- [x] map으로 GitHub 데이터를 HTML 카드로 변환
- [x] forEach로 배열 순회
- [x] 요청 중 로딩 텍스트 또는 스피너
- [x] 성공 시 저장소 카드 렌더링
- [x] 실패 시 '프로젝트를 불러올 수 없습니다'와 재시도 버튼
- [x] 빈 데이터에 '표시할 프로젝트가 없습니다'
- [x] 403 응답에도 에러 UI 표시 (HTTP 응답 성공 여부 검사)
- [x] 인증 없는 API의 시간당 60회 제한을 고려하여 반복 요청 피하기

## 7. 상태 → 렌더링 흐름 (최소 3개)
- [x] 테마: 클릭 → 테마 상태 변경 → 화면 스타일 변경
- [x] API: 요청 → 로딩/성공/실패/빈 상태 변경 → Projects 화면 변경
- [x] 폼: 입력 → 유효성 상태 변경 → 에러 메시지 표시/숨김

## 8. 직접 설명할 학습 목표
- [ ] 시맨틱 태그를 쓰는 이유와 구조 설계 기준
- [ ] Flexbox와 Grid 차이, 각각 선택한 이유
- [ ] querySelector로 선택하고 addEventListener로 이벤트 연결하는 흐름
- [ ] 화살표 함수, 구조분해 할당, map/filter의 필요성과 사용법
- [ ] fetch와 async/await, 로딩/성공/실패 UI 처리
- [ ] 사용자 이벤트 → 상태 변경 → DOM 업데이트를 실제 코드로 설명

## 9. 배포와 제출
- [x] Git 저장소 초기화 및 GitHub 저장소 준비
- [x] GitHub Pages 배포
- [x] 외부에서 접속 가능한 배포 URL 확인
- [x] 배포 사이트에서 반응형, 햄버거, 다크 모드, 스크롤 확인
- [x] 배포 사이트에서 GitHub API와 폼 유효성 검사 확인
- [x] README: 프로젝트 설명, 사용 기술, 배포 URL, 스크린샷
- [x] README: 실행 방법, 스크롤 기준값과 Observer threshold 기록
- [x] 데스크톱 스크린샷
- [x] 모바일 스크린샷
- [x] 다크 모드 스크린샷
- [ ] 제출: GitHub 저장소 URL + GitHub Pages URL + 스크린샷 3종

## 선택 보너스
- [x] 언어별 프로젝트 필터링, array.filter 사용
- [ ] Hero 타이핑 효과
- [ ] Formspree 또는 EmailJS로 실제 이메일 전송
- [x] prefers-color-scheme으로 시스템 다크 모드 감지

## 권장 진행 순서
1. 개발 환경 확인 및 시맨틱 HTML 뼈대 작성
2. 모바일 기본 CSS와 태블릿·데스크톱 반응형 적용
3. 메뉴, 스크롤, 다크 모드, 애니메이션 구현
4. 문의 폼 검증과 상태 렌더링 구현
5. 본인 GitHub API 연결 및 네 가지 화면 상태 구현
6. 요구사항 검증, 코드 설명 연습
7. GitHub Pages 배포, 배포 사이트 검증, 스크린샷과 README 완성

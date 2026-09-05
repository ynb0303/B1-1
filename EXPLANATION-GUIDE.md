# 직접 설명하기 위한 학습 가이드

코드를 외우기보다, 화면에서 기능을 실행한 뒤 관련 코드를 찾아 설명하는 순서로 연습하세요. 실제로 이해하고 수정해 본 범위만 본인의 경험으로 설명하면 됩니다.

## 코드를 읽는 순서 — 초심자용

먼저 [index.html](index.html)에서 화면의 영역을 보고, [css/style.css](css/style.css)에서 모양과 배치를 확인한 뒤, [js/main.js](js/main.js)로 넘어가세요. HTML은 섹션별 주석, CSS는 한 줄에 속성 하나, JavaScript는 다음 번호로 정리했습니다.

| main.js 구역 | 읽을 내용 | 말로 설명할 때의 출발점 |
| --- | --- | --- |
| 1. 설정과 상태 | 아이디, 기준값, state | “현재 상황을 이 값에 저장합니다.” |
| 2. HTML 요소 선택 | querySelector | “바꿀 버튼과 영역을 먼저 찾습니다.” |
| 3. 테마 | initializeTheme, renderTheme, click | “클릭하면 테마 상태를 바꿉니다.” |
| 4. 모바일 메뉴 | renderMenu, closeMenu, click | “열림 여부를 바꾸고 클래스를 적용합니다.” |
| 5. 스크롤 | renderScroll, 앵커 클릭 | “스크롤 위치에 따라 표시를 바꿉니다.” |
| 6. 등장 애니메이션 | initializeAnimations | “요소가 보이면 숨김 클래스를 제거합니다.” |
| 7. 프로젝트 | loadProjects, renderProjects | “데이터를 받아 상태별로 표시합니다.” |
| 8. 폼 | validateField, renderForm, input/submit | “입력값을 검사하고 오류를 표시합니다.” |
| 9. 시작 | 초기 실행 함수 호출 | “페이지가 열릴 때 준비한 함수를 실행합니다.” |

함수 정의는 동작을 준비하는 것이고, `함수이름()`은 실제 실행입니다. `addEventListener`의 등록은 파일을 읽을 때 이루어지지만, 등록한 함수는 이벤트가 발생할 때 실행됩니다. 9번에서 처음 화면에 필요한 함수를 실행한 뒤에는 사용자의 행동에 따라 이벤트 함수가 동작합니다.

### 먼저 메뉴 하나만 따라 읽기

1. 1번의 `state.menuOpen`이 메뉴의 열림 여부를 저장합니다.
2. 2번에서 `menu`와 `menuButton`을 찾습니다.
3. 4번의 클릭 이벤트가 `state.menuOpen`을 바꿉니다.
4. `renderMenu()`가 상태를 읽고 클래스·버튼 글자·접근성 속성을 갱신합니다.
5. CSS의 `.nav-menu.active`가 모바일 메뉴를 보여 줍니다.

이 흐름을 먼저 설명한 다음, 테마 → 폼 → API 순서로 넓혀 가세요.

### 함수 이름으로 역할 찾기

- `initialize...`: 처음 사용할 상태나 관찰 기능을 준비합니다.
- `render...`: 상태를 읽어 DOM, 즉 화면 요소를 갱신합니다.
- `createProjectCard`: 저장소 하나를 카드 HTML 문자열 하나로 바꿉니다. 직접 화면에 붙이지는 않습니다.
- `validateField`: 입력값을 검사해서 오류 문자열을 돌려줍니다. 정상이라면 빈 문자열입니다.
- `loadProjects`: API를 요청하고 결과를 상태에 저장합니다.

프로젝트는 `loadProjects` → `renderProjects` → `renderProjectFilters`와 `createProjectCard` 순서로 찾으세요. 먼저 로딩·성공·실패를 이해한 다음 페이지 추가 요청이나 시간 초과 처리를 읽으면 됩니다.

### 기호를 읽는 방법

| 코드 | 쉬운 뜻 |
| --- | --- |
| `=` | 오른쪽 값을 왼쪽 변수에 저장 |
| `===` | 두 값이 같은지 비교 |
| `!값` | 참·거짓을 반대로 바꾸기 |
| `조건 ? A : B` | 조건이 참이면 A, 아니면 B 선택 |
| `return` | 현재 함수를 끝내고 필요하면 결과 반환 |
| `error !== ''` | 오류 문구가 비어 있지 않은지 확인 |
| `some(함수)` | 조건을 만족하는 항목이 하나라도 있는지 확인 |

복잡한 조건은 `if`로 펼쳤고, 테마의 두 글자 중 하나를 고르는 것처럼 짧은 선택에는 삼항 연산자를 남겼습니다. 가독성 정리 후에도 미션에서 요구한 화살표 함수, 구조분해, map/filter/forEach를 실제 기능에 사용합니다.

## 1. 먼저 알아둘 단어
| 용어 | 쉬운 뜻 | 이 프로젝트의 예 |
| --- | --- | --- |
| HTML | 내용의 구조 | 제목, 메뉴, 폼 |
| CSS | 모양과 배치 규칙 | 색상, 카드 배열 |
| JavaScript | 동작을 만드는 언어 | 클릭하면 테마 변경 |
| DOM | 브라우저가 HTML을 읽어 만든 조작 가능한 요소 구조 | 버튼을 찾아 글자 바꾸기 |
| 이벤트 | 사용자나 브라우저에서 발생한 일 | click, input, submit, scroll |
| 상태 | 지금 상황을 기억하는 값 | theme: 'dark' |
| 렌더링 | 상태를 화면에 반영하는 과정 | renderTheme() |
| API | 다른 서비스와 데이터를 주고받는 약속 | GitHub 저장소 목록 요청 |
| 비동기 | 응답을 기다리는 동안 다른 작업도 할 수 있는 처리 | 목록 로딩 중 메뉴 사용 |

## 2. HTML 구조를 설명하기
index.html을 열고 header → main → footer 순서로 읽습니다.

- header는 페이지 머리말, nav는 이동 메뉴입니다.
- main은 주요 내용이고, section은 주제별 영역입니다.
- 각 프로젝트는 독립적인 내용이므로 JavaScript에서 article로 만듭니다.
- footer에는 저작권과 GitHub 링크를 둡니다.
- h1은 페이지 대표 제목, h2는 각 섹션 제목, h3는 카드 제목입니다.
- label의 for="email"과 input의 id="email"을 연결하면 라벨을 눌러도 입력창에 초점이 갑니다.
- alt는 이미지를 보지 못하거나 불러오지 못할 때 내용을 전달합니다.
- defer는 HTML 해석을 끝낸 뒤 외부 JavaScript를 실행하게 합니다. 그래야 아직 만들어지지 않은 버튼을 찾는 문제를 피할 수 있습니다.

연습 답변: “내용의 역할이 드러나도록 시맨틱 태그를 선택했습니다. 메뉴는 nav, 주요 내용은 main, 독립적인 프로젝트 카드는 article로 구성했습니다.”

## 3. CSS 구조를 설명하기
css/style.css의 번호 주석 순서대로 읽습니다.

### 변수와 다크 모드
`:root`의 `--color-bg`가 기본 배경색입니다. body는 `var(--color-bg)`를 참조합니다. JavaScript가 html에 `data-theme="dark"`를 지정하면 다크 모드 변수로 바뀝니다. 모든 요소를 하나씩 직접 칠하지 않아도 됩니다.

### Flexbox와 Grid
Flexbox는 한 방향 배치에 적합해서 내비게이션에 사용했습니다. 로고의 margin-right: auto는 남는 공간을 차지하여 메뉴를 오른쪽으로 밀어냅니다.

Grid는 행과 열 배치에 적합해서 프로젝트 카드에 사용했습니다.

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
```

- repeat: 같은 열 규칙을 반복합니다.
- auto-fit: 화면에 들어갈 수 있는 만큼 열을 만듭니다.
- minmax: 열의 최소·최대 너비를 정합니다.
- min(100%, 280px): 아주 좁은 화면에서도 카드가 부모보다 넓어지지 않게 합니다.
- 1fr: 남는 공간을 같은 비율로 나눕니다.

### 모바일 우선
기본 CSS는 모바일용입니다. 768px 이상에서 태블릿 규칙, 1024px 이상에서 데스크톱 규칙을 추가합니다. 넓은 화면에서는 메뉴와 기술 카드를 나란히 배치합니다.

연습: --color-accent를 바꿔 화면을 확인하고 되돌리세요. 브라우저 폭을 바꾸면서 미디어 쿼리가 적용되는 시점을 찾아보세요.

## 4. DOM 선택 → 이벤트 연결
js/main.js에서 아래 두 부분을 찾습니다.

```js
const themeButton = document.querySelector('#theme-toggle');
themeButton.addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  // 이후 renderTheme() 호출
});
```

querySelector는 조건에 맞는 첫 요소를 찾습니다. querySelectorAll은 여러 요소를 찾습니다. addEventListener는 특정 일이 발생했을 때 실행할 함수를 연결합니다. `() => {}`는 화살표 함수이고, 여기서는 클릭 후 실행할 동작을 표현합니다.

textContent는 글자를 바꾸고, innerHTML은 문자열을 HTML로 해석하여 내부 구조를 바꿉니다. 외부 API의 문자열은 escapeHTML로 처리하여 HTML 태그로 실행되지 않도록 합니다.

classList.add는 클래스 추가, remove는 제거, toggle은 켜고 끄기입니다. 메뉴의 toggle('active', state.menuOpen)은 상태가 true일 때만 active를 유지합니다.

## 5. 발표에서 보여줄 상태 흐름 3개

### A. 다크 모드
1. 사용자가 테마 버튼을 클릭합니다.
2. state.theme을 light 또는 dark로 바꿉니다.
3. renderTheme이 data-theme과 버튼 텍스트를 바꿉니다.
4. CSS 변수에 의해 전체 화면 색상이 달라집니다.
5. localStorage에 저장하여 새로고침 때 읽습니다.

localStorage는 브라우저의 사이트별 저장 공간입니다. 삭제하거나 다른 브라우저를 사용하면 값이 공유되지 않습니다. 저장이 차단되더라도 try/catch 덕분에 다른 기능은 계속 동작합니다.

### B. GitHub 프로젝트
1. 페이지가 열리거나 재시도 버튼을 누르면 loadProjects가 실행됩니다.
2. status를 loading으로 바꾸고 renderProjects가 로딩 문구를 표시합니다.
3. fetch로 GitHub에 요청하고 await로 응답을 기다립니다.
4. response.ok를 검사하고 response.json()으로 JSON 데이터를 읽습니다.
5. 배열에 항목이 있으면 success, 없으면 empty로 바꿉니다.
6. 오류가 발생하면 catch에서 error 상태와 메시지를 저장합니다.
7. finally에서 타이머를 정리하고 renderProjects로 최종 상태를 표시합니다.

중요 질문: “왜 try/catch 외에 response.ok도 검사하나요?”

답변: “fetch는 네트워크 실패에는 오류를 발생시키지만, 서버가 403이나 404를 보내도 응답 자체는 받습니다. 그래서 HTTP 상태를 직접 검사하고 throw로 오류 처리에 연결했습니다.”

### C. 폼 검증
1. input 이벤트에서 입력값을 state.form.values에 저장합니다.
2. validateField가 빈 값과 이메일 형식을 검사합니다.
3. 결과를 errors에 저장합니다.
4. renderForm이 입력창 근처에 오류 메시지를 표시합니다.
5. submit에서는 preventDefault로 기본 제출과 페이지 이동을 막습니다.
6. 전체 필드를 검사하고 정상일 때 검증 성공 메시지를 표시합니다.

중요: 실제 이메일 전송 기능은 없습니다. “전송 성공”이라고 설명하지 마세요.

## 6. ES6+와 배열 메서드
- const: 다시 대입하지 않을 변수. 객체 내부 값은 변경할 수 있습니다.
- let: page처럼 값을 다시 대입하는 변수.
- 화살표 함수: `(repo) => repo.language`처럼 함수를 표현하는 문법.
- 템플릿 리터럴: 백틱과 `${값}`으로 문자열 안에 값을 넣습니다. 카드 HTML 생성에 사용합니다.
- 구조분해 할당: `const { status, items } = state.projects`처럼 필요한 속성을 꺼냅니다.
- map: 각 저장소를 카드 HTML 문자열로 변환하고 새 배열을 만듭니다.
- join(''): HTML 문자열 배열을 하나의 문자열로 합칩니다.
- filter: 선택한 언어에 맞는 저장소만 남겨 새 배열을 만듭니다.
- forEach: 입력창이나 링크를 하나씩 돌며 이벤트를 연결합니다.
- Set: 중복 언어를 제거합니다.

연습 질문: “왜 forEach 대신 map으로 카드를 만드나요?”

답변: “map은 변환 결과를 새 배열로 반환하기 때문에 카드 문자열들을 모아 join하기 좋습니다. forEach는 각 요소에 이벤트를 연결하는 것처럼 반복 작업에 사용했습니다.”

## 7. 스크롤과 접근성
- scroll 이벤트는 현재 스크롤 위치를 확인합니다.
- 60px 이상이면 헤더에 scrolled 클래스를 적용합니다.
- 300px 이상이면 맨 위로 버튼의 hidden을 해제합니다.
- Intersection Observer는 화면에 요소가 들어오는지를 관찰합니다. 20%가 보이면 is-pending을 제거합니다.
- prefers-reduced-motion 설정에서는 움직임을 줄입니다.
- aria-expanded는 메뉴 열림 여부, aria-pressed는 토글 선택 여부를 전달합니다.
- aria-invalid와 aria-describedby는 입력 오류와 안내 문구를 연결합니다.
- role="status"는 로딩이나 성공 메시지 변경을 보조 기술에 알립니다.

## 8. 2분 발표 예시
“순수 HTML, CSS, JavaScript로 반응형 포트폴리오를 만들었습니다. HTML은 영역의 의미에 맞는 태그로 구성했고, CSS는 모바일 화면을 기본으로 768px과 1024px에서 레이아웃을 확장했습니다. 내비게이션에는 Flexbox, 프로젝트 카드에는 Grid를 사용했습니다.

핵심은 이벤트, 상태, 렌더링을 연결하는 것입니다. 다크 모드 버튼을 누르면 테마 상태를 바꾸고 renderTheme으로 화면에 반영합니다. 이 설정은 localStorage에 저장됩니다.

프로젝트 목록은 제 GitHub 공개 저장소를 fetch와 async/await로 가져옵니다. 요청 중, 성공, 실패, 빈 결과를 구분해서 보여주고 실패하면 재시도할 수 있습니다. map으로 카드를 만들고 filter로 언어별 목록을 표시합니다.

문의 폼은 입력 이벤트에서 유효성을 검사하고 필드 아래에 오류를 표시합니다. 제출 시 기본 동작을 막고 모든 값이 정상이면 검증 성공 메시지를 보여줍니다. 실제 이메일 전송은 구현하지 않았습니다.”

## 9. 제출 전 직접 해볼 것
- 자기소개 두 문장을 자신의 이야기로 수정하기
- CSS 색상 변수 하나를 바꿨다가 되돌리기
- 메뉴, 테마, 필터가 사용하는 상태와 렌더링 함수를 찾아보기
- 빈 폼 → 잘못된 이메일 → 정상 입력 순서로 시연하기
- 새로고침 후 다크 모드 유지 확인하기
- 개발자 도구 Network에서 GitHub 요청과 응답 배열 확인하기
- GitHub Pages 배포 후 로컬과 같은 결과인지 확인하기

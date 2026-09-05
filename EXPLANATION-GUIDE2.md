# 직접 설명할 학습 목표 6가지

[미션 체크리스트](MISSION-CHECKLIST.md)의 **8. 직접 설명할 학습 목표**만 정리한 문서입니다. 각 항목을 읽고 실제 코드를 찾아본 다음, 답변 예시를 자신의 말로 설명해 보세요. 아래의 일부 코드는 이해하기 쉽게 필요한 부분만 발췌하거나 줄였습니다. 그대로 파일에 덮어쓰는 용도가 아닙니다.

## 1. 시맨틱 태그를 쓰는 이유와 구조 설계 기준

### 쉬운 설명

시맨틱 태그는 **내용의 역할을 알려주는 HTML 태그**입니다. `div`는 일반적인 묶음이고, `nav`는 이동 메뉴라는 의미를 가집니다. 역할에 맞는 태그를 쓰면 개발자가 구조를 읽기 쉽고, 브라우저와 화면 낭독기 같은 보조 기술도 영역의 의미를 파악하는 데 도움이 됩니다.

### 프로젝트에서 선택한 기준

| 태그 | 맡은 역할 | 이 프로젝트의 내용 |
| --- | --- | --- |
| `header` | 페이지 머리말 | 로고와 내비게이션 |
| `nav` | 주요 이동 링크 모음 | 홈·소개·기술·프로젝트·연락 메뉴 |
| `main` | 페이지의 중심 내용 | Hero부터 Contact까지 |
| `section` | 하나의 주제로 묶인 영역 | 자기소개, 기술 목록, 프로젝트 등 |
| `article` | 독립적으로 읽을 수 있는 내용 | GitHub 저장소 카드 한 개 |
| `footer` | 페이지의 마무리 정보 | 저작권과 GitHub 링크 |

[실제 HTML](index.html)의 구조를 줄이면 다음과 같습니다. `article`은 처음부터 HTML에 있는 것이 아니라 [JavaScript의 renderProjects](js/main.js)에서 생성합니다.

```html
<header>
  <nav aria-label="주요 메뉴">...</nav>
</header>
<main>
  <section id="hero">...</section>
  <section id="about">...</section>
  <section id="skills">...</section>
  <section id="projects">...</section>
  <section id="contact">...</section>
</main>
<footer>...</footer>
```

섹션에는 내용을 설명하는 제목을 두었습니다. 역할보다는 버튼을 묶거나 배치하기 위한 용도에는 `div`를 사용했습니다. 시맨틱 태그를 쓴다고 `div`를 모두 없애야 하는 것은 아닙니다.

### 직접 설명하는 답변 예시

> “내용의 역할을 기준으로 태그를 선택했습니다. 이동 메뉴는 nav, 주요 내용은 main, 주제별 영역은 section으로 구분했습니다. 프로젝트 카드 하나는 독립적인 내용이므로 article로 만들었습니다. 이렇게 하면 코드와 페이지 구조의 의미를 이해하기 쉽습니다.”

**확인 질문:** Projects 영역은 왜 `section`이고 카드 하나는 왜 `article`인가요?

## 2. Flexbox와 Grid 차이, 각각 선택한 이유

### 쉬운 설명

Flexbox는 **한 방향의 정렬**, Grid는 **행과 열을 함께 다루는 배치**에 적합합니다. Flexbox도 줄바꿈할 수 있지만, 여러 줄의 열을 함께 맞추려면 Grid가 편리합니다.

| 비교 | Flexbox | Grid |
| --- | --- | --- |
| 기본 관점 | 가로 또는 세로 한 방향 | 행과 열 두 방향 |
| 이 프로젝트의 용도 | 로고와 메뉴 정렬 | 프로젝트 카드 배열 |
| 선택 이유 | 나란히 놓고 간격·정렬 조절 | 화면 폭에 따라 카드 열 수 자동 조절 |

### 실제 코드 읽기

[css/style.css](css/style.css)의 관련 선언만 모았습니다.

```css
.navigation {
  display: flex;
  align-items: center;
}
.logo {
  margin-right: auto;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
}
```

- `display: flex`: 내비게이션 요소들을 기본적으로 가로 방향으로 놓습니다.
- `align-items: center`: 한 줄 내비게이션의 요소를 세로 가운데로 맞춥니다.
- `margin-right: auto`: 로고 오른쪽의 남는 공간을 차지하여 메뉴를 오른쪽으로 밀어냅니다.
- `auto-fit`: 들어갈 수 있는 만큼 카드 열을 만듭니다.
- `minmax`: 카드 열의 최소·최대 너비를 정합니다.
- `min(100%, 280px)`: 부모 너비와 280px 중 작은 값을 최소 너비로 사용합니다. 아주 좁은 화면에서 카드가 넘치는 것을 막습니다.
- `1fr`: 남는 공간을 열끼리 같은 비율로 나눕니다.

### 직접 설명하는 답변 예시

> “내비게이션은 로고와 메뉴를 한 방향으로 정렬하므로 Flexbox를 선택했습니다. 프로젝트는 여러 카드의 행과 열을 배치해야 해서 Grid를 사용했습니다. auto-fit과 minmax로 화면 너비에 맞춰 열 수와 카드 너비가 바뀌게 했습니다.”

**확인 질문:** 브라우저를 좁혔을 때 카드가 다음 줄로 내려가는 데 어떤 CSS가 관여하나요?

## 3. querySelector로 선택하고 addEventListener로 이벤트 연결하기

### 쉬운 설명

DOM은 **브라우저가 HTML을 읽고 만든, JavaScript로 조작할 수 있는 요소 구조**입니다. 버튼을 동작시키려면 먼저 그 버튼을 찾고, 클릭할 때 실행할 함수를 연결합니다.

### 실제 코드 읽기

[js/main.js](js/main.js)의 메뉴 관련 코드입니다. 서로 떨어져 있는 부분을 함께 모았습니다.

```js
const menuButton = document.querySelector('#menu-toggle');

menuButton.addEventListener('click', () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});
```

1. `querySelector('#menu-toggle')`은 id가 `menu-toggle`인 첫 요소를 찾습니다. `#`은 id를 선택하는 CSS 선택자 문법입니다.
2. 찾은 버튼을 `menuButton`이라는 변수에 보관합니다.
3. `addEventListener('click', 함수)`는 클릭이 발생했을 때 실행할 함수를 등록합니다.
4. 실제로 클릭하면 중괄호 안 코드가 실행됩니다.
5. 메뉴 상태를 바꾸고 `renderMenu()`를 호출해 화면에 반영합니다.

`querySelectorAll`은 조건에 맞는 요소들을 모아서 반환합니다. 프로젝트에서는 여러 앵커 링크에 `forEach`로 이벤트를 연결할 때 사용합니다. `querySelector`는 요소가 없으면 `null`을 반환하므로, 선택자와 HTML의 id가 일치해야 합니다. 외부 스크립트에 `defer`를 붙여 HTML 해석 후에 요소를 찾도록 했습니다.

### 직접 설명하는 답변 예시

> “querySelector로 HTML의 버튼을 찾고, addEventListener로 click 이벤트를 연결했습니다. 이벤트를 등록하는 순간에 메뉴가 열리는 것이 아니라, 사용자가 클릭했을 때 연결한 함수가 실행됩니다.”

**확인 질문:** `querySelector`만 쓰면 버튼 클릭 기능도 생기나요? → 아닙니다. 요소 선택과 이벤트 연결은 별도 작업입니다.

## 4. 화살표 함수, 구조분해 할당, map/filter의 필요성과 사용법

### 화살표 함수: 실행할 동작을 함수로 표현

함수는 실행할 동작을 묶은 것입니다. 화살표 함수는 함수를 작성하는 문법 중 하나입니다. 이벤트 처리나 배열 변환처럼 짧은 함수를 전달할 때 읽기 편합니다. 일반 함수로도 구현할 수 있으며 반드시 화살표 함수여야 하는 것은 아닙니다.

```js
// 문법을 이해하기 위한 작은 예시
const getName = (repo) => repo.name;
```

매개변수 `repo`로 저장소 객체를 받아 이름을 반환합니다. 중괄호 없는 표현식은 결과를 자동 반환합니다. 중괄호를 쓰면 값을 반환할 때 `return`이 필요합니다.

### 구조분해 할당: 객체에서 필요한 값 꺼내기

`renderProjects`의 실제 코드입니다.

```js
const { status, items, error, language } = state.projects;
```

이는 `state.projects.status` 등을 반복해서 쓰는 대신, 필요한 속성을 각각 변수로 꺼내는 문법입니다. 상태와 자동으로 동기화되는 새 저장 공간을 만드는 것은 아닙니다. 렌더링 함수를 호출할 때마다 그 시점의 값을 다시 꺼냅니다.

`createProjectCard`의 구조분해 할당에서 `language: repoLanguage`는 `language` 속성을 꺼내되 변수 이름을 `repoLanguage`로 정한다는 뜻입니다. 필터 상태의 `language`와 구분하기 위해 사용했습니다.

### map: 모든 항목을 다른 형태로 바꾸기

실제 프로젝트에서는 카드 하나를 만드는 `createProjectCard` 함수를 분리했습니다. `renderProjects`에서 아래와 같이 호출합니다.

```js
const projectCards = visible.map(createProjectCard);
projectGrid.innerHTML = projectCards.join('');
```

`map(createProjectCard)`는 저장소를 하나씩 `createProjectCard(repo)`에 전달하고, 반환된 HTML 문자열을 모은다는 뜻입니다. 아래는 카드 생성 원리를 한곳에 모아 줄인 설명용 예시입니다.

```js
projectGrid.innerHTML = visible.map(({ name }) => `
  <article class="project-card">
    <h3>${escapeHTML(name)}</h3>
  </article>
`).join('');
```

1. `visible`은 표시할 저장소들의 배열입니다.
2. `map`은 저장소 하나마다 함수를 실행하고 반환값을 새 배열에 모읍니다.
3. 백틱과 `${...}`는 문자열에 값을 넣는 템플릿 리터럴 문법입니다.
4. `join('')`은 카드 문자열 배열을 하나의 문자열로 합칩니다.
5. `innerHTML`은 그 문자열을 HTML로 해석해 카드 요소를 만듭니다.
6. `escapeHTML`은 외부 문자열이 HTML 태그로 해석되지 않도록 특수문자를 바꿉니다.

### filter: 조건에 맞는 항목만 남기기

실제 언어 필터 코드입니다.

```js
const visible = items.filter((repo) => {
  if (language === 'all') {
    return true;
  }

  const repoLanguage = repo.language || '미지정';
  return repoLanguage === language;
});
```

`filter`는 함수 결과가 참인 항목만 새 배열에 담습니다. 여기서는 전체 선택이면 모두 남기고, 특정 언어를 선택했다면 해당 언어의 저장소만 남깁니다. 먼저 `if`에서 전체 선택인지 확인합니다. 나머지 경우에는 저장소 언어와 선택 언어가 같은지 비교합니다. `repo.language || '미지정'`은 언어 값이 없으면 비교에 쓸 값을 `'미지정'`으로 정합니다.

| 메서드 | 반환하는 결과 | 프로젝트에서의 역할 |
| --- | --- | --- |
| `map` | 항목별 변환 결과의 새 배열 | 저장소 → 카드 HTML |
| `filter` | 조건에 맞는 항목의 새 배열 | 선택 언어의 저장소 추리기 |
| `forEach` | 반환값은 `undefined` | 링크·입력창마다 이벤트 연결 |

이 코드의 `map`과 `filter`는 원본 저장소 배열을 삭제하거나 수정하지 않습니다. 그래서 필터를 다시 ‘전체’로 바꿀 수 있습니다.

### 직접 설명하는 답변 예시

> “화살표 함수로 이벤트나 배열 처리 함수를 표현하고, 구조분해 할당으로 필요한 속성을 꺼냈습니다. map은 저장소를 카드 HTML로 변환할 때, filter는 선택한 언어의 저장소만 추릴 때 사용했습니다.”

**확인 질문:** `filter`로 목록을 줄인 뒤 전체 목록으로 돌아갈 수 있는 이유는 무엇인가요?

## 5. fetch와 async/await, 로딩·성공·실패 UI 처리

### 쉬운 설명

`fetch`는 서버에 요청을 보내는 함수입니다. `async` 함수 안의 `await`는 요청 결과가 준비될 때까지 **그 함수의 다음 진행을 기다리게** 합니다. 브라우저 전체를 멈추는 것은 아니어서, 프로젝트를 기다리는 동안 메뉴 등 다른 기능을 사용할 수 있습니다.

응답 본문은 `await response.json()`으로 읽어 JavaScript에서 사용할 배열이나 객체로 변환합니다.

### 실제 코드의 흐름

[js/main.js](js/main.js)의 `loadProjects`는 아래 순서로 동작합니다. 다음 페이지 처리와 시간 제한 코드를 생략한 설명용 요약입니다.

```js
// loadProjects 함수 내부 흐름을 줄인 예시
state.projects.status = 'loading';
renderProjects();

try {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`
  );
  if (!response.ok) throw new Error('서버 응답 오류');

  const data = await response.json();
  state.projects.items = data;
  state.projects.status = data.length ? 'success' : 'empty';
} catch (error) {
  state.projects.status = 'error';
  state.projects.error = error.message;
} finally {
  renderProjects();
}
```

실제 코드는 응답이 배열인지 확인하고, 다음 페이지가 있으면 추가 요청합니다. 15초 시간 제한과 HTTP 상태별 오류 문구도 처리합니다.

| 상황 | 상태 | renderProjects가 표시하는 UI |
| --- | --- | --- |
| 응답을 기다리는 중 | `loading` | 프로젝트 로딩 중... |
| 저장소를 받음 | `success` | 저장소 수, 필터, 프로젝트 카드 |
| 정상 응답이지만 저장소가 없음 | `empty` | 표시할 프로젝트가 없습니다. |
| 요청 실패 | `error` | 오류 안내와 다시 시도 버튼 |

**왜 `response.ok`도 확인하나요?** `fetch`는 네트워크 실패에는 오류를 발생시키지만, 403·404 같은 HTTP 오류 응답을 받았다는 이유만으로 자동으로 `catch`에 들어가지는 않습니다. 그래서 응답의 성공 여부를 직접 확인하고 `throw`로 오류를 발생시킵니다.

`catch`는 오류를 받아 실패 상태를 기록합니다. `finally`는 성공과 실패에 관계없이 실행되므로 타이머 정리와 마지막 렌더링에 사용했습니다. 재시도 버튼은 `loadProjects`를 다시 호출합니다.

### 직접 설명하는 답변 예시

> “요청 전에 loading 상태를 표시하고 fetch와 await로 GitHub 응답을 받습니다. 성공하면 저장소 배열을 저장하고 카드를 그립니다. 빈 배열이면 빈 목록 안내를, 오류가 나면 catch에서 실패 상태를 저장해 오류 문구와 재시도 버튼을 표시합니다. HTTP 오류도 처리하려고 response.ok를 검사했습니다.”

**확인 질문:** 요청이 성공했는데 저장소가 0개인 경우와, 네트워크 오류가 난 경우를 어떻게 구분하나요?

## 6. 사용자 이벤트 → 상태 변경 → DOM 업데이트를 실제 코드로 설명

### 쉬운 설명

이벤트는 **발생한 일**, 상태는 **현재 상황을 기억하는 값**, DOM 업데이트는 **그 값을 화면 요소에 반영하는 작업**입니다. 이 프로젝트에서는 상태값만 바꿔도 화면이 자동으로 바뀌는 것이 아닙니다. 렌더링 함수를 직접 호출해야 합니다.

### 예시 A: 메뉴 클릭

실제 코드에서 선택 부분과 렌더링 함수를 함께 모았습니다.

```js
const menu = document.querySelector('#nav-menu');
const menuButton = document.querySelector('#menu-toggle');

const renderMenu = () => {
  menu.classList.toggle('active', state.menuOpen);
  menuButton.setAttribute('aria-expanded', String(state.menuOpen));
  menuButton.setAttribute('aria-label', state.menuOpen ? '메뉴 닫기' : '메뉴 열기');
  menuButton.textContent = state.menuOpen ? '×' : '☰';
};

menuButton.addEventListener('click', () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});
```

| 단계 | 코드 | 뜻 |
| --- | --- | --- |
| 이벤트 | `addEventListener('click', ...)` | 클릭하면 함수 실행 |
| 상태 변경 | `state.menuOpen = !state.menuOpen` | 닫힘은 열림으로, 열림은 닫힘으로 변경 |
| DOM 업데이트 | `classList.toggle('active', state.menuOpen)` | true면 클래스 추가, false면 제거 |
| 화면 변화 | CSS의 `.nav-menu.active` | 모바일 메뉴 표시 |

### 예시 B: 다크 모드

클릭하면 `state.theme`을 바꾸고 `renderTheme()`을 호출합니다. 그 함수의 실제 코드는 다음과 같습니다.

```js
const renderTheme = () => {
  root.dataset.theme = state.theme;
  const isDark = state.theme === 'dark';
  themeButton.textContent = isDark ? '라이트 모드' : '다크 모드';
  themeButton.setAttribute('aria-pressed', String(isDark));
};
```

`root`는 HTML 최상위 요소입니다. `dataset.theme`을 바꾸면 HTML의 `data-theme` 속성이 바뀝니다. CSS의 `[data-theme="dark"]` 변수가 적용되어 전체 색상이 바뀌고, `textContent`는 버튼 글자를 바꿉니다.

### 예시 C: 폼 입력

다음은 실제 입력 이벤트 코드입니다.

```js
fields.forEach((field) => {
  field.addEventListener('input', () => {
    state.form.values[field.name] = field.value;
    state.form.errors[field.name] = validateField(field.name, field.value);
    state.form.success = false;
    renderForm();
  });
});
```

입력할 때마다 값과 오류 상태를 저장합니다. `renderForm`에서는 각 필드의 오류 문자열을 `textContent`로 표시하고, `aria-invalid` 속성도 바꿉니다. 올바르게 고치면 오류 문자열이 비어 메시지가 사라집니다. 제출 시에는 `preventDefault()`로 기본 제출을 막고 모든 필드를 검사합니다. 성공 메시지는 검증 성공을 의미하며 실제 이메일 전송을 뜻하지 않습니다.

### 직접 설명하는 답변 예시

> “메뉴를 예로 들면, 클릭 이벤트에서 menuOpen 상태를 반대로 바꿉니다. 그다음 renderMenu를 직접 호출해 active 클래스와 버튼 글자를 갱신합니다. CSS가 해당 클래스에 맞게 메뉴를 보여 줍니다. 다크 모드와 폼도 이벤트로 상태를 바꾸고 렌더링 함수가 DOM에 반영하는 같은 흐름입니다.”

**확인 질문:** `state.menuOpen`만 바꾸고 `renderMenu()`를 호출하지 않으면 메뉴가 열릴까요? → 이 프로젝트에서는 DOM을 직접 갱신해야 하므로 열리지 않습니다.

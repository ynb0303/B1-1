'use strict';

/*
 * 읽는 순서
 * 1. 설정과 상태 → 2. HTML 요소 선택 → 3~8. 기능별 코드 → 9. 시작
 *
 * render로 시작하는 함수: 상태를 읽어서 화면을 갱신합니다.
 * addEventListener: 사용자 행동과 실행할 코드를 연결합니다.
 * 상태값을 바꾼 뒤 render 함수를 호출하는 흐름을 따라 읽어 보세요.
 */

// 1. 설정과 상태: 화면에 필요한 값을 한곳에 보관합니다.
const GITHUB_USERNAME = 'ynb0303';
const THEME_STORAGE_KEY = 'portfolio-theme';
const HEADER_SCROLL_POSITION = 60;
const TOP_BUTTON_SCROLL_POSITION = 300;
const ANIMATION_THRESHOLD = 0.2;
const API_TIMEOUT_MS = 15000; // 1000밀리초 = 1초
const state = {
  theme: 'light',
  menuOpen: false,
  projects: {
    status: 'idle', // idle: 요청 전 / loading: 요청 중 / success / empty / error
    items: [],     // GitHub에서 받은 전체 저장소 목록
    error: '',     // 실패 이유
    language: 'all', // 현재 선택한 언어 필터
  },
  form: {
    values: {
      name: '',
      email: '',
      message: '',
    },
    errors: {}, // 입력창 이름별 오류 메시지
    submitted: false,
    success: false,
  },
};

// 2. HTML 요소 선택: 조작할 요소를 먼저 찾아 변수에 보관합니다.
const root = document.documentElement;
const menu = document.querySelector('#nav-menu');
const menuButton = document.querySelector('#menu-toggle');
const themeButton = document.querySelector('#theme-toggle');
const header = document.querySelector('#site-header');
const topButton = document.querySelector('#scroll-top');
const projectStatus = document.querySelector('#projects-status');
const projectGrid = document.querySelector('#projects-grid');
const retryButton = document.querySelector('#retry-projects');
const filters = document.querySelector('#project-filters');
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const fields = [...form.querySelectorAll('input, textarea')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme = null;

// 3. 테마: 클릭 → state.theme 변경 → 속성과 버튼 글자 업데이트.
const renderTheme = () => {
  root.dataset.theme = state.theme;
  const isDark = state.theme === 'dark';
  themeButton.textContent = isDark ? '라이트 모드' : '다크 모드';
  themeButton.setAttribute('aria-pressed', String(isDark));
};
// 처음 접속하면 저장된 테마를 우선 사용하고, 없으면 시스템 설정을 따릅니다.
const initializeTheme = () => {
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    // 저장이 차단된 브라우저에서도 화면 기능은 계속 제공합니다.
  }

  const hasSavedTheme = savedTheme === 'light' || savedTheme === 'dark';

  if (hasSavedTheme) {
    state.theme = savedTheme;
  } else if (systemTheme.matches) {
    state.theme = 'dark';
  } else {
    state.theme = 'light';
  }

  renderTheme();
};

themeButton.addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  savedTheme = state.theme;
  renderTheme();
  try {
    localStorage.setItem(THEME_STORAGE_KEY, state.theme);
  } catch {
    // 저장이 불가능하면 현재 탭에서만 테마를 유지합니다.
  }
});
systemTheme.addEventListener('change', ({ matches }) => {
  if (!savedTheme) {
    state.theme = matches ? 'dark' : 'light';
    renderTheme();
  }
});

// 4. 모바일 메뉴: 상태와 접근성 속성도 함께 갱신합니다.
const renderMenu = () => {
  menu.classList.toggle('active', state.menuOpen);
  menuButton.setAttribute('aria-expanded', String(state.menuOpen));
  menuButton.setAttribute('aria-label', state.menuOpen ? '메뉴 닫기' : '메뉴 열기');
  menuButton.textContent = state.menuOpen ? '×' : '☰';
};
const closeMenu = () => {
  state.menuOpen = false;
  renderMenu();
};
menuButton.addEventListener('click', () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.menuOpen) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  const clickedInsideMenu = event.target.closest('.navigation');
  if (state.menuOpen && !clickedInsideMenu) {
    closeMenu();
  }
});
window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);

// 5. 스크롤: 위치에 따라 화면을 갱신하고 섹션으로 이동합니다.
// 앵커의 기본 이동을 대신 처리하여 스크롤과 키보드 초점을 함께 이동합니다.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) {
      return;
    }
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});
const renderScroll = () => {
  header.classList.toggle('scrolled', window.scrollY >= HEADER_SCROLL_POSITION);
  topButton.hidden = window.scrollY < TOP_BUTTON_SCROLL_POSITION;
};
window.addEventListener('scroll', renderScroll, { passive: true });
topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  document.querySelector('.logo').focus({ preventScroll: true });
});

// 6. 등장 애니메이션: 관찰 요소의 20%가 보이면 한 번 나타납니다.
// 긴 섹션 대신 제목·카드를 관찰해 모바일에서도 임계값에 도달하게 합니다.
const initializeAnimations = () => {
  const revealElements = document.querySelectorAll(
    'section > h2, .about-layout img, .skills-list li'
  );
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          target.classList.remove('is-pending');
          observer.unobserve(target);
        }
      });
    }, { threshold: ANIMATION_THRESHOLD });
    revealElements.forEach((element) => {
      element.classList.add('reveal', 'is-pending');
      observer.observe(element);
    });
  }
};

// 7. 프로젝트: 데이터 준비 → 상태별 화면 표시 → API 요청 → 이벤트 연결.

// 외부 문자열의 <, > 등을 바꿔 HTML 태그로 실행되지 않게 합니다.
const escapeHTML = (value) => {
  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(value).replace(/[&<>"']/g, (character) => {
    return replacements[character];
  });
};

// 저장소 하나를 받아 카드 HTML 문자열 하나를 반환합니다.
const createProjectCard = (repo) => {
  const { name, description, language: repoLanguage, stargazers_count } = repo;
  const projectUrl = `https://github.com/${GITHUB_USERNAME}/${encodeURIComponent(name)}`;
  const projectDescription = description || '아직 등록된 프로젝트 설명이 없습니다.';
  const projectLanguage = repoLanguage || '언어 미지정';
  const starCount = Number(stargazers_count) || 0;

  return `
    <article class="project-card">
      <h3>
        <a href="${projectUrl}">${escapeHTML(name)}</a>
      </h3>
      <p>${escapeHTML(projectDescription)}</p>
      <div class="project-meta">
        <span>${escapeHTML(projectLanguage)}</span>
        <span>별 ${starCount}개</span>
      </div>
    </article>
  `;
};

// 전체 저장소에서 언어 이름을 모아 필터 버튼을 만듭니다.
const renderProjectFilters = () => {
  const { items, language } = state.projects;
  const languageNames = items.map((repo) => repo.language || '미지정');
  const uniqueLanguages = [...new Set(languageNames)]; // Set은 중복을 제거합니다.
  const sortedLanguages = uniqueLanguages.sort();
  const options = ['all', ...sortedLanguages];

  const filterButtons = options.map((option) => {
    const buttonLabel = option === 'all' ? '전체' : option;
    const isSelected = language === option;

    return `
      <button
        type="button"
        data-language="${escapeHTML(option)}"
        aria-pressed="${isSelected}"
      >
        ${escapeHTML(buttonLabel)}
      </button>
    `;
  });

  filters.innerHTML = filterButtons.join('');
};

const renderProjects = () => {
  const { status, items, error, language } = state.projects;
  projectGrid.innerHTML = '';
  filters.innerHTML = '';
  retryButton.hidden = status !== 'error';
  projectGrid.setAttribute('aria-busy', String(status === 'loading'));
  // 로딩·실패·빈 목록이면 안내만 표시하고 여기서 함수를 끝냅니다.
  if (status === 'loading') {
    projectStatus.textContent = '프로젝트 로딩 중...';
    return;
  }

  if (status === 'error') {
    projectStatus.textContent = `프로젝트를 불러올 수 없습니다. ${error}`;
    return;
  }

  if (items.length === 0) {
    projectStatus.textContent = '표시할 프로젝트가 없습니다.';
    return;
  }

  // 성공하면 필터를 그리고, 선택한 언어의 카드만 표시합니다.
  renderProjectFilters();

  const visible = items.filter((repo) => {
    if (language === 'all') {
      return true;
    }

    const repoLanguage = repo.language || '미지정';
    return repoLanguage === language;
  });

  if (visible.length === 0) {
    projectStatus.textContent = '표시할 프로젝트가 없습니다.';
  } else {
    projectStatus.textContent = `${visible.length}개의 공개 프로젝트`;
  }

  const projectCards = visible.map(createProjectCard);
  projectGrid.innerHTML = projectCards.join('');
};

const loadProjects = async () => {
  // 요청 중에는 중복 요청을 보내지 않습니다.
  if (state.projects.status === 'loading') {
    return;
  }

  // ① 요청 전에 상태를 바꾸고 로딩 문구를 표시합니다.
  state.projects.status = 'loading';
  state.projects.error = '';
  renderProjects();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  // ② 응답을 기다리고 데이터를 읽습니다.
  try {
    // 페이지당 100개씩 읽어 공개 저장소가 많은 경우에도 빠뜨리지 않습니다.
    const repositories = [];
    let page = 1;
    let hasNext = true;
    while (hasNext) {
      const apiUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos`
        + `?sort=updated&per_page=100&page=${page}`;
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/vnd.github+json' },
      });
      // fetch는 403/404에도 자동으로 catch로 가지 않으므로 직접 검사합니다.
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('요청이 제한되었을 수 있습니다. 잠시 후 다시 시도해 주세요.');
        }
        if (response.status === 404) {
          throw new Error('GitHub 계정을 찾을 수 없습니다. 아이디를 확인해 주세요.');
        }
        throw new Error(`서버 응답 오류 (${response.status}). 잠시 후 다시 시도해 주세요.`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('저장소 응답 형식이 올바르지 않습니다.');
      }
      repositories.push(...data);
      hasNext = /rel="next"/.test(response.headers.get('Link') || '');
      page += 1;
    }
    // ③ 성공한 데이터를 상태에 저장합니다.
    state.projects.items = repositories;
    state.projects.language = 'all';
    state.projects.status = repositories.length ? 'success' : 'empty';
  } catch (error) {
    state.projects.status = 'error';
    if (error.name === 'AbortError') {
      state.projects.error = '요청 시간이 초과되었습니다. 다시 시도해 주세요.';
    } else {
      state.projects.error = error.message;
    }
  } finally {
    // ④ 성공·실패 모두 마지막에 화면을 갱신합니다.
    clearTimeout(timeout);
    renderProjects();
  }
};
retryButton.addEventListener('click', loadProjects);
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-language]');
  if (!button) {
    return;
  }
  state.projects.language = button.dataset.language;
  renderProjects();
  // 버튼을 다시 그렸으므로 같은 버튼에 키보드 초점을 복원합니다.
  const filterButtons = [...filters.querySelectorAll('button')];
  const selectedButton = filterButtons.find((item) => {
    return item.dataset.language === state.projects.language;
  });

  if (selectedButton) {
    selectedButton.focus();
  }
});

// 8. 폼: 입력 → 값/에러 상태 변경 → 각 입력창 아래 메시지 갱신.
// 오류가 있으면 안내 문자열을, 없으면 빈 문자열을 반환합니다.
const validateField = (name, value) => {
  const trimmedValue = value.trim();
  const requiredMessages = {
    name: '이름을 입력해 주세요.',
    email: '이메일을 입력해 주세요.',
    message: '메시지를 입력해 주세요.',
  };

  if (trimmedValue === '') {
    return requiredMessages[name];
  }

  if (name === 'email') {
    // 공백 없이 아이디@도메인.확장자 형태인지 확인하는 정규식입니다.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(trimmedValue);

    if (!isValidEmail) {
      return '올바른 이메일 형식으로 입력해 주세요. 예: hello@example.com';
    }
  }

  return '';
};

const renderForm = () => {
  fields.forEach(({ name }) => {
    const error = state.form.errors[name] || '';
    const errorMessage = document.querySelector(`#${name}-error`);
    const inputField = document.querySelector(`#${name}`);
    const hasError = error !== '';

    errorMessage.textContent = error;
    inputField.setAttribute('aria-invalid', String(hasError));
  });

  const hasErrors = Object.values(state.form.errors).some((error) => error !== '');

  if (state.form.success) {
    formStatus.textContent = '입력 내용이 정상적으로 확인되었습니다. 연습용 폼으로, 이메일은 전송되지 않았습니다.';
  } else if (state.form.submitted && hasErrors) {
    formStatus.textContent = '입력 내용을 확인해 주세요.';
  } else {
    formStatus.textContent = '';
  }
};

fields.forEach((field) => {
  field.addEventListener('input', () => {
    state.form.values[field.name] = field.value;
    state.form.errors[field.name] = validateField(field.name, field.value);
    state.form.success = false;
    renderForm();
  });
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  state.form.submitted = true;
  fields.forEach(({ name, value }) => {
    state.form.values[name] = value;
    state.form.errors[name] = validateField(name, value);
  });
  const hasErrors = Object.values(state.form.errors).some((error) => error !== '');
  state.form.success = !hasErrors;
  renderForm();
  if (!state.form.success) {
    const firstInvalidField = fields.find(({ name }) => state.form.errors[name]);
    firstInvalidField.focus();
  }
});

// 9. 시작: 위에서 준비한 함수들을 처음 한 번 실행합니다.
// JS가 실행될 때만 브라우저 기본 폼 검증을 직접 작성한 검증으로 대체합니다.
form.noValidate = true;
initializeTheme();
renderMenu();
renderScroll();
initializeAnimations();
loadProjects();

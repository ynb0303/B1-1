'use strict';

// 1. 상태: 화면에 필요한 값을 한곳에 보관합니다.
const GITHUB_USERNAME = 'ynb0303';
const state = {
  theme: 'light',
  menuOpen: false,
  projects: { status: 'idle', items: [], error: '', language: 'all' },
  form: { values: { name: '', email: '', message: '' }, errors: {}, submitted: false, success: false },
};
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

// 2. 테마: 클릭 → state.theme 변경 → 속성과 버튼 글자 업데이트.
const renderTheme = () => {
  root.dataset.theme = state.theme;
  const isDark = state.theme === 'dark';
  themeButton.textContent = isDark ? '라이트 모드' : '다크 모드';
  themeButton.setAttribute('aria-pressed', String(isDark));
};
try {
  savedTheme = localStorage.getItem('portfolio-theme');
} catch {
  // 저장이 차단된 브라우저에서도 화면 기능은 계속 제공합니다.
}
state.theme = ['light', 'dark'].includes(savedTheme) ? savedTheme : (systemTheme.matches ? 'dark' : 'light');
renderTheme();
themeButton.addEventListener('click', () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  savedTheme = state.theme;
  renderTheme();
  try { localStorage.setItem('portfolio-theme', state.theme); } catch { /* 저장 불가 시 현재 탭에서만 유지 */ }
});
systemTheme.addEventListener('change', ({ matches }) => {
  if (!savedTheme) {
    state.theme = matches ? 'dark' : 'light';
    renderTheme();
  }
});

// 3. 모바일 메뉴: 상태와 접근성 속성도 함께 갱신합니다.
const renderMenu = () => {
  menu.classList.toggle('active', state.menuOpen);
  menuButton.setAttribute('aria-expanded', String(state.menuOpen));
  menuButton.setAttribute('aria-label', state.menuOpen ? '메뉴 닫기' : '메뉴 열기');
  menuButton.textContent = state.menuOpen ? '×' : '☰';
};
const closeMenu = () => { state.menuOpen = false; renderMenu(); };
menuButton.addEventListener('click', () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.menuOpen) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', (event) => {
  if (state.menuOpen && !event.target.closest('.navigation')) closeMenu();
});
window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);

// 앵커의 기본 이동을 대신 처리하여 스크롤과 키보드 초점을 함께 이동합니다.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});
const renderScroll = () => {
  header.classList.toggle('scrolled', window.scrollY >= 60);
  topButton.hidden = window.scrollY < 300;
};
window.addEventListener('scroll', renderScroll, { passive: true });
topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  document.querySelector('.logo').focus({ preventScroll: true });
});
renderScroll();

// threshold 0.2: 관찰하는 요소의 20%가 보이면 한 번 나타납니다.
// 긴 섹션 전체 대신 제목·카드를 관찰하여 모바일에서도 임계값에 도달합니다.
const revealElements = document.querySelectorAll('section > h2, .about-layout img, .skills-list li');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.remove('is-pending');
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.2 });
  revealElements.forEach((element) => {
    element.classList.add('reveal', 'is-pending');
    observer.observe(element);
  });
}

// 4. API: 외부 문자열을 HTML에 넣기 전에 특수문자를 바꿉니다.
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));
const renderProjects = () => {
  const { status, items, error, language } = state.projects;
  projectGrid.innerHTML = '';
  filters.innerHTML = '';
  retryButton.hidden = status !== 'error';
  projectGrid.setAttribute('aria-busy', String(status === 'loading'));
  if (status === 'loading') { projectStatus.textContent = '프로젝트 로딩 중...'; return; }
  if (status === 'error') { projectStatus.textContent = `프로젝트를 불러올 수 없습니다. ${error}`; return; }
  if (items.length === 0) { projectStatus.textContent = '표시할 프로젝트가 없습니다.'; return; }

  const languages = [...new Set(items.map(({ language: repoLanguage }) => repoLanguage || '미지정'))].sort();
  const options = ['all', ...languages];
  filters.innerHTML = options.map((option) => `<button type="button" data-language="${escapeHTML(option)}" aria-pressed="${language === option}">${escapeHTML(option === 'all' ? '전체' : option)}</button>`).join('');
  const visible = items.filter((repo) => language === 'all' || (repo.language || '미지정') === language);
  projectStatus.textContent = visible.length ? `${visible.length}개의 공개 프로젝트` : '표시할 프로젝트가 없습니다.';
  projectGrid.innerHTML = visible.map(({ name, description, language: repoLanguage, stargazers_count }) => `
    <article class="project-card">
      <h3><a href="https://github.com/${GITHUB_USERNAME}/${encodeURIComponent(name)}">${escapeHTML(name)}</a></h3>
      <p>${escapeHTML(description || '아직 등록된 프로젝트 설명이 없습니다.')}</p>
      <div class="project-meta"><span>${escapeHTML(repoLanguage || '언어 미지정')}</span><span>별 ${Number(stargazers_count) || 0}개</span></div>
    </article>`).join('');
};
const loadProjects = async () => {
  if (state.projects.status === 'loading') return;
  state.projects.status = 'loading';
  state.projects.error = '';
  renderProjects();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    // 페이지당 100개씩 읽어 공개 저장소가 많은 경우에도 빠뜨리지 않습니다.
    const repositories = [];
    let page = 1;
    let hasNext = true;
    while (hasNext) {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&page=${page}`, {
        signal: controller.signal,
        headers: { Accept: 'application/vnd.github+json' },
      });
      // fetch는 403/404에도 자동으로 catch로 가지 않으므로 직접 검사합니다.
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) throw new Error('요청이 제한되었을 수 있습니다. 잠시 후 다시 시도해 주세요.');
        if (response.status === 404) throw new Error('GitHub 계정을 찾을 수 없습니다. 아이디를 확인해 주세요.');
        throw new Error(`서버 응답 오류 (${response.status}). 잠시 후 다시 시도해 주세요.`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('저장소 응답 형식이 올바르지 않습니다.');
      repositories.push(...data);
      hasNext = /rel="next"/.test(response.headers.get('Link') || '');
      page += 1;
    }
    state.projects.items = repositories;
    state.projects.language = 'all';
    state.projects.status = repositories.length ? 'success' : 'empty';
  } catch (error) {
    state.projects.status = 'error';
    state.projects.error = error.name === 'AbortError' ? '요청 시간이 초과되었습니다. 다시 시도해 주세요.' : error.message;
  } finally {
    clearTimeout(timeout);
    renderProjects();
  }
};
retryButton.addEventListener('click', loadProjects);
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-language]');
  if (!button) return;
  state.projects.language = button.dataset.language;
  renderProjects();
  // 버튼을 다시 그렸으므로 같은 버튼에 키보드 초점을 복원합니다.
  [...filters.querySelectorAll('button')].find((item) => item.dataset.language === state.projects.language)?.focus();
});

// 5. 폼: 입력 → 값/에러 상태 변경 → 각 입력창 아래 메시지 갱신.
const validateField = (name, value) => {
  if (!value.trim()) return { name: '이름을 입력해 주세요.', email: '이메일을 입력해 주세요.', message: '메시지를 입력해 주세요.' }[name];
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return '올바른 이메일 형식으로 입력해 주세요. 예: hello@example.com';
  return '';
};
const renderForm = () => {
  fields.forEach(({ name }) => {
    const error = state.form.errors[name] || '';
    document.querySelector(`#${name}-error`).textContent = error;
    document.querySelector(`#${name}`).setAttribute('aria-invalid', String(Boolean(error)));
  });
  formStatus.textContent = state.form.success ? '입력 내용이 정상적으로 확인되었습니다. 연습용 폼으로, 이메일은 전송되지 않았습니다.' : (state.form.submitted && Object.values(state.form.errors).some(Boolean) ? '입력 내용을 확인해 주세요.' : '');
};
// JS가 실행될 때만 브라우저 기본 검증 대신 직접 작성한 검증을 사용합니다.
form.noValidate = true;
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
  state.form.success = !Object.values(state.form.errors).some(Boolean);
  renderForm();
  if (!state.form.success) fields.find(({ name }) => state.form.errors[name]).focus();
});
loadProjects();

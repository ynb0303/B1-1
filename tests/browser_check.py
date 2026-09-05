"""개발용 브라우저 검증. 웹사이트 실행에는 Python/Playwright가 필요하지 않습니다."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
URL = 'http://127.0.0.1:8765'
API = 'https://api.github.com/users/ynb0303/repos*'
FIXTURE = [
    {'name': 'sample-html', 'description': '<img src=x onerror=alert(1)>', 'language': 'HTML', 'stargazers_count': 1},
    {'name': 'sample-js', 'description': None, 'language': 'JavaScript', 'stargazers_count': 2},
]
checks = []
def passed(message):
    checks.append(message)
    print('PASS:', message, flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, color_scheme='light', reduced_motion='reduce')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.route(API, lambda route: route.fulfill(json=FIXTURE))
    page.goto(URL)
    expect(page.locator('.project-card')).to_have_count(2)
    expect(page.locator('.project-card img')).to_have_count(0)
    passed('API 성공 카드 및 외부 문자열 HTML 이스케이프')
    page.get_by_role('button', name='HTML', exact=True).click()
    expect(page.locator('.project-card')).to_have_count(1)
    page.get_by_role('button', name='전체', exact=True).click()
    expect(page.locator('.project-card')).to_have_count(2)
    passed('언어 필터와 전체 목록 복원')
    page.locator('#theme-toggle').click()
    expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
    page.reload()
    expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
    passed('테마 변경 및 새로고침 후 localStorage 유지')
    page.locator('#theme-toggle').click()
    page.locator('#contact-form button').click()
    expect(page.locator('[aria-invalid="true"]')).to_have_count(3)
    page.locator('#name').fill('   ')
    expect(page.locator('#name')).to_have_attribute('aria-invalid', 'true')
    page.locator('#name').fill('테스트')
    page.locator('#email').fill('wrong@')
    expect(page.locator('#email')).to_have_attribute('aria-invalid', 'true')
    page.locator('#email').fill('hello@example.com')
    page.locator('#message').fill('포트폴리오 검증입니다.')
    page.locator('#contact-form button').click()
    expect(page.locator('#form-status')).to_contain_text('정상적으로 확인')
    expect(page.locator('[aria-invalid="true"]')).to_have_count(0)
    passed('필수값·공백·이메일 검증, input 오류 해제, submit 성공')
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(100)
    expect(page.locator('#scroll-top')).to_be_hidden()
    page.evaluate('window.scrollTo(0, 350)')
    expect(page.locator('#scroll-top')).to_be_visible()
    expect(page.locator('#site-header')).to_have_class('site-header scrolled')
    page.locator('#scroll-top').click()
    page.wait_for_timeout(100)
    assert page.evaluate('window.scrollY') == 0
    passed('스크롤 헤더 변경 및 맨 위로 이동')
    for width in [320, 390, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'Overflow at {width}'
        if width < 768:
            expect(page.locator('#nav-menu')).to_be_hidden()
            page.locator('#menu-toggle').click()
            expect(page.locator('#nav-menu')).to_be_visible()
            page.locator('#menu-toggle').click()
            expect(page.locator('#nav-menu')).to_be_hidden()
            page.locator('#menu-toggle').click()
            page.keyboard.press('Escape')
            expect(page.locator('#nav-menu')).to_be_hidden()
            page.locator('#menu-toggle').click()
            page.locator('#nav-menu a[href="#about"]').click()
            expect(page.locator('#nav-menu')).to_be_hidden()
            assert page.evaluate('document.activeElement.id') == 'about'
        else:
            expect(page.locator('#nav-menu')).to_be_visible()
            expect(page.locator('#menu-toggle')).to_be_hidden()
    passed('320/390/768/1024/1440px 넘침 없음, 모바일 메뉴와 앵커 초점')
    page.unroute(API)
    page.route(API, lambda route: route.fulfill(json=[]))
    page.reload()
    expect(page.locator('#projects-status')).to_have_text('표시할 프로젝트가 없습니다.')
    passed('API 빈 목록')
    page.unroute(API)
    page.route(API, lambda route: route.fulfill(status=403, json={'message':'limit'}))
    page.reload()
    expect(page.locator('#projects-status')).to_contain_text('프로젝트를 불러올 수 없습니다')
    expect(page.locator('#retry-projects')).to_be_visible()
    page.unroute(API)
    page.route(API, lambda route: route.fulfill(json=FIXTURE))
    page.locator('#retry-projects').click()
    expect(page.locator('.project-card')).to_have_count(2)
    passed('403 오류 및 재시도 성공')
    page.unroute(API)
    page.route(API, lambda route: route.abort())
    page.reload()
    expect(page.locator('#projects-status')).to_contain_text('프로젝트를 불러올 수 없습니다')
    passed('네트워크 실패 UI')
    page.unroute(API)
    pending = []
    page.route(API, lambda route: pending.append(route))
    page.goto(URL, wait_until='domcontentloaded')
    expect(page.locator('#projects-status')).to_have_text('프로젝트 로딩 중...')
    page.wait_for_timeout(100)
    pending[0].fulfill(json=FIXTURE)
    expect(page.locator('.project-card')).to_have_count(2)
    passed('로딩 상태에서 성공 상태 전환')
    assert not errors, errors
    passed('브라우저 JavaScript 실행 오류 없음')
    context.close()

    # 실제 API 확인과 제출 참고 이미지: 모의 데이터는 사용하지 않습니다.
    real = browser.new_context(viewport={'width': 1440, 'height': 1000}, color_scheme='light')
    live = real.new_page()
    live.goto(URL)
    live.wait_for_function("!['프로젝트 로딩 중...', '프로젝트 연동을 준비하고 있습니다.'].includes(document.querySelector('#projects-status').textContent)", timeout=20000)
    status = live.locator('#projects-status').inner_text()
    assert '불러올 수 없습니다' not in status, status
    passed('실제 GitHub API: ' + status)
    for title, width, theme in [('desktop', 1440, 'light'), ('mobile', 390, 'light'), ('dark', 1440, 'dark')]:
        live.set_viewport_size({'width': width, 'height': 1000 if width > 500 else 844})
        if live.locator('html').get_attribute('data-theme') != theme:
            live.locator('#theme-toggle').click()
        for section in ['#about', '#skills', '#projects', '#contact']:
            live.locator(section).scroll_into_view_if_needed()
            live.wait_for_timeout(700)
        assert live.locator('.is-pending').count() == 0
        live.evaluate('window.scrollTo({top:0, behavior:"instant"})')
        live.wait_for_timeout(300)
        live.screenshot(path=str(ROOT / f'images/screenshots/{title}.png'), full_page=True)
    passed('실제 API 화면의 데스크톱·모바일·다크 모드 스크린샷 생성, Observer 등장 확인')
    browser.close()
(ROOT / 'tests/results.json').write_text(json.dumps(checks, ensure_ascii=False, indent=2) + '\n')

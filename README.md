# Galilee Gateway

빌드 도구 없이 순수 HTML/CSS/JS로 만든 정적 블로그입니다.
도메인: **galileegateway.com** (www.galileegateway.com)

## 폴더 구조

```
website/
├── index.html      # 홈 (글 목록)
├── about.html      # 소개 페이지
├── posts/          # 글 상세 페이지
│   ├── post-1.html
│   ├── post-2.html
│   └── post-3.html
├── css/style.css   # 전체 스타일
├── js/main.js      # 다크모드 토글
└── images/         # 이미지 저장용
```

## 로컬에서 미리보기

빌드 과정이 없으므로 `index.html`을 브라우저로 바로 열어도 되지만,
상대 경로가 완벽히 동작하려면 간단한 로컬 서버를 띄우는 걸 추천합니다.

```bash
# Python이 있다면
python3 -m http.server 8000

# 또는 Node가 있다면
npx serve .
```

이후 브라우저에서 http://localhost:8000 접속.

## 새 글 추가하는 법

1. `posts/post-1.html`을 복사해서 `posts/post-4.html` 같은 이름으로 저장
2. 제목, 날짜, 본문 내용을 수정
3. `index.html`의 `<section class="post-list">` 안에 새 글 카드(`<article class="post-card">`)를 추가하고 링크 연결

## 배포하기 (Vercel)

1. 이 폴더를 GitHub 저장소에 push
2. https://vercel.com 에서 GitHub 계정으로 로그인
3. "Add New... → Project"에서 방금 push한 저장소 선택
4. Framework Preset은 **Other**로 두고 그대로 Deploy (빌드 설정 불필요)
5. 배포가 끝나면 `프로젝트명.vercel.app` 주소로 바로 접속 가능

## galileegateway.com 도메인 연결하기 (DNS)

1. Vercel 프로젝트 → **Settings → Domains**
2. 아래 두 개를 모두 추가하는 것을 추천합니다.
   - `galileegateway.com` (루트 도메인)
   - `www.galileegateway.com` (www 서브도메인) → 추가 후 "Redirect to galileegateway.com" 또는 반대로 설정 가능
3. Vercel이 안내하는 DNS 레코드를 도메인을 구입한 곳(가비아, 후이즈, 카페24, Route53, Cloudflare 등)의 DNS 관리 화면에 추가합니다. 보통 아래와 같습니다.
   - 루트 도메인(`galileegateway.com`): `A` 레코드 → `76.76.21.21`
   - `www` 서브도메인: `CNAME` 레코드 → `cname.vercel-dns.com`
4. 몇 분~최대 48시간 내 반영되며, 반영되면 Vercel이 자동으로 `www.galileegateway.com`에 HTTPS 인증서도 발급해줍니다.
5. 반영 여부는 `nslookup galileegateway.com` 또는 [dnschecker.org](https://dnschecker.org)에서 확인할 수 있습니다.

## 참고

- 이 세션의 네트워크 정책상 npm 패키지 설치(예: Vercel CLI, `create-next-app`)가 막혀 있어
  빌드 도구가 필요 없는 순수 HTML/CSS/JS 방식으로 만들었습니다.
- 나중에 Next.js 등으로 옮기고 싶다면, 로컬 컴퓨터(터미널 접속 제한 없는 환경)에서
  `npx create-next-app@latest`로 새로 시작한 뒤 이 콘텐츠를 옮기시면 됩니다.

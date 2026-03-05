# 프론트엔드 개요

## 기술 스택

- React 18 / TypeScript 5 / Vite 6
- Zustand 4 (전역 상태 관리)
- MUI (Material UI) v7 — `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `@emotion/cache`
- axios 1.x — API 클라이언트 (JWT 인터셉터 포함)
- date-fns 4 — 날짜 유틸리티
- React Router DOM v7
- Vitest (테스트)
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인) — 레이아웃
- Emotion `prepend: true` 캐시 설정으로 Tailwind와 MUI 스타일 우선순위 충돌 해결
- `@supabase/supabase-js` — 소셜 로그인(Google, Kakao) OAuth 전용

## 화면

- 캘린더 뷰, 리스트 뷰, 컨텐츠 뷰
- 캘린더 뷰 : 날짜별로 디보션이 저장되면 캘린더에 표시 되고 클릭시 컨텐츠 뷰 화면으로 이동
- 리스트 뷰 : 해당 월별로 디보션 목록을 보여주는 화면
- 컨텐츠 뷰 : 읽기 모드, 쓰기 모드 전환 가능하며, 캘린더나 리스트에서 클릭시에는 읽기 모드로 진행되며

1. 입력 폼 : 날짜, 제목, 성경구절, 요약, 내게주신 말씀, 하나님, 나, 실천사항(todo 리스트), 저장버튼, 수정버튼, 삭제버튼

## 환경변수 (.env)

```
VITE_API_URL=
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon JWT>
```

- `.env`는 커밋 금지. `.env.example` 참고.
- `VITE_API_URL`은 **반드시 비워둘 것** — 값을 설정하면 Vite proxy를 우회해 CORS 에러 발생
- `VITE_SUPABASE_ANON_KEY`: Supabase Dashboard → Settings → API → anon/public
- Vite 환경변수는 반드시 `VITE_` 접두사 사용.
- `vite-env.d.ts` 파일이 있어야 `import.meta.env` TypeScript 타입 인식.

## 소셜 로그인 설정

OAuth 흐름: 버튼 클릭 → `supabase.auth.signInWithOAuth` → 프로바이더 → `/auth/callback` 리다이렉트 → `AuthCallbackPage`에서 세션 추출 → localStorage 저장

### Supabase 설정 (공통)
- Dashboard → Authentication → URL Configuration → Redirect URLs에 추가:
  - 로컬: `http://localhost:5173/auth/callback`
  - 운영: `https://<도메인>/auth/callback`

### Google
1. [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 클라이언트 생성
2. 승인된 리디렉션 URI: `https://<project-ref>.supabase.co/auth/v1/callback`
3. Supabase → Authentication → Providers → Google → Client ID/Secret 입력

### Kakao
1. [Kakao Developers](https://developers.kakao.com) → 앱 생성
2. 플랫폼 → Web → 사이트 도메인 등록
3. 카카오 로그인 활성화 → Redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
4. Supabase → Authentication → Providers → Kakao → REST API 키/Secret 입력

## 명령어

```bash
npm install         # 의존성 설치
npm run dev         # 개발 서버 (http://localhost:5173)
npm run build       # 프로덕션 빌드 (tsc -b && vite build)
npm test            # 테스트 실행 (vitest)
```

## 소스 구조

```
src/
  main.tsx                    # Emotion cache prepend + MUI ThemeProvider
  App.tsx                     # BrowserRouter + Routes
  vite-env.d.ts               # ImportMetaEnv 타입 정의
  index.css                   # @import "tailwindcss"
  types/
    auth.ts                   # AuthResponse, LoginRequest, SignupRequest
    devotion.ts               # Devotion, DevotionCreateRequest, DevotionUpdateRequest, ApiResponse<T>
  utils/
    api.ts                    # axios 인스턴스 + JWT 인터셉터 (401 → /login 리다이렉트)
    date.ts                   # formatDate, formatYearMonth, getDaysInMonth 등 (date-fns 기반)
    supabase.ts               # @supabase/supabase-js 클라이언트 (OAuth 전용)
  stores/
    useAuthStore.ts           # Zustand: login, signup, loginWithProvider(google|kakao), logout, initAuth
    useDevotionStore.ts       # Zustand: fetchByMonth, fetchByDate, create, update, remove, clearCurrent
  components/
    layout/AppLayout.tsx      # Outlet 래퍼
    layout/NavigationBar.tsx  # Tabs (캘린더/목록) + 새 디보션 버튼(clearCurrent 후 이동) + 로그아웃
    calendar/CalendarGrid.tsx
    calendar/CalendarCell.tsx
    list/DevotionListItem.tsx
    content/DevotionForm.tsx  # 중복 날짜 409 → MUI Snackbar 표시 + 날짜 초기화
                              # 실천사항: 항목 추가/삭제 todo 리스트, JSON 배열로 직렬화
    content/DevotionReadView.tsx
    common/ProtectedRoute.tsx
    common/LoadingSpinner.tsx
  pages/
    LoginPage.tsx             # Google/Kakao 소셜 로그인 버튼 + 이메일 로그인
    SignupPage.tsx
    CalendarPage.tsx
    ListPage.tsx
    ContentPage.tsx           # isNew/isEditMode 분기, 저장/수정/삭제
                              # DevotionForm key={isNew ? 'new' : id}, isNew 시 devotion prop 미전달
    AuthCallbackPage.tsx      # OAuth 리다이렉트 처리 → localStorage 저장 → /calendar 이동
```

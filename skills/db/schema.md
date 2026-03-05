# DB 스키마 (Supabase)

## 적용 방법

Supabase Dashboard → **SQL Editor** → **New query** → 아래 SQL 실행

---

## devotion_todos 테이블

```sql
-- devotion_todos 테이블 생성
CREATE TABLE devotion_todos (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date         date        NOT NULL,
  title        text,
  bible_verse  text,
  summary      text,
  given_word   text,
  about_god    text,
  about_me     text,
  action_items text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- 날짜 중복 방지 (같은 날 디보션은 1개만)
CREATE UNIQUE INDEX devotion_todos_user_date_idx ON devotion_todos (user_id, date);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER devotion_todos_updated_at
  BEFORE UPDATE ON devotion_todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS 활성화 (백엔드는 service_role key로 우회하므로 별도 정책 불필요)
ALTER TABLE devotion_todos ENABLE ROW LEVEL SECURITY;
```

## 컬럼 설명

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | PK, 자동 생성 |
| `user_id` | uuid | `auth.users.id` FK, 삭제 시 cascade |
| `date` | date | 디보션 날짜 (`YYYY-MM-DD`) |
| `title` | text | 제목 (nullable) |
| `bible_verse` | text | 성경 구절 (nullable) |
| `summary` | text | 요약 (nullable) |
| `given_word` | text | 내게 주신 말씀 (nullable) |
| `about_god` | text | 하나님은 어떤 분인가 (nullable) |
| `about_me` | text | 나는 어떤 사람인가 (nullable) |
| `action_items` | text | 실천 사항 — JSON 배열 문자열로 저장 `["항목1","항목2"]`, 기존 plain text 하위 호환 (nullable) |
| `created_at` | timestamptz | 생성 시각, 자동 설정 |
| `updated_at` | timestamptz | 수정 시각, 트리거로 자동 갱신 |

## 환경변수 수집 위치

Supabase Dashboard → **Settings → API**

| 환경변수 | 위치 |
|---|---|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | anon / public |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (**외부 노출 금지**) |
| `SUPABASE_JWT_SECRET` | Settings → API → JWT Secret |

> **RLS 참고**: 백엔드는 `SUPABASE_SERVICE_ROLE_KEY`로 RLS를 우회합니다.
> 프론트에서 Supabase를 직접 호출할 경우 별도 RLS 정책 추가가 필요합니다.

## 마이그레이션 (기존 테이블에 컬럼 추가)

```sql
-- title 컬럼 추가
ALTER TABLE devotion_todos ADD COLUMN title text;
```

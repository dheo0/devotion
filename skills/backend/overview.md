# 백엔드 개요

## 기술 스택

- Java 22 / Spring Boot 3.3.4 / Gradle 8.10.2 (Groovy DSL)
- dependency-management 플러그인 1.1.6
- spring-boot-starter-web, spring-boot-starter-validation, Lombok
- DB 연동: Supabase REST API (`RestTemplate` + Apache HttpClient 5)
- JWT 검증: JJWT 0.12.6 (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- OpenAPI 문서: springdoc-openapi-starter-webmvc-ui 2.3.0
- `httpclient5`: PATCH 메서드 지원을 위해 필수 (기본 HttpURLConnection은 PATCH 미지원)

## 패키지 구조

```
com.example.todoapp/
  TodoAppApplication.java
  global/
    common/
      ApiResponse.java              # 공통 응답 래퍼 { success, data, message }
    config/
      SupabaseProperties.java       # @ConfigurationProperties(prefix="supabase")
      SupabaseConfig.java           # RestTemplate Bean (HttpComponentsClientHttpRequestFactory)
      WebMvcConfig.java             # AuthInterceptor 등록 (/api/v1/**, /api/v1/auth/** 제외)
      OpenApiConfig.java            # Springdoc Bearer JWT 보안 스킴 전역 설정
    interceptor/
      AuthInterceptor.java          # JWT 검증 (ES256/HS256 자동 감지)
                                    #   ES256: Supabase JWKS 엔드포인트에서 공개키 가져와 검증 (kid 기준 캐시)
                                    #   HS256: SUPABASE_JWT_SECRET Base64 디코딩 → SecretKey
                                    #   공통: sub claim → userId → request attribute
    exception/
      UnauthorizedException.java
      TodoNotFoundException.java
      DuplicateDateException.java   # 같은 날짜 중복 저장 시 409 반환
      GlobalExceptionHandler.java   # @RestControllerAdvice
  domain/auth/
    dto/  SignupRequest, LoginRequest, AuthResponse(+confirmationRequired), SupabaseAuthResponse, SupabaseUser
    service/  AuthService
    controller/  AuthController
  domain/todo/
    entity/  Todo.java              # Supabase 응답 역직렬화용 record (JPA Entity 아님) — title 필드 포함
    dto/  TodoCreateRequest, TodoUpdateRequest, TodoResponse  # title 필드 포함
    service/  TodoService           # YearMonth.lengthOfMonth()로 월말 날짜 계산, 중복 시 DuplicateDateException
    controller/  TodoController
```

## 환경변수 (.env)

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role JWT>   # RLS 우회용 — anon key와 반드시 다른 값 사용
SUPABASE_ANON_KEY=<anon JWT>
SUPABASE_JWT_SECRET=<base64-encoded JWT secret>
```

- `.env`는 커밋 금지. `.env.example` 참고.
- `SUPABASE_JWT_SECRET`: Supabase Dashboard → Settings → API → JWT Secret
- `SUPABASE_SERVICE_ROLE_KEY`: anon key 혼용 금지 — RLS 우회 불가
- Supabase 신규 프로젝트는 기본 **ES256** 알고리즘 사용 → JWKS 자동 처리됨 (JWT Secret 불필요할 수 있음)
- 이메일 확인(Email Confirmation)이 ON이면 signup 응답에 `confirmationRequired: true` 반환 (토큰 없음)
  → 테스트 계정은 Supabase admin API 또는 대시보드에서 직접 생성 권장
- `application.yml`에 `spring.jackson.property-naming-strategy` 미설정 — 요청/응답 모두 **camelCase**
  (Supabase REST 역직렬화는 `@JsonProperty` 로 개별 처리)

## 명령어

```bash
# 서버 실행 (환경변수 로드 필요)
set -a && source .env && set +a && ./gradlew bootRun

./gradlew test       # 테스트
./gradlew build      # 빌드
./gradlew build -x test  # 테스트 제외 빌드
```

> **주의**: Java 22를 명시적으로 지정해야 할 경우:
> ```bash
> JAVA_HOME=/Users/daeyoungoh/Library/Java/JavaVirtualMachines/openjdk-22.0.2/Contents/Home ./gradlew build -x test
> ```
> Spring Boot 3.2.x는 Java 22 클래스 파일(ASM) 미지원 → 반드시 **3.3.x 이상** 사용

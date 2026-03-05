#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$ROOT_DIR/.pids"

# 이미 실행 중인지 확인
if [ -f "$PID_FILE" ]; then
  echo "⚠️  이미 실행 중입니다. stop.sh를 먼저 실행하세요."
  exit 1
fi

echo "🚀 DEVOTION 서버 시작..."

# ── 백엔드 ──────────────────────────────────────────
cd "$ROOT_DIR/backend"

if [ ! -f ".env" ]; then
  echo "❌ backend/.env 파일이 없습니다. .env.example을 참고해 작성하세요."
  exit 1
fi

set -a && source .env && set +a

./gradlew bootRun --no-daemon > "$ROOT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "  ✅ 백엔드 시작 (PID: $BACKEND_PID) → http://localhost:8080"
echo "     로그: backend.log"

# ── 프론트엔드 ──────────────────────────────────────
cd "$ROOT_DIR/frontend"

if [ ! -f ".env" ]; then
  echo "⚠️  frontend/.env 파일이 없습니다. .env.example을 참고해 작성하세요."
fi

npm run dev > "$ROOT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "  ✅ 프론트엔드 시작 (PID: $FRONTEND_PID) → http://localhost:5173"
echo "     로그: frontend.log"

# PID 저장
echo "$BACKEND_PID $FRONTEND_PID" > "$PID_FILE"

echo ""
echo "📋 stop.sh 로 종료할 수 있습니다."

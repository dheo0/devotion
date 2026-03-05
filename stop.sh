#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$ROOT_DIR/.pids"

if [ ! -f "$PID_FILE" ]; then
  echo "⚠️  실행 중인 서버가 없습니다."
  exit 0
fi

read -r BACKEND_PID FRONTEND_PID < "$PID_FILE"

stop_process() {
  local PID=$1
  local NAME=$2
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID" && echo "  ✅ $NAME 종료 (PID: $PID)"
  else
    echo "  ⚠️  $NAME 는 이미 종료되어 있습니다 (PID: $PID)"
  fi
}

echo "🛑 DEVOTION 서버 종료..."

stop_process "$BACKEND_PID" "백엔드"

# gradlew bootRun은 자식 프로세스(Spring Boot JVM)를 별도로 띄우므로 함께 종료
pkill -f "devotion-backend" 2>/dev/null

stop_process "$FRONTEND_PID" "프론트엔드"

rm -f "$PID_FILE"

echo ""
echo "👋 모든 서버가 종료되었습니다."

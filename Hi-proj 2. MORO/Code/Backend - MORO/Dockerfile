# Python slim 이미지
FROM python:3.10-slim
WORKDIR /app

# 필수 OS 패키지(타임존/빌드 최소)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# 작업 디렉터리
WORKDIR /app

# 의존성 먼저 복사/설치 (레이어 캐시)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 복사
COPY . .

# Cloud Run은 $PORT 환경변수를 주입함
ENV PORT=8080
# gunicorn으로 실행
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080", "--workers", "2", "--threads", "4", "--timeout", "60"]
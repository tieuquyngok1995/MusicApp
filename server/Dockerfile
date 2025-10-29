# ===============================
# 🐳 Dockerfile: lesson-server
# ===============================
FROM node:20-bullseye

# Tạo thư mục làm việc
WORKDIR /app

# Copy và cài dependencies
COPY package*.json ./
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Cài cron
RUN apt-get update && apt-get install -y cron

# Tạo file cron để chạy mỗi giờ
RUN echo "0 * * * * cd /app && npm run build-lessons >> /var/log/cron.log 2>&1" > /etc/cron.d/lesson-cron

# Set quyền thực thi cho cron job
RUN chmod 0644 /etc/cron.d/lesson-cron

# Apply cron job
RUN crontab /etc/cron.d/lesson-cron

# Tạo file log
RUN touch /var/log/cron.log

# Mở port cho API
EXPOSE 9891

# Chạy cả cron và Node server song song
CMD cron && npm start

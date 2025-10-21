
# Learn Node UI - Production Docker Image
# Multi-stage build for optimized production deployment

# ============================================================================
# Build Stage (optional - for future build steps like minification)
# ============================================================================
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Copy source files
COPY src/ ./src/
COPY package*.json ./

# Install build dependencies if needed (currently not required)
# RUN npm ci --only=production

# Future: Add build steps here (minification, optimization, etc.)
# RUN npm run build

# ============================================================================
# Production Stage
# ============================================================================
FROM nginx:1.25-alpine AS production

# Metadata
LABEL maintainer="Daniel Ramirez <dxas90@gmail.com>" \
      description="Learn Node API Explorer - Interactive UI for testing API endpoints" \
      version="1.0.0" \
      org.opencontainers.image.title="Learn Node UI" \
      org.opencontainers.image.description="Interactive UI to explore and test Learn Node API endpoints" \
      org.opencontainers.image.vendor="Daniel Ramirez" \
      org.opencontainers.image.licenses="Apache-2.0" \
      org.opencontainers.image.url="https://github.com/dxas90/learn-node-ui" \
      org.opencontainers.image.documentation="https://github.com/dxas90/learn-node-ui#readme"

# Install runtime dependencies with security considerations
RUN apk add --no-cache \
    tzdata \
    wget \
    unzip \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Create non-root user for better security
RUN addgroup -g 1001 -S nginx-custom && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-custom -g nginx-custom nginx-custom

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy nginx configuration with security headers
COPY ./deploy/default.conf /etc/nginx/conf.d/default.conf

# Copy initialization script with proper permissions
COPY ./deploy/99-fix-access.sh /docker-entrypoint.d/99-fix-access.sh
RUN chmod +x /docker-entrypoint.d/99-fix-access.sh

# Copy custom entrypoint script
COPY ./deploy/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy application files from builder stage (or directly for now)
COPY --chown=nginx-custom:nginx-custom ./src/ ./

# Set proper file permissions
RUN chown -R nginx-custom:nginx-custom /usr/share/nginx/html && \
    chmod -R 644 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \;

# Create nginx cache directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
             /tmp/nginx \
             /var/run/nginx && \
    chown -R nginx-custom:nginx-custom /var/cache/nginx /tmp/nginx /var/run/nginx && \
    chmod -R 755 /var/cache/nginx /tmp/nginx /var/run/nginx

# Configure nginx to run as non-root user and use writable directories
RUN sed -i 's/user nginx;/user nginx-custom;/' /etc/nginx/nginx.conf && \
    sed -i 's|pid        /var/run/nginx.pid;|pid /tmp/nginx/nginx.pid;|' /etc/nginx/nginx.conf && \
    sed -i '/http {/a\    proxy_temp_path /tmp/nginx/proxy_temp;\n    client_body_temp_path /tmp/nginx/client_body_temp;\n    fastcgi_temp_path /tmp/nginx/fastcgi_temp;\n    uwsgi_temp_path /tmp/nginx/uwsgi_temp;\n    scgi_temp_path /tmp/nginx/scgi_temp;' /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Environment variables with defaults
ENV NGINX_WORKER_PROCESSES=auto \
    NGINX_WORKER_CONNECTIONS=1024 \
    NGINX_KEEPALIVE_TIMEOUT=65 \
    API_URL="http://localhost:3000" \
    ENVIRONMENT="production" \
    SHOW_END_RESULT="false"

# Expose port
EXPOSE 80

# Switch to non-root user for Kubernetes security
USER nginx-custom

# Start nginx (will run as user 1001)
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

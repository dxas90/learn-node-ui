#!/bin/sh
set -e

# Create nginx runtime directories if they don't exist (ignore errors if they already exist)
mkdir -p /var/cache/nginx/client_temp \
         /var/cache/nginx/proxy_temp \
         /var/cache/nginx/fastcgi_temp \
         /var/cache/nginx/uwsgi_temp \
         /var/cache/nginx/scgi_temp \
         /tmp/nginx \
         /var/run/nginx 2>/dev/null || true

# Execute the original nginx entrypoint
exec /docker-entrypoint.sh "$@"

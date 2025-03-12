#!/bin/sh

# Read the environment variable for the port (default to 80 if not set)
PORT=${FRONTEND_PORT:-80}

# Generate the Nginx configuration file
cat <<EOF > /etc/nginx/conf.d/default.conf
server {
    listen ${PORT};
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Start Nginx
nginx -g "daemon off;"
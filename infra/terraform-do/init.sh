#!/bin/bash
set -e

# Wait for cloud-init
while [ ! -f /var/lib/cloud/instance/boot-finished ]; do
  sleep 1
done

# Update system
apt-get update
apt-get upgrade -y

# Install Docker Compose plugin
apt-get install -y docker-compose-plugin

# Create app directory
mkdir -p /opt/nellys/data

# Create docker-compose.yml
cat > /opt/nellys/docker-compose.yml <<'EOF'
version: '3.8'

services:
  frontend:
    image: registry.digitalocean.com/nellys-registry/frontend:latest
    ports:
      - "80:80"
    restart: unless-stopped

  backend:
    image: registry.digitalocean.com/nellys-registry/backend:latest
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - DATABASE_PATH=/app/data/database.sqlite
    volumes:
      - /opt/nellys/data:/app/data
    restart: unless-stopped

volumes:
  data:
EOF

# Create empty .env file (user will fill this)
touch /opt/nellys/.env

echo "Setup complete! Edit /opt/nellys/.env then run: cd /opt/nellys && docker compose up -d" > /var/log/setup-complete.log
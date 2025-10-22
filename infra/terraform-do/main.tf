terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "ssh_key_path" {
  description = "Path to your SSH public key"
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}

# SSH Key
resource "digitalocean_ssh_key" "default" {
  name       = "nellys-key"
  public_key = file(var.ssh_key_path)
}

# Container Registry
resource "digitalocean_container_registry" "nellys" {
  name                   = "nellys-registry"
  subscription_tier_slug = "basic"
  region                 = "nyc3"
}

# Droplet
resource "digitalocean_droplet" "nellys" {
  name     = "nellys-prod"
  size     = "s-1vcpu-1gb"
  image    = "docker-20-04"
  region   = "nyc3"
  ssh_keys = [digitalocean_ssh_key.default.fingerprint]

  user_data = file("${path.module}/init.sh")
}

# Firewall
resource "digitalocean_firewall" "nellys" {
  name = "nellys-firewall"
  droplet_ids = [digitalocean_droplet.nellys.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

output "droplet_ip" {
  value = digitalocean_droplet.nellys.ipv4_address
}

output "registry_endpoint" {
  value = digitalocean_container_registry.nellys.endpoint
}

output "next_steps" {
  value = <<-EOT
    
    ✅ Infrastructure Created!
    
    1. SSH into your server:
       ssh root@${digitalocean_droplet.nellys.ipv4_address}
    
    2. Push your images:
       docker login ${digitalocean_container_registry.nellys.endpoint}
       docker tag nellys-api ${digitalocean_container_registry.nellys.endpoint}/api:latest
       docker tag nellys-frontend ${digitalocean_container_registry.nellys.endpoint}/frontend:latest
       docker push ${digitalocean_container_registry.nellys.endpoint}/api:latest
       docker push ${digitalocean_container_registry.nellys.endpoint}/frontend:latest
    
    3. On the server, pull and start:
       cd /opt/nellys
       docker compose pull
       docker compose up -d
    
    4. Visit your site:
       Frontend: http://${digitalocean_droplet.nellys.ipv4_address}
       Backend:  http://${digitalocean_droplet.nellys.ipv4_address}:3000
  EOT
}
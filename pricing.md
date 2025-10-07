# Website Hosting Cost Estimates by Platform

**Requirements:**

- Frontend process
- Backend API process
- Future: Scheduled tasks backend
- Bucket storage (object storage)
- Volume storage (persistent disk)
- Traffic: ~100 visits/month (very low)

---

## 1. AWS (Amazon Web Services)

### Bare Bones Model

**Philosophy:** Minimize costs while maintaining functionality

**Components:**

- **Compute:** 1x t3.micro instance (1 vCPU, 1GB RAM) running both frontend + backend
  - Cost: ~$7.50/month (730 hours)
- **Future Scheduled Tasks:** AWS Lambda
  - Cost: Free tier covers ~1M requests/month
- **Storage - S3 (Bucket):** 5GB
  - Cost: ~$0.12/month
- **Storage - EBS Volume:** 20GB gp3
  - Cost: ~$1.60/month
- **Data Transfer:** 10GB outbound
  - Cost: ~$0.90/month (first 100GB @ $0.09/GB)
- **Public IPv4 Address:** 1 Elastic IP
  - Cost: ~$3.60/month

**Total: ~$13.72/month** (~$165/year)

### Redundant Scalable Model

**Philosophy:** High availability, auto-scaling, production-ready

**Components:**

- **Compute:** 2x t3.small instances across 2 AZs with Auto Scaling Group
  - Cost: ~$30/month (2 instances × $15)
- **Load Balancer:** Application Load Balancer
  - Cost: ~$16.20/month + $0.008/LCU-hour (~$22/month total)
- **Scheduled Tasks:** Lambda + EventBridge
  - Cost: ~$1/month (beyond free tier)
- **Storage - S3:** 10GB with versioning + lifecycle policies
  - Cost: ~$0.25/month
- **Storage - EBS:** 40GB gp3 volumes (2x 20GB)
  - Cost: ~$3.20/month
- **RDS or Database:** t3.micro RDS instance for backend state
  - Cost: ~$15/month
- **Data Transfer:** 20GB outbound
  - Cost: ~$1.80/month
- **Public IPv4:** 2 Elastic IPs
  - Cost: ~$7.20/month
- **CloudWatch Monitoring:** Basic + alarms
  - Cost: ~$3/month
- **Route 53:** Hosted zone
  - Cost: ~$0.50/month

**Total: ~$99.15/month** (~$1,190/year)

---

## 2. Microsoft Azure

### Bare Bones Model

**Components:**

- **Compute:** 1x B1s VM (1 vCPU, 1GB RAM) Linux
  - Cost: ~$7.60/month
- **Future Scheduled Tasks:** Azure Functions Consumption Plan
  - Cost: Free tier (1M executions/month)
- **Storage - Blob Storage:** 5GB
  - Cost: ~$0.10/month
- **Storage - Managed Disk:** 32GB Standard HDD
  - Cost: ~$1.54/month
- **Networking:** Basic bandwidth included
  - Cost: ~$0.90/month (10GB outbound)
- **Public IP:** Standard Static IP
  - Cost: ~$3.60/month

**Total: ~$13.74/month** (~$165/year)

### Redundant Scalable Model

**Components:**

- **Compute:** 2x B2s VMs in Availability Set (2 vCPU, 4GB each)
  - Cost: ~$60/month (2 × $30)
- **Load Balancer:** Standard Load Balancer
  - Cost: ~$18/month + processing rules
- **Scheduled Tasks:** Azure Functions Premium Plan (for VNET integration)
  - Cost: ~$160/month (EP1 instance)
  - Alternative: Keep Consumption Plan at ~$5/month
- **Storage - Blob:** 10GB with redundancy (LRS)
  - Cost: ~$0.25/month
- **Storage - Managed Disks:** 2x 64GB Premium SSD
  - Cost: ~$19/month
- **Database:** Azure SQL Database Basic tier
  - Cost: ~$5/month
- **Application Gateway:** (Alternative to Load Balancer for HTTP(S))
  - Cost: ~$140/month
- **Networking:** 20GB outbound
  - Cost: ~$1.70/month
- **Public IPs:** 2 Standard Static IPs
  - Cost: ~$7.20/month
- **Monitor & Alerts:** Azure Monitor
  - Cost: ~$2/month

**Total with Consumption Functions & Load Balancer: ~$118.15/month** (~$1,418/year)
**Total with Premium Functions & App Gateway: ~$353.15/month** (~$4,238/year)

---

## 3. DigitalOcean

### Bare Bones Model

**Components:**

- **Compute:** 1x Basic Droplet (1 vCPU, 1GB RAM)
  - Cost: $6/month
- **Future Scheduled Tasks:** Use cron on same Droplet
  - Cost: Included
- **Storage - Spaces (Object Storage):** 5GB
  - Cost: $5/month (includes 250GB outbound)
- **Storage - Volume:** 10GB Block Storage Volume
  - Cost: $1/month
- **Bandwidth:** 1TB included with Droplet
  - Cost: Included

**Total: ~$12/month** (~$144/year)

### Redundant Scalable Model

**Components:**

- **Compute:** 2x Droplets (2 vCPU, 2GB each) + Load Balancer
  - Cost: ~$24/month (2 × $12)
- **Load Balancer:** DigitalOcean Load Balancer
  - Cost: $12/month
- **Scheduled Tasks:** Separate Droplet (1 vCPU, 1GB)
  - Cost: $6/month
- **Storage - Spaces:** 10GB Object Storage
  - Cost: $5/month (includes 250GB outbound)
- **Storage - Volumes:** 2x 20GB Block Storage
  - Cost: $4/month (2 × $2)
- **Database:** Managed PostgreSQL Basic Node
  - Cost: $15/month
- **Monitoring:** Free with Droplets
  - Cost: Included
- **Backups:** Automated snapshots (20% of Droplet cost)
  - Cost: ~$8/month

**Total: ~$74/month** (~$888/year)

---

## 4. Other Relevant Platforms

### Linode (Akamai Cloud)

**Bare Bones:**

- 1x Shared Nanode (1GB): $5/month
- Object Storage: $5/month (250GB)
- Block Storage 10GB: $1/month
- **Total: ~$11/month** (~$132/year)

**Redundant Scalable:**

- 2x Linode 2GB: $24/month
- NodeBalancer: $10/month
- Object Storage: $5/month
- Block Storage 40GB: $4/month
- Managed Database (1GB): $15/month
- Backups: ~$5/month
- **Total: ~$63/month** (~$756/year)

### Vultr

**Bare Bones:**

- 1x Cloud Compute (1 vCPU, 1GB): $6/month
- Object Storage 5GB: $5/month
- Block Storage 10GB: $1/month
- **Total: ~$12/month** (~$144/year)

**Redundant Scalable:**

- 2x Cloud Compute (2 vCPU, 2GB): $24/month
- Load Balancer: $10/month
- Object Storage: $5/month
- Block Storage 40GB: $4/month
- Managed Database: $15/month
- **Total: ~$58/month** (~$696/year)

### Railway.app / Render.com (PaaS Options)

**Bare Bones (Railway):**

- Combined frontend + backend deployment
- $5/month usage credit (free for light use)
- **Total: ~$0-10/month** (~$0-120/year)

**Bare Bones (Render):**

- Free tier static site + Web Service ($7/month)
- **Total: ~$7/month** (~$84/year)

---

## Summary Comparison (US-Based Providers)

| Platform | Bare Bones (Monthly) | Redundant Scalable (Monthly) | US Data Centers |
|----------|---------------------|------------------------------|-----------------|
| **AWS** | $13.72 | $99.15 | ✓ Multiple (incl. Virginia) |
| **Azure** | $13.74 | $118.15 - $353.15 | ✓ Multiple (incl. Virginia) |
| **DigitalOcean** | $12.00 | $74.00 | ✓ NYC, SF, Toronto |
| **Linode** | $11.00 | $63.00 | ✓ Multiple US locations |
| **Vultr** | $12.00 | $58.00 | ✓ Multiple US locations |
| **Railway/Render** | $0-10 | N/A | ✓ US-based |

**Note:** Hetzner excluded as European provider with limited US presence.

---

## Recommendations for Virginia-Based 501(c)(3)

### For "Building it the Right Way" at Low Traffic

**Best Value: DigitalOcean or Linode**

- Simple, predictable pricing
- US-based with multiple domestic data centers
- Good documentation and community support
- Easy to scale up as traffic grows
- Includes bandwidth in base cost
- **Start:** Bare bones ($11-12/month)
- **Scale to:** Redundant model when traffic increases

### If Long-Term Commitment to Major Cloud

**AWS or Azure for Enterprise Future & Grant Compliance**

- AWS has major data center presence in Virginia (us-east-1)
- Better for eventual enterprise donors/partners
- More services for complex requirements
- May be preferred/required by certain grants
- Some foundations prefer major cloud providers for security/compliance
- **Start:** Bare bones with reserved instances
- **Alternative:** AWS Lightsail (simplified AWS) at $5-10/month

### Most Cost-Effective Domestic: Linode or Vultr

- Excellent performance-to-price ratio
- US-based companies with domestic support
- Strong uptime SLAs
- **Good for:** Budget-conscious nonprofits

### Easiest to Start: Railway or Render

- Minimal DevOps overhead
- Git-based deployments
- Great for MVP and early development
- Can migrate to infrastructure later
- US-based platforms

### Special Considerations for 501(c)(3)

1. **AWS Nonprofit Credits:** AWS offers credits through TechSoup/AWS Activate for nonprofits
2. **Azure Nonprofit Grants:** Microsoft has nonprofit programs with free/discounted credits
3. **Google for Nonprofits:** GCP also offers nonprofit credits (not detailed above but ~$15-100/month pricing)
4. **Donor Perception:** Some major donors may expect "enterprise-grade" hosting
5. **Data Sovereignty:** Keep donor data in US jurisdiction
6. **Documentation:** IaC helps with audit trails for grants/compliance

### Recommended Path for Your Organization

**Option A: Start Lean (Recommended)**

1. Begin with DigitalOcean at $12/month
2. Apply for AWS nonprofit credits for future use
3. Build with Terraform for easy migration later
4. Move to AWS when traffic/grants justify it

**Option B: Start Enterprise-Ready**

1. Begin with AWS using nonprofit credits
2. Use AWS Lightsail ($5-10/month) or EC2 bare bones
3. Build with AWS CDK or Terraform
4. You're ready for enterprise donors/partners from day one

**Option C: Zero-Cost Start**

1. Use Railway free tier or Render free tier
2. Pay only when traffic exceeds free limits
3. Migrate to DigitalOcean/AWS when needed

---

## Infrastructure as Code (IaC) Support

### Excellent IaC Support (Tier 1)

**AWS**

- **AWS CDK:** Native first-class support (TypeScript, Python, Java, C#, Go)
- **Terraform:** Complete provider with 100% resource coverage
- **CloudFormation:** AWS-native IaC (JSON/YAML)
- **Pulumi:** Full support across all AWS services
- **Best for:** Teams wanting type-safe infrastructure with CDK or maximum ecosystem with Terraform

**Azure**

- **Terraform:** Excellent AzureRM provider, actively maintained
- **Azure Bicep:** Microsoft's native IaC language (successor to ARM templates)
- **ARM Templates:** JSON-based native solution
- **Pulumi:** Full Azure support
- **AWS CDK for Terraform (CDKTF):** Can use CDK patterns with Terraform backend
- **Best for:** Teams comfortable with Microsoft ecosystem or Terraform veterans

**DigitalOcean**

- **Terraform:** Official DO provider with comprehensive resource coverage
- **Pulumi:** Official support for all DO resources
- **doctl + scripts:** CLI-based automation option
- **Best for:** Simple, clean IaC with Terraform; excellent documentation

**Google Cloud Platform** (not in original comparison)

- **Terraform:** Extensive google/google-beta providers
- **GCP Deployment Manager:** Native IaC
- **Pulumi:** Full GCP support
- **Note:** GCP pricing competitive with AWS/Azure (~$15-100/month for similar setups)

### Good IaC Support (Tier 2)

**Linode (Akamai)**

- **Terraform:** Official Linode provider with good coverage
- **Pulumi:** Official Linode support
- **Linode CLI + Ansible:** Common automation pattern
- **Best for:** Terraform users wanting simpler pricing than AWS/Azure

**Vultr**

- **Terraform:** Official Vultr provider
- **Pulumi:** Community support
- **Vultr API + scripts:** Direct API automation
- **Best for:** Teams comfortable with Terraform basics

### Limited IaC Support (Tier 3)

**Hetzner Cloud** *(European - Not recommended for US 501(c)(3))*

- **Terraform:** Community provider (hetznercloud/hcloud) - well-maintained
- **Pulumi:** Community support via Terraform bridge
- **Ansible:** Common choice for Hetzner automation
- **Note:** Europe-based, better options exist for US nonprofits

**Railway.app**

- **Railway CLI + configuration files:** Git-based deploys
- **Limited Terraform support:** Minimal, platform abstracts infrastructure
- **Best for:** Teams wanting to avoid infrastructure management

**Render.com**

- **render.yaml:** Declarative configuration file
- **No Terraform provider:** Platform abstracts infrastructure layer
- **Best for:** Developers wanting zero infrastructure management

---

## IaC Tooling Recommendations by Platform

### AWS CDK Best Practices

```typescript
// Example: Define entire stack type-safely
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

// Great for: Complex AWS architectures
// Learning curve: Medium-High
// Team fit: TypeScript/Python developers
```

### Terraform Universal Approach

```hcl
# Works across AWS, Azure, DO, Linode, Vultr
# Example: Multi-cloud or cloud-agnostic setup
provider "digitalocean" {
  token = var.do_token
}

# Great for: Platform flexibility, large ecosystems
# Learning curve: Medium
# Team fit: DevOps teams, multi-cloud strategies
```

### Pulumi for Modern Teams

```python
# Type-safe IaC in real programming languages
import pulumi
import pulumi_aws as aws

# Great for: Teams wanting familiar languages
# Learning curve: Low-Medium (if you know the language)
# Team fit: Software engineers doing infrastructure
```

---

## Building "The Right Way" with IaC Considerations

For 100 visits/month, the "right way" doesn't necessarily mean the most expensive:

1. **Start Simple:** Use bare bones DigitalOcean/Linode setup
2. **Add Monitoring:** Set up basic monitoring from day one
3. **Document with IaC:** Maintain infrastructure as code from day one
4. **Plan for Scale:** Design architecture to scale horizontally
5. **Add Redundancy When Needed:** Move to redundant model when traffic justifies it (>10,000 visits/month)

**Sweet Spot for Your Use Case:** $15-25/month with room to scale

---

## IaC Strategy Recommendations

### Scenario 1: Small Team, Price Sensitive

**Platform:** DigitalOcean or Linode  
**IaC Tool:** Terraform  
**Why:** Simple resources, excellent Terraform support, easy to learn, portable to other clouds later

### Scenario 2: AWS Experience, Complex Future

**Platform:** AWS  
**IaC Tool:** AWS CDK (TypeScript/Python)  
**Why:** Type safety prevents errors, excellent for complex orchestration, native AWS integration

### Scenario 3: Multi-Cloud Strategy

**Platform:** Start with any Tier 1/2 provider  
**IaC Tool:** Terraform or Pulumi  
**Why:** Platform agnostic, can migrate or span clouds without rewriting infrastructure code

### Scenario 4: Microsoft/.NET Shop

**Platform:** Azure  
**IaC Tool:** Bicep or Terraform  
**Why:** Bicep native to Azure with great VS Code support; Terraform if planning multi-cloud

### Scenario 5: Startup MVP, Minimize DevOps

**Platform:** Railway or Render  
**IaC Tool:** None (use platform config files)  
**Why:** Focus on product, not infrastructure; migrate to IaC when scaling demands it

---

## IaC Migration Path

**Start Small → Scale Up:**

1. **Month 1-3:** Railway/Render with config files (no IaC needed)
2. **Month 4-6:** Migrate to DigitalOcean with Terraform (introduce IaC)
3. **Month 7+:** Add modules, separate environments (dev/staging/prod)
4. **Year 2:** Consider AWS/Azure if complexity demands it

**Start Right → Enterprise Ready:**

1. **Day 1:** AWS/Azure with Terraform or CDK
2. **Week 1:** Set up CI/CD for infrastructure deployments
3. **Month 1:** Separate environments with identical IaC
4. **Ongoing:** Version control all infrastructure changes

---

## Sample IaC Complexity by Platform

| Platform | Lines of Code (Bare Bones) | Lines of Code (Redundant) | Maintainability |
|----------|---------------------------|---------------------------|-----------------|
| **AWS CDK** | ~80-120 | ~300-500 | High (type-safe) |
| **AWS Terraform** | ~50-80 | ~200-350 | High (mature) |
| **Azure Terraform** | ~60-90 | ~220-380 | High (mature) |
| **DO Terraform** | ~30-50 | ~100-150 | Very High (simple) |
| **Linode Terraform** | ~30-50 | ~100-150 | Very High (simple) |
| **Hetzner Terraform** | ~25-40 | ~80-120 | Medium (community) |
| **Railway** | ~10-20 (YAML) | N/A | Very High (declarative) |

**Key Insight:** Simpler platforms require less IaC code, but major cloud providers offer more services to orchestrate as you scale.

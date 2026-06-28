# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Quetta Coffee Shop — AWS Platform Engineering

Static site deployed on AWS using a professional DevOps/SRE/SecOps stack. Everything runs on **free tier — zero charges**.

**Stack:** Terraform → Ansible → Docker/ECR → GitHub Actions → ECS (EC2) → ALB → CloudFront

**No Packer. No Fargate. No NAT Gateway. No RDS. No EKS. No WAF.**

---

## AWS Account
- Account ID: `755749009311` | User: `Ahmad_Jamal` | Region: `ap-south-1`

---

## Architecture

```
git push
  └── GitHub Actions (.github/workflows/deploy.yml)
        ├── Gitleaks       → secrets scan
        ├── Semgrep        → SAST code scan
        ├── Docker build
        ├── Trivy          → CVE image scan
        ├── ECR push       → 755749009311.dkr.ecr.ap-south-1.amazonaws.com/quetta-coffee-shop
        ├── Terraform apply
        ├── ECS force-deploy
        └── CloudFront invalidation

Internet → CloudFront (HTTPS/ACM) → ALB (port 80) → ECS Service → EC2 t3.micro
                                                                         └── Docker container (nginx:alpine)

Monitoring: CloudWatch alarms → SNS → email
SecOps:     GuardDuty + CloudTrail + AWS Config
```

---

## Repository Structure

```
quetta-coffee-shop/
├── app/
│   ├── index.html          ← single-page static site
│   ├── style.css           ← all CSS vars on :root (--gold-*, --bg-*, --text-*)
│   └── app.js              ← vanilla JS, no bundler, no imports
├── Dockerfile              ← nginx:alpine serving app/
├── terraform/
│   ├── main.tf             ← provider (aws, ap-south-1) + S3 backend
│   ├── variables.tf        ← all input variables
│   ├── outputs.tf          ← ALB DNS, CloudFront URL, ECR URL, ECS cluster
│   ├── vpc.tf              ← VPC + 2 public subnets + IGW + route table (no NAT)
│   ├── security.tf         ← security groups: alb-sg (80/443), ec2-sg (from alb only)
│   ├── iam.tf              ← EC2 instance profile: ECR + ECS + CloudWatch + S3
│   ├── ecr.tf              ← ECR repository
│   ├── ec2.tf              ← t3.micro, Amazon Linux 2023 (data source), ECS agent user_data
│   ├── ecs.tf              ← ECS cluster + task definition + service (EC2 launch type)
│   ├── alb.tf              ← ALB + target group + listener (port 80)
│   ├── cloudfront.tf       ← CloudFront distribution → ALB origin + ACM cert
│   ├── s3.tf               ← assets bucket + TF state bucket (versioning on)
│   └── cloudwatch.tf       ← CPU/memory/5xx alarms + SNS topic (email)
├── ansible/
│   ├── inventory.yml       ← EC2 host (populated after terraform output)
│   └── playbook.yml        ← install Docker, configure ECS agent + CloudWatch agent
└── .github/workflows/
    └── deploy.yml          ← full 8-stage CI/CD pipeline
```

---

## Phase Status

| Phase | What | Status |
|-------|------|--------|
| 1 | Packer | **REMOVED** — use Amazon Linux 2023 AMI via data source |
| 2 | Terraform | **ACTIVE** |
| 3 | Ansible | Pending |
| 4 | Docker | Pending |
| 5 | GitHub Actions | Pending |
| 6 | SRE + SecOps | Pending |

---

## Commands

### Terraform (Phase 2)
```bash
# Working directory
cd /home/jamalafridi/quetta-coffee-shop/terraform

# One-time init (downloads providers, configures S3 backend)
terraform init

# Preview all changes
terraform plan -var-file="terraform.tfvars"

# Apply infrastructure
terraform apply -var-file="terraform.tfvars"

# Tear down everything
terraform destroy -var-file="terraform.tfvars"

# See outputs (ALB DNS, CloudFront URL, ECR URL)
terraform output
```

### Ansible (Phase 3)
```bash
cd /home/jamalafridi/quetta-coffee-shop/ansible

# Test connectivity
ansible -i inventory.yml all -m ping

# Run full configuration playbook
ansible-playbook -i inventory.yml playbook.yml
```

### Docker (Phase 4)
```bash
cd /home/jamalafridi/quetta-coffee-shop

# Build image
docker build -t quetta-coffee-shop:latest .

# Test locally
docker run -d -p 8080:80 quetta-coffee-shop:latest
# Visit: http://localhost:8080

# Authenticate to ECR
aws ecr get-login-password --region ap-south-1 \
  | docker login --username AWS --password-stdin \
    755749009311.dkr.ecr.ap-south-1.amazonaws.com

# Tag and push
docker tag quetta-coffee-shop:latest \
  755749009311.dkr.ecr.ap-south-1.amazonaws.com/quetta-coffee-shop:latest

docker push \
  755749009311.dkr.ecr.ap-south-1.amazonaws.com/quetta-coffee-shop:latest
```

### Preview app locally (no server needed)
```bash
# Linux
xdg-open /home/jamalafridi/quetta-coffee-shop/app/index.html
```

---

## Frontend Notes

- **Theming:** All colors are CSS vars on `:root` in `app/style.css`. Change `--gold-*` variables to retheme — never hardcode hex values.
- **`.gold-text`** uses `-webkit-background-clip: text`. Never set `color:` on elements with this class.
- **`app/app.js`** — vanilla JS, no framework. Menu tab filtering uses `data-category` + `.hidden` class. Contact form submit is UI-only (no backend).
- **`IntersectionObserver`** used in three places: hero reveal (`.reveal-up`), nav active highlight, card entrance animations.

---

## Free Tier Constraints (never violate)
- EC2: `t3.micro` only (750 hrs/month free)
- No NAT Gateway (costs money)
- No Fargate (costs money)
- No WAF (costs money)
- ECS launch type: **EC2**, not Fargate
- GuardDuty: 30-day free trial — enable, use, disable before day 30
- CloudFront + S3 + ECR: free tier limits apply, static site easily stays within

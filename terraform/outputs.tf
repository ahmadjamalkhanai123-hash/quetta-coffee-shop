output "alb_dns" {
  description = "ALB DNS — your site URL until CloudFront is enabled"
  value       = "http://${aws_lb.main.dns_name}"
}

output "ecr_url" {
  description = "ECR repository URL — used in docker push"
  value       = aws_ecr_repository.app.repository_url
}

output "ec2_public_ip" {
  description = "EC2 public IP — used in Ansible inventory"
  value       = aws_instance.ecs_host.public_ip
}

output "ecs_cluster" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "private_key_path" {
  description = "Path to SSH private key for Ansible"
  value       = "${path.module}/../quetta-key.pem"
  sensitive   = true
}

# Uncomment after CloudFront is enabled:
# output "cloudfront_url" {
#   value = "https://${aws_cloudfront_distribution.main.domain_name}"
# }

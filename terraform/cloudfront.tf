# CloudFront DISABLED — AWS account requires verification before CloudFront can be used.
# Steps to re-enable:
#   1. Contact AWS Support: https://console.aws.amazon.com/support/home#/
#   2. Request: "Please verify my account to use CloudFront"
#   3. After verification: uncomment this entire file and run terraform apply
#
# resource "aws_cloudfront_distribution" "main" {
#   enabled         = true
#   price_class     = "PriceClass_100"
#   http_version    = "http2"
#
#   origin {
#     domain_name = aws_lb.main.dns_name
#     origin_id   = "alb-origin"
#
#     custom_origin_config {
#       http_port              = 80
#       https_port             = 443
#       origin_protocol_policy = "http-only"
#       origin_ssl_protocols   = ["TLSv1.2"]
#     }
#   }
#
#   default_cache_behavior {
#     allowed_methods        = ["GET", "HEAD"]
#     cached_methods         = ["GET", "HEAD"]
#     target_origin_id       = "alb-origin"
#     viewer_protocol_policy = "redirect-to-https"
#     compress               = true
#
#     forwarded_values {
#       query_string = false
#       cookies { forward = "none" }
#     }
#
#     min_ttl     = 0
#     default_ttl = 3600
#     max_ttl     = 86400
#   }
#
#   restrictions {
#     geo_restriction { restriction_type = "none" }
#   }
#
#   viewer_certificate {
#     cloudfront_default_certificate = true
#   }
#
#   tags = { Name = "${var.project}-cf" }
# }

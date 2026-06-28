variable "region" {
  default = "ap-south-1"
}

variable "project" {
  default = "quetta-coffee-shop"
}

variable "account_id" {
  default = "755749009311"
}

variable "alert_email" {
  description = "Email address for CloudWatch alarm notifications"
  type        = string
}

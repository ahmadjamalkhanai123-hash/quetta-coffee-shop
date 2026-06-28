terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    bucket = "quetta-tfstate-755749009311"
    key    = "quetta-coffee-shop/terraform.tfstate"
    region = "ap-south-1"
  }
}

provider "aws" {
  region = var.region
}

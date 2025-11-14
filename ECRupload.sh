#!/bin/bash

AWS_REGION="us-east-2"
AWS_ACCOUNT_ID="211125441695"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
BACKEND_IMAGE="crane-finder-backend"

aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

docker build --no-cache \
  -t ${BACKEND_IMAGE}:latest \
  --platform linux/amd64 \
  -f backend/Dockerfile \
  ./backend


docker tag ${BACKEND_IMAGE}:latest ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest


docker push ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest

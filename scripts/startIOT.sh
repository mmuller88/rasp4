#!/bin/bash

# DEPLOYMENT_GROUP_NAME wird vom AWS Agenten mitgegeben und ist z.B. rasp4-dev
# Generiere Stage z.B. dev aus Agentenvariable DEPLOYMENT_GROUP_NAME
export STAGE="${DEPLOYMENT_GROUP_NAME:16}"

# load secretes from AWS . If you don't want that you can comment that out and set the secret.env yourself
cd /home/ubuntu/git/rasp4/
npm install aws-sdk
rm -rf secret.env
node scripts/secret-manager-to-env.js

echo 'start IOT stuff'
cd /home/ubuntu/git/rasp4
docker-compose down
docker-compose up -d --build
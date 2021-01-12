#!/bin/bash
echo 'start IOT stuff'
cd /home/ubuntu/git/rasp4
docker-compose down
docker-compose up -d --build
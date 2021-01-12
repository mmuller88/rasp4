#!/bin/bash

# Zugriff zu den Stage Accounts ist notwendig für z.B. dem Secrets Manager
# use 'source init.sh' um diese Funktion im Terminal benutzen zu können. Kommentiere den Rest ggf. aus!
function createAccount {
    [[ -z "$2" ]] && { echo "Parameter $2 is empty" ; exit 1; }
    [[ -z "$3" ]] && { echo "Parameter $3 is empty" ; exit 1; }

    aws --profile $1 configure set aws_access_key_id $2
    aws --profile $1 configure set aws_secret_access_key $3
    aws --profile $1 configure set region ${AWS_REGION}
}

[[ -z "$INSTANCE_NAME" ]] && { echo "Parameter INSTANCE_NAME is empty. E.g.: CodeDeployVM" ; exit 1; }

AWS_REGION=${AWS_REGION:-"eu-central-1"}

sudo apt update -y
sudo apt upgrade -y

sudo apt install awscli -y
aws --version

createAccount default ${AWS_ACCESS_KEY_ID} ${AWS_SECRET_ACCESS_KEY}

sudo apt-get remove docker docker-engine docker.io containerd runc -y

curl -sSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

## Install docker-compose
sudo apt-get install -y libffi-dev libssl-dev
sudo apt-get install -y python3 python3-pip
sudo apt-get remove python-configparser
sudo pip3 -v install docker-compose

# Install Tools
sudo apt install git htop iftop mc wget nodejs npm jq ruby -y

wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto > /tmp/logfile
#  ./install auto -v releases/codedeploy-agent_1.1.1-1850_all.deb

# Check if agent running
sudo service codedeploy-agent status
# dpkg -s codedeploy-agent

# Register VM
aws deploy register \
    --instance-name ${INSTANCE_NAME} \
    --tags Key=Name,Value=${INSTANCE_NAME} \
    --region ${AWS_REGION}

sudo aws deploy install --config-file codedeploy.onpremises.yml --region ${AWS_REGION}

# docker network genutzt zwischen den Docker Compose Deployments
# docker network create server-net || true
#  aws deploy deregister-on-premises-instance --instance-name Rasp4VM
#  aws deploy install --config-file codedeploy.onpremises.yml --region eu-central-1 --agent-installer s3://aws-codedeploy-us-west-2/latest/codedeploy-agent.msi
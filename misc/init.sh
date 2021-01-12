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
# sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
# sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"


curl -sSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

## Install docker-compose
sudo apt-get install -y libffi-dev libssl-dev
sudo apt-get install -y python3 python3-pip
sudo apt-get remove python-configparser
sudo pip3 -v install docker-compose

# Install Tools
# sudo apt update -y
sudo apt install git htop iftop mc wget nodejs npm jq ruby -y
# sudo snap install ruby --channel=2.5/stable --classic

### Install AWS Cli v2
#curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"
# unzip awscliv2.zip
# sudo ./aws/install
# sudo apt install python3-pip -y
#python3 -m pip install aws-cli
# pip3 install docker-compose

#  apt-get install awscli -y

# createAccount wtf ${AWS_ACCESS_KEY_ID_WTF} ${AWS_SECRET_ACCESS_KEY_WTF}
# createAccount dev ${AWS_ACCESS_KEY_ID_DEV} ${AWS_SECRET_ACCESS_KEY_BUILD_DEV}
# createAccount qa ${AWS_ACCESS_KEY_ID_QA} ${AWS_SECRET_ACCESS_KEY_QA}
# createAccount prod ${AWS_ACCESS_KEY_ID_PROD} ${AWS_SECRET_ACCESS_KEY_PROD}

# cat ~/.aws/credentials

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
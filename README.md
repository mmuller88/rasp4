# rasp4

That is a git repo for remote control my Raspberry 4 via AWS CodeDeploy & AWS CDK. Basically I only will need to push stuff here and that get installed and executed on my Raspberry 4. Very cool or? Write me for any questions / ideas.

## AWS CDK & Deploy specifics

I use AWS CDK for the deployment. AWS CDK is an abstraction on top of AWS Cloudformation which uses a higher abstraction language like TypeScript. Under the hood AWS CDK produces Cloudformation templates and applies them. Find out more about AWS CDK on my blog post side <https://martinmueller.dev/tags/cdk>

cdk bootstrap aws://981237193288/eu-central-1

## Deploy

```bash
yarn build
yarn deploy [--profile X]
```

## InfluxDB Backup

For the backup you need to put your in ./../.secrets

```bash
AWS_ACCESS_KEY_ID=AKIA6I5SLLxx
AWS_SECRET_ACCESS_KEY=7PBRSlGhZoovOxx
```

## Tosmato Specifics

### MQTT

If you want to send MQTT commands to your Tosmator devices install:

```bash
sudo apt-get install mosquitto-clients
mosquitto_sub -t "test"
```

### additional

Reduce Power usage time from 5m to 10s
mosquitto_pub -h rasp4.alfpro.net -t "cmnd/tasmota/TelePeriod" -m 10

#
3 Raspberry 4 Specifics

...

### Preparation

Install the supported Ubuntu Image <https://ubuntu.com/download/raspberry-pi> on your Raspberry 4. For me this image worked ubuntu-20.04.1-preinstalled-server-arm64+raspi.img.xz

Install a lot stuff more on it like git, docker, docker-compose, aws cli and so on. Use the script for those:

```
./misc/init.sh
```

As well I disabled systemd-resolve for using port 53 as I want to use [Pi-hole](https://github.com/pi-hole/pi-hole) with that instructions <https://www.linuxuprising.com/2020/07/ubuntu-how-to-free-up-port-53-used-by.html> .

I do use Pi-hole as DNS and DHCP Server

- <https://blog.cryptoaustralia.org.au/instructions-for-setting-up-pi-hole/#:~:text=Click%20on%20the%20settings%20menu,settings%20provided%20should%20be%20ok>.
- permanently change /etc/resolv.conf on Ubuntu <https://www.tecmint.com/set-permanent-dns-nameservers-in-ubuntu-debian/>

#### SSH Key

<https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04>

#### Troubeshooting

CodeDeploy Agent logs are in /var/log/aws/codedeploy-agent/codedeploy-agent.log

- Kill docker with:

```bash
ps -A | grep docker
kill -9 1321
sudo systemctl enable docker
sudo systemctl start docker
```

- Uninstall docker:

```bash
sudo apt-get purge docker-ce
dpkg -l | grep -i docker
sudo apt-get purge -y docker-engine docker docker.io docker-ce
sudo apt-get autoremove -y --purge docker-engine docker docker.io docker-ce

sudo rm -rf /var/lib/docker /etc/docker
sudo rm /etc/apparmor.d/docker
sudo groupdel docker
sudo rm -rf /var/run/docker.sock
```

Sometimes the AWS CodeDeploy Agent can't delete the existing files and folders than use :

```bash
sudo rm -rf .gitignore .eslintrc.json .github .mergify.yml .npmignore .projen .projenrc.js .secret.example .versionrc.json .vscode
sudo rm -rf LICENSE README.md appspec.yml docker-compose.yml misc package.json preact-netlify scripts services src test tsconfig.jest.json tsconfig.json version.json yarn.lock
```

## Thanks To

- gcgarner with <https://github.com/gcgarner/IOTstack> . It helps me to create my IOT stack for my Raspberry 4
- The AWS CDK Community for the repo tool [projen](https://github.com/projen/projen) which I use for this repo
- Ahmed ElHaw for the blog [Automating deployments to Raspberry Pi devices using AWS CodePipeline](https://aws.amazon.com/blogs/devops/automating-deployments-to-raspberry-pi-devices-using-aws-codepipeline/)

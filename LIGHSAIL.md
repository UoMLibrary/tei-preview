# Installing on lightsail

## Create an instance

Linux, Ubuntu 22

## Create a static IP and associate with instance

[Create a static IP](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/lightsail-create-static-ip)

## Create a record in Route 53 for the sub/domain

Create an A record for the subdomain and point it to the static IP address created above.

## Install [[nginx]]

```bash
sudo apt update
sudo apt install nginx
# Do not need to setup the ufw firewall on lightsail, use the Network interface in the dashboard
```

If there are any problems

```bash
# Check status
sudo systemctl status nginx
# Start
sudo systemctl start nginx
```

## Install docker

See [Install Docker](https://docs.docker.com/engine/install/ubuntu/). Login using terminal in lightsail dashboard

```bash
# Update apt package index
sudo apt-get update
# allow apt over https
sudo apt-get install ca-certificates curl gnupg
# Add dockers official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Setup the repository

```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

install docker

```bash
# Update the apt package index
sudo apt-get update
# install docker engine
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
# test
sudo docker run hello-world
```

## Configure docker to run tei-preview

```bash
# Run docker preview NOTE: This will have Cross Site Scripting errors when calling back to the server. To fix see 'Fixing the cross site scripting issue' below.
sudo docker run --rm -p 3000:3000 --name preview -d abitofcode/tei-preview:4
# Check
sudo docker ps
```

## Configure nginx to point to Docker container

1. Start the docker container (see above)
2. Create a new server block configuration file in the `sites-available` directory

```bash
sudo nano /etc/nginx/sites-available/preview.digitallibrarytools
.com
```

3. Add the following, changing the domain and port to your values. This configuration sets up a reverse proxy from Nginx to your Docker container, forwarding HTTP requests from the specified domain to the Docker container running on `localhost:3000`.

```bash
server {
	listen 80;
	 server_name preview.digitallibrarytools.com;

	 location / {
		 proxy_pass http://localhost:3000;
		 proxy_set_header Host $host;
		 proxy_set_headerX-Real-IP $remote_addr;
		 proxy_set_header X-Forwarded-For$proxy_add_x_forwarded_for;
		 proxy_set_header X-Forwarded-Proto $scheme;
	 }
}
```

4. Create a symbolic link from the `sites-available` directory to the `sites-enabled` directory to enable the server block:

```bash
sudo ln -s /etc/nginx/sites-available/preview.digitallibrarytools.com /etc/nginx/sites-enabled/
```

5. Test the Nginx configuration for syntax errors:

```bash
sudo nginx -t
```

6. Restart Nginx to apply the changes:

```bash
sudo systemctl restart nginx
```

The preview tool running in the docker container should now be available at `http://<static-ip-address>.` The load XSLT function will not work at the moment due to a Cross Site scripting Error.

## Setup lightsail to use https

[Secure Nginx with Lets encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)

1. Check nginx is pointing to docker container
2. [Install certbot](https://www.inmotionhosting.com/support/website/ssl/lets-encrypt-ssl-ubuntu-with-certbot/) on the server using snapd

```bash
# Install snapd
sudo apt install snapd
# Ensure you have the latest snapd version installed
sudo snap install core; sudo snap refresh core
# Install Certbot with snapd
sudo snap install --classic certbot
# Create a symlink to ensure Certbot runs
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

3. Create an SSL Certificate with Certbot

```bash
# Create SSL certs for all domains and configure redirects in the web server
sudo certbot --nginx
```

4. Open port 443 in the Lightsail instance

## SSL Maintenance

```bash
# The certificates are stored in
cd /etc/letsencrypt/live
# Let’s Encrypt certificates expire after 90 days. To prevent SSLs from expiring, Certbot checks your SSL status twice a day and renews certificates expiring within thirty days. You can view settings with Systemd
systemctl show certbot.timer
# or cron.d
cat /etc/cron.d/certbot
# Ensure the renewal process works
sudo certbot renew --dry-run
```

## SSL improvements (HSTS header)

https://www.inmotionhosting.com/support/server/nginx/nginx-hsts/

## Fixing the cross site scripting issue

The domain needs to be passed in as an environment variable to prevent cross site scripting errors.

```bash
sudo docker run -p 3000:3000 --restart=always --name preview -e ORIGIN=https://preview.digitallibrarytools.com -d abitofcode/tei-preview:4
```

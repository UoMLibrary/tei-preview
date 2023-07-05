# Digital collection preview tool

## Running in dev mode

```bash
git clone <repo>
cd <repo>
npm install
# start the preview app and manually open a browser
npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building a docker image

```bash
# Build the image and tag it as web_preview
docker build --tag web_preview .
```

## Running the local docker image

```bash
# Start a container using the web_preview image in detached moded and open up port 3000 on the container to the host. By setting a name `preview`
docker run --rm -p 3000:3000 --name preview -d web_preview
# We can stop the container using docker stop preview
```

## Running a docker image from dockerhub

```bash
docker run --rm -p 3000:3000 --name preview -d abitofcode/web_preview
```

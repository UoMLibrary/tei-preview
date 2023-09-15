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
# Build the image and tag it as tei-preview
docker build --tag web-tei-preview .
```

## Building for Multiplatform

Run a multiplatform build and push it to dockerhub

```bash
# Requires a login to the docker hub to be pushed to
docker login
docker buildx create --use
docker build --push --platform linux/amd64,linux/arm64/v8 --tag abitofcode/web-tei-preview:1 .
```

## Running the local docker image

```bash
# Start a container using the tei-preview image in detached mode and open up port 3000 on the container to the host. By setting a name `preview`
docker run --rm -p 3000:3000 --name preview -d tei-preview
# We can stop the container using docker stop preview
```

## Running a docker image from dockerhub

The latest version of the tei preview app can be run from dockerhub

```bash
docker run --rm -p 127.0.0.1:3000:3000 --name preview -d abitofcode/web-tei-preview:1
```

The extras folder contains some example Manchester TEI content and configuration files for Manchester, Lancaster and Cambridge.

## Routes

There are currently 2 routes in the tool

- preview/tool - Where the pipeline is out in the open and the XSLT can be configured
- preview - A simpler version with preconfigured XSLT to help with previewing TEIs

# Digital collection preview tool

# web-tei-preview

**NOTE: PAT for web-tei-preview Needs renewing 05 Aug 2025 and adding back to Secrets in mdc-tools GitHub Repository**

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

## Opening up some routes for POST

In the _svelte.config.js_ file

```javascript
// The following disabled as the logic for performing the csrf check has been implemented
// in hooks.server.js to allow a specifiv POST route from a specified origin. This allows
// us to POST data to the preview tool from a tool with a different origin.
csrf: {
	checkOrigin: false;
}
```

We handle the csrf check in _hooks.server.js_

```javascript
// Specify routes to allow POST data
let allowedPOSTPaths = ['/preview/posted'];
// Specify Origins able to send POST data
let allowedOrigins = [
	'http://localhost:5173',
	'http://192.168.1.176:5173',
	'https://tools.digitallibrarytools.com'
];
```

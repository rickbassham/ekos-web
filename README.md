# ekos-web

A simple web server and client that listens for a connection from KStars Ekos
and provides an easy way to keep track of your astrophotography session from a
small screen.

You can't control Ekos with it (yet) but you can see the last image taken,
GPS, mount, guider, focus, capture, and alignment status.

## Installation

First checkout the code.

```bash
git clone https://github.com/rickbassham/ekos-web
cd ekos-web
```

### Docker

Checkout the code from the repo, build the docker image, and run.

```bash
docker build -t ekos-web .
docker run -p 3000:3000 -it ekos-web
```

### Manual

You need node.js installed to run manually.

```bash
cd client
npm install
npm run build
cp -r dist/ ../server/static
cd ../server
npm install
node index.js
```

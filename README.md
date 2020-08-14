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

After you have it running, you can visit http://localhost:3000 to view the page.

![ekos-web](docs/1.png)

Now launch KStars and Ekos as usual, but now you'll need to connect to KStars Live
in offline mode.

![ekos](docs/ekos.png)

![ekos](docs/ekos-live.png)

The username and password you use here don't matter, they are ignored by this app.

Now connect to you equipment in Ekos as usual and start your astrophotography
session.

You can keep an eye on your equipment now on your smartphone or tablet by browsing to your
imaging computer's address. For me, it would be http://rick-astrobuntupi:3000.

Here are a few more shots with examples.

![ekos-web](docs/2.png)
![ekos-web](docs/3.png)
![ekos-web](docs/4.png)
![ekos-web](docs/5.png)
![ekos-web](docs/6.png)

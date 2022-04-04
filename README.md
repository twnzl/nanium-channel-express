# nanium-channel-express

A nanium request channel based on express using a single endpoint.

<div style="background-color: #fbb; color: #f66; padding: 1rem; border: solid 1px #f66">
<div style="font-weight: bold;">DEPRECATED:</div>
This package is no longer necessary. the NaniumHttpChannel from core package <a href="https://www.npmjs.com/package/nanium">nanium</a> now also excepts an express-like app for its configuration property "server".
</div>

## Install

```bash
npm install nanium-channel-express
```

## Usage

```ts
import { Nanium } from 'nanium/core';
import { NaniumExpressHttpChannel } from 'nanium-channel-express';
import * as express from 'express';

const expressApp: express.Express = express();

await Nanium.addManager(new NaniumNodejsProvider({
	requestChannels: [
		new NaniumExpressHttpChannel({
			apiPath: '/api',
			server: expressApp
		})
	]
}));
```

This creates a single endpoint '/api' where requests can send via HTTP POST.

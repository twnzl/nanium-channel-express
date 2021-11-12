# nanium-channel-express

A nanium request channel based on express using a single endpoint.

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

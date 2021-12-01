import { IncomingMessage, ServerResponse } from 'http';
import * as express from 'express';
import { RequestChannelConfig } from 'nanium/interfaces/requestChannelConfig';
import { RequestChannel } from 'nanium/interfaces/requestChannel';
import { NaniumRepository } from 'nanium/interfaces/serviceRepository';
import { NaniumJsonSerializer } from 'nanium/serializers/json';
import { NaniumHttpChannel } from 'nanium/managers/providers/channels/http';


export interface NaniumExpressHttpChannelConfig extends RequestChannelConfig {
	expressApp: express.Express;
	apiPath: string;
}

export class NaniumExpressHttpChannel implements RequestChannel {
	private serviceRepository: NaniumRepository;
	private readonly config: NaniumExpressHttpChannelConfig;

	constructor(config: NaniumExpressHttpChannelConfig) {
		this.config = {
			...{
				expressApp: undefined,
				apiPath: undefined,
				serializer: new NaniumJsonSerializer(),
				executionContextConstructor: Object
			},
			...(config || {})
		};
	}

	async init(serviceRepository: NaniumRepository): Promise<void> {
		this.serviceRepository = serviceRepository;
		this.config.expressApp.post(this.config.apiPath, async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
			if (req['body']) {
				await NaniumHttpChannel.processCore(this.config, this.serviceRepository, req['body'], res);
				res.end();
			} else {
				await new Promise<void>((resolve: Function, reject: Function) => {
					const data: any[] = [];
					req.on('data', (chunk: any) => {
						data.push(chunk);
					}).on('error', async (e) => {
						reject(e)
					}).on('end', async () => {
						const body: string = Buffer.concat(data).toString();
						const deserialized: NaniumExpressHttpChannelBody = await this.config.serializer.deserialize(body);
						await NaniumHttpChannel.processCore(this.config, this.serviceRepository, deserialized, res);
						res.end();
						resolve();
					});
				});
			}
		});
	}
}

interface NaniumExpressHttpChannelBody {
	serviceName: string;
	request: any;
	streamed?: boolean;
}

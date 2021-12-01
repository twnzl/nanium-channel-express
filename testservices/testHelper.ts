import * as express from 'express';
import { Nanium } from 'nanium/core';
import { NaniumNodejsProvider } from 'nanium/managers/providers/nodejs';
import { TestServerRequestInterceptor } from './test.request.interceptor';
import { KindOfResponsibility } from 'nanium/interfaces/kindOfResponsibility';
import { NaniumExpressHttpChannel } from '../index';
import * as http from 'http'
import * as URL from 'url';

export class TestHelper {
	static port: number = 8888;
	static hasServerBeenCalled: boolean;
	private static expressApp: any;

	private static async initExpressApp(): Promise<void> {
		this.expressApp = express();
		this.expressApp.listen(this.port);
	}

	static async initClientServerScenario(): Promise<void> {
		await this.initExpressApp();

		// Nanium provider and consumer
		this.hasServerBeenCalled = false;
		await Nanium.addManager(new NaniumNodejsProvider({
			servicePath: 'dist/testservices',
			requestChannels: [
				new NaniumExpressHttpChannel({
					apiPath: '/api',
					expressApp: this.expressApp
				})
			],
			requestInterceptors: [ TestServerRequestInterceptor ],
			isResponsible: async (): Promise<KindOfResponsibility> => Promise.resolve('yes'),
			handleError: async (err: any): Promise<any> => {
				throw err;
			}
		}));
	}

	static async shutdown(): Promise<void> {
		this.expressApp.close();
		await Nanium.shutdown();
	}

	static async send(method: 'POST' | 'GET', uri: string, body?: any): Promise<any> {
		return await new Promise<any>((resolve, reject) => {
			const data = JSON.stringify(body)

			const u = new URL.URL(uri);
			const options = {
				hostname: u.hostname,
				port: u.port,
				path: u.pathname,
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': data.length
				}
			}

			const req = http.request(options, res => {
				res.on('data', (d: Buffer) => {
					resolve(JSON.parse(d.toString('utf8')));
				})
			})

			req.on('error', error => {
				reject(error);
			})

			req.write(data)
			req.end()
		});
	}
}

import { ServiceRequestHead } from './serviceRequestHead';
import { ServiceResponseBase } from './serviceResponseBase';
import { ServiceRequestContext } from './serviceRequestContext';
import { MyServiceRequestQueueEntry } from './serviceRequestQueueEntry';
import { Observable } from 'rxjs';
import { Type } from 'nanium/serializers/core';
import { Nanium } from 'nanium/core';
import { ServiceRequestQueueEntry } from 'nanium/interfaces/serviceRequestQueueEntry';

export class ServiceRequestBase<TRequestBody, TResponseBody, TPartialResponse = any> {

	@Type(ServiceRequestHead)
	head: ServiceRequestHead;

	@Type('TRequestBody')
	body: TRequestBody;

	// if body is not Partial<> here, typescript will complain if you do not set the properties of
	// functions and getters/setters
	constructor(body?: Partial<TRequestBody>, head?: ServiceRequestHead) {
		this.body = body as TRequestBody;
		this.head = head;
	}

	async execute(context: ServiceRequestContext): Promise<ServiceResponseBase<TResponseBody>> {
		return await Nanium.execute(this, undefined, context);
	}

	stream(): Observable<TPartialResponse> {
		return Nanium.stream(this);
	}

	async enqueue(mandatorId: string, options?: Partial<ServiceRequestQueueEntry>): Promise<ServiceRequestQueueEntry> {
		const serviceName: string = (this.constructor as any).serviceName;
		return await Nanium.enqueue(
			<MyServiceRequestQueueEntry>{ serviceName: serviceName, request: this, ...options, mandatorId: mandatorId });
	}
}

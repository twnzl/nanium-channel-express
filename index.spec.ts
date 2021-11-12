import { TestHelper } from './testservices/testHelper';
import { Stuff, TestGetRequest, TestGetResponse } from './testservices/test/get.contract';


const request: TestGetRequest = new TestGetRequest({
	input1: "hello world",
	input2: 42,
	input3: new Stuff({ aNumber: 9 })
}, { token: "1234" });
beforeAll(async () => {
	await TestHelper.initClientServerScenario();

});

afterAll(async () => {
	await TestHelper.shutdown();
});

describe('send an HTTP POST to /api \n', function (): void {
	let result: TestGetResponse;
		beforeEach(async () => {
			result = await TestHelper.send('POST', 'http://localhost:' + TestHelper.port + '/api', {
				serviceName: 'NaniumTest:test/get',
				request
			});
		});

		it('--> the service should have been called via the http channel and should return the right result \n', async () => {
			expect(result.body.output1, 'o1 should be correct').toBe('hello world :-)');
			expect(result.body.output2, 'o2 should be correct').toBe(43);
			expect(result.body.output3.aNumber, 'o2 should be correct').toBe(9);
		});
});

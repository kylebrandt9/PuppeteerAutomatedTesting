const puppeteer = require('puppeteer');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

describe('My First snapShot Test', () => {
	let browser;
	let page;

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: true,
		});
		page = await browser.newPage();
	});

	afterAll(async () => {
		await browser.close();
	});

	test('homepage snapshot', async () => {
		await page.goto('https://example.com/');
		const image = await page.screenshot();
		expect(image).toMatchImageSnapshot({
			failureThreshold: '0.01', //Good for Development not for Prod
			failureThresholdType: 'percent', //Good for Development not for Prod
		});
	});

	test('Single Element Snapshot', async () => {
		await page.goto('https://example.com/');
		const h1 = await page.waitForSelector('h1');
		const image = await h1.screenshot();
		expect(image).toMatchImageSnapshot();
	});
});

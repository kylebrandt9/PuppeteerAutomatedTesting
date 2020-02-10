const puppeteer = require('puppeteer');
const expect = require('chai').expect;

describe('my first puppeteer test', () => {
	let browser;
	let page;

	before(async function() {
		browser = await puppeteer.launch({
			headless: true, // Run Headless
			slowMo: 0, // Time between actions
			devtools: false, // No devtools open
			timeout: 10000, // 10 seconds
		});

		page = await browser.newPage(); // Creates a new page
		await page.setDefaultTimeout(10000); //Industry Standers for Puppeteer Testing Timeout
		await page.setViewport({
			//sets the page size
			width: 800,
			height: 600,
		});
	});

	after(async function() {
		await browser.close();
	});

	it('My First test step', async () => {
		await page.goto('https://dev.to/'); // opens a new Page
		await page.waitForSelector('#nav-search'); // waits for that ID selector

		const url = await page.url();
		const title = await page.title();

		expect(url).to.contain('dev');
		expect(title).to.contain('Community');
	});

	it('Browser reload', async () => {
		await page.reload(); // Reloads the page
		await page.waitForSelector('#page-content');

		const url = await page.url(); // grabs the URL of the site
		const title = await page.title(); // grabs the title

		await page.waitFor(3000); // wait for 3 seconds, not good to do if your doing testing just for some automation

		expect(url).to.contain('dev'); // checks to see if URL has the word dev in it
		expect(title).to.contain('Community'); // checks to see if the title has the word community in it
	});

	it('Click Method', async () => {
		await page.goto('https://dev.to/'); // opens a new Page
		await page.waitForSelector('#write-link'); // waits for that ID selector
		//await page.click('#write-link');  // This is how to use defualt setttings
		await page.click('#write-link', {
			button: 'left', // Left is default, Middle, Right
			clickCount: 1, // 1 is defualt, but you can set it to as many
			delay: 2, // 0 is default you can set it to as many
		});
		await page.waitForSelector('.registration-rainbow'); // waits for that ID selector
	});

	it('Submit SearchBox', async () => {
		await page.goto('https://dev.to/'); // opens a new Page
		await page.waitForSelector('#nav-search'); // waits for that ID selector
		await page.type('#nav-search', 'Javascript'); //How to type in the browser
		await page.keyboard.press('Enter'); // to press a Keyboard button
		await page.waitForSelector('#articles-list'); // waits for that ID selector
	});
});

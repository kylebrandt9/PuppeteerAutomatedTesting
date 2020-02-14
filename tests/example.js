const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const config = require('../lib/config'); // Pulls in Config File
const click = require('../lib/helpers').click;
const typeText = require('../lib/helpers').typeText;
const loadUrl = require('../lib/helpers').loadUrl;
const waitForText = require('../lib/helpers').waitForText;
const pressKey = require('../lib/helpers').pressKey;
const shouldExist = require('../lib/helpers').shouldExist;
const utils = require('../lib/utils');

describe('my first puppeteer test', () => {
	let browser;
	let page;

	before(async function() {
		browser = await puppeteer.launch({
			headless: config.isHeadless, // true Run Headless
			slowMo: config.slowMo, // 0 Time between actions
			devtools: config.isDevTools, //  false No devtools open
			timeout: config.launchTimeout, // 10000 is 10 seconds
		});

		page = await browser.newPage(); // Creates a new page
		await page.setDefaultTimeout(config.waitTimeout); // 10000 Industry Standers for Puppeteer Testing Timeout
		await page.setViewport({
			//sets the page size
			width: config.viewPortWidth,
			height: config.viewPortHeight,
		});
	});

	after(async function() {
		await browser.close();
	});

	it('My First test step', async () => {
		//await page.goto('https://dev.to/'); // opens a new Page
		//await page.goto(config.baseUrl); // Pulls in from config file
		await loadUrl(page, config.baseUrl);
		//await page.waitForSelector('#nav-search'); // waits for that ID selector
		await shouldExist(page, '#nav-search');

		const url = await page.url();
		const title = await page.title();

		expect(url).to.contain('dev');
		expect(title).to.contain('Community');
	});

	it('Browser reload', async () => {
		await page.reload(); // Reloads the page
		//await page.waitForSelector('#page-content');
		await shouldExist(page, '#page-content');

		await waitForText(page, 'body', 'WRITE A POST');

		const url = await page.url(); // grabs the URL of the site
		const title = await page.title(); // grabs the title

		//await page.waitFor(3000); // wait for 3 seconds, not good to do if your doing testing just for some automation

		expect(url).to.contain('dev'); // checks to see if URL has the word dev in it
		expect(title).to.contain('Community'); // checks to see if the title has the word community in it
	});

	it('Click Method', async () => {
		await loadUrl(page, config.baseUrl);
		//await page.goto('https://dev.to/'); // opens a new Page
		await click(page, '#write-link'); // This uses the click.helpers.js file

		//await page.waitForSelector('#write-link'); // waits for that ID selector Solved with Click Function
		//await page.click('#write-link');  // This is how to use defualt setttings
		/*await page.click('#write-link', {
			button: 'left', // Left is default, Middle, Right
			clickCount: 1, // 1 is defualt, but you can set it to as many
			delay: 2, // 0 is default you can set it to as many
		})*/
		//await page.waitForSelector('.registration-rainbow'); // waits for that ID selector
		await shouldExist(page, '.registration-rainbow');
	});

	it('Submit SearchBox', async () => {
		//await page.goto('https://dev.to/'); // opens a new Page
		await loadUrl(page, config.baseUrl);
		//These two lines get done by using the helper file
		//await page.waitForSelector('#nav-search'); // waits for that ID selector
		//await page.type('#nav-search', 'Javascript'); //How to type in the browser
		//await typeText(page, 'Javascript', '#nav-search');
		await typeText(page, utils.genratedNumbers(), '#nav-search');
		//await page.keyboard.press('Enter'); // to press a Keyboard button
		await pressKey(page, 'Enter');
		//await page.waitForSelector('#articles-list'); // waits for that ID selector
		await shouldExist(page, '#articles-list');
	});
});

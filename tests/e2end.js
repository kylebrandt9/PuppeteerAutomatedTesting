const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const config = require('../lib/config'); // Pulls in Config File
const click = require('../lib/helpers').click;
const typeText = require('../lib/helpers').typeText;
const loadUrl = require('../lib/helpers').loadUrl;
const waitForText = require('../lib/helpers').waitForText;
const pressKey = require('../lib/helpers').pressKey;
const shouldExist = require('../lib/helpers').shouldExist;
const getCount = require('../lib/helpers').getCount;
const utils = require('../lib/utils');

describe('End to End Testing on zero.webappsecurity', () => {
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

	describe('Login Test', () => {
		it('Should navigate to homepage', async () => {
			await loadUrl(page, 'http://zero.webappsecurity.com/');
			await shouldExist(page, '#online_banking_features');
		});

		it('Should click on Signin button', async () => {
			await click(page, '#signin_button');
			await shouldExist(page, '#login_form');
		});

		it('Should submit login form', async () => {
			await typeText(page, utils.genratedID(), '#user_login');
			await typeText(page, utils.genratedNumbers(8), '#user_password');
			await click(page, '.btn-primary');
		});

		it('Should get Error message', async () => {
			await waitForText(page, 'body', 'Login and/or password are wrong.');
			await shouldExist(page, '#login_form');
		});
	});
	describe('E2E Text Searching', () => {
		it('Should navigate to home page', async () => {
			await loadUrl(page, 'http://zero.webappsecurity.com/');
			await shouldExist(page, '#online_banking_features');
		});

		it('Should submit search phrase', async () => {
			await typeText(page, 'hello world', '#searchTerm');
			await pressKey(page, 'Enter');
		});
		it('Should display search results', async () => {
			await waitForText(page, 'h2', 'Search Results');
			await waitForText(page, 'body', 'No results were found for the query');
		});
	});
	describe('E2E NavBar Links', () => {
		it('Should navigate to home page', async () => {
			await loadUrl(page, 'http://zero.webappsecurity.com/');
			await shouldExist(page, '#online_banking_features');
		});
		it('Should have correct numbe of links', async () => {
			//get count of links
			const numberOfLinks = await getCount(page, '#pages-nav > li');
			//assert the count
			expect(numberOfLinks).to.equal(3);
		});
	});
	describe('E2E Submit FeedBack Form', () => {
		it('Should navigate to home page', async () => {
			await loadUrl(page, 'http://zero.webappsecurity.com/');
			await shouldExist(page, '#online_banking_features');
		});
		it('Should click on Feedback Nav', async () => {
			await click(page, '#feedback');
			await shouldExist(page, 'form');
		});
		it('Should fillout & submit feedback form', async () => {
			await typeText(page, 'John Smith', '#name');
			await typeText(page, utils.genratedEmail(), '#email');
			await typeText(page, 'Subject', '#subject');
			await typeText(page, 'Question Text here', '#comment');
			await click(page, "input[type='submit']");
		});
		it('Should display success message from feeback form', async () => {
			await shouldExist(page, '#feedback-title');
			await waitForText(page, 'body', 'Thank you for your comments');
		});
	});
	describe('E2E Forgot Password', () => {
		it('Should navigate to home page', async () => {
			await loadUrl(
				page,
				'http://zero.webappsecurity.com/forgot-password.html'
			);
			await waitForText(page, 'h3', 'Forgotten Password');
			await shouldExist(page, '#send_password_form');
			await typeText(page, utils.genratedEmail(), '#user_email');
			await click(page, "input[type='submit']");
			await waitForText(
				page,
				'body',
				'Your password will be sent to the following email'
			);
		});
	});
});

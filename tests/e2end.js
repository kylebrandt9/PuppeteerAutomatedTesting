//Core Packages
const puppeteer = require('puppeteer'); // Requires Puppeteer
const expect = require('chai').expect; // Requires Chai

//Helper Functions
const config = require('../lib/config'); // Pulls in Config File
const click = require('../lib/helpers').click; // Pulls in helper files and function
const typeText = require('../lib/helpers').typeText; // Pulls in helper files and function
const loadUrl = require('../lib/helpers').loadUrl; // Pulls in helpers file and function
const waitForText = require('../lib/helpers').waitForText; // Pulls in helper files and function
const pressKey = require('../lib/helpers').pressKey; // Pulls in helpers file and function
const shouldExist = require('../lib/helpers').shouldExist; // Pulls in helper files and function
const getCount = require('../lib/helpers').getCount; // Pulls in helpers file and function

//Utility Functions
const utils = require('../lib/utils'); // Pulls in the utitls file

//Pages
const homePage = require('../page-objects/home-page');
const loginPage = require('../page-objects/login-page');
const searchResultsPage = require('../page-objects/searchResults-page');
const feedbackPage = require('../page-objects/feedback-page');
const feedbackResultsPage = require('../page-objects/feedbackResults-page');

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
			//await shouldExist(page, '#online_banking_features');
			await shouldExist(page, homePage.BANKING_FEATURES); //This uses the Page Object  Structure
		});

		it('Should click on Signin button', async () => {
			await click(page, homePage.SIGN_IN_BUTTON);
			await shouldExist(page, loginPage.LOGIN_FORM);
		});

		it('Should submit login form', async () => {
			await typeText(page, utils.genratedID(), loginPage.USER_NAME);
			await typeText(page, utils.genratedNumbers(8), loginPage.USER_PASSWORD);
			await click(page, loginPage.SUBMIT_BUTTON);
		});

		it('Should get Error message', async () => {
			await waitForText(page, 'body', 'Login and/or password are wrong.');
			await shouldExist(page, loginPage.LOGIN_FORM);
		});
	});
	describe('E2E Text Searching', () => {
		it('Should navigate to home page', async () => {
			await loadUrl(page, 'http://zero.webappsecurity.com/');
			await shouldExist(page, homePage.BANKING_FEATURES);
		});

		it('Should submit search phrase', async () => {
			await typeText(page, 'hello world', homePage.SEARCH_BAR);
			await pressKey(page, 'Enter');
		});
		it('Should display search results', async () => {
			await waitForText(
				page,
				searchResultsPage.SEARCH_RESULTS_TITLE,
				'Search Results'
			);
			await waitForText(
				page,
				searchResultsPage.SEARCH_RESULTS_CONTENT,
				'No results were found for the query'
			);
		});
	});
	describe('E2E NavBar Links', () => {
		it('Should navigate to home page', async () => {
			await loadUrl(page, 'http://zero.webappsecurity.com/');
			await shouldExist(page, homePage.BANKING_FEATURES);
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
			await shouldExist(page, homePage.BANKING_FEATURES);
		});
		it('Should click on Feedback Nav', async () => {
			await click(page, homePage.LINK_FEEDBACK);
			await shouldExist(page, feedbackPage.FEEDBACK_FORM);
		});
		it('Should fillout & submit feedback form', async () => {
			await typeText(page, 'John Smith', feedbackPage.FORM_NAME);
			await typeText(page, utils.genratedEmail(), feedbackPage.FORM_EMAIL);
			await typeText(page, 'Subject', feedbackPage.FORM_SUBJECT);
			await typeText(page, 'Question Text here', feedbackPage.FORM_COMMENT);
			await click(page, feedbackPage.FORM_SUBMIT_BUTTON);
		});
		it('Should display success message from feeback form', async () => {
			await shouldExist(page, feedbackResultsPage.FEEDBACK_RESULTS_TITLE);
			await waitForText(
				page,
				feedbackResultsPage.FEEDBACK_RESULTS_CONTENT,
				'Thank you for your comments'
			);
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

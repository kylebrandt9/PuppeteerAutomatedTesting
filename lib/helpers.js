module.exports = {
	//Click makes it so we are not typing waiting for selector all the time and then calling the click
	click: async function(page, selector) {
		try {
			await page.waitForSelector(selector);
			await page.click(selector);
		} catch (error) {
			throw new Error(`Could not click on selector: ${selector}`);
		}
	},
	//typeText makes it so we are not typing waiting for selector all the time and then calling the Typing command
	typeText: async function(page, text, selector) {
		try {
			await page.waitForSelector(selector);
			await page.type(selector, text);
		} catch (error) {
			throw new Error(`Could not type text into Selector: ${selector}`);
		}
	},
};

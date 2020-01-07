const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');

let browser, page;

beforeEach(async () => {
	browser = await puppeteer.launch({});
	page = await browser.newPage();
	await page.goto('localhost:3000');
});

afterEach(async () => {
	await browser.close();
});

test('the header has the correct text', async () => {
	const text = await page.$eval('a.brand-logo', el => el.innerHTML);

	expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
	await page.click('.right a');

	const url = await page.url();

	expect(url).toMatch(/accounts\.google\.com/);
});


test('When signed in, shows logout button', () => {
	const id = '5a85dc351cd843163727f63c';// mongo user id

	const { session, sig } = sessionFactory({ _id: id });

	await page.setCookie({ name: 'session', value: session });
	await page.setCookie({ name: 'session.sig', value: sig });
	await page.goto('localhost:3000');
	await page.waitFor('a[href="/auth/logout"]');

	const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
	expect(text).toEqual('Logout');
});

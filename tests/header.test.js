/* eslint-disable no-undef */
// const puppeteer = require('puppeteer');

const Page = require('./helpers/page');

// let browser;
let page;
beforeEach(async () => {
  // browser = await puppeteer.launch({ headless: false });

  // page = await browser.newPage();
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});
test('the header has the correct text', async () => {
  // const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('click on a link to start oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, shows logout button', async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
  expect(text).toEqual('Logout');
});

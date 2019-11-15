/* eslint-disable no-console */
/* eslint-disable no-undef */
const Page = require('./helpers/page');

describe('When logged in', () => {
  let page;

  beforeEach(async () => {
    jest.setTimeout(30000);
    page = await Page.build();
    await page.goto('http://localhost:3000');
    await page.login();
    await page.click('a.btn-floating');
  });

  afterEach(async () => {
    await page.close();
  });

  test('when signed in, create a new blog post', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  xtest('when signed in, enter valid inputs into form', async () => {
    await page.login();
  });

  describe('using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', 'a title text');
      await page.type('.content input', 'content text');
      await page.click('form button');
    });
    test('Submitting the form takes user to review screen', async () => {
      const titleText = await page.getContentsOf('h5');
      expect(titleText).toEqual('Please confirm your entries');
    });

    test('Submitting then adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('a title text');
      expect(content).toEqual('content text');
    });
  });

  describe('using invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
  describe('User is not logged in', () => {
    test.only('when NOT signed in, creating a post results in an error', async () => {
      const result = await page.get('/api/blogs');
      console.log(result);
      // expect(result).toEqual({ error: 'You must log in!' });
    });
  });
});

xtest('when NOT signed in, viewing a post results in an error', async () => {});

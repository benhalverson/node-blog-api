/* eslint-disable no-undef */
const Page = require('./helpers/page');

describe('When logged in', async () => {
  let page;

  beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
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

  xtest('when signed in, enter invalid inputs into form', async () => {});
});

xtest('when NOT signed in, creating a post results in an error', async () => {});

xtest('when NOT signed in, viewing a post results in an error', async () => {});

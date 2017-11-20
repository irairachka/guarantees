import { browser, element, by } from 'protractor';

describe(`Page: root`, () => {
  it(`should have a title of 'מוטב'`, () => {
    browser.get('/');
    const title = element(by.css('.title')).getText();
    console.log('title', title);
    expect(title).toEqual('txt');
  });

  // it(`should have a different second joke`, async () => {
  //   browser.get('/');
  //   const joke1 = element(by.css('p')).getText();
  //   element(by.css('button')).click();
  //   const joke2 = await element(by.css('p')).getText();
  //
  //   expect(joke1).not.toEqual(joke2);
  //
  // });
});

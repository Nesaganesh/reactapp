import { test, expect, Page } from '@playwright/test';
import config from '.././constants/config.json';
import { useNetworkRecordMocks } from 'playwright-request-mocker';          // if using .mjs / .ts
// const { useNetworkRecordMocks } = require('playwright-request-mocker');  //if using .js

test.describe('Your test @mockrecoder', () => {
  // If your network requests/responses are the same for every test scenario, define it here.
  test.beforeEach(async ({ page }) => {


    console.log(process.env.APP_URL);
    console.log(config.playwright.url);
    // await useNetworkRecordMocks(page, {
    //   recordRoute: `${process.env.APP_URL}/${config.playwright.url}`,
    // });

    // await page.goto(`${process.env.APP_URL}/${config.playwright.url}`);
  });

  // else use it here if each test scenario expects different results.
  test('scenario1', async ({ page }) => {
    // It'll generate a new file if it does not exist (".spec.scenario1.mocks.json")
    // then it'll read it and mock all defined network requests.

    await page.goto(config.playwright.url);
    await page.pause();
    await useNetworkRecordMocks(page, {
      identifier: 'scenario1',
      recordRoute: `${config.playwright.url}`
    });
    
    await page.goto(`${config.playwright.url}`);

    //... your steps and asserts.
  });
});
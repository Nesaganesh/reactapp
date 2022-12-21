import { test, expect, Page } from '@playwright/test';
import {PlaywrightHar} from 'playwright-har';
import config from '.././constants/config.json';

test.describe('Your test @har', () => {

  test('scenario1', async ({ page }) => {

    const playwrightHar = new PlaywrightHar(page);
    await playwrightHar.start();

        await page.goto(config.playwright.url)

    await playwrightHar.stop('./example.har');
    await page.close();


  });

  
});
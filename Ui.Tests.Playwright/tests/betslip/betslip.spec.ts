import { test, expect, Page } from '@playwright/test';
import { general_helper, emos_helper, User } from '../..';
import userConfig from '../../constants/users.json';
import { eventData as event} from '../../types/event';
import config from '.././../constants/config.json';
import {LoginHelper} from '../../helpers/loginHelper';

const loginHelper = new LoginHelper();

test.beforeEach(async ({ page }) => {
  await page.goto(config.playwright.url);

});

test.afterEach(async ({ page }) => {

    await page.waitForTimeout(3000);
    await page.close();
});

test.describe('Betslip Tests @betslip', () => {
    
    test('', async ({page}) => {

        let segmentName = 'uk';
        let jurdicationName = 'UnitedKingdom';
    
        await loginHelper.login(jurdicationName, page);
    
        var eventData: event = await emos_helper.getCashOutLiveTradedEvent('soccer', 'la-liga', segmentName);
        
        await page.goto(config.playwright.url + `?outcomeid1=${eventData?.markets[0]?.outcomes[0]}&stake1=100`);
        await page.click('button.totalStakeButton');
    
        const name = await page.innerText('div.betsSuccessItemText');
        expect(name).toBe('Bet(s) Placed Successfully');
        


    });
});
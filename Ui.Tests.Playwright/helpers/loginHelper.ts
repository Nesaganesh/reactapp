import {Page, Route } from "@playwright/test";
import userConfig from '../constants/users.json';
import { general_helper, emos_helper, User } from '..';

export class LoginHelper {

    async login(jurisdictionName: string, page: Page){

        const user = userConfig.users.find(u => u.jurisdictionName == jurisdictionName);
        const userInfo = await general_helper.getUser(user);
    
        await page.fill('div.usernameInput input', userInfo.username)
        await page.fill('div.passwordInput input', userInfo.password)
        await page.click('div.loginButton');
        await page.locator('div.signin').click();
    
        await page.waitForTimeout(2000);
    }
}

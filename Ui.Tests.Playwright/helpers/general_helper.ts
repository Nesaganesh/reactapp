import {User,usersApi} from '..';

export class general_helper {

	static async getUser(user: User) : Promise<User> {
			const details = await usersApi.getUser(user);
			user.username=details.User.UserName;
			user.password=details.User.Password;
			return user;
	}

	// static navigateToLiveTradedEvent(eventId :number , segmentName:string) : void {
	// 	let i = 0;
	// 	let isScoreBoardBackgroundDisplayed;
	// 	do {
	// 		i++;
	// 		this.DeeplinkToEvent(eventId, segmentName).catch(Error);
	// 		isScoreBoardBackgroundDisplayed = this.IsScoreBoardBackgroundPresent();
	// 	} while (!isScoreBoardBackgroundDisplayed && i <= 5);
	// }

	// static async DeeplinkToEvent(eventId :number, segmentName:string) : Promise<void> {
	// 	const { Playwright, playwright_helper } = this.helpers;
	// 	const url: string = generalConfig.playwright.url;
	// 	let segment = '';
	// 	if (segmentName != 'UK') segment = `?segment=${segmentName}`;
	// 	await playwright_helper.gotoUrl(url + `/evt/${eventId}${segment}`);
	// }

	// static async IsScoreBoardBackgroundPresent() : Promise<boolean> {
	// 	try {
	// 		const { Playwright } = this.helpers;

	// 		await Playwright.waitForElement('.scoreboardBackgroundHover', generalConfig.delay.global);
	// 		return true;
	// 	} catch (error) {
	// 		return false;
	// 	}
	// }
}

import { tapi } from '..';
import config from '../constants/config.json';
import countryMapping from '../constants/jurisdictionToCountryNameMapping.json';

export class emos_helper {
	static emos = new Array<any>();

	testId = '';

	_test(test: any) {
		this.testId = test.id;
	}

	static _afterSuite() {
		let nowDate = new Date();
		nowDate.setDate(nowDate.getDate() - 1);
		var strDate = nowDate.toISOString().replace(/\.[0-9]{3}/, '');

		let splitEvents = [];
		while(this.emos.length) {
			splitEvents.push(this.emos.splice(0, 10));
		}

		splitEvents.forEach(async eventIds => {

			let updateEventTimeRequests = new Array<any>();
			let updateEventStateRequests = new Array<any>();

			eventIds.forEach(eventId => {
				updateEventTimeRequests.push({
					eventId: eventId,
					startAt: strDate,
					suspendAt: strDate
				});
				updateEventStateRequests.push({
					eventId: eventId,
					state: 'FINISHED',
					active: false,
					displayed: false,
					started: false,
					live: false
				});
			});

			await tapi.updateEvents(updateEventTimeRequests)
			await tapi.updateEvents(updateEventStateRequests);
			console.debug(`Closed events ${eventIds}`);
		});
	}

	static async getLiveTradedEvent(sportCname:string, countryCname:string, leagueCname:string) {
		switch (config.environment.type.toUpperCase()) {
		case 'TC2':
			var eventData = await tapi.createEventWithEmoData(sportCname, countryCname, leagueCname);
			this.emos.push(eventData.eventId);
			return eventData;
		default:
			throw 'Feature not implemented outside of TC2';
		}
	}

	static async getCashOutLiveTradedEvent(sportCname:string, leagueCname:string, segmentName:string) {

		var countryCname = countryMapping.countries.find(s => s.segmentName == segmentName.toLowerCase())?.countryName;
		if (!countryCname)
			throw new Error('Did not find a country in countryMappingsJson for ' + segmentName);

		switch (config.environment.type.toUpperCase()) {
		case 'TC2':
			var eventData = await tapi.createEventWithEmoData(sportCname, countryCname, leagueCname);
			this.emos.push(eventData.eventId);

			var updateMarketCashOutRequests = new Array<any>();
			eventData.markets.forEach((market: { marketId: number; }) => {
				updateMarketCashOutRequests.push({
					marketId: market.marketId,
					cashOutActive: true
				});
			});

			await tapi.updateMarkets(updateMarketCashOutRequests);

			return eventData;
		default:
			throw 'Feature not implemented outside of TC2';
		}
	}
	
	async UpdateOutcomePrice(outcomeId:number, numerator:number, denominator:number) {
		switch (config.environment.type.toUpperCase()) {
		case 'TC2':
			var prices = [];
			prices.push({ outcomeId: outcomeId, priceNum: numerator, priceDen: denominator });
			await tapi.updatePrices(prices);
			return;
		default:
			throw 'Feature not implemented outside of TC2';
		}
	}

	getTestId() {
		return `${this.testId}`;
	}

	async SetResultToWin(eventId:number, marketId:number, outcomeId:number) {
		switch (config.environment.type.toUpperCase()) {
		case 'TC2':
			await tapi.setResults(eventId, marketId, outcomeId, 'win');
			return;
		default:
			throw 'Feature not implemented outside of TC2';
		}
	}
}

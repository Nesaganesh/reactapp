import { emoRequest } from '../types/emoRequests';
import {fs,uuidv4,apiHelper,os,https} from '..';
import config from './../constants/config.json';

export class tapi {

	static options = {
		baseURL: config.tapi.url,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'X-Request-Id': '00000000-0000-0000-0000-000000000000'
		},
		auth: {
			username: config.tapi.username,
			password: config.tapi.password
		},
		httpsAgent: new https.Agent({ ca: fs.readFileSync('src/certs/TC2.pem') })
	};

	static async createEventWithEmoData(sportCname:string, countryCname:string, leagueCname:string) {
		var eventData = {} as any;

		var eventId = await this.createEvent();
		if (eventId === null) return;

		eventData.eventId = eventId;

		await this.addEventKeywords(eventId, [
			{
				cname: sportCname,
				typeCname: 'sport'
			},
			{
				cname: countryCname,
				typeCname: 'country'
			},
			{
				cname: leagueCname,
				typeCname: 'league'
			}
		]);

		await this.updateEvents([
			{
				eventId: eventId,
				state: 'PUBLISHED',
				active: true,
				displayed: true,
				started: true
			}
		]);

		let numberOfMarkets = await this.applyMarketPackage(eventId, 'soccer-6');
		if (numberOfMarkets === null) return;

		eventData.markets = new Array<any>();

		var pollForOutcomeIds = async (retries = 0) => {
			var events = await this.getEvents([eventId]);

			let marketsCount = 0;
			events.forEach((event: { result: { markets: string | any[]; }; }) => {
				marketsCount += event.result.markets.length;
			});

			if (marketsCount === numberOfMarkets) {
				let outcomeIds = new Array<number>();
				events.forEach(((e: { result: { markets: any[]; }; })  => {
					e.result.markets.forEach((m: { marketId: number; outcomes: any[]; }) => {
						let marketData = {} as any;
						marketData.marketId = m.marketId;
						marketData.outcomes = new Array<number>();
						m.outcomes.forEach((o: { outcomeId: number; }) => {
							marketData.outcomes.push(o.outcomeId);
							outcomeIds.push(o.outcomeId);
						});
						eventData.markets.push(marketData);
					});
				}));

				return outcomeIds;
			} else if (retries === 3) {
				return [];
			} else {
				retries++;
				setTimeout(() => pollForOutcomeIds(retries), 1000);
			}
		};

		let outcomeIds = await pollForOutcomeIds();
		if (outcomeIds?.length === 0) return;

		var prices: { outcomeId: any; priceNum: number; priceDen: number; }[] = [];
		outcomeIds?.forEach(outcomeId => {
			prices.push(
				{
					outcomeId: outcomeId,
					priceNum: Math.ceil(Math.random() * 9),
					priceDen: Math.ceil(Math.random() * 9)
				}
			);
		});

		await this.updatePrices(prices);

		return eventData;
	}

	static async createEvent() {

		let response = null;
		let currentDate = new Date();
		currentDate.setDate(currentDate.getDate() + 1);
		let strDate = currentDate.toISOString().replace(/\.[0-9]{3}/, '');

		let request : emoRequest = {
			live: true,
			startAt: strDate,
			homeTeamCname: 'home',
			awayTeamCname: 'away',
			name: 'TestOps ' + os.hostname()
		};

		var createEventOptions = this.options;
		createEventOptions.headers['X-Request-Id'] = uuidv4();
		response = await apiHelper.postApi('v1/events/createEvent', request, createEventOptions);
		return response.data.result.eventId != null ? response.data.result.eventId : null;
	}

	static async applyMarketPackage(eventId:number, marketPackageCname:string) {
		let response = null;
		var request = {
			eventId: eventId,
			marketPackageCname: marketPackageCname
		};

		var applyMarketPackageOption = this.options;
		applyMarketPackageOption.headers['X-Request-Id'] = uuidv4();
		response = await apiHelper.postApi('v1/events/applyMarketPackage', request, applyMarketPackageOption);
		return response.data.result.marketCount != null
			? response.data.result.marketCount
			: null;
	}

	static async addEventKeywords(eventId:number, keywords:any) {
		var request = {
			eventId: eventId,
			keywords: keywords
		};

		var addEventKeywordOption = this.options;
		addEventKeywordOption.headers['X-Request-Id'] = uuidv4();

		await apiHelper.postApi('v1/events/addEventKeywords', request, addEventKeywordOption);
	}

	static async getEvents(eventIds : number[]) {
		let response = null;
		var request = {
			eventIds: eventIds,
			includeChildren: true
		};

		var getEventsOption = this.options;
		getEventsOption.headers['X-Request-Id'] = uuidv4();

		response = await apiHelper.postApi('v1/events/getEvents', request, getEventsOption);

		return response.data.result.statuses != null
			? response.data.result.statuses
			: null;
	}

	static async updatePrices(prices: any[]) {
		var request = {
			prices: prices
		};

		var updatePricesOption = this.options;
		updatePricesOption.headers['X-Request-Id'] = uuidv4();

		await apiHelper.postApi('v1/outcomes/updatePrices', request, updatePricesOption);
	}

	static async updateEvents(events : any) {
		var request = {
			events: events
		};

		var updateEventsOption = this.options;
		updateEventsOption.headers['X-Request-Id'] = uuidv4();

		var response = (await apiHelper.postApi('v1/events/updateEvents', request, updateEventsOption)) as any;

		if (response.success === false) console.error(`Failed to Update Event statuses: ${JSON.stringify(events)}`);
		if (response.statuses === null || response.statuses === undefined) {
			console.log('Update Events did not return any statuses in response');
			return;
		}

		var failedEvents: string[] = [];
		response.statuses.forEach((status: { success: boolean; eventId: any; error: { message: any; }; }) => {
			if (status.success === true) return;
			failedEvents.push(`${status.eventId} -> ${status.error.message}`);
		});

		if (failedEvents.length > 0) console.error(`Error updating some events: ${failedEvents}`);
	}

	static async updateMarkets(markets: any[]) {
		var request = {
			markets: markets
		};
		var updateEventsOption = this.options;
		updateEventsOption.headers['X-Request-Id'] = uuidv4();

		await apiHelper.postApi('v1/markets/updateMarkets', request, updateEventsOption);
	}

	static async setResults(eventId:number, marketId:number, outcomeId:number, resultCName:string) {

		var request = {
			results: [{
				eventId: eventId,
				marketId: marketId,
				outcomeId: outcomeId,
				cname: resultCName
			}
			]
		};

		var requestOptions = this.options;
		requestOptions.headers['X-Request-Id'] = uuidv4();

		await apiHelper.postApi('v1/results/setResults', request, requestOptions);
	}
}
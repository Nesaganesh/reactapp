// import {test as baseMocks } from "@playwright/test";
// import {Page, Route } from "@playwright/test";


// const fixture = baseMocks.extend<nesa>({
//     hey: "I am letcode",
// });





// type nesa = {
//     hey: string;
// }

// class MockHelper {

//     async Intercept(page: Page, route: Route, methodName: string) {

//         // config.clientApi.clientApiUrl+'Events/V2/GetCategories'
//         await page.route(methodName, async (route, request,)  => {

//             //console.log("Mocking GetCategories >>>>>>>>> " + JSON.parse(request.postData()).CorrelationId);
//             //const correlationId = JSON.parse(request.postData()).CorrelationId;
    
//             var response = await page.request.fetch(route.request());
    
//             let body = await response.text();
//             console.log(body);
//             body = '{"Categories":[{"ScheduledTournamentCount":0,"CategoryCName":"archery","CategoryName":"Archery_TEST","CategoryOrder":{"1":1,"2":1,"3":1,"4":4},"Id":"archery","LiveCount":1,"UpcomingCount":0,"TotalCount":1,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":1,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"baseball","CategoryName":"Baseball","CategoryOrder":{"1":2,"2":2,"3":2,"4":5},"Id":"baseball","LiveCount":5,"UpcomingCount":8,"TotalCount":15,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":15,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"basketball","CategoryName":"Basketball","CategoryOrder":{"1":3,"2":8,"3":3,"4":6},"Id":"basketball","LiveCount":0,"UpcomingCount":13,"TotalCount":34,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":34,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"betway-boosts","CategoryName":"Betway Boosts","CategoryOrder":{"1":4,"2":9,"3":4,"4":7},"Id":"betway-boosts","LiveCount":0,"UpcomingCount":0,"TotalCount":2,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":2,"FixtureCount":0,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"darts","CategoryName":"Darts","CategoryOrder":{"1":5,"2":3,"3":5,"4":8},"Id":"darts","LiveCount":5,"UpcomingCount":0,"TotalCount":5,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":5,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"soccer","CategoryName":"Football","CategoryOrder":{"1":6,"2":4,"3":6,"4":0},"Id":"soccer","LiveCount":802,"UpcomingCount":9,"TotalCount":841,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":841,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"handball","CategoryName":"Handball","CategoryOrder":{"1":7,"2":10,"3":7,"4":9},"Id":"handball","LiveCount":0,"UpcomingCount":0,"TotalCount":3,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":3,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"horse-racing","CategoryName":"Horse Racing","CategoryOrder":{"1":8,"2":null,"3":8,"4":1},"Id":"horse-racing","LiveCount":0,"UpcomingCount":0,"TotalCount":16,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":16,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"ice-hockey","CategoryName":"Ice Hockey","CategoryOrder":{"1":9,"2":5,"3":9,"4":10},"Id":"ice-hockey","LiveCount":1,"UpcomingCount":0,"TotalCount":2,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":2,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"tennis","CategoryName":"Tennis","CategoryOrder":{"1":11,"2":11,"3":11,"4":2},"Id":"tennis","LiveCount":0,"UpcomingCount":0,"TotalCount":4,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":4,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"testcategory-getinfoforquicklink","CategoryName":"TestCategory_GetInfoForQuickLink","CategoryOrder":{"1":12,"2":7,"3":12,"4":12},"Id":"testcategory-getinfoforquicklink","LiveCount":1,"UpcomingCount":0,"TotalCount":6,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":6,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":false,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"1000-guineas","CategoryName":"1000 Guineas","CategoryOrder":{"1":0,"2":0,"3":0,"4":3},"Id":"1000-guineas","LiveCount":1,"UpcomingCount":0,"TotalCount":1,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":1,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":true,"CouponsCount":0},{"ScheduledTournamentCount":0,"CategoryCName":"olympics","CategoryName":"Olympics","CategoryOrder":{"1":10,"2":6,"3":10,"4":11},"Id":"olympics","LiveCount":2,"UpcomingCount":0,"TotalCount":2,"LivePremiumCount":0,"UpcomingPremiumCount":0,"TotalPremiumCount":0,"VirtualCount":0,"OutrightCount":0,"FixtureCount":2,"HomePageIndex":0,"InplayIndex":0,"IsSuperTournament":true,"CouponsCount":0}],"MethodName":"Categories","MethodResult":"OK","Success":true,"CorrelationId":"e85564f2-9e8c-4427-b327-bb2cdefee864"}';
//             route.fulfill({
//                 response,
//                 body,
//                 headers: {
//                   ...response.headers()
//                 }
//             })
//         });

//     }

// }


// export cont  MockHelper  = fixture;
// export const expect = fixture.expect;
import {test as baseMocks } from "@playwright/test";
import {Page, Route } from "@playwright/test";

export class MockHelper {

    async ModifyResponse(page: Page, methodName: string, modifiedResponce: string) {

        // config.clientApi.clientApiUrl+'Events/V2/GetCategories'
        await page.route(methodName, async (route, request,)  => {

            //console.log("Mocking GetCategories >>>>>>>>> " + JSON.parse(request.postData()).CorrelationId);
            //const correlationId = JSON.parse(request.postData()).CorrelationId;
    
            var response = await page.request.fetch(route.request());
    
            let body = await response.text();
            console.log(body);
            body = modifiedResponce;
            route.fulfill({
                response,
                body,
                headers: {
                  ...response.headers()
                }
            })
        });
    }
}

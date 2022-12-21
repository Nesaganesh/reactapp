import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { emoRequest } from '../types/emoRequests';
import {app,axiosRetry} from '..';

export class restApi {

	static async getApi(url:string, appUrlConfig: AxiosRequestConfig) : Promise<app.AxiosResponse<any>> {
		return await app.default.get(url, appUrlConfig);
	}

	static async postApi(url:string, request: any, appUrlConfig: AxiosRequestConfig) : Promise<app.AxiosResponse<any>> {
		const axios = app.default.create();
		// console.debug('POST api call request body is ' + JSON.stringify(request));
		// console.debug('POST api call method name is' + JSON.stringify(url));
		// console.debug('POST api call base url is ' + JSON.stringify(appUrlConfig.baseURL));
		try {
			axiosRetry.default(axios, {
				retries: 3,
			});
			const response = await axios.post(url, request, appUrlConfig);
			if (response.status !== 200) throw `Request "${url}" is not successful ${response.status} ${response.statusText}`;
			if (response.data.success === false) throw `Response from "${url}" returned unsuccessful`;
			console.debug('POST api call response is ' + JSON.stringify(response.data));
			return response;

		} catch (error) {
			throw new Error('error in making api call or parsing the api response '+ error);
		}
	}

	static async deleteApi(url:string, appUrlConfig:AxiosRequestConfig) : Promise<AxiosResponse<any>> {
		return await app.default.delete(url, appUrlConfig);
	}

	static async putApi(url:string, data : string, appUrlConfig:AxiosRequestConfig) : Promise<AxiosResponse<any>> {
		return await app.default.put(url, data, appUrlConfig);
	}
}
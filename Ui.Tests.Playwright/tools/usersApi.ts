const config = require('../constants/config.json');
import {apiHelper,User} from '..';

const apiHeader = {
	baseURL: config.usersapi.url,
	headers: {
		'Content-Type': 'application/json',
	},
};

export class usersApi {

	static getRegisterUserRequest(user : User) {
		var request = 
		{
			"User":{
			   "UserName":'nesauk002' + Math.floor((Math.random() * 1000000) + 1),
			   "Password":"password1234",
			   "Balance":100000,
			   "JurisdictionName":"UnitedKingdom",
			   "RegisteredCountry":"United Kingdom",
			   "AccountStatus":4,
			   "EnvironmentName":"TC2",
			   "Currency":9,
			   "ExclusionPeriodInDays":10,
			   "NeedsCasino":true
			}
		 };
		return request;
	}

	static async getUser(user:User) {

		console.debug('Started to create user using users api');
		let requestRegisterUser = this.getRegisterUserRequest(user);
		await apiHelper.postApi('RegisterV2', requestRegisterUser, apiHeader);
		return requestRegisterUser;
	}
}
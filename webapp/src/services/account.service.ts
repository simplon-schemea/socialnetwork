import { User, UserCredentials } from "@models/user";
import { baseURL } from "../config";
import { PersistentStorage } from "../storage/persistent-storage";
import { HttpClient } from "../http/client";
import { LoginResponseResource } from "@models/resources/login-response-resource";

const endpoint = baseURL + "/account";

export class AccountService {
    constructor(public readonly http: HttpClient) {}

    register(user: User) {
        return this.http.request({
            url: endpoint + "/register",
            body: user,
        });
    }

    login(user: UserCredentials) {
        return this.http.request<LoginResponseResource>({
            url: endpoint + "/login",
            body: user,
            responseType: "json",
        });
    }

    logout() {
        PersistentStorage.remove("token");
    }
}

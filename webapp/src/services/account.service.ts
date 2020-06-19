import { User, UserCredentials } from "@models/user";
import { baseURL } from "../config";
import { PersistentStorage } from "../storage/persistent-storage";
import { HttpClient } from "../http/client";

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
        return this.http.request<string>({
            url: endpoint + "/login",
            body: user,
            responseType: "text",
        });
    }

    logout() {
        PersistentStorage.remove("token");
    }
}

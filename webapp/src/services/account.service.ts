import { User, UserCredentials } from "../models/user";
import { Http } from "./http.service";
import { baseURL } from "../config";
import { Profile } from "../models/profile";

const endpoint = baseURL + "/account";

export namespace AccountService {

    export function register(user: User) {
        return Http.request({
            url: endpoint + "/register",
            method: "POST",
            body: user,
        });
    }

    export function login(user: UserCredentials) {
        return Http.request<Profile>({
            url: endpoint + "/login",
            method: "POST",
            body: user,
        });
    }
}

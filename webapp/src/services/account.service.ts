import { User, UserCredentials } from "../models/user";
import { Http } from "./http.service";

const baseURL = "/api/account/";

export namespace AccountService {

    export function register(user: User) {
        return Http.request({
            url: baseURL + "register",
            method: "POST",
            body: user,
        });
    }

    export function login(user: UserCredentials) {
        return Http.request({
            url: baseURL + "login",
            method: "POST",
            body: user,
        });
    }
}

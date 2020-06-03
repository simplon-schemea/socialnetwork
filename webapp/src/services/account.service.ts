import { User, UserCredentials } from "@models/user";
import { Http } from "./http.service";
import { baseURL } from "../config";
import { ProfileResource } from "@models/resources/profile-resource";

const endpoint = baseURL + "/account";

export namespace AccountService {

    export function register(user: User) {
        return Http.request({
            url: endpoint + "/register",
            body: user,
        });
    }

    export function login(user: UserCredentials) {
        return Http.request<ProfileResource>({
            url: endpoint + "/login",
            body: user,
            responseType: "json",
            followRedirect: true,
        });
    }

    export function logout() {
        return Http.request(endpoint + "/logout");
    }
}

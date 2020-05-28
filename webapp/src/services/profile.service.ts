import { baseURL } from "../config";
import { Http } from "./http.service";
import { Profile } from "../models/profile";

const endpoint = baseURL + "/profiles";

export namespace ProfileService {
    export function get(id: string = "self") {
        return Http.request<Profile>({
            url: endpoint + "/" + id,
            responseType: "json"
        });
    }
}

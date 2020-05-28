import { baseURL } from "../config";
import { Http } from "./http.service";
import { Profile } from "../models/profile";

const endpoint = baseURL + "/profiles";

export namespace ProfileService {
    export function get(id: string | null | undefined, silent?: boolean) {
        return Http.request<Profile>({
            url: id ? endpoint + "/" + id : endpoint,
            responseType: "json",
            silent
        });
    }
}

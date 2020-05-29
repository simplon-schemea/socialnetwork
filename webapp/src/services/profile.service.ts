import { baseURL } from "../config";
import { Http } from "./http.service";
import { Profile } from "@models/profile";
import { UUID } from "@models/types";

const endpoint = baseURL + "/profiles";

export namespace ProfileService {
    export function get(id: UUID | null | undefined, silent?: boolean) {
        return Http.request<Profile>({
            url: id ? endpoint + "/" + id : endpoint,
            responseType: "json",
            silent,
        });
    }
}

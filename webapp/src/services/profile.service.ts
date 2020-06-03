import { baseURL } from "../config";
import { Http } from "./http.service";
import { UUID } from "@models/types";
import { ProfileResource } from "@models/resources/profile-resource";

const endpoint = baseURL + "/profiles";

export namespace ProfileService {
    export function get(id: UUID | null | undefined, silent?: boolean) {
        return Http.request<ProfileResource>({
            url: id ? endpoint + "/" + id : endpoint,
            responseType: "json",
            silent,
        });
    }
}

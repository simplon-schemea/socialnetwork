import { baseURL } from "../config";
import { UUID } from "@models/types";
import { ProfileResource } from "@models/resources/profile-resource";
import { HttpClient } from "../http/client";

const endpoint = baseURL + "/profiles";

export class ProfileService {
    constructor(public readonly http: HttpClient) {}

    get(id: UUID | null | undefined, silent?: boolean) {
        return this.http.request<ProfileResource>({
            url: id ? endpoint + "/" + id : endpoint,
            responseType: "json",
            silent,
        });
    }
}

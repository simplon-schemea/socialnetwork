import { PersistentStorage } from "../storage/persistent-storage";
import { Request } from "./request";
import { makeLoadEndHandler } from "./handlers";
import { Store } from "redux";
import { History, LocationState } from "history";


export function extractUUID(url: string) {
    const match = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.exec(url);
    return match?.[0];
}

export class HttpClient {
    constructor(public readonly store: Store, public readonly history: History<LocationState>) {}

    request(req: string): Promise<string>;
    request(req: Request): Promise<unknown>;
    request(req: Request & { responseType: "text" | undefined | null }): Promise<string>;
    request<T extends string>(req: Request & { responseType: "text" | undefined | null }): Promise<T>;
    request<T>(req: Request & { responseType: "json" }): Promise<T>;

    request<T>(req: Request | string) {
        return new Promise<T>((resolve, reject) => {
            if (typeof req === "string") {
                req = { url: req };
            }

            let url = req.url;

            if (req.params) {
                const searchParams = Object.entries(req.params)
                    .map(([ k, v ]) => `${ k }=${ v }`)
                    .join("&");

                url += (url.includes("?") ? "&" : "?") + searchParams;
            }

            const xhr    = new XMLHttpRequest();
            let body     = req.body;
            const method = req.method || (req.body ? "POST" : "GET");

            xhr.open(method, url);

            xhr.withCredentials = true;
            xhr.onloadend       = makeLoadEndHandler(this, xhr, req, resolve, reject);

            if (req.responseType) {
                xhr.responseType = req.responseType;
            }

            if (req.headers) {
                for (const [ key, value ] of Object.entries(req.headers)) {
                    xhr.setRequestHeader(key, value);
                }
            }

            {
                const token = PersistentStorage.get("token");

                if (token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                }
            }

            if (body && typeof body !== "string") {
                xhr.setRequestHeader("Content-Type", "application/json");
                body = JSON.stringify(req.body);
            }

            xhr.send(body);
        });
    }
}


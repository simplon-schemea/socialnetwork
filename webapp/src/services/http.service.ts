import { isBackendError } from "@models/backend-error";
import { actions } from "@store/actions";
import { store } from "@store";
import { StringMap } from "@models/types";
import { PersistentStorage } from "../storage/persistent-storage";
import { InfoBannerType } from "@models/info-banner-type";


export namespace Http {

    export interface Request {
        url: string
        method?: "GET" | "POST"
        body?: any
        headers?: StringMap
        responseType?: XMLHttpRequest["responseType"]
        silent?: boolean
        followRedirect?: boolean
        params?: StringMap
    }


    function onsuccess(this: XMLHttpRequest, request: Request, resolve: (value: any) => void, reject: Function) {
        function notify(type: InfoBannerType, msg: string, forced?: boolean) {
            if (!request.silent || forced) {
                store.dispatch(actions.setInfoBannerMessage(type, msg));
            }
        }

        try {
            if (request.followRedirect) {
                const location = this.getResponseHeader("Location");

                if (location) {
                    Http.request({
                        method: "GET",
                        url: location,
                        followRedirect: request.followRedirect,
                        silent: request.silent,
                    }).then(resolve);

                    return;
                }
            }

            resolve(this.response);
        } catch (e) {
            console.error(e);
            notify("error", "Unknown error", true);
            reject(this);
        }
    }

    function onerror(this: XMLHttpRequest, request: Request, reject: Function) {
        function notify(type: InfoBannerType, msg: string, forced?: boolean) {
            if (!request.silent || forced) {
                store.dispatch(actions.setInfoBannerMessage(type, msg));
            }
        }

        const body   = this.response;
        const errors = typeof body === "string" ? JSON.parse(body) : body;

        if (isBackendError(errors)) {
            notify("error", `${ errors.error }: ${ errors.message }`);
            reject(errors);
        } else {
            notify("error", "Unknown error");
            reject(this);
        }
        switch (this.status) {
            case  401:
                PersistentStorage.remove("token");
                notify("error", "Unauthorized");
                reject(this);
                break;
            case 403:
                notify("error", "Forbidden");
                reject(this);
                break;
            default:
                break;
        }
    }

    export function request(req: string): Promise<string>;
    export function request(req: Request): Promise<unknown>;
    export function request(req: Request & { responseType: "text" | undefined | null }): Promise<string>;
    export function request<T extends string>(req: Request & { responseType: "text" | undefined | null }): Promise<T>;
    export function request<T>(req: Request & { responseType: "json" }): Promise<T>;
    export function request<T>(req: Request | string) {
        return new Promise<T>(function (resolve, reject) {
            if (typeof req === "string") {
                req = { url: req };
            }

            let url = req.url;

            if (req.params) {
                const searchParams = Object.entries(req.params)
                    .map(([k,v]) => `${k}=${v}`)
                    .join("&");

                url += (url.includes("?") ? "&" : "?") + searchParams;
            }

            const xhr    = new XMLHttpRequest();
            let body     = req.body;
            const method = req.method || (req.body ? "POST" : "GET");

            xhr.open(method, url);

            xhr.withCredentials = true;

            xhr.onloadend = function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    onsuccess.call(xhr, req as Request, resolve, reject);
                } else {
                    onerror.call(xhr, req as Request, reject);
                }
            };

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

    export function extractUUID(url: string) {
        const match = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.exec(url);
        return match?.[0];
    }
}

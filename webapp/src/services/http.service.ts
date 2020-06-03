import { isBackendError } from "@models/backend-error";
import { actions } from "@store/actions";
import { store } from "@store";
import { StringMap } from "@models/types";


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

    function onload(this: XMLHttpRequest, request: Request, resolve: (value: any) => void, reject: Function) {
        try {
            const body = this.response;

            if (this.status >= 200 && this.status < 400) {
                if (request.followRedirect) {
                    const location = this.getResponseHeader("Location");

                    if (location) {
                        Http.request({
                            ...request,
                            method: "GET",
                            url: location,
                        }).then(resolve);

                        return;
                    }
                }

                resolve(this.response);
            } else {
                const errors = typeof body === "string" ? JSON.parse(body) : body;

                if (isBackendError(errors)) {
                    if (!request.silent) {
                        store.dispatch(actions.setInfoBannerMessage("error", `${ errors.error }: ${ errors.message }`));
                    }

                    reject(errors);
                } else {
                    store.dispatch(actions.setInfoBannerMessage("error", "Unknown error"));
                    reject(this);
                }
            }
        } catch (e) {
            console.error(e);
            store.dispatch(actions.setInfoBannerMessage("error", "Unknown error"));
            reject(this);
        }
    }

    export function csrf() {
        const cookies = document.cookie
            .split(";")
            .map(x => x.split("=").map(x => x.trim()))
            .reduce((prev, [ key, value ]) => Object.assign(prev, { [key]: value }), {} as StringMap);

        return cookies["XSRF-TOKEN"];
    }

    export function request(req: string): Promise<string>;
    export function request(req: Request): Promise<unknown>;
    export function request(req: Request & { responseType: "text" | undefined | null }): Promise<string>;
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

            xhr.onload          = onload.bind(xhr, req, resolve, reject);
            xhr.onerror         = reject;
            xhr.withCredentials = true;

            if (req.responseType) {
                xhr.responseType = req.responseType;
            }

            if (req.headers) {
                for (const [ key, value ] of Object.entries(req.headers)) {
                    xhr.setRequestHeader(key, value);
                }
            }

            {
                const token = csrf();

                if (token) {
                    xhr.setRequestHeader("X-XSRF-TOKEN", token);
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

import { isBackendError } from "../models/backend-error";
import { actions } from "../store/actions";
import { store } from "../store";


export namespace Http {
    export interface Request {
        method?: "GET" | "POST",
        url: string,
        body?: any,
        headers?: { [k: string]: string },
        responseType?: XMLHttpRequest["responseType"];
        silent?: boolean;
        followRedirect?: boolean;
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
                    reject(this);
                }
            }
        } catch (e) {
            console.error(e);
            reject(this);
        }
    }

    export function csrf() {
        const cookies = document.cookie
            .split(";")
            .map(x => x.split("=").map(x => x.trim()))
            .reduce((prev, [ key, value ]) => Object.assign(prev, { [key]: value }), {} as { [k: string]: string });

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

            const xhr    = new XMLHttpRequest();
            let body     = req.body;
            const method = req.method || (req.body ? "POST" : "GET");

            xhr.open(method, req.url);

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

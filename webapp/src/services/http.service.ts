import { isBackendError } from "../models/backend-error";
import { actions } from "../store/actions";
import { store } from "../store";

function onload(this: XMLHttpRequest, resolve: Function, reject: Function) {
    try {
        const body = this.response;

        if (this.status >= 200 && this.status < 400) {
            resolve(this.response);
        } else {
            const errors = typeof body === "string" ? JSON.parse(body) : body;

            if (isBackendError(errors)) {
                store.dispatch(actions.setInfoBannerMessage("error", `${ errors.error }: ${ errors.message }`));
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

export namespace Http {
    export interface Request {
        method?: "GET" | "POST",
        url: string,
        body?: any,
        headers?: { [k: string]: string },
        responseType?: XMLHttpRequest["responseType"];
    }

    export function request<T>(req: Request & { responseType: "json" }): Promise<T>;
    export function request<T>(req: Request & { responseType: "text" | undefined | null }): Promise<string>;
    export function request<T>(req: Request): Promise<unknown>;
    export function request<T>(req: Request) {
        return new Promise<T>(function (resolve, reject) {
            const xhr    = new XMLHttpRequest();
            let body     = req.body;
            const method = req.method || (req.body ? "POST" : "GET");

            xhr.open(method, req.url);

            xhr.onload          = onload.bind(xhr, resolve, reject);
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

            if (body && typeof body !== "string") {
                xhr.setRequestHeader("Content-Type", "application/json");
                body = JSON.stringify(req.body);
            }

            xhr.send(body);
        });
    }
}

import { isBackendError } from "../models/backend-error";
import { actions } from "../store/actions";
import { store } from "../store";

export namespace Http {
    export interface Request {
        method?: "GET" | "POST",
        url: string,
        body?: any,
        headers?: { [k: string]: string }
    }

    export function request(req: Request) {
        return new Promise(function (resolve, reject) {
                const xhr = new XMLHttpRequest();
                let body  = req.body;

                xhr.open(req.method || "GET", req.url);

                xhr.onload = function () {
                    try {
                        const body = JSON.parse(xhr.responseText);

                        if (xhr.status >= 200 && xhr.status < 400) {
                            resolve(xhr.responseText);
                        } else {
                            if (isBackendError(body)) {
                                store.dispatch(actions.setInfoBannerMessage("error", `${ body.error }: ${ body.message }`));
                                reject(body);
                            } else {
                                reject(xhr);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                        reject(xhr);
                    }
                };

                xhr.onerror = reject;

                xhr.withCredentials = true;

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
            },
        );
    }
}

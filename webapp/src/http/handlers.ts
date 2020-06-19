import { Request } from "./request";
import { InfoBannerType } from "@models/info-banner-type";
import { actions } from "@store/actions";
import { PersistentStorage } from "../storage/persistent-storage";
import { isBackendError } from "@models/backend-error";
import { HttpClient } from "./client";

export function onsuccess(http: HttpClient, xhr: XMLHttpRequest, request: Request, resolve: (value: any) => void, reject: Function) {
    function notify(type: InfoBannerType, msg: string, forced?: boolean) {
        if (!request.silent || forced) {
            http.store.dispatch(actions.setInfoBannerMessage(type, msg));
        }
    }

    try {
        if (request.followRedirect) {
            const location = xhr.getResponseHeader("Location");

            if (location) {
                http.request({
                    method: "GET",
                    url: location,
                    followRedirect: request.followRedirect,
                    silent: request.silent,
                }).then(resolve);

                return;
            }
        }

        resolve(xhr.response);
    } catch (e) {
        console.error(e);
        notify("error", "Unknown error", true);
        reject(xhr);
    }
}

export function onerror(http: HttpClient, xhr: XMLHttpRequest, request: Request, reject: Function) {
    function notify(type: InfoBannerType, msg: string, forced?: boolean) {
        if (!request.silent || forced) {
            http.store.dispatch(actions.setInfoBannerMessage(type, msg));
        }
    }

    const body = xhr.response;

    switch (xhr.status) {
        case  401:
            PersistentStorage.remove("token");
            notify("error", "Unauthorized");
            http.history.push("/login");
            reject(xhr);
            break;
        case 403:
            notify("error", "Forbidden");
            reject(xhr);
            break;
        default:
            const errors = typeof body === "string" ? JSON.parse(body) : body;

            if (isBackendError(errors)) {
                notify("error", `${ errors.error }: ${ errors.message }`);
                reject(errors);
            } else {
                notify("error", "Unknown error");
                reject(xhr);
            }

            break;
    }
}

export function makeLoadEndHandler(http: HttpClient, xhr: XMLHttpRequest, req: Request, resolve: (value: any) => void, reject: (reason?: any) => void) {
    return function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            onsuccess(http, xhr, req as Request, resolve, reject);
        } else {
            onerror(http, xhr, req as Request, reject);
        }
    };
}

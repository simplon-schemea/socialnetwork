import { StringMap } from "@models/types";

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

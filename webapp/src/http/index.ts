import { createContext, createElement, PropsWithChildren } from "react";
import { HttpClient } from "./client";
import { useHistory } from "react-router";
import { useStore } from "react-redux";

export const HttpContext = createContext<HttpClient>(null as any);
HttpContext.displayName  = "http";

export function HttpProvider(props: PropsWithChildren<{}>) {
    const history = useHistory();
    const store   = useStore();

    return createElement(HttpContext.Provider, { value: new HttpClient(store, history), children: props.children });
}

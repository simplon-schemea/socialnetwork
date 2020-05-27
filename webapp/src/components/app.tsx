import React from "react";
import { Login } from "./login";
import { BrowserRouter, Route } from "react-router-dom";
import { Register } from "./register";
import { Provider } from "react-redux";
import { store } from "../store";
import { InfoBanner } from "./info-banner";

export function App() {
    return (
        <Provider store={ store }>
            <InfoBanner/>
            <main>
                <BrowserRouter>
                    <Route path="/login" exact={ true }>
                        <Login/>
                    </Route>
                    <Route path="/register" exact={ true }>
                        <Register/>
                    </Route>
                </BrowserRouter>
            </main>
        </Provider>
    );
}
